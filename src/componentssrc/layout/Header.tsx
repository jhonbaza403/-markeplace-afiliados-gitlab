'use client';

// ==========================================================
// ARCHIVO: src/components/Header.tsx
// Credi Marketplace — PREMIUM GLOBAL HEADER
//
// NIVEL:
// Enterprise / Fintech / International Marketplace
//
// RESPONSABILIDADES:
// - Identidad institucional de Credi Marketplace.
// - Subtítulo internacional.
// - Selector de idioma.
// - Indicadores visuales de confianza.
// - Accesibilidad.
// - Integración con LanguageContext.
//
// NO RESPONSABILIDADES:
// - Autenticación.
// - Logout.
// - Navegación principal.
// - Roles.
// - Región.
// - Supabase.
// - Estado financiero.
//
// PRINCIPIO:
// Este componente debe transmitir desde el primer contacto:
//
//   CONFIANZA
//   TECNOLOGÍA
//   INTERNACIONALIZACIÓN
//   SEGURIDAD
//   PRESTIGIO
//
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
        z-50
        w-full
        border-b
        border-slate-800/80
        bg-slate-950/95
        text-white
        shadow-[0_8px_30px_rgba(0,0,0,0.18)]
        backdrop-blur-xl
      "
    >
      {/* ==================================================
          LÍNEA SUPERIOR DE IDENTIDAD
      ================================================== */}

      <div
        className="
          h-px
          w-full
          bg-gradient-to-r
          from-transparent
          via-emerald-400/70
          to-transparent
        "
        aria-hidden="true"
      />

      <div
        className="
          mx-auto
          flex
          min-h-[58px]
          max-w-7xl
          flex-col
          items-center
          justify-between
          gap-3
          px-4
          py-2.5
          sm:flex-row
          sm:px-6
          lg:px-8
        "
      >

        {/* ==================================================
            IDENTIDAD DE MARCA
        ================================================== */}

        <div
          className="
            flex
            min-w-0
            items-center
            gap-3
          "
        >

          <Link
            href="/"
            aria-label="Credi Marketplace - Inicio"
            className="
              group
              flex
              min-w-0
              items-center
              gap-3
              rounded-xl
              px-2
              py-1.5
              transition-all
              duration-200
              hover:bg-white/[0.04]
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-emerald-400
              focus-visible:ring-offset-2
              focus-visible:ring-offset-slate-950
            "
          >

            {/* =================================================
                ISOTIPO
            ================================================= */}

            <span
              className="
                relative
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-xl
                border
                border-emerald-400/30
                bg-gradient-to-br
                from-emerald-400
                via-emerald-500
                to-teal-600
                shadow-[0_0_24px_rgba(16,185,129,0.18)]
              "
              aria-hidden="true"
            >
              <span
                className="
                  absolute
                  inset-[1px]
                  rounded-[10px]
                  border
                  border-white/20
                "
              />

              <i
                className="
                  fa-solid
                  fa-bolt
                  relative
                  z-10
                  text-sm
                  text-white
                  drop-shadow-sm
                "
              />
            </span>

            {/* =================================================
                NOMBRE DE MARCA
            ================================================= */}

            <span className="flex min-w-0 flex-col leading-none">

              <span
                className="
                  truncate
                  text-[15px]
                  font-black
                  tracking-tight
                  text-white
                  transition-colors
                  group-hover:text-emerald-300
                "
              >
                Credi Marketplace
              </span>

              <span
                className="
                  mt-1
                  hidden
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.22em]
                  text-slate-500
                  sm:block
                "
              >
                Global Commerce Platform
              </span>

            </span>

          </Link>

          {/* ==================================================
              DIVISOR
          ================================================== */}

          <span
            aria-hidden="true"
            className="
              hidden
              h-7
              w-px
              bg-gradient-to-b
              from-transparent
              via-slate-700
              to-transparent
              sm:block
            "
          />

          {/* ==================================================
              SUBTÍTULO INSTITUCIONAL
          ================================================== */}

          <div
            className="
              hidden
              items-center
              gap-2
              lg:flex
            "
          >

            <span
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-lg
                border
                border-emerald-400/20
                bg-emerald-400/5
                text-emerald-400
              "
              aria-hidden="true"
            >
              <i className="fa-solid fa-earth-americas text-xs" />
            </span>

            <span
              className="
                max-w-[260px]
                truncate
                text-[10px]
                font-bold
                uppercase
                tracking-[0.12em]
                text-emerald-300
              "
            >
              {t('subtitle')}
            </span>

          </div>

        </div>

        {/* ==================================================
            CONTROLES INSTITUCIONALES
        ================================================== */}

        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          {/* =================================================
              ESTADO DE PLATAFORMA
          ================================================= */}

          <div
            className="
              hidden
              items-center
              gap-2
              rounded-xl
              border
              border-slate-800
              bg-slate-900/70
              px-3
              py-2
              md:flex
            "
            title="Plataforma operativa"
          >

            <span
              className="
                relative
                flex
                h-2
                w-2
              "
              aria-hidden="true"
            >
              <span
                className="
                  absolute
                  inline-flex
                  h-full
                  w-full
                  animate-ping
                  rounded-full
                  bg-emerald-400
                  opacity-50
                "
              />

              <span
                className="
                  relative
                  inline-flex
                  h-2
                  w-2
                  rounded-full
                  bg-emerald-400
                "
              />
            </span>

            <span
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-wider
                text-slate-400
              "
            >
              Plataforma activa
            </span>

          </div>

          {/* =================================================
              SEGURIDAD
          ================================================= */}

          <div
            className="
              hidden
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              border
              border-slate-800
              bg-slate-900/70
              text-slate-400
              transition-all
              hover:border-emerald-400/30
              hover:bg-emerald-400/5
              hover:text-emerald-400
              sm:flex
            "
            title="Entorno protegido"
            aria-label="Entorno protegido"
          >
            <i
              className="fa-solid fa-shield-halved text-xs"
              aria-hidden="true"
            />
          </div>

          {/* =================================================
              SELECTOR DE IDIOMA PREMIUM
          ================================================= */}

          <div
            className="
              group
              flex
              items-center
              rounded-xl
              border
              border-slate-700/80
              bg-slate-900
              shadow-inner
              transition-all
              duration-200
              hover:border-emerald-400/40
              hover:bg-slate-800
              focus-within:border-emerald-400
              focus-within:ring-2
              focus-within:ring-emerald-400/10
            "
          >

            {/* ICONO */}

            <span
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                border-r
                border-slate-800
                text-emerald-400
              "
              aria-hidden="true"
            >
              <i className="fa-solid fa-globe text-xs" />
            </span>

            {/* SELECT */}

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
              aria-label="Seleccionar idioma"
              className="
                h-9
                cursor-pointer
                appearance-none
                bg-transparent
                px-3
                pr-8
                text-[10px]
                font-bold
                uppercase
                tracking-wider
                text-white
                outline-none
              "
            >
              {locales.map((locale) => (
                <option
                  key={locale}
                  value={locale}
                  className="
                    bg-slate-950
                    text-white
                  "
                >
                  {getLanguageName(locale)}
                </option>
              ))}
            </select>

            {/* CHEVRON */}

            <span
              className="
                pointer-events-none
                -ml-6
                mr-2
                text-slate-500
              "
              aria-hidden="true"
            >
              <i className="fa-solid fa-chevron-down text-[8px]" />
            </span>

          </div>

        </div>
      </div>

      {/* ====================================================
          MICRO BARRA INSTITUCIONAL
      ==================================================== */}

      <div
        className="
          hidden
          border-t
          border-slate-900
          bg-slate-950/70
          lg:block
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-7xl
            items-center
            justify-between
            px-6
            py-1.5
            lg:px-8
          "
        >

          <div
            className="
              flex
              items-center
              gap-5
              text-[8px]
              font-bold
              uppercase
              tracking-[0.16em]
              text-slate-600
            "
          >

            <span className="flex items-center gap-1.5">
              <i
                className="fa-solid fa-lock text-emerald-500/70"
                aria-hidden="true"
              />
              Entorno protegido
            </span>

            <span className="flex items-center gap-1.5">
              <i
                className="fa-solid fa-globe text-emerald-500/70"
                aria-hidden="true"
              />
              Comercio internacional
            </span>

            <span className="flex items-center gap-1.5">
              <i
                className="fa-solid fa-bolt text-emerald-500/70"
                aria-hidden="true"
              />
              Plataforma digital
            </span>

          </div>

          <span
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-slate-700
            "
          >
            Credi Marketplace
          </span>

        </div>
      </div>

    </header>
  );
}

// ==========================================================
// NOMBRES VISIBLES DE LOS IDIOMAS
//
// Fuente única de locales:
// src/i18n/config.ts
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
