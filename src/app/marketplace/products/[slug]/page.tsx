import type { Metadata } from "next";
import React from "react";
import Link from "next/link";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

// 1. Generación de Metadatos Dinámicos (SEO) para Next.js 15
export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const formattedTitle = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return {
    title: formattedTitle,
    description: `Detalles, especificaciones y compra de ${formattedTitle} en Credi Marketplace.`,
  };
}

// 2. Definición de Parámetros Estáticos para Pre-renderizado
export async function generateStaticParams() {
  return [
    { slug: "smartphone-ultima-generacion" },
    { slug: "laptop-profesional-ultradelgada" },
  ];
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  // 3. Resolución asíncrona obligatoria de `params` en Next.js 15
  const { slug } = await params;

  const formattedTitle = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navegación de regreso */}
        <nav className="mb-6">
          <Link
            href="/marketplace"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
          >
            ← Volver al Marketplace
          </Link>
        </nav>

        <article className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm overflow-hidden p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contenedor de Imagen */}
            <div className="h-80 bg-muted rounded-xl flex items-center justify-center text-muted-foreground font-medium">
              Imagen del producto
            </div>

            {/* Información del Producto */}
            <div className="flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Detalle del Producto
                </span>
                <h1 className="text-3xl font-extrabold text-foreground mt-2">
                  {formattedTitle}
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  Slug: <code className="bg-muted px-1.5 py-0.5 rounded font-mono">{slug}</code>
                </p>
                <p className="text-2xl font-bold text-foreground mt-4">
                  $0.00
                </p>
                <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                  Esta es la vista dinámica preparada para mostrar las especificaciones detalladas, la descripción del vendedor y el botón de compra o adición al carrito.
                </p>
              </div>

              {/* Acciones */}
              <div className="mt-8 flex gap-4">
                <button className="flex-1 bg-primary text-primary-foreground font-medium py-3 px-6 rounded-xl hover:opacity-90 transition-opacity">
                  Agregar al Carrito
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}