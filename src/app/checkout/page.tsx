```tsx
'use client'

import React, { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Product {
  id: string
  title: string
  price: number
  stock: number
  is_active: boolean
}

interface CheckoutState {
  loading: boolean
  success: boolean
  error: string | null
}

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const productId = searchParams.get('product_id')
  const refCode = searchParams.get('ref')

  const [product, setProduct] = useState<Product | null>(null)
  const [loadingProduct, setLoadingProduct] = useState(true)

  const [checkout, setCheckout] = useState<CheckoutState>({
    loading: false,
    success: false,
    error: null,
  })

  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    let mounted = true

    async function fetchProduct() {
      if (!productId) {
        if (mounted) {
          setCheckout((prev) => ({
            ...prev,
            error: 'No se especificó ningún producto para la compra.',
          }))
          setLoadingProduct(false)
        }
        return
      }

      try {
        setLoadingProduct(true)

        const supabase = createClient()

        const { data, error } = await supabase
          .from('products')
          .select('id, title, price, stock, is_active')
          .eq('id', productId)
          .eq('is_active', true)
          .maybeSingle()

        if (error) {
          throw error
        }

        if (!data) {
          throw new Error('El producto no existe, está inactivo o ya no está disponible.')
        }

        if (mounted) {
          setProduct(data)
        }
      } catch (error: unknown) {
        console.error('Error al cargar el producto para checkout:', error)

        if (mounted) {
          setCheckout((prev) => ({
            ...prev,
            error:
              error instanceof Error
                ? error.message
                : 'No fue posible cargar el producto.',
          }))
        }
      } finally {
        if (mounted) {
          setLoadingProduct(false)
        }
      }
    }

    fetchProduct()

    return () => {
      mounted = false
    }
  }, [productId])

  const total = useMemo(() => {
    if (!product) return 0
    return Number((product.price * quantity).toFixed(2))
  }, [product, quantity])

  const handleQuantityChange = (value: number) => {
    if (!product) return

    const safeValue = Math.max(
      1,
      Math.min(value, product.stock)
    )

    setQuantity(safeValue)
  }

  const handleCheckout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!product) {
      setCheckout({
        loading: false,
        success: false,
        error: 'El producto no está disponible.',
      })
      return
    }

    if (product.stock <= 0) {
      setCheckout({
        loading: false,
        success: false,
        error: 'Este producto se encuentra agotado.',
      })
      return
    }

    if (quantity > product.stock) {
      setCheckout({
        loading: false,
        success: false,
        error: 'La cantidad solicitada supera el inventario disponible.',
      })
      return
    }

    setCheckout({
      loading: true,
      success: false,
      error: null,
    })

    try {
      const supabase = createClient()

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        const currentUrl = `/checkout?product_id=${encodeURIComponent(
          product.id
        )}${refCode ? `&ref=${encodeURIComponent(refCode)}` : ''}`

        router.push(`/login?redirectTo=${encodeURIComponent(currentUrl)}`)
        return
      }

      /*
       * IMPORTANTE:
       *
       * Esta llamada crea una orden pendiente.
       * El precio definitivo debe ser validado en servidor
       * mediante una API Route, Server Action o función RPC.
       *
       * Nunca debe confiarse en un precio enviado por el navegador.
       */

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          buyer_id: user.id,
          product_id: product.id,
          total_amount: total,
          affiliate_ref: refCode || null,
          status: 'pending',
        })
        .select('id')
        .single()

      if (orderError) {
        throw orderError
      }

      if (!order) {
        throw new Error('No fue posible crear la orden.')
      }

      /*
       * Aquí debe conectarse posteriormente el proveedor real
       * de pagos:
       *
       * - Stripe
       * - Binance Pay
       * - USDT
       * - Mercado Pago
       * - Otro gateway
       *
       * El frontend NO debe marcar la orden como "completed".
       */

      router.push(`/checkout/success?order_id=${order.id}`)
    } catch (error: unknown) {
      console.error('Error al crear la orden:', error)

      setCheckout({
        loading: false,
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'No fue posible procesar la orden. Intenta nuevamente.',
      })
    }
  }

  if (loadingProduct) {
    return (
      <main className="min-h-screen bg-background px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 rounded-lg bg-muted" />
            <div className="h-32 rounded-2xl bg-muted" />
            <div className="h-48 rounded-2xl bg-muted" />
          </div>
        </div>
      </main>
    )
  }

  if (checkout.error && !product) {
    return (
      <main className="min-h-screen bg-background px-4 py-16">
        <div className="mx-auto max-w-xl">
          <div className="rounded-3xl border border-red-500/20 bg-card p-8 text-center shadow-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-2xl">
              !
            </div>

            <h1 className="mt-5 text-2xl font-black text-foreground">
              No se pudo cargar la compra
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {checkout.error}
            </p>

            <Link
              href="/marketplace"
              className="mt-7 inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
            >
              Volver al Marketplace
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (!product) {
    return null
  }

  const isAvailable = product.is_active && product.stock > 0

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Encabezado */}
        <div className="mb-8">
          <Link
            href={`/products/${product.id}${refCode ? `?ref=${encodeURIComponent(refCode)}` : ''}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
          >
            <span aria-hidden="true">←</span>
            Volver al producto
          </Link>

          <div className="mt-6">
            <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-500">
              Checkout seguro
            </span>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              Finalizar compra
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Revisa tu pedido antes de continuar con el proceso de pago.
            </p>
          </div>
        </div>

        {checkout.error && (
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500"
          >
            <strong className="font-bold">No se pudo completar la operación:</strong>{' '}
            {checkout.error}
          </div>
        )}

        <form
          onSubmit={handleCheckout}
          className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]"
        >
          {/* Información principal */}
          <section className="space-y-6">

            {/* Producto */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between gap-5">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Producto seleccionado
                  </span>

                  <h2 className="mt-2 text-xl font-black text-foreground">
                    {product.title}
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Precio unitario:{' '}
                    <span className="font-bold text-foreground">
                      ${product.price.toFixed(2)}
                    </span>
                  </p>
                </div>

                <div className="rounded-2xl bg-primary/10 px-4 py-3 text-right">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Disponible
                  </span>
                  <span className="mt-1 block text-sm font-black text-primary">
                    {product.stock}
                  </span>
                </div>
              </div>
            </div>

            {/* Cantidad */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-base font-black text-foreground">
                Cantidad
              </h2>

              <div className="mt-5 flex items-center justify-between rounded-2xl border border-border bg-background p-2">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  aria-label="Disminuir cantidad"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-lg font-bold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                >
                  −
                </button>

                <span className="min-w-12 text-center text-lg font-black text-foreground">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                  aria-label="Aumentar cantidad"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-lg font-bold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                Máximo disponible: {product.stock} unidades.
              </p>
            </div>

            {/* Afiliado */}
            {refCode && (
              <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                    ✓
                  </div>

                  <div>
                    <h2 className="text-sm font-black text-foreground">
                      Referencia de afiliado aplicada
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Esta compra conserva la referencia de afiliación asociada
                      a tu enlace.
                    </p>

                    <code className="mt-3 inline-block rounded-lg border border-border bg-background px-3 py-2 font-mono text-[11px] text-foreground">
                      {refCode}
                    </code>
                  </div>
                </div>
              </div>
            )}

            {/* Método de pago */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-black text-foreground">
                    Método de pago
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Selecciona el método disponible para completar la operación.
                  </p>
                </div>

                <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-500">
                  Próximamente
                </span>
              </div>

              <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-black text-primary">
                    $
                  </div>

                  <div>
                    <p className="text-sm font-bold text-foreground">
                      Pago electrónico
                    </p>

                    <p className="text-xs text-muted-foreground">
                      La integración con la pasarela de pago se conectará en la siguiente fase.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Resumen */}
          <aside className="lg:sticky lg:top-6 lg:h-fit">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xl">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Resumen de compra
              </span>

              <div className="mt-5 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm text-muted-foreground">
                    {product.title}
                  </span>

                  <span className="text-sm font-bold text-foreground">
                    ${product.price.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Cantidad
                  </span>

                  <span className="font-bold text-foreground">
                    × {quantity}
                  </span>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground">
                        Total
                      </span>

                      <p className="mt-1 text-3xl font-black tracking-tight text-foreground">
                        ${total.toFixed(2)}
                      </p>
                    </div>

                    <span className="mb-1 rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      USD
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  checkout.loading ||
                  !isAvailable ||
                  quantity > product.stock
                }
                className="mt-6 w-full rounded-2xl bg-primary px-5 py-4 text-sm font-black text-primary-foreground shadow-lg shadow-primary/10 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {checkout.loading
                  ? 'Creando orden...'
                  : !isAvailable
                    ? 'Producto agotado'
                    : `Continuar al pago · $${total.toFixed(2)}`}
              </button>

              <div className="mt-5 space-y-3 border-t border-border pt-5">
                <div className="flex gap-3">
                  <span className="text-emerald-500">✓</span>
                  <p className="text-[11px] leading-5 text-muted-foreground">
                    Tu orden será registrada antes de iniciar el proceso de pago.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="text-emerald-500">✓</span>
                  <p className="text-[11px] leading-5 text-muted-foreground">
                    El precio definitivo debe ser validado en el servidor.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="text-emerald-500">✓</span>
                  <p className="text-[11px] leading-5 text-muted-foreground">
                    Nunca compartiremos tus credenciales de acceso con terceros.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </main>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background px-4 py-16">
          <div className="mx-auto max-w-3xl animate-pulse space-y-6">
            <div className="h-8 w-48 rounded-lg bg-muted" />
            <div className="h-32 rounded-2xl bg-muted" />
            <div className="h-48 rounded-2xl bg-muted" />
          </div>
        </main>
      }
    >
      <CheckoutContent />
    </Suspense>
  )
}
```
