export interface JobOffer {
  id: string;
  companyId: string;
  title: string;
  description: string;
  category: string;
  locationType: 'remote' | 'on_site' | 'hybrid';
  country: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  createdAt: string;
}