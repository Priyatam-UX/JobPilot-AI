import { apiRequest } from './api';

export interface JobResponse {
  id: string;
  title: string;
  description?: string;
  location?: string;
  salary_min?: number;
  salary_max?: number;
  remote: boolean;
  source_url?: string;
  source_portal?: string;
  created_at: string;
}

export const jobService = {
  list: (skip = 0, limit = 50) => apiRequest<JobResponse[]>(`/jobs/?skip=${skip}&limit=${limit}`),
  search: (q: string) => apiRequest<JobResponse[]>(`/jobs/search?q=${q}`),
  get: (id: string) => apiRequest<JobResponse>(`/jobs/${id}`),
};
