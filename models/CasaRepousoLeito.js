import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CasaRepousoLeito = sequelize.define('CasaRepousoLeito', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  empresaId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  numero: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('disponivel', 'ocupado', 'manutencao'),
    defaultValue: 'disponivel'
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'cr_leitos',
  timestamps: true
});

export default CasaRepousoLeito;
