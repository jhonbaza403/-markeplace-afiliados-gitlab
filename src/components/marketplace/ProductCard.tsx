'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types/products'

interface ProductCardProps {
  product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const title = product.title?.trim() || 'Producto sin título'
  const description =
    product.description?.trim() || 'Sin descripción disponible'

  const imageUrl =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : null

  const currency = product.currency || 'USD'

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(product.price ?? 0)

  return (
    <article
      className="
        group flex h-full flex-col overflow-hidden
        rounded-2xl border border-slate-200
        bg-white shadow-sm
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl
      "
    >
      {/* =====================================================
          IMAGEN
      ====================================================== */}
      <Link
        href={`/marketplace/products/${product.id}`}
        aria-label={`Ver detalles de ${title}`}
        className="block"
      >
        <div className="relative h-52 w-full overflow-hidden bg-slate-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="
                (max-width: 640px) 100vw,
                (max-width: 1024px) 50vw,
                25vw
              "
              className="
                object-cover
                transition-transform duration-500
                group-hover:scale-105
              "
            />
          ) : (
            <div
              className="
                flex h-full w-full
                items-center justify-center
                bg-slate-100
                text-slate-400
              "
              aria-label="Producto sin imagen"
            >
              <div className="text-center">
                <div className="mb-2 text-3xl" aria-hidden="true">
                  📦
                </div>

                <span className="text-xs font-medium">
                  Sin imagen
                </span>
              </div>
            </div>
          )}

          {/* Indicador visual */}
          <div
            className="
              absolute left-3 top-3
              rounded-full
              bg-black/60
              px-2.5 py-1
              text-[10px]
              font-bold
              uppercase
              tracking-wide
              text-white
              backdrop-blur-sm
            "
          >
            Marketplace
          </div>
        </div>
      </Link>

      {/* =====================================================
          INFORMACIÓN
      ====================================================== */}
      <div className="flex flex-1 flex-col p-5">

        {/* TÍTULO */}
        <Link
          href={`/marketplace/products/${product.id}`}
          className="focus:outline-none"
        >
          <h3
            className="
              line-clamp-2
              text-base
              font-bold
              leading-tight
              text-slate-900
              transition-colors
              group-hover:text-indigo-600
            "
          >
            {title}
          </h3>
        </Link>

        {/* DESCRIPCIÓN */}
        <p
          className="
            mt-2
            line-clamp-3
            text-sm
            leading-relaxed
            text-slate-500
          "
        >
          {description}
        </p>

        {/* ===================================================
            PRECIO + ACCIÓN
        ==================================================== */}
        <div className="mt-auto flex items-end justify-between gap-4 pt-5">

          {/* PRECIO */}
          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Precio
            </span>

            <span className="text-xl font-extrabold text-indigo-600">
              {formattedPrice}
            </span>
          </div>

          {/* DETALLE */}
          <Link
            href={`/marketplace/products/${product.id}`}
            className="
              shrink-0
              rounded-xl
              bg-indigo-50
              px-3.5 py-2
              text-xs
              font-bold
              text-indigo-600
              transition-all
              hover:bg-indigo-600
              hover:text-white
              focus:outline-none
              focus:ring-2
              focus:ring-indigo-500
              focus:ring-offset-2
            "
          >
            Ver detalle
          </Link>
        </div>
      </div>
    </article>
  )
}

export default ProductCard