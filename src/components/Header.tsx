'use client'

import { useLanguage } from '@/context/LanguageContext'
import Link from 'next/link'

export default function Header() {
  const { lang, setLang, t } = useLanguage()

  return (
    <header className="bg-slate-900 text-white text-xs py-2 px-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
        {/* Enlaces de navegación rápida y subtítulo */}
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/" className="font-bold text-white hover:text-emerald-400 transition">
            Markeplace
          </Link>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="flex items-center gap-1 font-semibold text-emerald-400">
            <i className="fa-solid fa-earth-americas"></i> {t('subtitle') || 'Plataforma Global'}
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <nav className="hidden lg:flex items-center gap-4 text-slate-300">
            <Link href="/products" className="hover:text-white transition">Productos</Link>
            <Link href="/magazines" className="hover:text-white transition">Revistas Científicas</Link>
            <Link href="/jobs" className="hover:text-white transition">Empleos</Link>
          </nav>
        </div>

        {/* Selector de idioma y accesos de cuenta */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="hover:text-emerald-400 transition font-medium">
              Iniciar Sesión
            </Link>
            <span className="text-slate-600">/</span>
            <Link href="/auth/register" className="hover:text-emerald-400 transition font-medium">
              Registrarse
            </Link>
          </div>

          <div className="flex items-center bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
            <i className="fa-solid fa-globe text-emerald-400 mr-2"></i>
            <select
              value={lang}
              aria-label="Seleccionar idioma"
              onChange={(e) => setLang(e.target.value as 'es' | 'en' | 'pt' | 'fr')}
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
  )
}
