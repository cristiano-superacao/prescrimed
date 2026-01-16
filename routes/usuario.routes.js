import express from 'express';
import { body } from 'express-validator';
import { authenticate, isAdmin } from '../middleware/auth.middleware.js';
import Usuario from '../models/Usuario.js';
import Empresa from '../models/Empresa.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { sendError } from '../utils/error.js';

const router = express.Router();

const handleUsuarioNotFound = (res) => res.status(404).json({ error: 'Usuário não encontrado' });
const handleAccessDenied = (res) => res.status(403).json({ error: 'Acesso negado' });

const findUsuarioByIdForEmpresa = async (id, req, res) => {
  const usuario = await Usuario.findById(id);
  if (!usuario) {
    handleUsuarioNotFound(res);
    return null;
  }

  if (usuario.empresaId !== req.user.empresaId) {
    handleAccessDenied(res);
    return null;
  }

  return usuario;
};

// Todas as rotas requerem autenticação
router.use(authenticate);

// GET /api/usuarios - Listar usuários da empresa
router.get('/', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const usuarios = await Usuario.findByEmpresa(
      req.user.empresaId,
      parseInt(limit),
      parseInt(offset)
    );

    const total = await Usuario.countByEmpresa(req.user.empresaId);

    res.json({
      usuarios,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    return sendError(res, 500, 'Erro ao listar usuários', error);
  }
});

// GET /api/usuarios/me - Buscar dados do próprio usuário
router.get('/me', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.user.id);

    if (!usuario) {
      return handleUsuarioNotFound(res);
    }

    res.json(usuario);
  } catch (error) {
    return sendError(res, 500, 'Erro ao buscar dados do usuário', error);
  }
});

// GET /api/usuarios/me/summary - Resumo para cards de configurações
router.get('/me/summary', async (req, res) => {
  try {
    const [usuario, empresa] = await Promise.all([
      Usuario.findById(req.user.id).lean(),
      Empresa.findById(req.user.empresaId).lean(),
    ]);

    if (!usuario) {
      return handleUsuarioNotFound(res);
    }

    const pendingSecurityTasks = [];
    let securityScore = 1;

    if (!usuario.telefone) {
      securityScore -= 0.2;
      pendingSecurityTasks.push('Adicione um telefone de contato.');
    }

    if (!usuario.crm && usuario.role !== 'admin') {
      securityScore -= 0.25;
      pendingSecurityTasks.push('Informe um CRM válido para emitir prescrições.');
    }

    if (!usuario.especialidade) {
      securityScore -= 0.15;
      pendingSecurityTasks.push('Defina a especialidade principal.');
    }

    securityScore = Math.max(0.4, Number(securityScore.toFixed(2)));

    const planLabels = {
      basico: 'Básico',
      premium: 'Premium',
      enterprise: 'Enterprise',
    };

    const planDescriptions = {
      basico: 'Recursos essenciais para prescrição digital.',
      premium: 'Suporte prioritário e integrações liberadas.',
      enterprise: 'Escala empresarial com SLAs dedicados.',
    };

    const planoAtual = empresa?.plano || 'basico';

    res.json({
      lastUpdate: usuario.updatedAt,
      securityScore,
      plan: planoAtual,
      planLabel: planLabels[planoAtual] || planoAtual,
      planDescription: planDescriptions[planoAtual] || '',
      pendingSecurityTasks,
    });
  } catch (error) {
    return sendError(res, 500, 'Erro ao buscar resumo', error);
  }
});

// PUT /api/usuarios/me - Atualizar dados do próprio usuário
router.put('/me', [
  body('nome').optional().trim().notEmpty().withMessage('Nome não pode ficar vazio'),
  body('email').optional().isEmail().withMessage('Email inválido').normalizeEmail(),
  validateRequest,
], async (req, res) => {
  try {
    const { nome, email, telefone, especialidade, crm } = req.body;

    const updateData = {};
    if (typeof nome !== 'undefined') updateData.nome = nome;
    if (typeof telefone !== 'undefined') updateData.telefone = telefone;
    if (typeof especialidade !== 'undefined') updateData.especialidade = especialidade;
    if (typeof crm !== 'undefined') updateData.crm = crm;

    if (typeof email !== 'undefined') {
      const existingUser = await Usuario.findByEmail(email);
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(400).json({ error: 'Email já está em uso' });
      }
      updateData.email = email;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'Nenhuma alteração fornecida' });
    }

    const usuarioAtualizado = await Usuario.update(req.user.id, updateData);

    res.json({
      message: 'Perfil atualizado com sucesso',
      usuario: usuarioAtualizado,
    });
  } catch (error) {
    return sendError(res, 500, 'Erro ao atualizar perfil', error);
  }
});

// GET /api/usuarios/:id - Buscar usuário por ID
router.get('/:id', async (req, res) => {
  try {
    const usuario = await findUsuarioByIdForEmpresa(req.params.id, req, res);
    if (!usuario) return;

    res.json(usuario);
  } catch (error) {
    return sendError(res, 500, 'Erro ao buscar usuário', error);
  }
});

// POST /api/usuarios - Criar novo usuário (apenas admin)
router.post('/', isAdmin, [
  body('nome').trim().notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('senha').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
  body('role').isIn(['admin', 'usuario']).withMessage('Role inválido'),
  body('permissoes').optional().isArray().withMessage('Permissões devem ser um array'),
  validateRequest,
], async (req, res) => {
  try {
    const { nome, email, senha, role, crm, especialidade, telefone, permissoes } = req.body;

    // Verificar se email já existe
    const usuarioExistente = await Usuario.findByEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Verificar limite de usuários
    const empresa = await Empresa.findById(req.user.empresaId);
    const totalUsuarios = await Usuario.countByEmpresa(req.user.empresaId);
    
    if (totalUsuarios >= empresa.configuracoes.limiteUsuarios) {
      return res.status(403).json({ 
        error: `Limite de usuários atingido (${empresa.configuracoes.limiteUsuarios}). Faça upgrade do plano.` 
      });
    }

    // Criar usuário
    const usuario = await Usuario.create({
      empresaId: req.user.empresaId,
      nome,
      email,
      senha,
      role: role || 'usuario',
      crm: crm || null,
      especialidade: especialidade || null,
      telefone: telefone || null,
      permissoes: permissoes || ['dashboard', 'prescricoes', 'pacientes'],
    });

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      usuario,
    });
  } catch (error) {
    return sendError(res, 500, 'Erro ao criar usuário', error);
  }
});

// PUT /api/usuarios/:id - Atualizar usuário
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, crm, especialidade, telefone, role, permissoes, status } = req.body;

    const usuario = await findUsuarioByIdForEmpresa(id, req, res);
    if (!usuario) return;

    // Não permitir alterar o próprio role
    if (id === req.user.id && role && role !== usuario.role) {
      return res.status(403).json({ error: 'Você não pode alterar seu próprio role' });
    }

    const updateData = {};
    if (nome) updateData.nome = nome;
    if (email) updateData.email = email;
    if (crm) updateData.crm = crm;
    if (especialidade) updateData.especialidade = especialidade;
    if (telefone) updateData.telefone = telefone;
    if (role) updateData.role = role;
    if (permissoes) updateData.permissoes = permissoes;
    if (status) updateData.status = status;

    const usuarioAtualizado = await Usuario.update(id, updateData);

    res.json({
      message: 'Usuário atualizado com sucesso',
      usuario: usuarioAtualizado,
    });
  } catch (error) {
    return sendError(res, 500, 'Erro ao atualizar usuário', error);
  }
});

// PUT /api/usuarios/:id/permissoes - Atualizar permissões do usuário
router.put('/:id/permissoes', isAdmin, [
  body('permissoes').isArray().withMessage('Permissões devem ser um array'),
  validateRequest,
], async (req, res) => {
  try {
    const { id } = req.params;
    const { permissoes } = req.body;

    const usuario = await findUsuarioByIdForEmpresa(id, req, res);
    if (!usuario) return;

    const usuarioAtualizado = await Usuario.updatePermissions(id, permissoes);

    res.json({
      message: 'Permissões atualizadas com sucesso',
      usuario: usuarioAtualizado,
    });
  } catch (error) {
    return sendError(res, 500, 'Erro ao atualizar permissões', error);
  }
});

// PUT /api/usuarios/:id/senha - Alterar senha do usuário
router.put('/:id/senha', [
  body('senhaAtual').if(() => req.user.role !== 'admin').notEmpty().withMessage('Senha atual é obrigatória'),
  body('novaSenha').isLength({ min: 6 }).withMessage('Nova senha deve ter no mínimo 6 caracteres'),
  validateRequest,
], async (req, res) => {
  try {
    const { id } = req.params;
    const { senhaAtual, novaSenha } = req.body;

    // Apenas o próprio usuário ou admin pode alterar senha
    if (id !== req.user.id && req.user.role !== 'admin') {
      return handleAccessDenied(res);
    }

    const usuarioBase = await findUsuarioByIdForEmpresa(id, req, res);
    if (!usuarioBase) return;

    const usuario = await Usuario.findByEmailWithPassword(usuarioBase.email);
    if (!usuario) {
      return handleUsuarioNotFound(res);
    }

    // Se não for admin, verificar senha atual
    if (req.user.role !== 'admin') {
      const senhaValida = await Usuario.verifyPassword(senhaAtual, usuario.senha);
      if (!senhaValida) {
        return res.status(401).json({ error: 'Senha atual incorreta' });
      }
    }

    // Atualizar senha
    await Usuario.update(id, { senha: novaSenha });

    res.json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    return sendError(res, 500, 'Erro ao alterar senha', error);
  }
});

// DELETE /api/usuarios/:id - Deletar usuário (soft delete)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Não permitir deletar a si mesmo
    if (id === req.user.id) {
      return res.status(403).json({ error: 'Você não pode deletar sua própria conta' });
    }

    const usuario = await findUsuarioByIdForEmpresa(id, req, res);
    if (!usuario) return;

    await Usuario.delete(id);

    res.json({ message: 'Usuário desativado com sucesso' });
  } catch (error) {
    return sendError(res, 500, 'Erro ao deletar usuário', error);
  }
});

export default router;