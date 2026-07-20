import { apiRequest } from './api';

export interface JobResponse {
  id: string;
  title: string;
  company_name?: string;
  description?: string;
  location?: string;
  salary?: string;
  job_type?: string;
  remote: boolean;
  url?: string;
  source_portal?: string;
  match_score?: number;
  matched_keywords?: string[];
  missing_keywords?: string[];
  status: string;
  created_at: string;
}

export const jobService = {
  discover: (query?: string) => apiRequest<JobResponse[]>(`/jobs/discover${query ? `?query=${encodeURIComponent(query)}` : ''}`),

  list: () => apiRequest<JobResponse[]>('/jobs/'),
  
  create: (data: any) => apiRequest<JobResponse>('/jobs/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  search: (query: string) => apiRequest<JobResponse[]>(`/jobs/search?q=${encodeURIComponent(query)}`),

  get: (id: string) => apiRequest<JobResponse>(`/jobs/${id}`),
};
