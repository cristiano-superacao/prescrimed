import express from 'express';
import { body, validationResult } from 'express-validator';
import { sequelize, Empresa, Usuario } from '../models/index.js';
import { requireRole } from '../middleware/auth.middleware.js';
import { ensureValidCNPJ, normalizeCNPJ } from '../utils/brDocuments.js';

const router = express.Router();

// Observação: autenticação é aplicada no mount em routes/index.js

// Listar todas as empresas (apenas superadmin)
router.get('/', requireRole('superadmin'), async (req, res) => {
  try {
    const empresas = await Empresa.findAll({
      include: [{ model: Usuario, as: 'usuarios', attributes: ['id', 'nome', 'email', 'role'] }],
      order: [['createdAt', 'DESC']]
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
    if (cnpj != null) {
      try {
        updateData.cnpj = cnpj ? ensureValidCNPJ(cnpj) : null;
      } catch (e) {
        return res.status(400).json({ error: e.message || 'CNPJ inválido' });
      }
    }
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

// Buscar empresa por ID (apenas superadmin)
router.get('/:id', requireRole('superadmin'), async (req, res) => {
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
// Criar nova empresa (apenas superadmin)
router.post(
  '/',
  requireRole('superadmin'),
  [
    body('nome').isString().trim().notEmpty().withMessage('Nome é obrigatório'),
    body('tipoSistema').optional().isIn(['casa-repouso', 'fisioterapia', 'petshop']).withMessage('tipoSistema inválido'),
    body('cnpj')
      .optional({ checkFalsy: true })
      .customSanitizer((v) => normalizeCNPJ(v) || null)
      .custom((v) => {
        if (!v) return true;
        ensureValidCNPJ(v);
        return true;
      })
      .withMessage('CNPJ inválido'),
    body('email').optional().isEmail().withMessage('Email inválido'),
    body('telefone').optional().isString(),
    body('endereco').optional().isString(),
    body('plano').optional().isIn(['basico', 'profissional', 'empresa']).withMessage('plano inválido'),
    body('ativo').optional().isBoolean().withMessage('Ativo deve ser booleano')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Dados inválidos', details: errors.array() });
      }

      const { nome, tipoSistema, cnpj, email, telefone, endereco, plano } = req.body;

      const created = await sequelize.transaction(async (t) => {
        // Evita duplicidade por CNPJ (normalizado)
        if (cnpj) {
          const existente = await Empresa.findOne({ where: { cnpj }, transaction: t });
          if (existente) {
            const err = new Error('CNPJ já cadastrado');
            err.status = 409;
            err.empresaId = existente.id;
            throw err;
          }
        }

        const novaEmpresa = await Empresa.create(
          {
            nome,
            tipoSistema: tipoSistema || 'casa-repouso',
            cnpj,
            email,
            telefone,
            endereco,
            plano: plano || 'basico',
            ativo: req.body.ativo !== undefined ? req.body.ativo : true
          },
          { transaction: t }
        );

        return Empresa.findByPk(novaEmpresa.id, {
          include: [{ model: Usuario, as: 'usuarios', attributes: ['id', 'nome', 'email', 'role'] }],
          transaction: t
        });
      });

      return res.status(201).json(created);
    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      if (error?.status === 409) {
        return res.status(409).json({ error: error.message, empresaId: error.empresaId });
      }
      // Trata erro de unicidade
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ error: 'Valor único já existente', details: error.errors });
      }
      res.status(500).json({ error: 'Erro ao criar empresa' });
    }
  }
);

// Atualizar empresa (apenas superadmin)
router.put(
  '/:id',
  requireRole('superadmin'),
  [
    body('nome').optional().isString().trim().notEmpty().withMessage('Nome não pode ser vazio'),
    body('tipoSistema').optional().isIn(['casa-repouso', 'fisioterapia', 'petshop']).withMessage('tipoSistema inválido'),
    body('cnpj')
      .optional({ checkFalsy: true })
      .customSanitizer((v) => normalizeCNPJ(v) || null)
      .custom((v) => {
        if (!v) return true;
        ensureValidCNPJ(v);
        return true;
      })
      .withMessage('CNPJ inválido'),
    body('email').optional().isEmail().withMessage('Email inválido'),
    body('telefone').optional().isString(),
    body('endereco').optional().isString(),
    body('plano').optional().isIn(['basico', 'profissional', 'empresa']).withMessage('plano inválido'),
    body('ativo').optional().isBoolean().withMessage('Ativo deve ser booleano')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Dados inválidos', details: errors.array() });
      }

      const empresa = await Empresa.findByPk(req.params.id);
      
      if (!empresa) {
        return res.status(404).json({ error: 'Empresa não encontrada' });
      }

      // Verificar CNPJ duplicado (se estiver sendo alterado)
      if (req.body.cnpj && req.body.cnpj !== empresa.cnpj) {
        const existente = await Empresa.findOne({ where: { cnpj: req.body.cnpj } });
        if (existente) {
          return res.status(409).json({ error: 'CNPJ já cadastrado' });
        }
      }

      // Não permitir alteração manual do código sequencial
      const { codigo, codigoNumero, ...safeBody } = req.body || {};

      await empresa.update(safeBody);
      
      const empresaAtualizada = await Empresa.findByPk(req.params.id, {
        include: [{ model: Usuario, as: 'usuarios', attributes: ['id', 'nome', 'email', 'role'] }]
      });
      
      res.json(empresaAtualizada);
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ error: 'Valor único já existente', details: error.errors });
      }
      res.status(500).json({ error: 'Erro ao atualizar empresa' });
    }
  }
);

// Deletar empresa (apenas superadmin)
router.delete('/:id', requireRole('superadmin'), async (req, res) => {
  try {
    const empresa = await Empresa.findByPk(req.params.id, {
      include: [{ model: Usuario, as: 'usuarios' }]
    });
    
    if (!empresa) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    // Verificar se há usuários vinculados
    if (empresa.usuarios && empresa.usuarios.length > 0) {
      return res.status(400).json({ 
        error: 'Não é possível deletar empresa com usuários vinculados',
        usuariosCount: empresa.usuarios.length
      });
    }
    
    await empresa.destroy();
    res.json({ message: 'Empresa deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar empresa:', error);
    res.status(500).json({ error: 'Erro ao deletar empresa' });
  }
});

export default router;
