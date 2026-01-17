import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Prescricao = sequelize.define('Prescricao', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  pacienteId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  nutricionistaId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  empresaId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  tipo: {
    type: DataTypes.ENUM('nutricional', 'medicamentosa', 'mista'),
    defaultValue: 'nutricional'
  },
  descricao: {
    type: DataTypes.TEXT
  },
  observacoes: {
    type: DataTypes.TEXT
  },
  itens: {
    // Usar JSON para compatibilidade com SQLite no desenvolvimento
    type: DataTypes.JSON,
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('ativa', 'finalizada', 'cancelada'),
    defaultValue: 'ativa'
  }
}, {
  tableName: 'prescricoes',
  timestamps: true
});

export default Prescricao;
