import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CatalogoItem = sequelize.define('CatalogoItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  empresaId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  tipo: {
    type: DataTypes.ENUM('produto', 'servico'),
    allowNull: false,
    defaultValue: 'produto'
  },
  nome: {
    type: DataTypes.STRING(140),
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  categoria: {
    type: DataTypes.STRING(80),
    allowNull: true
  },
  sku: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  preco: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },
  estoqueAtual: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },
  estoqueMinimo: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },
  unidade: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'un'
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  metadados: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'catalogo_itens',
  timestamps: true,
  indexes: [
    { fields: ['empresaId'] },
    { fields: ['tipo'] },
    { fields: ['ativo'] },
    { fields: ['categoria'] },
    { unique: true, fields: ['empresaId', 'sku'] }
  ]
});

export default CatalogoItem;