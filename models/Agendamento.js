import mongoose from 'mongoose';

const agendamentoSchema = new mongoose.Schema({
  empresaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empresa',
    required: true,
    index: true
  },
  medicoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  pacienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paciente',
    required: false
  },
  titulo: {
    type: String,
    required: true
  },
  local: {
    type: String
  },
  participante: {
    type: String
  },
  dataHoraInicio: {
    type: Date,
    required: true
  },
  dataHoraFim: {
    type: Date,
    required: true
  },
  tipo: {
    type: String,
    enum: ['Compromisso', 'Reunião', 'Consulta', 'Exame', 'Outro'],
    default: 'Compromisso'
  },
  status: {
    type: String,
    enum: ['agendado', 'confirmado', 'cancelado', 'concluido', 'em_andamento', 'faltou'],
    default: 'agendado'
  },
  observacoes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para busca rápida
agendamentoSchema.index({ empresaId: 1, dataHoraInicio: 1 });
agendamentoSchema.index({ medicoId: 1, dataHoraInicio: 1 });
agendamentoSchema.index({ pacienteId: 1 });

const Agendamento = mongoose.model('Agendamento', agendamentoSchema);

export default Agendamento;
