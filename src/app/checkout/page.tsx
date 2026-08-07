'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CheckoutPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSimulateCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      router.push('/auth/login')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('orders')
        .insert({
          buyer_id: user.id,
          total_amount: 99.99,
          status: 'completed'
        })

      if (error) throw error
      setSuccess(true)
    } catch (error) {
      console.error('Error al procesar el pago:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Finalizar Compra / Checkout</h1>
        
        {success ? (
          <div className="space-y-4">
            <div className="rounded bg-green-100 p-4 text-center text-green-700">
              <h2 className="font-bold text-lg">¡Compra realizada con éxito!</h2>
              <p className="mt-2 text-sm">Tu orden ha sido procesada correctamente.</p>
            </div>
            <Link
              href="/products"
              className="block w-full rounded bg-blue-600 py-3 text-center font-semibold text-white hover:bg-blue-700 transition"
            >
              Volver al Catálogo
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSimulateCheckout} className="space-y-6">
            <div className="rounded-lg border p-4 bg-gray-50">
              <h2 className="font-semibold text-gray-700 mb-2">Resumen de la Orden</h2>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Producto / Suscripción</span>
                <span className="font-medium">$99.99</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-800 border-t pt-2 mt-2">
                <span>Total a Pagar</span>
                <span className="text-green-600">$99.99</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Método de Pago</label>
              <div className="rounded border p-4 bg-white text-gray-700 font-medium flex items-center justify-between">
                <span>Simulación de Tarjeta de Crédito</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded font-semibold">Seguro / Encriptado</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-green-600 py-3 font-semibold text-white hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? 'Procesando pago...' : 'Pagar Ahora ($99.99)'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}