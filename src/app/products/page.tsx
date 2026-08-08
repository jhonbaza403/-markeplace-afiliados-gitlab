'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Product {
  id: string
  title: string
  description?: string
  price: number
  stock: number
  store_id: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error al cargar productos:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-600 font-medium">
        Cargando productos...
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Catálogo de Productos</h1>
        <Link 
          href="/dashboard/affiliate" 
          className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition shadow-sm"
        >
          Ver Panel de Afiliado
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
          <p className="text-gray-500">No hay productos disponibles en este momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {product.description || 'Sin descripción disponible'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-extrabold text-blue-600">
                    ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                  </span>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    Stock: {product.stock ?? 0}
                  </span>
                </div>
                <Link
                  href={`/products/detail?id=${product.id}`}
                  className="block w-full rounded-xl bg-blue-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700 transition shadow-sm"
                >
                  Ver Detalle y Afiliarme
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}