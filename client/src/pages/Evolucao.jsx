import { useState, useEffect } from 'react';
import { 
  FileText, 
  Users, 
  ShieldAlert, 
  AlertTriangle, 
  Eye, 
  AlertCircle,
  RefreshCcw
} from 'lucide-react';
import { pacienteService } from '../services/paciente.service';
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

export default function Evolucao() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await pacienteService.getAll();
      // Robustez para garantir array, mantendo consistência com outras páginas
      const lista = Array.isArray(data) ? data : (data.pacientes || []);
      setPacientes(lista);
    } catch (error) {
      toast.error(errorMessage('load', 'residentes'));
    } finally {
      setLoading(false);
    }
  };

  const filteredPacientes = pacientes.filter(p => 
    p.status === 'ativo' && 
    (p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
     (p.cpf && p.cpf.includes(searchTerm)))
  );

  // Mock stats for now - in a real app these would come from an evolucaoService
  const stats = {
    registrosHoje: 0,
    pacientesComRegistro: 0,
    riscoQueda: 0,
    alertasCriticos: 0
  };

  return (
    <div className="space-y-8">
      <PageHeader
        label="Prontuário"
        title="Registros de Enfermagem"
        subtitle="Anotações diárias, evolução clínica e acompanhamento de cuidados."
      >
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
        placeholder="Buscar por nome, quarto ou CPF..."
      />

      <TableContainer title="Residentes Ativos">
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
                        <p className="text-xs text-slate-500 dark:text-gray-400">CPF: {paciente.cpf || 'N/A'}</p>
                        <p className="text-xs text-slate-500 dark:text-gray-400">Quarto: {paciente.quarto || '-'}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                      Ativo
                    </span>
                  </div>
                  <div className="mt-3">
                    {paciente.alergias && paciente.alergias.length > 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                        <AlertCircle size={12} /> Alergias
                      </span>
                    ) : (
                      <span className="text-slate-400 text-sm">Sem alertas</span>
                    )}
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => toast.success(`Abrindo prontuário de ${paciente.nome}`)}
                      className="text-primary-600 hover:text-primary-800 text-sm font-semibold hover:underline flex items-center gap-1"
                    >
                      <Eye size={16} /> Prontuário
                    </button>
                  </div>
                </MobileCard>
              ))}
            </MobileGrid>

            {/* Desktop */}
            <TableWrapper>
              <TableHeader columns={["Residente","Quarto","Status","Alertas","Ações"]} />
              <TBody>
                {filteredPacientes.map((paciente) => (
                  <Tr key={paciente.id || paciente._id}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-sm">
                          {paciente.nome.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-gray-100">{paciente.nome}</p>
                          <p className="text-xs text-slate-500 dark:text-gray-400">CPF: {paciente.cpf || 'N/A'}</p>
                        </div>
                      </div>
                    </Td>
                    <Td className="text-sm text-slate-600 dark:text-gray-300">
                      {paciente.quarto || '-'}
                    </Td>
                    <Td>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                        Ativo
                      </span>
                    </Td>
                    <Td>
                      {paciente.alergias && paciente.alergias.length > 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                          <AlertCircle size={12} /> Alergias
                        </span>
                      ) : (
                        <span className="text-slate-400 text-sm">-</span>
                      )}
                    </Td>
                    <Td className="text-right">
                      <button 
                        onClick={() => toast.success(`Abrindo prontuário de ${paciente.nome}`)}
                        className="text-primary-600 hover:text-primary-800 text-sm font-semibold hover:underline flex items-center justify-end gap-1 ml-auto"
                      >
                        <Eye size={16} /> Prontuário
                      </button>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </TableWrapper>
          </>
        ) : (
          <div className="p-12">
            <EmptyState
              icon={Users}
              title="Nenhum residente encontrado"
              description="Tente buscar por outro nome ou quarto."
            />
          </div>
        )}
      </TableContainer>
    </div>
  );
}
