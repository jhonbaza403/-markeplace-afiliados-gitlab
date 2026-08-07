'use client'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-xl font-bold text-blue-600">
              Marketplace Afiliados
            </Link>
            <div className="hidden md:flex space-x-5 text-sm font-medium text-gray-700">
              <Link href="/products" className="hover:text-blue-600">Productos</Link>
              <Link href="/magazines" className="hover:text-blue-600">Revistas Científicas</Link>
              <Link href="/jobs" className="hover:text-blue-600">Empleos</Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 hidden sm:inline">
                  {profile?.full_name || user.email}
                </span>

                {profile?.role === 'admin' && (
                  <Link href="/dashboard/admin" className="text-xs bg-gray-100 px-2.5 py-1 rounded font-semibold text-gray-700 hover:bg-gray-200">Admin</Link>
                )}
                {profile?.role === 'vendor' && (
                  <Link href="/dashboard/seller" className="text-xs bg-blue-50 px-2.5 py-1 rounded font-semibold text-blue-700 hover:bg-blue-100">Vendedor</Link>
                )}
                {profile?.role === 'affiliate' && (
                  <Link href="/dashboard/affiliate" className="text-xs bg-green-50 px-2.5 py-1 rounded font-semibold text-green-700 hover:bg-green-100">Afiliado</Link>
                )}

                <button
                  onClick={signOut}
                  className="rounded bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 transition"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login" className="text-sm text-gray-600 hover:text-blue-600 font-medium">Iniciar Sesión</Link>
                <Link href="/auth/register" className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition">Registrarse</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}