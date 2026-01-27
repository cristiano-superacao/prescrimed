import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const TIPO_SISTEMA_VALUES = ['casa-repouso', 'fisioterapia', 'petshop'];

function onlyDigits(value) {
  if (value == null) return '';
  return String(value).replace(/\D/g, '');
}

function formatEmpresaCodigo(tipoSistema, numero) {
  const prefix = tipoSistema === 'petshop' ? 'Pet' : (tipoSistema === 'fisioterapia' ? 'Fisio' : 'Casa');
  const padded = String(numero).padStart(2, '0');
  return `${prefix}_${padded}`;
}

async function allocateNextNumero(tipoSistema, transaction) {
  // Otimizado para Postgres (Railway): UPSERT atômico com RETURNING.
  const dialect = typeof sequelize.getDialect === 'function' ? sequelize.getDialect() : undefined;
  if (dialect === 'postgres') {
    const [rows] = await sequelize.query(
      `INSERT INTO empresa_sequencias ("tipoSistema", "ultimoNumero")
       VALUES (:tipoSistema, 1)
       ON CONFLICT ("tipoSistema")
       DO UPDATE SET "ultimoNumero" = empresa_sequencias."ultimoNumero" + 1
       RETURNING "ultimoNumero";`,
      {
        replacements: { tipoSistema },
        transaction
      }
    );
    const numero = Array.isArray(rows) ? rows?.[0]?.ultimoNumero : rows?.ultimoNumero;
    return Number(numero);
  }

  // Fallback genérico: lock pessimista por linha (menos eficiente, mas funcional).
  const { default: EmpresaSequencia } = await import('./EmpresaSequencia.js');
  const [seq] = await EmpresaSequencia.findOrCreate({
    where: { tipoSistema },
    defaults: { ultimoNumero: 0 },
    transaction
  });

  await seq.reload({ transaction, lock: transaction?.LOCK?.UPDATE });
  seq.ultimoNumero = Number(seq.ultimoNumero || 0) + 1;
  await seq.save({ transaction });
  return Number(seq.ultimoNumero);
}

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
  // Código sequencial por tipoSistema (ex.: Casa_01, Pet_01, Fisio_01)
  codigo: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true
  },
  codigoNumero: {
    type: DataTypes.INTEGER,
    allowNull: true
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
  timestamps: true,
  indexes: [
    { unique: true, fields: ['tipoSistema', 'codigoNumero'] }
  ]
});

Empresa.beforeValidate((empresa) => {
  if (empresa?.tipoSistema && !TIPO_SISTEMA_VALUES.includes(empresa.tipoSistema)) {
    // Mantém coerência com enum do modelo
    empresa.tipoSistema = 'casa-repouso';
  }
  if (empresa?.cnpj != null) {
    const digits = onlyDigits(empresa.cnpj);
    empresa.cnpj = digits || null;
  }
});

Empresa.beforeCreate(async (empresa, options) => {
  if (empresa.codigo) return;
  const tipoSistema = empresa.tipoSistema || 'casa-repouso';

  let localTx = null;
  const transaction = options?.transaction;
  try {
    if (transaction) {
      const numero = await allocateNextNumero(tipoSistema, transaction);
      empresa.codigoNumero = numero;
      empresa.codigo = formatEmpresaCodigo(tipoSistema, numero);
      return;
    }

    // Garante atomicidade se alguém criar Empresa sem passar transaction.
    localTx = await sequelize.transaction();
    const numero = await allocateNextNumero(tipoSistema, localTx);
    empresa.codigoNumero = numero;
    empresa.codigo = formatEmpresaCodigo(tipoSistema, numero);
    await localTx.commit();
  } catch (e) {
    if (localTx) await localTx.rollback();
    throw e;
  }
});

export default Empresa;
