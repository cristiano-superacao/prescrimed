import { get, buildQueryString } from './request';

export const dashboardService = {
  getStats: async (dataInicio, dataFim) => {
    const qs = buildQueryString({ dataInicio, dataFim });
    return get(`/dashboard/stats${qs}`);
  },

  getPrescricoesRecentes: async () => {
    return get('/dashboard/prescricoes-recentes');
  },

  getPacientesRecentes: async () => {
    return get('/dashboard/pacientes-recentes');
  },

  getNextSteps: async () => {
    return get('/dashboard/next-steps');
  },

  getPriorityAlerts: async () => {
    return get('/dashboard/alerts');
  },
};