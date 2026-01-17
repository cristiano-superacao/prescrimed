import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SessaoFisio = sequelize.define('SessaoFisio', {
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
  protocolo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dataHora: {
    type: DataTypes.DATE,
    allowNull: false
  },
  duracao: {
    type: DataTypes.INTEGER,
    defaultValue: 60
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'fisio_sessoes',
  timestamps: true
});

export default SessaoFisio;
