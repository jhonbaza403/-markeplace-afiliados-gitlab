'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface B2BOrder {
  id: string
  product_title: string
  quantity: number
  unit_price_usd: number
  total_usd: number
  payment_method: string
  binance_tx_id: string
  status: 'pending' | 'verifying' | 'completed' | 'cancelled'
  created_at: string
}

export default function SupplierB2BOrdersPage() {
  const [orders, setOrders] = useState<B2BOrder[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('b2b_orders')
      .select('*')
      .eq('supplier_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error al cargar las órdenes B2B:', error)
    } else {
      setOrders(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const updateOrderStatus = async (orderId: string, newStatus: 'completed' | 'cancelled') => {
    const supabase = createClient()
    const { error } = await supabase
      .from('b2b_orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (error) {
      console.error('Error al actualizar la orden:', error)
      alert('Hubo un error al actualizar el estado de la orden.')
    } else {
      alert(`Orden marcada como ${newStatus === 'completed' ? 'Completada' : 'Cancelada'}`)
      fetchOrders()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-sm font-semibold animate-pulse">Cargando órdenes mayoristas recibidas...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center border-b border-border pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded border border-amber-500/20">
              Panel de Proveedor 📦
            </span>
            <h1 className="text-2xl font-black text-foreground mt-1">Gestión de Órdenes B2B</h1>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center space-y-3">
            <p className="text-sm text-muted-foreground">No has recibido órdenes mayoristas todavía.</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-xs text-muted-foreground uppercase font-semibold">
                    <th className="p-4">Producto / Lote</th>
                    <th className="p-4">Cantidad</th>
                    <th className="p-4">Total (USDT)</th>
                    <th className="p-4">Método / Tx ID</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/20 transition">
                      <td className="p-4 font-bold text-foreground max-w-xs truncate">{order.product_title}</td>
                      <td className="p-4">{order.quantity} unids.</td>
                      <td className="p-4 font-black text-amber-500">${order.total_usd.toFixed(2)}</td>
                      <td className="p-4 space-y-1">
                        <span className="block font-semibold uppercase text-[10px] text-muted-foreground">
                          {order.payment_method}
                        </span>
                        <span className="font-mono bg-muted px-2 py-0.5 rounded text-[10px] border border-border block w-fit">
                          {order.binance_tx_id}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                          order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                          order.status === 'verifying' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                          'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {order.status === 'verifying' && (
                          <>
                            <button
                              onClick={() => updateOrderStatus(order.id, 'completed')}
                              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg transition cursor-pointer shadow"
                            >
                              Aprobar
                            </button>
                            <button
                              onClick={() => updateOrderStatus(order.id, 'cancelled')}
                              className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 font-bold px-3 py-1.5 rounded-lg transition cursor-pointer"
                            >
                              Rechazar
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}