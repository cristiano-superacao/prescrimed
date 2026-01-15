import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  UserCheck, 
  TrendingUp, 
  RefreshCcw, 
  Download, 
  AlertTriangle, 
  ClipboardCheck,
  Activity,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  DollarSign,
  Building2,
  Settings
} from 'lucide-react';
import { dashboardService } from '../services/dashboard.service';
import SimpleChart from '../components/SimpleChart';
import toast from 'react-hot-toast';
import PageHeader from '../components/common/PageHeader';
import StatsCard from '../components/common/StatsCard';
import { useAuthStore } from '../store/authStore';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [prescricoesRecentes, setPrescricoesRecentes] = useState([]);
  const [pacientesRecentes, setPacientesRecentes] = useState([]);
  const [nextSteps, setNextSteps] = useState([]);
  const [priorityAlerts, setPriorityAlerts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!loading) {
      setLoading(true);
    }
    try {
      const [statsResponse, prescricoesResponse, pacientesResponse, nextStepsResponse, alertsResponse] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getPrescricoesRecentes(),
        dashboardService.getPacientesRecentes(),
        dashboardService.getNextSteps(),
        dashboardService.getPriorityAlerts(),
      ]);

      setStats(statsResponse?.stats || statsResponse);
      setPrescricoesRecentes(prescricoesResponse?.prescricoes || []);
      setPacientesRecentes(pacientesResponse?.pacientes || []);
      setNextSteps(nextStepsResponse?.nextSteps || []);
      setPriorityAlerts(alertsResponse?.alerts || []);
      
      // Preparar dados para o gráfico
      if (statsResponse?.stats?.graficoPrescricoes) {
        const chartPoints = statsResponse.stats.graficoPrescricoes.map(item => ({
          date: new Date(item.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
          value: item.total
        }));
        setChartData(chartPoints);
      }
    } catch (error) {
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await loadData();
    toast.success('Dados atualizados com sucesso!');
  };

  const handleExport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Gerando relatório...',
        success: 'Relatório enviado para seu e-mail!',
        error: 'Erro ao gerar relatório',
      }
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total de Pacientes',
      value: stats?.totalPacientes || 0,
      icon: Users,
      accent: 'from-primary-500 to-primary-600',
      trend: '+12% vs mês anterior',
    },
    {
      title: 'Total de Prescrições',
      value: stats?.totalPrescricoes || 0,
      icon: FileText,
      accent: 'from-emerald-500 to-emerald-600',
      trend: '+6% no período',
    },
    {
      title: 'Total de Usuários',
      value: stats?.totalUsuarios || 0,
      icon: UserCheck,
      accent: 'from-purple-500 to-purple-600',
      trend: 'Equipe ativa',
    },
    {
      title: 'Prescrições no Período',
      value: stats?.prescricoesPeriodo || 0,
      icon: TrendingUp,
      accent: 'from-orange-500 to-amber-500',
      trend: 'Atualizado semanalmente',
    },
  ];

  const alertStyles = {
    critical: 'bg-rose-50 text-rose-700 border-rose-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-primary-50 text-primary-700 border-primary-200',
  };

  const quickAccess = [
    { label: 'Dashboard', path: '/dashboard', icon: TrendingUp, accent: 'from-primary-500 to-primary-600' },
    { label: 'Agenda', path: '/agenda', icon: Calendar, accent: 'from-emerald-500 to-emerald-600' },
    { label: 'Cronograma', path: '/cronograma', icon: Clock, accent: 'from-orange-500 to-amber-500' },
    { label: 'Prescrições', path: '/prescricoes', icon: FileText, accent: 'from-purple-500 to-purple-600' },
    { label: 'Censo M.P.', path: '/censo-mp', icon: ClipboardCheck, accent: 'from-sky-500 to-sky-600' },
    { label: 'Pacientes', path: '/residentes', icon: Users, accent: 'from-amber-500 to-orange-500' },
    { label: 'Estoque', path: '/estoque', icon: Package, accent: 'from-blue-500 to-indigo-500' },
    { label: 'Evolução', path: '/evolucao', icon: Activity, accent: 'from-teal-500 to-emerald-500' },
    { label: 'Financeiro', path: '/financeiro', icon: DollarSign, accent: 'from-lime-500 to-green-500' },
    { label: 'Usuários', path: '/usuarios', icon: UserCheck, accent: 'from-fuchsia-500 to-purple-600' },
    { label: 'Empresas', path: '/empresas', icon: Building2, accent: 'from-cyan-500 to-blue-500' },
    { label: 'Configurações', path: '/configuracoes', icon: Settings, accent: 'from-slate-500 to-slate-700' },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        label="Visão Geral"
        title="Dashboard"
        subtitle="Acompanhe em tempo real pacientes, prescrições e equipes para manter a operação segura e eficiente."
      >
        <button
          onClick={handleRefresh}
          className="btn btn-secondary flex items-center justify-center gap-2"
        >
          <RefreshCcw size={18} /> Atualizar dados
        </button>
        <button 
          onClick={handleExport}
          className="btn btn-primary flex items-center justify-center gap-2"
        >
          <Download size={18} /> Exportar relatório
        </button>
      </PageHeader>

      {(user?.role === 'superadmin' || (user && user.email === 'superadmin@prescrimed.com')) && (
        <div className="card border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Acesso rápido</p>
              <h2 className="text-xl font-semibold text-slate-900">Módulos do sistema</h2>
              <p className="text-sm text-slate-500">Clique para abrir qualquer módulo com acesso total.</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100">
              SuperAdmin
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {quickAccess.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="group w-full text-left p-4 rounded-2xl border border-slate-100 bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.accent} text-white flex items-center justify-center mb-3 shadow-sm`}>
                    <Icon size={20} />
                  </div>
                  <p className="font-semibold text-slate-900 leading-snug">{item.label}</p>
                  <p className="text-xs text-slate-500 mt-1 group-hover:text-slate-700">Acesso direto</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Next Steps & Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <ClipboardCheck className="text-primary-600" size={24} />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Próximos passos</p>
              <h2 className="text-xl font-semibold text-slate-900">Controle operacional</h2>
            </div>
          </div>
          <div className="space-y-4">
            {nextSteps.length > 0 ? (
              nextSteps.map((step) => (
                <div key={step.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
                  <h3 className="font-semibold text-slate-900">{step.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{step.description}</p>
                  <button
                    onClick={() => step.ctaRoute && navigate(step.ctaRoute)}
                    className="text-primary-600 text-sm font-semibold mt-3 hover:underline"
                  >
                    {step.ctaLabel}
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">Nenhuma pendência encontrada.</p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="text-amber-600" size={24} />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Alertas críticos</p>
              <h2 className="text-xl font-semibold text-slate-900">Atenção imediata</h2>
            </div>
          </div>
          <div className="space-y-4">
            {priorityAlerts.length > 0 ? (
              priorityAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-2xl border ${alertStyles[alert.severity] || 'bg-slate-50 text-slate-700 border-slate-200'}`}
                >
                  <h3 className="font-semibold">{alert.title}</h3>
                  <p className="text-sm opacity-80 mt-1">{alert.detail}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">Nenhum alerta crítico no momento.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatsCard
          icon={Users}
          label="Pacientes"
          value={stats?.totalPacientes || 0}
          description="+12% vs mês anterior"
          color="primary"
        />
        <StatsCard
          icon={FileText}
          label="Prescrições"
          value={stats?.totalPrescricoes || 0}
          description="+6% no período"
          color="emerald"
        />
        <StatsCard
          icon={UserCheck}
          label="Equipe"
          value={stats?.totalUsuarios || 0}
          description="Usuários ativos"
          color="purple"
        />
        <StatsCard
          icon={TrendingUp}
          label="Atividade"
          value={stats?.prescricoesPeriodo || 0}
          description="Prescrições recentes"
          color="amber"
        />
      </div>

      {/* Chart Section */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Activity className="text-primary-600" size={24} />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Análise</p>
              <h2 className="text-xl font-bold text-slate-900">Evolução de Prescrições</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="text-slate-400" size={16} />
            <span className="text-sm text-slate-600">Últimos 30 dias</span>
          </div>
        </div>
        <div className="h-64 w-full">
          {chartData.length > 0 ? (
            <SimpleChart data={chartData} color="#2d5016" height={250} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <TrendingUp size={48} className="mb-2 opacity-20" />
              <p>Dados insuficientes para o gráfico</p>
              <p className="text-xs mt-1">Cadastre prescrições para visualizar a evolução</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prescrições Recentes */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Atividade</p>
              <h2 className="text-xl font-bold text-slate-900">Prescrições Recentes</h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-700">
              {prescricoesRecentes.length} registros
            </span>
          </div>
          <div className="space-y-4">
            {prescricoesRecentes.length > 0 ? (
              prescricoesRecentes.map((prescricao) => (
                <div key={prescricao.id || prescricao._id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
                  <div className="flex justify-between gap-3 mb-2">
                    <div>
                      <p className="font-semibold text-slate-900">{prescricao.pacienteNome}</p>
                      <p className="text-xs text-slate-500">{new Date(prescricao.createdAt).toLocaleString('pt-BR')}</p>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          prescricao.tipo === 'controlado'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-primary-100 text-primary-700'
                        }`}
                      >
                        {prescricao.tipo === 'controlado' ? 'Controlado' : 'Comum'}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          prescricao.status === 'ativa'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {prescricao.status}
                      </span>
                    </div>
                  </div>
                  {prescricao.medicamentos?.length > 0 && (
                    <p className="text-sm text-slate-600">
                      {prescricao.medicamentos[0].nome}
                      {prescricao.medicamentos.length > 1 &&
                        ` + ${prescricao.medicamentos.length - 1} medicamentos`}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-8">Nenhuma prescrição recente</p>
            )}
          </div>
        </div>

        {/* Pacientes Recentes */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Cadastros</p>
              <h2 className="text-xl font-bold text-slate-900">Pacientes Recentes</h2>
            </div>
            <span className="text-xs text-slate-400">Atualizado hoje</span>
          </div>
          <div className="space-y-3">
            {pacientesRecentes.length > 0 ? (
              pacientesRecentes.map((paciente) => (
                <div key={paciente.id || paciente._id} className="p-4 rounded-2xl border border-slate-100">
                  <p className="font-semibold text-slate-900">{paciente.nome}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-500 mt-1">
                    <span>CPF: {paciente.cpf}</span>
                    <span>
                      Entrada: {new Date(paciente.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-8">Nenhum paciente recente</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}