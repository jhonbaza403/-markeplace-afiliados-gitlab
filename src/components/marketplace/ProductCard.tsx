'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Product } from '@/types/products'

// ==========================================================
// ARCHIVO: src/components/marketplace/ProductCard.tsx
// Credi Marketplace
//
// TARJETA PREMIUM DE PRODUCTO
//
// Características:
// - Compatible con Next.js Image
// - Enlace al detalle del producto
// - Manejo seguro de título y descripción
// - Manejo de productos sin imagen
// - Formateo internacional de moneda
// - Diseño responsive
// - Accesibilidad
// - Estados hover/focus
// - Estructura preparada para Marketplace
// ==========================================================

// ==========================================================
// TIPOS
// ==========================================================

interface ProductCardProps {
  product: Product
}

// ==========================================================
// COMPONENTE
// ==========================================================

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
}) => {
  // ========================================================
  // NORMALIZACIÓN
  // ========================================================

  const productId = product.id

  const title =
    typeof product.title === 'string' &&
    product.title.trim().length > 0
      ? product.title.trim()
      : 'Producto sin título'

  const description =
    typeof product.description === 'string' &&
    product.description.trim().length > 0
      ? product.description.trim()
      : 'Sin descripción disponible'

  // ========================================================
  // IMAGEN
  // ========================================================

  const imageUrl =
    Array.isArray(product.images) &&
    product.images.length > 0 &&
    typeof product.images[0] === 'string' &&
    product.images[0].trim().length > 0
      ? product.images[0].trim()
      : null

  // ========================================================
  // MONEDA
  // ========================================================

  const currency =
    typeof product.currency === 'string' &&
    product.currency.trim().length > 0
      ? product.currency.trim().toUpperCase()
      : 'USD'

  // ========================================================
  // PRECIO
  // ========================================================

  const numericPrice =
    typeof product.price === 'number' &&
    Number.isFinite(product.price)
      ? product.price
      : 0

  const formattedPrice = new Intl.NumberFormat(
    'en-US',
    {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  ).format(numericPrice)

  // ========================================================
  // URL DEL PRODUCTO
  // ========================================================

  const productHref =
    `/marketplace/products/${encodeURIComponent(
      String(productId),
    )}`

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <article
      className="
        group
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
        focus-within:ring-2
        focus-within:ring-indigo-500
        focus-within:ring-offset-2
      "
    >
      {/* ====================================================
          IMAGEN
      ===================================================== */}

      <Link
        href={productHref}
        aria-label={`Ver detalles de ${title}`}
        className="
          block
          focus:outline-none
        "
      >
        <div
          className="
            relative
            h-52
            w-full
            overflow-hidden
            bg-slate-100
          "
        >
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
                transition-transform
                duration-500
                group-hover:scale-105
              "
            />
          ) : (
            <div
              className="
                flex
                h-full
                w-full
                items-center
                justify-center
                bg-slate-100
                text-slate-400
              "
              role="img"
              aria-label="Producto sin imagen"
            >
              <div className="text-center">
                <div
                  className="mb-2 text-3xl"
                  aria-hidden="true"
                >
                  📦
                </div>

                <span className="text-xs font-medium">
                  Sin imagen
                </span>
              </div>
            </div>
          )}

          {/* ==================================================
              ETIQUETA
          ================================================== */}

          <div
            className="
              absolute
              left-3
              top-3
              rounded-full
              bg-black/60
              px-2.5
              py-1
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

      {/* ====================================================
          INFORMACIÓN
      ===================================================== */}

      <div
        className="
          flex
          flex-1
          flex-col
          p-5
        "
      >
        {/* ==================================================
            TÍTULO
        ================================================== */}

        <Link
          href={productHref}
          aria-label={`Ver ${title}`}
          className="
            rounded-lg
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-indigo-500
            focus-visible:ring-offset-2
          "
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

        {/* ==================================================
            DESCRIPCIÓN
        ================================================== */}

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

        {/* ==================================================
            PRECIO + ACCIÓN
        ================================================== */}

        <div
          className="
            mt-auto
            flex
            items-end
            justify-between
            gap-4
            pt-5
          "
        >
          {/* =================================================
              PRECIO
          ================================================== */}

          <div>
            <span
              className="
                block
                text-[10px]
                font-semibold
                uppercase
                tracking-wider
                text-slate-400
              "
            >
              Precio
            </span>

            <span
              className="
                text-xl
                font-extrabold
                text-indigo-600
              "
              aria-label={`Precio ${formattedPrice}`}
            >
              {formattedPrice}
            </span>
          </div>

          {/* =================================================
              BOTÓN DETALLE
          ================================================== */}

          <Link
            href={productHref}
            className="
              shrink-0
              rounded-xl
              bg-indigo-50
              px-3.5
              py-2
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