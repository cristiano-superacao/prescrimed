import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Pet = sequelize.define('Pet', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  empresaId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  especie: {
    type: DataTypes.STRING,
    allowNull: false
  },
  raca: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tutorNome: {
    type: DataTypes.STRING,
    allowNull: true
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'petshop_pets',
  timestamps: true
});

export default Pet;
