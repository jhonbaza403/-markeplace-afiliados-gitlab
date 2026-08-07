'use client'
import Link from 'next/link'
import ShortsFeed from '@/components/ShortsFeed'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-600 py-20 text-white text-center px-4">
        <h1 className="text-4xl font-extrabold sm:text-5xl">Tu Marketplace, Empleos y Afiliados en un Solo Lugar</h1>
        <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
          Compra productos, ofrece servicios, publica revistas científicas, encuentra empleo y haz marketing fácil y sencillo con nuestro sistema de comisiones.
        </p>
        <div className="mt-8 flex justify-center space-x-4">
          <Link href="/products" className="rounded bg-white px-6 py-3 font-bold text-blue-600 hover:bg-gray-100 transition">
            Ver Productos
          </Link>
          <Link href="/auth/register" className="rounded bg-blue-700 border border-white px-6 py-3 font-bold text-white hover:bg-blue-800 transition">
            Registrarme Gratis
          </Link>
        </div>
      </section>

      {/* Secciones Principales */}
      <section className="mx-auto max-w-7xl px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="rounded-lg bg-white p-6 shadow-md text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">📚 Revistas Científicas</h3>
          <p className="text-gray-600 mb-4 text-sm">Publicaciones académicas nacionales e internacionales con descarga directa y gestión de comisiones.</p>
          <Link href="/magazines" className="text-blue-600 font-semibold hover:underline">Explorar Revistas &rarr;</Link>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">💼 Bolsa de Empleo</h3>
          <p className="text-gray-600 mb-4 text-sm">Empresas publicando vacantes y profesionales ofreciendo sus servicios especializados.</p>
          <Link href="/jobs" className="text-blue-600 font-semibold hover:underline">Ver Empleos &rarr;</Link>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">🚀 Sistema de Afiliados</h3>
          <p className="text-gray-600 mb-4 text-sm">Haz marketing de forma fácil, comparte tus enlaces personalizados y gana comisiones por cada venta.</p>
          <Link href="/dashboard/affiliate" className="text-blue-600 font-semibold hover:underline">Panel de Afiliado &rarr;</Link>
        </div>
      </section>

      {/* Feed de Videos Cortos Publicitarios */}
      <section className="mx-auto max-w-7xl px-4 py-8 border-t">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Videos y Promociones (90s)</h2>
        <ShortsFeed />
      </section>
    </div>
  )
}