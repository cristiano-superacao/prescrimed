// ...existing code...
export default function Agenda() {
  // ...existing code...
  const [formData, setFormData] = useState({
    tipo: 'Compromisso',
    titulo: '',
    data: '',
    horario: '',
    participante: '',
    pacienteId: '',
    local: '',
    descricao: ''
  });
  // ...existing code...
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const empresaId = user?.empresaId || '';
      const dataHora = formData.data && formData.horario ? new Date(`${formData.data}T${formData.horario}:00`).toISOString() : '';

      // Sempre garantir que pacienteId está correto
      let pacienteId = formData.pacienteId;
      if ((!pacienteId || pacienteId === '') && selectedPaciente && selectedPaciente.id) {
        pacienteId = selectedPaciente.id;
      }

      // Debug visual
      console.log('DEBUG SUBMIT', { pacienteId, empresaId, titulo: formData.titulo, dataHora });

      if (!pacienteId) {
        toast.error('Selecione um paciente da lista!');
        return;
      }
      if (!empresaId) {
        toast.error('Empresa não encontrada no usuário logado!');
        return;
      }
      if (!formData.titulo) {
        toast.error('Título é obrigatório!');
        return;
      }
      if (!dataHora) {
        toast.error('Data e horário obrigatórios!');
        return;
      }

      const payload = {
        titulo: formData.titulo,
        tipo: formData.tipo,
        pacienteId,
        empresaId,
        local: formData.local,
        observacoes: formData.descricao,
        dataHora
      };

      if (editingId) {
        await agendamentoService.update(editingId, payload);
        toast.success(successMessage('update', 'Agendamento'));
      } else {
        await agendamentoService.create(payload);
        toast.success(successMessage('create', 'Agendamento'));
      }
      setModalOpen(false);
      resetForm();
      loadAgendamentos();
    } catch (error) {
      toast.error(apiErrorMessage(error, errorMessage('save', 'agendamento')));
    }
  };
  // ...existing code...
}
