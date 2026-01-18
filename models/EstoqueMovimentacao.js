import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const EstoqueMovimentacao = sequelize.define('EstoqueMovimentacao', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  empresaId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  estoqueItemId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  usuarioId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  usuarioNome: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tipo: {
    type: DataTypes.ENUM('entrada', 'saida'),
    allowNull: false
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  motivo: {
    type: DataTypes.STRING
  },
  observacao: {
    type: DataTypes.TEXT
  },
  data: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'estoque_movimentacoes',
  timestamps: true
});

export default EstoqueMovimentacao;
