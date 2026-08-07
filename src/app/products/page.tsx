'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Catálogo de Productos</h1>
        <Link href="/dashboard/affiliate" className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition">
          Ver Panel de Afiliado
        </Link>
      </div>

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

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-blue-600">${product.price}</span>
                  <span className="text-xs text-gray-500">Stock: {product.stock}</span>
                </div>
                <Link
                  href={`/products/${product.id}`}
                  className="block w-full rounded bg-blue-600 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700 transition"
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