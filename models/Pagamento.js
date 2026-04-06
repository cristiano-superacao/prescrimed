import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Pagamento = sequelize.define('Pagamento', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  empresaId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  pedidoId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  metodo: {
    type: DataTypes.ENUM('pix', 'cartao', 'dinheiro', 'boleto', 'convenio'),
    allowNull: false,
    defaultValue: 'pix'
  },
  gateway: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pendente', 'aprovado', 'recusado', 'estornado'),
    allowNull: false,
    defaultValue: 'pendente'
  },
  valor: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },
  externalId: {
    type: DataTypes.STRING(120),
    allowNull: true
  },
  pagoEm: {
    type: DataTypes.DATE,
    allowNull: true
  },
  metadados: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'pagamentos',
  timestamps: true,
  indexes: [
    { fields: ['empresaId'] },
    { fields: ['pedidoId'] },
    { fields: ['status'] },
    { fields: ['metodo'] }
  ]
});

export default Pagamento;