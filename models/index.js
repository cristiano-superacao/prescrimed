import sequelize from '../config/database.js';
import Usuario from './Usuario.js';
import Empresa from './Empresa.js';
import Paciente from './Paciente.js';
import Prescricao from './Prescricao.js';

// Relacionamentos
Empresa.hasMany(Usuario, { foreignKey: 'empresaId', as: 'usuarios' });
Usuario.belongsTo(Empresa, { foreignKey: 'empresaId', as: 'empresa' });

Empresa.hasMany(Paciente, { foreignKey: 'empresaId', as: 'pacientes' });
Paciente.belongsTo(Empresa, { foreignKey: 'empresaId', as: 'empresa' });

Empresa.hasMany(Prescricao, { foreignKey: 'empresaId', as: 'prescricoes' });
Prescricao.belongsTo(Empresa, { foreignKey: 'empresaId', as: 'empresa' });

Paciente.hasMany(Prescricao, { foreignKey: 'pacienteId', as: 'prescricoes' });
Prescricao.belongsTo(Paciente, { foreignKey: 'pacienteId', as: 'paciente' });

Usuario.hasMany(Prescricao, { foreignKey: 'nutricionistaId', as: 'prescricoes' });
Prescricao.belongsTo(Usuario, { foreignKey: 'nutricionistaId', as: 'nutricionista' });

export { sequelize, Usuario, Empresa, Paciente, Prescricao };
