import mongoose from 'mongoose';

const alimentoSchema = new mongoose.Schema({
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
  categoria: {
    type: String, // ex: 'Perecível', 'Não Perecível', 'Bebida'
    default: 'Geral'
  },
  unidade: {
    type: String,
    required: true, // ex: 'kg', 'litro', 'unidade', 'pacote'
    default: 'unidade'
  },
  quantidade: {
    type: Number,
    required: true,
    default: 0
  },
  quantidadeMinima: {
    type: Number,
    default: 5
  },
  validade: {
    type: Date
  },
  fornecedor: {
    type: String,
    trim: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices para multi-tenant
alimentoSchema.index({ empresaId: 1, nome: 1 });
alimentoSchema.index({ empresaId: 1, quantidade: 1 });

export default mongoose.model('Alimento', alimentoSchema);
