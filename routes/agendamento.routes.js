import express from 'express';
import { Agendamento, Paciente, Usuario, Empresa } from '../models/index.js';
import { Op } from 'sequelize';

const router = express.Router();

// GET /api/agendamentos - Listar agendamentos com filtros
router.get('/', async (req, res) => {
  try {
    const { empresaId, pacienteId, usuarioId, dataInicio, dataFim, status, tipo } = req.query;
    
    const where = {};
    
    if (empresaId) where.empresaId = empresaId;
    if (pacienteId) where.pacienteId = pacienteId;
    if (usuarioId) where.usuarioId = usuarioId;
    if (status) where.status = status;
    if (tipo) where.tipo = tipo;
    
    // Filtro de data
    if (dataInicio || dataFim) {
      where.dataHora = {};
      if (dataInicio) where.dataHora[Op.gte] = new Date(dataInicio);
      if (dataFim) where.dataHora[Op.lte] = new Date(dataFim);
    }
    
    const agendamentos = await Agendamento.findAll({
      where,
      include: [
        { 
          model: Paciente, 
          as: 'paciente', 
          attributes: ['id', 'nome', 'telefone', 'email'] 
        },
        { 
          model: Usuario, 
          as: 'responsavel', 
          attributes: ['id', 'nome', 'role'] 
        },
        { 
          model: Empresa, 
          as: 'empresa', 
          attributes: ['id', 'nome'] 
        }
      ],
      order: [['dataHora', 'ASC']]
    });
    
    res.json(agendamentos);
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    res.status(500).json({ error: 'Erro ao buscar agendamentos' });
  }
});

// GET /api/agendamentos/:id - Buscar agendamento por ID
router.get('/:id', async (req, res) => {
  try {
    const { empresaId } = req.query;
    const where = { id: req.params.id };
    
    // Aplica filtro de empresa se não for superadmin
    if (empresaId) {
      where.empresaId = empresaId;
    }
    
    const agendamento = await Agendamento.findOne({
      where,
      include: [
        { 
          model: Paciente, 
          as: 'paciente', 
          attributes: ['id', 'nome', 'telefone', 'email', 'cpf'] 
        },
        { 
          model: Usuario, 
          as: 'responsavel', 
          attributes: ['id', 'nome', 'role', 'email'] 
        },
        { 
          model: Empresa, 
          as: 'empresa', 
          attributes: ['id', 'nome', 'telefone'] 
        }
      ]
    });
    
    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado ou sem permissão de acesso' });
    }
    
    res.json(agendamento);
  } catch (error) {
    console.error('Erro ao buscar agendamento:', error);
    res.status(500).json({ error: 'Erro ao buscar agendamento' });
  }
});

// POST /api/agendamentos - Criar novo agendamento
router.post('/', async (req, res) => {
  try {
    const { 
      pacienteId, 
      usuarioId, 
      titulo, 
      descricao, 
      dataHora, 
      duracao, 
      tipo, 
      status, 
      observacoes 
    } = req.body;
    
    // empresaId já foi forçado pelo middleware tenantIsolation
    const empresaId = req.body.empresaId;
    
    // Validações básicas
    if (!pacienteId || !empresaId || !titulo || !dataHora) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: pacienteId, empresaId, titulo, dataHora' 
      });
    }
    
    // Verificar se paciente existe e pertence à mesma empresa
    const paciente = await Paciente.findOne({
      where: { id: pacienteId, empresaId }
    });
    
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente não encontrado ou não pertence a esta empresa' });
    }
    
    const agendamento = await Agendamento.create({
      pacienteId,
      empresaId,
      usuarioId,
      titulo,
      descricao,
      dataHora: new Date(dataHora),
      duracao: duracao || 60,
      tipo: tipo || 'consulta',
      status: status || 'agendado',
      observacoes
    });
    
    // Retornar com relacionamentos
    const agendamentoCriado = await Agendamento.findByPk(agendamento.id, {
      include: [
        { model: Paciente, as: 'paciente', attributes: ['id', 'nome'] },
        { model: Usuario, as: 'responsavel', attributes: ['id', 'nome'] },
        { model: Empresa, as: 'empresa', attributes: ['id', 'nome'] }
      ]
    });
    
    res.status(201).json(agendamentoCriado);
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ error: 'Erro ao criar agendamento' });
  }
});

// PUT /api/agendamentos/:id - Atualizar agendamento
router.put('/:id', async (req, res) => {
  try {
    const where = { id: req.params.id };
    
    // Força filtro por empresa se não for superadmin
    if (req.tenantEmpresaId) {
      where.empresaId = req.tenantEmpresaId;
    }
    
    const agendamento = await Agendamento.findOne({ where });
    
    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado ou sem permissão de acesso' });
    }
    
    const { 
      titulo, 
      descricao, 
      dataHora, 
      duracao, 
      tipo, 
      status, 
      observacoes,
      usuarioId
    } = req.body;
    
    // Remove empresaId do body para evitar alteração
    await agendamento.update({
      ...(titulo && { titulo }),
      ...(descricao !== undefined && { descricao }),
      ...(dataHora && { dataHora: new Date(dataHora) }),
      ...(duracao && { duracao }),
      ...(tipo && { tipo }),
      ...(status && { status }),
      ...(observacoes !== undefined && { observacoes }),
      ...(usuarioId !== undefined && { usuarioId })
    });
    
    // Retornar com relacionamentos
    const agendamentoAtualizado = await Agendamento.findByPk(agendamento.id, {
      include: [
        { model: Paciente, as: 'paciente', attributes: ['id', 'nome'] },
        { model: Usuario, as: 'responsavel', attributes: ['id', 'nome'] },
        { model: Empresa, as: 'empresa', attributes: ['id', 'nome'] }
      ]
    });
    
    res.json(agendamentoAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    res.status(500).json({ error: 'Erro ao atualizar agendamento' });
  }
});

// DELETE /api/agendamentos/:id - Deletar agendamento
router.delete('/:id', async (req, res) => {
  try {
    const where = { id: req.params.id };
    
    // Força filtro por empresa se não for superadmin
    if (req.tenantEmpresaId) {
      where.empresaId = req.tenantEmpresaId;
    }
    
    const agendamento = await Agendamento.findOne({ where });
    
    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado ou sem permissão de acesso' });
    }
    
    await agendamento.destroy();
    res.json({ message: 'Agendamento removido com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar agendamento:', error);
    res.status(500).json({ error: 'Erro ao deletar agendamento' });
  }
});

export default router;
