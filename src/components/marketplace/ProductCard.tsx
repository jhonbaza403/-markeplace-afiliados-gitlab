'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/products';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="h-48 w-full bg-gray-100">
        {product.images && product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            Sin imagen
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
          {product.title}
        </h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-indigo-600">
            {product.currency} ${product.price.toFixed(2)}
          </span>
          <Link
            href={`/marketplace/products/${product.id}`}
            className="rounded-md bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-100"
          >
            Ver Detalle
          </Link>
        </div>
      </div>
    </div>
  );
};