export interface Service {
  id: string;
  providerId: string;
  title: string;
  description: string;
  category: string;
  pricePerUnit: number;
  unitType: 'hour' | 'project' | 'session';
  currency: string;
  rating: number;
  reviewCount: number;
  region: string;
  createdAt: string;
}