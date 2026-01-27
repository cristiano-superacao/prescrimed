import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sequelize, Usuario, Empresa } from '../models/index.js';
import { ensureValidCPF, ensureValidCNPJ } from '../utils/brDocuments.js';

const router = express.Router();

function checkEmpresaAccessForUser(usuario) {
  if (!usuario) return null;
  if (usuario.role === 'superadmin') return null;
  const empresa = usuario.empresa;
  if (!empresa || empresa.ativo === false) {
    return {
      status: 403,
      code: 'empresa_inativa',
      error: 'Empresa bloqueada ou inativa. Entre em contato com o suporte.'
    };
  }
  if (empresa.emTeste && empresa.testeFim) {
    const fim = new Date(empresa.testeFim);
    if (!Number.isNaN(fim.getTime()) && new Date() > fim) {
      return {
        status: 403,
        code: 'trial_expired',
        error: 'Período de teste vencido. Entre em contato com o administrador para prorrogar ou ativar um plano.',
        details: { testeFim: empresa.testeFim }
      };
    }
  }
  return null;
}

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Verifica se o JWT_SECRET está configurado
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET não configurado!');
      return res.status(500).json({ 
        error: 'Servidor mal configurado. Contate o administrador.',
        details: 'JWT_SECRET não definido'
      });
    }

    const usuario = await Usuario.findOne({ 
      where: { email },
      include: [{ model: Empresa, as: 'empresa' }]
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    if (!usuario.ativo) {
      return res.status(403).json({ error: 'Usuário inativo' });
    }

    // Bloqueio por empresa inativa ou teste vencido (não afeta superadmin)
    const accessBlock = checkEmpresaAccessForUser(usuario);
    if (accessBlock) {
      return res.status(accessBlock.status).json({
        error: accessBlock.error,
        code: accessBlock.code,
        details: accessBlock.details
      });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, role: usuario.role, empresaId: usuario.empresaId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.SESSION_TIMEOUT || '8h' }
    );

    res.json({
      token,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.contato || null,
        especialidade: usuario.especialidade || null,
        crm: usuario.crm || null,
        crmUf: usuario.crmUf || null,
        permissoes: usuario.permissoes || [],
        role: usuario.role,
        empresaId: usuario.empresaId,
        empresa: usuario.empresa
      }
    });
  } catch (error) {
    console.error('❌ Erro no login:', error);
    
    // Erro de conexão com banco de dados
    if (error.name === 'SequelizeConnectionError' || error.name === 'SequelizeConnectionRefusedError') {
      return res.status(503).json({ 
        error: 'Banco de dados temporariamente indisponível. Tente novamente em alguns instantes.',
        details: 'Database connection error'
      });
    }
    
    // Erro de tabela não encontrada
    if (error.name === 'SequelizeDatabaseError' && error.message.includes('relation') && error.message.includes('does not exist')) {
      console.error('❌ Tabela não existe no banco! Execute as migrações primeiro.');
      return res.status(503).json({ 
        error: 'Sistema em manutenção. Aguarde a configuração inicial.',
        details: 'Database tables not created'
      });
    }
    
    // Outros erros
    return res.status(500).json({ 
      error: 'Erro ao fazer login. Tente novamente.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Registro / Onboarding
// Suporta dois fluxos:
// 1) Onboarding completo: cria Empresa e o usuário admin (campos: tipoSistema, nomeEmpresa, cnpj, nomeAdmin/nomeUsuario, email, senha, cpf, contato)
// 2) Registro de usuário em empresa existente: nome, email, senha, role, empresaId
router.post('/register', async (req, res) => {
  try {
    const {
      // Fluxo onboarding
      tipoSistema,
      nomeEmpresa,
      cnpj,
      nomeAdmin,
      nomeUsuario,
      cpf,
      contato,
      // Comuns
      email,
      senha,
      // Fluxo existente
      role,
      empresaId
    } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ 
        error: 'Email e senha são obrigatórios',
        details: { email: !email ? 'required' : 'ok', senha: !senha ? 'required' : 'ok' }
      });
    }

    const isOnboarding = nomeEmpresa && nomeEmpresa.trim().length > 0;
    if (!isOnboarding && !empresaId) {
      return res.status(400).json({ 
        error: 'Para registro, é necessário informar nomeEmpresa (onboarding) ou empresaId (usuário em empresa existente)',
        isOnboarding: false,
        hasEmpresaId: !!empresaId
      });
    }

    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    // Se houver nomeEmpresa, executa onboarding completo
    if (nomeEmpresa && typeof nomeEmpresa === 'string' && nomeEmpresa.trim().length > 0) {
      // Valida documentos (somente dígitos no banco)
      let cnpjDigits = null;
      let cpfDigits = null;
      try {
        cnpjDigits = ensureValidCNPJ(cnpj);
        cpfDigits = ensureValidCPF(cpf);
      } catch (e) {
        return res.status(400).json({ error: e.message || 'Documento inválido', field: e.field });
      }

      if (!cnpjDigits) {
        return res.status(400).json({ error: 'CNPJ é obrigatório' });
      }
      if (!cpfDigits) {
        return res.status(400).json({ error: 'CPF é obrigatório' });
      }

      // Cria empresa com tipoSistema (inclui fisioterapia)
      const { empresa, usuario } = await sequelize.transaction(async (t) => {
        const empresa = await Empresa.create(
          {
            nome: nomeEmpresa,
            tipoSistema: tipoSistema || 'casa-repouso',
            cnpj: cnpjDigits,
            email, // opcionalmente usa o mesmo email como contato da empresa
            telefone: contato
          },
          { transaction: t }
        );

        const adminNome = nomeAdmin || nomeUsuario || 'Administrador';

        const usuario = await Usuario.create(
          {
            nome: adminNome,
            email,
            senha: senhaHash,
            role: 'admin',
            empresaId: empresa.id,
            cpf: cpfDigits,
            contato
          },
          { transaction: t }
        );

        return { empresa, usuario };
      });

      return res.status(201).json({
        message: 'Empresa e usuário administrador criados com sucesso',
        empresa: { id: empresa.id, nome: empresa.nome, tipoSistema: empresa.tipoSistema, codigo: empresa.codigo },
        usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, role: usuario.role }
      });
    }

    // Caso contrário, cria apenas usuário em empresa existente
    const usuario = await Usuario.create({
      nome: req.body.nome || nomeUsuario || 'Usuário',
      email,
      senha: senhaHash,
      role: role || 'atendente',
      empresaId
    });

    res.status(201).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

// Renovar token (refresh)
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    // Se não houver refreshToken, tenta usar o token atual
    const token = refreshToken || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
      // Verifica o token (mesmo que expirado, decode para pegar o ID)
      const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
      
      // Busca o usuário
      const usuario = await Usuario.findByPk(decoded.id, {
        include: [{ model: Empresa, as: 'empresa' }]
      });

      if (!usuario || !usuario.ativo) {
        return res.status(401).json({ error: 'Usuário inválido ou inativo' });
      }

      // Bloqueio por empresa inativa ou teste vencido (não afeta superadmin)
      const accessBlock = checkEmpresaAccessForUser(usuario);
      if (accessBlock) {
        return res.status(accessBlock.status).json({
          error: accessBlock.error,
          code: accessBlock.code,
          details: accessBlock.details
        });
      }

      // Gera novo token
      const newToken = jwt.sign(
        { id: usuario.id, email: usuario.email, role: usuario.role, empresaId: usuario.empresaId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.SESSION_TIMEOUT || '8h' }
      );

      res.json({
        token: newToken,
        user: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          telefone: usuario.contato || null,
          especialidade: usuario.especialidade || null,
          crm: usuario.crm || null,
          crmUf: usuario.crmUf || null,
          permissoes: usuario.permissoes || [],
          role: usuario.role,
          empresaId: usuario.empresaId,
          empresa: usuario.empresa
        }
      });
    } catch (jwtError) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    res.status(500).json({ error: 'Erro ao renovar token' });
  }
});

// Verificar token
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findByPk(decoded.id, {
      include: [{ model: Empresa, as: 'empresa' }],
      attributes: { exclude: ['senha'] }
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
});

export default router;
