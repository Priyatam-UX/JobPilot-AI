import { apiRequest } from './api';

export interface ApplicationResponse {
  id: string;
  job_id: string;
  status: string;
  notes?: string;
  applied_at?: string;
  created_at: string;
}

export const applicationService = {
  list: (status?: string) => {
    const query = status ? `?status=${status}` : '';
    return apiRequest<ApplicationResponse[]>(`/applications/${query}`);
  },

  create: (data: any) => apiRequest<ApplicationResponse>('/applications/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id: string, data: any) => apiRequest<ApplicationResponse>(`/applications/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  delete: (id: string) => apiRequest<void>(`/applications/${id}`, {
    method: 'DELETE',
  }),

  getStatusCounts: () => apiRequest<Record<string, number>>('/applications/analytics/status-counts'),
};
