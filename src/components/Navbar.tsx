'use client';

// ==========================================================
// ARCHIVO: src/components/Navbar.tsx
// Credi Marketplace
//
// Navegación principal de la plataforma.
//
// RESPONSABILIDADES:
// - Mostrar identidad de Credi Marketplace.
// - Navegar hacia las áreas principales.
// - Mostrar región activa.
// - Mostrar estado de autenticación.
// - Mostrar accesos según rol.
// - Permitir cerrar sesión.
// - Mantener accesibilidad básica.
//
// DEPENDENCIAS:
// - AuthContext
// - RegionSelector
//
// IMPORTANTE:
// Este componente NO debe consultar directamente Supabase.
// Toda la información de autenticación proviene de AuthContext.
// ==========================================================

import Link from 'next/link';
import {
  useCallback,
  useMemo,
  useState,
} from 'react';

import { useAuth } from '@/context/AuthContext';
import { RegionSelector } from '@/components/RegionSelector';

// ==========================================================
// 1. TIPOS
// ==========================================================

type UserRole =
  | 'admin'
  | 'vendedor'
  | 'vendor'
  | 'cliente'
  | 'empresa'
  | 'profesional'
  | 'affiliate'
  | 'afiliado'
  | string;

// ==========================================================
// 2. COMPONENTE
// ==========================================================

export default function Navbar() {
  const {
    user,
    profile,
    signOut,
  } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const [isSigningOut, setIsSigningOut] =
    useState(false);

  // ========================================================
  // 3. INFORMACIÓN DEL USUARIO
  // ========================================================

  /**
   * El AuthContext ya normaliza el perfil.
   *
   * Por tanto, aquí NO debemos intentar leer:
   *
   * profile.role
   * profile.full_name
   *
   * El contrato oficial es:
   *
   * profile.rol
   * profile.nombre
   */
  const userRole = profile?.rol as UserRole | undefined;

  const displayName = useMemo(() => {
    if (profile?.nombre?.trim()) {
      return profile.nombre.trim();
    }

    if (user?.email) {
      return user.email;
    }

    return 'Usuario';
  }, [profile?.nombre, user?.email]);

  // ========================================================
  // 4. NORMALIZACIÓN DE ROLES
  // ========================================================

  /**
   * Normaliza variantes provenientes de la base de datos.
   *
   * Ejemplos:
   *
   * vendor    → vendedor
   * affiliate → afiliado
   */
  const normalizedRole = useMemo(() => {
    if (!userRole) {
      return null;
    }

    switch (userRole.toLowerCase()) {
      case 'vendor':
        return 'vendedor';

      case 'affiliate':
        return 'afiliado';

      default:
        return userRole.toLowerCase();
    }
  }, [userRole]);

  // ========================================================
  // 5. CIERRE DE SESIÓN
  // ========================================================

  const handleSignOut = useCallback(async () => {
    if (isSigningOut) {
      return;
    }

    try {
      setIsSigningOut(true);
      setIsMobileMenuOpen(false);

      await signOut();
    } catch (error) {
      console.error(
        'Error al cerrar sesión:',
        error,
      );
    } finally {
      setIsSigningOut(false);
    }
  }, [isSigningOut, signOut]);

  // ========================================================
  // 6. CIERRE DEL MENÚ MÓVIL
  // ========================================================

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // ========================================================
  // 7. RENDER
  // ========================================================

  return (
    <header
      className="
        sticky
        top-0
        z-50
        w-full
        border-b
        border-[var(--border)]
        bg-[var(--background)]/90
        backdrop-blur-md
        supports-[backdrop-filter]:bg-[var(--background)]/75
        transition-colors
      "
    >
      <nav
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        aria-label="Navegación principal"
      >
        {/* ==================================================
            BARRA PRINCIPAL
        ================================================== */}

        <div className="flex h-16 items-center justify-between">

          {/* =================================================
              LOGO
          ================================================= */}

          <div className="flex items-center">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="
                text-xl
                font-extrabold
                tracking-tight
                text-[var(--foreground)]
                transition-opacity
                hover:opacity-90
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-blue-500
                focus-visible:ring-offset-2
                rounded-md
              "
              aria-label="Credi Marketplace - Inicio"
            >
              Credi{' '}
              <span className="text-blue-600 dark:text-blue-400">
                Marketplace
              </span>
            </Link>

            {/* =================================================
                NAVEGACIÓN DESKTOP
            ================================================= */}

            <div
              className="
                ml-8
                hidden
                items-center
                gap-5
                md:flex
              "
            >
              <Link
                href="/products"
                className="
                  text-sm
                  font-medium
                  text-[var(--muted)]
                  transition-colors
                  hover:text-[var(--foreground)]
                  focus:outline-none
                  focus-visible:text-[var(--foreground)]
                "
              >
                Productos
              </Link>

              <Link
                href="/magazines"
                className="
                  text-sm
                  font-medium
                  text-[var(--muted)]
                  transition-colors
                  hover:text-[var(--foreground)]
                  focus:outline-none
                  focus-visible:text-[var(--foreground)]
                "
              >
                Revistas
              </Link>

              <Link
                href="/jobs"
                className="
                  text-sm
                  font-medium
                  text-[var(--muted)]
                  transition-colors
                  hover:text-[var(--foreground)]
                  focus:outline-none
                  focus-visible:text-[var(--foreground)]
                "
              >
                Empleos
              </Link>
            </div>
          </div>

          {/* =================================================
              ACCIONES DESKTOP
          ================================================= */}

          <div className="hidden items-center gap-4 md:flex">

            {/* Región */}
            <RegionSelector />

            {/* Usuario autenticado */}
            {user ? (
              <div className="flex items-center gap-3">

                {/* Nombre */}
                <span
                  className="
                    hidden
                    max-w-[180px]
                    truncate
                    text-sm
                    font-medium
                    text-[var(--foreground)]
                    lg:inline
                  "
                  title={displayName}
                >
                  {displayName}
                </span>

                {/* ==========================================
                    ADMIN
                ========================================== */}

                {normalizedRole === 'admin' && (
                  <Link
                    href="/dashboard/admin"
                    className="
                      rounded-lg
                      border
                      border-purple-500/20
                      bg-purple-500/10
                      px-2.5
                      py-1
                      text-xs
                      font-semibold
                      text-purple-600
                      transition-colors
                      hover:bg-purple-500/20
                      dark:text-purple-400
                    "
                  >
                    Admin
                  </Link>
                )}

                {/* ==========================================
                    VENDEDOR
                ========================================== */}

                {normalizedRole === 'vendedor' && (
                  <Link
                    href="/dashboard/seller"
                    className="
                      rounded-lg
                      border
                      border-blue-500/20
                      bg-blue-500/10
                      px-2.5
                      py-1
                      text-xs
                      font-semibold
                      text-blue-600
                      transition-colors
                      hover:bg-blue-500/20
                      dark:text-blue-400
                    "
                  >
                    Panel Vendedor
                  </Link>
                )}

                {/* ==========================================
                    AFILIADO
                ========================================== */}

                {normalizedRole === 'afiliado' && (
                  <Link
                    href="/dashboard/affiliate"
                    className="
                      rounded-lg
                      border
                      border-emerald-500/20
                      bg-emerald-500/10
                      px-2.5
                      py-1
                      text-xs
                      font-semibold
                      text-emerald-600
                      transition-colors
                      hover:bg-emerald-500/20
                      dark:text-emerald-400
                    "
                  >
                    Panel Afiliado
                  </Link>
                )}

                {/* ==========================================
                    SALIR
                ========================================== */}

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  aria-label="Cerrar sesión"
                  className="
                    rounded-xl
                    bg-[var(--danger)]
                    px-3
                    py-1.5
                    text-xs
                    font-bold
                    text-white
                    shadow-sm
                    transition-opacity
                    hover:opacity-90
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-red-500
                    focus-visible:ring-offset-2
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {isSigningOut ? 'Saliendo...' : 'Salir'}
                </button>
              </div>
            ) : (
              /* ============================================
                 USUARIO NO AUTENTICADO
              ============================================ */

              <div className="flex items-center gap-3">

                <Link
                  href="/auth/login"
                  className="
                    text-sm
                    font-semibold
                    text-[var(--muted)]
                    transition-colors
                    hover:text-[var(--foreground)]
                  "
                >
                  Entrar
                </Link>

                <Link
                  href="/auth/register"
                  className="
                    rounded-xl
                    bg-[var(--primary)]
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition-opacity
                    hover:opacity-90
                  "
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* =================================================
              BOTÓN MENÚ MÓVIL
          ================================================= */}

          <button
            type="button"
            className="
              inline-flex
              items-center
              justify-center
              rounded-lg
              p-2
              text-[var(--foreground)]
              transition-colors
              hover:bg-[var(--muted)]/10
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-blue-500
              md:hidden
            "
            aria-label={
              isMobileMenuOpen
                ? 'Cerrar menú'
                : 'Abrir menú'
            }
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() =>
              setIsMobileMenuOpen((current) => !current)
            }
          >
            {isMobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* ==================================================
            MENÚ MÓVIL
        ================================================== */}

        {isMobileMenuOpen && (
          <div
            id="mobile-navigation"
            className="
              border-t
              border-[var(--border)]
              py-4
              md:hidden
            "
          >
            <div className="flex flex-col gap-2">

              <Link
                href="/products"
                onClick={closeMobileMenu}
                className="
                  rounded-lg
                  px-3
                  py-2
                  text-sm
                  font-medium
                  text-[var(--muted)]
                  hover:bg-[var(--muted)]/10
                  hover:text-[var(--foreground)]
                "
              >
                Productos
              </Link>

              <Link
                href="/magazines"
                onClick={closeMobileMenu}
                className="
                  rounded-lg
                  px-3
                  py-2
                  text-sm
                  font-medium
                  text-[var(--muted)]
                  hover:bg-[var(--muted)]/10
                  hover:text-[var(--foreground)]
                "
              >
                Revistas
              </Link>

              <Link
                href="/jobs"
                onClick={closeMobileMenu}
                className="
                  rounded-lg
                  px-3
                  py-2
                  text-sm
                  font-medium
                  text-[var(--muted)]
                  hover:bg-[var(--muted)]/10
                  hover:text-[var(--foreground)]
                "
              >
                Empleos
              </Link>

              <div className="my-2 border-t border-[var(--border)]" />

              {/* Región móvil */}
              <div className="px-3 py-2">
                <RegionSelector />
              </div>

              {/* Usuario móvil */}
              {user ? (
                <div className="mt-2 flex flex-col gap-2 px-3">

                  <div className="rounded-lg bg-[var(--muted)]/10 px-3 py-2">
                    <p className="text-xs text-[var(--muted)]">
                      Usuario
                    </p>

                    <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                      {displayName}
                    </p>
                  </div>

                  {normalizedRole === 'admin' && (
                    <Link
                      href="/dashboard/admin"
                      onClick={closeMobileMenu}
                      className="
                        rounded-lg
                        bg-purple-500/10
                        px-3
                        py-2
                        text-sm
                        font-semibold
                        text-purple-600
                        dark:text-purple-400
                      "
                    >
                      Panel Administrador
                    </Link>
                  )}

                  {normalizedRole === 'vendedor' && (
                    <Link
                      href="/dashboard/seller"
                      onClick={closeMobileMenu}
                      className="
                        rounded-lg
                        bg-blue-500/10
                        px-3
                        py-2
                        text-sm
                        font-semibold
                        text-blue-600
                        dark:text-blue-400
                      "
                    >
                      Panel Vendedor
                    </Link>
                  )}

                  {normalizedRole === 'afiliado' && (
                    <Link
                      href="/dashboard/affiliate"
                      onClick={closeMobileMenu}
                      className="
                        rounded-lg
                        bg-emerald-500/10
                        px-3
                        py-2
                        text-sm
                        font-semibold
                        text-emerald-600
                        dark:text-emerald-400
                      "
                    >
                      Panel Afiliado
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="
                      mt-1
                      rounded-xl
                      bg-[var(--danger)]
                      px-3
                      py-2
                      text-sm
                      font-bold
                      text-white
                      transition-opacity
                      hover:opacity-90
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {isSigningOut
                      ? 'Cerrando sesión...'
                      : 'Cerrar sesión'}
                  </button>
                </div>
              ) : (
                <div className="mt-2 flex flex-col gap-2 px-3">

                  <Link
                    href="/auth/login"
                    onClick={closeMobileMenu}
                    className="
                      rounded-xl
                      border
                      border-[var(--border)]
                      px-3
                      py-2
                      text-center
                      text-sm
                      font-semibold
                      text-[var(--foreground)]
                    "
                  >
                    Entrar
                  </Link>

                  <Link
                    href="/auth/register"
                    onClick={closeMobileMenu}
                    className="
                      rounded-xl
                      bg-[var(--primary)]
                      px-3
                      py-2
                      text-center
                      text-sm
                      font-semibold
                      text-white
                    "
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}