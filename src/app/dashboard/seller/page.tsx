'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Product {
  id: string
  title: string
  price: number
  stock: number
  is_active: boolean
}

export default function SellerDashboardPage() {
  const { user, profile, loading } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (user && profile?.role === 'vendor') {
      fetchVendorProducts()
    } else {
      setFetching(false)
    }
  }, [user, profile])

  const fetchVendorProducts = async () => {
    try {
      const { data: storeData } = await supabase
        .from('stores')
        .select('id')
        .eq('vendor_id', user?.id)
        .single()

      if (storeData) {
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .eq('store_id', storeData.id)

        setProducts(productsData || [])
      }
    } catch (error) {
      console.error('Error al cargar productos del vendedor:', error)
    } finally {
      setFetching(false)
    }
  }

  if (loading || fetching) {
    return <div className="flex min-h-screen items-center justify-center">Cargando panel...</div>
  }

  if (!user || profile?.role !== 'vendor') {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div>
          <h2 className="text-xl font-bold text-red-600">Acceso No Autorizado</h2>
          <p className="mt-2 text-gray-600">No tienes permisos para ver el panel de vendedor.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Panel de Vendedor / Empresa</h1>
          <p className="text-gray-600 mt-1">Gestiona tu inventario, publicaciones y ofertas comerciales.</p>
        </div>
        <Link
          href="/products/create"
          className="rounded bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition shrink-0"
        >
          + Publicar Nuevo Producto / Vacante
        </Link>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-700">Tus Productos en Inventario</h2>
        {products.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500 mb-4">Aún no tienes productos registrados en tu tienda.</p>
            <Link
              href="/products/create"
              className="inline-block rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
            >
              Crear tu primer producto
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="p-3">Título</th>
                  <th className="p-3">Precio</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-800">{product.title}</td>
                    <td className="p-3 text-gray-600">${product.price}</td>
                    <td className="p-3 text-gray-600">{product.stock}</td>
                    <td className="p-3">
                      <span className={`rounded px-2 py-1 text-xs font-semibold ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.is_active ? 'Activo' : 'Inactivo'}
                      </span>
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