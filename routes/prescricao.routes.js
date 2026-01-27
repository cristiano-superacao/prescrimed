import express from 'express';
import { Prescricao, Paciente, Usuario } from '../models/index.js';

const router = express.Router();

function normalizeMedicamentos(value) {
  if (!value) return [];
  if (!Array.isArray(value)) return [];
  return value
    .filter((m) => m && typeof m === 'object')
    .map((m) => ({
      nome: String(m.nome || '').trim(),
      dosagem: String(m.dosagem || '').trim(),
      frequencia: String(m.frequencia || '').trim(),
      duracao: String(m.duracao || '').trim(),
      observacoes: m.observacoes != null ? String(m.observacoes).trim() : ''
    }))
    .filter((m) => m.nome.length > 0);
}

function isControladaFromItens(itens) {
  if (!Array.isArray(itens)) return false;
  return itens.some((i) => i && typeof i === 'object' && i.controlado === true);
}

function mapTipoToDb(tipoInput, medicamentos) {
  if (tipoInput === 'nutricional' || tipoInput === 'medicamentosa' || tipoInput === 'mista') {
    return { tipoDb: tipoInput, itensDb: medicamentos };
  }

  // Compatibilidade com o frontend atual
  if (tipoInput === 'controlado') {
    return {
      tipoDb: 'medicamentosa',
      itensDb: (medicamentos || []).map((m) => ({ ...m, controlado: true }))
    };
  }

  // default: comum
  return { tipoDb: 'medicamentosa', itensDb: medicamentos };
}

function prescricaoToClient(prescricaoInstance) {
  const json = prescricaoInstance.toJSON();
  const itens = Array.isArray(json.itens) ? json.itens : [];

  const medicamentos = itens
    .filter((i) => i && typeof i === 'object')
    .map((i) => ({
      // Campos esperados pelo frontend
      nome: String(i.nome || i.refeicao || i.descricao || 'Item').trim(),
      dosagem: i.dosagem != null ? String(i.dosagem).trim() : '',
      frequencia: i.frequencia != null ? String(i.frequencia).trim() : (i.horario != null ? String(i.horario).trim() : ''),
      duracao: i.duracao != null ? String(i.duracao).trim() : '',
      observacoes: i.observacoes != null ? String(i.observacoes).trim() : '',
      controlado: i.controlado === true,
      // Mantém campos originais caso existam (não quebra compatibilidade)
      ...i,
    }))
    .filter((m) => m.nome.length > 0);

  const tipoSistema = json.tipo;
  let tipoClient = json.tipo;
  tipoClient = tipoSistema === 'medicamentosa'
    ? (isControladaFromItens(itens) ? 'controlado' : 'comum')
    : 'comum';

  return {
    ...json,
    tipoSistema,
    tipo: tipoClient,
    medicamentos,
    pacienteNome: json.paciente?.nome || json.pacienteNome || null,
  };
}

// Listar todas as prescrições
router.get('/', async (req, res) => {
  try {
    const { empresaId, pacienteId, page = 1, pageSize = 10 } = req.query;
    const where = {};
    if (empresaId) where.empresaId = empresaId;
    if (pacienteId) where.pacienteId = pacienteId;
    const limit = Math.max(1, parseInt(pageSize));
    const offset = (Math.max(1, parseInt(page)) - 1) * limit;

    const { rows, count } = await Prescricao.findAndCountAll({
      where,
      include: [
        { model: Paciente, as: 'paciente', attributes: ['id', 'nome', 'cpf'] },
        { model: Usuario, as: 'nutricionista', attributes: ['id', 'nome', 'email'] }
      ],
      order: [['updatedAt', 'DESC']],
      limit,
      offset
    });
    res.json({ items: rows.map(prescricaoToClient), total: count, page: parseInt(page), pageSize: limit });
  } catch (error) {
    console.error('Erro ao listar prescrições:', error);
    res.status(500).json({ error: 'Erro ao listar prescrições' });
  }
});

// Listar prescrições por paciente (compatibilidade com o frontend)
router.get('/paciente/:id', async (req, res) => {
  try {
    const { empresaId, page = 1, pageSize = 10 } = req.query;
    const where = { pacienteId: req.params.id };
    if (empresaId) where.empresaId = empresaId;
    const limit = Math.max(1, parseInt(pageSize));
    const offset = (Math.max(1, parseInt(page)) - 1) * limit;

    const { rows, count } = await Prescricao.findAndCountAll({
      where,
      include: [
        { model: Paciente, as: 'paciente', attributes: ['id', 'nome', 'cpf'] },
        { model: Usuario, as: 'nutricionista', attributes: ['id', 'nome', 'email'] }
      ],
      order: [['updatedAt', 'DESC']],
      limit,
      offset
    });

    res.json({ items: rows.map(prescricaoToClient), total: count, page: parseInt(page), pageSize: limit });
  } catch (error) {
    console.error('Erro ao listar prescrições do paciente:', error);
    res.status(500).json({ error: 'Erro ao listar prescrições do paciente' });
  }
});

// Buscar prescrição por ID
router.get('/:id', async (req, res) => {
  try {
    const { empresaId } = req.query;
    const where = { id: req.params.id };
    
    // Aplica filtro de empresa se não for superadmin
    if (empresaId) {
      where.empresaId = empresaId;
    }
    
    const prescricao = await Prescricao.findOne({
      where,
      include: [
        { model: Paciente, as: 'paciente' },
        { model: Usuario, as: 'nutricionista', attributes: ['id', 'nome', 'email'] }
      ]
    });
    
    if (!prescricao) {
      return res.status(404).json({ error: 'Prescrição não encontrada ou sem permissão de acesso' });
    }
    
    res.json(prescricaoToClient(prescricao));
  } catch (error) {
    console.error('Erro ao buscar prescrição:', error);
    res.status(500).json({ error: 'Erro ao buscar prescrição' });
  }
});

// Criar nova prescrição
router.post('/', async (req, res) => {
  try {
    // empresaId já foi forçado pelo middleware tenantIsolation
    const { pacienteId, tipo, medicamentos, observacoes, descricao } = req.body;

    const empresaIdResolved = req.body.empresaId || req.user?.empresaId;

    if (!pacienteId) {
      return res.status(400).json({ error: 'pacienteId é obrigatório' });
    }

    if (!empresaIdResolved) {
      return res.status(400).json({ error: 'empresaId é obrigatório' });
    }

    const meds = normalizeMedicamentos(medicamentos);
    const { tipoDb, itensDb } = mapTipoToDb(tipo, meds);

    const paciente = await Paciente.findOne({
      where: {
        id: pacienteId,
        ...(req.tenantEmpresaId ? { empresaId: req.tenantEmpresaId } : {})
      },
      attributes: ['id', 'nome']
    });

    if (!paciente) {
      return res.status(404).json({ error: 'Paciente não encontrado ou sem permissão de acesso' });
    }

    const prescricao = await Prescricao.create({
      pacienteId,
      empresaId: empresaIdResolved,
      nutricionistaId: req.user.id,
      tipo: tipoDb,
      descricao: descricao || null,
      observacoes: observacoes || null,
      itens: itensDb,
      status: 'ativa'
    });

    const prescricaoCriada = await Prescricao.findOne({
      where: { id: prescricao.id },
      include: [
        { model: Paciente, as: 'paciente', attributes: ['id', 'nome', 'cpf'] },
        { model: Usuario, as: 'nutricionista', attributes: ['id', 'nome', 'email'] }
      ]
    });

    res.status(201).json(prescricaoToClient(prescricaoCriada));
  } catch (error) {
    console.error('Erro ao criar prescrição:', error);
    res.status(500).json({ error: 'Erro ao criar prescrição' });
  }
});

// Atualizar prescrição
router.put('/:id', async (req, res) => {
  try {
    const where = { id: req.params.id };
    
    // Força filtro por empresa se não for superadmin
    if (req.tenantEmpresaId) {
      where.empresaId = req.tenantEmpresaId;
    }
    
    const prescricao = await Prescricao.findOne({ where });
    
    if (!prescricao) {
      return res.status(404).json({ error: 'Prescrição não encontrada ou sem permissão de acesso' });
    }
    
    // Remove empresaId do body para evitar alteração
    const { empresaId, tipo, medicamentos, ...rest } = req.body;

    const updateData = { ...rest };

    if (tipo != null) {
      const currentItens = Array.isArray(prescricao.itens) ? prescricao.itens : [];
      const meds = medicamentos != null ? normalizeMedicamentos(medicamentos) : currentItens;
      const mapped = mapTipoToDb(tipo, meds);
      updateData.tipo = mapped.tipoDb;
      // se tipo veio do frontend (comum/controlado) e não mandou medicamentos, ajusta itens existentes
      if (tipo === 'comum' || tipo === 'controlado' || medicamentos != null) {
        updateData.itens = mapped.itensDb;
      }
    } else if (medicamentos != null) {
      updateData.itens = normalizeMedicamentos(medicamentos);
    }

    await prescricao.update(updateData);

    const prescricaoAtualizada = await Prescricao.findOne({
      where,
      include: [
        { model: Paciente, as: 'paciente', attributes: ['id', 'nome', 'cpf'] },
        { model: Usuario, as: 'nutricionista', attributes: ['id', 'nome', 'email'] }
      ]
    });

    res.json(prescricaoToClient(prescricaoAtualizada));
  } catch (error) {
    console.error('Erro ao atualizar prescrição:', error);
    res.status(500).json({ error: 'Erro ao atualizar prescrição' });
  }
});

// Cancelar prescrição (compatibilidade com o frontend)
router.put('/:id/cancelar', async (req, res) => {
  try {
    const where = { id: req.params.id };
    if (req.tenantEmpresaId) where.empresaId = req.tenantEmpresaId;

    const prescricao = await Prescricao.findOne({ where });
    if (!prescricao) {
      return res.status(404).json({ error: 'Prescrição não encontrada ou sem permissão de acesso' });
    }

    await prescricao.update({ status: 'cancelada' });
    res.json({ message: 'Prescrição cancelada com sucesso' });
  } catch (error) {
    console.error('Erro ao cancelar prescrição:', error);
    res.status(500).json({ error: 'Erro ao cancelar prescrição' });
  }
});

// Arquivar/finalizar prescrição (compatibilidade com o frontend)
router.put('/:id/arquivar', async (req, res) => {
  try {
    const where = { id: req.params.id };
    if (req.tenantEmpresaId) where.empresaId = req.tenantEmpresaId;

    const prescricao = await Prescricao.findOne({ where });
    if (!prescricao) {
      return res.status(404).json({ error: 'Prescrição não encontrada ou sem permissão de acesso' });
    }

    await prescricao.update({ status: 'finalizada' });
    res.json({ message: 'Prescrição finalizada com sucesso' });
  } catch (error) {
    console.error('Erro ao finalizar prescrição:', error);
    res.status(500).json({ error: 'Erro ao finalizar prescrição' });
  }
});

// Deletar prescrição
router.delete('/:id', async (req, res) => {
  try {
    const where = { id: req.params.id };
    
    // Força filtro por empresa se não for superadmin
    if (req.tenantEmpresaId) {
      where.empresaId = req.tenantEmpresaId;
    }
    
    const prescricao = await Prescricao.findOne({ where });
    
    if (!prescricao) {
      return res.status(404).json({ error: 'Prescrição não encontrada ou sem permissão de acesso' });
    }
    
    await prescricao.destroy();
    res.json({ message: 'Prescrição deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar prescrição:', error);
    res.status(500).json({ error: 'Erro ao deletar prescrição' });
  }
});

export default router;
