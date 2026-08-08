'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import UserReputationBadge from '@/components/UserReputationBadge'
import RatingModal from '@/components/RatingModal'

interface Product {
  id: string
  title: string
  description: string
  price: number
  stock: number
  store_id: string
  store?: {
    store_name: string
    vendor_id: string
  }
}

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' }
  ]
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRatingOpen, setIsRatingOpen] = useState(false)

  useEffect(() => {
    if (id) {
      fetchProductDetail()
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
    return <div className="flex min-h-screen items-center justify-center">Cargando detalles...</div>
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center text-center">
        <h2 className="text-xl font-bold text-gray-700">Producto no encontrado</h2>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="rounded-lg bg-white p-8 shadow-md">
        <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
        
        {product.store && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div>
              <span className="text-xs text-gray-400 block uppercase font-bold">Vendido por</span>
              <span className="text-sm font-bold text-gray-800">{product.store.store_name}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <UserReputationBadge userId={product.store.vendor_id} />
              
              <button
                onClick={() => setIsRatingOpen(true)}
                className="px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition"
              >
                Calificar Vendedor ⭐
              </button>
            </div>
          </div>
        )}

        <p className="mt-4 text-gray-600 leading-relaxed">{product.description}</p>
        
        <div className="mt-6 flex items-center justify-between border-t pt-6">
          <span className="text-3xl font-extrabold text-blue-600">${product.price}</span>
          <span className="text-sm font-medium text-gray-500">Stock disponible: {product.stock}</span>
        </div>

        <div className="mt-8">
          <button className="w-full rounded-xl bg-blue-600 py-3 text-center font-semibold text-white hover:bg-blue-700 transition shadow-lg shadow-blue-100">
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