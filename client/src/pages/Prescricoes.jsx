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

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não informada';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Data inválida';
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    } catch (error) {
      return 'Data inválida';
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '--:--';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '--:--';
      return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      return '--:--';
    }
  };

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
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const empresaId = user?.empresaId;
      await prescricaoService.create({
        pacienteId: selectedPaciente,
        empresaId,
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
    // ...existing code...
  );
}
