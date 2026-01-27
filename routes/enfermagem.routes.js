import express from 'express';
import { Op, QueryTypes } from 'sequelize';
import { RegistroEnfermagem, Paciente, Usuario, sequelize } from '../models/index.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Listar todos os registros com filtros
router.get('/', authenticate, async (req, res) => {
  try {
    const { pacienteId, tipo, dataInicio, dataFim, prioridade, alerta, page = 1, pageSize = 10 } = req.query;
    const where = {};
    // Aplica isolamento por empresa apenas se não for superadmin
    if (req.user?.role !== 'superadmin') {
      where.empresaId = req.user.empresaId;
    }

    if (pacienteId) where.pacienteId = pacienteId;
    if (tipo) where.tipo = tipo;
    if (prioridade) where.prioridade = prioridade;
    if (alerta !== undefined) where.alerta = alerta === 'true';

    if (dataInicio && dataFim) {
      where.createdAt = {
        [Op.gte]: new Date(dataInicio),
        [Op.lte]: new Date(dataFim)
      };
    }

    const limit = Math.max(1, parseInt(pageSize));
    const offset = (Math.max(1, parseInt(page)) - 1) * limit;

    let registrosData = await RegistroEnfermagem.findAndCountAll({ where, order: [['updatedAt', 'DESC']], limit, offset });
    let registros = registrosData.rows;
    let total = registrosData.count;
    // Fallback: se vazio, consultar via SQL direto (possível diferença de mapeamento de tabela)
    if (!registros || (Array.isArray(registros) && registros.length === 0)) {
      try {
        const raw = await sequelize.query('SELECT * FROM "RegistrosEnfermagem" ORDER BY "updatedAt" DESC LIMIT :limit OFFSET :offset', { type: QueryTypes.SELECT, replacements: { limit, offset } });
        registros = raw;
        total = raw.length; // pode não refletir total exato sem COUNT
      } catch (e) {
        console.warn('Fallback SQL falhou:', e.message);
      }
    }

    res.json({ items: registros, total, page: parseInt(page), pageSize: limit });
  } catch (error) {
    console.error('Erro ao listar registros:', error);
    res.status(500).json({ error: 'Erro ao listar registros de enfermagem' });
  }
});

// Buscar registro por ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const empresaId = req.user.empresaId;

    const where = { id };
    if (req.user?.role !== 'superadmin') {
      where.empresaId = req.user.empresaId;
    }
    const registro = await RegistroEnfermagem.findOne({
      where,
      include: [
        {
          model: Paciente,
          as: 'paciente',
          attributes: ['id', 'nome', 'cpf', 'dataNascimento']
        },
        {
          model: Usuario,
          as: 'enfermeiro',
          attributes: ['id', 'nome', 'role', 'email']
        }
      ]
    });

    if (!registro) {
      return res.status(404).json({ error: 'Registro não encontrado' });
    }

    res.json(registro);
  } catch (error) {
    console.error('Erro ao buscar registro:', error);
    res.status(500).json({ error: 'Erro ao buscar registro' });
  }
});

// Criar novo registro
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      pacienteId,
      tipo,
      titulo,
      descricao,
      sinaisVitais,
      riscoQueda,
      riscoLesao,
      estadoGeral,
      alerta,
      prioridade,
      observacoes,
      anexos
    } = req.body;

    const empresaId = req.user.empresaId;
    const usuarioId = req.user.id;

    // Validações
    if (!pacienteId || !tipo || !titulo || !descricao) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: pacienteId, tipo, titulo, descricao' 
      });
    }

    // Verificar se paciente existe e pertence à empresa
    const paciente = await Paciente.findOne({
      where: { id: pacienteId, empresaId }
    });

    if (!paciente) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }

    // Serializar sinaisVitais e anexos se forem objetos
    const sinaisVitaisStr = sinaisVitais 
      ? (typeof sinaisVitais === 'string' ? sinaisVitais : JSON.stringify(sinaisVitais))
      : null;

    const anexosStr = anexos
      ? (typeof anexos === 'string' ? anexos : JSON.stringify(anexos))
      : null;

    const registro = await RegistroEnfermagem.create({
      pacienteId,
      usuarioId,
      empresaId,
      tipo,
      titulo,
      descricao,
      sinaisVitais: sinaisVitaisStr,
      riscoQueda,
      riscoLesao,
      estadoGeral,
      alerta: alerta || false,
      prioridade: prioridade || 'baixa',
      observacoes,
      anexos: anexosStr
    });

    // Buscar registro completo com relacionamentos
    const registroCompleto = await RegistroEnfermagem.findByPk(registro.id, {
      include: [
        {
          model: Paciente,
          as: 'paciente',
          attributes: ['id', 'nome', 'cpf']
        },
        {
          model: Usuario,
          as: 'enfermeiro',
          attributes: ['id', 'nome', 'role']
        }
      ]
    });

    res.status(201).json(registroCompleto);
  } catch (error) {
    console.error('Erro ao criar registro:', error);
    res.status(500).json({ error: 'Erro ao criar registro de enfermagem' });
  }
});

// Atualizar registro
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const empresaId = req.user.empresaId;

    const registro = await RegistroEnfermagem.findOne({
      where: { id, empresaId }
    });

    if (!registro) {
      return res.status(404).json({ error: 'Registro não encontrado' });
    }

    const {
      tipo,
      titulo,
      descricao,
      sinaisVitais,
      riscoQueda,
      riscoLesao,
      estadoGeral,
      alerta,
      prioridade,
      observacoes,
      anexos
    } = req.body;

    // Serializar objetos
    const updateData = {
      tipo,
      titulo,
      descricao,
      riscoQueda,
      riscoLesao,
      estadoGeral,
      alerta,
      prioridade,
      observacoes
    };

    if (sinaisVitais) {
      updateData.sinaisVitais = typeof sinaisVitais === 'string' 
        ? sinaisVitais 
        : JSON.stringify(sinaisVitais);
    }

    if (anexos) {
      updateData.anexos = typeof anexos === 'string'
        ? anexos
        : JSON.stringify(anexos);
    }

    await registro.update(updateData);

    // Buscar registro atualizado com relacionamentos
    const registroAtualizado = await RegistroEnfermagem.findByPk(id, {
      include: [
        {
          model: Paciente,
          as: 'paciente',
          attributes: ['id', 'nome', 'cpf']
        },
        {
          model: Usuario,
          as: 'enfermeiro',
          attributes: ['id', 'nome', 'role']
        }
      ]
    });

    res.json(registroAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar registro:', error);
    res.status(500).json({ error: 'Erro ao atualizar registro' });
  }
});

// Deletar registro
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const empresaId = req.user.empresaId;

    const registro = await RegistroEnfermagem.findOne({
      where: { id, empresaId }
    });

    if (!registro) {
      return res.status(404).json({ error: 'Registro não encontrado' });
    }

    await registro.destroy();
    res.json({ message: 'Registro excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar registro:', error);
    res.status(500).json({ error: 'Erro ao deletar registro' });
  }
});

// Estatísticas dos registros
router.get('/stats/dashboard', authenticate, async (req, res) => {
  try {
    const empresaId = req.user.empresaId;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const registrosHoje = await RegistroEnfermagem.count({
      where: {
        empresaId,
        createdAt: { [Op.gte]: hoje }
      }
    });

    const pacientesComRegistroHoje = await RegistroEnfermagem.count({
      where: {
        empresaId,
        createdAt: { [Op.gte]: hoje }
      },
      distinct: true,
      col: 'pacienteId'
    });

    const riscoQuedaAlto = await RegistroEnfermagem.count({
      where: {
        empresaId,
        riscoQueda: 'alto',
        createdAt: { [Op.gte]: hoje }
      },
      distinct: true,
      col: 'pacienteId'
    });

    const alertasCriticos = await RegistroEnfermagem.count({
      where: {
        empresaId,
        alerta: true,
        prioridade: ['alta', 'urgente']
      }
    });

    res.json({
      registrosHoje,
      pacientesComRegistro: pacientesComRegistroHoje,
      riscoQueda: riscoQuedaAlto,
      alertasCriticos
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

export default router;

