'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { RegionSelector } from '@/components/marketplace/RegionSelector'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md transition-colors">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Navegación principal">
        <div className="flex justify-between h-16 items-center">
          {/* Logo y Enlaces Principales */}
          <div className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-xl font-extrabold tracking-tight text-[var(--foreground)] hover:opacity-90 transition-opacity"
            >
              Credi <span className="text-blue-600">Marketplace</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-5 text-sm font-medium text-[var(--muted)]">
              <Link href="/products" className="hover:text-[var(--foreground)] transition-colors">
                Productos
              </Link>
              <Link href="/magazines" className="hover:text-[var(--foreground)] transition-colors">
                Revistas
              </Link>
              <Link href="/jobs" className="hover:text-[var(--foreground)] transition-colors">
                Empleos
              </Link>
            </div>
          </div>

          {/* Acciones de Usuario y Selector de Región */}
          <div className="flex items-center space-x-4">
            {/* Selector global de región y moneda */}
            <RegionSelector />

            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-[var(--foreground)] hidden sm:inline">
                  {profile?.nombre || user.email}
                </span>

                {profile?.rol === 'admin' && (
                  <Link
                    href="/dashboard/admin"
                    className="text-xs bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 px-2.5 py-1 rounded-lg font-semibold hover:bg-purple-500/20 transition-colors"
                  >
                    Admin
                  </Link>
                )}

                {profile?.rol === 'vendedor' && (
                  <Link
                    href="/dashboard/seller"
                    className="text-xs bg-blue-500/10 text-blue-600 border border-blue-500/20 px-2.5 py-1 rounded-lg font-semibold hover:bg-blue-500/20 transition-colors"
                  >
                    Panel Vendedor
                  </Link>
                )}

                <button
                  type="button"
                  onClick={signOut}
                  className="rounded-xl bg-[var(--danger)] text-white px-3 py-1.5 text-xs font-bold hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/login"
                  className="text-sm font-semibold text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm font-semibold bg-[var(--primary)] text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity shadow-sm"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}