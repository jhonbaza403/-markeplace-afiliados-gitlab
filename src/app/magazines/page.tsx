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
   FORMATEADOR
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
   COMPONENTE
========================================================== */

export default async function MagazinesPage() {
  const publications = await getPublications();

  return (
    <main className="min-h-screen bg-background text-foreground">

      <section className="border-b border-border bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">

          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">

              <Library
                aria-hidden="true"
                className="size-4"
              />

              Biblioteca Credi

            </div>


            <h1 className="mt-5 text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">

              Revistas, libros y

              <span className="block text-primary">
                publicaciones científicas
              </span>

            </h1>


            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">

              Explora publicaciones académicas, investigaciones,
              libros especializados y recursos científicos
              disponibles dentro del ecosistema Credi Marketplace.

            </p>


            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <Link
                href="/products/create"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg transition hover:opacity-90"
              >

                <Plus
                  aria-hidden="true"
                  className="size-4"
                />

                Publicar una obra

              </Link>


              <Link
                href="/marketplace"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold text-foreground transition hover:bg-muted"
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
