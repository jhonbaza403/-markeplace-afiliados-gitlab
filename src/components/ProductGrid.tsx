'tsx'
"use client";

import React, { useState } from 'react';
import { affiliateProducts } from '@/data/products';
import { useLanguage } from '@/context/LanguageContext';

export default function ProductGrid() {
  const { lang, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = affiliateProducts.filter((product) => {
    const query = searchTerm.toLowerCase();
    return (
      product.title.toLowerCase().includes(query) ||
      product.name.toLowerCase().includes(query) ||
      product.description[lang].toLowerCase().includes(query)
    );
  });

  return (
    <main id="productos" className="max-w-7xl mx-auto px-4 py-8">
      {/* Buscador Integrado dinámico */}
      <div className="mb-8 max-w-xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-white border border-slate-200 rounded-full py-3 pl-12 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-4 text-slate-400"></i>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-slate-900">{t('catalogTitle')}</h2>
        <span className="text-xs font-bold text-slate-500 bg-slate-200 px-3 py-1 rounded-full">
          {t('updated')}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-48 rounded-2xl bg-slate-100 overflow-hidden mb-4 flex items-center justify-center">
                <span
                  className={`absolute top-3 left-3 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow ${product.badgeColor}`}
                >
                  {product.badge}
                </span>
                <i className={`fa-solid ${product.icon} text-6xl text-slate-700 group-hover:scale-110 transition duration-300`}></i>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                {product.category[lang]}
              </span>
              <h3 className="font-black text-lg text-slate-900 mt-1">{product.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{product.description[lang]}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm font-black text-slate-900">{t('officialLink')}</span>
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow"
              >
                {product.buttonText[lang]}
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}