"use client";

import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const { t } = useLanguage();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-[33px] z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-600 text-white font-black text-xl px-3 py-1.5 rounded-xl tracking-tight">GM</span>
          <span className="font-black text-xl tracking-tight text-slate-900 hidden sm:inline">Global Market</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="#contacto" className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition">
            {t('support')}
          </a>
        </div>
      </div>
    </nav>
  );
}