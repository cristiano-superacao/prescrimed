import { useState, useEffect } from 'react';
import { Plus, Trash2, RefreshCcw, Building2, Edit2, Search, X } from 'lucide-react';
import empresaService from '../services/empresa.service';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import AccessDeniedCard from '../components/common/AccessDeniedCard';

export default function Empresas() {
  const { user } = useAuthStore();
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    tipoSistema: 'casa-repouso',
    plano: 'basico',
    ativo: true
  });
  const [deletingId, setDeletingId] = useState(null);
  const isSuperAdmin = user?.role === 'superadmin';

  useEffect(() => {
    if (isSuperAdmin) {
      loadEmpresas();
    } else {
      setLoading(false);
    }
  }, [isSuperAdmin]);

  const loadEmpresas = async () => {
    try {
      setLoading(true);
      const data = await empresaService.getAll();
      const empresasList = Array.isArray(data) ? data : (data.empresas || []);
      setEmpresas(empresasList);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
      toast.error('Erro ao carregar lista de empresas');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (empresa = null) => {
    if (empresa) {
      setEditingEmpresa(empresa);
      setFormData({
        nome: empresa.nome || '',
        cnpj: empresa.cnpj || '',
        email: empresa.email || '',
        telefone: empresa.telefone || '',
        endereco: empresa.endereco || '',
        tipoSistema: empresa.tipoSistema || 'casa-repouso',
        plano: empresa.plano || 'basico',
        ativo: empresa.ativo !== undefined ? empresa.ativo : true
      });
    } else {
      setEditingEmpresa(null);
      setFormData({
        nome: '',
        cnpj: '',
        email: '',
        telefone: '',
        endereco: '',
        tipoSistema: 'casa-repouso',
        plano: 'basico',
        ativo: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmpresa(null);
    setFormData({
      nome: '',
      cnpj: '',
      email: '',
      telefone: '',
      endereco: '',
      tipoSistema: 'casa-repouso',
      plano: 'basico',
      ativo: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      toast.error('Nome da empresa é obrigatório');
      return;
    }

    try {
      if (editingEmpresa) {
        await empresaService.update(editingEmpresa.id, formData);
        toast.success('Empresa atualizada com sucesso!');
      } else {
        await empresaService.create(formData);
        toast.success('Empresa criada com sucesso!');
      }
      handleCloseModal();
      loadEmpresas();
    } catch (error) {
      console.error('Erro ao salvar empresa:', error);
      const errorMsg = error.response?.data?.error || 'Erro ao salvar empresa';
      toast.error(errorMsg);
    }
  };

  const handleDelete = async (id, nome) => {
    const confirmMessage = `Tem certeza que deseja excluir a empresa "${nome}"?\n\nEsta ação não pode ser desfeita e todos os dados associados serão perdidos.`;
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setDeletingId(id);
      await empresaService.delete(id);
      toast.success('Empresa excluída com sucesso!');
      loadEmpresas();
    } catch (error) {
      console.error('Erro ao excluir empresa:', error);
      const errorMsg = error.response?.data?.error || 'Erro ao excluir empresa';
      toast.error(errorMsg);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredEmpresas = empresas.filter(empresa =>
    empresa.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empresa.cnpj?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empresa.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <AccessDeniedCard
          message="Apenas Super Administradores podem acessar esta página."
          messageClassName="text-gray-600"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-primary-100 text-sm font-medium mb-1">Gestão</p>
            <h1 className="text-3xl font-bold">Empresas</h1>
            <p className="text-primary-100 mt-2">Gerencie as empresas cadastradas no sistema</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadEmpresas}
              disabled={loading}
              className="btn bg-white/20 hover:bg-white/30 text-white border-white/30 flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
              Atualizar
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="btn bg-white text-primary-600 hover:bg-primary-50 flex items-center gap-2 shadow-lg"
            >
              <Plus size={18} />
              Nova Empresa
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Total de Empresas</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{empresas.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Building2 className="text-primary-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Empresas Ativas</p>
              <p className="text-3xl font-bold text-emerald-600 mt-1">
                {empresas.filter(e => e.ativo).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Building2 className="text-emerald-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Empresas Inativas</p>
              <p className="text-3xl font-bold text-red-600 mt-1">
                {empresas.filter(e => !e.ativo).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Building2 className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nome, CNPJ ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
          </div>
        ) : filteredEmpresas.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Empresa
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      CNPJ
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Plano
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredEmpresas.map((empresa) => (
                    <tr key={empresa.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                            <Building2 className="text-primary-600" size={20} />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{empresa.nome}</p>
                            <p className="text-sm text-slate-500">{empresa.endereco || 'Sem endereço'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-600">{empresa.cnpj || '-'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-slate-600">{empresa.email || '-'}</p>
                          <p className="text-sm text-slate-500">{empresa.telefone || '-'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-700 border border-blue-200">
                          {empresa.tipoSistema === 'casa-repouso' ? 'Casa de Repouso' : 
                           empresa.tipoSistema === 'fisioterapia' ? 'Fisioterapia' : 'Petshop'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 text-xs rounded-full font-semibold bg-primary-100 text-primary-700 border border-primary-200 uppercase">
                          {empresa.plano || 'básico'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium border ${
                            empresa.ativo
                              ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                              : 'bg-red-100 text-red-700 border-red-200'
                          }`}
                        >
                          {empresa.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(empresa)}
                            className="p-2 text-slate-600 hover:text-white hover:bg-primary-600 rounded-lg transition"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(empresa.id, empresa.nome)}
                            disabled={deletingId === empresa.id}
                            className="p-2 text-slate-600 hover:text-white hover:bg-red-600 rounded-lg transition disabled:opacity-50"
                            title="Excluir"
                          >
                            {deletingId === empresa.id ? (
                              <div className="animate-spin rounded-full h-[18px] w-[18px] border-2 border-white border-t-transparent"></div>
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-200">
              {filteredEmpresas.map((empresa) => (
                <div key={empresa.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Building2 className="text-primary-600" size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{empresa.nome}</p>
                        <p className="text-xs text-slate-500">{empresa.cnpj || 'Sem CNPJ'}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 text-xs rounded-full font-medium border ${
                        empresa.ativo
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                          : 'bg-red-100 text-red-700 border-red-200'
                      }`}
                    >
                      {empresa.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <p className="text-slate-600">{empresa.email || 'Sem email'}</p>
                    <p className="text-slate-600">{empresa.telefone || 'Sem telefone'}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-700 border border-blue-200">
                      {empresa.tipoSistema === 'casa-repouso' ? 'Casa de Repouso' : 
                       empresa.tipoSistema === 'fisioterapia' ? 'Fisioterapia' : 'Petshop'}
                    </span>
                    <span className="px-2.5 py-1 text-xs rounded-full font-semibold bg-primary-100 text-primary-700 border border-primary-200 uppercase">
                      {empresa.plano || 'básico'}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleOpenModal(empresa)}
                      className="flex-1 px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition font-medium flex items-center justify-center gap-2"
                    >
                      <Edit2 size={16} />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(empresa.id, empresa.nome)}
                      disabled={deletingId === empresa.id}
                      className="flex-1 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {deletingId === empresa.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                      ) : (
                        <>
                          <Trash2 size={16} />
                          Excluir
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Building2 className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-600 font-medium">Nenhuma empresa encontrada</p>
            <p className="text-slate-500 text-sm mt-1">
              {searchTerm ? 'Tente ajustar sua busca' : 'Comece cadastrando uma nova empresa'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => handleOpenModal()}
                className="mt-4 btn btn-primary flex items-center gap-2 mx-auto"
              >
                <Plus size={18} />
                Nova Empresa
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingEmpresa ? 'Editar Empresa' : 'Nova Empresa'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nome da Empresa *
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    CNPJ
                  </label>
                  <input
                    type="text"
                    value={formData.cnpj}
                    onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                    className="input w-full"
                    placeholder="00.000.000/0000-00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="input w-full"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input w-full"
                    placeholder="contato@empresa.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Endereço
                  </label>
                  <input
                    type="text"
                    value={formData.endereco}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                    className="input w-full"
                    placeholder="Rua, número, bairro, cidade - UF"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Tipo de Sistema
                  </label>
                  <select
                    value={formData.tipoSistema}
                    onChange={(e) => setFormData({ ...formData, tipoSistema: e.target.value })}
                    className="input w-full"
                  >
                    <option value="casa-repouso">Casa de Repouso</option>
                    <option value="fisioterapia">Fisioterapia</option>
                    <option value="petshop">Petshop</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Plano
                  </label>
                  <select
                    value={formData.plano}
                    onChange={(e) => setFormData({ ...formData, plano: e.target.value })}
                    className="input w-full"
                  >
                    <option value="basico">Básico</option>
                    <option value="profissional">Profissional</option>
                    <option value="empresa">Empresa</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.ativo}
                      onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                      className="w-5 h-5 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm font-semibold text-slate-700">
                      Empresa Ativa
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 btn btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn btn-primary"
                >
                  {editingEmpresa ? 'Salvar Alterações' : 'Criar Empresa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
