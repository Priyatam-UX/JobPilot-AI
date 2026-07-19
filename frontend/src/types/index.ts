export interface User {
  id: string;
  email: string;
  full_name?: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  skills: string[];
  experienceYears: number;
  desiredRoles: string[];
  location: string;
}
