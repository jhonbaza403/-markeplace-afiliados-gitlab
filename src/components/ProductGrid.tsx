'use client';

import { affiliateProducts } from '@/data/products';
import { useLanguage } from '@/context/LanguageContext';

const GRID_COPY = {
  es: {
    title: 'Ofertas destacadas de nuestros socios',
    description:
      'Descubre productos y plataformas internacionales seleccionadas para nuestra comunidad.',
  },
  en: {
    title: 'Featured offers from our partners',
    description:
      'Discover international products and platforms selected for our community.',
  },
  pt: {
    title: 'Ofertas em destaque dos nossos parceiros',
    description:
      'Descubra produtos e plataformas internacionais selecionados para nossa comunidade.',
  },
  fr: {
    title: 'Offres sélectionnées de nos partenaires',
    description:
      'Découvrez des produits et plateformes internationales sélectionnés pour notre communauté.',
  },
} as const;

export default function ProductGrid() {
  const { lang } = useLanguage();

  const copy = GRID_COPY[lang];

  return (
    <section
      id="productos"
      aria-labelledby="affiliate-products-title"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
    >
      {/* =====================================================
          CABECERA
      ====================================================== */}

      <div className="mx-auto mb-12 max-w-3xl text-center">
        <h2
          id="affiliate-products-title"
          className="mb-3 text-3xl font-bold tracking-tight text-slate-800"
        >
          {copy.title}
        </h2>

        <p className="text-sm leading-relaxed text-slate-500">
          {copy.description}
        </p>
      </div>

      {/* =====================================================
          PRODUCTOS
      ====================================================== */}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {affiliateProducts.map((product) => (
          <article
            key={product.id}
            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div>
              {/* =================================================
                  BADGE + ICON
              ================================================== */}

              <div className="mb-5 flex items-start justify-between gap-4">
                <span
                  className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white ${product.badgeColor}`}
                >
                  {product.badge}
                </span>

                <i
                  className={`fa-brands ${product.icon} text-2xl text-slate-300 transition-colors group-hover:text-emerald-500`}
                  aria-hidden="true"
                />
              </div>

              {/* =================================================
                  CATEGORY
              ================================================== */}

              <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-emerald-600">
                {product.category[lang]}
              </p>

              {/* =================================================
                  TITLE
              ================================================== */}

              <h3 className="mb-2 text-lg font-bold leading-tight text-slate-800">
                {product.title[lang]}
              </h3>

              {/* =================================================
                  DESCRIPTION
              ================================================== */}

              <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-slate-500">
                {product.description[lang]}
              </p>
            </div>

            {/* ===================================================
                AFFILIATE CTA
            ==================================================== */}

            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full rounded-xl bg-slate-900 py-3 text-center text-sm font-semibold text-white shadow-md transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              aria-label={`${product.buttonText[lang]} - ${product.name}`}
            >
              {product.buttonText[lang]}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}