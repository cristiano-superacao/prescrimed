import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Pedido = sequelize.define('Pedido', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  empresaId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  pacienteId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  clienteNome: {
    type: DataTypes.STRING(140),
    allowNull: true
  },
  origem: {
    type: DataTypes.ENUM('balcao', 'online', 'interno'),
    allowNull: false,
    defaultValue: 'balcao'
  },
  status: {
    type: DataTypes.ENUM('rascunho', 'aberto', 'pago', 'faturado', 'cancelado'),
    allowNull: false,
    defaultValue: 'aberto'
  },
  pagamentoStatus: {
    type: DataTypes.ENUM('pendente', 'parcial', 'pago', 'falhou', 'estornado'),
    allowNull: false,
    defaultValue: 'pendente'
  },
  subtotal: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },
  desconto: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metadados: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'pedidos',
  timestamps: true,
  indexes: [
    { fields: ['empresaId'] },
    { fields: ['pacienteId'] },
    { fields: ['status'] },
    { fields: ['pagamentoStatus'] },
    { fields: ['origem'] },
    { fields: ['createdAt'] }
  ]
});

export default Pedido;