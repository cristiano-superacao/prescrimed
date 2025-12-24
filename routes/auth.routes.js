import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import Empresa from '../models/Empresa.js';
import Usuario from '../models/Usuario.js';

const router = express.Router();

// Validações
const registerValidation = [
  body('nomeEmpresa').trim().notEmpty().withMessage('Nome da empresa é obrigatório'),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('senha').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
  body('nomeAdmin').trim().notEmpty().withMessage('Nome do administrador é obrigatório'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('senha').notEmpty().withMessage('Senha é obrigatória'),
];

// POST /api/auth/register - Registrar nova empresa e administrador
router.post('/register', registerValidation, async (req, res) => {
  try {
    // Validar erros
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Erros de validação no registro:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      tipoSistema, 
      nomeEmpresa, 
      cnpj, 
      email, 
      senha, 
      nomeAdmin, 
      telefone, 
      cpf, 
      contato 
    } = req.body;

    // Verificar se email já existe
    const usuarioExistente = await Usuario.findByEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Verificar se CNPJ já existe (se fornecido)
    if (cnpj) {
      const empresaExistente = await Empresa.findByCnpj(cnpj);
      if (empresaExistente) {
        return res.status(400).json({ error: 'CNPJ já cadastrado' });
      }
    }

    // Criar empresa
    const empresa = await Empresa.create({
      nome: nomeEmpresa,
      cnpj: cnpj || null,
      email,
      telefone: contato || telefone || null,
      tipoSistema: tipoSistema || 'casa-repouso',
    });

    // Criar usuário administrador
    const usuario = await Usuario.create({
      empresaId: empresa.id,
      nome: nomeAdmin,
      email,
      senha,
      cpf: cpf || null,
      telefone: contato || telefone || null,
      role: 'admin',
      permissoes: ['dashboard', 'prescricoes', 'pacientes', 'usuarios', 'configuracoes'],
    });

    // Atualizar empresa com ID do admin
    await Empresa.update(empresa.id, { adminUserId: usuario.id });

    // Gerar token JWT
    const token = jwt.sign(
      { 
        userId: usuario.id, 
        empresaId: empresa.id,
        role: 'admin',
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.SESSION_TIMEOUT || '8h' }
    );

    res.status(201).json({
      message: 'Empresa e usuário criados com sucesso',
      token,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
        permissoes: usuario.permissoes,
        empresaId: empresa.id,
        empresaNome: empresa.nome,
      },
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro ao criar empresa e usuário' });
  }
});

// POST /api/auth/login - Login
router.post('/login', loginValidation, async (req, res) => {
  try {
    // Validar erros
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, senha } = req.body;

    // Buscar usuário com senha
    const usuario = await Usuario.findByEmailWithPassword(email);
    if (!usuario) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Verificar se usuário está ativo
    if (usuario.status !== 'ativo') {
      return res.status(403).json({ error: 'Usuário inativo. Contate o administrador.' });
    }

    // Verificar senha
    const senhaValida = await Usuario.verifyPassword(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Buscar dados da empresa
    const empresa = await Empresa.findById(usuario.empresaId);
    if (!empresa || empresa.status !== 'ativo') {
      return res.status(403).json({ error: 'Empresa inativa ou não encontrada' });
    }

    // Atualizar último acesso
    await Usuario.updateLastAccess(usuario.id);

    // Gerar token JWT
    const token = jwt.sign(
      { 
        userId: usuario.id, 
        empresaId: usuario.empresaId,
        role: usuario.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.SESSION_TIMEOUT || '8h' }
    );

    // Remover senha do objeto
    const { senha: _, ...usuarioSemSenha } = usuario;

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
        permissoes: usuario.permissoes || [],
        empresaId: usuario.empresaId,
        empresaNome: empresa.nome,
        telefone: usuario.telefone,
        especialidade: usuario.especialidade,
        crm: usuario.crm,
        status: usuario.status,
      },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao realizar login' });
  }
});

// POST /api/auth/refresh - Renovar token
router.post('/refresh', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    // Verificar token (mesmo expirado)
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });

    // Buscar usuário
    const usuario = await Usuario.findById(decoded.userId);
    if (!usuario || usuario.status !== 'ativo') {
      return res.status(401).json({ error: 'Usuário não encontrado ou inativo' });
    }

    // Gerar novo token
    const newToken = jwt.sign(
      { 
        userId: usuario.id, 
        empresaId: usuario.empresaId,
        role: usuario.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.SESSION_TIMEOUT || '8h' }
    );

    res.json({
      message: 'Token renovado com sucesso',
      token: newToken,
    });
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
});

export default router;