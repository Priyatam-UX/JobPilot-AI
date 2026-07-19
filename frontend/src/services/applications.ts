import { apiRequest } from './api';

export interface JobSummary {
  id: string;
  title: string;
  company_name?: string;
  location?: string;
  salary?: string;
  source_portal?: string;
  url?: string;
}

export interface ApplicationResponse {
  id: string;
  user_id: string;
  job_id: string;
  status: string;
  notes?: string;
  applied_at?: string;
  created_at: string;
  updated_at: string;
  job?: JobSummary;   // Nested job details from backend
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
