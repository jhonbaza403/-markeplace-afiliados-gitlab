'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { useCart } from '@/context/CartContext'


interface CartProduct {
  id: string
  title: string
  price: number | string
  image_url?: string | null
  stock?: number | null
  is_active?: boolean
}


interface CartItem {
  product: CartProduct
  quantity: number
}


interface CartContextValue {
  cart: CartItem[]
  removeFromCart: (productId: string) => void
  totalAmount: number
}



function formatCurrency(value: number): string {

  return new Intl.NumberFormat('en-US', {

    style: 'currency',

    currency: 'USD',

    minimumFractionDigits: 2,

    maximumFractionDigits: 2,

  }).format(value)

}



function normalizePrice(
  value: number | string,
): number {

  const parsed =
    typeof value === 'number'
      ? value
      : Number(value)


  if (
    !Number.isFinite(parsed)
    ||
    parsed < 0
  ) {

    return 0

  }


  return parsed

}



function normalizeQuantity(
  value: number,
): number {


  const parsed =
    Number(value)


  if (
    !Number.isFinite(parsed)
    ||
    parsed <= 0
  ) {

    return 0

  }


  return Math.floor(parsed)

}



export default function CartPage() {


  const {

    cart,

    removeFromCart,

    totalAmount,

  } =
    useCart() as CartContextValue



  const [
    removingId,
    setRemovingId,
  ] =
    useState<string | null>(null)





  const normalizedCart =
    useMemo(() => {


      return cart

        .map((item) => {


          const price =
            normalizePrice(
              item.product.price,
            )


          const quantity =
            normalizeQuantity(
              item.quantity,
            )



          return {

            ...item,

            price,

            quantity,

            subtotal:
              Number(
                (
                  price *
                  quantity
                ).toFixed(2),
              ),

          }


        })

        .filter(
          (item) =>
            item.quantity > 0,
        )


    }, [cart])





  const calculatedTotal =
    useMemo(() => {


      return Number(

        normalizedCart

          .reduce(

            (
              total,
              item,
            ) =>
              total +
              item.subtotal,

            0,

          )

          .toFixed(2),

      )


    }, [normalizedCart])
