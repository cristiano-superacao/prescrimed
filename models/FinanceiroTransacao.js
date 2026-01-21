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
    allowNull: false,
    references: {
      model: 'empresas',
      key: 'id'
    }
  },
  pacienteId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'pacientes',
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
    type: DataTypes.ENUM('receita', 'despesa'),
    allowNull: false
  },
  categoria: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descricao: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  dataVencimento: {
    type: DataTypes.DATE,
    allowNull: false
  },
  dataPagamento: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pendente', 'pago', 'cancelado'),
    allowNull: false,
    defaultValue: 'pendente'
  },
  formaPagamento: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  recorrente: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  periodoRecorrencia: {
    type: DataTypes.STRING(20),
    allowNull: true
  }
}, {
  tableName: 'FinanceiroTransacoes',
  timestamps: true,
  indexes: [
    { fields: ['empresaId'] },
    { fields: ['pacienteId'] },
    { fields: ['tipo'] },
    { fields: ['status'] },
    { fields: ['dataVencimento'] }
  ]
});

export default FinanceiroTransacao;
