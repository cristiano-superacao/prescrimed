import { useState, useEffect } from 'react';
import { Plus, Trash2, RefreshCcw, Building2, CheckCircle2 } from 'lucide-react';
import { empresaService } from '../services/empresa.service';
import { useAuthStore } from '../store/authStore';
import EmpresaModal from '../components/EmpresaModal';
import toast from 'react-hot-toast';
import { successMessage, errorMessage, customErrorMessage } from '../utils/toastMessages';
import PageHeader from '../components/common/PageHeader';
import StatsCard from '../components/common/StatsCard';
import EmptyState from '../components/common/EmptyState';
import AccessDeniedCard from '../components/common/AccessDeniedCard';
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

export default function Empresas() {
  const { user } = useAuthStore();
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [density, setDensity] = useState('comfortable');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isSuperAdmin = user?.role === 'superadmin';

  useEffect(() => {
    if (isSuperAdmin) {
      loadEmpresas();
    } else {
      toast.error(customErrorMessage('accessDenied'));
    }
  }, [isSuperAdmin]);

  const loadEmpresas = async () => {
    try {
      setLoading(true);
      const data = await empresaService.getAll();
      const empresasList = Array.isArray(data) ? data : (data.empresas || []);
      setEmpresas(empresasList);
    } catch (error) {
      toast.error(errorMessage('load', 'empresas'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta empresa?')) {
      return;
    }
    try {
      await empresaService.delete(id);
      toast.success(successMessage('delete', 'Empresa', { gender: 'f' }));
      loadEmpresas();
    } catch (error) {
      toast.error(errorMessage('delete', 'empresa'));
    }
  };

  if (!isSuperAdmin) {
    return (
      <AccessDeniedCard
        message="Apenas Super Administradores podem acessar esta página."
        messageClassName="text-gray-600"
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        label="Gestão"
        title="Empresas"
        subtitle="Gerencie as empresas cadastradas no sistema."
      >
        <button
          type="button"
          onClick={loadEmpresas}
          className="btn btn-secondary flex items-center justify-center gap-2"
        >
          <RefreshCcw size={18} /> Atualizar lista
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={18} /> Nova Empresa
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          icon={Building2}
          label="Empresas Ativas"
          value={empresas.length}
          color="primary"
        />
        {/* Placeholders for future stats */}
        <div className="hidden md:block"></div>
        <div className="hidden md:block"></div>
      </div>

      <TableContainer
        title="Lista de Empresas"
        actions={
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Densidade:</span>
            <button
              type="button"
              onClick={() => setDensity((prev) => (prev === 'comfortable' ? 'compact' : 'comfortable'))}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                density === 'comfortable' 
                  ? 'bg-white shadow-sm text-primary-700 ring-1 ring-slate-200' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {density === 'comfortable' ? 'Confortável' : 'Compacta'}
            </button>
          </div>
        }
      >
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : empresas.length > 0 ? (
          <>
            {/* Mobile */}
            <MobileGrid>
              {empresas.map((empresa) => {
                const isActive = typeof empresa.ativo === 'boolean' ? empresa.ativo : empresa.status === 'ativo';
                return (
                  <MobileCard key={empresa.id}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-gray-100">{empresa.nome}</p>
                        <p className="text-xs text-slate-500 dark:text-gray-400">CNPJ: {empresa.cnpj || '-'}</p>
                        <p className="text-xs text-slate-500 dark:text-gray-400">{empresa.email || '-'}</p>
                      </div>
                      <span
                        className={`px-2.5 py-1 text-xs rounded-full font-medium border ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-red-50 text-red-700 border-red-100'
                        }`}
                      >
                        {isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="px-2.5 py-1 text-xs rounded-full font-semibold bg-primary-50 text-primary-700 border border-primary-100 uppercase">
                        {empresa.plano || 'basico'}
                      </span>
                      <button
                        onClick={() => handleDelete(empresa.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
                        title="Excluir Empresa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </MobileCard>
                );
              })}
            </MobileGrid>

            {/* Desktop */}
            <TableWrapper>
              <TableHeader columns={["Nome","CNPJ","Email","Plano","Status","Ações"]} />
              <TBody>
                {empresas.map((empresa) => {
                  const isActive = typeof empresa.ativo === 'boolean' ? empresa.ativo : empresa.status === 'ativo';
                  return (
                    <Tr key={empresa.id}>
                      <Td className={density === 'compact' ? 'py-3 text-sm' : 'py-4'}>
                        <div className="font-medium text-slate-900 dark:text-gray-100">{empresa.nome}</div>
                      </Td>
                      <Td className={density === 'compact' ? 'py-3 text-sm' : 'py-4'}>
                        <span className="text-slate-600 dark:text-gray-300">{empresa.cnpj || '-'}</span>
                      </Td>
                      <Td className={density === 'compact' ? 'py-3 text-sm' : 'py-4'}>
                        <span className="text-slate-600 dark:text-gray-300">{empresa.email || '-'}</span>
                      </Td>
                      <Td className={density === 'compact' ? 'py-3 text-sm' : 'py-4'}>
                        <span className="px-2.5 py-1 text-xs rounded-full font-semibold bg-primary-50 text-primary-700 border border-primary-100 uppercase">
                          {empresa.plano || 'basico'}
                        </span>
                      </Td>
                      <Td className={density === 'compact' ? 'py-3 text-sm' : 'py-4'}>
                        <span
                          className={`px-2.5 py-1 text-xs rounded-full font-medium border ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : 'bg-red-50 text-red-700 border-red-100'
                          }`}
                        >
                          {isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </Td>
                      <Td className={density === 'compact' ? 'py-3 text-sm' : 'py-4'}>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(empresa.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
                            title="Excluir Empresa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </Td>
                    </Tr>
                  );
                })}
              </TBody>
            </TableWrapper>
          </>
        ) : (
          <EmptyState
            icon={Building2}
            title="Nenhuma empresa encontrada"
            description="Comece cadastrando uma nova empresa."
            actionLabel="Nova Empresa"
            onAction={() => setIsModalOpen(true)}
          />
        )}
      </TableContainer>

      {isModalOpen && (
        <EmpresaModal
          onClose={() => setIsModalOpen(false)}
          onSave={loadEmpresas}
        />
      )}
    </div>
  );
}
