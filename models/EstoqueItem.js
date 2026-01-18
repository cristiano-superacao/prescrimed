import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const EstoqueItem = sequelize.define('EstoqueItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  empresaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Empresas',
      key: 'id'
    }
  },
  nome: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tipo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'medicamento',
    validate: {
      isIn: [['medicamento', 'alimento', 'material', 'outros']]
    }
  },
  categoria: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'outros'
  },
  unidade: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'un'
  },
  quantidade: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  quantidadeMinima: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
  },
  valorUnitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
  },
  localizacao: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  lote: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  validade: {
    type: DataTypes.DATE,
    allowNull: true
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'EstoqueItens',
  timestamps: true,
  indexes: [
    { fields: ['empresaId'] },
    { fields: ['tipo'] },
    { fields: ['categoria'] },
    { fields: ['ativo'] }
  ]
});

export default EstoqueItem;
