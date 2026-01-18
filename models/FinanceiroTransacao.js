import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const FinanceiroTransacao = sequelize.define('FinanceiroTransacao', {
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
  tipo: {
    type: DataTypes.ENUM('receita', 'despesa'),
    allowNull: false
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: false
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: true
  },
  data: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pago', 'pendente'),
    allowNull: false,
    defaultValue: 'pendente'
  },
  formaPagamento: {
    type: DataTypes.STRING,
    allowNull: true
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'financeiro_transacoes',
  timestamps: true
});

export default FinanceiroTransacao;
