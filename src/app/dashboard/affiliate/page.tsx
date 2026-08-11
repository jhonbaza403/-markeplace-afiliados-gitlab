'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'

interface AffiliateStat {
  total_referrals: number
  total_earnings: number
}

export default function AffiliateDashboardPage() {
  const { user, profile, loading } = useAuth()
  const [stats, setStats] = useState<AffiliateStat>({ total_referrals: 0, total_earnings: 0 })
  const [fetching, setFetching] = useState(true)
  const [copied, setCopied] = useState(false)
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin)
    }
  }, [])

  useEffect(() => {
    if (user && (profile?.role === 'affiliate' || profile?.role === 'vendor')) {
      fetchAffiliateData()
    } else {
      setFetching(false)
    }
  }, [user, profile])

  const fetchAffiliateData = async () => {
    try {
      const supabase = createClient()

      // Consultar órdenes reales asociadas al código/ID del afiliado
      const { data: orders, error } = await supabase
        .from('orders')
        .select('total_amount, status')
        .eq('affiliate_ref', user?.id)

      if (error) throw error

      if (orders) {
        const totalReferrals = orders.length
        // Cálculo estimado de comisión (ej. 10% del total vendido)
        const totalEarnings = orders.reduce((acc, order) => acc + (order.total_amount * 0.10), 0)

        setStats({
          total_referrals: totalReferrals,
          total_earnings: totalEarnings,
        })
      }
    } catch (error) {
      console.error('Error al cargar datos de afiliado:', error)
    } finally {
      setFetching(false)
    }
  }

  const handleCopy = (link: string) => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading || fetching) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">Cargando panel de afiliado...</div>
  }

  if (!user || (profile?.role !== 'affiliate' && profile?.role !== 'vendor')) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div>
          <h2 className="text-xl font-bold text-red-600">Acceso No Autorizado</h2>
          <p className="mt-2 text-sm text-gray-600">No tienes permisos para ver el panel de afiliados.</p>
        </div>
      </div>
    )
  }

  const affiliateLink = `${origin}/products?ref=${user.id}`

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Panel de Afiliado</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-8">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Total de Referidos</h3>
          <p className="mt-2 text-3xl font-black text-blue-600">{stats.total_referrals}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Comisiones Estimadas</h3>
          <p className="mt-2 text-3xl font-black text-emerald-600">${stats.total_earnings.toFixed(2)}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-800">Tu Enlace de Afiliado Personal</h2>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            readOnly
            value={affiliateLink}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 select-all focus:outline-none"
          />
          <button
            onClick={() => handleCopy(affiliateLink)}
            className="w-full sm:w-auto shrink-0 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500 transition cursor-pointer"
          >
            {copied ? '¡Copiado!' : 'Copiar'}
          </button>
        </div>
      </div>
    </div>
  )
}