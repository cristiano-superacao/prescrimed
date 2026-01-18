import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, RefreshCcw, Users, CheckCircle2, Search } from 'lucide-react';
import { usuarioService } from '../services/usuario.service';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { successMessage, errorMessage, customErrorMessage } from '../utils/toastMessages';
import UsuarioModal from '../components/UsuarioModal';
import PageHeader from '../components/common/PageHeader';
import StatsCard from '../components/common/StatsCard';
import SearchFilterBar from '../components/common/SearchFilterBar';
import EmptyState from '../components/common/EmptyState';
import AccessDeniedCard from '../components/common/AccessDeniedCard';
import { TableContainer, TableWrapper, TableHeader, Th, TBody, Tr, Td, MobileGrid, MobileCard } from '../components/common/Table';

export default function Usuarios() {
  const { user } = useAuthStore();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [density, setDensity] = useState('comfortable');
  const [feedback, setFeedback] = useState(null);

  const getUsuarioId = (usuario) => usuario?.id || usuario?._id;
  const currentUserId = user?.id || user?._id;
  const [searchTerm, setSearchTerm] = useState('');
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  useEffect(() => {
    if (isAdmin) {
      loadUsuarios();
    } else {
      toast.error(customErrorMessage('accessDenied'));
    }
  }, [isAdmin]);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const data = await usuarioService.getAll();
      const usuariosList = Array.isArray(data) ? data : (data.usuarios || []);
      setUsuarios(usuariosList);
    } catch (error) {
      toast.error(errorMessage('load', 'usuários'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (usuario) => {
    setSelectedUsuario(usuario);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (id === user.id) {
      toast.error(customErrorMessage('cannotDeleteSelf'));
      return;
    }
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) {
      return;
    }
    try {
      await usuarioService.delete(id);
      toast.success(successMessage('delete', 'Usuário'));
      setFeedback({ type: 'success', message: 'Usuário excluído e lista atualizada.' });
      loadUsuarios();
    } catch (error) {
      toast.error(errorMessage('delete', 'usuário'));
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedUsuario(null);
    setFeedback({ type: 'success', message: 'Dados atualizados após salvar usuário.' });
    loadUsuarios();
  };

  const filteredUsuarios = usuarios.filter(u => 
    u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.crm && u.crm.includes(searchTerm))
  );

  const roleLabel = (role) => {
    if (role === 'superadmin') return 'Super Admin';
    if (role === 'admin') return 'Administrador';
    if (role === 'nutricionista') return 'Nutricionista';
    if (role === 'atendente') return 'Atendente';
    if (role === 'enfermeiro') return 'Enfermeiro';
    if (role === 'tecnico_enfermagem') return 'Técnico de Enfermagem';
    if (role === 'fisioterapeuta') return 'Fisioterapeuta';
    if (role === 'assistente_social') return 'Assistente Social';
    if (role === 'auxiliar_administrativo') return 'Auxiliar Administrativo';
    return 'Usuário';
  };

  if (!isAdmin) {
    return (
      <AccessDeniedCard message="Apenas administradores podem acessar esta página." />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        label="Administração"
        title="Usuários"
        subtitle="Gerencie o acesso ao sistema, cadastre novos profissionais e mantenha a equipe atualizada."
      >
        <button
          type="button"
          onClick={loadUsuarios}
          className="btn btn-secondary flex items-center justify-center gap-2"
        >
          <RefreshCcw size={18} /> Atualizar
        </button>
        <button
          onClick={() => setModalOpen(true)}
          className="btn btn-primary flex items-center justify-center gap-2 shadow-lg shadow-primary-600/20"
        >
          <Plus size={18} /> Novo Usuário
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          icon={Users}
          label="Total de Usuários"
          value={usuarios.length}
          color="primary"
        />
        <StatsCard
          icon={CheckCircle2}
          label="Usuários Ativos"
          value={usuarios.filter(u => u.ativo).length}
          color="emerald"
        />
        {/* Placeholder for layout balance or another stat if needed */}
        <div className="hidden md:block"></div> 
      </div>

      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Buscar por nome, email ou CRM..."
      >
        <div className="flex items-center gap-2 text-sm text-slate-500 ml-auto">
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
      </SearchFilterBar>

      {feedback && (
        <div
          className={`card border flex items-center gap-3 ${
            feedback.type === 'success'
              ? 'border-emerald-200 bg-emerald-50'
              : 'border-amber-200 bg-amber-50'
          }`}
        >
          <CheckCircle2 className="text-emerald-500" size={20} />
          <p className="text-sm text-slate-700">{feedback.message}</p>
          <button className="ml-auto text-xs text-slate-500 hover:text-slate-700" onClick={() => setFeedback(null)}>
            Fechar
          </button>
        </div>
      )}

      <TableContainer className="border border-slate-200 shadow-sm">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredUsuarios.length > 0 ? (
          <>
            {/* Mobile: cards */}
            <MobileGrid>
              {filteredUsuarios.map((usuario) => (
                <MobileCard
                  key={getUsuarioId(usuario)}
                  density={density}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm shrink-0">
                      {usuario.nome.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{usuario.nome}</p>
                          <p className="text-sm text-slate-600 truncate">{usuario.email}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`px-2.5 py-1 text-xs rounded-full font-medium border ${
                              usuario.role === 'admin' || usuario.role === 'superadmin'
                                ? 'bg-purple-50 text-purple-700 border-purple-100'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {roleLabel(usuario.role)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2.5 py-1 text-xs rounded-full font-medium border ${
                            usuario.ativo
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : 'bg-red-50 text-red-700 border-red-100'
                          }`}
                        >
                          {usuario.ativo ? 'Ativo' : 'Inativo'}
                        </span>

                        {usuario.crm ? (
                          <span className="font-mono bg-slate-100 px-2.5 py-1 rounded-full text-xs text-slate-700 border border-slate-200">
                            CRM: {usuario.crm}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">CRM: -</span>
                        )}
                      </div>

                      <div className="mt-4 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(usuario)}
                          className="px-3 py-2 text-slate-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors text-sm font-semibold"
                        >
                          Editar
                        </button>
                        {getUsuarioId(usuario) !== currentUserId && (
                          <button
                            type="button"
                            onClick={() => handleDelete(getUsuarioId(usuario))}
                            className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm font-semibold"
                          >
                            Excluir
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </MobileCard>
              ))}
            </MobileGrid>

            {/* Desktop: table */}
            <TableWrapper>
              <TableHeader>
                <Th>Profissional</Th>
                <Th>Contato</Th>
                <Th>CRM</Th>
                <Th>Função</Th>
                <Th>Status</Th>
                <Th align="right">Ações</Th>
              </TableHeader>
              <TBody>
                {filteredUsuarios.map((usuario) => (
                  <Tr key={getUsuarioId(usuario)}>
                    <Td density={density}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
                          {usuario.nome.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-medium text-slate-900">{usuario.nome}</div>
                      </div>
                    </Td>
                    <Td density={density} className="text-sm text-slate-600">
                      {usuario.email}
                    </Td>
                    <Td density={density} className="text-sm text-slate-600">
                      {usuario.crm ? (
                        <span className="font-mono bg-slate-100 px-2 py-1 rounded text-xs">{usuario.crm}</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </Td>
                    <Td density={density}>
                      <span
                        className={`px-2.5 py-1 text-xs rounded-full font-medium border ${
                          usuario.role === 'admin' || usuario.role === 'superadmin'
                            ? 'bg-purple-50 text-purple-700 border-purple-100'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {roleLabel(usuario.role)}
                      </span>
                    </Td>
                    <Td density={density}>
                      <span
                        className={`px-2.5 py-1 text-xs rounded-full font-medium border ${
                          usuario.ativo
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-red-50 text-red-700 border-red-100'
                        }`}
                      >
                        {usuario.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </Td>
                    <Td density={density} align="right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(usuario)}
                          className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        {getUsuarioId(usuario) !== currentUserId && (
                          <button
                            onClick={() => handleDelete(getUsuarioId(usuario))}
                            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </TableWrapper>
          </>
        ) : (
          <EmptyState
            icon={Search}
            title="Nenhum usuário encontrado"
            description={searchTerm ? 'Tente buscar com outros termos.' : 'Comece adicionando novos usuários ao sistema.'}
            actionLabel={!searchTerm ? "Adicionar usuário" : null}
            onAction={!searchTerm ? () => setModalOpen(true) : null}
          />
        )}
      </TableContainer>

      {modalOpen && (
        <UsuarioModal
          usuario={selectedUsuario}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}