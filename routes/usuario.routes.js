import express from 'express';
import bcrypt from 'bcryptjs';
import { Usuario, Empresa } from '../models/index.js';

const router = express.Router();

function stripSenha(usuarioInstance) {
  const json = usuarioInstance?.toJSON ? usuarioInstance.toJSON() : usuarioInstance;
  if (!json) return json;
  const { senha, ...rest } = json;
  return rest;
}

function usuarioToClient(usuarioInstance) {
  const safe = stripSenha(usuarioInstance);
  if (!safe) return safe;

  // Compatibilidade com o frontend (Configurações usa "telefone")
  if (safe.telefone == null && safe.contato != null) {
    safe.telefone = safe.contato;
  }

  return safe;
}

function normalizePermissoes(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => String(v || '').trim())
    .filter(Boolean);
}

// GET /api/usuarios/me/summary - Resumo do usuário autenticado
router.get('/me/summary', async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const usuario = await Usuario.findByPk(req.user.id, {
      attributes: { exclude: ['senha'] },
      include: [{ model: Empresa, as: 'empresa', attributes: ['id', 'nome', 'tipoSistema', 'plano'] }]
    });
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Mock de estatísticas - em produção, buscar do banco
    const summary = {
      usuario: usuario.toJSON(),
      estatisticas: {
        pacientesAtendidos: 45,
        prescricoesCriadas: 120,
        agendamentosHoje: 5,
        notificacoes: 3
      },
      atividadesRecentes: [
        { tipo: 'prescricao', descricao: 'Prescrição criada para João Silva', data: new Date().toISOString() },
        { tipo: 'agendamento', descricao: 'Consulta agendada para Maria Santos', data: new Date().toISOString() }
      ]
    };
    
    res.json(summary);
  } catch (error) {
    console.error('Erro ao buscar resumo do usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar resumo do usuário' });
  }
});

// GET /api/usuarios/me - Perfil do usuário autenticado
router.get('/me', async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const where = { id: req.user.id };
    if (req.tenantEmpresaId) {
      where.empresaId = req.tenantEmpresaId;
    }

    const usuario = await Usuario.findOne({
      where,
      attributes: { exclude: ['senha'] },
      include: [{ model: Empresa, as: 'empresa', attributes: ['id', 'nome', 'tipoSistema', 'plano'] }]
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(usuarioToClient(usuario));
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar perfil do usuário' });
  }
});

// PUT /api/usuarios/me - Atualizar perfil do usuário autenticado
router.put('/me', async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const where = { id: req.user.id };
    if (req.tenantEmpresaId) {
      where.empresaId = req.tenantEmpresaId;
    }

    const usuario = await Usuario.findOne({ where });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Evita alteração de role/empresa/senha via endpoint de perfil
    const { role, empresaId, senha, ativo, ...dados } = req.body || {};

    // Atualiza apenas campos suportados pelo modelo atual
    const updateData = {};
    if (dados.nome != null) updateData.nome = dados.nome;
    if (dados.email != null) updateData.email = dados.email;
    if (dados.cpf != null) updateData.cpf = dados.cpf;

    // Frontend usa "telefone"; modelo usa "contato"
    if (dados.telefone != null) updateData.contato = dados.telefone;
    if (dados.contato != null) updateData.contato = dados.contato;

    // Campos profissionais (agora persistidos no modelo)
    if (dados.especialidade != null) updateData.especialidade = dados.especialidade;
    if (dados.crm != null) updateData.crm = dados.crm;
    if (dados.crmUf != null) updateData.crmUf = String(dados.crmUf).toUpperCase();

    await usuario.update(updateData);

    const atualizado = await Usuario.findByPk(req.user.id, {
      attributes: { exclude: ['senha'] },
      include: [{ model: Empresa, as: 'empresa', attributes: ['id', 'nome', 'tipoSistema', 'plano'] }]
    });

    res.json({ usuario: usuarioToClient(atualizado) });
  } catch (error) {
    console.error('Erro ao atualizar perfil do usuário:', error);
    if (error?.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Email já está em uso' });
    }
    res.status(500).json({ error: 'Erro ao atualizar perfil do usuário' });
  }
});

// Listar todos os usuários
router.get('/', async (req, res) => {
  try {
    const { empresaId } = req.query;
    const where = empresaId ? { empresaId } : {};
    
    const usuarios = await Usuario.findAll({
      where,
      attributes: { exclude: ['senha'] },
      include: [{ model: Empresa, as: 'empresa', attributes: ['id', 'nome'] }]
    });
    res.json(usuarios);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
});

// Buscar usuário por ID
router.get('/:id', async (req, res) => {
  try {
    const where = { id: req.params.id };
    if (req.tenantEmpresaId) {
      where.empresaId = req.tenantEmpresaId;
    }

    const usuario = await Usuario.findOne({
      where,
      attributes: { exclude: ['senha'] },
      include: [{ model: Empresa, as: 'empresa', attributes: ['id', 'nome'] }]
    });
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    res.json(usuario);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

// PUT /api/usuarios/:id/permissoes - compatibilidade (não implementado no modelo atual)
router.put('/:id/permissoes', async (req, res) => {
  try {
    const where = { id: req.params.id };
    if (req.tenantEmpresaId) where.empresaId = req.tenantEmpresaId;

    const usuario = await Usuario.findOne({ where });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado ou sem permissão de acesso' });
    }

    // Apenas admin/superadmin pode alterar permissões
    if (req.user?.role !== 'admin' && req.user?.role !== 'superadmin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const permissoes = normalizePermissoes(req.body?.permissoes);
    await usuario.update({ permissoes });

    res.json(usuarioToClient(usuario));
  } catch (error) {
    console.error('Erro ao atualizar permissões:', error);
    res.status(500).json({ error: 'Erro ao atualizar permissões' });
  }
});

// PUT /api/usuarios/:id/senha - Trocar senha
router.put('/:id/senha', async (req, res) => {
  try {
    const { senhaAtual, novaSenha } = req.body;
    if (!novaSenha || String(novaSenha).length < 6) {
      return res.status(400).json({ error: 'novaSenha deve ter no mínimo 6 caracteres' });
    }

    const where = { id: req.params.id };
    if (req.tenantEmpresaId) where.empresaId = req.tenantEmpresaId;

    const usuario = await Usuario.findOne({ where });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado ou sem permissão de acesso' });
    }

    const isSelf = req.user?.id === usuario.id;
    const canAdminReset = req.user?.role === 'admin' || req.user?.role === 'superadmin';
    if (!isSelf && !canAdminReset) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    if (isSelf) {
      if (!senhaAtual) {
        return res.status(400).json({ error: 'senhaAtual é obrigatória' });
      }
      const ok = await bcrypt.compare(String(senhaAtual), usuario.senha);
      if (!ok) {
        return res.status(400).json({ error: 'senhaAtual inválida' });
      }
    }

    const senhaHash = await bcrypt.hash(String(novaSenha), 10);
    await usuario.update({ senha: senhaHash });

    res.json({ message: 'Senha atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    res.status(500).json({ error: 'Erro ao atualizar senha' });
  }
});

// Criar novo usuário
router.post('/', async (req, res) => {
  try {
    const { senha, ...dados } = req.body;
    const senhaHash = await bcrypt.hash(senha, 10);

    // Compatibilidade: aceitar telefone no payload
    if (dados.telefone != null && (dados.contato == null || dados.contato === '')) {
      dados.contato = dados.telefone;
    }
    delete dados.telefone;

    const permissoes = normalizePermissoes(dados.permissoes);
    delete dados.permissoes;

    try {
      const usuario = await Usuario.create({
        ...dados,
        permissoes,
        senha: senhaHash
      });
      res.status(201).json(stripSenha(usuario));
    } catch (dbError) {
      // Log detalhado do erro do Sequelize
      console.error('Erro Sequelize ao criar usuário:', dbError);
      if (dbError.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ error: 'E-mail já cadastrado' });
      }
      if (dbError.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: dbError.errors?.[0]?.message || 'Erro de validação' });
      }
      return res.status(500).json({ error: dbError.message || 'Erro desconhecido ao criar usuário' });
    }
  } catch (error) {
    console.error('Erro inesperado ao criar usuário:', error);
    res.status(500).json({ error: 'Erro inesperado ao criar usuário' });
  }
});

// Atualizar usuário
router.put('/:id', async (req, res) => {
  try {
    const where = { id: req.params.id };
    if (req.tenantEmpresaId) where.empresaId = req.tenantEmpresaId;

    const usuario = await Usuario.findOne({ where });
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    const { senha, ...dados } = req.body;
    const dadosAtualizados = { ...dados };

    if (dadosAtualizados.permissoes != null) {
      dadosAtualizados.permissoes = normalizePermissoes(dadosAtualizados.permissoes);
    }

    // Compatibilidade: aceitar telefone no payload
    if (dadosAtualizados.telefone != null && (dadosAtualizados.contato == null || dadosAtualizados.contato === '')) {
      dadosAtualizados.contato = dadosAtualizados.telefone;
    }
    delete dadosAtualizados.telefone;

    if (dadosAtualizados.crmUf != null) {
      dadosAtualizados.crmUf = String(dadosAtualizados.crmUf).toUpperCase();
    }
    
    if (senha) {
      dadosAtualizados.senha = await bcrypt.hash(senha, 10);
    }
    
    await usuario.update(dadosAtualizados);
    
    res.json(stripSenha(usuario));
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

// Deletar usuário
router.delete('/:id', async (req, res) => {
  try {
    const where = { id: req.params.id };
    if (req.tenantEmpresaId) where.empresaId = req.tenantEmpresaId;

    const usuario = await Usuario.findOne({ where });
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    await usuario.destroy();
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
});

export default router;
