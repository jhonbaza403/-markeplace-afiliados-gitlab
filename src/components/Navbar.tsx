'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { RegionSelector } from '@/components/marketplace/RegionSelector'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-xl font-bold text-blue-600">
              Marketplace Afiliados
            </Link>
            <div className="hidden md:flex space-x-5 text-sm font-medium text-gray-600">
              <Link href="/products" className="hover:text-blue-600">Productos</Link>
              <Link href="/magazines" className="hover:text-blue-600">Revistas</Link>
              <Link href="/jobs" className="hover:text-blue-600">Empleos</Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Selector global de región y moneda integrado */}
            <RegionSelector />

            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700 hidden sm:inline font-medium">
                  {profile?.nombre || user.email}
                </span>

                {profile?.rol === 'admin' && (
                  <Link href="/dashboard/admin" className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-lg font-semibold hover:bg-purple-200">
                    Admin
                  </Link>
                )}

                {profile?.rol === 'vendedor' && (
                  <Link href="/dashboard/seller" className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-lg font-semibold hover:bg-blue-200">
                    Panel Vendedor
                  </Link>
                )}

                <button
                  onClick={signOut}
                  className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-600 transition"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login" className="text-sm font-semibold text-gray-700 hover:text-blue-600">
                  Entrar
                </Link>
                <Link href="/auth/register" className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition shadow-sm">
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}