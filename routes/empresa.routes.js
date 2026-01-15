import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, isAdmin, isSuperAdmin } from '../middleware/auth.middleware.js';
import Empresa from '../models/Empresa.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

// GET /api/empresas - Listar todas as empresas (Super Admin)
router.get('/', isSuperAdmin, async (req, res) => {
  try {
    const empresas = await Empresa.find().sort({ createdAt: -1 });
    res.json(empresas);
  } catch (error) {
    console.error('Erro ao listar empresas:', error);
    res.status(500).json({ error: 'Erro ao listar empresas' });
  }
});

// POST /api/empresas - Criar nova empresa (Super Admin)
router.post('/', isSuperAdmin, [
  body('nome').trim().notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
    console.error('Erro ao criar empresa:', error);
    res.status(500).json({ error: 'Erro ao criar empresa' });
  }
});

// DELETE /api/empresas/:id - Excluir empresa (Super Admin)
router.delete('/:id', isSuperAdmin, async (req, res) => {
  try {
    const empresa = await Empresa.findByIdAndDelete(req.params.id);
    if (!empresa) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }
    res.json({ message: 'Empresa excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir empresa:', error);
    res.status(500).json({ error: 'Erro ao excluir empresa' });
  }
});

// GET /api/empresas/me - Buscar dados da própria empresa
router.get('/me', async (req, res) => {
  try {
    const empresa = await Empresa.findById(req.user.empresaId);
    
    if (!empresa) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    res.json(empresa);
  } catch (error) {
    console.error('Erro ao buscar empresa:', error);
    res.status(500).json({ error: 'Erro ao buscar empresa' });
  }
});

// PUT /api/empresas/me - Atualizar dados da própria empresa
router.put('/me', isAdmin, [
  body('nome').optional().trim().notEmpty(),
  body('email').optional().isEmail().normalizeEmail(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
    console.error('Erro ao atualizar empresa:', error);
    res.status(500).json({ error: 'Erro ao atualizar empresa' });
  }
});

// GET /api/empresas/configuracoes - Buscar configurações da empresa
router.get('/configuracoes', async (req, res) => {
  try {
    const empresa = await Empresa.findById(req.user.empresaId);
    
    if (!empresa) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    res.json({
      configuracoes: empresa.configuracoes,
      plano: empresa.plano,
    });
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    res.status(500).json({ error: 'Erro ao buscar configurações' });
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
    console.error('Erro ao atualizar configurações:', error);
    res.status(500).json({ error: 'Erro ao atualizar configurações' });
  }
});

export default router;