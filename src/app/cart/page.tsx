'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, totalAmount } = useCart();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Carrito de Compras</h1>

        {cart.length === 0 ? (
          <div className="mt-6 text-center text-gray-500">
            Tu carrito está vacío.{' '}
            <Link href="/marketplace" className="text-indigo-600 underline">
              Explorar productos
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between border-b pb-4"
              >
                <div>
                  <h3 className="font-semibold">{item.product.title}</h3>
                  <p className="text-sm text-gray-500">
                    Cantidad: {item.quantity} x ${item.product.price}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Eliminar
                </button>
              </div>
            ))}

            <div className="mt-6 flex items-center justify-between border-t pt-4">
              <span className="text-xl font-bold">Total:</span>
              <span className="text-xl font-bold text-indigo-600">
                ${totalAmount.toFixed(2)}
              </span>
            </div>

            <Link
              href="/checkout"
              className="mt-6 block w-full rounded-md bg-indigo-600 py-3 text-center text-white font-semibold hover:bg-indigo-700"
            >
              Proceder al Pago
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}