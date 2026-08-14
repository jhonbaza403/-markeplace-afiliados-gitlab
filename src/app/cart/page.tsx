'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

interface CartItemProduct {
  id: string
  title: string
  price: number | string
  image_url?: string | null
}

interface CartItem {
  product: CartItemProduct
  quantity: number
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    totalAmount,
  } = useCart() as {
    cart: CartItem[]
    removeFromCart: (productId: string) => void
    totalAmount: number
  }

  const [removingId, setRemovingId] = useState<string | null>(null)

  const normalizedTotal = useMemo(() => {
    const calculatedTotal = cart.reduce((total, item) => {
      const price = Number(item.product.price) || 0
      const quantity = Math.max(1, Number(item.quantity) || 1)

      return total + price * quantity
    }, 0)

    return Number(calculatedTotal.toFixed(2))
  }, [cart])

  const displayTotal =
    Number.isFinite(Number(totalAmount)) && Number(totalAmount) >= 0
      ? Number(totalAmount)
      : normalizedTotal

  const totalItems = useMemo(
    () =>
      cart.reduce(
        (total, item) => total + Math.max(1, Number(item.quantity) || 1),
        0,
      ),
    [cart],
  )

  const handleRemove = async (productId: string) => {
    setRemovingId(productId)

    try {
      removeFromCart(productId)
    } finally {
      setRemovingId(null)
    }
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <section
            aria-labelledby="empty-cart-title"
            className="w-full rounded-[2rem] border border-border bg-card p-8 text-center shadow-xl sm:p-12"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-3xl text-primary">
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
              Explora el Marketplace, descubre productos y agrega los artículos
              que deseas comprar. Tus productos aparecerán aquí antes de
              iniciar el proceso de checkout.
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

        {/* Encabezado */}
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
              {totalItems === 1 ? 'artículo seleccionado' : 'artículos seleccionados'}{' '}
              para tu compra.
            </p>
          </div>
        </header>

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
                  {totalItems} {totalItems === 1 ? 'unidad' : 'unidades'}
                </span>
              </div>
            </div>

            <div className="divide-y divide-border">
              {cart.map((item) => {
                const price = Number(item.product.price) || 0
                const quantity = Math.max(1, Number(item.quantity) || 1)
                const subtotal = price * quantity
                const isRemoving = removingId === item.product.id

                return (
                  <article
                    key={item.product.id}
                    className={`p-6 transition ${
                      isRemoving ? 'opacity-50' : 'hover:bg-muted/20'
                    }`}
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                      <div className="flex min-w-0 items-center gap-4">
                        {/* Imagen / placeholder */}
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted">
                          {item.product.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.product.image_url}
                              alt={item.product.title}
                              className="h-full w-full object-cover"
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
                            href={`/marketplace/products/${item.product.id}`}
                            className="line-clamp-2 text-base font-black text-foreground transition hover:text-primary"
                          >
                            {item.product.title}
                          </Link>

                          <p className="mt-1 text-xs text-muted-foreground">
                            Precio unitario:{' '}
                            <span className="font-bold text-foreground">
                              {formatCurrency(price)}
                            </span>
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            Cantidad:{' '}
                            <span className="font-bold text-foreground">
                              {quantity}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-6 sm:justify-end">
                        <div className="text-left sm:text-right">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            Subtotal
                          </span>

                          <span className="mt-1 block text-lg font-black text-foreground">
                            {formatCurrency(subtotal)}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemove(item.product.id)}
                          disabled={isRemoving}
                          aria-label={`Eliminar ${item.product.title} del carrito`}
                          className="rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs font-bold text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isRemoving ? 'Eliminando...' : 'Eliminar'}
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
                        Total
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
                className="mt-3 flex w-full items-center justify-center rounded-2xl border border-border bg-background px-5 py-3.5 text-sm font-bold text-foreground transition hover:bg-muted"
              >
                Seguir comprando
              </Link>

              <div className="mt-6 space-y-3 border-t border-border pt-5">
                <div className="flex gap-3">
                  <span className="text-emerald-500" aria-hidden="true">
                    ✓
                  </span>
                  <p className="text-[11px] leading-5 text-muted-foreground">
                    Tu carrito se mantiene separado del proceso de pago.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="text-emerald-500" aria-hidden="true">
                    ✓
                  </span>
                  <p className="text-[11px] leading-5 text-muted-foreground">
                    El precio definitivo debe validarse siempre en el servidor.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="text-emerald-500" aria-hidden="true">
                    ✓
                  </span>
                  <p className="text-[11px] leading-5 text-muted-foreground">
                    El pago no debe marcar una orden como completada desde el
                    navegador.
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