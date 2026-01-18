import express from 'express';
import { body, validationResult } from 'express-validator';
import { Empresa, Usuario } from '../models/index.js';

const router = express.Router();

// Listar todas as empresas
router.get('/', async (req, res) => {
  try {
    const empresas = await Empresa.findAll({
      include: [{ model: Usuario, as: 'usuarios', attributes: ['id', 'nome', 'email', 'role'] }]
    });
    res.json(empresas);
  } catch (error) {
    console.error('Erro ao listar empresas:', error);
    res.status(500).json({ error: 'Erro ao listar empresas' });
  }
});

// GET /api/empresas/me - Buscar empresa do usuário autenticado
router.get('/me', async (req, res) => {
  try {
    if (!req.user || !req.user.empresaId) {
      return res.status(401).json({ error: 'Usuário não autenticado ou sem empresa associada' });
    }

    const empresa = await Empresa.findByPk(req.user.empresaId, {
      include: [{ model: Usuario, as: 'usuarios', attributes: ['id', 'nome', 'email', 'role'] }]
    });
    
    if (!empresa) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }
    
    res.json(empresa);
  } catch (error) {
    console.error('Erro ao buscar empresa do usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar empresa' });
  }
});

// PUT /api/empresas/me - Atualizar empresa do usuário autenticado
router.put('/me', async (req, res) => {
  try {
    if (!req.user || !req.user.empresaId) {
      return res.status(401).json({ error: 'Usuário não autenticado ou sem empresa associada' });
    }

    // Por padrão, só admin/superadmin pode alterar dados da empresa
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ error: 'Acesso negado: apenas admin pode atualizar dados da empresa' });
    }

    const empresa = await Empresa.findByPk(req.user.empresaId);
    if (!empresa) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    // Atualiza somente campos esperados pelo frontend
    const { nome, cnpj, endereco, telefone, email } = req.body || {};
    const updateData = {};
    if (nome != null) updateData.nome = nome;
    if (cnpj != null) updateData.cnpj = cnpj;
    if (endereco != null) updateData.endereco = endereco;
    if (telefone != null) updateData.telefone = telefone;
    if (email != null) updateData.email = email;

    await empresa.update(updateData);

    const atualizada = await Empresa.findByPk(req.user.empresaId, {
      include: [{ model: Usuario, as: 'usuarios', attributes: ['id', 'nome', 'email', 'role'] }]
    });

    res.json(atualizada);
  } catch (error) {
    console.error('Erro ao atualizar empresa do usuário:', error);
    res.status(500).json({ error: 'Erro ao atualizar empresa' });
  }
});

// Buscar empresa por ID
router.get('/:id', async (req, res) => {
  try {
    const empresa = await Empresa.findByPk(req.params.id, {
      include: [{ model: Usuario, as: 'usuarios', attributes: ['id', 'nome', 'email', 'role'] }]
    });
    
    if (!empresa) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }
    
    res.json(empresa);
  } catch (error) {
    console.error('Erro ao buscar empresa:', error);
    res.status(500).json({ error: 'Erro ao buscar empresa' });
  }
});

// Criar nova empresa
// Criar nova empresa com validação robusta
router.post(
  '/',
  [
    body('nome').isString().trim().notEmpty().withMessage('Nome é obrigatório'),
    body('tipoSistema').isIn(['casa-repouso', 'fisioterapia', 'petshop']).withMessage('tipoSistema inválido'),
    body('cnpj').optional().isString().isLength({ min: 5 }).withMessage('CNPJ inválido'),
    body('email').optional().isEmail().withMessage('Email inválido'),
    body('telefone').optional().isString(),
    body('endereco').optional().isString(),
    body('plano').optional().isIn(['basico', 'profissional', 'empresa']).withMessage('plano inválido')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Dados inválidos', details: errors.array() });
      }

      const { nome, tipoSistema, cnpj, email, telefone, endereco, plano } = req.body;

      // Evita duplicidade por CNPJ
      if (cnpj) {
        const existente = await Empresa.findOne({ where: { cnpj } });
        if (existente) {
          return res.status(409).json({ error: 'CNPJ já cadastrado', empresaId: existente.id });
        }
      }

      const empresa = await Empresa.create({ nome, tipoSistema, cnpj, email, telefone, endereco, plano });
      return res.status(201).json(empresa);
    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      // Trata erro de unicidade
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ error: 'Valor único já existente', details: error.errors });
      }
      res.status(500).json({ error: 'Erro ao criar empresa' });
    }
  }
);

// Atualizar empresa
router.put('/:id', async (req, res) => {
  try {
    const empresa = await Empresa.findByPk(req.params.id);
    
    if (!empresa) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }
    
    await empresa.update(req.body);
    res.json(empresa);
  } catch (error) {
    console.error('Erro ao atualizar empresa:', error);
    res.status(500).json({ error: 'Erro ao atualizar empresa' });
  }
});

// Deletar empresa
router.delete('/:id', async (req, res) => {
  try {
    const empresa = await Empresa.findByPk(req.params.id);
    
    if (!empresa) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }
    
    await empresa.destroy();
    res.json({ message: 'Empresa deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar empresa:', error);
    res.status(500).json({ error: 'Erro ao deletar empresa' });
  }
});

export default router;
