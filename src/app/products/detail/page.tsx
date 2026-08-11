'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  stock: number
}

function ProductDetailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const productId = searchParams.get('id')
  const refCode = searchParams.get('ref')

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProduct() {
      if (!productId) {
        setLoading(false)
        return
      }

      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single()

        if (error) throw error
        setProduct(data)
      } catch (err: unknown) {
        console.error('Error al cargar producto:', err)
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('No se pudo encontrar el producto solicitado.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  const handleBuyNow = () => {
    if (!product) return
    const checkoutUrl = refCode
      ? `/checkout?product_id=${product.id}&ref=${refCode}`
      : `/checkout?product_id=${product.id}`

    router.push(checkoutUrl)
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-gray-500 animate-pulse">
        Cargando detalles del producto...
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-800">Producto no encontrado</h2>
        <p className="mt-2 text-sm text-gray-500">
          El producto que intentas ver no existe o no se proporcionó un ID válido.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Volver al Catálogo
        </Link>
      </div>
    )
  }

  const mainImage =
    product.images?.[0] ||
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500&auto=format&fit=crop'

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Imagen principal */}
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm">
          <Image
            src={mainImage}
            alt={product.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Detalles e Información */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            {refCode && (
              <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200 mb-3">
                ✓ Enlace de afiliado activo: {refCode}
              </span>
            )}
            <h1 className="text-3xl font-extrabold text-gray-900">{product.title}</h1>
            <p className="mt-4 text-3xl font-black text-blue-600">${product.price.toFixed(2)}</p>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              {product.description || 'Sin descripción disponible.'}
            </p>
          </div>

          <div className="space-y-4 border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Disponibilidad:</span>
              <span className="font-bold text-emerald-600">
                {product.stock > 0 ? `${product.stock} unidades disponibles` : 'Agotado'}
              </span>
            </div>

            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-900/10 transition hover:bg-blue-500 disabled:opacity-50 cursor-pointer"
            >
              Comprar Ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Cargando producto...</div>}>
      <ProductDetailContent />
    </Suspense>
  )
}