// ==========================================================
// ARCHIVO: src/types/jobs.ts
// Tipos de datos para Ofertas de Empleo y Postulaciones
// ==========================================================

export type JobLocationType = 'remote' | 'on_site' | 'hybrid';
export type JobStatus = 'active' | 'closed' | 'draft';

export interface JobOffer {
  id: string;
  company_id: string;
  title: string;
  description: string;
  category: string;
  location_type: JobLocationType;
  country: string;
  salary_min?: number;
  salary_max?: number;
  currency: string;
  status?: JobStatus;
  created_at?: string;
  updated_at?: string;

  // Alias opcionales en camelCase para compatibilidad con la UI
  companyId?: string;
  locationType?: JobLocationType;
  salaryMin?: number;
  salaryMax?: number;
  createdAt?: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  candidate_id: string;
  cover_letter?: string;
  resume_url?: string;
  status?: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  created_at?: string;
  updated_at?: string;
}