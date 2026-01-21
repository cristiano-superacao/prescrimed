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
    allowNull: false,
    references: {
      model: 'empresas',
      key: 'id'
    }
  },
  estoqueItemId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'EstoqueItens',
      key: 'id'
    }
  },
  usuarioId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  tipo: {
    type: DataTypes.ENUM('entrada', 'saida', 'ajuste'),
    allowNull: false
  },
  quantidade: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  quantidadeAnterior: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  quantidadeNova: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  valorUnitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  valorTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  motivo: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  dataMovimentacao: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'EstoqueMovimentacoes',
  timestamps: true,
  indexes: [
    { fields: ['empresaId'] },
    { fields: ['estoqueItemId'] },
    { fields: ['tipo'] },
    { fields: ['dataMovimentacao'] }
  ]
});

export default EstoqueMovimentacao;
