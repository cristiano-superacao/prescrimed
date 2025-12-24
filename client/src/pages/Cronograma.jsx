import { useState, useEffect } from 'react';
import { 
  Search, 
  Calendar as CalendarIcon, 
  Pill, 
  Stethoscope, 
  FileText, 
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  MapPin,
  Filter,
  Info
} from 'lucide-react';
import { agendamentoService } from '../services/agendamento.service';
import { prescricaoService } from '../services/prescricao.service';
import toast from 'react-hot-toast';
import PageHeader from '../components/common/PageHeader';
import StatsCard from '../components/common/StatsCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Cronograma() {
  const [activeTab, setActiveTab] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLegends, setShowLegends] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const today = new Date();
      const future = new Date();
      future.setDate(today.getDate() + 30);
      
      const [agendamentosData, prescricoesData] = await Promise.all([
        agendamentoService.getAll({
          dataInicio: today.toISOString(),
          dataFim: future.toISOString()
        }),
        prescricaoService.getAll({ status: 'ativa' })
      ]);

      const agendamentos = Array.isArray(agendamentosData) ? agendamentosData : [];
      const formattedAgendamentos = agendamentos.map(ag => ({
        id: ag.id || ag._id,
        type: ag.tipo === 'Consulta' ? 'consultas' : ag.tipo === 'Exame' ? 'exames' : 'outros',
        originalType: ag.tipo,
        title: ag.titulo || 'Agendamento sem título',
        subtitle: ag.participante || 'Sem participante',
        date: ag.dataHoraInicio ? new Date(ag.dataHoraInicio) : new Date(),
        status: ag.status,
        details: ag.local,
        source: 'agendamento'
      }));

      const prescricoesResponse = prescricoesData || {};
      const listaPrescricoes = Array.isArray(prescricoesResponse) 
        ? prescricoesResponse 
        : (Array.isArray(prescricoesResponse.prescricoes) ? prescricoesResponse.prescricoes : []);
        
      const formattedPrescricoes = listaPrescricoes.map(pres => {
        const meds = pres.medicamentos || [];
        const principal = meds[0]?.nome || 'Medicamentos diversos';
        const extra = meds.length > 1 ? ` +${meds.length - 1}` : '';
        return {
          id: pres.id || pres._id,
          type: 'medicacoes',
          originalType: 'Medicação',
          title: `Prescrição: ${principal}${extra}`,
          subtitle: pres.pacienteId?.nome || 'Paciente não identificado',
          date: pres.dataEmissao || pres.createdAt ? new Date(pres.dataEmissao || pres.createdAt) : new Date(),
          status: pres.status,
          details: `${meds.length} medicamentos`,
          source: 'prescricao'
        };
      });

      const allItems = [...formattedAgendamentos, ...formattedPrescricoes].sort((a, b) => a.date - b.date);
      setItems(allItems);

    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar cronograma');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (date, status, type) => {
    if (status === 'concluido' || status === 'realizado') {
      return { label: 'Realizado', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
    }

    if (type === 'medicacoes') {
       return { label: 'Em Uso', color: 'bg-primary-100 text-primary-700 border-primary-200', dot: 'bg-primary-500' };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const itemDate = new Date(date);
    itemDate.setHours(0, 0, 0, 0);
    
    const diffTime = itemDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: 'Atrasado', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' };
    if (diffDays === 0) return { label: 'Hoje', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' };
    if (diffDays === 1) return { label: 'Amanhã', color: 'bg-amber-100 text-amber-800 border-amber-200', dot: 'bg-amber-500' };
    if (diffDays <= 3) return { label: 'Próximo', color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' };
    
    return { label: 'Agendado', color: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' };
  };

  const filteredItems = items.filter(item => {
    const matchesTab = activeTab === 'todos' || item.type === activeTab || (activeTab === 'consultas' && item.type === 'outros');
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabs = [
    { id: 'todos', label: 'Todos', icon: CalendarIcon },
    { id: 'medicacoes', label: 'Medicações', icon: Pill },
    { id: 'consultas', label: 'Consultas', icon: Stethoscope },
    { id: 'exames', label: 'Exames', icon: FileText },
  ];

  const stats = {
    total: items.length,
    consultas: items.filter(i => i.type === 'consultas').length,
    exames: items.filter(i => i.type === 'exames').length,
    medicacoes: items.filter(i => i.type === 'medicacoes').length
  };

  return (
    <div className="space-y-8">
      <PageHeader
        label="Rotina"
        title="Cronograma"
        subtitle="Acompanhe a linha do tempo de medicações, consultas e exames dos residentes."
      >
        <button 
          onClick={() => setShowLegends(!showLegends)}
          className={`btn btn-secondary flex items-center justify-center gap-2 ${showLegends ? 'bg-slate-100' : ''}`}
        >
          <Info size={18} />
          <span className="hidden sm:inline">Legendas</span>
        </button>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={CalendarIcon}
          label="Total"
          value={stats.total}
          description="Eventos agendados"
          color="primary"
        />
        <StatsCard
          icon={Stethoscope}
          label="Consultas"
          value={stats.consultas}
          description="Consultas médicas"
          color="blue"
        />
        <StatsCard
          icon={Pill}
          label="Medicações"
          value={stats.medicacoes}
          description="Prescrições ativas"
          color="purple"
        />
        <StatsCard
          icon={FileText}
          label="Exames"
          value={stats.exames}
          description="Exames marcados"
          color="orange"
        />
      </div>

      {/* Toolbar: Search & Tabs */}
      <div className="card p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Tabs - Segmented Control Style */}
        <div className="flex p-1 bg-slate-100 rounded-xl w-full md:w-auto overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap
                  ${isActive 
                    ? 'bg-white text-primary-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}
                `}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por título ou participante..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Collapsible Legends */}
      {showLegends && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
            <span className="text-xs text-slate-600">Agendado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-slate-600">Próximo (3 dias)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span className="text-xs text-slate-600">Amanhã</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-xs text-slate-600">Hoje/Atrasado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-xs text-slate-600">Realizado</span>
          </div>
        </div>
      )}

      {/* Content List */}
      <div className="space-y-4">
        {loading ? (
          <LoadingSpinner />
        ) : filteredItems.length === 0 ? (
          <div className="card text-center py-16">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon size={32} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Nenhum item encontrado</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-1">
              Não há agendamentos ou prescrições para os filtros selecionados.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredItems.map((item) => {
              const statusInfo = getStatusInfo(item.date, item.status, item.type);
              const itemId = item.id || item._id || Math.random();
              // Protege datas e campos obrigatórios
              const itemDate = item.date instanceof Date && !isNaN(item.date) ? item.date : new Date();
              return (
                <div
                  key={`${item.source}-${itemId}`}
                  className="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col md:flex-row gap-5"
                >
                  {/* Date Column */}
                  <div className="flex md:flex-col items-center justify-center md:justify-start gap-2 md:gap-0 min-w-[80px] p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-2xl font-bold text-slate-800 leading-none">{itemDate.getDate()}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{itemDate.toLocaleDateString('pt-BR', { month: 'short' })}</span>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            item.type === 'medicacoes' ? 'bg-purple-50 text-purple-700' :
                            item.type === 'consultas' ? 'bg-blue-50 text-blue-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {item.type === 'medicacoes' ? <Pill size={10} /> :
                              item.type === 'consultas' ? <Stethoscope size={10} /> : <FileText size={10} />}
                            {item.originalType}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusInfo.color}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`}></div>
                            {statusInfo.label}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 truncate pr-4 group-hover:text-primary-700 transition-colors">
                          {item.title}
                        </h4>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mt-3">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <User size={16} className="text-slate-400" />
                        <span className="truncate">{item.subtitle}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock size={16} className="text-slate-400" />
                        <span>{itemDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      {item.details && (
                        <div className="flex items-center gap-2 text-sm text-slate-600 sm:col-span-2">
                          <MapPin size={16} className="text-slate-400" />
                          <span className="truncate">{item.details}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
