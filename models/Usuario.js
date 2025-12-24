import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const usuarioSchema = new mongoose.Schema({
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
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  senha: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    enum: [
      'superadmin',
      'admin',
      'medico',
      'enfermeiro',
      'tecnico_enfermagem',
      'nutricionista',
      'assistente_social',
      'auxiliar_administrativo',
      'usuario'
    ],
    default: 'usuario'
  },
  cpf: String,
  crmUf: String,
  crm: String,
  especialidade: String,
  telefone: String,
  foto: String,
  permissoes: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['ativo', 'inativo'],
    default: 'ativo'
  },
  ultimoAcesso: Date
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.senha;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Índices
usuarioSchema.index({ empresaId: 1, email: 1 });
usuarioSchema.index({ empresaId: 1, status: 1 });

// Hash da senha antes de salvar
usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  this.senha = await bcrypt.hash(this.senha, 10);
  next();
});

// Método para comparar senha
usuarioSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.senha);
};

// Métodos Estáticos para compatibilidade com o controller
usuarioSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

usuarioSchema.statics.findByEmailWithPassword = function(email) {
  return this.findOne({ email }).select('+senha');
};

usuarioSchema.statics.verifyPassword = async function(candidatePassword, hashedPassword) {
  return bcrypt.compare(candidatePassword, hashedPassword);
};

usuarioSchema.statics.updateLastAccess = function(id) {
  return this.findByIdAndUpdate(id, { ultimoAcesso: new Date() });
};

usuarioSchema.statics.findByEmpresa = function(empresaId, limit = 50, offset = 0) {
  return this.find({ empresaId })
    .select('-senha')
    .limit(limit)
    .skip(offset)
    .sort({ createdAt: -1 });
};

usuarioSchema.statics.countByEmpresa = function(empresaId) {
  return this.countDocuments({ empresaId });
};

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;