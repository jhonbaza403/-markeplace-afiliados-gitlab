'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Product {
  id: string
  title: string
  description: string
  price: number
  stock: number
  store_id: string
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchProductDetail()
    }
  }, [id])

  const fetchProductDetail = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
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
        <p className="mt-4 text-gray-600 leading-relaxed">{product.description}</p>
        
        <div className="mt-6 flex items-center justify-between border-t pt-6">
          <span className="text-3xl font-extrabold text-blue-600">${product.price}</span>
          <span className="text-sm font-medium text-gray-500">Stock disponible: {product.stock}</span>
        </div>

        <div className="mt-8">
          <button className="w-full rounded bg-blue-600 py-3 text-center font-semibold text-white hover:bg-blue-700 transition">
            Comprar o Generar Enlace de Afiliado
          </button>
        </div>
      </div>
    </div>
  )
}