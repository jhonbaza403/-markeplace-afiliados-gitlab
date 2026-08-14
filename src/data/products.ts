// ==========================================================
// ARCHIVO: src/data/products.ts
// Credi Marketplace
//
// Catálogo de productos y plataformas afiliadas.
//
// IMPORTANTE:
// - Este archivo contiene únicamente datos estáticos de afiliación.
// - No representa productos almacenados en Supabase.
// - No contiene secretos ni claves privadas.
// - Las URLs de afiliación deben mantenerse como configuración
//   pública y verificarse antes de producción.
// ==========================================================

/**
 * Idiomas soportados por el catálogo de afiliados.
 *
 * Debe mantenerse sincronizado con src/i18n/config.ts
 */
export type AffiliateLocale = 'es' | 'en' | 'pt' | 'fr';

/**
 * Texto traducible para los idiomas soportados.
 */
export type LocalizedText = Record<AffiliateLocale, string>;

/**
 * Producto/plataforma afiliada.
 *
 * Este modelo es independiente de public.products.
 */
export interface AffiliateProduct {
  /**
   * Identificador interno estable.
   */
  id: string;

  /**
   * Nombre comercial de la plataforma.
   */
  name: string;

  /**
   * Categoría traducida.
   */
  category: LocalizedText;

  /**
   * Título promocional.
   */
  title: string;

  /**
   * Descripción traducida.
   */
  description: LocalizedText;

  /**
   * Etiqueta promocional.
   */
  badge: string;

  /**
   * Clase visual utilizada por la interfaz.
   *
   * Nota:
   * Idealmente estas clases deberían migrarse posteriormente
   * a una configuración visual centralizada.
   */
  badgeColor: string;

  /**
   * Identificador del icono utilizado por la UI.
   */
  icon: string;

  /**
   * URL de destino afiliada.
   */
  url: string;

  /**
   * Texto del botón traducido.
   */
  buttonText: LocalizedText;
}

/**
 * Catálogo de plataformas afiliadas.
 *
 * IMPORTANTE:
 * Las URLs pueden generar comisiones de afiliación.
 * Deben presentarse al usuario de acuerdo con las obligaciones
 * legales y las políticas aplicables al programa de afiliados.
 */
export const affiliateProducts: readonly AffiliateProduct[] = [
  {
    id: 'amazon',
    name: 'Amazon Global',

    category: {
      es: 'Tecnología & Hogar',
      en: 'Tech & Home',
      pt: 'Tecnologia & Casa',
      fr: 'Technologie & Maison',
    },

    title: 'Amazon Global Store',

    description: {
      es: 'Compra internacional con opciones de envío global y productos de múltiples categorías.',
      en: 'International shopping with global shipping options and products across multiple categories.',
      pt: 'Compras internacionais com opções de envio global e produtos de várias categorias.',
      fr: 'Achats internationaux avec options de livraison mondiale et produits de plusieurs catégories.',
    },

    badge: 'Amazon Partner',
    badgeColor: 'bg-amber-500',
    icon: 'fa-amazon',

    url: 'https://amzn.to/4bJJq22',

    buttonText: {
      es: 'Comprar Ahora →',
      en: 'Buy Now →',
      pt: 'Comprar Agora →',
      fr: 'Acheter →',
    },
  },

  {
    id: 'shein',
    name: 'Shein Fashion',

    category: {
      es: 'Moda & Tendencias',
      en: 'Fashion & Trends',
      pt: 'Moda & Tendências',
      fr: 'Mode & Tendances',
    },

    title: 'Shein Global Fashion',

    description: {
      es: 'Moda, ropa y accesorios con opciones de compra internacional.',
      en: 'Fashion, clothing, and accessories with international shopping options.',
      pt: 'Moda, roupas e acessórios com opções de compras internacionais.',
      fr: 'Mode, vêtements et accessoires avec options d’achat international.',
    },

    badge: 'Shein Oficial',
    badgeColor: 'bg-rose-500',
    icon: 'fa-shirt',

    url: 'https://onelink.shein.com/44/5wyleaujbj2iI',

    buttonText: {
      es: 'Ver Colección →',
      en: 'View Collection →',
      pt: 'Ver Coleção →',
      fr: 'Voir Collection →',
    },
  },

  {
    id: 'aliexpress',
    name: 'AliExpress Direct',

    category: {
      es: 'Gadgets & Ofertas',
      en: 'Gadgets & Deals',
      pt: 'Gadgets & Ofertas',
      fr: 'Gadgets & Offres',
    },

    title: 'AliExpress Direct',

    description: {
      es: 'Productos, electrónica y accesorios disponibles mediante compras internacionales.',
      en: 'Products, electronics, and accessories available through international shopping.',
      pt: 'Produtos, eletrônicos e acessórios disponíveis para compras internacionais.',
      fr: 'Produits, électronique et accessoires disponibles pour les achats internationaux.',
    },

    badge: 'AliExpress Deal',
    badgeColor: 'bg-red-600',
    icon: 'fa-bag-shopping',

    url: 'https://s.click.aliexpress.com/e/_c33p0iw',

    buttonText: {
      es: 'Aprovechar Oferta →',
      en: 'Get Deal →',
      pt: 'Aproveitar Oferta →',
      fr: 'Profiter →',
    },
  },

  {
    id: 'alibaba',
    name: 'Alibaba Wholesale',

    category: {
      es: 'Al Mayor B2B',
      en: 'Wholesale B2B',
      pt: 'Atacado B2B',
      fr: 'Gros B2B',
    },

    title: 'Alibaba Wholesale',

    description: {
      es: 'Plataforma internacional orientada a compras mayoristas y relaciones comerciales B2B.',
      en: 'International platform focused on wholesale purchasing and B2B business relationships.',
      pt: 'Plataforma internacional focada em compras no atacado e relações comerciais B2B.',
      fr: 'Plateforme internationale dédiée aux achats en gros et aux relations commerciales B2B.',
    },

    badge: 'Alibaba Mayor',
    badgeColor: 'bg-orange-500',
    icon: 'fa-boxes-stacked',

    url: 'https://offer.alibaba.com/cps/t9vapivb?',

    buttonText: {
      es: 'Cotizar Mayorista →',
      en: 'Wholesale Quote →',
      pt: 'Cotação Atacado →',
      fr: 'Devis Gros →',
    },
  },
] as const;