```tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

interface Product {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  price: number;
  stock: number;
  images: string[] | null;
  is_active: boolean;
  created_at: string;
}

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface ProductImageProps {
  src: string;
  alt: string;
}

/* ==========================================================
   CONFIGURACIÓN
========================================================== */

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop";

/* ==========================================================
   UTILIDADES
========================================================== */

function normalizeSlug(value: string): string {
  return decodeURIComponent(value).trim().toLowerCase();
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

function getProductImage(product: Product): ProductImageProps {
  const image =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : FALLBACK_IMAGE;

  return {
    src: image,
    alt: `Imagen de ${product.title}`,
  };
}

/* ==========================================================
   CONSULTA DEL PRODUCTO
========================================================== */

async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const supabase = await createClient();

  const normalizedSlug = normalizeSlug(slug);

  const { data, error } = await supabase
    .from("products")
    .select(
      `
        id,
        slug,
        title,
        description,
        price,
        stock,
        images,
        is_active,
        created_at
      `
    )
    .eq("slug", normalizedSlug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error(
      "[Marketplace] Error obteniendo producto:",
      error.message
    );

    return null;
  }

  return data as Product | null;
}

/* ==========================================================
   SEO DINÁMICO
========================================================== */

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Producto no encontrado | Credi Marketplace",
      description:
        "El producto solicitado no está disponible en Credi Marketplace.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description =
    product.description?.trim() ||
    `Descubre ${product.title} en Credi Marketplace. Consulta precio, disponibilidad y detalles del producto.`;

  return {
    title: `${product.title} | Credi Marketplace`,
    description: description.slice(0, 160),

    openGraph: {
      title: `${product.title} | Credi Marketplace`,
      description: description.slice(0, 160),
      type: "website",
      images:
        product.images && product.images.length > 0
          ? [
              {
                url: product.images[0],
                alt: product.title,
              },
            ]
          : undefined,
    },

    twitter: {
      card: "summary_large_image",
      title: `${product.title} | Credi Marketplace`,
      description: description.slice(0, 160),
      images:
        product.images && product.images.length > 0
          ? [product.images[0]]
          : undefined,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

/* ==========================================================
   PÁGINA DEL PRODUCTO
========================================================== */

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const productImage = getProductImage(product);

  const isAvailable = product.stock > 0;

  const formattedPrice = formatPrice(product.price);

  /* ========================================================
     DATOS ESTRUCTURADOS SEO
  ======================================================== */

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description:
      product.description ||
      `Producto disponible en Credi Marketplace.`,
    image:
      product.images && product.images.length > 0
        ? product.images
        : [FALLBACK_IMAGE],

    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price,
      availability: isAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `https://credimarketplace.com/marketplace/products/${product.slug}`,
    },
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* =====================================================
          DATOS ESTRUCTURADOS
      ====================================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* =====================================================
          CONTENEDOR PRINCIPAL
      ====================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* ===================================================
            BREADCRUMB
        ==================================================== */}

        <nav
          aria-label="Breadcrumb"
          className="mb-8"
        >
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link
                href="/"
                className="transition-colors hover:text-foreground"
              >
                Inicio
              </Link>
            </li>

            <li aria-hidden="true">/</li>

            <li>
              <Link
                href="/marketplace"
                className="transition-colors hover:text-foreground"
              >
                Marketplace
              </Link>
            </li>

            <li aria-hidden="true">/</li>

            <li
              className="max-w-[220px] truncate font-medium text-foreground"
              aria-current="page"
            >
              {product.title}
            </li>
          </ol>
        </nav>

        {/* ===================================================
            PRODUCTO
        ==================================================== */}

        <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* =================================================
                IMAGEN
            ================================================== */}

            <div className="relative min-h-[420px] bg-muted sm:min-h-[520px]">
              <Image
                src={productImage.src}
                alt={productImage.alt}
                fill
                priority
                sizes="
                  (max-width: 640px) 100vw,
                  (max-width: 1024px) 50vw,
                  50vw
                "
                className="object-cover"
              />

              {/* Estado */}

              <div className="absolute left-5 top-5">
                <span
                  className={`
                    inline-flex
                    items-center
                    rounded-full
                    border
                    px-3
                    py-1.5
                    text-xs
                    font-bold
                    shadow-sm
                    backdrop-blur-md
                    ${
                      isAvailable
                        ? "border-emerald-200 bg-emerald-50/95 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/90 dark:text-emerald-300"
                        : "border-red-200 bg-red-50/95 text-red-700 dark:border-red-900 dark:bg-red-950/90 dark:text-red-300"
                    }
                  `}
                >
                  <span
                    className={`mr-2 size-2 rounded-full ${
                      isAvailable
                        ? "bg-emerald-500"
                        : "bg-red-500"
                    }`}
                  />

                  {isAvailable
                    ? "Disponible"
                    : "Agotado"}
                </span>
              </div>
            </div>

            {/* =================================================
                INFORMACIÓN
            ================================================== */}

            <div className="flex flex-col p-6 sm:p-8 lg:p-10">
              <div className="flex-1">
                {/* Categoría */}

                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                  Producto verificado
                </span>

                {/* Título */}

                <h1 className="mt-5 text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                  {product.title}
                </h1>

                {/* Precio */}

                <div className="mt-6">
                  <p className="text-sm font-medium text-muted-foreground">
                    Precio
                  </p>

                  <p className="mt-1 text-4xl font-black tracking-tight text-primary sm:text-5xl">
                    {formattedPrice}
                  </p>
                </div>

                {/* Descripción */}

                <div className="mt-8">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Descripción
                  </h2>

                  <p className="mt-3 whitespace-pre-line text-base leading-7 text-muted-foreground">
                    {product.description ||
                      "Este producto no tiene una descripción disponible."}
                  </p>
                </div>

                {/* =================================================
                    DISPONIBILIDAD
                ================================================== */}

                <div className="mt-8 rounded-2xl border border-border bg-muted/40 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Disponibilidad
                      </p>

                      <p className="mt-1 text-sm font-bold text-foreground">
                        {isAvailable
                          ? `${product.stock} unidades disponibles`
                          : "Producto agotado"}
                      </p>
                    </div>

                    <div
                      className={`
                        rounded-xl px-3 py-2 text-xs font-bold
                        ${
                          isAvailable
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-red-500/10 text-red-600"
                        }
                      `}
                    >
                      {isAvailable
                        ? "EN STOCK"
                        : "SIN STOCK"}
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================
                  ACCIONES
              ================================================== */}

              <div className="mt-10 border-t border-border pt-6">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Link
                    href={
                      isAvailable
                        ? `/checkout?product_id=${product.id}`
                        : "#"
                    }
                    aria-disabled={!isAvailable}
                    className={`
                      inline-flex
                      min-h-12
                      items-center
                      justify-center
                      rounded-xl
                      px-5
                      py-3
                      text-sm
                      font-bold
                      shadow-sm
                      transition-all
                      ${
                        isAvailable
                          ? "bg-primary text-primary-foreground hover:-translate-y-0.5 hover:opacity-90"
                          : "pointer-events-none cursor-not-allowed bg-muted text-muted-foreground"
                      }
                    `}
                  >
                    {isAvailable
                      ? "Comprar ahora"
                      : "Producto agotado"}
                  </Link>

                  <Link
                    href="/marketplace"
                    className="
                      inline-flex
                      min-h-12
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-border
                      bg-background
                      px-5
                      py-3
                      text-sm
                      font-bold
                      text-foreground
                      transition-colors
                      hover:bg-muted
                    "
                  >
                    Seguir comprando
                  </Link>
                </div>

                <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
                  Compra de forma segura a través de
                  Credi Marketplace.
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* =====================================================
            INFORMACIÓN ADICIONAL
        ====================================================== */}

        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm font-bold text-foreground">
              Compra segura
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Procesamiento de compra integrado con la
              plataforma.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm font-bold text-foreground">
              Vendedores verificados
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Productos publicados dentro del ecosistema
              Credi Marketplace.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm font-bold text-foreground">
              Marketplace global
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Descubre productos y oportunidades de
              diferentes regiones.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
```
