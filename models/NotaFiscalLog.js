import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const NotaFiscalLog = sequelize.define('NotaFiscalLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  empresaId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  notaFiscalId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  nivel: {
    type: DataTypes.ENUM('info', 'warning', 'error'),
    allowNull: false,
    defaultValue: 'info'
  },
  mensagem: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  detalhes: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'nota_fiscal_logs',
  timestamps: true,
  indexes: [
    { fields: ['empresaId'] },
    { fields: ['notaFiscalId'] },
    { fields: ['nivel'] }
  ]
});

export default NotaFiscalLog;