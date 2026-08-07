'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

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
      // Simulación de registro de orden en base de datos
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
          <div className="rounded bg-green-100 p-4 text-center text-green-700">
            <h2 className="font-bold text-lg">¡Compra realizada con éxito!</h2>
            <p className="mt-2 text-sm">Tu orden ha sido procesada correctamente.</p>
          </div>
        ) : (
          <form onSubmit={handleSimulateCheckout} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Método de Pago</label>
              <div className="rounded border p-4 bg-gray-50 text-gray-700 font-medium">
                Simulación de Tarjeta de Crédito (Integración con Pasarela de Pagos)
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-green-600 py-3 font-semibold text-white hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? 'Procesando...' : 'Pagar Ahora ($99.99)'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}