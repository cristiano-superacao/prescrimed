import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Usuario, Empresa } from '../models/index.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
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
        role: usuario.role,
        empresaId: usuario.empresaId,
        empresa: usuario.empresa
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
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
      // Cria empresa com tipoSistema (inclui fisioterapia)
      const empresa = await Empresa.create({
        nome: nomeEmpresa,
        tipoSistema: tipoSistema || 'casa-repouso',
        cnpj,
        email, // opcionalmente usa o mesmo email como contato da empresa
        telefone: contato
      });

      const adminNome = nomeAdmin || nomeUsuario || 'Administrador';

      const usuario = await Usuario.create({
        nome: adminNome,
        email,
        senha: senhaHash,
        role: 'admin',
        empresaId: empresa.id,
        cpf,
        contato
      });

      return res.status(201).json({
        message: 'Empresa e usuário administrador criados com sucesso',
        empresa: { id: empresa.id, nome: empresa.nome, tipoSistema: empresa.tipoSistema },
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
