import api from './api';

export const dashboardService = {
  getStats: async (dataInicio, dataFim) => {
    const params = new URLSearchParams();
    if (dataInicio) params.append('dataInicio', dataInicio);
    if (dataFim) params.append('dataFim', dataFim);
    
    const response = await api.get(`/dashboard/stats${params.toString() ? `?${params}` : ''}`);
    return response.data;
  },

  getPrescricoesRecentes: async () => {
    const response = await api.get('/dashboard/prescricoes-recentes');
    return response.data;
  },

  getPacientesRecentes: async () => {
    const response = await api.get('/dashboard/pacientes-recentes');
    return response.data;
  },

  getNextSteps: async () => {
    const response = await api.get('/dashboard/next-steps');
    return response.data;
  },

  getPriorityAlerts: async () => {
    const response = await api.get('/dashboard/alerts');
    return response.data;
  },
};