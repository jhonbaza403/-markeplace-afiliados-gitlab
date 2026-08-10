'use client'

import React from 'react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[var(--background)]">
        <div className="text-sm font-medium text-[var(--muted)] animate-pulse">
          Cargando panel...
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 bg-[var(--background)]">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-2xl font-black tracking-tight text-[var(--foreground)]">
            Acceso restringido
          </h1>
          <p className="text-sm text-[var(--muted)]">
            Debes iniciar sesión para acceder a tu panel de control en Credi Marketplace.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link
              href="/auth/login"
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-500 transition"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/auth/register"
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-bold text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[var(--border)] pb-6">
          <div>
            <span className="inline-block rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
              Panel de Control
            </span>
            <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">
              Bienvenido, {profile?.nombre || user.email}
            </h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              Gestiona tu actividad, productos y perfil desde un solo lugar.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider bg-[var(--surface)] border border-[var(--border)] px-3 py-1.5 rounded-xl text-[var(--foreground)]">
              Rol: {profile?.rol || 'Cliente'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Tarjeta de Acceso Rápido 1 */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-3">
            <h3 className="font-bold text-base text-[var(--foreground)]">Mi Perfil</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Actualiza tu información personal, correo y datos de contacto de forma segura.
            </p>
            <Link
              href="/dashboard/profile"
              className="inline-block text-xs font-bold text-blue-600 hover:underline pt-2"
            >
              Editar perfil &rarr;
            </Link>
          </div>

          {/* Tarjeta de Acceso Rápido 2 (Condicional para Vendedores) */}
          {profile?.rol === 'vendedor' && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-3">
              <h3 className="font-bold text-base text-[var(--foreground)]">Mi Tienda y Productos</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Administra tu inventario, publica nuevos artículos y revisa el estado de tus ventas.
              </p>
              <Link
                href="/dashboard/seller"
                className="inline-block text-xs font-bold text-blue-600 hover:underline pt-2"
              >
                Gestionar tienda &rarr;
              </Link>
            </div>
          )}

          {/* Tarjeta de Acceso Rápido 3 */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-3">
            <h3 className="font-bold text-base text-[var(--foreground)]">Mis Órdenes</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Consulta el historial de tus compras, seguimiento de envíos y facturación.
            </p>
            <Link
              href="/dashboard/orders"
              className="inline-block text-xs font-bold text-blue-600 hover:underline pt-2"
            >
              Ver órdenes &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}