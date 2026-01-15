import mongoose from 'mongoose';

const medicamentoSchema = new mongoose.Schema({
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
  descricao: {
    type: String,
    trim: true
  },
  unidade: {
    type: String,
    required: true, // ex: 'comprimido', 'ml', 'caixa', 'frasco'
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
  lote: {
    type: String,
    trim: true
  },
  validade: {
    type: Date
  },
  fabricante: {
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
medicamentoSchema.index({ empresaId: 1, nome: 1 });
medicamentoSchema.index({ empresaId: 1, quantidade: 1 });

export default mongoose.model('Medicamento', medicamentoSchema);
