import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const EstoqueItem = sequelize.define('EstoqueItem', {
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
    type: DataTypes.ENUM('medicamento', 'alimento'),
    allowNull: false
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  quantidadeMinima: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  unidade: {
    type: DataTypes.STRING
  },
  categoria: {
    type: DataTypes.STRING
  },
  lote: {
    type: DataTypes.STRING
  },
  validade: {
    type: DataTypes.DATEONLY
  },
  precoUnitario: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  fornecedor: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'estoque_itens',
  timestamps: true
});

export default EstoqueItem;
