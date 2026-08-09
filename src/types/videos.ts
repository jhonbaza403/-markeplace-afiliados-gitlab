export interface ShortVideo {
  id: string;
  userId: string;
  title: string;
  videoUrl: string;
  thumbnailUrl?: string;
  durationSeconds: number; // Máximo 90 segundos
  likesCount: number;
  productId?: string;
  serviceId?: string;
  createdAt: string;
}