import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const NotaFiscal = sequelize.define('NotaFiscal', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  empresaId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  pedidoId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  tipoDocumento: {
    type: DataTypes.ENUM('nf-e', 'nfs-e'),
    allowNull: false,
    defaultValue: 'nfs-e'
  },
  status: {
    type: DataTypes.ENUM('pendente', 'processando', 'emitida', 'rejeitada', 'cancelada', 'simulada'),
    allowNull: false,
    defaultValue: 'pendente'
  },
  numero: {
    type: DataTypes.STRING(40),
    allowNull: true
  },
  serie: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  chaveAcesso: {
    type: DataTypes.STRING(64),
    allowNull: true
  },
  provedor: {
    type: DataTypes.STRING(80),
    allowNull: true
  },
  ambiente: {
    type: DataTypes.ENUM('homologacao', 'producao'),
    allowNull: false,
    defaultValue: 'homologacao'
  },
  xmlUrl: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  pdfUrl: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  payload: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  resposta: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  emitidaEm: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'notas_fiscais',
  timestamps: true,
  indexes: [
    { fields: ['empresaId'] },
    { fields: ['pedidoId'] },
    { fields: ['status'] },
    { fields: ['tipoDocumento'] },
    { fields: ['numero'] }
  ]
});

export default NotaFiscal;