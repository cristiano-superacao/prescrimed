import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { empresaService } from '../services/empresa.service';
import toast from 'react-hot-toast';
import { successMessage, errorMessage, apiErrorMessage } from '../utils/toastMessages';
import useLockBodyScroll from '../utils/useLockBodyScroll';

export default function EmpresaModal({ empresa, onClose, onSave }) {
  useLockBodyScroll(true);

  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    plano: 'basic',
    status: 'ativo'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (empresa) {
      setFormData({
        nome: empresa.nome || '',
        cnpj: empresa.cnpj || '',
        email: empresa.email || '',
        telefone: empresa.telefone || '',
        endereco: empresa.endereco || '',
        plano: empresa.plano || 'basic',
        status: empresa.status || 'ativo'
      });
    }
  }, [empresa]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (empresa?.id) {
        // Editar empresa existente (se houver endpoint de update específico por ID, mas o service atual só tem updateMyCompany)
        // Como o service atual só tem updateMyCompany, assumimos que o superadmin pode editar qualquer uma se houver endpoint, 
        // mas por enquanto vamos focar no CREATE que é o pedido.
        // Se não houver update(id) no service, talvez não consigamos editar outras empresas ainda.
        // Vou assumir create por enquanto.
        toast.error('Edição de empresa ainda não implementada no backend');
      } else {
        // Criar nova empresa
        await empresaService.create(formData);
        toast.success(successMessage('create', 'Empresa', { gender: 'f', suffix: '!' }));
        onSave();
      }
      onClose();
    } catch (error) {
      toast.error(apiErrorMessage(error, errorMessage('save', 'empresa')));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-white/90 backdrop-blur-sm shrink-0">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Cadastro</p>
            <h2 className="text-2xl font-bold text-slate-900">
              {empresa ? 'Editar Empresa' : 'Nova Empresa'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-2xl transition-colors"
            aria-label="Fechar modal"
          >
            <X size={22} className="text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nome da Empresa *
              </label>
              <input
                type="text"
                required
                className="input"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
              />
            </div>

            {/* CNPJ */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                CNPJ *
              </label>
              <input
                type="text"
                required
                className="input"
                value={formData.cnpj}
                onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                E-mail *
              </label>
              <input
                type="email"
                required
                className="input"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Telefone
              </label>
              <input
                type="tel"
                className="input"
                value={formData.telefone}
                onChange={(e) => setFormData({...formData, telefone: e.target.value})}
              />
            </div>

            {/* Plano */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Plano
              </label>
              <select
                className="input"
                value={formData.plano}
                onChange={(e) => setFormData({...formData, plano: e.target.value})}
              >
                <option value="basic">Básico</option>
                <option value="pro">Profissional</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>

            {/* Endereço */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Endereço
              </label>
              <input
                type="text"
                className="input"
                value={formData.endereco}
                onChange={(e) => setFormData({...formData, endereco: e.target.value})}
              />
            </div>

            {/* Status */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <select
                className="input"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="bloqueado">Bloqueado</option>
              </select>
            </div>
          </div>

          </div>

          {/* Actions */}
          <div className="flex gap-3 px-6 py-5 border-t border-slate-200 bg-white shrink-0">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1" disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary flex-1" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
