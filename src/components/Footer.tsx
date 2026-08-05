"use client";

import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer id="contacto" className="bg-white border-t border-slate-200 mt-16 py-8 px-4 text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>{t('rights')}</p>
        <div className="flex gap-4">
          <span className="hover:text-slate-800 transition cursor-pointer">{t('terms')}</span>
          <span className="hover:text-slate-800 transition cursor-pointer">{t('privacy')}</span>
        </div>
      </div>
    </footer>
  );
}