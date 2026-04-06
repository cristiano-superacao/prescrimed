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
import RegistroEnfermagem from './RegistroEnfermagem.js';
import EmpresaSequencia from './EmpresaSequencia.js';
import CatalogoItem from './CatalogoItem.js';
import Pedido from './Pedido.js';
import PedidoItem from './PedidoItem.js';
import Pagamento from './Pagamento.js';
import NotaFiscal from './NotaFiscal.js';
import NotaFiscalLog from './NotaFiscalLog.js';

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

// Registros de Enfermagem
Empresa.hasMany(RegistroEnfermagem, { foreignKey: 'empresaId', as: 'registrosEnfermagem' });
RegistroEnfermagem.belongsTo(Empresa, { foreignKey: 'empresaId', as: 'empresa' });

Paciente.hasMany(RegistroEnfermagem, { foreignKey: 'pacienteId', as: 'registrosEnfermagem' });
RegistroEnfermagem.belongsTo(Paciente, { foreignKey: 'pacienteId', as: 'paciente' });

Usuario.hasMany(RegistroEnfermagem, { foreignKey: 'usuarioId', as: 'registrosEnfermagem' });
RegistroEnfermagem.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'enfermeiro' });

// Comercial/Fiscal
Empresa.hasMany(CatalogoItem, { foreignKey: 'empresaId', as: 'catalogoItens' });
CatalogoItem.belongsTo(Empresa, { foreignKey: 'empresaId', as: 'empresa' });

Empresa.hasMany(Pedido, { foreignKey: 'empresaId', as: 'pedidos' });
Pedido.belongsTo(Empresa, { foreignKey: 'empresaId', as: 'empresa' });

Paciente.hasMany(Pedido, { foreignKey: 'pacienteId', as: 'pedidos' });
Pedido.belongsTo(Paciente, { foreignKey: 'pacienteId', as: 'paciente' });

Pedido.hasMany(PedidoItem, { foreignKey: 'pedidoId', as: 'itens' });
PedidoItem.belongsTo(Pedido, { foreignKey: 'pedidoId', as: 'pedido' });

CatalogoItem.hasMany(PedidoItem, { foreignKey: 'catalogoItemId', as: 'pedidoItens' });
PedidoItem.belongsTo(CatalogoItem, { foreignKey: 'catalogoItemId', as: 'catalogoItem' });

Empresa.hasMany(Pagamento, { foreignKey: 'empresaId', as: 'pagamentos' });
Pagamento.belongsTo(Empresa, { foreignKey: 'empresaId', as: 'empresa' });

Pedido.hasMany(Pagamento, { foreignKey: 'pedidoId', as: 'pagamentos' });
Pagamento.belongsTo(Pedido, { foreignKey: 'pedidoId', as: 'pedido' });

Empresa.hasMany(NotaFiscal, { foreignKey: 'empresaId', as: 'notasFiscais' });
NotaFiscal.belongsTo(Empresa, { foreignKey: 'empresaId', as: 'empresa' });

Pedido.hasMany(NotaFiscal, { foreignKey: 'pedidoId', as: 'notasFiscais' });
NotaFiscal.belongsTo(Pedido, { foreignKey: 'pedidoId', as: 'pedido' });

NotaFiscal.hasMany(NotaFiscalLog, { foreignKey: 'notaFiscalId', as: 'logs' });
NotaFiscalLog.belongsTo(NotaFiscal, { foreignKey: 'notaFiscalId', as: 'notaFiscal' });

Empresa.hasMany(NotaFiscalLog, { foreignKey: 'empresaId', as: 'notaFiscalLogs' });
NotaFiscalLog.belongsTo(Empresa, { foreignKey: 'empresaId', as: 'empresa' });

export { sequelize, Usuario, Empresa, Paciente, Prescricao, Agendamento, CasaRepousoLeito, Pet, SessaoFisio, EstoqueItem, EstoqueMovimentacao, FinanceiroTransacao, RegistroEnfermagem, CatalogoItem, Pedido, PedidoItem, Pagamento, NotaFiscal, NotaFiscalLog };

// Export adicional (não possui relacionamentos)
export { EmpresaSequencia };
