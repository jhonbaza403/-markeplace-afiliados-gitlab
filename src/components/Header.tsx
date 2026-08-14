'use client';

// ==========================================================
// ARCHIVO: src/components/Header.tsx
// Credi Marketplace
//
// Barra superior institucional/utilitaria.
//
// RESPONSABILIDADES:
// - Mostrar identidad global de la plataforma.
// - Mostrar subtítulo institucional.
// - Permitir cambiar el idioma.
// - Mantener accesibilidad.
// - Complementar al Navbar.
//
// NO RESPONSABILIDADES:
// - Autenticación.
// - Cierre de sesión.
// - Navegación principal.
// - Selección de región.
// - Gestión de roles.
// - Consultas a Supabase.
//
// IMPORTANTE:
// El catálogo de idiomas proviene exclusivamente de:
// src/i18n/config.ts
//
// Este componente NO debe volver a declarar:
// 'es' | 'en' | 'pt' | 'fr'
// ==========================================================

import Link from 'next/link';

import {
  useLanguage,
} from '@/context/LanguageContext';

import {
  locales,
  type Locale,
} from '@/i18n/config';

// ==========================================================
// COMPONENTE
// ==========================================================

export default function Header() {
  const {
    lang,
    setLang,
    t,
  } = useLanguage();

  // ========================================================
  // CAMBIO DE IDIOMA
  // ========================================================

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setLang(event.target.value as Locale);
  };

  return (
    <header
      className="
        sticky
        top-0
        z-40
        border-b
        border-slate-800
        bg-slate-950
        text-white
        shadow-sm
      "
    >
      <div
        className="
          mx-auto
          flex
          max-w-7xl
          flex-col
          items-center
          justify-between
          gap-3
          px-4
          py-2
          sm:flex-row
          sm:px-6
          lg:px-8
        "
      >

        {/* ==================================================
            IDENTIDAD INSTITUCIONAL
        ================================================== */}

        <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">

          <Link
            href="/"
            className="
              font-bold
              tracking-tight
              text-white
              transition-colors
              hover:text-emerald-400
              focus:outline-none
              focus-visible:rounded
              focus-visible:ring-2
              focus-visible:ring-emerald-400
              focus-visible:ring-offset-2
              focus-visible:ring-offset-slate-950
            "
            aria-label="Credi Marketplace - Inicio"
          >
            Credi Marketplace
          </Link>

          <span
            aria-hidden="true"
            className="hidden text-slate-700 sm:inline"
          >
            |
          </span>

          <span
            className="
              inline-flex
              items-center
              gap-2
              font-semibold
              text-emerald-400
            "
          >
            <i
              className="fa-solid fa-earth-americas"
              aria-hidden="true"
            />

            {t('subtitle')}
          </span>

        </div>

        {/* ==================================================
            CONTROLES DEL HEADER
        ================================================== */}

        <div className="flex items-center gap-3">

          {/* =================================================
              SELECTOR DE IDIOMA
          ================================================= */}

          <div
            className="
              flex
              items-center
              rounded-lg
              border
              border-slate-700
              bg-slate-900
              px-2.5
              py-1
            "
          >
            <i
              className="
                fa-solid
                fa-globe
                mr-2
                text-emerald-400
              "
              aria-hidden="true"
            />

            <label
              htmlFor="language-selector"
              className="sr-only"
            >
              Seleccionar idioma
            </label>

            <select
              id="language-selector"
              value={lang}
              onChange={handleLanguageChange}
              className="
                cursor-pointer
                bg-transparent
                text-xs
                font-medium
                text-white
                outline-none
                focus-visible:ring-2
                focus-visible:ring-emerald-400
                rounded
              "
            >
              {locales.map((locale) => (
                <option
                  key={locale}
                  value={locale}
                  className="bg-slate-900 text-white"
                >
                  {getLanguageName(locale)}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>
    </header>
  );
}

// ==========================================================
// NOMBRES VISIBLES DE LOS IDIOMAS
// ==========================================================

function getLanguageName(
  locale: Locale,
): string {
  switch (locale) {
    case 'es':
      return 'Español';

    case 'en':
      return 'English';

    case 'pt':
      return 'Português';

    case 'fr':
      return 'Français';

    default:
      return locale;
  }
}