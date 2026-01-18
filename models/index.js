import sequelize from '../config/database.js';
import Usuario from './Usuario.js';
import Empresa from './Empresa.js';
import Paciente from './Paciente.js';
import Prescricao from './Prescricao.js';
import Agendamento from './Agendamento.js';
import CasaRepousoLeito from './CasaRepousoLeito.js';
import Pet from './Pet.js';
import SessaoFisio from './SessaoFisio.js';
import EstoqueItem from './EstoqueItem.js';
import EstoqueMovimentacao from './EstoqueMovimentacao.js';
import FinanceiroTransacao from './FinanceiroTransacao.js';

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

// Relacionamentos de Agendamento
Empresa.hasMany(Agendamento, { foreignKey: 'empresaId', as: 'agendamentos' });
Agendamento.belongsTo(Empresa, { foreignKey: 'empresaId', as: 'empresa' });

Paciente.hasMany(Agendamento, { foreignKey: 'pacienteId', as: 'agendamentos' });
Agendamento.belongsTo(Paciente, { foreignKey: 'pacienteId', as: 'paciente' });

Usuario.hasMany(Agendamento, { foreignKey: 'usuarioId', as: 'agendamentos' });
Agendamento.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'responsavel' });

// Módulos por tipo de sistema
// Casa de Repouso
Empresa.hasMany(CasaRepousoLeito, { foreignKey: 'empresaId', as: 'leitos' });
CasaRepousoLeito.belongsTo(Empresa, { foreignKey: 'empresaId', as: 'empresa' });

// PetShop
Empresa.hasMany(Pet, { foreignKey: 'empresaId', as: 'pets' });
Pet.belongsTo(Empresa, { foreignKey: 'empresaId', as: 'empresa' });

// Fisioterapia
Empresa.hasMany(SessaoFisio, { foreignKey: 'empresaId', as: 'sessoesFisio' });
SessaoFisio.belongsTo(Empresa, { foreignKey: 'empresaId', as: 'empresa' });

// Estoque
Empresa.hasMany(EstoqueItem, { foreignKey: 'empresaId', as: 'estoqueItens' });
EstoqueItem.belongsTo(Empresa, { foreignKey: 'empresaId', as: 'empresa' });

EstoqueItem.hasMany(EstoqueMovimentacao, { foreignKey: 'estoqueItemId', as: 'movimentacoes' });
EstoqueMovimentacao.belongsTo(EstoqueItem, { foreignKey: 'estoqueItemId', as: 'item' });

Empresa.hasMany(EstoqueMovimentacao, { foreignKey: 'empresaId', as: 'estoqueMovimentacoes' });
EstoqueMovimentacao.belongsTo(Empresa, { foreignKey: 'empresaId', as: 'empresa' });

// Financeiro
Empresa.hasMany(FinanceiroTransacao, { foreignKey: 'empresaId', as: 'financeiroTransacoes' });
FinanceiroTransacao.belongsTo(Empresa, { foreignKey: 'empresaId', as: 'empresa' });

Paciente.hasMany(FinanceiroTransacao, { foreignKey: 'pacienteId', as: 'transacoesFinanceiras' });
FinanceiroTransacao.belongsTo(Paciente, { foreignKey: 'pacienteId', as: 'paciente' });

export { sequelize, Usuario, Empresa, Paciente, Prescricao, Agendamento, CasaRepousoLeito, Pet, SessaoFisio, EstoqueItem, EstoqueMovimentacao, FinanceiroTransacao };
