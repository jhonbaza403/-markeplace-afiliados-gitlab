'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Publication {
  id: string
  title: string
  author: string
  description: string
  price: number
  provider_contact: string
  category: string
}

export default function MagazinesPage() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPublications()
  }, [])

  const fetchPublications = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)

      if (error) throw error
      setPublications(data || [])
    } catch (error) {
      console.error('Error al cargar revistas y libros:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Cargando publicaciones científicas...</div>
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Revistas Científicas, Libros y Descargas</h1>
          <p className="text-gray-600 mt-1">Publicaciones académicas nacionales e internacionales. Comunícate directo con el proveedor para descargas y gestión de comisiones.</p>
        </div>
        <Link
          href="/products/create"
          className="rounded bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition shrink-0"
        >
          + Publicar Revista / Libro
        </Link>
      </div>

      {publications.length === 0 ? (
        <p className="text-gray-500">No hay revistas o libros disponibles en este momento.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {publications.map((pub) => (
            <div key={pub.id} className="rounded-lg bg-white p-6 shadow-md flex flex-col justify-between">
              <div>
                <span className="inline-block rounded bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 mb-2">
                  Revista / Libro Científico
                </span>
                <h3 className="text-xl font-semibold text-gray-800">{pub.title}</h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">{pub.description}</p>
              </div>

              <div className="mt-6 border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-green-600">${pub.price}</span>
                  <span className="text-xs text-gray-500">Comisión por lectura/descarga</span>
                </div>
                <a
                  href={`mailto:${pub.provider_contact || 'proveedor@marketplace.com'}?subject=Solicitud de descarga y comisión - ${pub.title}`}
                  className="block w-full rounded bg-blue-600 py-2.5 text-center font-semibold text-white hover:bg-blue-700 transition"
                >
                  Contactar Proveedor para Descarga
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}