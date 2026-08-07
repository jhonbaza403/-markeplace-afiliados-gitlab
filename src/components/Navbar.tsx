'use client'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()

  return (
    <nav className="bg-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-gray-800">
          Marketplace Afiliados
        </Link>
        <div className="flex items-center space-x-6">
          <Link href="/products" className="text-gray-600 hover:text-blue-600">
            Productos
          </Link>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">
                {profile?.full_name || user.email}
              </span>
              {profile?.role === 'vendor' && (
                <Link href="/dashboard/seller" className="text-sm text-blue-600 hover:underline">
                  Panel Vendedor
                </Link>
              )}
              <button
                onClick={signOut}
                className="rounded bg-red-500 px-3 py-1.5 text-sm text-white hover:bg-red-600 transition"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link href="/auth/login" className="text-gray-600 hover:text-blue-600">
                Iniciar Sesión
              </Link>
              <Link
                href="/auth/register"
                className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 transition"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}