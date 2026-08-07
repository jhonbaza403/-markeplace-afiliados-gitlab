import React from 'react'
import { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-48 bg-gray-100 relative">
        {product.images && product.images.length > 0 ? (
          <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">Sin imagen</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-lg truncate">{product.title}</h3>
        <p className="text-gray-500 text-sm line-clamp-2 mt-1">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
          <button
            onClick={() => onAddToCart && onAddToCart(product)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Comprar
          </button>
        </div>
      </div>
    </div>
  )
}