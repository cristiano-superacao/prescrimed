import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Paciente = sequelize.define('Paciente', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cpf: {
    type: DataTypes.STRING,
    unique: true
  },
  dataNascimento: {
    type: DataTypes.DATEONLY
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  },
  telefone: {
    type: DataTypes.STRING
  },
  endereco: {
    type: DataTypes.TEXT
  },
  empresaId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  observacoes: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'pacientes',
  timestamps: true
});

export default Paciente;
