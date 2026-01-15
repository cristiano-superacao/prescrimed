import mongoose from 'mongoose';

const empresaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  cnpj: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  telefone: String,
  tipoSistema: {
    type: String,
    enum: ['casa-repouso', 'petshop'],
    default: 'casa-repouso'
  },
  endereco: {
    type: Map,
    of: String,
    default: {}
  },
  adminUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  plano: {
    type: String,
    enum: ['basico', 'premium', 'enterprise'],
    default: 'basico'
  },
  status: {
    type: String,
    enum: ['ativo', 'inativo', 'suspenso'],
    default: 'ativo'
  },
  configuracoes: {
    modulosAtivos: {
      type: [String],
      default: ['dashboard', 'prescricoes', 'pacientes']
    },
    limiteUsuarios: {
      type: Number,
      default: 5
    },
    limiteArmazenamento: {
      type: Number,
      default: 1024
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices
empresaSchema.index({ cnpj: 1 });
empresaSchema.index({ email: 1 });

// Métodos Estáticos para compatibilidade com o controller
empresaSchema.statics.findByCnpj = function(cnpj) {
  return this.findOne({ cnpj });
};

empresaSchema.statics.update = function(id, data) {
  return this.findByIdAndUpdate(id, data, { new: true });
};

const Empresa = mongoose.model('Empresa', empresaSchema);

export default Empresa;