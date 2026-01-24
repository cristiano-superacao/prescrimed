import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Agendamento = sequelize.define('Agendamento', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  pacienteId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'pacientes',
      key: 'id'
    }
  },
  empresaId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'empresas',
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
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  dataHora: {
    type: DataTypes.DATE,
    allowNull: false
  },
  duracao: {
    type: DataTypes.INTEGER,
    defaultValue: 60,
    comment: 'Duração em minutos'
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Compromisso'
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'agendado'
  },
  local: {
    type: DataTypes.STRING,
    allowNull: true
  },
  participante: {
    type: DataTypes.STRING,
    allowNull: true
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'agendamentos',
  timestamps: true
});

export default Agendamento;
