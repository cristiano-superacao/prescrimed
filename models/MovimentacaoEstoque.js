import mongoose from 'mongoose';

const movimentacaoEstoqueSchema = new mongoose.Schema({
  empresaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empresa',
    required: true,
    index: true
  },
  tipo: {
    type: String,
    enum: ['entrada', 'saida'],
    required: true
  },
  itemTipo: {
    type: String,
    enum: ['Medicamento', 'Alimento'],
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'itemTipo'
  },
  quantidade: {
    type: Number,
    required: true
  },
  data: {
    type: Date,
    default: Date.now
  },
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  motivo: {
    type: String, // ex: 'Compra', 'Uso', 'Vencimento', 'Ajuste'
    trim: true
  },
  observacao: {
    type: String
  }
}, {
  timestamps: true
});

// Índices para multi-tenant
movimentacaoEstoqueSchema.index({ empresaId: 1, data: -1 });
movimentacaoEstoqueSchema.index({ empresaId: 1, itemId: 1 });

export default mongoose.model('MovimentacaoEstoque', movimentacaoEstoqueSchema);
