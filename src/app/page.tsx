'tsx'
'use client';

import { useLanguage } from '@/context/LanguageContext';
import ProductGrid from '@/components/ProductGrid';

export default function Home() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        {/* BARRA SUPERIOR MULTI-IDIOMA */}
        <header className="bg-slate-900 text-white text-xs py-2 px-4 sticky top-0 z-50 shadow-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 font-semibold text-emerald-400">
                <i className="fa-solid fa-earth-americas"></i> {t('subtitle')}
              </span>
              <span className="hidden md:inline text-slate-400">|</span>
              <span className="hidden md:inline text-slate-300">{t('subText')}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
                <i className="fa-solid fa-globe text-emerald-400 mr-2"></i>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as any)}
                  className="bg-transparent text-white focus:outline-none cursor-pointer"
                >
                  <option value="es" className="bg-slate-800">Español</option>
                  <option value="en" className="bg-slate-800">English</option>
                  <option value="pt" className="bg-slate-800">Português</option>
                  <option value="fr" className="bg-slate-800">Français</option>
                </select>
              </div>
            </div>
          </div>
        </header>

        {/* NAVEGACIÓN PRINCIPAL */}
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

        {/* SECCIÓN HERO */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 rounded-3xl p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                {t('bannerTag')}
              </span>
              <h1 className="text-3xl md:text-5xl font-black mt-3 leading-tight">{t('bannerTitle')}</h1>
              <p className="text-slate-300 text-sm md:text-base mt-3">{t('bannerDesc')}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <a href="#productos" className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-3.5 rounded-2xl text-center shadow-lg transition">
                Ver Catálogo Global 🚀
              </a>
            </div>
          </div>
        </section>

        {/* CATÁLOGO Y PRODUCTOS DINÁMICOS */}
        <ProductGrid />
      </div>

      {/* PIE DE PÁGINA */}
      <footer id="contacto" className="bg-white border-t border-slate-200 mt-16 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>{t('rights')}</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-800 transition cursor-pointer">{t('terms')}</span>
            <span className="hover:text-slate-800 transition cursor-pointer">{t('privacy')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}