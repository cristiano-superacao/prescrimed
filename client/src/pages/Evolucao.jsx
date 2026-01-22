import { useState, useEffect } from 'react';
import { 
  Plus,
  FileText, 
  Users, 
  ShieldAlert, 
  AlertTriangle, 
  Eye, 
  AlertCircle,
  RefreshCcw,
  Edit,
  Trash2,
  X,
  Activity,
  Heart,
  Wind,
  Thermometer,
  Droplet,
  User
} from 'lucide-react';
import { enfermagemService } from '../services/enfermagem.service';
import { pacienteService } from '../services/paciente.service';
import toast from 'react-hot-toast';
import { successMessage, errorMessage, apiErrorMessage } from '../utils/toastMessages';
import PageHeader from '../components/common/PageHeader';
import StatsCard from '../components/common/StatsCard';
import SearchFilterBar from '../components/common/SearchFilterBar';
import EmptyState from '../components/common/EmptyState';
import { 
  TableContainer, 
  MobileGrid, 
  MobileCard, 
  TableWrapper, 
  TableHeader, 
  TBody, 
  Tr, 
  Td 
} from '../components/common/Table';

export default function Evolucao() {
  const [registros, setRegistros] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  
  // Stats
  const [stats, setStats] = useState({
    registrosHoje: 0,
    pacientesComRegistro: 0,
    riscoQueda: 0,
    alertasCriticos: 0
  });

  // Form state
  const [formData, setFormData] = useState({
    pacienteId: '',
    tipo: 'evolucao',
    titulo: '',
    descricao: '',
    estadoGeral: 'bom',
    riscoQueda: '',
    riscoLesao: '',
    alerta: false,
    prioridade: 'baixa',
    observacoes: '',
    // Sinais Vitais
    pa: '',
    fc: '',
    fr: '',
    temp: '',
    sato2: '',
    glicemia: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadData();
    loadPacientes();
    loadStats();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await enfermagemService.getAll();
      setRegistros(data);
    } catch (error) {
      toast.error(apiErrorMessage(error, errorMessage('load', 'registros')));
    } finally {
      setLoading(false);
    }
  };

  const loadPacientes = async () => {
    try {
      const data = await pacienteService.getAll();
      const lista = Array.isArray(data) ? data : (data.pacientes || []);
      // Filtrar apenas pacientes ativos
      setPacientes(lista.filter(p => p.status === 'ativo'));
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
    }
  };

  const loadStats = async () => {
    try {
      const data = await enfermagemService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.pacienteId) newErrors.pacienteId = 'Selecione um residente';
    if (!formData.titulo.trim()) newErrors.titulo = 'Título é obrigatório';
    if (!formData.descricao.trim()) newErrors.descricao = 'Descrição é obrigatória';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      // Preparar sinais vitais se algum foi preenchido
      let sinaisVitais = null;
      if (formData.pa || formData.fc || formData.fr || formData.temp || formData.sato2 || formData.glicemia) {
        sinaisVitais = {
          pa: formData.pa || null,
          fc: formData.fc || null,
          fr: formData.fr || null,
          temp: formData.temp || null,
          sato2: formData.sato2 || null,
          glicemia: formData.glicemia || null
        };
      }

      const payload = {
        pacienteId: formData.pacienteId,
        tipo: formData.tipo,
        titulo: formData.titulo.trim(),
        descricao: formData.descricao.trim(),
        estadoGeral: formData.estadoGeral,
        riscoQueda: formData.riscoQueda || null,
        riscoLesao: formData.riscoLesao || null,
        alerta: formData.alerta,
        prioridade: formData.prioridade,
        observacoes: formData.observacoes.trim() || null,
        sinaisVitais
      };

      if (editingId) {
        await enfermagemService.update(editingId, payload);
        toast.success(successMessage('update', 'Registro'));
      } else {
        await enfermagemService.create(payload);
        toast.success(successMessage('create', 'Registro'));
      }

      setModalOpen(false);
      resetForm();
      loadData();
      loadStats();
    } catch (error) {
      toast.error(apiErrorMessage(error, errorMessage('save', 'registro')));
    }
  };

  const handleEdit = (registro) => {
    // Parse sinais vitais se existir
    let sinaisVitais = {};
    if (registro.sinaisVitais) {
      try {
        sinaisVitais = typeof registro.sinaisVitais === 'string' 
          ? JSON.parse(registro.sinaisVitais)
          : registro.sinaisVitais;
      } catch (e) {
        console.error('Erro ao parsear sinais vitais:', e);
      }
    }

    setFormData({
      pacienteId: registro.pacienteId,
      tipo: registro.tipo,
      titulo: registro.titulo,
      descricao: registro.descricao,
      estadoGeral: registro.estadoGeral || 'bom',
      riscoQueda: registro.riscoQueda || '',
      riscoLesao: registro.riscoLesao || '',
      alerta: registro.alerta || false,
      prioridade: registro.prioridade || 'baixa',
      observacoes: registro.observacoes || '',
      pa: sinaisVitais.pa || '',
      fc: sinaisVitais.fc || '',
      fr: sinaisVitais.fr || '',
      temp: sinaisVitais.temp || '',
      sato2: sinaisVitais.sato2 || '',
      glicemia: sinaisVitais.glicemia || ''
    });
    setEditingId(registro.id);
    setModalOpen(true);
  };

  const handleDelete = async (id, titulo) => {
    const confirmMessage = `Tem certeza que deseja excluir o registro "${titulo}"?\n\nEsta ação não pode ser desfeita.`;
    if (!window.confirm(confirmMessage)) return;
    
    try {
      setDeletingId(id);
      await enfermagemService.delete(id);
      toast.success(successMessage('delete', 'Registro'));
      loadData();
      loadStats();
    } catch (error) {
      toast.error(apiErrorMessage(error, errorMessage('delete', 'registro')));
    } finally {
      setDeletingId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      pacienteId: '',
      tipo: 'evolucao',
      titulo: '',
      descricao: '',
      estadoGeral: 'bom',
      riscoQueda: '',
      riscoLesao: '',
      alerta: false,
      prioridade: 'baixa',
      observacoes: '',
      pa: '',
      fc: '',
      fr: '',
      temp: '',
      sato2: '',
      glicemia: ''
    });
    setEditingId(null);
    setErrors({});
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não informada';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Data inválida';
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Data inválida';
    }
  };

  const getTipoLabel = (tipo) => {
    const tipos = {
      evolucao: 'Evolução',
      sinais_vitais: 'Sinais Vitais',
      administracao_medicamento: 'Medicamento',
      curativo: 'Curativo',
      intercorrencia: 'Intercorrência',
      admissao: 'Admissão',
      alta: 'Alta',
      transferencia: 'Transferência',
      outro: 'Outro'
    };
    return tipos[tipo] || tipo;
  };

  const getEstadoGeralColor = (estado) => {
    const cores = {
      bom: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      regular: 'bg-yellow-50 text-yellow-700 border-yellow-100',
      grave: 'bg-orange-50 text-orange-700 border-orange-100',
      critico: 'bg-red-50 text-red-700 border-red-100'
    };
    return cores[estado] || cores.bom;
  };

  const getPrioridadeColor = (prioridade) => {
    const cores = {
      baixa: 'bg-slate-100 text-slate-700',
      media: 'bg-blue-50 text-blue-700',
      alta: 'bg-orange-50 text-orange-700',
      urgente: 'bg-red-50 text-red-700'
    };
    return cores[prioridade] || cores.baixa;
  };

  const filteredRegistros = registros.filter(r => {
    const searchLower = searchTerm.toLowerCase();
    return (
      r.titulo?.toLowerCase().includes(searchLower) ||
      r.paciente?.nome?.toLowerCase().includes(searchLower) ||
      r.descricao?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-8">
      <PageHeader
        label="Prontuário"
        title="Registros de Enfermagem"
        subtitle="Anotações diárias, evolução clínica e acompanhamento de cuidados."
      >
        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
          <button
            type="button"
            onClick={loadData}
            className="btn btn-secondary flex items-center justify-center gap-2"
          >
            <RefreshCcw size={18} /> Atualizar
          </button>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setModalOpen(true);
            }}
            className="btn btn-primary flex items-center justify-center gap-2 shadow-lg shadow-primary-600/20"
          >
            <Plus size={18} /> Novo Registro
          </button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard
          icon={FileText}
          label="Hoje"
          value={stats.registrosHoje}
          description="Registros realizados"
          color="primary"
        />
        <StatsCard
          icon={Users}
          label="Cobertura"
          value={stats.pacientesComRegistro}
          description="Pacientes evoluídos"
          color="emerald"
        />
        <StatsCard
          icon={ShieldAlert}
          label="Risco"
          value={stats.riscoQueda}
          description="Alto risco de queda"
          color="orange"
        />
        <StatsCard
          icon={AlertTriangle}
          label="Crítico"
          value={stats.alertasCriticos}
          description="Alertas pendentes"
          color="red"
        />
      </div>

      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Buscar por título, residente ou descrição..."
      />

      <TableContainer title="Registros de Enfermagem">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredRegistros.length > 0 ? (
          <>
            {/* Mobile */}
            <MobileGrid>
              {filteredRegistros.map((registro) => (
                <MobileCard key={registro.id}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${getPrioridadeColor(registro.prioridade)}`}>
                          {getTipoLabel(registro.tipo)}
                        </span>
                        {registro.alerta && (
                          <AlertTriangle size={14} className="text-red-500" />
                        )}
                      </div>
                      <p className="font-semibold text-slate-900 dark:text-gray-100">{registro.titulo}</p>
                      <p className="text-sm text-slate-600 dark:text-gray-300 mt-1">
                        <User size={14} className="inline mr-1" />
                        {registro.paciente?.nome || 'Paciente não identificado'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                        {formatDate(registro.createdAt)}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getEstadoGeralColor(registro.estadoGeral)}`}>
                      {registro.estadoGeral}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-600 dark:text-gray-300 mt-3 line-clamp-2">
                    {registro.descricao}
                  </p>

                  <div className="flex items-center justify-end gap-2 mt-3">
                    <button 
                      onClick={() => handleEdit(registro)}
                      className="group relative p-2.5 text-slate-500 hover:text-white hover:bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                      title="Editar registro"
                      aria-label="Editar registro"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(registro.id, registro.titulo)}
                      disabled={deletingId === registro.id}
                      className="group relative p-2.5 text-slate-500 hover:text-white hover:bg-gradient-to-br from-red-500 to-red-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Excluir registro"
                      aria-label="Excluir registro"
                    >
                      {deletingId === registro.id ? (
                        <div className="animate-spin rounded-full h-[18px] w-[18px] border-2 border-white border-t-transparent"></div>
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </MobileCard>
              ))}
            </MobileGrid>

            {/* Desktop */}
            <TableWrapper>
              <TableHeader columns={["Data/Hora", "Tipo", "Título", "Residente", "Estado", "Ações"]} />
              <TBody>
                {filteredRegistros.map((registro) => (
                  <Tr key={registro.id}>
                    <Td>
                      <span className="text-sm text-slate-600 dark:text-gray-300">
                        {formatDate(registro.createdAt)}
                      </span>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getPrioridadeColor(registro.prioridade)}`}>
                          {getTipoLabel(registro.tipo)}
                        </span>
                        {registro.alerta && (
                          <AlertTriangle size={14} className="text-red-500" title="Alerta ativo" />
                        )}
                      </div>
                    </Td>
                    <Td>
                      <p className="font-semibold text-slate-900 dark:text-gray-100">{registro.titulo}</p>
                      <p className="text-xs text-slate-500 dark:text-gray-400 line-clamp-1">{registro.descricao}</p>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-sm">
                          {registro.paciente?.nome?.charAt(0) || '?'}
                        </div>
                        <span className="text-sm text-slate-600 dark:text-gray-300">
                          {registro.paciente?.nome || 'N/A'}
                        </span>
                      </div>
                    </Td>
                    <Td>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getEstadoGeralColor(registro.estadoGeral)}`}>
                        {registro.estadoGeral}
                      </span>
                    </Td>
                    <Td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(registro)}
                          className="group relative p-2.5 text-slate-500 hover:text-white hover:bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                          title="Editar registro"
                          aria-label="Editar registro"
                        >
                          <Edit size={18} />
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            Editar
                          </span>
                        </button>
                        <button 
                          onClick={() => handleDelete(registro.id, registro.titulo)}
                          disabled={deletingId === registro.id}
                          className="group relative p-2.5 text-slate-500 hover:text-white hover:bg-gradient-to-br from-red-500 to-red-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Excluir registro"
                          aria-label="Excluir registro"
                        >
                          {deletingId === registro.id ? (
                            <div className="animate-spin rounded-full h-[18px] w-[18px] border-2 border-white border-t-transparent"></div>
                          ) : (
                            <Trash2 size={18} />
                          )}
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            Excluir
                          </span>
                        </button>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </TableWrapper>
          </>
        ) : (
          <div className="p-12">
            <EmptyState
              icon={FileText}
              title="Nenhum registro encontrado"
              description="Comece criando um novo registro de enfermagem."
            />
          </div>
        )}
      </TableContainer>

      {/* Modal de Novo/Editar Registro */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-200 dark:border-gray-700 flex justify-between items-start bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-gray-700 dark:to-gray-700/50 shrink-0">
              <div>
                <h3 className="font-bold text-xl text-slate-800 dark:text-gray-100">
                  {editingId ? 'Editar Registro' : 'Novo Registro de Enfermagem'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-gray-300 mt-1">Preencha os dados do registro clínico.</p>
              </div>
              <button 
                onClick={() => setModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-gray-200 p-1 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Body */}
            <div className="overflow-y-auto p-6 custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Seção: Informações Básicas */}
                <div className="bg-slate-50 dark:bg-gray-700/50 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="text-primary-600" size={20} />
                    <h4 className="font-bold text-slate-800 dark:text-gray-100">Informações Básicas</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-gray-200 mb-1.5">
                        Residente *
                      </label>
                      <select
                        className={`input w-full ${errors.pacienteId ? 'border-red-300' : ''}`}
                        value={formData.pacienteId}
                        onChange={e => setFormData({...formData, pacienteId: e.target.value})}
                      >
                        <option value="">Selecione um residente</option>
                        {pacientes.map(p => (
                          <option key={p.id} value={p.id}>{p.nome}</option>
                        ))}
                      </select>
                      {errors.pacienteId && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.pacienteId}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-gray-200 mb-1.5">
                        Tipo de Registro
                      </label>
                      <select
                        className="input w-full"
                        value={formData.tipo}
                        onChange={e => setFormData({...formData, tipo: e.target.value})}
                      >
                        <option value="evolucao">Evolução</option>
                        <option value="sinais_vitais">Sinais Vitais</option>
                        <option value="administracao_medicamento">Administração de Medicamento</option>
                        <option value="curativo">Curativo</option>
                        <option value="intercorrencia">Intercorrência</option>
                        <option value="admissao">Admissão</option>
                        <option value="alta">Alta</option>
                        <option value="transferencia">Transferência</option>
                        <option value="outro">Outro</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-gray-200 mb-1.5">
                      Título *
                    </label>
                    <input
                      type="text"
                      className={`input w-full ${errors.titulo ? 'border-red-300' : ''}`}
                      placeholder="Ex: Evolução diária, Verificação de PA..."
                      value={formData.titulo}
                      onChange={e => setFormData({...formData, titulo: e.target.value})}
                    />
                    {errors.titulo && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.titulo}
                      </p>
                    )}
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-gray-200 mb-1.5">
                      Descrição *
                    </label>
                    <textarea
                      className={`input w-full min-h-[100px] ${errors.descricao ? 'border-red-300' : ''}`}
                      placeholder="Descreva a evolução clínica, sinais e sintomas, procedimentos realizados..."
                      value={formData.descricao}
                      onChange={e => setFormData({...formData, descricao: e.target.value})}
                    />
                    {errors.descricao && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.descricao}
                      </p>
                    )}
                  </div>
                </div>

                {/* Seção: Sinais Vitais */}
                <div className="bg-blue-50 dark:bg-gray-700/50 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="text-blue-600" size={20} />
                    <h4 className="font-bold text-slate-800 dark:text-gray-100">Sinais Vitais</h4>
                    <span className="text-xs text-slate-500 dark:text-gray-400">(Opcional)</span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-gray-200 mb-1.5 flex items-center gap-1">
                        <Heart size={14} /> PA (mmHg)
                      </label>
                      <input
                        type="text"
                        className="input w-full"
                        placeholder="120/80"
                        value={formData.pa}
                        onChange={e => setFormData({...formData, pa: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-gray-200 mb-1.5 flex items-center gap-1">
                        <Activity size={14} /> FC (bpm)
                      </label>
                      <input
                        type="number"
                        className="input w-full"
                        placeholder="72"
                        value={formData.fc}
                        onChange={e => setFormData({...formData, fc: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-gray-200 mb-1.5 flex items-center gap-1">
                        <Wind size={14} /> FR (irpm)
                      </label>
                      <input
                        type="number"
                        className="input w-full"
                        placeholder="16"
                        value={formData.fr}
                        onChange={e => setFormData({...formData, fr: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-gray-200 mb-1.5 flex items-center gap-1">
                        <Thermometer size={14} /> Temp (°C)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        className="input w-full"
                        placeholder="36.5"
                        value={formData.temp}
                        onChange={e => setFormData({...formData, temp: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-gray-200 mb-1.5 flex items-center gap-1">
                        <Activity size={14} /> SatO2 (%)
                      </label>
                      <input
                        type="number"
                        className="input w-full"
                        placeholder="98"
                        value={formData.sato2}
                        onChange={e => setFormData({...formData, sato2: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-gray-200 mb-1.5 flex items-center gap-1">
                        <Droplet size={14} /> Glicemia (mg/dL)
                      </label>
                      <input
                        type="number"
                        className="input w-full"
                        placeholder="90"
                        value={formData.glicemia}
                        onChange={e => setFormData({...formData, glicemia: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Seção: Avaliação e Riscos */}
                <div className="bg-orange-50 dark:bg-gray-700/50 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldAlert className="text-orange-600" size={20} />
                    <h4 className="font-bold text-slate-800 dark:text-gray-100">Avaliação e Riscos</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-gray-200 mb-1.5">
                        Estado Geral
                      </label>
                      <select
                        className="input w-full"
                        value={formData.estadoGeral}
                        onChange={e => setFormData({...formData, estadoGeral: e.target.value})}
                      >
                        <option value="bom">Bom</option>
                        <option value="regular">Regular</option>
                        <option value="grave">Grave</option>
                        <option value="critico">Crítico</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-gray-200 mb-1.5">
                        Prioridade
                      </label>
                      <select
                        className="input w-full"
                        value={formData.prioridade}
                        onChange={e => setFormData({...formData, prioridade: e.target.value})}
                      >
                        <option value="baixa">Baixa</option>
                        <option value="media">Média</option>
                        <option value="alta">Alta</option>
                        <option value="urgente">Urgente</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-gray-200 mb-1.5">
                        Risco de Queda
                      </label>
                      <select
                        className="input w-full"
                        value={formData.riscoQueda}
                        onChange={e => setFormData({...formData, riscoQueda: e.target.value})}
                      >
                        <option value="">Não avaliado</option>
                        <option value="baixo">Baixo</option>
                        <option value="medio">Médio</option>
                        <option value="alto">Alto</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-gray-200 mb-1.5">
                        Risco de Lesão
                      </label>
                      <select
                        className="input w-full"
                        value={formData.riscoLesao}
                        onChange={e => setFormData({...formData, riscoLesao: e.target.value})}
                      >
                        <option value="">Não avaliado</option>
                        <option value="baixo">Baixo</option>
                        <option value="medio">Médio</option>
                        <option value="alto">Alto</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                          checked={formData.alerta}
                          onChange={e => setFormData({...formData, alerta: e.target.checked})}
                        />
                        <span className="text-sm font-medium text-slate-700 dark:text-gray-200 flex items-center gap-2">
                          <AlertTriangle size={16} className="text-red-500" />
                          Marcar como alerta (requer atenção especial)
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Observações Adicionais */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-gray-200 mb-1.5">
                    Observações Adicionais
                  </label>
                  <textarea
                    className="input w-full min-h-[80px]"
                    placeholder="Informações complementares, condutas tomadas..."
                    value={formData.observacoes}
                    onChange={e => setFormData({...formData, observacoes: e.target.value})}
                  />
                </div>

                {/* Footer Actions */}
                <div className="pt-4 flex gap-3 border-t border-slate-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="btn btn-secondary flex-1 py-2.5"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1 py-2.5 shadow-lg shadow-primary-500/20"
                  >
                    {editingId ? 'Salvar Alterações' : 'Criar Registro'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
