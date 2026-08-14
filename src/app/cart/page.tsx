```tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { useCart } from '@/context/CartContext'

interface CartProduct {
  id: string
  title: string
  price: number | string
  image_url?: string | null
  stock?: number | null
  is_active?: boolean
}

interface CartItem {
  product: CartProduct
  quantity: number
}

interface CartContextValue {
  cart: CartItem[]
  removeFromCart: (productId: string) => void
  totalAmount: number
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function normalizePrice(value: number | string): number {
  const parsed = typeof value === 'number' ? value : Number(value)

  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0
  }

  return parsed
}

function normalizeQuantity(value: number): number {
  const parsed = Number(value)

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 0
  }

  return Math.floor(parsed)
}

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    totalAmount,
  } = useCart() as CartContextValue

  const [removingId, setRemovingId] = useState<string | null>(null)

  /*
   * El carrito es la fuente visual de los artículos.
   *
   * El precio definitivo, disponibilidad e inventario deben ser
   * verificados nuevamente en el servidor antes de crear la orden.
   */
  const normalizedCart = useMemo(() => {
    return cart
      .map((item) => {
        const price = normalizePrice(item.product.price)
        const quantity = normalizeQuantity(item.quantity)

        return {
          ...item,
          price,
          quantity,
          subtotal: Number((price * quantity).toFixed(2)),
        }
      })
      .filter((item) => item.quantity > 0)
  }, [cart])

  const calculatedTotal = useMemo(() => {
    return Number(
      normalizedCart
        .reduce((total, item) => total + item.subtotal, 0)
        .toFixed(2),
    )
  }, [normalizedCart])

  /*
   * totalAmount continúa siendo útil como valor proveniente del
   * CartContext, pero evitamos confiar ciegamente en él.
   */
  const contextTotal = Number(totalAmount)

  const displayTotal =
    Number.isFinite(contextTotal) &&
    contextTotal >= 0 &&
    Math.abs(contextTotal - calculatedTotal) < 0.01
      ? contextTotal
      : calculatedTotal

  const totalItems = useMemo(() => {
    return normalizedCart.reduce(
      (total, item) => total + item.quantity,
      0,
    )
  }, [normalizedCart])

  const invalidItems = useMemo(() => {
    return normalizedCart.filter((item) => {
      if (item.product.is_active === false) {
        return true
      }

      if (
        typeof item.product.stock === 'number' &&
        item.quantity > item.product.stock
      ) {
        return true
      }

      return false
    })
  }, [normalizedCart])

  const handleRemove = (productId: string) => {
    if (removingId) {
      return
    }

    setRemovingId(productId)

    try {
      removeFromCart(productId)
    } finally {
      /*
       * Permitimos que React procese la actualización del contexto
       * antes de liberar el estado visual.
       */
      queueMicrotask(() => {
        setRemovingId(null)
      })
    }
  }

  /*
   * Carrito vacío
   */
  if (normalizedCart.length === 0) {
    return (
      <main className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <section
            aria-labelledby="empty-cart-title"
            className="w-full rounded-[2rem] border border-border bg-card p-8 text-center shadow-xl sm:p-12"
          >
            <div
              aria-hidden="true"
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-3xl"
            >
              🛒
            </div>

            <span className="mt-6 inline-flex rounded-full border border-border bg-muted px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Carrito de compras
            </span>

            <h1
              id="empty-cart-title"
              className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl"
            >
              Tu carrito está vacío
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-muted-foreground">
              Explora Credi Marketplace, descubre productos y agrega los
              artículos que deseas comprar. Aquí aparecerán antes de iniciar
              el proceso de checkout.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3.5 text-sm font-black text-primary-foreground shadow-lg shadow-primary/10 transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Explorar Marketplace

                <span aria-hidden="true" className="ml-2">
                  →
                </span>
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-2xl border border-border bg-background px-6 py-3.5 text-sm font-bold text-foreground transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Ir a mi cuenta
              </Link>
            </div>
          </section>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <header className="mb-8">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
          >
            <span aria-hidden="true">←</span>
            Continuar comprando
          </Link>

          <div className="mt-6">
            <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
              Credi Marketplace
            </span>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              Tu carrito
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              {totalItems}{' '}
              {totalItems === 1
                ? 'artículo seleccionado'
                : 'artículos seleccionados'}{' '}
              para tu compra.
            </p>
          </div>
        </header>

        {/* Advertencia de disponibilidad */}
        {invalidItems.length > 0 && (
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4"
          >
            <div className="flex gap-3">
              <span
                aria-hidden="true"
                className="text-amber-500"
              >
                ⚠
              </span>

              <div>
                <p className="text-sm font-black text-foreground">
                  Algunos artículos requieren verificación
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  La disponibilidad y el inventario serán comprobados
                  nuevamente antes de crear la orden.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">

          {/* Productos */}
          <section
            aria-labelledby="cart-items-title"
            className="rounded-3xl border border-border bg-card shadow-sm"
          >
            <div className="border-b border-border p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2
                    id="cart-items-title"
                    className="text-lg font-black text-foreground"
                  >
                    Productos seleccionados
                  </h2>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Revisa cantidades y precios antes de continuar.
                  </p>
                </div>

                <span className="rounded-full bg-muted px-3 py-1 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  {totalItems}{' '}
                  {totalItems === 1 ? 'unidad' : 'unidades'}
                </span>
              </div>
            </div>

            <div className="divide-y divide-border">
              {normalizedCart.map((item) => {
                const isRemoving = removingId === item.product.id

                const exceedsStock =
                  typeof item.product.stock === 'number' &&
                  item.quantity > item.product.stock

                const inactive = item.product.is_active === false

                return (
                  <article
                    key={item.product.id}
                    className={`p-6 transition ${
                      isRemoving
                        ? 'pointer-events-none opacity-50'
                        : 'hover:bg-muted/20'
                    }`}
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                      {/* Información del producto */}
                      <div className="flex min-w-0 items-center gap-4">

                        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted">
                          {item.product.image_url ? (
                            <Image
                              src={item.product.image_url}
                              alt={item.product.title}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          ) : (
                            <span
                              aria-hidden="true"
                              className="text-2xl text-muted-foreground"
                            >
                              📦
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <Link
                            href={`/products/${item.product.id}`}
                            className="line-clamp-2 text-base font-black text-foreground transition hover:text-primary"
                          >
                            {item.product.title}
                          </Link>

                          <p className="mt-1 text-xs text-muted-foreground">
                            Precio unitario:{' '}
                            <span className="font-bold text-foreground">
                              {formatCurrency(item.price)}
                            </span>
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            Cantidad:{' '}
                            <span className="font-bold text-foreground">
                              {item.quantity}
                            </span>
                          </p>

                          {typeof item.product.stock === 'number' && (
                            <p
                              className={`mt-1 text-xs font-semibold ${
                                exceedsStock
                                  ? 'text-red-500'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              Stock disponible:{' '}
                              {item.product.stock}
                            </p>
                          )}

                          {inactive && (
                            <span className="mt-2 inline-flex rounded-full bg-red-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-red-500">
                              Producto inactivo
                            </span>
                          )}

                          {exceedsStock && (
                            <span className="mt-2 inline-flex rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-500">
                              Cantidad superior al stock
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Subtotal / eliminar */}
                      <div className="flex items-center justify-between gap-6 sm:justify-end">
                        <div className="text-left sm:text-right">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            Subtotal
                          </span>

                          <span className="mt-1 block text-lg font-black text-foreground">
                            {formatCurrency(item.subtotal)}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemove(item.product.id)}
                          disabled={isRemoving}
                          aria-label={`Eliminar ${item.product.title} del carrito`}
                          className="rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs font-bold text-red-500 transition hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isRemoving
                            ? 'Eliminando...'
                            : 'Eliminar'}
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          {/* Resumen */}
          <aside className="lg:sticky lg:top-6 lg:h-fit">
            <section
              aria-labelledby="summary-title"
              className="rounded-3xl border border-border bg-card p-6 shadow-xl"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Resumen de compra
              </span>

              <h2
                id="summary-title"
                className="mt-2 text-xl font-black text-foreground"
              >
                Total de tu pedido
              </h2>

              <div className="mt-6 space-y-4">

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Productos
                  </span>

                  <span className="font-bold text-foreground">
                    {totalItems}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Subtotal
                  </span>

                  <span className="font-bold text-foreground">
                    {formatCurrency(displayTotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Envío
                  </span>

                  <span className="font-bold text-emerald-500">
                    Se calculará después
                  </span>
                </div>

                <div className="border-t border-border pt-5">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground">
                        Total estimado
                      </span>

                      <p className="mt-1 text-3xl font-black tracking-tight text-foreground">
                        {formatCurrency(displayTotal)}
                      </p>
                    </div>

                    <span className="mb-1 rounded-full bg-muted px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                      USD
                    </span>
                  </div>
                </div>
              </div>

              {invalidItems.length > 0 ? (
                <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                  <p className="text-xs font-bold text-amber-500">
                    Verificación requerida
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                    Antes de continuar, el servidor verificará nuevamente
                    los productos, cantidades, precios e inventario.
                  </p>
                </div>
              ) : null}

              <Link
                href="/checkout"
                className="mt-6 flex w-full items-center justify-center rounded-2xl bg-primary px-5 py-4 text-sm font-black text-primary-foreground shadow-lg shadow-primary/10 transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Proceder al checkout

                <span aria-hidden="true" className="ml-2">
                  →
                </span>
              </Link>

              <Link
                href="/marketplace"
                className="mt-3 flex w-full items-center justify-center rounded-2xl border border-border bg-background px-5 py-3.5 text-sm font-bold text-foreground transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Seguir comprando
              </Link>

              <div className="mt-6 space-y-3 border-t border-border pt-5">

                <div className="flex gap-3">
                  <span
                    className="text-emerald-500"
                    aria-hidden="true"
                  >
                    ✓
                  </span>

                  <p className="text-[11px] leading-5 text-muted-foreground">
                    El carrito se mantiene separado del proceso de pago.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span
                    className="text-emerald-500"
                    aria-hidden="true"
                  >
                    ✓
                  </span>

                  <p className="text-[11px] leading-5 text-muted-foreground">
                    Los precios serán verificados nuevamente en el servidor.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span
                    className="text-emerald-500"
                    aria-hidden="true"
                  >
                    ✓
                  </span>

                  <p className="text-[11px] leading-5 text-muted-foreground">
                    El navegador nunca debe marcar una orden como completada.
                  </p>
                </div>

              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  )
}
```
