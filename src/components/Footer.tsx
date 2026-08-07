"use client";

import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer id="contacto" className="bg-white border-t border-slate-200 mt-16 py-12 px-4 text-slate-500">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Markeplace Afiliados</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Tu plataforma integral de comercio electrónico, revistas científicas, bolsa de empleo y marketing de referidos.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Explorar</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/products" className="hover:text-blue-600 transition">Productos</Link></li>
            <li><Link href="/magazines" className="hover:text-blue-600 transition">Revistas Científicas</Link></li>
            <li><Link href="/jobs" className="hover:text-blue-600 transition">Bolsa de Empleo</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Afiliados y Socios</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/dashboard/affiliate" className="hover:text-blue-600 transition">Panel de Afiliado</Link></li>
            <li><Link href="/dashboard/seller" className="hover:text-blue-600 transition">Portal de Vendedores</Link></li>
            <li><Link href="/auth/register" className="hover:text-blue-600 transition">Registrarme</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Soporte</h4>
          <p className="text-xs text-slate-600 mb-2">¿Tienes dudas o necesitas ayuda con tus comisiones?</p>
          <a href="mailto:soporte@marketplace.com" className="text-xs font-semibold text-blue-600 hover:underline">
            soporte@marketplace.com
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <p>{t('rights') || '© 2026 Markeplace Afiliados. Todos los derechos reservados.'}</p>
        <div className="flex gap-6">
          <span className="hover:text-slate-800 transition cursor-pointer">{t('terms') || 'Términos y Condiciones'}</span>
          <span className="hover:text-slate-800 transition cursor-pointer">{t('privacy') || 'Política de Privacidad'}</span>
        </div>
      </div>
    </footer>
  );
}