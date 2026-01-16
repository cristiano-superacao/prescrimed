import express from 'express';
import { body } from 'express-validator';
import { authenticate, isAdmin, isSuperAdmin } from '../middleware/auth.middleware.js';
import Empresa from '../models/Empresa.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { sendError } from '../utils/error.js';

const router = express.Router();

const findEmpresaByIdOr404 = async (id, res) => {
  const empresa = await Empresa.findById(id);
  if (!empresa) {
    res.status(404).json({ error: 'Empresa não encontrada' });
    return null;
  }
  return empresa;
};

// Todas as rotas requerem autenticação
router.use(authenticate);

// GET /api/empresas - Listar todas as empresas (Super Admin)
router.get('/', isSuperAdmin, async (req, res) => {
  try {
    const empresas = await Empresa.find().sort({ createdAt: -1 });
    res.json(empresas);
  } catch (error) {
    return sendError(res, 500, 'Erro ao listar empresas', error);
  }
});

// POST /api/empresas - Criar nova empresa (Super Admin)
router.post('/', isSuperAdmin, [
  body('nome').trim().notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  validateRequest,
], async (req, res) => {
  try {
    const { nome, cnpj, email, telefone, plano } = req.body;

    if (cnpj) {
      const empresaExistente = await Empresa.findOne({ $or: [{ email }, { cnpj }] });
      if (empresaExistente) {
        return res.status(400).json({ error: 'Empresa já cadastrada com este email ou CNPJ' });
      }
    } else {
      const empresaExistente = await Empresa.findOne({ email });
      if (empresaExistente) {
        return res.status(400).json({ error: 'Empresa já cadastrada com este email' });
      }
    }

    const empresa = await Empresa.create({
      nome,
      cnpj,
      email,
      telefone,
      plano: plano || 'basico',
    });

    res.status(201).json(empresa);
  } catch (error) {
    return sendError(res, 500, 'Erro ao criar empresa', error);
  }
});

// DELETE /api/empresas/:id - Excluir empresa (Super Admin)
router.delete('/:id', isSuperAdmin, async (req, res) => {
  try {
    const empresa = await findEmpresaByIdOr404(req.params.id, res);
    if (!empresa) return;

    await Empresa.findByIdAndDelete(req.params.id);
    res.json({ message: 'Empresa excluída com sucesso' });
  } catch (error) {
    return sendError(res, 500, 'Erro ao excluir empresa', error);
  }
});

// GET /api/empresas/me - Buscar dados da própria empresa
router.get('/me', async (req, res) => {
  try {
    const empresa = await findEmpresaByIdOr404(req.user.empresaId, res);
    if (!empresa) return;

    res.json(empresa);
  } catch (error) {
    return sendError(res, 500, 'Erro ao buscar empresa', error);
  }
});

// PUT /api/empresas/me - Atualizar dados da própria empresa
router.put('/me', isAdmin, [
  body('nome').optional().trim().notEmpty(),
  body('email').optional().isEmail().normalizeEmail(),
  validateRequest,
], async (req, res) => {
  try {
    const { nome, cnpj, email, telefone, endereco, configuracoes } = req.body;

    const updateData = {};
    if (nome) updateData.nome = nome;
    if (cnpj) updateData.cnpj = cnpj;
    if (email) updateData.email = email;
    if (telefone) updateData.telefone = telefone;
    if (endereco) updateData.endereco = endereco;
    if (configuracoes) updateData.configuracoes = configuracoes;

    const empresa = await Empresa.update(req.user.empresaId, updateData);

    res.json({
      message: 'Empresa atualizada com sucesso',
      empresa,
    });
  } catch (error) {
    return sendError(res, 500, 'Erro ao atualizar empresa', error);
  }
});

// GET /api/empresas/configuracoes - Buscar configurações da empresa
router.get('/configuracoes', async (req, res) => {
  try {
    const empresa = await findEmpresaByIdOr404(req.user.empresaId, res);
    if (!empresa) return;

    res.json({
      configuracoes: empresa.configuracoes,
      plano: empresa.plano,
    });
  } catch (error) {
    return sendError(res, 500, 'Erro ao buscar configurações', error);
  }
});

// PUT /api/empresas/configuracoes - Atualizar configurações
router.put('/configuracoes', isAdmin, async (req, res) => {
  try {
    const { configuracoes } = req.body;

    if (!configuracoes) {
      return res.status(400).json({ error: 'Configurações não fornecidas' });
    }

    const empresa = await Empresa.update(req.user.empresaId, { configuracoes });

    res.json({
      message: 'Configurações atualizadas com sucesso',
      configuracoes: empresa.configuracoes,
    });
  } catch (error) {
    return sendError(res, 500, 'Erro ao atualizar configurações', error);
  }
});

export default router;