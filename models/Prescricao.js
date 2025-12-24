import mongoose from 'mongoose';

const medicamentoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  dosagem: String,
  posologia: String,
  viaAdministracao: String,
  duracao: String,
  observacoes: String
}, { _id: false });

const prescricaoSchema = new mongoose.Schema({
  empresaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empresa',
    required: true,
    index: true
  },
  pacienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paciente',
    required: true,
    index: true
  },
  medicoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
    index: true
  },
  medicamentos: [medicamentoSchema],
  observacoes: String,
  tipo: {
    type: String,
    enum: ['comum', 'controlado', 'amarelo', 'azul'],
    default: 'comum'
  },
  status: {
    type: String,
    enum: ['ativa', 'cancelada', 'arquivada'],
    default: 'ativa'
  },
  dataEmissao: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices
prescricaoSchema.index({ empresaId: 1, pacienteId: 1 });
prescricaoSchema.index({ empresaId: 1, medicoId: 1 });
prescricaoSchema.index({ empresaId: 1, status: 1 });
prescricaoSchema.index({ empresaId: 1, dataEmissao: -1 });

// Métodos Estáticos
prescricaoSchema.statics.countByEmpresa = function(empresaId, filter = {}) {
  return this.countDocuments({ empresaId, ...filter });
};

prescricaoSchema.statics.findByEmpresa = function(empresaId, filter = {}, limit = 10, skip = 0) {
  return this.find({ empresaId, ...filter })
    .populate('pacienteId', 'nome')
    .populate('medicoId', 'nome')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

prescricaoSchema.statics.getStatsByPeriod = async function(empresaId, startDate, endDate) {
  const stats = await this.aggregate([
    {
      $match: {
        empresaId: new mongoose.Types.ObjectId(empresaId),
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const total = stats.reduce((acc, curr) => acc + curr.count, 0);
  
  // Preencher dias vazios
  const days = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);
  
  while (currentDate <= end) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const stat = stats.find(s => s._id === dateStr);
    days.push({
      date: dateStr,
      count: stat ? stat.count : 0
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return { total, dailyStats: days };
};

const Prescricao = mongoose.model('Prescricao', prescricaoSchema);

export default Prescricao;