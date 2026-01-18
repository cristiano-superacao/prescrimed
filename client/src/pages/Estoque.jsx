import { useState, useEffect } from 'react';
import { 
  Pill, 
  Utensils, 
  Plus, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  AlertTriangle,
  Package,
  X,
  Calendar,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { estoqueService } from '../services/estoque.service';
import toast from 'react-hot-toast';
import { errorMessage, apiErrorMessage } from '../utils/toastMessages';
import PageHeader from '../components/common/PageHeader';
import StatsCard from '../components/common/StatsCard';
import SearchFilterBar from '../components/common/SearchFilterBar';
import EmptyState from '../components/common/EmptyState';
import useLockBodyScroll from '../utils/useLockBodyScroll';

export default function Estoque() {
  const [activeTab, setActiveTab] = useState('medicamentos'); // medicamentos, alimentos
  const [modalOpen, setModalOpen] = useState(null); // null, 'cadastrar', 'entrada', 'saida'
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [showHistorico, setShowHistorico] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useLockBodyScroll(Boolean(modalOpen || showHistorico));

  // Form States
  const [formData, setFormData] = useState({});
  const [movimentacaoData, setMovimentacaoData] = useState({ quantidade: '', motivo: '', observacao: '' });

  useEffect(() => {
    loadItems();
    loadStats();
  }, [activeTab]);

  useEffect(() => {
    if (!modalOpen && !showHistorico) return;

    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      if (showHistorico) {
        setShowHistorico(false);
        return;
      }
      closeModal();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [modalOpen, showHistorico]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = activeTab === 'medicamentos' 
        ? await estoqueService.getMedicamentos() 
        : await estoqueService.getAlimentos();
      
      const itemsList = Array.isArray(data) ? data : (data.items || data.medicamentos || data.alimentos || []);
      setItems(itemsList);
    } catch (error) {
      toast.error(errorMessage('load', 'itens'));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await estoqueService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const loadMovimentacoes = async () => {
    try {
      const data = await estoqueService.getMovimentacoes();
      setMovimentacoes(data.movimentacoes || []);
      setShowHistorico(true);
    } catch (error) {
      toast.error(errorMessage('load', 'histórico'));
    }
  };

  const handleCadastrar = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'medicamentos') {
        await estoqueService.createMedicamento(formData);
      } else {
        await estoqueService.createAlimento(formData);
      }
      toast.success('Cadastrado com sucesso!');
      closeModal();
      loadItems();
    } catch (error) {
      toast.error(errorMessage('create', 'item'));
    }
  };

  const handleMovimentacao = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...movimentacaoData,
        tipo: modalOpen, // entrada ou saida
        [activeTab === 'medicamentos' ? 'medicamentoId' : 'alimentoId']: movimentacaoData.itemId
      };

      if (activeTab === 'medicamentos') {
        await estoqueService.movimentarMedicamento(payload);
      } else {
        await estoqueService.movimentarAlimento(payload);
      }
      toast.success('Movimentação registrada!');
      closeModal();
      loadItems();
    } catch (error) {
      toast.error(apiErrorMessage(error, errorMessage('save', 'movimentação')));
    }
  };

  const closeModal = () => {
    setModalOpen(null);
    setFormData({});
    setMovimentacaoData({ quantidade: '', motivo: '', observacao: '' });
  };

  const filteredItems = items.filter(item => 
    item.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const itemStats = {
    total: items.length,
    baixoEstoque: items.filter(i => i.quantidade <= (i.quantidadeMinima || 0)).length,
    vencendo: items.filter(i => {
      if (!i.validade) return false;
      const validade = new Date(i.validade);
      const now = new Date();
      const diffTime = validade - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      return diffDays > 0 && diffDays <= 30;
    }).length,
    categorias: new Set(items.map(i => i.categoria || 'Geral')).size
  };

  // --- MODALS ---

  const renderModal = () => {
    if (!modalOpen) return null;

    const isMed = activeTab === 'medicamentos';
    const isMovimentacao = modalOpen === 'entrada' || modalOpen === 'saida';
    const formId = isMovimentacao ? 'estoque-movimentacao-form' : 'estoque-cadastro-form';

    return (
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0 bg-white/80 backdrop-blur">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              {modalOpen === 'cadastrar' && <Plus className="text-primary-600" />}
              {modalOpen === 'entrada' && <ArrowDownCircle className="text-emerald-600" />}
              {modalOpen === 'saida' && <ArrowUpCircle className="text-red-600" />}
              
              {modalOpen === 'cadastrar' ? `Novo ${isMed ? 'Medicamento' : 'Alimento'}` :
               modalOpen === 'entrada' ? 'Registrar Entrada' : 'Registrar Saída'}
            </h3>
            <button
              type="button"
              aria-label="Fechar modal"
              onClick={closeModal}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1 min-h-0 custom-scrollbar">
            {isMovimentacao ? (
              <form id={formId} onSubmit={handleMovimentacao} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Selecione o Item</label>
                  <select 
                    required
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    onChange={e => setMovimentacaoData({...movimentacaoData, itemId: e.target.value})}
                    value={movimentacaoData.itemId || ''}
                  >
                    <option value="">Selecione...</option>
                    {items.map(item => (
                      <option key={item._id} value={item._id}>
                        {item.nome} (Atual: {item.quantidade} {item.unidade})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Quantidade</label>
                    <input 
                      required
                      type="number" 
                      min="1"
                      className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      value={movimentacaoData.quantidade}
                      onChange={e => setMovimentacaoData({...movimentacaoData, quantidade: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Motivo</label>
                    <select 
                      required
                      className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      onChange={e => setMovimentacaoData({...movimentacaoData, motivo: e.target.value})}
                      value={movimentacaoData.motivo || ''}
                    >
                      <option value="">Selecione...</option>
                      {modalOpen === 'entrada' ? (
                        <>
                          <option value="Compra">Compra</option>
                          <option value="Doação">Doação</option>
                          <option value="Ajuste">Ajuste de Estoque</option>
                        </>
                      ) : (
                        <>
                          <option value="Uso">Uso/Consumo</option>
                          <option value="Vencimento">Vencimento/Descarte</option>
                          <option value="Ajuste">Ajuste de Estoque</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Observação (Opcional)</label>
                  <textarea 
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    rows="3"
                    value={movimentacaoData.observacao}
                    onChange={e => setMovimentacaoData({...movimentacaoData, observacao: e.target.value})}
                  ></textarea>
                </div>

              </form>
            ) : (
              <form id={formId} onSubmit={handleCadastrar} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Item</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    onChange={e => setFormData({...formData, nome: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Unidade</label>
                    <select 
                      required
                      className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      onChange={e => setFormData({...formData, unidade: e.target.value})}
                      defaultValue=""
                    >
                      <option value="" disabled>Selecione</option>
                      {isMed ? (
                        <>
                          <option value="comprimido">Comprimido</option>
                          <option value="caixa">Caixa</option>
                          <option value="frasco">Frasco</option>
                          <option value="ml">ml</option>
                          <option value="ampola">Ampola</option>
                        </>
                      ) : (
                        <>
                          <option value="kg">Kg</option>
                          <option value="litro">Litro</option>
                          <option value="unidade">Unidade</option>
                          <option value="pacote">Pacote</option>
                          <option value="lata">Lata</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Qtd. Inicial</label>
                    <input 
                      type="number" 
                      className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      onChange={e => setFormData({...formData, quantidade: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Qtd. Mínima (Alerta)</label>
                    <input 
                      type="number" 
                      className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      onChange={e => setFormData({...formData, quantidadeMinima: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Validade</label>
                    <input 
                      type="date" 
                      className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      onChange={e => setFormData({...formData, validade: e.target.value})}
                    />
                  </div>
                </div>

                {isMed ? (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Lote</label>
                    <input 
                      type="text" 
                      className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      onChange={e => setFormData({...formData, lote: e.target.value})}
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                    <select 
                      className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      onChange={e => setFormData({...formData, categoria: e.target.value})}
                    >
                      <option value="Geral">Geral</option>
                      <option value="Perecível">Perecível</option>
                      <option value="Não Perecível">Não Perecível</option>
                      <option value="Bebida">Bebida</option>
                    </select>
                  </div>
                )}

              </form>
            )}
          </div>

          <div className="p-6 border-t border-slate-100 flex justify-end gap-3 shrink-0 bg-white">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
            >
              Cancelar
            </button>
            {isMovimentacao ? (
              <button
                type="submit"
                form={formId}
                className={`px-6 py-2 rounded-lg font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 ${
                  modalOpen === 'entrada'
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                    : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
                }`}
              >
                Confirmar {modalOpen === 'entrada' ? 'Entrada' : 'Saída'}
              </button>
            ) : (
              <button
                type="submit"
                form={formId}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 shadow-lg shadow-primary-600/20 transition-all transform hover:-translate-y-0.5"
              >
                Salvar Cadastro
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <PageHeader
        label="Logística"
        title="Controle de Estoque"
        subtitle="Gerencie o inventário de medicamentos e alimentos, registre entradas e saídas."
      >
        <button 
          onClick={loadMovimentacoes}
          className="btn bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200 flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all"
        >
          <Layers size={18} /> Ver Histórico
        </button>
        <button 
          onClick={() => setModalOpen('entrada')}
          className="btn bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all"
        >
          <ArrowDownCircle size={18} /> Registrar Entrada
        </button>
        <button 
          onClick={() => setModalOpen('saida')}
          className="btn bg-red-50 text-red-700 hover:bg-red-100 border-red-200 flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all"
        >
          <ArrowUpCircle size={18} /> Registrar Saída
        </button>
        <button 
          onClick={() => setModalOpen('cadastrar')}
          className="btn bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/20 flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all"
        >
          <Plus size={18} /> Novo Item
        </button>
      </PageHeader>

      {/* Estatísticas Gerais */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            icon={Package}
            label="Total de Itens"
            value={stats.totalItens || 0}
            description={`${stats.totalMedicamentos ?? 0} med. + ${stats.totalAlimentos ?? 0} alim.`}
            color="primary"
          />
          <StatsCard
            icon={AlertTriangle}
            label="Baixo Estoque"
            value={stats.baixoEstoque || 0}
            description="Itens precisando reposição"
            color="red"
          />
          <StatsCard
            icon={Calendar}
            label="Vencendo"
            value={stats.vencendo || 0}
            description="Nos próximos 30 dias"
            color="amber"
          />
          <StatsCard
            icon={Layers}
            label="Movimentações"
            value={stats.movimentacoesRecentes || 0}
            description="Últimos 30 dias"
            color="emerald"
          />
        </div>
      )}

      {/* Estatísticas por Categoria */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={Package}
          label="Total"
          value={itemStats.total}
          description="Itens cadastrados"
          color="primary"
        />
        <StatsCard
          icon={AlertTriangle}
          label="Baixo Estoque"
          value={itemStats.baixoEstoque}
          description="Itens precisando reposição"
          color="red"
        />
        <StatsCard
          icon={Calendar}
          label="Vencendo"
          value={itemStats.vencendo}
          description="Nos próximos 30 dias"
          color="orange"
        />
        <StatsCard
          icon={Layers}
          label="Categorias"
          value={itemStats.categorias}
          description="Tipos de itens"
          color="purple"
        />
      </div>

      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder={`Buscar ${activeTab}...`}
      >
        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setActiveTab('medicamentos')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'medicamentos' 
                ? 'bg-white text-primary-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Pill size={16} /> Medicamentos
          </button>
          <button
            onClick={() => setActiveTab('alimentos')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'alimentos' 
                ? 'bg-white text-green-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Utensils size={16} /> Alimentos
          </button>
        </div>
      </SearchFilterBar>

      {/* Main Content Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="px-6 py-12 text-center text-slate-400">
            <div className="flex justify-center mb-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            </div>
            Carregando estoque...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-400">
            <EmptyState
              icon={Package}
              title="Nenhum item encontrado"
              description="Nenhum item encontrado no estoque."
            />
          </div>
        ) : (
          <>
            {/* Mobile: cards */}
            <div className="md:hidden p-4 sm:p-6 space-y-3">
              {filteredItems.map((item) => {
                const isLow = item.quantidade <= item.quantidadeMinima;
                return (
                  <div
                    key={item._id}
                    className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`p-2 rounded-lg shrink-0 ${
                            activeTab === 'medicamentos'
                              ? 'bg-primary-50 text-primary-600'
                              : 'bg-green-50 text-green-600'
                          }`}
                        >
                          {activeTab === 'medicamentos' ? <Pill size={18} /> : <Utensils size={18} />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{item.nome}</p>
                          <p className="text-xs text-slate-500 truncate">
                            {item.lote ? `Lote: ${item.lote}` : 'Sem lote'}
                            {item.categoria ? ` • Cat: ${item.categoria}` : ''}
                          </p>
                        </div>
                      </div>

                      {isLow ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-100 shrink-0">
                          <AlertTriangle size={12} /> Baixo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 shrink-0">
                          <CheckCircle2 size={12} /> Normal
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-slate-500">Quantidade</span>
                      <span className={`font-bold text-lg ${isLow ? 'text-red-600' : 'text-slate-700'}`}>
                        {item.quantidade}
                        <span className="ml-2 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md font-medium">
                          {item.unidade}
                        </span>
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-slate-500">Validade</span>
                      <span className="text-sm text-slate-600">
                        {item.validade ? new Date(item.validade).toLocaleDateString('pt-BR') : '-'}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-end">
                      <button
                        type="button"
                        className="text-slate-500 hover:text-primary-600 font-semibold text-sm transition-colors"
                      >
                        Detalhes
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Quantidade</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Unidade</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Validade</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredItems.map((item) => {
                    const isLow = item.quantidade <= item.quantidadeMinima;
                    return (
                      <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${activeTab === 'medicamentos' ? 'bg-primary-50 text-primary-600' : 'bg-green-50 text-green-600'}`}>
                            {activeTab === 'medicamentos' ? <Pill size={18} /> : <Utensils size={18} />}
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 block">{item.nome}</span>
                            {item.lote && <span className="text-xs text-slate-500">Lote: {item.lote}</span>}
                            {item.categoria && <span className="text-xs text-slate-500">Cat: {item.categoria}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`font-bold text-lg ${isLow ? 'text-red-600' : 'text-slate-700'}`}>
                          {item.quantidade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-md font-medium">
                          {item.unidade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-600">
                          {item.validade ? new Date(item.validade).toLocaleDateString('pt-BR') : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-100">
                            <AlertTriangle size={12} /> Baixo Estoque
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                            <CheckCircle2 size={12} /> Normal
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="text-slate-400 hover:text-primary-600 font-medium text-sm transition-colors">
                          Detalhes
                        </button>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {renderModal()}

      {/* Modal Histórico de Movimentações */}
      {showHistorico && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowHistorico(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Layers className="text-primary-600" />
                  Histórico de Movimentações
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Últimas 50 movimentações registradas
                </p>
              </div>
              <button
                onClick={() => setShowHistorico(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                type="button"
                aria-label="Fechar modal"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {movimentacoes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Data</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Tipo</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Item</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Qtd</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Motivo</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Usuário</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {movimentacoes.map((mov) => (
                        <tr key={mov._id} className="hover:bg-slate-50/50 transition">
                          <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                            {new Date(mov.data).toLocaleString('pt-BR')}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                mov.tipo === 'entrada'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-red-50 text-red-700'
                              }`}
                            >
                              {mov.tipo === 'entrada' ? (
                                <><ArrowDownCircle size={12} /> Entrada</>
                              ) : (
                                <><ArrowUpCircle size={12} /> Saída</>
                              )}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-slate-900">
                            {mov.itemNome}
                            <span className="ml-2 text-xs text-slate-500">
                              ({mov.itemTipo})
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-slate-700">
                            {mov.tipo === 'entrada' ? '+' : '-'}{mov.quantidade}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {mov.motivo}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {mov.usuarioNome}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Layers size={48} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500">Nenhuma movimentação encontrada</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
