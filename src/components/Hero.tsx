"use client";

import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 rounded-3xl p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            {t('bannerTag') || 'Innovación y Comisiones'}
          </span>
          <h1 className="text-3xl md:text-5xl font-black mt-3 leading-tight">
            {t('bannerTitle') || 'Tu Marketplace, Empleos y Afiliados Global'}
          </h1>
          <p className="text-slate-300 text-sm md:text-base mt-3">
            {t('bannerDesc') || 'Compra, publica revistas científicas, encuentra vacantes laborales y genera ingresos pasivos compartiendo tus enlaces de afiliado.'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          <a href="#productos" className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-3.5 rounded-2xl text-center shadow-lg transition">
            Ver Catálogo 🚀
          </a>
          <Link href="/dashboard/affiliate" className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold px-6 py-3.5 rounded-2xl text-center transition">
            Panel de Afiliados
          </Link>
        </div>
      </div>
    </section>
  );
}