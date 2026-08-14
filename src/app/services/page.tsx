```tsx
'use client';

// ==========================================================
// ARCHIVO: src/app/services/page.tsx
// Credi Marketplace
//
// Marketplace de servicios profesionales.
//
// RESPONSABILIDADES:
// - Mostrar servicios disponibles.
// - Buscar servicios.
// - Filtrar por categoría.
// - Mostrar precio, valoración y región.
// - Permitir acceder al servicio.
// - Mantener diseño responsive.
// - Preparar integración futura con Supabase.
//
// ARQUITECTURA:
// La página NO consulta Supabase directamente.
// La fuente de datos real deberá conectarse mediante
// una capa de servicios/repository.
//
// ==========================================================

import {
  Search,
  MapPin,
  Star,
  Clock3,
  ArrowRight,
  BriefcaseBusiness,
  SlidersHorizontal,
  X,
} from 'lucide-react';

import {
  useMemo,
  useState,
} from 'react';

import type { Service } from '@/types/services';

import Link from 'next/link';

// ==========================================================
// DATOS TEMPORALES
// ==========================================================
//
// Estos datos permiten que la interfaz funcione mientras
// conectamos la tabla real de servicios.
//
// Posteriormente:
// serviceService.getServices()
// ==========================================================

const demoServices: Service[] = [
  {
    id: 'srv-1',
    providerId: 'user-2',
    title:
      'Consultoría Legal y Contratos de Comercio Exterior',
    description:
      'Asesoría especializada para PYMES, empresas y vendedores que realizan operaciones comerciales nacionales e internacionales.',
    category: 'Legal',
    pricePerUnit: 50,
    unitType: 'hour',
    currency: 'USD',
    rating: 4.9,
    reviewCount: 18,
    region: 'global',
    createdAt:
      new Date().toISOString(),
  },
  {
    id: 'srv-2',
    providerId: 'user-3',
    title:
      'Diseño Gráfico y Branding Empresarial',
    description:
      'Diseño de identidad visual, logotipos, material corporativo y estrategia de marca.',
    category: 'Diseño',
    pricePerUnit: 35,
    unitType: 'hour',
    currency: 'USD',
    rating: 4.8,
    reviewCount: 24,
    region: 'global',
    createdAt:
      new Date().toISOString(),
  },
  {
    id: 'srv-3',
    providerId: 'user-4',
    title:
      'Desarrollo Web y Aplicaciones',
    description:
      'Desarrollo de plataformas web modernas, tiendas online y aplicaciones empresariales.',
    category: 'Tecnología',
    pricePerUnit: 60,
    unitType: 'hour',
    currency: 'USD',
    rating: 5,
    reviewCount: 31,
    region: 'global',
    createdAt:
      new Date().toISOString(),
  },
];

// ==========================================================
// CATEGORÍAS
// ==========================================================

const categories = [
  'Todos',
  'Legal',
  'Diseño',
  'Tecnología',
  'Marketing',
  'Consultoría',
  'Educación',
  'Finanzas',
  'Otros',
] as const;

// ==========================================================
// FORMATEAR PRECIO
// ==========================================================

function formatPrice(
  price: number,
  currency: string
): string {
  try {
    return new Intl.NumberFormat(
      'en-US',
      {
        style: 'currency',
        currency,
        maximumFractionDigits: 2,
      }
    ).format(price);
  } catch {
    return `${currency} ${price}`;
  }
}

// ==========================================================
// TEXTO DE UNIDAD
// ==========================================================

function formatUnit(
  unitType: string
): string {
  switch (
    unitType.toLowerCase()
  ) {
    case 'hour':
      return 'hora';

    case 'day':
      return 'día';

    case 'project':
      return 'proyecto';

    case 'month':
      return 'mes';

    case 'service':
      return 'servicio';

    default:
      return unitType;
  }
}

// ==========================================================
// COMPONENTE
// ==========================================================

export default function ServicesPage() {
  const [search, setSearch] =
    useState('');

  const [selectedCategory, setSelectedCategory] =
    useState('Todos');

  const [showFilters, setShowFilters] =
    useState(false);

  // ========================================================
  // FILTRADO
  // ========================================================

  const filteredServices =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return demoServices.filter(
        (service) => {
          const matchesCategory =
            selectedCategory ===
              'Todos' ||
            service.category ===
              selectedCategory;

          if (!normalizedSearch) {
            return matchesCategory;
          }

          const searchableText =
            [
              service.title,
              service.description,
              service.category,
              service.region,
            ]
              .filter(Boolean)
              .join(' ')
              .toLowerCase();

          return (
            matchesCategory &&
            searchableText.includes(
              normalizedSearch
            )
          );
        }
      );
    }, [
      search,
      selectedCategory,
    ]);

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* ====================================================
          HERO
      ==================================================== */}

      <section
        className="
          border-b
          border-[var(--border)]
          bg-[var(--surface)]
        "
      >
        <div
          className="
            container-marketplace
            py-10
            sm:py-14
          "
        >
          <div
            className="
              max-w-3xl
            "
          >
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[var(--primary)]/20
                bg-[var(--primary)]/10
                px-3
                py-1.5
                text-xs
                font-bold
                text-[var(--primary)]
              "
            >
              <BriefcaseBusiness
                aria-hidden="true"
                className="size-4"
              />

              Servicios profesionales
            </div>

            <h1
              className="
                mt-5
                text-3xl
                font-black
                tracking-tight
                text-[var(--foreground)]
                sm:text-4xl
                lg:text-5xl
              "
            >
              Encuentra profesionales
              para lo que necesitas
            </h1>

            <p
              className="
                mt-4
                max-w-2xl
                text-base
                leading-7
                text-[var(--muted)]
                sm:text-lg
              "
            >
              Conecta con especialistas,
              consultores y técnicos
              disponibles para ayudarte
              con proyectos personales o
              empresariales.
            </p>
          </div>

          {/* =================================================
              BUSCADOR
          ================================================= */}

          <div
            className="
              mt-8
              flex
              flex-col
              gap-3
              sm:flex-row
            "
          >
            <div
              className="
                relative
                flex-1
              "
            >
              <Search
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  size-5
                  -translate-y-1/2
                  text-[var(--muted-light)]
                "
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="¿Qué servicio necesitas?"
                aria-label="Buscar servicios"
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-[var(--border)]
                  bg-[var(--background)]
                  pl-12
                  pr-4
                  text-sm
                  text-[var(--foreground)]
                  outline-none
                  transition
                  placeholder:text-[var(--muted-light)]
                  focus:border-[var(--primary)]
                  focus:ring-2
                  focus:ring-[var(--primary)]/20
                "
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch('')
                  }
                  aria-label="Limpiar búsqueda"
                  className="
                    absolute
                    right-3
                    top-1/2
                    flex
                    size-8
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-lg
                    text-[var(--muted)]
                    hover:bg-[var(--surface-secondary)]
                  "
                >
                  <X
                    aria-hidden="true"
                    className="size-4"
                  />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                setShowFilters(
                  (current) =>
                    !current
                )
              }
              className="
                inline-flex
                h-12
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-[var(--border)]
                bg-[var(--surface)]
                px-5
                text-sm
                font-bold
                text-[var(--foreground)]
                transition-colors
                hover:bg-[var(--surface-secondary)]
              "
              aria-expanded={
                showFilters
              }
            >
              <SlidersHorizontal
                aria-hidden="true"
                className="size-4"
              />

              Filtros
            </button>
          </div>
        </div>
      </section>

      {/* ====================================================
          CONTENIDO
      ==================================================== */}

      <section
        className="
          container-marketplace
          py-8
        "
      >
        {/* =================================================
            CATEGORÍAS
        ================================================= */}

        <div
          className={`
            ${
              showFilters
                ? 'block'
                : 'hidden'
            }
            mb-6
            rounded-2xl
            border
            border-[var(--border)]
            bg-[var(--surface)]
            p-4
            sm:block
          `}
        >
          <div
            className="
              flex
              flex-wrap
              gap-2
            "
          >
            {categories.map(
              (category) => {
                const active =
                  selectedCategory ===
                  category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      setSelectedCategory(
                        category
                      )
                    }
                    aria-pressed={
                      active
                    }
                    className={`
                      rounded-full
                      px-4
                      py-2
                      text-sm
                      font-bold
                      transition-all
                      ${
                        active
                          ? 'bg-[var(--primary)] text-white shadow-sm'
                          : 'bg-[var(--surface-secondary)] text-[var(--muted)] hover:text-[var(--foreground)]'
                      }
                    `}
                  >
                    {category}
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* =================================================
            CABECERA RESULTADOS
        ================================================= */}

        <div
          className="
            mb-6
            flex
            items-center
            justify-between
            gap-4
          "
        >
          <div>
            <h2
              className="
                text-xl
                font-black
                text-[var(--foreground)]
              "
            >
              Servicios disponibles
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-[var(--muted)]
              "
            >
              {filteredServices.length}{' '}
              {filteredServices.length ===
              1
                ? 'servicio encontrado'
                : 'servicios encontrados'}
            </p>
          </div>
        </div>

        {/* =================================================
            RESULTADOS
        ================================================= */}

        {filteredServices.length >
        0 ? (
          <div
            className="
              grid
              grid-cols-1
              gap-5
              sm:grid-cols-2
              xl:grid-cols-3
            "
          >
            {filteredServices.map(
              (service) => (
                <article
                  key={service.id}
                  className="
                    group
                    overflow-hidden
                    rounded-2xl
                    border
                    border-[var(--border)]
                    bg-[var(--surface)]
                    shadow-sm
                    transition-all
                    duration-200
                    hover:-translate-y-1
                    hover:shadow-lg
                  "
                >
                  {/* =======================================
                      CABECERA TARJETA
                  ======================================== */}

                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-3
                      border-b
                      border-[var(--border)]
                      p-5
                    "
                  >
                    <span
                      className="
                        inline-flex
                        rounded-full
                        bg-[var(--primary)]/10
                        px-2.5
                        py-1
                        text-[11px]
                        font-black
                        uppercase
                        tracking-wide
                        text-[var(--primary)]
                      "
                    >
                      {service.category}
                    </span>

                    {service.rating !==
                      undefined && (
                      <div
                        className="
                          flex
                          items-center
                          gap-1
                          text-sm
                          font-bold
                          text-[var(--foreground)]
                        "
                      >
                        <Star
                          aria-hidden="true"
                          className="
                            size-4
                            fill-current
                            text-amber-500
                          "
                        />

                        {service.rating.toFixed(
                          1
                        )}

                        <span
                          className="
                            text-xs
                            font-medium
                            text-[var(--muted)]
                          "
                        >
                          (
                          {
                            service.reviewCount
                          }
                          )
                        </span>
                      </div>
                    )}
                  </div>

                  {/* =======================================
                      CONTENIDO
                  ======================================== */}

                  <div className="p-5">
                    <h3
                      className="
                        line-clamp-2
                        text-lg
                        font-black
                        leading-6
                        text-[var(--foreground)]
                      "
                    >
                      {service.title}
                    </h3>

                    <p
                      className="
                        mt-3
                        line-clamp-3
                        min-h-[4.5rem]
                        text-sm
                        leading-6
                        text-[var(--muted)]
                      "
                    >
                      {
                        service.description
                      }
                    </p>

                    {/* REGIÓN */}

                    <div
                      className="
                        mt-4
                        flex
                        items-center
                        gap-2
                        text-xs
                        font-medium
                        text-[var(--muted)]
                      "
                    >
                      <MapPin
                        aria-hidden="true"
                        className="size-4"
                      />

                      {service.region ===
                      'global'
                        ? 'Disponible globalmente'
                        : service.region}
                    </div>

                    {/* PRECIO */}

                    <div
                      className="
                        mt-5
                        flex
                        items-end
                        justify-between
                        gap-4
                        border-t
                        border-[var(--border)]
                        pt-5
                      "
                    >
                      <div>
                        <p
                          className="
                            text-[10px]
                            font-black
                            uppercase
                            tracking-wider
                            text-[var(--muted)]
                          "
                        >
                          Desde
                        </p>

                        <p
                          className="
                            mt-1
                            text-xl
                            font-black
                            text-[var(--foreground)]
                          "
                        >
                          {formatPrice(
                            service.pricePerUnit,
                            service.currency
                          )}
                        </p>

                        <p
                          className="
                            mt-0.5
                            flex
                            items-center
                            gap-1
                            text-xs
                            text-[var(--muted)]
                          "
                        >
                          <Clock3
                            aria-hidden="true"
                            className="size-3"
                          />

                          /{' '}
                          {formatUnit(
                            service.unitType
                          )}
                        </p>
                      </div>

                      <Link
                        href={`/servicios/${service.id}`}
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-xl
                          bg-[var(--primary)]
                          px-4
                          py-2.5
                          text-sm
                          font-bold
                          text-white
                          shadow-sm
                          transition-all
                          hover:-translate-y-0.5
                          hover:bg-[var(--primary-hover)]
                          hover:shadow-md
                          focus-visible:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-[var(--primary)]
                          focus-visible:ring-offset-2
                        "
                      >
                        Ver servicio

                        <ArrowRight
                          aria-hidden="true"
                          className="size-4"
                        />
                      </Link>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        ) : (
          /* ================================================
             ESTADO SIN RESULTADOS
          ================================================= */

          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-[var(--border)]
              bg-[var(--surface)]
              px-6
              py-16
              text-center
            "
          >
            <div
              className="
                mx-auto
                flex
                size-14
                items-center
                justify-center
                rounded-2xl
                bg-[var(--surface-secondary)]
              "
            >
              <Search
                aria-hidden="true"
                className="
                  size-6
                  text-[var(--muted)]
                "
              />
            </div>

            <h3
              className="
                mt-4
                text-lg
                font-black
                text-[var(--foreground)]
              "
            >
              No encontramos servicios
            </h3>

            <p
              className="
                mx-auto
                mt-2
                max-w-md
                text-sm
                leading-6
                text-[var(--muted)]
              "
            >
              Intenta utilizar otros
              términos de búsqueda o
              seleccionar otra categoría.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedCategory(
                  'Todos'
                );
              }}
              className="
                mt-5
                rounded-xl
                bg-[var(--primary)]
                px-5
                py-2.5
                text-sm
                font-bold
                text-white
                transition-opacity
                hover:opacity-90
              "
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
```
