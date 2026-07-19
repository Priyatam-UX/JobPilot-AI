import { apiRequest } from './api';

export interface ResumeResponse {
  id: string;
  title: string;
  file_path?: string;
  created_at: string;
}

export interface ResumeVersionResponse {
  id: string;
  resume_id: string;
  version_number: number;
  title: string;
  file_path?: string;
  created_at: string;
}

export const resumeService = {
  list: () => apiRequest<ResumeResponse[]>('/resumes/'),

  upload: (title: string, file: File) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    return apiRequest<ResumeResponse>('/resumes/upload', {
      method: 'POST',
      body: formData,
    });
  },

  get: (id: string) => apiRequest<ResumeResponse>(`/resumes/${id}`),

  delete: (id: string) => apiRequest<void>(`/resumes/${id}`, {
    method: 'DELETE',
  }),

  listVersions: (resumeId: string) => apiRequest<ResumeVersionResponse[]>(`/resumes/${resumeId}/versions`),
};
