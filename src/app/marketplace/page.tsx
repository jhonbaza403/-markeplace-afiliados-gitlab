import React from 'react'
import { ProductCard } from '@/features/marketplace/components/ProductCard'
import { Product } from '@/types/product'

// Datos de prueba temporales para validar el diseño y el componente
const mockProducts: Product[] = [
  {
    id: '1',
    store_id: 'store-1',
    title: 'Smartphone de Última Generación',
    slug: 'smartphone-ultima-generacion',
    description: 'Pantalla AMOLED de 6.7 pulgadas, 256GB de almacenamiento y cámara dual.',
    price: 499.99,
    stock: 15,
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500&auto=format&fit=crop'],
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    store_id: 'store-2',
    title: 'Laptop Profesional Ultradelgada',
    slug: 'laptop-profesional-ultradelgada',
    description: 'Procesador de alta velocidad, 16GB RAM y disco estado sólido de 512GB.',
    price: 899.50,
    stock: 8,
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=500&auto=format&fit=crop'],
    is_active: true,
    created_at: new Date().toISOString(),
  },
]

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Credi Marketplace</h1>
          <p className="mt-2 text-sm text-gray-600">
            Explora una amplia variedad de productos y servicios de nuestros vendedores verificados.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}