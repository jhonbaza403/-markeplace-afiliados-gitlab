'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import UserReputationBadge from '@/components/UserReputationBadge'
import RatingModal from '@/components/RatingModal'

interface Product {
  id: string
  title: string
  description?: string
  price: number
  stock: number
  store_id: string
  store?: {
    store_name: string
    vendor_id: string
  }
}

function ProductDetailContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRatingOpen, setIsRatingOpen] = useState(false)

  useEffect(() => {
    if (id) {
      fetchProductDetail()
    } else {
      setLoading(false)
    }
  }, [id])

  const fetchProductDetail = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          store:stores(store_name, vendor_id)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setProduct(data)
    } catch (error) {
      console.error('Error al cargar el producto:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-600 font-medium">
        Cargando detalles...
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center text-center bg-gray-50">
        <h2 className="text-xl font-bold text-gray-700">Producto no encontrado</h2>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 bg-gray-50 min-h-screen">
      <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-800">{product.title}</h1>
        
        {product.store && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div>
              <span className="text-xs text-gray-400 block uppercase font-bold tracking-wider">Vendido por</span>
              <span className="text-sm font-bold text-gray-800">{product.store.store_name}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <UserReputationBadge userId={product.store.vendor_id} />
              
              <button
                onClick={() => setIsRatingOpen(true)}
                className="px-3.5 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition shadow-sm"
              >
                Calificar Vendedor ⭐
              </button>
            </div>
          </div>
        )}

        <p className="mt-6 text-gray-600 leading-relaxed">
          {product.description || 'Sin descripción disponible para este producto.'}
        </p>
        
        <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
          <span className="text-3xl font-extrabold text-blue-600">
            ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
          </span>
          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
            Stock disponible: {product.stock ?? 0}
          </span>
        </div>

        <div className="mt-8">
          <button className="w-full rounded-xl bg-blue-600 py-3 text-center font-semibold text-white hover:bg-blue-700 transition shadow-md shadow-blue-100">
            Comprar o Generar Enlace de Afiliado
          </button>
        </div>
      </div>

      {product.store && (
        <RatingModal
          isOpen={isRatingOpen}
          onClose={() => setIsRatingOpen(false)}
          targetUserName={product.store.store_name}
          targetUserId={product.store.vendor_id}
          role="vendedor"
        />
      )}
    </div>
  )
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-600 font-medium">
        Cargando página...
      </div>
    }>
      <ProductDetailContent />
    </Suspense>
  )
}