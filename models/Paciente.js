import mongoose from 'mongoose';

const pacienteSchema = new mongoose.Schema({
  empresaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empresa',
    required: true,
    index: true
  },
  nome: {
    type: String,
    required: true,
    trim: true
  },
  cpf: {
    type: String,
    sparse: true,
    trim: true
  },
  dataNascimento: {
    type: Date,
    required: true
  },
  sexo: {
    type: String,
    enum: ['M', 'F', 'Outro'],
    required: true
  },
  email: String,
  telefone: {
    type: String,
    required: true
  },
  endereco: {
    type: Map,
    of: String,
    default: {}
  },
  foto: String,
  tipoSanguineo: String,
  peso: Number,
  altura: Number,
  alergias: [String],
  condicoesMedicas: [String],
  medicamentosEmUso: [String],
  convenio: {
    nome: String,
    numeroCarteirinha: String,
    validade: Date
  },
  contatoEmergencia: {
    nome: String,
    telefone: String,
    parentesco: String
  },
  status: {
    type: String,
    enum: ['ativo', 'inativo'],
    default: 'ativo'
  },
  observacoes: String,
  criadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices
pacienteSchema.index({ empresaId: 1, cpf: 1 });
pacienteSchema.index({ empresaId: 1, nome: 1 });
pacienteSchema.index({ empresaId: 1, status: 1 });

// Métodos Estáticos
pacienteSchema.statics.countByEmpresa = function(empresaId) {
  return this.countDocuments({ empresaId });
};

pacienteSchema.statics.findByEmpresa = function(empresaId, filter = {}, limit = 10, skip = 0) {
  return this.find({ empresaId, ...filter })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

const Paciente = mongoose.model('Paciente', pacienteSchema);

export default Paciente;