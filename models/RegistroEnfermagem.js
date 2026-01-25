import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const RegistroEnfermagem = sequelize.define('RegistroEnfermagem', {
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
  usuarioId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'usuarios',
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
  tipo: {
    type: DataTypes.ENUM(
      'evolucao',
      'sinais_vitais',
      'administracao_medicamento',
      'curativo',
      'intercorrencia',
      'admissao',
      'alta',
      'transferencia',
      'outro'
    ),
    allowNull: false,
    defaultValue: 'evolucao'
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  // Sinais Vitais (JSON)
  sinaisVitais: {
    type: DataTypes.TEXT, // Armazena JSON string
    allowNull: true,
    comment: 'JSON com PA, FC, FR, Temp, SatO2, Glicemia'
  },
  // Avaliação de Risco
  riscoQueda: {
    type: DataTypes.ENUM('baixo', 'medio', 'alto'),
    allowNull: true
  },
  riscoLesao: {
    type: DataTypes.ENUM('baixo', 'medio', 'alto'),
    allowNull: true
  },
  // Estado Geral
  estadoGeral: {
    type: DataTypes.ENUM('bom', 'regular', 'grave', 'critico'),
    allowNull: true,
    defaultValue: 'bom'
  },
  // Alertas
  alerta: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  prioridade: {
    type: DataTypes.ENUM('baixa', 'media', 'alta', 'urgente'),
    allowNull: true,
    defaultValue: 'baixa'
  },
  // Dados adicionais
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Anexos (JSON array de URLs)
  anexos: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'JSON array de URLs de arquivos/imagens'
  }

}, {
  tableName: 'RegistrosEnfermagem',
  timestamps: true
});

export default RegistroEnfermagem;
