"use client";

import { useLanguage } from '@/context/LanguageContext';

export interface AffiliateProduct {
  id: string;
  name: string;
  category: {
    es: string;
    en: string;
    pt: string;
    fr: string;
  };
  title: string;
  description: {
    es: string;
    en: string;
    pt: string;
    fr: string;
  };
  badge: string;
  badgeColor: string;
  icon: string;
  url: string;
  buttonText: {
    es: string;
    en: string;
    pt: string;
    fr: string;
  };
}

export const affiliateProducts: AffiliateProduct[] = [
  {
    id: "amazon",
    name: "Amazon Global",
    category: {
      es: "Tecnología & Hogar",
      en: "Tech & Home",
      pt: "Tecnologia & Casa",
      fr: "Technologie & Maison"
    },
    title: "Amazon Global Store",
    description: {
      es: "Compra internacional asegurada con envíos globales rápidos y garantías de fabricante.",
      en: "Secure international shopping with fast global shipping and manufacturer warranties.",
      pt: "Compras internacionais seguras com envio global rápido e garantia do fabricante.",
      fr: "Achats internationaux sécurisés avec livraison mondiale rapide et garanties fabricant."
    },
    badge: "Amazon Partner",
    badgeColor: "bg-amber-500",
    icon: "fa-amazon",
    url: "https://amzn.to/4bJJq22",
    buttonText: {
      es: "Comprar Ahora →",
      en: "Buy Now →",
      pt: "Comprar Agora →",
      fr: "Acheter →"
    }
  },
  {
    id: "shein",
    name: "Shein Fashion",
    category: {
      es: "Moda & Tendencias",
      en: "Fashion & Trends",
      pt: "Moda & Tendências",
      fr: "Mode & Tendances"
    },
    title: "Shein Global Fashion",
    description: {
      es: "Las últimas tendencias en moda, ropa y accesorios con descuentos exclusivos para todo el mundo.",
      en: "The latest fashion trends, clothing, and accessories with exclusive worldwide discounts.",
      pt: "As últimas tendências da moda, roupas e acessórios com descontos exclusivos para todo o mundo.",
      fr: "Les dernières tendances de la mode, vêtements et accessoires avec des réductions exclusives."
    },
    badge: "Shein Oficial",
    badgeColor: "bg-rose-500",
    icon: "fa-shirt",
    url: "https://onelink.shein.com/44/5wyleaujbj2iI",
    buttonText: {
      es: "Ver Colección →",
      en: "View Collection →",
      pt: "Ver Coleção →",
      fr: "Voir Collection →"
    }
  },
  {
    id: "aliexpress",
    name: "AliExpress Direct",
    category: {
      es: "Gadgets & Ofertas",
      en: "Gadgets & Deals",
      pt: "Gadgets & Ofertas",
      fr: "Gadgets & Offres"
    },
    title: "AliExpress Direct",
    description: {
      es: "Productos innovadores, electrónica y accesorios con envíos directos a cualquier país.",
      en: "Innovative products, electronics, and accessories with direct shipping to any country.",
      pt: "Produtos inovadores, eletrônicos e acessórios com entrega direta para qualquer país.",
      fr: "Produits innovants, électronique et accessoires avec livraison directe dans tous les pays."
    },
    badge: "AliExpress Deal",
    badgeColor: "bg-red-600",
    icon: "fa-bag-shopping",
    url: "https://s.click.aliexpress.com/e/_c33p0iw",
    buttonText: {
      es: "Aprovechar Oferta →",
      en: "Get Deal →",
      pt: "Aproveitar Oferta →",
      fr: "Profiter →"
    }
  },
  {
    id: "alibaba",
    name: "Alibaba Wholesale",
    category: {
      es: "Al Mayor B2B",
      en: "Wholesale B2B",
      pt: "Atacado B2B",
      fr: "Gros B2B"
    },
    title: "Alibaba Wholesale",
    description: {
      es: "Conecta directamente con fabricantes globales para compras al por mayor y emprendimientos.",
      en: "Connect directly with global manufacturers for wholesale purchases and businesses.",
      pt: "Conecte-se diretamente com fabricantes globais para compras no atacado e negócios.",
      fr: "Connectez-vous directement avec des fabricants mondiaux pour les achats en gros."
    },
    badge: "Alibaba Mayor",
    badgeColor: "bg-orange-500",
    icon: "fa-boxes-stacked",
    url: "https://offer.alibaba.com/cps/t9vapivb?bm=cps&src=saf",
    buttonText: {
      es: "Cotizar Mayorista →",
      en: "Wholesale Quote →",
      pt: "Cotação Atacado →",
      fr: "Devis Gros →"
    }
  }
];

export default function ProductGrid() {
  const { lang, t } = useLanguage();

  return (
    <section id="productos" className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-800 mb-3">
          {lang === 'es' ? 'Top Ofertas de Nuestros Socios' : lang === 'en' ? 'Top Partner Deals' : lang === 'pt' ? 'Melhores Ofertas de Parceiros' : 'Meilleures Offres Partenaires'}
        </h2>
        <p className="text-slate-500 text-sm max-w-2xl mx-auto">
          {lang === 'es' ? 'Encuentra los mejores productos a nivel global con garantía y seguridad de compra.' : 'Find the best global products with purchase guarantee and security.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {affiliateProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div>
              <div className="flex justify-between items-start mb-5">
                <span className={`text-[10px] font-bold text-white uppercase tracking-wider px-3 py-1.5 rounded-full ${product.badgeColor}`}>
                  {product.badge}
                </span>
                <i className={`fa-brands ${product.icon} text-2xl text-slate-300 group-hover:text-emerald-500 transition-colors`}></i>
              </div>
              <h3 className="text-[11px] font-bold text-emerald-600 mb-1 uppercase tracking-widest">{product.category[lang]}</h3>
              <h4 className="text-lg font-bold text-slate-800 mb-2 leading-tight">{product.title}</h4>
              <p className="text-sm text-slate-500 mb-6 line-clamp-3">{product.description[lang]}</p>
            </div>
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition shadow-md"
            >
              {product.buttonText[lang]}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}