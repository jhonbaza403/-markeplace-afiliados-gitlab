'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import B2BCheckoutModal from '../B2BCheckoutModal';

/**
 * ==========================================================
 * B2B MARKETPLACE
 * ==========================================================
 *
 * Responsabilidades:
 * - Renderizar el catálogo B2B.
 * - Mostrar información comercial.
 * - Calcular descuentos de forma segura.
 * - Permitir seleccionar un producto.
 * - Abrir el flujo de checkout B2B.
 *
 * NO debe:
 * - Procesar pagos.
 * - Verificar transacciones.
 * - Insertar órdenes en Supabase.
 * - Contener credenciales sensibles.
 *
 * Esas responsabilidades pertenecen a capas especializadas.
 * ==========================================================
 */

export interface B2BProductItem {
  id: string;
  title: string;
  category: string;

  /**
   * Identificador real del proveedor.
   *
   * No debe confundirse con supplierName.
   */
  supplierId: string;

  supplierName: string;

  wholesalePriceUSD: number;
  regularPriceUSD: number;

  minOrderQuantity: number;
  stockAvailable: number;

  imageUrl: string;

  /**
   * Información utilizada únicamente para iniciar
   * el flujo de pago.
   *
   * La autorización real debe estar protegida
   * mediante RLS / backend.
   */
  binancePayId: string;
  usdtWalletAddress: string;

  description?: string;

  /**
   * Permite controlar la disponibilidad comercial
   * sin depender únicamente del stock.
   */
  status?: 'active' | 'inactive' | 'out_of_stock';
}

interface B2BMarketplaceProps {
  products?: B2BProductItem[];
  loading?: boolean;
  error?: string | null;
}

/**
 * Productos de demostración.
 *
 * IMPORTANTE:
 * En producción estos datos deben provenir de Supabase/API.
 */
const DEMO_PRODUCTS: B2BProductItem[] = [
  {
    id: 'b2b-1',
    title: 'Lote de 50 Auriculares Bluetooth TWS i12',
    category: 'Electrónica',
    supplierId: 'demo-supplier-tech-global',
    supplierName: 'Importadora Tech Global C.A.',
    wholesalePriceUSD: 3.5,
    regularPriceUSD: 8,
    minOrderQuantity: 10,
    stockAvailable: 500,
    imageUrl:
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=900&q=85',
    binancePayId: '218391029',
    usdtWalletAddress: 'TYDx129381092830192830192830',
    description:
      'Auriculares Bluetooth para distribución mayorista y comercio minorista.',
    status: 'active',
  },
  {
    id: 'b2b-2',
    title: 'Caja x24 Revistas Científicas de Inteligencia Artificial',
    category: 'Educación & Publicaciones',
    supplierId: 'demo-supplier-academic',
    supplierName: 'Editorial Académica Internacional',
    wholesalePriceUSD: 12,
    regularPriceUSD: 25,
    minOrderQuantity: 5,
    stockAvailable: 120,
    imageUrl:
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=900&q=85',
    binancePayId: '218391029',
    usdtWalletAddress: 'TYDx129381092830192830192830',
    description:
      'Colección académica especializada para instituciones, librerías y distribuidores.',
    status: 'active',
  },
];

/**
 * Formatea una cantidad monetaria de manera consistente.
 */
function formatUSD(value: number): string {
  if (!Number.isFinite(value)) {
    return '$0.00';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Calcula el descuento evitando divisiones inválidas.
 */
function calculateDiscount(
  regularPrice: number,
  wholesalePrice: number,
): number {
  if (
    !Number.isFinite(regularPrice) ||
    !Number.isFinite(wholesalePrice) ||
    regularPrice <= 0 ||
    wholesalePrice < 0 ||
    wholesalePrice >= regularPrice
  ) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(
      0,
      Math.round(
        ((regularPrice - wholesalePrice) / regularPrice) * 100,
      ),
    ),
  );
}

/**
 * Determina si un producto puede recibir órdenes.
 */
function isProductAvailable(product: B2BProductItem): boolean {
  return (
    product.status !== 'inactive' &&
    product.status !== 'out_of_stock' &&
    product.stockAvailable > 0 &&
    product.minOrderQuantity > 0 &&
    product.wholesalePriceUSD >= 0
  );
}

export default function B2BMarketplace({
  products,
  loading = false,
  error = null,
}: B2BMarketplaceProps) {
  const [selectedProduct, setSelectedProduct] =
    useState<B2BProductItem | null>(null);

  /**
   * Fuente temporal de datos.
   *
   * Posteriormente:
   *
   * <B2BMarketplace products={productsFromSupabase} />
   *
   * sin modificar el componente.
   */
  const marketplaceProducts = useMemo(
    () => products ?? DEMO_PRODUCTS,
    [products],
  );

  const availableProducts = useMemo(
    () =>
      marketplaceProducts.filter(isProductAvailable),
    [marketplaceProducts],
  );

  return (
    <section
      id="b2b-marketplace"
      aria-labelledby="b2b-marketplace-title"
      className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
    >
      {/* =====================================================
          HERO B2B
          ===================================================== */}

      <header className="relative mb-10 overflow-hidden rounded-[2rem] border border-amber-400/20 bg-gradient-to-br from-amber-500 via-amber-500 to-yellow-600 p-6 text-slate-950 shadow-2xl sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-orange-900/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-slate-950/20 bg-slate-950/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]">
              Mercado Mayorista · B2B
            </span>

            <h1
              id="b2b-marketplace-title"
              className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl"
            >
              Compra al mayor directamente de proveedores
              e importadores
            </h1>

            <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-slate-950/75 sm:text-base">
              Accede a precios especiales por volumen, consulta
              cantidades mínimas de pedido y gestiona operaciones
              comerciales desde un entorno diseñado para compradores
              profesionales.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-xl border border-slate-950/10 bg-white/20 px-3 py-2 text-xs font-bold">
                ✓ Precios mayoristas
              </span>

              <span className="rounded-xl border border-slate-950/10 bg-white/20 px-3 py-2 text-xs font-bold">
                ✓ MOQ definido
              </span>

              <span className="rounded-xl border border-slate-950/10 bg-white/20 px-3 py-2 text-xs font-bold">
                ✓ Control de inventario
              </span>
            </div>
          </div>

          <div className="relative shrink-0 rounded-2xl border border-slate-950/10 bg-slate-950/10 p-5 text-center backdrop-blur-md lg:min-w-[250px]">
            <div
              className="mx-auto mb-2 text-3xl"
              aria-hidden="true"
            >
              ⚡
            </div>

            <p className="text-[10px] font-black uppercase tracking-widest">
              Métodos disponibles
            </p>

            <p className="mt-1 text-lg font-black">
              Binance Pay / USDT
            </p>

            <p className="mt-2 text-[11px] font-medium text-slate-950/70">
              La operación queda pendiente de verificación hasta
              confirmar el pago.
            </p>
          </div>
        </div>
      </header>

      {/* =====================================================
          ESTADOS
          ===================================================== */}

      {loading && (
        <div
          role="status"
          aria-live="polite"
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="h-52 bg-muted" />

              <div className="space-y-4 p-5">
                <div className="h-3 w-1/3 rounded bg-muted" />
                <div className="h-5 w-4/5 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-12 rounded-xl bg-muted" />
                <div className="h-12 rounded-xl bg-muted" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div
          role="alert"
          className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center"
        >
          <div className="text-3xl" aria-hidden="true">
            ⚠️
          </div>

          <h2 className="mt-2 font-bold text-foreground">
            No pudimos cargar el mercado mayorista
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {error}
          </p>
        </div>
      )}

      {!loading &&
        !error &&
        availableProducts.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <div className="text-4xl" aria-hidden="true">
              📦
            </div>

            <h2 className="mt-3 text-lg font-bold text-foreground">
              No hay ofertas mayoristas disponibles
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Actualmente no existen productos con inventario
              disponible para pedidos B2B.
            </p>
          </div>
        )}

      {/* =====================================================
          CATÁLOGO
          ===================================================== */}

      {!loading &&
        !error &&
        availableProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {availableProducts.map((product) => {
              const discount = calculateDiscount(
                product.regularPriceUSD,
                product.wholesalePriceUSD,
              );

              const stockPercentage =
                product.stockAvailable > 0
                  ? Math.min(
                      100,
                      Math.max(
                        5,
                        (product.stockAvailable / 500) * 100,
                      ),
                    )
                  : 0;

              return (
                <article
                  key={product.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  {/* Imagen */}
                  <div className="relative h-56 overflow-hidden bg-muted">
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                      {discount > 0 ? (
                        <span className="rounded-full bg-amber-500 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-slate-950 shadow-lg">
                          -{discount}% mayorista
                        </span>
                      ) : (
                        <span />
                      )}

                      <span className="rounded-full bg-slate-950/75 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur">
                        B2B
                      </span>
                    </div>
                  </div>

                  {/* Información */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                        {product.category}
                      </span>

                      <span
                        className={`text-[10px] font-bold ${
                          product.stockAvailable <=
                          product.minOrderQuantity * 2
                            ? 'text-orange-500'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {product.stockAvailable <=
                        product.minOrderQuantity * 2
                          ? 'Stock limitado'
                          : 'Disponible'}
                      </span>
                    </div>

                    <h2 className="mt-3 line-clamp-2 text-lg font-black leading-snug text-foreground">
                      {product.title}
                    </h2>

                    {product.description && (
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
                        {product.description}
                      </p>
                    )}

                    <p className="mt-3 text-xs text-muted-foreground">
                      Proveedor:{' '}
                      <strong className="text-foreground">
                        {product.supplierName}
                      </strong>
                    </p>

                    {/* Precios */}
                    <div className="mt-5 rounded-2xl border border-border bg-muted/30 p-4">
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            Precio mayorista
                          </p>

                          <p className="mt-1 text-2xl font-black text-amber-500">
                            {formatUSD(
                              product.wholesalePriceUSD,
                            )}
                          </p>

                          <p className="text-[10px] text-muted-foreground">
                            por unidad
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] text-muted-foreground">
                            Precio referencia
                          </p>

                          <p className="text-sm font-bold text-muted-foreground line-through">
                            {formatUSD(
                              product.regularPriceUSD,
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                        <span className="text-muted-foreground">
                          Pedido mínimo
                        </span>

                        <strong className="text-foreground">
                          {product.minOrderQuantity} unidades
                        </strong>
                      </div>
                    </div>

                    {/* Stock */}
                    <div className="mt-4">
                      <div className="mb-1 flex justify-between text-[10px]">
                        <span className="font-semibold text-muted-foreground">
                          Inventario disponible
                        </span>

                        <span className="font-bold text-foreground">
                          {product.stockAvailable.toLocaleString(
                            'es-VE',
                          )}{' '}
                          unidades
                        </span>
                      </div>

                      <div
                        className="h-1.5 overflow-hidden rounded-full bg-muted"
                        aria-label={`Stock disponible: ${product.stockAvailable} unidades`}
                      >
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all"
                          style={{
                            width: `${stockPercentage}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* CTA */}
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedProduct(product)
                      }
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3.5 text-sm font-black text-slate-950 shadow-md transition-all hover:bg-amber-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 active:scale-[0.98]"
                    >
                      <span>
                        Solicitar pedido mayorista
                      </span>

                      <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

      {/* =====================================================
          CHECKOUT
          ===================================================== */}

      {selectedProduct && (
        <B2BCheckoutModal
          productId={selectedProduct.id}
          productName={selectedProduct.title}
          supplierId={selectedProduct.supplierId}
          wholesalePrice={
            selectedProduct.wholesalePriceUSD
          }
          minQuantity={
            selectedProduct.minOrderQuantity
          }
          binancePayId={
            selectedProduct.binancePayId
          }
          usdtWalletAddress={
            selectedProduct.usdtWalletAddress
          }
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}