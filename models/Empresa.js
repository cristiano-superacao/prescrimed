import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Empresa = sequelize.define('Empresa', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tipoSistema: {
    type: DataTypes.ENUM('casa-repouso', 'fisioterapia', 'petshop'),
    allowNull: false,
    defaultValue: 'casa-repouso'
  },
  cnpj: {
    type: DataTypes.STRING,
    unique: true
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
  plano: {
    type: DataTypes.ENUM('basico', 'profissional', 'empresa'),
    defaultValue: 'basico'
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'empresas',
  timestamps: true
});

export default Empresa;
