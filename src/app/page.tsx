// ==========================================================
// ARCHIVO: src/app/page.tsx
// Credi Marketplace — Landing Page Principal
//
// Next.js 16.3
// React 19
// React Compiler
// Server Component
// ==========================================================

import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  ArrowRight,
  Building2,
  Globe2,
  LockKeyhole,
  ShoppingBag,
  Sparkles,
  Store,
  Users,
} from 'lucide-react';

// ==========================================================
// TIPOS
// ==========================================================

interface Feature {
  readonly title: string;
  readonly description: string;
  readonly icon: ReactNode;
  readonly iconClassName: string;
  readonly iconBackgroundClassName: string;
}

interface NavigationColumn {
  readonly title: string;
  readonly links: ReadonlyArray<{
    readonly href: string;
    readonly label: string;
  }>;
}

// ==========================================================
// DATOS ESTÁTICOS
// ==========================================================

const features: ReadonlyArray<Feature> = [
  {
    title: 'Comercio seguro',
    description:
      'Una infraestructura diseñada para facilitar operaciones comerciales con controles de acceso y protección de datos.',
    icon: <LockKeyhole aria-hidden="true" className="size-7" />,
    iconClassName: 'text-brand-600',
    iconBackgroundClassName:
      'bg-brand-100 ring-brand-500/20 dark:bg-brand-950 dark:ring-brand-400/20',
  },
  {
    title: 'Alcance internacional',
    description:
      'Conecta compradores, vendedores, profesionales y empresas más allá de las fronteras.',
    icon: <Globe2 aria-hidden="true" className="size-7" />,
    iconClassName: 'text-cyan-600 dark:text-cyan-400',
    iconBackgroundClassName:
      'bg-cyan-100 ring-cyan-500/20 dark:bg-cyan-950 dark:ring-cyan-400/20',
  },
  {
    title: 'B2B y B2C',
    description:
      'Una plataforma preparada para operaciones comerciales al detal y relaciones comerciales mayoristas.',
    icon: <Building2 aria-hidden="true" className="size-7" />,
    iconClassName: 'text-indigo-600 dark:text-indigo-400',
    iconBackgroundClassName:
      'bg-indigo-100 ring-indigo-500/20 dark:bg-indigo-950 dark:ring-indigo-400/20',
  },
];

const navigationColumns: ReadonlyArray<NavigationColumn> = [
  {
    title: 'Navegación',
    links: [
      { href: '/explorar', label: 'Explorar' },
      { href: '/ofertas', label: 'Ofertas' },
      { href: '/productos', label: 'Productos' },
      { href: '/servicios', label: 'Servicios' },
    ],
  },
  {
    title: 'Comercio',
    links: [
      { href: '/vender', label: 'Vender en Credi' },
      { href: '/categorias', label: 'Categorías' },
      { href: '/b2b', label: 'Portal B2B' },
    ],
  },
  {
    title: 'Cuenta',
    links: [
      { href: '/login', label: 'Ingresar' },
      { href: '/registro', label: 'Crear cuenta' },
      { href: '/soporte', label: 'Centro de ayuda' },
    ],
  },
];

// ==========================================================
// COMPONENTE PRINCIPAL
// ==========================================================

export default function HomePage() {
  return (
    <>
      {/* ======================================================
          HERO
      ======================================================= */}

      <section
        aria-labelledby="hero-title"
        className="relative isolate overflow-hidden bg-neutral-950 text-white"
      >
        {/* Fondo decorativo */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -left-40 -top-40 size-[30rem] rounded-full bg-brand-600/20 blur-[120px]" />

          <div className="absolute -right-40 top-1/2 size-[30rem] -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_55%)]" />
        </div>

        <div className="container-marketplace relative py-24 sm:py-32 lg:py-40">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-brand-400/20 bg-brand-400/10 px-4 py-2 text-sm font-medium text-brand-200 backdrop-blur-md">
              <span
                aria-hidden="true"
                className="relative flex size-2"
              >
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-brand-400" />
              </span>

              <span>Plataforma comercial B2B &amp; B2C</span>
            </div>

            {/* Título */}

            <h1
              id="hero-title"
              className="text-balance text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              El ecosistema digital para{' '}
              <span className="bg-linear-to-r from-brand-300 via-cyan-300 to-cyan-400 bg-clip-text text-transparent">
                crecer sin límites
              </span>
            </h1>

            {/* Descripción */}

            <p className="mx-auto mt-7 max-w-3xl text-pretty text-lg leading-8 text-neutral-300 sm:text-xl">
              Compra, vende y desarrolla oportunidades comerciales en Credi
              Marketplace. Una plataforma diseñada para conectar personas,
              profesionales, empresas y proveedores.
            </p>

            {/* CTAs */}

            <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
              <Link
                href="/explorar"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 px-7 py-3.5 font-bold text-white shadow-lg shadow-brand-950/40 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
              >
                Explorar mercado

                <ArrowRight
                  aria-hidden="true"
                  className="size-5 transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/vender"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 font-bold text-white backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Empieza a vender
              </Link>
            </div>
          </div>

          {/* Indicadores de ecosistema */}

          <div className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
            <HeroMetric
              icon={<Users aria-hidden="true" className="size-5" />}
              label="Comunidad"
              value="Global"
            />

            <HeroMetric
              icon={<ShoppingBag aria-hidden="true" className="size-5" />}
              label="Modelo"
              value="B2C"
            />

            <HeroMetric
              icon={<Building2 aria-hidden="true" className="size-5" />}
              label="Empresas"
              value="B2B"
            />

            <HeroMetric
              icon={<Store aria-hidden="true" className="size-5" />}
              label="Comercio"
              value="Digital"
            />
          </div>
        </div>
      </section>

      {/* ======================================================
          PROPUESTA DE VALOR
      ======================================================= */}

      <section
        aria-labelledby="features-title"
        className="bg-[var(--background)] py-24 sm:py-32"
      >
        <div className="container-marketplace">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-sm font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
              <Sparkles aria-hidden="true" className="size-4" />
              Una nueva forma de hacer negocios
            </div>

            <h2
              id="features-title"
              className="text-balance text-3xl font-black tracking-tight text-[var(--foreground)] sm:text-4xl"
            >
              Todo lo necesario para construir tu próximo negocio
            </h2>

            <p className="mt-5 text-pretty text-lg leading-8 text-[var(--muted)]">
              Credi Marketplace integra herramientas para descubrir productos,
              comercializar, conectar con proveedores y desarrollar nuevas
              oportunidades.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-6xl gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="marketplace-card group p-7 transition-transform duration-200 hover:-translate-y-1"
              >
                <div
                  className={`mb-6 flex size-14 items-center justify-center rounded-2xl ring-1 ${feature.iconBackgroundClassName} ${feature.iconClassName}`}
                >
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold text-[var(--foreground)]">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-[var(--muted)]">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
          CTA
      ======================================================= */}

      <section
        aria-labelledby="cta-title"
        className="px-4 pb-24 sm:px-6 sm:pb-32"
      >
        <div className="container-marketplace overflow-hidden rounded-3xl bg-neutral-950 text-white shadow-marketplace-xl">
          <div className="relative isolate overflow-hidden px-6 py-20 text-center sm:px-12 sm:py-24">
            {/* Glow */}

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-40 -top-40 -z-10 size-[30rem] rounded-full bg-brand-600/20 blur-[120px]"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-40 -left-40 -z-10 size-[30rem] rounded-full bg-cyan-500/10 blur-[120px]"
            />

            <h2
              id="cta-title"
              className="text-balance text-3xl font-black tracking-tight sm:text-5xl"
            >
              ¿Listo para dar el siguiente paso?
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-neutral-300 sm:text-xl">
              Crea tu cuenta y comienza a explorar nuevas oportunidades
              comerciales dentro del ecosistema Credi Marketplace.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/registro"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-600 px-8 py-3.5 font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
              >
                Crear cuenta gratis
              </Link>

              <Link
                href="/contacto"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-8 py-3.5 font-bold text-white backdrop-blur transition-all duration-200 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Hablar con un asesor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          FOOTER
          
          NOTA:
          El footer global debe estar en layout.tsx.
          Se mantiene aquí solamente si todavía no existe
          un Footer global independiente.
      ======================================================= */}

      <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="container-marketplace py-16">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
            {/* Marca */}

            <div className="sm:col-span-2 lg:col-span-2 lg:pr-12">
              <Link
                href="/"
                aria-label="Credi Marketplace — Inicio"
                className="inline-flex text-2xl font-black tracking-tight text-[var(--foreground)]"
              >
                Credi
                <span className="text-brand-600">Marketplace</span>
              </Link>

              <p className="mt-4 max-w-md text-sm leading-6 text-[var(--muted)]">
                Un ecosistema digital para conectar compradores, vendedores,
                profesionales, proveedores y empresas.
              </p>
            </div>

            {/* Navegación */}

            {navigationColumns.map((column) => (
              <nav
                key={column.title}
                aria-label={column.title}
              >
                <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
                  {column.title}
                </h2>

                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-[var(--muted)] transition-colors hover:text-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          {/* Copyright */}

          <div className="mt-16 flex flex-col gap-4 border-t border-[var(--border)] pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--muted)]">
              © {new Date().getFullYear()} Credi Marketplace. Todos los
              derechos reservados.
            </p>

            <nav
              aria-label="Legal"
              className="flex gap-6"
            >
              <Link
                href="/privacidad"
                className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
              >
                Privacidad
              </Link>

              <Link
                href="/terminos"
                className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
              >
                Términos
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
}

// ==========================================================
// HERO METRIC
// ==========================================================

interface HeroMetricProps {
  readonly icon: ReactNode;
  readonly label: string;
  readonly value: string;
}

function HeroMetric({
  icon,
  label,
  value,
}: HeroMetricProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-md">
      <div className="mx-auto flex size-9 items-center justify-center rounded-lg bg-white/10 text-brand-300">
        {icon}
      </div>

      <p className="mt-3 text-xs font-medium uppercase tracking-wider text-neutral-400">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold text-white">
        {value}
      </p>
    </div>
  );
}