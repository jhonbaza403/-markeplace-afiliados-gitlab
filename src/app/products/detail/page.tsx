import type { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export const revalidate = 60;

interface Props {
  searchParams: Promise<{ id?: string; ref?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { id } = await searchParams;
  if (!id) return { title: "Producto no encontrado" };

  const { data: product } = await supabase
    .from("products")
    .select("title, description")
    .eq("id", id)
    .single();

  return {
    title: product ? `${product.title} | Credi Marketplace` : "Producto no encontrado",
    description: product?.description || "Detalle del producto en Credi Marketplace",
  };
}

export default async function ProductDetailPage({ searchParams }: Props) {
  const { id, ref } = await searchParams;

  if (!id) {
    notFound();
  }

  // Obtener la información del producto en el servidor
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Navegación y Referidor */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/products"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; Volver al Catálogo
          </Link>
          {ref && (
            <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full border border-emerald-500/20">
              Referido por: {ref}
            </span>
          )}
        </div>

        {/* Tarjeta de Detalle del Producto */}
        <div className="rounded-3xl bg-card border border-border p-6 sm:p-10 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Contenedor de Imagen */}
          <div className="aspect-square bg-muted rounded-2xl overflow-hidden flex items-center justify-center border border-border">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-medium text-muted-foreground">
                Sin imagen disponible
              </span>
            )}
          </div>

          {/* Información y Compra */}
          <div className="flex flex-col justify-between h-full space-y-6">
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                {product.title}
              </h1>
              <p className="text-2xl font-extrabold text-primary">
                ${typeof product.price === "number" ? product.price.toFixed(2) : "0.00"}
              </p>
              <div className="pt-2">
                <span className="text-xs font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
                  Stock disponible: {product.stock ?? 0} unidades
                </span>
              </div>
              <div className="pt-4 border-t border-border">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Descripción
                </h3>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                  {product.description || "Sin descripción proporcionada para este producto."}
                </p>
              </div>
            </div>

            {/* Acciones de Compra */}
            <div className="pt-6 border-t border-border space-y-3">
              <Link
                href={`/checkout?product_id=${product.id}${ref ? `&ref=${ref}` : ""}`}
                className="block w-full text-center rounded-xl bg-primary text-primary-foreground py-3.5 text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
              >
                Comprar Ahora
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}