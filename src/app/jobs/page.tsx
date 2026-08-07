'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Job {
  id: string
  title: string
  company: string
  description: string
  location: string
  salary: string
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs') // Tabla de empleos en Supabase
        .select('*')

      if (error) throw error
      setJobs(data || [])
    } catch (error) {
      console.error('Error al cargar las ofertas de empleo:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Cargando ofertas de empleo...</div>
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Bolsa de Empleo y Oportunidades</h1>
          <p className="text-gray-600 mt-1">Encuentra tu próximo reto profesional o postúlate a las mejores vacantes de empresas y profesionales.</p>
        </div>
        <Link
          href="/dashboard/seller"
          className="rounded bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition shrink-0"
        >
          + Publicar Vacante
        </Link>
      </div>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No hay ofertas de empleo publicadas en este momento.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {jobs.map((job) => (
            <div key={job.id} className="rounded-lg bg-white p-6 shadow-md flex flex-col justify-between">
              <div>
                <span className="inline-block rounded bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700 mb-2">
                  {job.company || 'Empresa Confidencial'}
                </span>
                <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{job.location || 'Remoto / Híbrido'}</p>
                <p className="mt-3 text-sm text-gray-600 line-clamp-3">{job.description}</p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t pt-4">
                <span className="text-lg font-bold text-green-600">{job.salary || 'A convenir'}</span>
                <a
                  href={`mailto:rrhh@marketplace.com?subject=Postulación para la vacante - ${job.title}`}
                  className="rounded bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition"
                >
                  Postularme
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}