'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'

interface Store {
  id: string
  name: string
  is_approved: boolean
  vendor_id: string
}

export default function AdminDashboardPage() {
  const { user, profile, loading } = useAuth()
  const [stores, setStores] = useState<Store[]>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      fetchStores()
    } else {
      setFetching(false)
    }
  }, [user, profile])

  const fetchStores = async () => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')

      if (error) throw error
      setStores(data || [])
    } catch (error) {
      console.error('Error al cargar las tiendas:', error)
    } finally {
      setFetching(false)
    }
  }

  const toggleApproval = async (storeId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('stores')
        .update({ is_approved: !currentStatus })
        .eq('id', storeId)

      if (error) throw error
      setStores(stores.map(store => store.id === storeId ? { ...store, is_approved: !currentStatus } : store))
    } catch (error) {
      console.error('Error al actualizar el estado de la tienda:', error)
    }
  }

  if (loading || fetching) {
    return <div className="flex min-h-screen items-center justify-center">Cargando panel de administración...</div>
  }

  if (!user || profile?.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div>
          <h2 className="text-xl font-bold text-red-600">Acceso No Autorizado</h2>
          <p className="mt-2 text-gray-600">No tienes permisos para ver el panel de administración.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Panel de Administración</h1>
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-700">Gestión de Tiendas y Vendedores</h2>
        {stores.length === 0 ? (
          <p className="text-gray-500">No hay tiendas registradas en la plataforma.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="p-3">Nombre de la Tienda</th>
                  <th className="p-3">ID del Vendedor</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store) => (
                  <tr key={store.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-800">{store.name}</td>
                    <td className="p-3 text-sm text-gray-500">{store.vendor_id}</td>
                    <td className="p-3">
                      <span className={`rounded px-2 py-1 text-xs font-semibold ${store.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {store.is_approved ? 'Aprobada' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleApproval(store.id, store.is_approved)}
                        className={`rounded px-3 py-1 text-xs font-semibold text-white transition ${store.is_approved ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}`}
                      >
                        {store.is_approved ? 'Revocar' : 'Aprobar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}