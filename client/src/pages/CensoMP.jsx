import { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCcw,
  Pill
} from 'lucide-react';
import { pacienteService } from '../services/paciente.service';
import { prescricaoService } from '../services/prescricao.service';
import toast from 'react-hot-toast';
import { errorMessage } from '../utils/toastMessages';
import PageHeader from '../components/common/PageHeader';
import StatsCard from '../components/common/StatsCard';
import SearchFilterBar from '../components/common/SearchFilterBar';
import EmptyState from '../components/common/EmptyState';

export default function CensoMP() {
  const [censoData, setCensoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos'); // todos, com_prescricao, sem_prescricao

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pacientesData, prescricoesData] = await Promise.all([
        pacienteService.getAll(),
        prescricaoService.getAll()
      ]);

      const pacientes = Array.isArray(pacientesData) ? pacientesData : (pacientesData.pacientes || []);
      const prescricoes = Array.isArray(prescricoesData) ? prescricoesData : (prescricoesData.prescricoes || []);

      // Map patients and check for active prescriptions
      const mappedData = pacientes.map(paciente => {
        const pacienteId = paciente.id || paciente._id;
        const activePrescriptions = prescricoes.filter(p => 
          (p.pacienteId === pacienteId || p.pacienteId?._id === pacienteId) && 
          p.status === 'ativa'
        );

        return {
          ...paciente,
          id: pacienteId,
          hasPrescription: activePrescriptions.length > 0,
          prescriptionCount: activePrescriptions.length,
          prescriptions: activePrescriptions
        };
      });

      setCensoData(mappedData);
    } catch (error) {
      console.error(error);
      toast.error(errorMessage('load', 'dados do censo'));
    } finally {
      setLoading(false);
    }
  };

  const filteredData = censoData.filter(item => {
    const matchesSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.cpf && item.cpf.includes(searchTerm));
    
    if (filterStatus === 'todos') return matchesSearch;
    if (filterStatus === 'com_prescricao') return matchesSearch && item.hasPrescription;
    if (filterStatus === 'sem_prescricao') return matchesSearch && !item.hasPrescription;
    
    return matchesSearch;
  });

  const stats = {
    total: censoData.length,
    comPrescricao: censoData.filter(i => i.hasPrescription).length,
    semPrescricao: censoData.filter(i => !i.hasPrescription).length
  };

  return (
    <div className="space-y-8">
      <PageHeader
        label="Controle"
        title="Censo M.P."
        subtitle="Mapa de Prescrições: Acompanhe quais residentes possuem prescrições ativas."
      >
        <button
          type="button"
          onClick={loadData}
          className="btn btn-secondary flex items-center justify-center gap-2"
        >
          <RefreshCcw size={18} /> Atualizar
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
          label="Cobertos"
          value={stats.comPrescricao}
          description="Com prescrição ativa"
          color="emerald"
        />
        <StatsCard
          icon={AlertCircle}
          label="Pendentes"
          value={stats.semPrescricao}
          description="Sem prescrição ativa"
          color="red"
        />
      </div>

      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Buscar residente..."
        filters={[
          { label: 'Todos', value: 'todos' },
          { label: 'Com Prescrição', value: 'com_prescricao' },
          { label: 'Sem Prescrição', value: 'sem_prescricao' }
        ]}
        activeFilter={filterStatus}
        onFilterChange={setFilterStatus}
      />

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredData.length > 0 ? (
          <>
            {/* Mobile: cards */}
            <div className="md:hidden p-4 sm:p-6 space-y-3">
              {filteredData.map((item) => (
                <div
                  key={item.id || item._id}
                  className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-sm shrink-0">
                        {item.nome.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{item.nome}</p>
                        <p className="text-xs text-slate-500 truncate">CPF: {item.cpf || 'N/A'}</p>
                      </div>
                    </div>

                    {item.hasPrescription ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">
                        <CheckCircle2 size={14} /> Coberto
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100 shrink-0">
                        <AlertCircle size={14} /> Pendente
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Pill size={16} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">
                      {item.prescriptionCount} prescrições
                    </span>
                  </div>

                  <div className="mt-3">
                    {item.hasPrescription ? (
                      <div className="flex flex-wrap gap-2">
                        {item.prescriptions.map((p) => (
                          <span
                            key={p.id || p._id}
                            className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded inline-block"
                          >
                            {p.medicamentos?.[0]?.nome}
                            {p.medicamentos?.length > 1 && ` +${p.medicamentos.length - 1}`}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Nenhuma prescrição ativa</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto custom-scrollbar -mx-4 sm:-mx-6 md:-mx-8">
              <table className="w-full min-w-[860px]">
              <thead className="bg-slate-50 border-b border-slate-100 whitespace-nowrap">
                <tr>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Residente</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Prescrições Ativas</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Detalhes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((item) => (
                  <tr key={item.id || item._id} className="hover:bg-slate-50/50 transition">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-sm">
                          {item.nome.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{item.nome}</p>
                          <p className="text-xs text-slate-500">CPF: {item.cpf || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {item.hasPrescription ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <CheckCircle2 size={14} /> Coberto
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                          <AlertCircle size={14} /> Pendente
                        </span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Pill size={16} className="text-slate-400" />
                        <span className="text-sm font-medium text-slate-700">
                          {item.prescriptionCount} prescrições
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      {item.hasPrescription ? (
                        <div className="flex flex-col gap-1">
                          {item.prescriptions.map(p => (
                            <span key={p.id || p._id} className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded inline-block w-fit">
                              {p.medicamentos?.[0]?.nome} 
                              {p.medicamentos?.length > 1 && ` +${p.medicamentos.length - 1}`}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Nenhuma prescrição ativa</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="p-12">
            <EmptyState
              icon={Users}
              title="Nenhum residente encontrado"
              description="Tente ajustar os filtros de busca."
            />
          </div>
        )}
      </div>
    </div>
  );
}
