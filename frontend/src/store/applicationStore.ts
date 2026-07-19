import { create } from 'zustand';

export interface KanbanApplication {
  id: string;
  jobTitle: string;
  companyName: string;
  location: string;
  status: 'bookmarked' | 'applying' | 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'withdrawn';
  appliedAt?: string;
  salary?: string;
  notes?: string;
}

interface ApplicationState {
  applications: KanbanApplication[];
  loading: boolean;
  setApplications: (applications: KanbanApplication[]) => void;
  addApplication: (app: KanbanApplication) => void;
  updateApplicationStatus: (id: string, status: KanbanApplication['status']) => void;
  updateApplication: (id: string, updated: Partial<KanbanApplication>) => void;
  removeApplication: (id: string) => void;
}

export const useApplicationStore = create<ApplicationState>((set) => ({
  applications: [],
  loading: false,

  setApplications: (applications) => set({ applications }),
  addApplication: (app) => set((state) => ({ applications: [app, ...state.applications] })),
  updateApplicationStatus: (id, status) =>
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id ? { ...app, status, updated_at: new Date().toISOString() } : app
      ),
    })),
  updateApplication: (id, updated) =>
    set((state) => ({
      applications: state.applications.map((app) => (app.id === id ? { ...app, ...updated } : app)),
    })),
  removeApplication: (id) =>
    set((state) => ({
      applications: state.applications.filter((app) => app.id !== id),
    })),
}));
