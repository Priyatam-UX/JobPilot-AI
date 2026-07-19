import { apiRequest } from './api';

export interface ResumeResponse {
  id: string;
  title: string;
  file_path?: string;
  created_at: string;
  // new analysis fields
  word_count?: number;
  experience_years?: number;
  all_skills_flat?: string[];
  ats_score?: number;
  ats_grade?: string;
  ats_suggestions?: string[];
}

export interface ResumeVersionResponse {
  id: string;
  resume_id: string;
  version_number: number;
  title: string;
  file_path?: string;
  created_at: string;
}

export interface ATSCheckResult {
  overall_score: number;
  grade: string;
  keyword_match_score: number;
  section_score: number;
  action_verb_score: number;
  quantification_score: number;
  word_count: number;
  matched_keywords: string[];
  missing_keywords: string[];
  missing_sections: string[];
  red_flags: string[];
  skills_found: string[];
  suggestions: string[];
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

  analyze: (id: string) => apiRequest<any>(`/resumes/${id}/analyze`),

  atsCheck: (id: string, jobDescription: string) => apiRequest<ATSCheckResult>(`/resumes/${id}/ats-check`, {
    method: 'POST',
    body: JSON.stringify({ job_description: jobDescription }),
  }),
};
