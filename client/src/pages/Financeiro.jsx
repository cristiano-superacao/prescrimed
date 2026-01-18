import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight,
  Calendar,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { financeiroService } from '../services/financeiro.service';
import TransacaoModal from '../components/TransacaoModal';
import toast from 'react-hot-toast';
import { errorMessage } from '../utils/toastMessages';
import { formatCurrency } from '../utils/currency';
import PageHeader from '../components/common/PageHeader';
import StatsCard from '../components/common/StatsCard';
import SearchFilterBar from '../components/common/SearchFilterBar';
import EmptyState from '../components/common/EmptyState';

export default function Financeiro() {
  const [transacoes, setTransacoes] = useState([]);
  const [stats, setStats] = useState({
    receitas: 0,
    despesas: 0,
    saldo: 0,
    receitasPendentes: 0,
    despesasPendentes: 0
  });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTransacao, setSelectedTransacao] = useState(null);
  const [filter, setFilter] = useState({
    tipo: '',
    status: '',
    search: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [transacoesData, statsData] = await Promise.all([
        financeiroService.getAll(),
        financeiroService.getStats()
      ]);
      setTransacoes(Array.isArray(transacoesData) ? transacoesData : []);
      
      // Garantir que todos os valores sejam numéricos válidos
      setStats({
        receitas: Number(statsData?.receitas) || 0,
        despesas: Number(statsData?.despesas) || 0,
        saldo: Number(statsData?.saldo) || 0,
        receitasPendentes: Number(statsData?.receitasPendentes) || 0,
        despesasPendentes: Number(statsData?.despesasPendentes) || 0
      });
    } catch (error) {
      console.error(error);
      toast.error(errorMessage('load', 'dados financeiros'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (transacao) => {
    setSelectedTransacao(transacao);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta transação?')) return;
    try {
      await financeiroService.delete(id);
      toast.success('Transação excluída');
      loadData();
    } catch (error) {
      toast.error(errorMessage('delete', 'transação'));
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedTransacao(null);
    loadData();
  };

  const filteredTransacoes = transacoes.filter(t => {
    const matchesSearch = t.descricao.toLowerCase().includes(filter.search.toLowerCase()) ||
                          t.categoria.toLowerCase().includes(filter.search.toLowerCase());
    const matchesTipo = filter.tipo ? t.tipo === filter.tipo : true;
    const matchesStatus = filter.status ? t.status === filter.status : true;
    return matchesSearch && matchesTipo && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <PageHeader
        label="Administrativo"
        title="Financeiro"
        subtitle="Gestão completa de receitas, despesas e fluxo de caixa."
      >
        <button
          onClick={() => setModalOpen(true)}
          className="btn btn-primary flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20"
        >
          <Plus size={20} /> Nova Transação
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={DollarSign}
          label="Saldo Atual"
          value={formatCurrency(stats.saldo)}
          description="Balanço geral do mês"
          color={stats.saldo >= 0 ? 'primary' : 'red'}
        />
        <StatsCard
          icon={TrendingUp}
          label="Receitas"
          value={formatCurrency(stats.receitas)}
          description={
            <span className="flex items-center gap-1">
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                +{formatCurrency(stats.receitasPendentes)}
              </span>
              <span className="text-xs text-slate-400">a receber</span>
            </span>
          }
          color="emerald"
        />
        <StatsCard
          icon={TrendingDown}
          label="Despesas"
          value={formatCurrency(stats.despesas)}
          description={
            <span className="flex items-center gap-1">
              <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                +{formatCurrency(stats.despesasPendentes)}
              </span>
              <span className="text-xs text-slate-400">a pagar</span>
            </span>
          }
          color="red"
        />
        <StatsCard
          icon={Clock}
          label="Previsão"
          value={formatCurrency(stats.saldo + stats.receitasPendentes - stats.despesasPendentes)}
          description="Saldo projetado"
          color="purple"
        />
      </div>

      <SearchFilterBar
        searchTerm={filter.search}
        onSearchChange={(val) => setFilter({ ...filter, search: val })}
        placeholder="Buscar transações..."
      >
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <select
            value={filter.tipo}
            onChange={(e) => setFilter({ ...filter, tipo: e.target.value })}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:border-primary-500"
          >
            <option value="">Todos os tipos</option>
            <option value="receita">Receitas</option>
            <option value="despesa">Despesas</option>
          </select>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:border-primary-500"
          >
            <option value="">Todos os status</option>
            <option value="pago">Pago</option>
            <option value="pendente">Pendente</option>
          </select>
        </div>
      </SearchFilterBar>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredTransacoes.length > 0 ? (
          <>
            {/* Mobile: cards */}
            <div className="md:hidden p-4 sm:p-6 space-y-3">
              {filteredTransacoes.map((transacao) => (
                <div
                  key={transacao._id}
                  className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{transacao.descricao}</p>
                      <p className="text-sm text-slate-600 truncate">{transacao.categoria}</p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border shrink-0 ${
                        transacao.status === 'pago'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}
                    >
                      {transacao.status === 'pago' ? (
                        <><CheckCircle2 size={12} /> Pago</>
                      ) : (
                        <><Clock size={12} /> Pendente</>
                      )}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        transacao.tipo === 'receita'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {transacao.tipo === 'receita' ? (
                        <><ArrowUpRight size={12} /> Receita</>
                      ) : (
                        <><ArrowDownRight size={12} /> Despesa</>
                      )}
                    </span>

                    <span className="inline-flex items-center gap-2 text-xs text-slate-600">
                      <Calendar size={14} className="text-slate-400" />
                      {new Date(transacao.data).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-slate-500">Valor</span>
                    <span
                      className={`font-semibold ${
                        transacao.tipo === 'receita' ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {transacao.tipo === 'despesa' ? '-' : '+'}{formatCurrency(transacao.valor)}
                    </span>
                  </div>

                  {transacao.pacienteId && (
                    <p className="mt-2 text-xs text-slate-500 truncate">Paciente: {transacao.pacienteId.nome}</p>
                  )}

                  <div className="mt-4 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(transacao)}
                      className="px-3 py-2 text-slate-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors text-sm font-semibold"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(transacao._id)}
                      className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm font-semibold"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Descrição</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Categoria</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Valor</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransacoes.map((transacao) => (
                  <tr key={transacao._id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${transacao.tipo === 'receita' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                          {transacao.tipo === 'receita' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{transacao.descricao}</p>
                          {transacao.pacienteId && (
                            <p className="text-xs text-slate-500">{transacao.pacienteId.nome}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        {transacao.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400" />
                        {new Date(transacao.data).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className={`px-6 py-4 font-semibold ${transacao.tipo === 'receita' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {transacao.tipo === 'despesa' ? '-' : '+'}{formatCurrency(transacao.valor)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        transacao.status === 'pago' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {transacao.status === 'pago' ? (
                          <><CheckCircle2 size={12} /> Pago</>
                        ) : (
                          <><Clock size={12} /> Pendente</>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(transacao)}
                          className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(transacao._id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="p-8">
            <EmptyState
              icon={DollarSign}
              title="Nenhuma transação encontrada"
              description="Comece adicionando uma nova receita ou despesa."
              action={
                <button onClick={() => setModalOpen(true)} className="btn btn-primary mt-4">
                  Nova Transação
                </button>
              }
            />
          </div>
        )}
      </div>

      {modalOpen && (
        <TransacaoModal 
          transacao={selectedTransacao} 
          onClose={handleModalClose} 
        />
      )}
    </div>
  );
}
