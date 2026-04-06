import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const PedidoItem = sequelize.define('PedidoItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  pedidoId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  catalogoItemId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  tipo: {
    type: DataTypes.ENUM('produto', 'servico', 'avulso'),
    allowNull: false,
    defaultValue: 'avulso'
  },
  descricao: {
    type: DataTypes.STRING(180),
    allowNull: false
  },
  quantidade: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 1
  },
  valorUnitario: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },
  metadados: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'pedido_itens',
  timestamps: true,
  indexes: [
    { fields: ['pedidoId'] },
    { fields: ['catalogoItemId'] }
  ]
});

export default PedidoItem;