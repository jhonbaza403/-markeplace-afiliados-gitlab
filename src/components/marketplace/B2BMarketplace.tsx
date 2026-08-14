'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'

import B2BCheckoutModal from '../B2BCheckoutModal'

// ==========================================================
// ARCHIVO: src/components/B2BMarketplace.tsx
// Credi Marketplace
//
// MARKETPLACE B2B — NIVEL PREMIUM
//
// RESPONSABILIDADES:
// - Renderizar catálogo mayorista.
// - Presentar información comercial.
// - Validar datos recibidos antes de mostrarlos.
// - Calcular descuentos.
// - Mostrar inventario.
// - Permitir iniciar solicitud de compra.
// - Abrir checkout B2B.
//
// NO RESPONSABILIDADES:
// - Procesar pagos.
// - Verificar transacciones.
// - Confirmar depósitos.
// - Insertar órdenes directamente.
// - Exponer credenciales secretas.
//
// La seguridad real debe descansar en:
// - Supabase RLS.
// - Backend / Server Actions.
// - Validaciones server-side.
// - Políticas de autorización.
// ==========================================================

// ==========================================================
// TIPOS
// ==========================================================

export interface B2BProductItem {
  id: string
  title: string
  category: string

  supplierId: string
  supplierName: string

  wholesalePriceUSD: number
  regularPriceUSD: number

  minOrderQuantity: number
  stockAvailable: number

  imageUrl: string

  /**
   * Estos datos solamente deben llegar al cliente
   * si el flujo de checkout realmente los necesita.
   *
   * Nunca deben considerarse secretos.
   */
  binancePayId: string
  usdtWalletAddress: string

  description?: string

  status?: 'active' | 'inactive' | 'out_of_stock'
}

interface B2BMarketplaceProps {
  products?: B2BProductItem[]
  loading?: boolean
  error?: string | null
}

// ==========================================================
// PRODUCTOS DEMO
// ==========================================================
//
// IMPORTANTE:
// Estos datos son únicamente de demostración.
//
// En producción:
// <B2BMarketplace products={productsFromSupabase} />
//
// No utilizar credenciales reales aquí.
// ==========================================================

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

    binancePayId: 'DEMO',
    usdtWalletAddress: 'DEMO',

    description:
      'Auriculares Bluetooth para distribución mayorista y comercio minorista.',

    status: 'active',
  },

  {
    id: 'b2b-2',
    title:
      'Caja x24 Revistas Científicas de Inteligencia Artificial',

    category: 'Educación & Publicaciones',

    supplierId: 'demo-supplier-academic',
    supplierName: 'Editorial Académica Internacional',

    wholesalePriceUSD: 12,
    regularPriceUSD: 25,

    minOrderQuantity: 5,
    stockAvailable: 120,

    imageUrl:
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=900&q=85',

    binancePayId: 'DEMO',
    usdtWalletAddress: 'DEMO',

    description:
      'Colección académica especializada para instituciones, librerías y distribuidores.',

    status: 'active',
  },
]

// ==========================================================
// UTILIDADES
// ==========================================================

function formatUSD(value: number): string {
  if (!Number.isFinite(value)) {
    return '$0.00'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

// ----------------------------------------------------------
// FORMATEO DE CANTIDADES
// ----------------------------------------------------------

function formatQuantity(value: number): string {
  if (!Number.isFinite(value)) {
    return '0'
  }

  return new Intl.NumberFormat('es-VE', {
    maximumFractionDigits: 0,
  }).format(value)
}

// ----------------------------------------------------------
// DESCUENTO
// ----------------------------------------------------------

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
    return 0
  }

  return Math.min(
    100,
    Math.max(
      0,
      Math.round(
        ((regularPrice - wholesalePrice) /
          regularPrice) *
          100,
      ),
    ),
  )
}

// ----------------------------------------------------------
// DISPONIBILIDAD
// ----------------------------------------------------------

function isProductAvailable(
  product: B2BProductItem,
): boolean {
  return (
    product.status !== 'inactive' &&
    product.status !== 'out_of_stock' &&
    Number.isFinite(product.stockAvailable) &&
    product.stockAvailable > 0 &&
    Number.isFinite(product.minOrderQuantity) &&
    product.minOrderQuantity > 0 &&
    Number.isFinite(product.wholesalePriceUSD) &&
    product.wholesalePriceUSD > 0
  )
}

// ----------------------------------------------------------
// VALIDACIÓN BÁSICA DEL PRODUCTO
// ----------------------------------------------------------

function isValidProduct(
  product: B2BProductItem,
): boolean {
  return Boolean(
    product &&
      typeof product.id === 'string' &&
      product.id.trim() &&
      typeof product.title === 'string' &&
      product.title.trim() &&
      typeof product.category === 'string' &&
      product.category.trim() &&
      typeof product.supplierId === 'string' &&
      product.supplierId.trim(),
  )
}

// ==========================================================
// COMPONENTE
// ==========================================================

export default function B2BMarketplace({
  products,
  loading = false,
  error = null,
}: B2BMarketplaceProps) {
  const [selectedProduct, setSelectedProduct] =
    useState<B2BProductItem | null>(null)

  // ========================================================
  // FUENTE DE PRODUCTOS
  // ========================================================

  const marketplaceProducts = useMemo(() => {
    const source =
      products !== undefined
        ? products
        : DEMO_PRODUCTS

    return source.filter(isValidProduct)
  }, [products])

  // ========================================================
  // PRODUCTOS DISPONIBLES
  // ========================================================

  const availableProducts = useMemo(
    () =>
      marketplaceProducts.filter(
        isProductAvailable,
      ),
    [marketplaceProducts],
  )

  // ========================================================
  // CONTADOR
  // ========================================================

  const productCount =
    availableProducts.length

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <section
      id="b2b-marketplace"
      aria-labelledby="b2b-marketplace-title"
      className="
        mx-auto
        w-full
        max-w-7xl
        px-4
        py-10
        sm:px-6
        lg:px-8
      "
    >
      {/* ==================================================
          HERO
      ================================================== */}

      <header
        className="
          relative
          mb-10
          overflow-hidden
          rounded-[2rem]
          border
          border-amber-400/20
          bg-gradient-to-br
          from-amber-500
          via-amber-500
          to-yellow-600
          p-6
          text-slate-950
          shadow-2xl
          sm:p-8
          lg:p-10
        "
      >
        {/* Decoración */}

        <div
          className="
            pointer-events-none
            absolute
            -right-20
            -top-20
            h-64
            w-64
            rounded-full
            bg-white/10
            blur-3xl
          "
          aria-hidden="true"
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-24
            left-1/3
            h-56
            w-56
            rounded-full
            bg-orange-900/10
            blur-3xl
          "
          aria-hidden="true"
        />

        <div
          className="
            relative
            flex
            flex-col
            justify-between
            gap-8
            lg:flex-row
            lg:items-center
          "
        >
          {/* HERO CONTENT */}

          <div className="max-w-3xl">
            <span
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-slate-950/20
                bg-slate-950/10
                px-3
                py-1.5
                text-[10px]
                font-black
                uppercase
                tracking-[0.18em]
              "
            >
              <i
                className="fa-solid fa-boxes-stacked"
                aria-hidden="true"
              />

              Mercado Mayorista · B2B
            </span>

            <h1
              id="b2b-marketplace-title"
              className="
                mt-4
                text-3xl
                font-black
                leading-tight
                tracking-tight
                sm:text-4xl
                lg:text-5xl
              "
            >
              Compra al mayor directamente
              de proveedores e importadores
            </h1>

            <p
              className="
                mt-4
                max-w-2xl
                text-sm
                font-medium
                leading-6
                text-slate-950/75
                sm:text-base
              "
            >
              Accede a precios especiales por
              volumen, cantidades mínimas y
              disponibilidad de inventario en un
              entorno diseñado para compradores
              profesionales.
            </p>

            {/* BENEFICIOS */}

            <div className="mt-6 flex flex-wrap gap-3">
              <span
                className="
                  rounded-xl
                  border
                  border-slate-950/10
                  bg-white/20
                  px-3
                  py-2
                  text-xs
                  font-bold
                "
              >
                <i
                  className="fa-solid fa-tag mr-1.5"
                  aria-hidden="true"
                />

                Precios mayoristas
              </span>

              <span
                className="
                  rounded-xl
                  border
                  border-slate-950/10
                  bg-white/20
                  px-3
                  py-2
                  text-xs
                  font-bold
                "
              >
                <i
                  className="fa-solid fa-boxes-stacked mr-1.5"
                  aria-hidden="true"
                />

                MOQ definido
              </span>

              <span
                className="
                  rounded-xl
                  border
                  border-slate-950/10
                  bg-white/20
                  px-3
                  py-2
                  text-xs
                  font-bold
                "
              >
                <i
                  className="fa-solid fa-chart-line mr-1.5"
                  aria-hidden="true"
                />

                Inventario visible
              </span>
            </div>
          </div>

          {/* PANEL DERECHO */}

          <div
            className="
              relative
              shrink-0
              rounded-2xl
              border
              border-slate-950/10
              bg-slate-950/10
              p-5
              text-center
              backdrop-blur-md
              lg:min-w-[260px]
            "
          >
            <div
              className="
                mx-auto
                mb-3
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-white/20
                text-xl
              "
              aria-hidden="true"
            >
              <i className="fa-solid fa-bolt" />
            </div>

            <p
              className="
                text-[10px]
                font-black
                uppercase
                tracking-widest
              "
            >
              Operaciones B2B
            </p>

            <p className="mt-1 text-lg font-black">
              Binance Pay / USDT
            </p>

            <p
              className="
                mt-2
                text-[11px]
                font-medium
                leading-relaxed
                text-slate-950/70
              "
            >
              Los pagos permanecen sujetos a
              verificación y validación de la
              plataforma.
            </p>
          </div>
        </div>
      </header>

      {/* ==================================================
          CABECERA DEL CATÁLOGO
      ================================================== */}

      {!loading && !error && productCount > 0 && (
        <div
          className="
            mb-5
            flex
            flex-col
            gap-2
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <h2 className="text-lg font-black text-foreground">
              Ofertas mayoristas
            </h2>

            <p className="text-xs text-muted-foreground">
              Productos disponibles para solicitud
              de pedidos B2B.
            </p>
          </div>

          <div
            className="
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              border-border
              bg-card
              px-3
              py-1.5
              text-xs
              font-bold
              text-muted-foreground
            "
          >
            <span
              className="
                h-2
                w-2
                rounded-full
                bg-emerald-500
              "
              aria-hidden="true"
            />

            {productCount}{' '}
            {productCount === 1
              ? 'oferta disponible'
              : 'ofertas disponibles'}
          </div>
        </div>
      )}

      {/* ==================================================
          LOADING
      ================================================== */}

      {loading && (
        <div
          role="status"
          aria-live="polite"
          aria-label="Cargando ofertas mayoristas"
          className="
            grid
            grid-cols-1
            gap-6
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="
                animate-pulse
                overflow-hidden
                rounded-2xl
                border
                border-border
                bg-card
              "
            >
              <div className="h-56 bg-muted" />

              <div className="space-y-4 p-5">
                <div className="h-3 w-1/3 rounded bg-muted" />
                <div className="h-5 w-4/5 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-24 rounded-2xl bg-muted" />
                <div className="h-12 rounded-xl bg-muted" />
              </div>
            </div>
          ))}

          <span className="sr-only">
            Cargando catálogo mayorista...
          </span>
        </div>
      )}

      {/* ==================================================
          ERROR
      ================================================== */}

      {!loading && error && (
        <div
          role="alert"
          className="
            rounded-2xl
            border
            border-destructive/20
            bg-destructive/10
            p-8
            text-center
          "
        >
          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-destructive/10
              text-xl
              text-destructive
            "
            aria-hidden="true"
          >
            <i className="fa-solid fa-circle-exclamation" />
          </div>

          <h2
            className="
              mt-4
              text-lg
              font-black
              text-foreground
            "
          >
            No pudimos cargar el mercado mayorista
          </h2>

          <p
            className="
              mx-auto
              mt-2
              max-w-lg
              text-sm
              leading-relaxed
              text-muted-foreground
            "
          >
            {error}
          </p>
        </div>
      )}

      {/* ==================================================
          SIN PRODUCTOS
      ================================================== */}

      {!loading &&
        !error &&
        availableProducts.length === 0 && (
          <div
            className="
              rounded-2xl
              border
              border-border
              bg-card
              p-10
              text-center
            "
          >
            <div
              className="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-muted
                text-2xl
                text-muted-foreground
              "
              aria-hidden="true"
            >
              <i className="fa-solid fa-box-open" />
            </div>

            <h2
              className="
                mt-4
                text-lg
                font-black
                text-foreground
              "
            >
              No hay ofertas mayoristas disponibles
            </h2>

            <p
              className="
                mx-auto
                mt-2
                max-w-md
                text-sm
                leading-relaxed
                text-muted-foreground
              "
            >
              Actualmente no existen productos con
              inventario disponible para pedidos B2B.
            </p>
          </div>
        )}

      {/* ==================================================
          CATÁLOGO
      ================================================== */}

      {!loading &&
        !error &&
        availableProducts.length > 0 && (
          <div
            className="
              grid
              grid-cols-1
              gap-6
              md:grid-cols-2
              xl:grid-cols-3
            "
          >
            {availableProducts.map((product) => {
              const discount =
                calculateDiscount(
                  product.regularPriceUSD,
                  product.wholesalePriceUSD,
                )

              const isLimitedStock =
                product.stockAvailable <=
                product.minOrderQuantity * 2

              const stockPercentage =
                product.stockAvailable > 0
                  ? Math.min(
                      100,
                      Math.max(
                        8,
                        (product.stockAvailable /
                          500) *
                          100,
                      ),
                    )
                  : 0

              return (
                <article
                  key={product.id}
                  className="
                    group
                    flex
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    border
                    border-border
                    bg-card
                    text-card-foreground
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-2xl
                  "
                >
                  {/* ========================================
                      IMAGEN
                  ========================================= */}

                  <div
                    className="
                      relative
                      h-56
                      overflow-hidden
                      bg-muted
                    "
                  >
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      fill
                      sizes="
                        (max-width: 768px) 100vw,
                        (max-width: 1280px) 50vw,
                        33vw
                      "
                      className="
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-105
                      "
                    />

                    {/* Overlay */}

                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/30
                        via-transparent
                        to-transparent
                      "
                      aria-hidden="true"
                    />

                    {/* Badges */}

                    <div
                      className="
                        absolute
                        inset-x-0
                        top-0
                        flex
                        items-start
                        justify-between
                        gap-2
                        p-4
                      "
                    >
                      {discount > 0 ? (
                        <span
                          className="
                            rounded-full
                            bg-amber-500
                            px-3
                            py-1.5
                            text-[10px]
                            font-black
                            uppercase
                            tracking-wide
                            text-slate-950
                            shadow-lg
                          "
                        >
                          -{discount}% mayorista
                        </span>
                      ) : (
                        <span />
                      )}

                      <span
                        className="
                          rounded-full
                          bg-slate-950/75
                          px-3
                          py-1.5
                          text-[10px]
                          font-black
                          tracking-wide
                          text-white
                          backdrop-blur
                        "
                      >
                        B2B
                      </span>
                    </div>
                  </div>

                  {/* ========================================
                      INFORMACIÓN
                  ========================================= */}

                  <div
                    className="
                      flex
                      flex-1
                      flex-col
                      p-5
                    "
                  >
                    {/* Categoría + stock */}

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-3
                      "
                    >
                      <span
                        className="
                          line-clamp-1
                          text-[10px]
                          font-black
                          uppercase
                          tracking-widest
                          text-emerald-600
                          dark:text-emerald-400
                        "
                      >
                        {product.category}
                      </span>

                      <span
                        className={`
                          shrink-0
                          text-[10px]
                          font-bold
                          ${
                            isLimitedStock
                              ? 'text-orange-500'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }
                        `}
                      >
                        <i
                          className="fa-solid fa-circle mr-1 text-[6px]"
                          aria-hidden="true"
                        />

                        {isLimitedStock
                          ? 'Stock limitado'
                          : 'Disponible'}
                      </span>
                    </div>

                    {/* Título */}

                    <h2
                      className="
                        mt-3
                        line-clamp-2
                        min-h-[3.5rem]
                        text-lg
                        font-black
                        leading-snug
                        text-foreground
                      "
                    >
                      {product.title}
                    </h2>

                    {/* Descripción */}

                    {product.description && (
                      <p
                        className="
                          mt-2
                          line-clamp-2
                          min-h-[2.5rem]
                          text-xs
                          leading-5
                          text-muted-foreground
                        "
                      >
                        {product.description}
                      </p>
                    )}

                    {/* Proveedor */}

                    <div
                      className="
                        mt-3
                        flex
                        items-center
                        gap-2
                        text-xs
                        text-muted-foreground
                      "
                    >
                      <i
                        className="fa-solid fa-building text-[10px]"
                        aria-hidden="true"
                      />

                      <span className="truncate">
                        Proveedor:{' '}
                        <strong className="text-foreground">
                          {product.supplierName}
                        </strong>
                      </span>
                    </div>

                    {/* ======================================
                        PRECIOS
                    ======================================= */}

                    <div
                      className="
                        mt-5
                        rounded-2xl
                        border
                        border-border
                        bg-muted/30
                        p-4
                      "
                    >
                      <div
                        className="
                          flex
                          items-end
                          justify-between
                          gap-3
                        "
                      >
                        <div>
                          <p
                            className="
                              text-[10px]
                              font-bold
                              uppercase
                              tracking-wider
                              text-muted-foreground
                            "
                          >
                            Precio mayorista
                          </p>

                          <p
                            className="
                              mt-1
                              text-2xl
                              font-black
                              text-amber-500
                            "
                          >
                            {formatUSD(
                              product.wholesalePriceUSD,
                            )}
                          </p>

                          <p
                            className="
                              text-[10px]
                              text-muted-foreground
                            "
                          >
                            por unidad
                          </p>
                        </div>

                        <div className="text-right">
                          <p
                            className="
                              text-[10px]
                              text-muted-foreground
                            "
                          >
                            Referencia
                          </p>

                          <p
                            className="
                              text-sm
                              font-bold
                              text-muted-foreground
                              line-through
                            "
                          >
                            {formatUSD(
                              product.regularPriceUSD,
                            )}
                          </p>
                        </div>
                      </div>

                      {/* MOQ */}

                      <div
                        className="
                          mt-4
                          flex
                          items-center
                          justify-between
                          border-t
                          border-border
                          pt-3
                          text-xs
                        "
                      >
                        <span className="text-muted-foreground">
                          Pedido mínimo
                        </span>

                        <strong className="text-foreground">
                          {formatQuantity(
                            product.minOrderQuantity,
                          )}{' '}
                          unidades
                        </strong>
                      </div>
                    </div>

                    {/* ======================================
                        STOCK
                    ======================================= */}

                    <div className="mt-4">
                      <div
                        className="
                          mb-1.5
                          flex
                          items-center
                          justify-between
                          gap-3
                          text-[10px]
                        "
                      >
                        <span
                          className="
                            font-semibold
                            text-muted-foreground
                          "
                        >
                          Inventario disponible
                        </span>

                        <span
                          className="
                            font-bold
                            text-foreground
                          "
                        >
                          {formatQuantity(
                            product.stockAvailable,
                          )}{' '}
                          unidades
                        </span>
                      </div>

                      <div
                        className="
                          h-1.5
                          overflow-hidden
                          rounded-full
                          bg-muted
                        "
                        role="progressbar"
                        aria-label={`Stock disponible: ${formatQuantity(
                          product.stockAvailable,
                        )} unidades`}
                        aria-valuemin={0}
                        aria-valuemax={500}
                        aria-valuenow={Math.min(
                          product.stockAvailable,
                          500,
                        )}
                      >
                        <div
                          className="
                            h-full
                            rounded-full
                            bg-emerald-500
                            transition-all
                            duration-500
                          "
                          style={{
                            width: `${stockPercentage}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* ======================================
                        CTA
                    ======================================= */}

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedProduct(product)
                      }
                      aria-label={`Solicitar pedido mayorista de ${product.title}`}
                      className="
                        mt-5
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-amber-500
                        px-4
                        py-3.5
                        text-sm
                        font-black
                        text-slate-950
                        shadow-md
                        shadow-amber-500/10
                        transition-all
                        hover:bg-amber-400
                        hover:shadow-lg
                        focus:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-amber-500
                        focus-visible:ring-offset-2
                        active:scale-[0.98]
                      "
                    >
                      <i
                        className="fa-solid fa-cart-shopping"
                        aria-hidden="true"
                      />

                      Solicitar pedido mayorista

                      <i
                        className="fa-solid fa-arrow-right"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}

      {/* ==================================================
          CHECKOUT
      ================================================== */}

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
          onClose={() =>
            setSelectedProduct(null)
          }
        />
      )}
    </section>
  )
}