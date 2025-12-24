import { useState, useEffect } from 'react';
import {
  Plus,
  FileText,
  X,
  RefreshCcw,
  SlidersHorizontal,
  Inbox,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { prescricaoService } from '../services/prescricao.service';
import { pacienteService } from '../services/paciente.service';
import toast from 'react-hot-toast';
import PageHeader from '../components/common/PageHeader';
import StatsCard from '../components/common/StatsCard';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';

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
      toast.error('Erro ao carregar dados');
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

    const medicamentosValidos = medicamentos.filter(m => m.nome.trim() !== '');
    if (!selectedPaciente || medicamentosValidos.length === 0) {
      toast.error('Selecione um paciente e informe ao menos um medicamento.');
      return;
    }

    try {
      await prescricaoService.create({
        pacienteId: selectedPaciente,
        tipo,
        medicamentos: medicamentosValidos,
      });

      toast.success('Prescrição criada com sucesso');
      setModalOpen(false);
      setSelectedPaciente('');
      setTipo('comum');
      setMedicamentos([{ nome: '', dosagem: '', frequencia: '', duracao: '', observacoes: '' }]);
      setFeedback({ type: 'success', message: 'Prescrição cadastrada com sucesso.' });
      loadData();
    } catch (error) {
      toast.error('Erro ao criar prescrição');
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
      toast.error('Erro ao cancelar prescrição');
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
          {feedback.type === 'success' ? (
            <CheckCircle2 className="text-emerald-500" size={20} />
          ) : (
            <AlertTriangle className="text-amber-500" size={20} />
          )}
          <p className="text-sm text-slate-700">{feedback.message}</p>
          <button className="ml-auto text-xs text-slate-500" onClick={() => setFeedback(null)}>
            Fechar
          </button>
        </div>
      )}

      <div className="card overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : filteredPrescricoes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Paciente</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Data Emissão</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Medicamentos</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPrescricoes.map((prescricao) => (
                  <tr key={prescricao.id || prescricao._id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-xs">
                          {prescricao.pacienteNome ? prescricao.pacienteNome.charAt(0) : 'P'}
                        </div>
                        <span className="font-medium text-slate-900">{prescricao.pacienteNome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {prescricao.createdAt
                        ? new Date(prescricao.createdAt).toLocaleDateString('pt-BR')
                        : '-'}
                      {prescricao.createdAt && (
                        <span className="text-xs text-slate-400 block">
                          {new Date(prescricao.createdAt).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        prescricao.tipo === 'controlado' 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {prescricao.tipo === 'controlado' ? 'Controlado' : 'Comum'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
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
                    </td>
                    <td className="px-6 py-4">
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
                    </td>
                    <td className="px-6 py-4 text-right">
                      {prescricao.status === 'ativa' && (
                        <button
                          onClick={() => handleCancelar(prescricao.id || prescricao._id)}
                          className="text-red-600 hover:text-red-800 text-xs font-semibold hover:underline"
                        >
                          Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Inbox}
            title="Nenhuma prescrição encontrada"
            description="Comece emitindo uma nova prescrição."
            actionLabel="Nova Prescrição"
            onAction={() => setModalOpen(true)}
          />
        )}
      </div>

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
                    {pacientes.map((p) => {
                      const pacienteId = p.id || p._id;
                      return (
                        <option key={pacienteId} value={pacienteId}>
                          {p.nome}
                        </option>
                      );
                    })}
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