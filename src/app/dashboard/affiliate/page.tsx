'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'

interface AffiliateStat {
  total_referrals: number
  total_earnings: number
}

export default function AffiliateDashboardPage() {
  const { user, profile, loading } = useAuth()
  const [stats, setStats] = useState<AffiliateStat>({ total_referrals: 0, total_earnings: 0 })
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (user && profile?.role === 'affiliate') {
      fetchAffiliateData()
    } else {
      setFetching(false)
    }
  }, [user, profile])

  const fetchAffiliateData = async () => {
    try {
      // Simulación de consulta de estadísticas de afiliados
      setStats({
        total_referrals: 12,
        total_earnings: 150.00
      })
    } catch (error) {
      console.error('Error al cargar datos de afiliado:', error)
    } finally {
      setFetching(false)
    }
  }

  if (loading || fetching) {
    return <div className="flex min-h-screen items-center justify-center">Cargando panel de afiliado...</div>
  }

  if (!user || profile?.role !== 'affiliate') {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div>
          <h2 className="text-xl font-bold text-red-600">Acceso No Autorizado</h2>
          <p className="mt-2 text-gray-600">No tienes permisos para ver el panel de afiliados.</p>
        </div>
      </div>
    )
  }

  const affiliateLink = `https://marketplace.com/products?ref=${user.id}`

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Panel de Afiliado</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-8">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Total de Referidos</h3>
          <p className="mt-2 text-3xl font-extrabold text-blue-600">{stats.total_referrals}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Comisiones Acumuladas</h3>
          <p className="mt-2 text-3xl font-extrabold text-green-600">${stats.total_earnings.toFixed(2)}</p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-700">Tu Enlace de Afiliado Personal</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            readOnly
            value={affiliateLink}
            className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-600 select-all"
          />
          <button
            onClick={() => navigator.clipboard.writeText(affiliateLink)}
            className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 transition"
          >
            Copiar
          </button>
        </div>
      </div>
    </div>
  )
}