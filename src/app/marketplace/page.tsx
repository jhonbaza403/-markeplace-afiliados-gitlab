import type { Metadata } from "next";
import React from "react";
import { ProductCard } from "@/features/marketplace/components/ProductCard";
import { Product } from "@/types/product";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Catálogo de Productos",
  description: "Explora una amplia variedad de productos y servicios de nuestros vendedores verificados.",
};

export default async function MarketplacePage() {
  const supabase = await createClient();

  // Consultar productos activos directamente desde Supabase
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al cargar productos desde Supabase:", error.message);
  }

  const productList: Product[] = products || [];

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Credi Marketplace
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Explora una amplia variedad de productos y servicios de nuestros vendedores verificados.
          </p>
        </header>

        <section aria-label="Listado de Productos">
          {productList.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-dashed border-border">
              <p className="text-muted-foreground text-sm">
                No hay productos disponibles en este momento.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productList.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}