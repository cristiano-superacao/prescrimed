import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// Tabela de sequência por tipo de empresa (tipoSistema)
// Garante geração concorrente segura de códigos como Casa_01, Pet_01, Fisio_01.
const EmpresaSequencia = sequelize.define(
  'EmpresaSequencia',
  {
    tipoSistema: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    ultimoNumero: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    tableName: 'empresa_sequencias',
    timestamps: false
  }
);

export default EmpresaSequencia;
