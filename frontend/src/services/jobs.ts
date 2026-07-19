import { apiRequest } from './api';

export interface JobResponse {
  id: string;
  title: string;
  company_name?: string;   // Direct company name string
  description?: string;
  location?: string;
  salary?: string;         // Pre-formatted string e.g. "$160k – $210k"
  salary_min?: number;
  salary_max?: number;
  remote: boolean;
  source_url?: string;
  url?: string;            // Alias for source_url (frontend-friendly)
  source_portal?: string;
  match_score?: number;
  created_at: string;
}

export const jobService = {
  list: (skip = 0, limit = 50) => apiRequest<JobResponse[]>(`/jobs/?skip=${skip}&limit=${limit}`),
  search: (q: string) => apiRequest<JobResponse[]>(`/jobs/search?q=${q}`),
  get: (id: string) => apiRequest<JobResponse>(`/jobs/${id}`),
};
