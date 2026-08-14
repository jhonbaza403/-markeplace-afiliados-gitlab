```tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Download,
  FileText,
  Library,
  Plus,
  Search,
  ShieldCheck,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

/* ==========================================================
   METADATA
========================================================== */

export const metadata: Metadata = {
  title: "Revistas, Libros y Publicaciones | Credi Marketplace",
  description:
    "Descubre revistas científicas, libros, investigaciones y publicaciones académicas nacionales e internacionales en Credi Marketplace.",
};

/* ==========================================================
   TIPOS
========================================================== */

interface Publication {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string | null;
  images: string[] | null;
  slug?: string | null;
  is_active: boolean;
  created_at: string;
}

/* ==========================================================
   CONSTANTES
========================================================== */

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1200&auto=format&fit=crop";

/* ==========================================================
   CONSULTA SUPABASE
========================================================== */

async function getPublications(): Promise<Publication[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
        id,
        title,
        description,
        price,
        category,
        images,
        slug,
        is_active,
        created_at
      `
    )
    .eq("is_active", true)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "[Magazines] Error cargando publicaciones:",
      error.message
    );

    return [];
  }

  return (data ?? []) as Publication[];
}

/* ==========================================================
   FORMATEADOR DE PRECIO
========================================================== */

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

/* ==========================================================
   COMPONENTE PRINCIPAL
========================================================== */

export default async function MagazinesPage() {
  const publications = await getPublications();

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="border-b border-border bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            {/* Badge */}

            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Library
                aria-hidden="true"
                className="size-4"
              />

              Biblioteca Credi
            </div>

            {/* Título */}

            <h1 className="mt-5 text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Revistas, libros y
              <span className="block text-primary">
                publicaciones científicas
              </span>
            </h1>

            {/* Descripción */}

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Explora publicaciones académicas, investigaciones,
              libros especializados y recursos científicos
              disponibles dentro del ecosistema Credi Marketplace.
            </p>

            {/* Acciones */}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products/create"
                className="
                  inline-flex
                  min-h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-primary
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-primary-foreground
                  shadow-lg
                  shadow-primary/10
                  transition-all
                  hover:-translate-y-0.5
                  hover:opacity-90
                "
              >
                <Plus
                  aria-hidden="true"
                  className="size-4"
                />

                Publicar una obra
              </Link>

              <Link
                href="/marketplace"
                className="
                  inline-flex
                  min-h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-border
                  bg-card
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-foreground
                  transition-colors
                  hover:bg-muted
                "
              >
                Explorar Marketplace

                <ArrowRight
                  aria-hidden="true"
                  className="size-4"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENIDO
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* ===================================================
            CABECERA DEL CATÁLOGO
        ==================================================== */}

        <div className="mb-8 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen
                aria-hidden="true"
                className="size-5 text-primary"
              />

              <h2 className="text-2xl font-black tracking-tight">
                Publicaciones disponibles
              </h2>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              {publications.length === 0
                ? "Actualmente no hay publicaciones disponibles."
                : `${publications.length} publicación${
                    publications.length === 1 ? "" : "es"
                  } disponible${
                    publications.length === 1 ? "" : "s"
                  }.`}
            </p>
          </div>

          {/* Buscador visual preparado para futura implementación */}

          <div
            className="
              flex
              min-h-10
              items-center
              gap-2
              rounded-xl
              border
              border-border
              bg-card
              px-3
              text-sm
              text-muted-foreground
            "
          >
            <Search
              aria-hidden="true"
              className="size-4"
            />

            <span>Explorar publicaciones</span>
          </div>
        </div>

        {/* ===================================================
            ESTADO VACÍO
        ==================================================== */}

        {publications.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <BookOpen
                aria-hidden="true"
                className="size-8"
              />
            </div>

            <h2 className="mt-5 text-xl font-black">
              Aún no hay publicaciones
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Cuando se publiquen revistas, libros o recursos
              científicos aparecerán automáticamente en esta
              biblioteca.
            </p>

            <Link
              href="/products/create"
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-primary
                px-5
                py-3
                text-sm
                font-bold
                text-primary-foreground
                transition-opacity
                hover:opacity-90
              "
            >
              <Plus
                aria-hidden="true"
                className="size-4"
              />

              Publicar primera obra
            </Link>
          </div>
        ) : (
          /* =================================================
             CATÁLOGO
          ================================================== */

          <div
            className="
              grid
              grid-cols-1
              gap-6
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            "
          >
            {publications.map((publication) => {
              const image =
                publication.images?.[0] ||
                FALLBACK_IMAGE;

              const detailHref = publication.slug
                ? `/marketplace/products/${publication.slug}`
                : `/products/detail?id=${publication.id}`;

              return (
                <article
                  key={publication.id}
                  className="
                    group
                    flex
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    border
                    border-border
                    bg-card
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-xl
                  "
                >
                  {/* =================================================
                      PORTADA
                  ================================================== */}

                  <Link
                    href={detailHref}
                    className="relative block aspect-[4/5] overflow-hidden bg-muted"
                    aria-label={`Ver ${publication.title}`}
                  >
                    {/* Imagen usando background para evitar
                        dependencia de configuración remota
                        de next/image. */}

                    <div
                      className="
                        absolute
                        inset-0
                        bg-cover
                        bg-center
                        transition-transform
                        duration-500
                        group-hover:scale-105
                      "
                      style={{
                        backgroundImage: `url("${image}")`,
                      }}
                      role="img"
                      aria-label={`Portada de ${publication.title}`}
                    />

                    {/* Overlay */}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Badge */}

                    <div className="absolute left-4 top-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                        <FileText
                          aria-hidden="true"
                          className="size-3"
                        />

                        Publicación
                      </span>
                    </div>

                    {/* Indicador */}

                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-xs font-medium text-white/80">
                        Recurso académico
                      </p>
                    </div>
                  </Link>

                  {/* =================================================
                      INFORMACIÓN
                  ================================================== */}

                  <div className="flex flex-1 flex-col p-5">
                    {/* Categoría */}

                    {publication.category && (
                      <span className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">
                        {publication.category}
                      </span>
                    )}

                    {/* Título */}

                    <h3 className="mt-2 line-clamp-2 text-lg font-black leading-6 text-foreground">
                      {publication.title}
                    </h3>

                    {/* Descripción */}

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {publication.description ||
                        "Información editorial no disponible."}
                    </p>

                    {/* =================================================
                        PRECIO
                    ================================================== */}

                    <div className="mt-auto pt-6">
                      <div className="mb-4 flex items-end justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            Precio
                          </p>

                          <p className="mt-1 text-2xl font-black text-foreground">
                            {formatPrice(
                              publication.price
                            )}
                          </p>
                        </div>

                        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Download
                            aria-hidden="true"
                            className="size-4"
                          />
                        </div>
                      </div>

                      {/* Acción */}

                      <Link
                        href={detailHref}
                        className="
                          inline-flex
                          min-h-11
                          w-full
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          bg-primary
                          px-4
                          py-2.5
                          text-sm
                          font-bold
                          text-primary-foreground
                          shadow-sm
                          transition-all
                          hover:-translate-y-0.5
                          hover:opacity-90
                        "
                      >
                        Ver publicación

                        <ArrowRight
                          aria-hidden="true"
                          className="size-4"
                        />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* =====================================================
            CONFIANZA
        ====================================================== */}

        <div className="mt-12 grid grid-cols-1 gap-4 border-t border-border pt-8 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck
                aria-hidden="true"
                className="size-5"
              />
            </div>

            <h3 className="mt-4 text-sm font-black">
              Ecosistema seguro
            </h3>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Publicaciones gestionadas dentro de la
              plataforma Credi Marketplace.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BookOpen
                aria-hidden="true"
                className="size-5"
              />
            </div>

            <h3 className="mt-4 text-sm font-black">
              Contenido especializado
            </h3>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Accede a material académico, científico y
              profesional.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Download
                aria-hidden="true"
                className="size-5"
              />
            </div>

            <h3 className="mt-4 text-sm font-black">
              Recursos digitales
            </h3>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Preparado para integrar posteriormente el
              sistema de entrega y descarga digital.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
```
