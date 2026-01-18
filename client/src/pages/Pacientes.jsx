import { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  RefreshCcw,
  Download,
  Users,
  CheckCircle2,
  Filter,
  FileText,
  X,
  Calendar,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { pacienteService } from '../services/paciente.service';
import toast from 'react-hot-toast';
import { successMessage, errorMessage } from '../utils/toastMessages';
import PacienteModal from '../components/PacienteModal';
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

export default function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [viewHistorico, setViewHistorico] = useState(null);
  const [historicoPrescricoes, setHistoricoPrescricoes] = useState([]);

  useEffect(() => {
    loadPacientes();
  }, []);

  const loadPacientes = async (search = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      
      const data = await pacienteService.getAll(params.toString());
      const pacientesList = Array.isArray(data) ? data : (data.pacientes || []);
      setPacientes(pacientesList);
    } catch (error) {
      toast.error(errorMessage('load', 'pacientes'));
    } finally {
      setLoading(false);
    }
  };

  const handleViewHistorico = async (paciente) => {
    try {
      setViewHistorico(paciente);
      const response = await pacienteService.getHistorico(paciente.id || paciente._id);
      setHistoricoPrescricoes(response.prescricoes || []);
    } catch (error) {
      toast.error(errorMessage('load', 'histórico'));
    }
  };

  const closeHistorico = () => {
    setViewHistorico(null);
    setHistoricoPrescricoes([]);
  };

  const handleEdit = (paciente) => {
    setSelectedPaciente(paciente);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este paciente?')) {
      return;
    }

    try {
      await pacienteService.delete(id);
      toast.success(successMessage('delete', 'Paciente'));
      loadPacientes(searchTerm);
    } catch (error) {
      toast.error(errorMessage('delete', 'paciente'));
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedPaciente(null);
    loadPacientes(searchTerm);
  };

  const filteredPacientes = pacientes.filter(p => {
    const matchesSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.cpf && p.cpf.includes(searchTerm));
    const matchesStatus = statusFilter ? p.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const novosMes = pacientes.filter(p => {
    if (!p.createdAt) return false;
    const date = new Date(p.createdAt);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;
  const pacientesComNascimento = pacientes.filter(p => p.dataNascimento);
  const idadeMedia = pacientesComNascimento.length > 0
    ? Math.round(pacientesComNascimento.reduce((acc, p) => {
        const age = new Date().getFullYear() - new Date(p.dataNascimento).getFullYear();
        return acc + age;
      }, 0) / pacientesComNascimento.length)
    : 0;
  const stats = {
    total: pacientes.length,
    novosMes,
    idadeMedia
  };

  return (
    <div className="space-y-8">
      <PageHeader
        label="Cadastros"
        title="Residentes"
        subtitle="Gerencie os residentes da instituição, histórico clínico e dados pessoais."
      >
        <button
          onClick={() => setModalOpen(true)}
          className="btn btn-primary flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20"
        >
          <Plus size={20} /> Novo Residente
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          icon={Users}
          label="Total"
          value={stats.total}
          description="Residentes cadastrados"
          color="primary"
        />
        <StatsCard
          icon={CheckCircle2}
          label="Novos"
          value={`+${stats.novosMes}`}
          description="Cadastrados este mês"
          color="emerald"
        />
        <StatsCard
          icon={Download}
          label="Média"
          value={`${stats.idadeMedia} anos`}
          description="Idade média dos residentes"
          color="purple"
        />
      </div>

      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Buscar por nome ou CPF..."
      >
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        >
          <option value="">Todos os status</option>
          <option value="ativo">Ativos</option>
          <option value="inativo">Inativos</option>
        </select>
        <button
          type="button"
          onClick={() => loadPacientes(searchTerm)}
          className="btn btn-secondary flex items-center gap-2"
        >
          <RefreshCcw size={18} /> Atualizar
        </button>
      </SearchFilterBar>

      <TableContainer title="Residentes">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredPacientes.length > 0 ? (
          <>
            {/* Mobile */}
            <MobileGrid>
              {filteredPacientes.map((paciente) => (
                <MobileCard key={paciente.id || paciente._id}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-sm">
                        {paciente.nome.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-gray-100">{paciente.nome}</p>
                        <p className="text-xs text-slate-500 dark:text-gray-400">CPF: {paciente.cpf || '-'}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400 mt-1">
                          <Calendar size={12} />
                          {paciente.dataNascimento ? new Date(paciente.dataNascimento).toLocaleDateString('pt-BR') : '-'}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-gray-400">
                      {paciente.status === 'inativo' ? 'Inativo' : 'Ativo'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-slate-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <Phone size={12} />
                      <span>{paciente.telefone || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={12} />
                      <span>{paciente.email || '-'}</span>
                    </div>
                    {paciente.endereco && (
                      <div className="flex items-center gap-2 col-span-2">
                        <MapPin size={12} />
                        <span className="line-clamp-1">{paciente.endereco}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-3">
                    <button
                      onClick={() => handleViewHistorico(paciente)}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                      title="Ver Histórico"
                    >
                      <FileText size={16} />
                    </button>
                    <button
                      onClick={() => handleEdit(paciente)}
                      className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(paciente.id || paciente._id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </MobileCard>
              ))}
            </MobileGrid>

            {/* Desktop */}
            <TableWrapper>
              <TableHeader columns={["Nome","CPF","Nascimento","Telefone","Ações"]} />
              <TBody>
                {filteredPacientes.map((paciente) => (
                  <Tr key={paciente.id || paciente._id}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-xs">
                          {paciente.nome.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-900 dark:text-gray-100">{paciente.nome}</span>
                      </div>
                    </Td>
                    <Td className="text-sm text-slate-600 dark:text-gray-300">{paciente.cpf || '-'}</Td>
                    <Td className="text-sm text-slate-600 dark:text-gray-300">
                      {paciente.dataNascimento ? new Date(paciente.dataNascimento).toLocaleDateString('pt-BR') : '-'}
                    </Td>
                    <Td className="text-sm text-slate-600 dark:text-gray-300">{paciente.telefone || '-'}</Td>
                    <Td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewHistorico(paciente)}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                          title="Ver Histórico"
                        >
                          <FileText size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(paciente)}
                          className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(paciente.id || paciente._id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Excluir"
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
          <EmptyState
            icon={Users}
            title="Nenhum residente encontrado"
            description="Cadastre o primeiro residente para começar."
            actionLabel="Cadastrar Residente"
            onAction={() => setModalOpen(true)}
          />
        )}
      </TableContainer>

      {modalOpen && (
        <PacienteModal
          paciente={selectedPaciente}
          onClose={handleModalClose}
        />
      )}

      {/* Modal Histórico de Prescrições */}
      {viewHistorico && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="text-primary-600" />
                  Histórico de Prescrições
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {viewHistorico.nome} - {viewHistorico.cpf}
                </p>
              </div>
              <button
                onClick={closeHistorico}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {historicoPrescricoes.length > 0 ? (
                <div className="space-y-4">
                  {historicoPrescricoes.map((prescricao) => (
                    <div
                      key={prescricao._id}
                      className="p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-sm text-slate-500">
                            {new Date(prescricao.createdAt).toLocaleString('pt-BR')}
                          </p>
                          <p className="text-sm font-medium text-slate-700 mt-1">
                            Dr(a). {prescricao.medicoId?.nome || 'Não informado'}
                            {prescricao.medicoId?.crm && ` - CRM ${prescricao.medicoId.crm}`}
                          </p>
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
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {prescricao.status}
                          </span>
                        </div>
                      </div>

                      {prescricao.medicamentos && prescricao.medicamentos.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
                            Medicamentos
                          </p>
                          <ul className="space-y-1">
                            {prescricao.medicamentos.map((med, idx) => (
                              <li key={idx} className="text-sm text-slate-700">
                                • {med.nome}
                                {med.dosagem && ` - ${med.dosagem}`}
                                {med.via && ` (${med.via})`}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {prescricao.observacoes && (
                        <div className="mt-3 p-3 bg-white rounded-lg">
                          <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                            Observações
                          </p>
                          <p className="text-sm text-slate-600">{prescricao.observacoes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText size={48} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500">Nenhuma prescrição encontrada</p>
                  <p className="text-sm text-slate-400 mt-1">
                    Este paciente ainda não possui prescrições registradas.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}