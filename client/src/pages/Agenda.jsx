import { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin,
  User, 
  Stethoscope,
  Users,
  FileText,
  Trash2,
  Edit,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { agendamentoService } from '../services/agendamento.service';
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

export default function Agenda() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterTerm, setFilterTerm] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    tipo: 'Compromisso',
    titulo: '',
    data: '',
    horario: '',
    participante: '',
    local: '',
    descricao: ''
  });

  useEffect(() => {
    loadAgendamentos();
  }, []);

  const loadAgendamentos = async () => {
    try {
      setLoading(true);
      // Carregar agendamentos futuros (próximos 3 meses por padrão para esta visualização de lista)
      const today = new Date();
      const futureDate = new Date();
      futureDate.setMonth(today.getMonth() + 3);

      const data = await agendamentoService.getAll({
        dataInicio: today.toISOString(),
        dataFim: futureDate.toISOString()
      });
      setAgendamentos(data);
    } catch (error) {
      toast.error(errorMessage('load', 'agenda'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataInicio = new Date(`${formData.data}T${formData.horario}:00`);
      const dataFim = new Date(dataInicio.getTime() + 60 * 60 * 1000); // Duração padrão de 1h

      const payload = {
        titulo: formData.titulo,
        tipo: formData.tipo,
        participante: formData.participante,
        local: formData.local,
        observacoes: formData.descricao,
        dataHoraInicio: dataInicio.toISOString(),
        dataHoraFim: dataFim.toISOString()
      };

      if (editingId) {
        await agendamentoService.update(editingId, payload);
        toast.success(successMessage('update', 'Agendamento'));
      } else {
        await agendamentoService.create(payload);
        toast.success(successMessage('create', 'Agendamento'));
      }

      setModalOpen(false);
      resetForm();
      loadAgendamentos();
    } catch (error) {
      toast.error(apiErrorMessage(error, errorMessage('save', 'agendamento')));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este agendamento?')) return;
    try {
      await agendamentoService.delete(id);
      toast.success('Agendamento excluído');
      loadAgendamentos();
    } catch (error) {
      toast.error(errorMessage('delete', 'agendamento'));
    }
  };

  const handleEdit = (agendamento) => {
    const date = new Date(agendamento.dataHoraInicio);
    setFormData({
      tipo: agendamento.tipo,
      titulo: agendamento.titulo,
      data: date.toISOString().split('T')[0],
      horario: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      participante: agendamento.participante || '',
      local: agendamento.local || '',
      descricao: agendamento.observacoes || ''
    });
    setEditingId(agendamento.id || agendamento._id);
    setModalOpen(true);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await agendamentoService.update(id, { status: newStatus });
      toast.success('Status atualizado');
      loadAgendamentos();
    } catch (error) {
      toast.error(errorMessage('update', 'status'));
    }
  };

  const resetForm = () => {
    setFormData({
      tipo: 'Compromisso',
      titulo: '',
      data: '',
      horario: '',
      participante: '',
      local: '',
      descricao: ''
    });
    setEditingId(null);
  };

  const openModal = (tipo = 'Compromisso') => {
    resetForm();
    setFormData(prev => ({ ...prev, tipo }));
    setModalOpen(true);
  };

  const getIconByType = (type) => {
    switch (type) {
      case 'Consulta': return <Stethoscope size={18} />;
      case 'Reunião': return <Users size={18} />;
      case 'Exame': return <FileText size={18} />;
      default: return <CalendarIcon size={18} />;
    }
  };

  const filteredAgendamentos = agendamentos.filter(ag => 
    ag.titulo.toLowerCase().includes(filterTerm.toLowerCase()) ||
    ag.participante?.toLowerCase().includes(filterTerm.toLowerCase())
  );

  const stats = {
    total: agendamentos.length,
    confirmados: agendamentos.filter(a => a.status === 'confirmado').length,
    pendentes: agendamentos.filter(a => a.status === 'agendado').length,
    hoje: agendamentos.filter(a => {
      const date = new Date(a.dataHoraInicio);
      const now = new Date();
      return date.getDate() === now.getDate() && 
             date.getMonth() === now.getMonth() && 
             date.getFullYear() === now.getFullYear();
    }).length
  };

  return (
    <div className="space-y-8">
      <PageHeader
        label="Institucional"
        title="Agenda"
        subtitle="Gerencie consultas, reuniões e compromissos da instituição de forma centralizada."
      >
        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
          <button 
            onClick={() => openModal('Reunião')}
            className="btn btn-secondary flex items-center justify-center gap-2"
          >
            <Users size={18} /> Nova Reunião
          </button>
          <button 
            onClick={() => openModal('Compromisso')}
            className="btn btn-primary flex items-center justify-center gap-2 shadow-lg shadow-primary-600/20"
          >
            <Plus size={18} /> Novo Compromisso
          </button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={CalendarIcon}
          label="Total"
          value={stats.total}
          description="Agendamentos futuros"
          color="primary"
        />
        <StatsCard
          icon={CheckCircle2}
          label="Confirmados"
          value={stats.confirmados}
          description="Confirmados"
          color="emerald"
        />
        <StatsCard
          icon={AlertCircle}
          label="Pendentes"
          value={stats.pendentes}
          description="Aguardando confirmação"
          color="orange"
        />
        <StatsCard
          icon={Clock}
          label="Hoje"
          value={stats.hoje}
          description="Eventos para hoje"
          color="purple"
        />
      </div>

      <SearchFilterBar
        searchTerm={filterTerm}
        onSearchChange={setFilterTerm}
        placeholder="Buscar por título ou participante..."
      />

      <TableContainer title="Agendamentos">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredAgendamentos.length > 0 ? (
          <>
            {/* Mobile */}
            <MobileGrid>
              {filteredAgendamentos.map((ag) => (
                <MobileCard key={ag.id || ag._id}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        ag.tipo === 'Consulta' ? 'bg-blue-50 text-blue-600' :
                        ag.tipo === 'Reunião' ? 'bg-purple-50 text-purple-600' :
                        ag.tipo === 'Exame' ? 'bg-amber-50 text-amber-600' :
                        'bg-primary-50 text-primary-600'
                      }`}>
                        {getIconByType(ag.tipo)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-gray-100">{ag.titulo}</p>
                        <p className="text-xs text-slate-500 dark:text-gray-400">{ag.tipo}</p>
                      </div>
                    </div>
                    <select 
                      value={ag.status}
                      onChange={(e) => handleStatusChange(ag.id || ag._id, e.target.value)}
                      className={`text-xs font-bold px-2 py-1 rounded-full border-none focus:ring-2 focus:ring-primary-500 ${
                        ag.status === 'agendado' ? 'bg-primary-50 text-primary-700' : 
                        ag.status === 'confirmado' ? 'bg-emerald-50 text-emerald-700' : 
                        ag.status === 'cancelado' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <option value="agendado">Agendado</option>
                      <option value="confirmado">Confirmado</option>
                      <option value="cancelado">Cancelado</option>
                      <option value="concluido">Concluído</option>
                    </select>
                  </div>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-gray-300">
                      <Clock size={14} />
                      <span>{new Date(ag.dataHoraInicio).toLocaleDateString('pt-BR')} às {new Date(ag.dataHoraInicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {ag.participante && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-gray-300">
                        <User size={14} />
                        <span>{ag.participante}</span>
                      </div>
                    )}
                    {ag.local && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-gray-300">
                        <MapPin size={14} />
                        <span>{ag.local}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-3">
                    <button 
                      onClick={() => handleEdit(ag)}
                      className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(ag.id || ag._id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </MobileCard>
              ))}
            </MobileGrid>

            {/* Desktop */}
            <TableWrapper>
              <TableHeader columns={["Tipo","Título","Data/Hora","Participante","Local","Status","Ações"]} />
              <TBody>
                {filteredAgendamentos.map((ag) => (
                  <Tr key={ag.id || ag._id}>
                    <Td>
                      <div className="flex items-center gap-2 text-slate-700 dark:text-gray-200 font-medium">
                        <div className={`p-2 rounded-lg ${
                          ag.tipo === 'Consulta' ? 'bg-blue-50 text-blue-600' :
                          ag.tipo === 'Reunião' ? 'bg-purple-50 text-purple-600' :
                          ag.tipo === 'Exame' ? 'bg-amber-50 text-amber-600' :
                          'bg-primary-50 text-primary-600'
                        }`}>
                          {getIconByType(ag.tipo)}
                        </div>
                        <span className="text-sm">{ag.tipo}</span>
                      </div>
                    </Td>
                    <Td>
                      <span className="font-semibold text-slate-900 dark:text-gray-100">{ag.titulo}</span>
                    </Td>
                    <Td>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700 dark:text-gray-200">
                          {new Date(ag.dataHoraInicio).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-gray-400">
                          {new Date(ag.dataHoraInicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </Td>
                    <Td>
                      {ag.participante ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-gray-700 flex items-center justify-center text-slate-500 dark:text-gray-300 text-xs font-bold">
                            {ag.participante.charAt(0)}
                          </div>
                          <span className="text-sm text-slate-600 dark:text-gray-300">{ag.participante}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 dark:text-gray-500 text-sm">-</span>
                      )}
                    </Td>
                    <Td>
                      {ag.local ? (
                        <div className="flex items-center gap-2 text-slate-600 dark:text-gray-300">
                          <MapPin size={14} className="text-slate-400" />
                          <span className="text-sm">{ag.local}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 dark:text-gray-500 text-sm">-</span>
                      )}
                    </Td>
                    <Td>
                      <select 
                        value={ag.status}
                        onChange={(e) => handleStatusChange(ag.id || ag._id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1 rounded-full border-none focus:ring-2 focus:ring-primary-500 cursor-pointer ${
                          ag.status === 'agendado' ? 'bg-primary-50 text-primary-700 ring-1 ring-primary-100' : 
                          ag.status === 'confirmado' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100' : 
                          ag.status === 'cancelado' ? 'bg-red-50 text-red-700 ring-1 ring-red-100' : 'bg-slate-100 text-slate-700 ring-1 ring-slate-200'
                        }`}
                      >
                        <option value="agendado">Agendado</option>
                        <option value="confirmado">Confirmado</option>
                        <option value="cancelado">Cancelado</option>
                        <option value="concluido">Concluído</option>
                      </select>
                    </Td>
                    <Td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(ag)}
                          className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(ag.id || ag._id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </TableWrapper>
          </>
        ) : (
          <div className="p-8">
            <EmptyState
              icon={CalendarIcon}
              title="Nenhum agendamento encontrado"
              description="Nenhum agendamento encontrado."
            />
          </div>
        )}
      </TableContainer>

      {/* Modal de Novo/Editar Agendamento */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-start bg-slate-50/50 shrink-0">
              <div>
                <h3 className="font-bold text-xl text-slate-800">
                  {editingId ? 'Editar Agendamento' : 'Novo Agendamento'}
                </h3>
                <p className="text-sm text-slate-500 mt-1">Preencha os dados do compromisso.</p>
              </div>
              <button 
                onClick={() => setModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tipo</label>
                  <select
                    className="input w-full"
                    value={formData.tipo}
                    onChange={e => setFormData({...formData, tipo: e.target.value})}
                  >
                    <option value="Compromisso">Compromisso</option>
                    <option value="Reunião">Reunião</option>
                    <option value="Consulta">Consulta</option>
                    <option value="Exame">Exame</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Título *</label>
                  <input
                    type="text"
                    required
                    className="input w-full"
                    placeholder="Ex: Reunião de Equipe"
                    value={formData.titulo}
                    onChange={e => setFormData({...formData, titulo: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Data *</label>
                    <input
                      type="date"
                      required
                      className="input w-full"
                      value={formData.data}
                      onChange={e => setFormData({...formData, data: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Horário *</label>
                    <input
                      type="time"
                      required
                      className="input w-full"
                      value={formData.horario}
                      onChange={e => setFormData({...formData, horario: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Participante</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      className="input w-full pl-10"
                      placeholder="Nome do participante"
                      value={formData.participante}
                      onChange={e => setFormData({...formData, participante: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Local</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      className="input w-full pl-10"
                      placeholder="Local do evento"
                      value={formData.local}
                      onChange={e => setFormData({...formData, local: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Descrição</label>
                  <textarea
                    className="input w-full min-h-[100px] py-3"
                    placeholder="Detalhes adicionais..."
                    value={formData.descricao}
                    onChange={e => setFormData({...formData, descricao: e.target.value})}
                  />
                </div>

                <div className="pt-4 flex gap-3 border-t border-slate-100 mt-2">
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
                    {editingId ? 'Salvar Alterações' : 'Agendar'}
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
