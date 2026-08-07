import React from 'react'
import { Product } from '@/types/product'

interface ProductDetailPageProps {
  params: {
    slug: string
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = params

  // Aquí consultaremos posteriormente el producto real usando Prisma o Supabase mediante el slug
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-80 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
            Imagen del producto
          </div>
          <div>
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Detalle del Producto</span>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-2">Slug: {slug}</h1>
            <p className="text-2xl font-bold text-gray-800 mt-4">$0.00</p>
            <p className="text-gray-600 mt-4">
              Esta es la vista dinámica preparada para mostrar las especificaciones detalladas, la descripción del vendedor y el botón de compra o adición al carrito.
            </p>
            <div className="mt-8 flex gap-4">
              <button className="flex-1 bg-blue-600 text-white font-medium py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors">
                Agregar al Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}