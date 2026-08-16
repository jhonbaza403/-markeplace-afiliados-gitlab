'use client';

// ==========================================================
// ARCHIVO: src/components/Navbar.tsx
// Credi Marketplace
//
// Navbar principal de la plataforma.
//
// Next.js 16.3
// React 19
//
// RESPONSABILIDADES:
// - Identidad de Credi Marketplace.
// - Navegación principal.
// - Selector de región.
// - Estado de autenticación.
// - Accesos según rol.
// - Cierre de sesión.
// - Navegación responsive.
// - Accesibilidad.
//
// REGLA ARQUITECTÓNICA:
// Este componente NO consulta Supabase directamente.
// Toda la información de autenticación proviene de AuthContext.
// ==========================================================

import Link from 'next/link';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ArrowRight,
  Building2,
  ChevronDown,
  Globe2,
  LogIn,
  LogOut,
  Menu,
  Package,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  UserPlus,
  Users,
  X,
} from 'lucide-react';

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

type NavigationItem = {
  readonly href: string;
  readonly label: string;
  readonly description?: string;
  readonly icon?: React.ComponentType<{
    className?: string;
    'aria-hidden'?: boolean | 'true' | 'false';
  }>;
};

type RoleNavigation = {
  readonly href: string;
  readonly label: string;
  readonly shortLabel: string;
  readonly icon: React.ComponentType<{
    className?: string;
    'aria-hidden'?: boolean | 'true' | 'false';
  }>;
  readonly className: string;
};

// ==========================================================
// 2. NAVEGACIÓN PRINCIPAL
// ==========================================================

const primaryNavigation: readonly NavigationItem[] = [
  {
    href: '/productos',
    label: 'Productos',
    description: 'Descubre productos disponibles en el marketplace.',
    icon: Package,
  },
  {
    href: '/servicios',
    label: 'Servicios',
    description: 'Encuentra profesionales y servicios especializados.',
    icon: Store,
  },
  {
    href: '/ofertas',
    label: 'Ofertas',
    description: 'Explora oportunidades y promociones.',
    icon: Sparkles,
  },
  {
    href: '/empleos',
    label: 'Empleos',
    description: 'Encuentra oportunidades profesionales.',
    icon: Users,
  },
];

// ==========================================================
// 3. ACCESOS SEGÚN ROL
// ==========================================================

const roleNavigation: Readonly<Record<string, RoleNavigation>> = {
  admin: {
    href: '/dashboard/admin',
    label: 'Panel Administrador',
    shortLabel: 'Admin',
    icon: ShieldCheck,
    className:
      'border-purple-500/20 bg-purple-500/10 text-purple-700 hover:bg-purple-500/20 dark:text-purple-300',
  },

  vendedor: {
    href: '/dashboard/seller',
    label: 'Panel Vendedor',
    shortLabel: 'Vendedor',
    icon: Store,
    className:
      'border-blue-500/20 bg-blue-500/10 text-blue-700 hover:bg-blue-500/20 dark:text-blue-300',
  },

  afiliado: {
    href: '/dashboard/affiliate',
    label: 'Panel Afiliado',
    shortLabel: 'Afiliado',
    icon: ShoppingBag,
    className:
      'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-300',
  },

  empresa: {
    href: '/dashboard/company',
    label: 'Panel Empresa',
    shortLabel: 'Empresa',
    icon: Building2,
    className:
      'border-cyan-500/20 bg-cyan-500/10 text-cyan-700 hover:bg-cyan-500/20 dark:text-cyan-300',
  },

  profesional: {
    href: '/dashboard/professional',
    label: 'Panel Profesional',
    shortLabel: 'Profesional',
    icon: Users,
    className:
      'border-indigo-500/20 bg-indigo-500/10 text-indigo-700 hover:bg-indigo-500/20 dark:text-indigo-300',
  },
};

// ==========================================================
// 4. COMPONENTE PRINCIPAL
// ==========================================================

export default function Navbar() {
  const { user, profile, signOut } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const [isSigningOut, setIsSigningOut] =
    useState(false);

  // ========================================================
  // 5. INFORMACIÓN DEL USUARIO
  // ========================================================

  const userRole = profile?.rol as UserRole | undefined;

  const displayName = useMemo(() => {
    const name = profile?.nombre?.trim();

    if (name) {
      return name;
    }

    if (user?.email) {
      return user.email;
    }

    return 'Usuario';
  }, [profile?.nombre, user?.email]);

  // ========================================================
  // 6. NORMALIZACIÓN DE ROL
  // ========================================================

  const normalizedRole = useMemo(() => {
    if (!userRole) {
      return null;
    }

    const role = userRole.trim().toLowerCase();

    switch (role) {
      case 'vendor':
        return 'vendedor';

      case 'affiliate':
        return 'afiliado';

      default:
        return role;
    }
  }, [userRole]);

  // ========================================================
  // 7. ACCESO DEL ROL ACTUAL
  // ========================================================

  const currentRoleNavigation = useMemo(() => {
    if (!normalizedRole) {
      return null;
    }

    return roleNavigation[normalizedRole] ?? null;
  }, [normalizedRole]);

  // ========================================================
  // 8. CERRAR MENÚ MÓVIL
  // ========================================================

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // ========================================================
  // 9. TOGGLE MENÚ MÓVIL
  // ========================================================

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((current) => !current);
  }, []);

  // ========================================================
  // 10. CIERRE DE SESIÓN
  // ========================================================

  const handleSignOut = useCallback(async () => {
    if (isSigningOut) {
      return;
    }

    try {
      setIsSigningOut(true);
      closeMobileMenu();

      await signOut();
    } catch (error) {
      console.error(
        '[Navbar] Error al cerrar sesión:',
        error,
      );
    } finally {
      setIsSigningOut(false);
    }
  }, [
    closeMobileMenu,
    isSigningOut,
    signOut,
  ]);

  // ========================================================
  // 11. CERRAR MENÚ CON ESC
  // ========================================================

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMobileMenu();
      }
    };

    document.addEventListener(
      'keydown',
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown,
      );
    };
  }, [
    closeMobileMenu,
    isMobileMenuOpen,
  ]);

  // ========================================================
  // 12. BLOQUEAR SCROLL CUANDO EL MENÚ ESTÁ ABIERTO
  // ========================================================

  useEffect(() => {
    if (!isMobileMenuOpen) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // ========================================================
  // 13. RENDER
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
        shadow-sm
        backdrop-blur-xl
        supports-[backdrop-filter]:bg-[var(--background)]/75
      "
    >
      <nav
        aria-label="Navegación principal"
        className="
          container-marketplace
          relative
        "
      >
        {/* ==================================================
            BARRA PRINCIPAL
        ================================================== */}

        <div className="flex min-h-16 items-center justify-between gap-4">
          {/* =================================================
              MARCA + NAVEGACIÓN
          ================================================= */}

          <div className="flex min-w-0 items-center">
            {/* LOGO */}

            <Link
              href="/"
              onClick={closeMobileMenu}
              aria-label="Credi Marketplace — Inicio"
              className="
                group
                inline-flex
                shrink-0
                items-center
                rounded-xl
                px-1
                py-2
                text-xl
                font-black
                tracking-tight
                text-[var(--foreground)]
                transition-opacity
                hover:opacity-90
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[var(--primary)]
                focus-visible:ring-offset-2
              "
            >
              <span>Credi</span>

              <span
                className="
                  ml-1
                  bg-linear-to-r
                  from-brand-600
                  to-cyan-500
                  bg-clip-text
                  text-transparent
                "
              >
                Marketplace
              </span>
            </Link>

            {/* NAVEGACIÓN DESKTOP */}

            <div
              className="
                ml-8
                hidden
                items-center
                gap-1
                lg:flex
              "
            >
              {primaryNavigation.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="
                      group
                      inline-flex
                      items-center
                      gap-2
                      rounded-xl
                      px-3
                      py-2
                      text-sm
                      font-semibold
                      text-[var(--muted)]
                      transition-all
                      duration-200
                      hover:bg-[var(--surface-secondary)]
                      hover:text-[var(--foreground)]
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[var(--primary)]
                      focus-visible:ring-offset-2
                    "
                  >
                    {Icon && (
                      <Icon
                        aria-hidden="true"
                        className="
                          size-4
                          opacity-70
                          transition-opacity
                          group-hover:opacity-100
                        "
                      />
                    )}

                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* =================================================
              ACCIONES DESKTOP
          ================================================= */}

          <div
            className="
              hidden
              items-center
              gap-3
              md:flex
            "
          >
            {/* REGIÓN */}

            <div className="shrink-0">
              <RegionSelector />
            </div>

            {/* USUARIO AUTENTICADO */}

            {user ? (
              <div className="flex items-center gap-2">
                {/* NOMBRE */}

                <div
                  className="
                    hidden
                    max-w-44
                    items-center
                    gap-2
                    xl:flex
                  "
                >
                  <div
                    aria-hidden="true"
                    className="
                      flex
                      size-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[var(--primary)]/10
                      text-xs
                      font-black
                      text-[var(--primary)]
                    "
                  >
                    {displayName
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <span
                    title={displayName}
                    className="
                      truncate
                      text-sm
                      font-semibold
                      text-[var(--foreground)]
                    "
                  >
                    {displayName}
                  </span>
                </div>

                {/* PANEL SEGÚN ROL */}

                {currentRoleNavigation && (
                  <Link
                    href={currentRoleNavigation.href}
                    className={`
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-xl
                      border
                      px-3
                      py-2
                      text-xs
                      font-bold
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[var(--primary)]
                      focus-visible:ring-offset-2
                      ${currentRoleNavigation.className}
                    `}
                  >
                    <currentRoleNavigation.icon
                      aria-hidden="true"
                      className="size-4"
                    />

                    <span className="hidden xl:inline">
                      {currentRoleNavigation.label}
                    </span>

                    <span className="xl:hidden">
                      {currentRoleNavigation.shortLabel}
                    </span>
                  </Link>
                )}

                {/* SALIR */}

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  aria-label="Cerrar sesión"
                  className="
                    inline-flex
                    min-h-9
                    items-center
                    gap-1.5
                    rounded-xl
                    bg-[var(--danger)]
                    px-3
                    py-2
                    text-xs
                    font-bold
                    text-white
                    shadow-sm
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:opacity-90
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-red-500
                    focus-visible:ring-offset-2
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <LogOut
                    aria-hidden="true"
                    className="size-4"
                  />

                  <span className="hidden xl:inline">
                    {isSigningOut
                      ? 'Saliendo...'
                      : 'Salir'}
                  </span>
                </button>
              </div>
            ) : (
              /* ==========================================
                 USUARIO NO AUTENTICADO
              ========================================== */

              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="
                    inline-flex
                    min-h-10
                    items-center
                    gap-1.5
                    rounded-xl
                    px-3
                    py-2
                    text-sm
                    font-semibold
                    text-[var(--muted)]
                    transition-colors
                    hover:bg-[var(--surface-secondary)]
                    hover:text-[var(--foreground)]
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[var(--primary)]
                    focus-visible:ring-offset-2
                  "
                >
                  <LogIn
                    aria-hidden="true"
                    className="size-4"
                  />

                  Entrar
                </Link>

                <Link
                  href="/auth/register"
                  className="
                    inline-flex
                    min-h-10
                    items-center
                    gap-1.5
                    rounded-xl
                    bg-[var(--primary)]
                    px-4
                    py-2
                    text-sm
                    font-bold
                    text-white
                    shadow-md
                    shadow-blue-900/10
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:bg-[var(--primary-hover)]
                    hover:shadow-lg
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[var(--primary)]
                    focus-visible:ring-offset-2
                  "
                >
                  <UserPlus
                    aria-hidden="true"
                    className="size-4"
                  />

                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* =================================================
              MENÚ MÓVIL
          ================================================= */}

          <button
            type="button"
            onClick={toggleMobileMenu}
            className="
              inline-flex
              size-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-[var(--border)]
              bg-[var(--surface)]
              text-[var(--foreground)]
              shadow-sm
              transition-all
              hover:bg-[var(--surface-secondary)]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[var(--primary)]
              focus-visible:ring-offset-2
              md:hidden
            "
            aria-label={
              isMobileMenuOpen
                ? 'Cerrar menú de navegación'
                : 'Abrir menú de navegación'
            }
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMobileMenuOpen ? (
              <X
                aria-hidden="true"
                className="size-5"
              />
            ) : (
              <Menu
                aria-hidden="true"
                className="size-5"
              />
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
              absolute
              inset-x-0
              top-full
              max-h-[calc(100vh-4rem)]
              overflow-y-auto
              border-b
              border-[var(--border)]
              bg-[var(--background)]
              shadow-2xl
              md:hidden
            "
          >
            <div className="space-y-4 px-4 py-5">
              {/* ============================================
                  NAVEGACIÓN
              ============================================ */}

              <div>
                <p
                  className="
                    mb-2
                    px-3
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.18em]
                    text-[var(--muted)]
                  "
                >
                  Explorar
                </p>

                <div className="space-y-1">
                  {primaryNavigation.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobileMenu}
                        className="
                          flex
                          items-center
                          gap-3
                          rounded-xl
                          px-3
                          py-3
                          transition-colors
                          hover:bg-[var(--surface-secondary)]
                          focus-visible:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-[var(--primary)]
                        "
                      >
                        {Icon && (
                          <span
                            className="
                              flex
                              size-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              bg-[var(--primary)]/10
                              text-[var(--primary)]
                            "
                          >
                            <Icon
                              aria-hidden="true"
                              className="size-4"
                            />
                          </span>
                        )}

                        <span className="min-w-0">
                          <span
                            className="
                              block
                              text-sm
                              font-bold
                              text-[var(--foreground)]
                            "
                          >
                            {item.label}
                          </span>

                          {item.description && (
                            <span
                              className="
                                mt-0.5
                                block
                                text-xs
                                leading-5
                                text-[var(--muted)]
                              "
                            >
                              {item.description}
                            </span>
                          )}
                        </span>

                        <ArrowRight
                          aria-hidden="true"
                          className="
                            ml-auto
                            size-4
                            text-[var(--muted-light)]
                          "
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-[var(--border)]" />

              {/* ============================================
                  REGIÓN
              ============================================ */}

              <div>
                <p
                  className="
                    mb-2
                    px-3
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.18em]
                    text-[var(--muted)]
                  "
                >
                  Región
                </p>

                <div className="rounded-xl bg-[var(--surface-secondary)] p-2">
                  <RegionSelector />
                </div>
              </div>

              <div className="border-t border-[var(--border)]" />

              {/* ============================================
                  USUARIO
              ============================================ */}

              {user ? (
                <div className="space-y-3">
                  {/* PERFIL */}

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-2xl
                      border
                      border-[var(--border)]
                      bg-[var(--surface)]
                      p-4
                    "
                  >
                    <div
                      aria-hidden="true"
                      className="
                        flex
                        size-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[var(--primary)]/10
                        text-sm
                        font-black
                        text-[var(--primary)]
                      "
                    >
                      {displayName
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                        Cuenta
                      </p>

                      <p className="truncate text-sm font-bold text-[var(--foreground)]">
                        {displayName}
                      </p>

                      {normalizedRole && (
                        <p className="mt-0.5 text-xs capitalize text-[var(--muted)]">
                          {normalizedRole}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* PANEL */}

                  {currentRoleNavigation && (
                    <Link
                      href={currentRoleNavigation.href}
                      onClick={closeMobileMenu}
                      className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        border
                        px-4
                        py-3
                        text-sm
                        font-bold
                        transition-colors
                      "
                    >
                      <currentRoleNavigation.icon
                        aria-hidden="true"
                        className="size-5"
                      />

                      <span>
                        {currentRoleNavigation.label}
                      </span>

                      <ChevronDown
                        aria-hidden="true"
                        className="
                          ml-auto
                          size-4
                          -rotate-90
                        "
                      />
                    </Link>
                  )}

                  {/* CERRAR SESIÓN */}

                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-[var(--danger)]
                      px-4
                      py-3
                      text-sm
                      font-bold
                      text-white
                      shadow-sm
                      transition-opacity
                      hover:opacity-90
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-red-500
                      focus-visible:ring-offset-2
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    <LogOut
                      aria-hidden="true"
                      className="size-4"
                    />

                    {isSigningOut
                      ? 'Cerrando sesión...'
                      : 'Cerrar sesión'}
                  </button>
                </div>
              ) : (
                /* ==========================================
                   NO AUTENTICADO
                ========================================== */

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/auth/login"
                    onClick={closeMobileMenu}
                    className="
                      inline-flex
                      min-h-11
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-[var(--border)]
                      bg-[var(--surface)]
                      px-4
                      py-2.5
                      text-sm
                      font-bold
                      text-[var(--foreground)]
                      shadow-sm
                      transition-colors
                      hover:bg-[var(--surface-secondary)]
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[var(--primary)]
                    "
                  >
                    <LogIn
                      aria-hidden="true"
                      className="size-4"
                    />

                    Entrar
                  </Link>

                  <Link
                    href="/auth/register"
                    onClick={closeMobileMenu}
                    className="
                      inline-flex
                      min-h-11
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-[var(--primary)]
                      px-4
                      py-2.5
                      text-sm
                      font-bold
                      text-white
                      shadow-md
                      transition-all
                      hover:bg-[var(--primary-hover)]
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[var(--primary)]
                      focus-visible:ring-offset-2
                    "
                  >
                    <UserPlus
                      aria-hidden="true"
                      className="size-4"
                    />

                    Crear cuenta
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
