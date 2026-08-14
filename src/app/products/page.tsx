```tsx
import type { Metadata } from 'next';
import Link from 'next/link';

import { Package, ShoppingBag, Store } from 'lucide-react';

import { supabase } from '@/lib/supabase/client';
import AffiliateCopyButton from '@/components/AffiliateCopyButton';

// ==========================================================
// ARCHIVO: src/app/products/page.tsx
// Credi Marketplace
//
// Catálogo público de productos.
//
// RESPONSABILIDADES:
// - Obtener productos activos.
// - Mostrar catálogo responsive.
// - Presentar precio y disponibilidad.
// - Permitir acceder al detalle.
// - Generar enlace de afiliado.
// - Mantener una experiencia premium.
//
// ARQUITECTURA:
// - Server Component.
// - Supabase mediante cliente público.
// - Sin SERVICE_ROLE_KEY.
// - La seguridad real depende de RLS.
// ==========================================================

export const metadata: Metadata = {
  title: 'Productos | Credi Marketplace',
  description:
    'Explora productos disponibles en Credi Marketplace, descubre oportunidades comerciales y comparte productos mediante enlaces de afiliado.',
};

export const revalidate = 60;

// ==========================================================
// TIPOS
// ==========================================================

interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  stock: number;
  store_id: string;
}

// ==========================================================
// OBTENER PRODUCTOS
// ==========================================================

async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(
        `
          id,
          title,
          description,
          price,
          stock,
          store_id
        `
      )
      .eq('is_active', true)
      .order('created_at', {
        ascending: false,
      });

    if (error) {
      console.error(
        '[ProductsPage] Error obteniendo productos:',
        error
      );

      return [];
    }

    return (data ?? []) as Product[];
  } catch (error) {
    console.error(
      '[ProductsPage] Error inesperado:',
      error
    );

    return [];
  }
}

// ==========================================================
// FORMATEAR PRECIO
// ==========================================================

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

// ==========================================================
// PÁGINA
// ==========================================================

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main
      className="
        min-h-screen
        bg-[var(--background)]
        text-[var(--foreground)]
      "
    >
      {/* ==================================================
          CABECERA
      ================================================== */}

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
            sm:py-12
            lg:py-14
          "
        >
          <div
            className="
              flex
              flex-col
              gap-6
              lg:flex-row
              lg:items-end
              lg:justify-between
            "
          >
            {/* INTRODUCCIÓN */}

            <div className="max-w-3xl">
              <div
                className="
                  mb-4
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[var(--primary)]/15
                  bg-[var(--primary)]/8
                  px-3
                  py-1.5
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.14em]
                  text-[var(--primary)]
                "
              >
                <Package
                  aria-hidden="true"
                  className="size-3.5"
                />

                Marketplace
              </div>

              <h1
                className="
                  text-3xl
                  font-black
                  tracking-tight
                  sm:text-4xl
                  lg:text-5xl
                "
              >
                Catálogo de{' '}
                <span
                  className="
                    bg-linear-to-r
                    from-brand-600
                    to-cyan-500
                    bg-clip-text
                    text-transparent
                  "
                >
                  productos
                </span>
              </h1>

              <p
                className="
                  mt-4
                  max-w-2xl
                  text-sm
                  leading-6
                  text-[var(--muted)]
                  sm:text-base
                  sm:leading-7
                "
              >
                Descubre productos disponibles,
                encuentra oportunidades comerciales
                y comparte artículos mediante el
                programa de afiliados.
              </p>
            </div>

            {/* ACCIÓN AFILIADOS */}

            <Link
              href="/dashboard/affiliate"
              className="
                inline-flex
                min-h-11
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-emerald-600
                px-5
                py-3
                text-sm
                font-bold
                text-white
                shadow-lg
                shadow-emerald-900/10
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-emerald-700
                hover:shadow-xl
                focus-visible:outline-none
                focus-visible:ring-4
                focus-visible:ring-emerald-500/20
              "
            >
              <ShoppingBag
                aria-hidden="true"
                className="size-4"
              />

              Panel de Afiliado
            </Link>
          </div>
        </div>
      </section>

      {/* ==================================================
          CATÁLOGO
      ================================================== */}

      <section
        className="
          container-marketplace
          py-8
          sm:py-10
          lg:py-12
        "
        aria-label="Catálogo de productos"
      >
        {/* CONTADOR */}

        {products.length > 0 && (
          <div
            className="
              mb-6
              flex
              items-center
              justify-between
              gap-4
            "
          >
            <p
              className="
                text-sm
                font-semibold
                text-[var(--muted)]
              "
            >
              {products.length}{' '}
              {products.length === 1
                ? 'producto disponible'
                : 'productos disponibles'}
            </p>
          </div>
        )}

        {/* =================================================
            ESTADO VACÍO
        ================================================= */}

        {products.length === 0 ? (
          <div
            className="
              flex
              min-h-80
              flex-col
              items-center
              justify-center
              rounded-3xl
              border
              border-dashed
              border-[var(--border)]
              bg-[var(--surface)]
              px-6
              py-12
              text-center
            "
          >
            <div
              className="
                flex
                size-16
                items-center
                justify-center
                rounded-2xl
                bg-[var(--primary)]/10
                text-[var(--primary)]
              "
            >
              <Package
                aria-hidden="true"
                className="size-7"
              />
            </div>

            <h2
              className="
                mt-5
                text-xl
                font-black
              "
            >
              No hay productos disponibles
            </h2>

            <p
              className="
                mt-2
                max-w-md
                text-sm
                leading-6
                text-[var(--muted)]
              "
            >
              En este momento no existen productos
              activos publicados en el marketplace.
              Vuelve a consultar próximamente.
            </p>

            <Link
              href="/"
              className="
                mt-6
                inline-flex
                items-center
                rounded-xl
                border
                border-[var(--border)]
                bg-[var(--surface)]
                px-4
                py-2.5
                text-sm
                font-bold
                transition-colors
                hover:bg-[var(--surface-secondary)]
              "
            >
              Volver al inicio
            </Link>
          </div>
        ) : (
          /* =================================================
             GRID
          ================================================= */

          <div
            className="
              grid
              grid-cols-1
              gap-5
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            "
          >
            {products.map((product) => {
              const affiliatePath =
                `/products/detail?id=${encodeURIComponent(
                  product.id
                )}&ref=afiliado`;

              const stock =
                Number.isFinite(product.stock)
                  ? Math.max(0, product.stock)
                  : 0;

              const price =
                Number.isFinite(product.price)
                  ? product.price
                  : 0;

              const isAvailable = stock > 0;

              return (
                <article
                  key={product.id}
                  className="
                    group
                    flex
                    min-w-0
                    flex-col
                    overflow-hidden
                    rounded-3xl
                    border
                    border-[var(--border)]
                    bg-[var(--surface)]
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-[0_20px_50px_rgba(0,0,0,0.10)]
                  "
                >
                  {/* ========================================
                      ÁREA VISUAL
                  ======================================== */}

                  <div
                    className="
                      relative
                      flex
                      h-44
                      items-center
                      justify-center
                      overflow-hidden
                      bg-[var(--surface-secondary)]
                    "
                  >
                    <div
                      aria-hidden="true"
                      className="
                        absolute
                        inset-0
                        bg-linear-to-br
                        from-[var(--primary)]/8
                        via-transparent
                        to-cyan-500/8
                      "
                    />

                    <div
                      className="
                        relative
                        flex
                        size-16
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-[var(--border)]
                        bg-[var(--surface)]
                        text-[var(--primary)]
                        shadow-sm
                        transition-transform
                        duration-300
                        group-hover:scale-105
                      "
                    >
                      <Package
                        aria-hidden="true"
                        className="size-7"
                      />
                    </div>

                    {/* ESTADO */}

                    <span
                      className={`
                        absolute
                        right-3
                        top-3
                        rounded-full
                        px-2.5
                        py-1
                        text-[10px]
                        font-black
                        uppercase
                        tracking-wider
                        ${
                          isAvailable
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                            : 'bg-red-500/10 text-red-700 dark:text-red-300'
                        }
                      `}
                    >
                      {isAvailable
                        ? 'Disponible'
                        : 'Agotado'}
                    </span>
                  </div>

                  {/* ========================================
                      CONTENIDO
                  ======================================== */}

                  <div
                    className="
                      flex
                      flex-1
                      flex-col
                      p-5
                    "
                  >
                    <div className="flex-1">
                      <h2
                        className="
                          line-clamp-2
                          text-lg
                          font-black
                          leading-6
                          text-[var(--foreground)]
                        "
                        title={product.title}
                      >
                        {product.title}
                      </h2>

                      <p
                        className="
                          mt-2
                          line-clamp-3
                          min-h-[4.5rem]
                          text-sm
                          leading-6
                          text-[var(--muted)]
                        "
                      >
                        {product.description?.trim() ||
                          'Este producto no dispone de una descripción.'}
                      </p>
                    </div>

                    {/* ======================================
                        PRECIO / STOCK
                    ====================================== */}

                    <div
                      className="
                        mt-5
                        flex
                        items-end
                        justify-between
                        gap-3
                        border-t
                        border-[var(--border)]
                        pt-4
                      "
                    >
                      <div>
                        <p
                          className="
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-[var(--muted)]
                          "
                        >
                          Precio
                        </p>

                        <p
                          className="
                            mt-1
                            text-2xl
                            font-black
                            tracking-tight
                            text-[var(--primary)]
                          "
                        >
                          {formatPrice(price)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p
                          className="
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-[var(--muted)]
                          "
                        >
                          Stock
                        </p>

                        <p
                          className="
                            mt-1
                            text-sm
                            font-bold
                            text-[var(--foreground)]
                          "
                        >
                          {stock}
                        </p>
                      </div>
                    </div>

                    {/* ======================================
                        AFILIACIÓN
                    ====================================== */}

                    <div className="mt-5">
                      <div className="mb-2 flex items-center gap-2">
                        <Store
                          aria-hidden="true"
                          className="
                            size-3.5
                            text-emerald-600
                          "
                        />

                        <span
                          className="
                            text-[10px]
                            font-black
                            uppercase
                            tracking-[0.12em]
                            text-[var(--muted)]
                          "
                        >
                          Enlace de afiliado
                        </span>
                      </div>

                      <AffiliateCopyButton
                        affiliatePath={affiliatePath}
                      />
                    </div>

                    {/* ======================================
                        DETALLE
                    ====================================== */}

                    <Link
                      href={affiliatePath}
                      aria-label={`Ver detalle de ${product.title}`}
                      className="
                        mt-3
                        inline-flex
                        min-h-11
                        w-full
                        items-center
                        justify-center
                        rounded-xl
                        bg-[var(--primary)]
                        px-4
                        py-2.5
                        text-sm
                        font-black
                        text-white
                        shadow-md
                        shadow-blue-900/10
                        transition-all
                        duration-200
                        hover:-translate-y-0.5
                        hover:bg-[var(--primary-hover)]
                        hover:shadow-lg
                        focus-visible:outline-none
                        focus-visible:ring-4
                        focus-visible:ring-[var(--primary)]/20
                      "
                    >
                      Ver producto
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
```
