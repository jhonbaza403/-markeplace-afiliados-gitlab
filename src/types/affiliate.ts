// ==========================================================
// ARCHIVO: src/types/affiliate.ts
// Tipos del sistema de productos y enlaces de afiliados
// Credi Marketplace
// ==========================================================

import type { Locale } from '@/i18n/config';

export type LocalizedText = Record<Locale, string>;

export interface AffiliateProduct {
  /**
   * Identificador interno estable.
   */
  id: string;

  /**
   * Nombre de la plataforma o socio comercial.
   */
  name: string;

  /**
   * Categoría localizada.
   */
  category: LocalizedText;

  /**
   * Título comercial localizado.
   */
  title: LocalizedText;

  /**
   * Descripción comercial localizada.
   */
  description: LocalizedText;

  /**
   * Texto corto identificativo del socio.
   */
  badge: string;

  /**
   * Clases visuales de Tailwind.
   */
  badgeColor: string;

  /**
   * Icono de Font Awesome.
   */
  icon: string;

  /**
   * URL de afiliación.
   */
  url: string;

  /**
   * Texto del CTA localizado.
   */
  buttonText: LocalizedText;
}