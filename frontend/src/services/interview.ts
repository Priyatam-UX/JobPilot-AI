import { apiRequest } from './api';

export interface GeneratedQuestion {
  category: string;
  difficulty: string;
  question: string;
  reason: string;
}

export const interviewService = {
  generateQuestions: (job_description: string) => 
    apiRequest<{questions: GeneratedQuestion[]}>('/interview/generate', {
      method: 'POST',
      body: JSON.stringify({ job_description }),
    }),
};
