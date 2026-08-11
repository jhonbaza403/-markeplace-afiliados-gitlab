'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Product {
  id: string
  title: string
  price: number
}

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const productId = searchParams.get('product_id')
  const refCode = searchParams.get('ref')

  const [product, setProduct] = useState<Product | null>(null)
  const [loadingProduct, setLoadingProduct] = useState(true)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProduct() {
      if (!productId) {
        setLoadingProduct(false)
        return
      }

      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('products')
          .select('id, title, price')
          .eq('id', productId)
          .single()

        if (error) throw error
        if (data) setProduct(data)
      } catch (err) {
        console.error('Error al obtener producto:', err)
      } finally {
        setLoadingProduct(false)
      }
    }

    fetchProduct()
  }, [productId])

  const handleSimulateCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    try {
      const supabase = createClient()

      // 1. Verificar sesión activa del usuario
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        router.push(`/auth/login?redirectTo=/checkout?product_id=${productId}`)
        return
      }

      // 2. Registrar la orden en Supabase
      const { error } = await supabase
        .from('orders')
        .insert({
          buyer_id: user.id,
          product_id: product?.id || null,
          total_amount: product ? product.price : 99.99,
          affiliate_ref: refCode || null,
          status: 'completed'
        })

      if (error) throw error
      setSuccess(true)
    } catch (err: unknown) {
      console.error('Error al procesar el pago:', err)
      if (err instanceof Error) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('Ocurrió un error al procesar el pago. Por favor intenta nuevamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loadingProduct) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 text-center text-sm text-gray-500 animate-pulse">
        Cargando detalles de la orden...
      </div>
    )
  }

  const finalPrice = product ? product.price : 99.99
  const itemTitle = product ? product.title : 'Producto / Suscripción'

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Finalizar Compra / Checkout</h1>

        {errorMessage && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 border border-red-200 text-xs text-red-600">
            {errorMessage}
          </div>
        )}

        {success ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-green-50 p-4 text-center text-green-700 border border-green-200">
              <h2 className="font-bold text-lg">¡Compra realizada con éxito!</h2>
              <p className="mt-1 text-sm">
                Tu orden de <span className="font-semibold">{itemTitle}</span> ha sido procesada correctamente.
              </p>
              {refCode && (
                <p className="mt-1 text-xs text-green-600 font-medium">
                  Comisión acreditada al afiliado: {refCode}
                </p>
              )}
            </div>
            <Link
              href="/marketplace"
              className="block w-full rounded-xl bg-blue-600 py-3 text-center font-semibold text-white hover:bg-blue-700 transition shadow-sm"
            >
              Volver al Catálogo
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSimulateCheckout} className="space-y-6">
            <div className="rounded-xl border border-gray-200 p-4 bg-gray-50/50">
              <h2 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">
                Resumen de la Orden
              </h2>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{itemTitle}</span>
                <span className="font-medium">${finalPrice.toFixed(2)}</span>
              </div>
              {refCode && (
                <div className="text-[11px] text-emerald-600 font-semibold mb-2">
                  ✓ Código de afiliado aplicado: {refCode}
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-gray-800 border-t border-gray-200 pt-3 mt-2">
                <span>Total a Pagar</span>
                <span className="text-emerald-600">${finalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                Método de Pago
              </label>
              <div className="rounded-xl border border-gray-200 p-4 bg-white text-gray-700 font-medium flex items-center justify-between">
                <span>Simulación de Tarjeta de Crédito</span>
                <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg font-semibold border border-blue-100">
                  Seguro / Encriptado
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 py-3.5 font-bold text-white hover:bg-emerald-500 transition shadow-md disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Procesando pago...' : `Pagar Ahora ($${finalPrice.toFixed(2)})`}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Cargando checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}