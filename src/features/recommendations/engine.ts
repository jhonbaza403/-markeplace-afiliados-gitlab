import { Product } from '@/types/products';

export interface UserPreferences {
  region: string;
  language: string;
  interests: string[];
}

export function rankProductsForUser(
  products: Product[],
  preferences: UserPreferences
): Product[] {
  return [...products].sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    // Puntuación por coincidencia regional
    if (a.region === preferences.region || a.region === 'global') scoreA += 10;
    if (b.region === preferences.region || b.region === 'global') scoreB += 10;

    // Puntuación por categoría de interés
    if (preferences.interests.includes(a.categorySlug)) scoreA += 15;
    if (preferences.interests.includes(b.categorySlug)) scoreB += 15;

    // Puntuación por valoración del producto
    scoreA += a.rating * 2;
    scoreB += b.rating * 2;

    return scoreB - scoreA;
  });
}