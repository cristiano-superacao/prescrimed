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

      <div className="card overflow-hidden border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-semibold text-slate-800">Lista de Empresas</h3>
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
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : empresas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                    CNPJ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Plano
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {empresas.map((empresa) => (
                  <tr key={empresa.id} className="hover:bg-slate-50">
                    <td className={`px-6 ${density === 'compact' ? 'py-3 text-sm' : 'py-4'} whitespace-nowrap`}>
                      <div className="font-medium text-slate-900">{empresa.nome}</div>
                    </td>
                    <td className={`px-6 ${density === 'compact' ? 'py-3 text-sm' : 'py-4'} whitespace-nowrap text-slate-600`}>
                      {empresa.cnpj || '-'}
                    </td>
                    <td className={`px-6 ${density === 'compact' ? 'py-3 text-sm' : 'py-4'} whitespace-nowrap text-slate-600`}>
                      {empresa.email}
                    </td>
                    <td className={`px-6 ${density === 'compact' ? 'py-3 text-sm' : 'py-4'} whitespace-nowrap`}>
                      <span className="px-2.5 py-1 text-xs rounded-full font-semibold bg-primary-50 text-primary-700 border border-primary-100 uppercase">
                        {empresa.plano}
                      </span>
                    </td>
                    <td className={`px-6 ${density === 'compact' ? 'py-3 text-sm' : 'py-4'} whitespace-nowrap`}>
                      <span
                        className={`px-2.5 py-1 text-xs rounded-full font-medium border ${
                          empresa.status === 'ativo'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-red-50 text-red-700 border-red-100'
                        }`}
                      >
                        {empresa.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className={`px-6 ${density === 'compact' ? 'py-3 text-sm' : 'py-4'} whitespace-nowrap`}>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(empresa.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
                          title="Excluir Empresa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Building2}
            title="Nenhuma empresa encontrada"
            description="Comece cadastrando uma nova empresa."
            actionLabel="Nova Empresa"
            onAction={() => setIsModalOpen(true)}
          />
        )}
      </div>

      {isModalOpen && (
        <EmpresaModal
          onClose={() => setIsModalOpen(false)}
          onSave={loadEmpresas}
        />
      )}
    </div>
  );
}
