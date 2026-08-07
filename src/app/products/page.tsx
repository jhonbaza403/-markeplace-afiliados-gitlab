'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Product {
  id: string
  title: string
  description: string
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
    return <div className="flex min-h-screen items-center justify-center">Cargando productos...</div>
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Catálogo de Productos</h1>
      {products.length === 0 ? (
        <p className="text-gray-500">No hay productos disponibles en este momento.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="rounded-lg bg-white p-4 shadow-md flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{product.description}</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xl font-bold text-blue-600">${product.price}</span>
                <span className="text-xs text-gray-500">Stock: {product.stock}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}