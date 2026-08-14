// ==========================================================
// ARCHIVO: src/data/products.ts
// Catálogo de socios y productos afiliados
// Credi Marketplace
// ==========================================================

import type { AffiliateProduct } from '@/types/affiliate';

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

    title: {
      es: 'Amazon Global Store',
      en: 'Amazon Global Store',
      pt: 'Amazon Global Store',
      fr: 'Amazon Global Store',
    },

    description: {
      es: 'Compra internacional con acceso a productos y vendedores disponibles en la plataforma.',
      en: 'International shopping with access to products and sellers available on the platform.',
      pt: 'Compras internacionais com acesso a produtos e vendedores disponíveis na plataforma.',
      fr: 'Achats internationaux avec accès aux produits et vendeurs disponibles sur la plateforme.',
    },

    badge: 'Amazon Partner',
    badgeColor: 'bg-amber-500',
    icon: 'fa-amazon',

    url: 'https://amzn.to/4bJJq22',

    buttonText: {
      es: 'Comprar ahora →',
      en: 'Shop now →',
      pt: 'Comprar agora →',
      fr: 'Acheter maintenant →',
    },
  },

  {
    id: 'shein',
    name: 'SHEIN Fashion',

    category: {
      es: 'Moda & Tendencias',
      en: 'Fashion & Trends',
      pt: 'Moda & Tendências',
      fr: 'Mode & Tendances',
    },

    title: {
      es: 'SHEIN Global Fashion',
      en: 'SHEIN Global Fashion',
      pt: 'SHEIN Global Fashion',
      fr: 'SHEIN Global Fashion',
    },

    description: {
      es: 'Moda, ropa y accesorios con una amplia variedad de estilos y tendencias.',
      en: 'Fashion, clothing and accessories with a wide variety of styles and trends.',
      pt: 'Moda, roupas e acessórios com uma grande variedade de estilos e tendências.',
      fr: 'Mode, vêtements et accessoires avec une grande variété de styles et tendances.',
    },

    badge: 'SHEIN Partner',
    badgeColor: 'bg-rose-500',
    icon: 'fa-shirt',

    url: 'https://onelink.shein.com/44/5wyleaujbj2iI',

    buttonText: {
      es: 'Ver colección →',
      en: 'View collection →',
      pt: 'Ver coleção →',
      fr: 'Voir la collection →',
    },
  },

  {
    id: 'aliexpress',
    name: 'AliExpress',

    category: {
      es: 'Gadgets & Ofertas',
      en: 'Gadgets & Deals',
      pt: 'Gadgets & Ofertas',
      fr: 'Gadgets & Offres',
    },

    title: {
      es: 'AliExpress Direct',
      en: 'AliExpress Direct',
      pt: 'AliExpress Direct',
      fr: 'AliExpress Direct',
    },

    description: {
      es: 'Productos, electrónica, accesorios y artículos de múltiples categorías.',
      en: 'Products, electronics, accessories and items across multiple categories.',
      pt: 'Produtos, eletrônicos, acessórios e artigos de várias categorias.',
      fr: 'Produits, électronique, accessoires et articles de plusieurs catégories.',
    },

    badge: 'AliExpress Partner',
    badgeColor: 'bg-red-600',
    icon: 'fa-bag-shopping',

    url: 'https://s.click.aliexpress.com/e/_c33p0iw',

    buttonText: {
      es: 'Ver oferta →',
      en: 'View deal →',
      pt: 'Ver oferta →',
      fr: 'Voir l’offre →',
    },
  },

  {
    id: 'alibaba',
    name: 'Alibaba Wholesale',

    category: {
      es: 'Mayorista B2B',
      en: 'B2B Wholesale',
      pt: 'Atacado B2B',
      fr: 'Grossiste B2B',
    },

    title: {
      es: 'Alibaba Wholesale',
      en: 'Alibaba Wholesale',
      pt: 'Alibaba Wholesale',
      fr: 'Alibaba Wholesale',
    },

    description: {
      es: 'Conexión con proveedores y fabricantes para compras al por mayor y operaciones B2B.',
      en: 'Connect with suppliers and manufacturers for wholesale and B2B purchasing.',
      pt: 'Conecte-se a fornecedores e fabricantes para compras no atacado e operações B2B.',
      fr: 'Connectez-vous aux fournisseurs et fabricants pour les achats en gros et opérations B2B.',
    },

    badge: 'Alibaba Partner',
    badgeColor: 'bg-orange-500',
    icon: 'fa-boxes-stacked',

    url: 'https://offer.alibaba.com/cps/t9vapivb?bm=cps&src=saf',

    buttonText: {
      es: 'Cotizar al mayor →',
      en: 'Get wholesale quote →',
      pt: 'Solicitar cotação →',
      fr: 'Demander un devis →',
    },
  },
] as const;