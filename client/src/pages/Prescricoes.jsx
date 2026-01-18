import { useState, useEffect } from 'react';
import {
  Plus,
  FileText,
  X,
  RefreshCcw,
  SlidersHorizontal,
  Inbox,
  CheckCircle2,
} from 'lucide-react';
import { prescricaoService } from '../services/prescricao.service';
import { pacienteService } from '../services/paciente.service';
import toast from 'react-hot-toast';
import { successMessage, errorMessage } from '../utils/toastMessages';
import PageHeader from '../components/common/PageHeader';
import StatsCard from '../components/common/StatsCard';
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

export default function Prescricoes() {
  const [prescricoes, setPrescricoes] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState('');
  const [tipo, setTipo] = useState('comum');
  const [medicamentos, setMedicamentos] = useState([
    { nome: '', dosagem: '', frequencia: '', duracao: '', observacoes: '' }
  ]);
  const [statusFilter, setStatusFilter] = useState('todas');
  const [tipoFilter, setTipoFilter] = useState('todas');
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prescricoesData, pacientesData] = await Promise.all([
        prescricaoService.getAll(),
        pacienteService.getAll(),
      ]);
      
      const prescricoesList = Array.isArray(prescricoesData) 
        ? prescricoesData 
        : (prescricoesData.prescricoes || []);
      setPrescricoes(prescricoesList);

      const pacientesList = Array.isArray(pacientesData) 
        ? pacientesData 
        : (pacientesData.pacientes || []);
      setPacientes(pacientesList);
    } catch (error) {
      toast.error(errorMessage('load', 'dados'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedicamento = () => {
    setMedicamentos([
      ...medicamentos,
      { nome: '', dosagem: '', frequencia: '', duracao: '', observacoes: '' }
    ]);
  };

  const handleRemoveMedicamento = (index) => {
    setMedicamentos(medicamentos.filter((_, i) => i !== index));
  };

  const handleMedicamentoChange = (index, field, value) => {
    const newMedicamentos = [...medicamentos];
    newMedicamentos[index][field] = value;
    setMedicamentos(newMedicamentos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await prescricaoService.create({
        pacienteId: selectedPaciente,
        tipo,
        medicamentos: medicamentos.filter(m => m.nome.trim() !== ''),
      });

      toast.success(successMessage('create', 'Prescrição', { gender: 'f' }));
      setModalOpen(false);
      setSelectedPaciente('');
      setTipo('comum');
      setMedicamentos([{ nome: '', dosagem: '', frequencia: '', duracao: '', observacoes: '' }]);
      setFeedback({ type: 'success', message: 'Prescrição cadastrada com sucesso.' });
      loadData();
    } catch (error) {
      toast.error(errorMessage('create', 'prescrição'));
    }
  };

  const handleCancelar = async (id) => {
    if (!window.confirm('Tem certeza que deseja cancelar esta prescrição?')) {
      return;
    }

    try {
      await prescricaoService.cancelar(id);
      toast.success('Prescrição cancelada');
      setFeedback({ type: 'warning', message: 'Prescrição foi cancelada.' });
      loadData();
    } catch (error) {
      toast.error(errorMessage('cancel', 'prescrição'));
    }
  };

  const filteredPrescricoes = prescricoes.filter((prescricao) => {
    if (statusFilter !== 'todas' && prescricao.status !== statusFilter) {
      return false;
    }
    if (tipoFilter !== 'todas' && prescricao.tipo !== tipoFilter) {
      return false;
    }
    return true;
  });

  const stats = {
    total: prescricoes.length,
    ativas: prescricoes.filter(p => p.status === 'ativa').length,
    controladas: prescricoes.filter(p => p.tipo === 'controlado').length,
    hoje: prescricoes.filter(p => {
      const date = new Date(p.createdAt);
      const now = new Date();
      return date.getDate() === now.getDate() && 
             date.getMonth() === now.getMonth() && 
             date.getFullYear() === now.getFullYear();
    }).length
  };

  return (
    <div className="space-y-8">
      <PageHeader
        label="Operação Clínica"
        title="Prescrições"
        subtitle="Controle total das prescrições emitidas, status em tempo real e histórico completo."
      >
        <button
          onClick={() => setModalOpen(true)}
          className="btn btn-primary flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20"
        >
          <Plus size={18} /> Nova Prescrição
        </button>
        <button
          type="button"
          onClick={loadData}
          className="btn btn-secondary flex items-center justify-center gap-2"
        >
          <RefreshCcw size={18} /> Atualizar
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={FileText}
          label="Total"
          value={stats.total}
          description="Prescrições emitidas"
          color="primary"
        />
        <StatsCard
          icon={CheckCircle2}
          label="Ativas"
          value={stats.ativas}
          description="Em vigência"
          color="emerald"
        />
        <StatsCard
          icon={Inbox}
          label="Controladas"
          value={stats.controladas}
          description="Medicamentos especiais"
          color="orange"
        />
        <StatsCard
          icon={Plus}
          label="Hoje"
          value={`+${stats.hoje}`}
          description="Emitidas hoje"
          color="purple"
        />
      </div>

      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <SlidersHorizontal size={16} />
            <span className="font-medium">Filtros:</span>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:border-primary-500"
            >
              <option value="todas">Todos os Status</option>
              <option value="ativa">Ativas</option>
              <option value="cancelada">Canceladas</option>
            </select>
            <select
              value={tipoFilter}
              onChange={(e) => setTipoFilter(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:border-primary-500"
            >
              <option value="todas">Todos os Tipos</option>
              <option value="comum">Comum</option>
              <option value="controlado">Controlado</option>
            </select>
          </div>
        </div>
      </div>

      {feedback && (
        <div
          className={`card flex items-center gap-3 border ${
            feedback.type === 'success'
              ? 'border-emerald-200 bg-emerald-50'
              : 'border-amber-200 bg-amber-50'
          }`}
        >
          <CheckCircle2 className="text-emerald-500" size={20} />
          <p className="text-sm text-slate-700">{feedback.message}</p>
          <button className="ml-auto text-xs text-slate-500" onClick={() => setFeedback(null)}>
            Fechar
          </button>
        </div>
      )}

      <TableContainer title="Prescrições">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredPrescricoes.length > 0 ? (
          <>
            {/* Mobile */}
            <MobileGrid>
              {filteredPrescricoes.map((p) => (
                <MobileCard key={p.id || p._id}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-xs">
                        {p.pacienteNome ? p.pacienteNome.charAt(0) : 'P'}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-gray-100">{p.pacienteNome}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-600 dark:text-gray-300">
                          <span>{new Date(p.createdAt).toLocaleDateString('pt-BR')}</span>
                          <span className="text-slate-400">
                            {new Date(p.createdAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      p.tipo === 'controlado' 
                        ? 'bg-orange-100 text-orange-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {p.tipo === 'controlado' ? 'Controlado' : 'Comum'}
                    </span>
                  </div>
                  <div className="mt-3 text-sm text-slate-700 dark:text-gray-200">
                    {p.medicamentos && p.medicamentos.length > 0 ? (
                      <div>
                        <span className="font-medium">{p.medicamentos[0].nome}</span>
                        {p.medicamentos.length > 1 && (
                          <span className="text-slate-400 text-xs ml-1">
                            +{p.medicamentos.length - 1} outros
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      p.status === 'ativa' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                        : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                      {p.status === 'ativa' ? (
                        <><CheckCircle2 size={12} /> Ativa</>
                      ) : (
                        <><X size={12} /> Cancelada</>
                      )}
                    </span>
                    {p.status === 'ativa' && (
                      <button
                        onClick={() => handleCancelar(p.id || p._id)}
                        className="text-red-600 hover:text-red-800 text-xs font-semibold hover:underline"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </MobileCard>
              ))}
            </MobileGrid>

            {/* Desktop */}
            <TableWrapper>
              <TableHeader columns={["Paciente","Data Emissão","Tipo","Medicamentos","Status","Ações"]} />
              <TBody>
                {filteredPrescricoes.map((prescricao) => (
                  <Tr key={prescricao.id || prescricao._id}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-xs">
                          {prescricao.pacienteNome ? prescricao.pacienteNome.charAt(0) : 'P'}
                        </div>
                        <span className="font-medium text-slate-900 dark:text-gray-100">{prescricao.pacienteNome}</span>
                      </div>
                    </Td>
                    <Td className="text-sm text-slate-600 dark:text-gray-300">
                      {new Date(prescricao.createdAt).toLocaleDateString('pt-BR')}
                      <span className="text-xs text-slate-400 block">
                        {new Date(prescricao.createdAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </Td>
                    <Td>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        prescricao.tipo === 'controlado' 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {prescricao.tipo === 'controlado' ? 'Controlado' : 'Comum'}
                      </span>
                    </Td>
                    <Td className="text-sm text-slate-600 dark:text-gray-300">
                      {prescricao.medicamentos && prescricao.medicamentos.length > 0 ? (
                        <div>
                          <span className="font-medium">{prescricao.medicamentos[0].nome}</span>
                          {prescricao.medicamentos.length > 1 && (
                            <span className="text-slate-400 text-xs ml-1">
                              +{prescricao.medicamentos.length - 1} outros
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </Td>
                    <Td>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        prescricao.status === 'ativa' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-red-50 text-red-700 border border-red-100'
                      }`}>
                        {prescricao.status === 'ativa' ? (
                          <><CheckCircle2 size={12} /> Ativa</>
                        ) : (
                          <><X size={12} /> Cancelada</>
                        )}
                      </span>
                    </Td>
                    <Td className="text-right">
                      {prescricao.status === 'ativa' && (
                        <button
                          onClick={() => handleCancelar(prescricao.id || prescricao._id)}
                          className="text-red-600 hover:text-red-800 text-xs font-semibold hover:underline"
                        >
                          Cancelar
                        </button>
                      )}
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </TableWrapper>
          </>
        ) : (
          <EmptyState
            icon={Inbox}
            title="Nenhuma prescrição encontrada"
            description="Comece emitindo uma nova prescrição."
            actionLabel="Nova Prescrição"
            onAction={() => setModalOpen(true)}
          />
        )}
      </TableContainer>

      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Cadastro</p>
                <h2 className="text-2xl font-bold">Nova Prescrição</h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 hover:bg-slate-50 rounded-2xl"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Paciente *</label>
                  <select
                    value={selectedPaciente}
                    onChange={(e) => setSelectedPaciente(e.target.value)}
                    className="input"
                    required
                  >
                    <option value="">Selecione um paciente</option>
                    {pacientes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tipo *</label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="input"
                    required
                  >
                    <option value="comum">Comum</option>
                    <option value="controlado">Controlado</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Sessão</p>
                    <h3 className="text-lg font-semibold">Medicamentos</h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddMedicamento}
                    className="btn btn-secondary flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Adicionar
                  </button>
                </div>

                <div className="space-y-4">
                  {medicamentos.map((med, index) => (
                    <div key={index} className="p-4 border border-slate-100 rounded-2xl">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium">Medicamento {index + 1}</h4>
                        {medicamentos.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMedicamento(index)}
                            className="text-red-600 hover:bg-red-50 p-1 rounded-xl"
                          >
                            <X size={18} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1">Nome *</label>
                          <input
                            type="text"
                            value={med.nome}
                            onChange={(e) => handleMedicamentoChange(index, 'nome', e.target.value)}
                            className="input"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Dosagem *</label>
                          <input
                            type="text"
                            value={med.dosagem}
                            onChange={(e) => handleMedicamentoChange(index, 'dosagem', e.target.value)}
                            className="input"
                            placeholder="Ex: 500mg"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Frequência *</label>
                          <input
                            type="text"
                            value={med.frequencia}
                            onChange={(e) => handleMedicamentoChange(index, 'frequencia', e.target.value)}
                            className="input"
                            placeholder="Ex: 8/8h"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Duração *</label>
                          <input
                            type="text"
                            value={med.duracao}
                            onChange={(e) => handleMedicamentoChange(index, 'duracao', e.target.value)}
                            className="input"
                            placeholder="Ex: 7 dias"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Observações</label>
                          <input
                            type="text"
                            value={med.observacoes}
                            onChange={(e) => handleMedicamentoChange(index, 'observacoes', e.target.value)}
                            className="input"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Criar Prescrição
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}