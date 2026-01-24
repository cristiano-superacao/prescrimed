import { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCcw,
  Pill
} from 'lucide-react';
import pacienteService from '../services/paciente.service';
import prescricaoService from '../services/prescricao.service';
import toast from 'react-hot-toast';
import { errorMessage } from '../utils/toastMessages';
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

      <TableContainer title="Residentes">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredData.length > 0 ? (
          <>
            {/* Mobile */}
            <MobileGrid>
              {filteredData.map((item) => (
                <MobileCard key={item.id || item._id}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-sm">
                        {item.nome.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-gray-100">{item.nome}</p>
                        <p className="text-xs text-slate-500 dark:text-gray-400">CPF: {item.cpf || 'N/A'}</p>
                      </div>
                    </div>
                    {item.hasPrescription ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <CheckCircle2 size={12} /> Coberto
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                        <AlertCircle size={12} /> Pendente
                      </span>
                    )}
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Pill size={16} className="text-slate-400" />
                      <span className="text-sm font-medium text-slate-700 dark:text-gray-200">
                        {item.prescriptionCount} prescrições
                      </span>
                    </div>
                    {item.hasPrescription ? (
                      <div className="flex flex-wrap gap-1">
                        {item.prescriptions.map(p => (
                          <span key={p.id} className="text-xs text-slate-500 dark:text-gray-300 bg-slate-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {p.medicamentos?.[0]?.nome}
                            {p.medicamentos?.length > 1 && ` +${p.medicamentos.length - 1}`}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-gray-500 italic">Nenhuma prescrição ativa</span>
                    )}
                  </div>
                </MobileCard>
              ))}
            </MobileGrid>

            {/* Desktop */}
            <TableWrapper>
              <TableHeader columns={["Residente","Status","Prescrições Ativas","Detalhes"]} />
              <TBody>
                {filteredData.map((item) => (
                  <Tr key={item.id || item._id}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-sm">
                          {item.nome.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-gray-100">{item.nome}</p>
                          <p className="text-xs text-slate-500 dark:text-gray-400">CPF: {item.cpf || 'N/A'}</p>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      {item.hasPrescription ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <CheckCircle2 size={14} /> Coberto
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                          <AlertCircle size={14} /> Pendente
                        </span>
                      )}
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <Pill size={16} className="text-slate-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-gray-200">
                          {item.prescriptionCount} prescrições
                        </span>
                      </div>
                    </Td>
                    <Td>
                      {item.hasPrescription ? (
                        <div className="flex flex-col gap-1">
                          {item.prescriptions.map(p => (
                            <span key={p.id} className="text-xs text-slate-500 dark:text-gray-300 bg-slate-100 dark:bg-gray-800 px-2 py-1 rounded inline-block w-fit">
                              {p.medicamentos?.[0]?.nome}
                              {p.medicamentos?.length > 1 && ` +${p.medicamentos.length - 1}`}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-gray-500 italic">Nenhuma prescrição ativa</span>
                      )}
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </TableWrapper>
          </>
        ) : (
          <div className="p-8">
            <EmptyState
              icon={Users}
              title="Nenhum residente encontrado"
              description="Tente ajustar os filtros de busca."
            />
          </div>
        )}
      </TableContainer>
    </div>
  );
}
