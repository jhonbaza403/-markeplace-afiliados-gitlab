import type { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Catálogo de Productos",
  description: "Explora nuestro catálogo de productos disponibles para afiliarte y comercializar.",
};

// Revalidación opcional para Cloudflare Edge (ej. revalidar cada 60 segundos)
export const revalidate = 60;

interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  stock: number;
  store_id: string;
}

async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true);

    if (error) {
      console.error("Error consultando productos en Supabase:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error al cargar productos:", error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Cabecera del Catálogo */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Catálogo de Productos
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Selecciona productos para promocionar y obtener comisiones como afiliado.
            </p>
          </div>
          <Link
            href="/dashboard/affiliate"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Ver Panel de Afiliado
          </Link>
        </div>

        {/* Estado Vacío */}
        {products.length === 0 ? (
          <div className="bg-card text-card-foreground rounded-2xl p-12 text-center border border-border shadow-sm">
            <p className="text-muted-foreground text-base">
              No hay productos activos disponibles en este momento.
            </p>
          </div>
        ) : (
          /* Rejilla de Productos */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-2xl bg-card text-card-foreground p-5 border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div>
                  <h3 className="text-lg font-bold text-foreground line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {product.description || "Sin descripción disponible"}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-extrabold text-primary">
                      ${typeof product.price === "number" ? product.price.toFixed(2) : "0.00"}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                      Stock: {product.stock ?? 0}
                    </span>
                  </div>

                  <Link
                    href={`/products/detail?id=${product.id}`}
                    className="block w-full rounded-xl bg-primary text-primary-foreground py-2.5 text-center text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
                  >
                    Ver Detalle y Afiliarme
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}