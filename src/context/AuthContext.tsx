```tsx
'use client';

// ==========================================================
// ARCHIVO: src/context/AuthContext.tsx
// Credi Marketplace
//
// Contexto global de autenticación.
//
// RESPONSABILIDADES:
// - Mantener el usuario autenticado.
// - Obtener el perfil público desde public.profiles.
// - Normalizar roles de Supabase al dominio de la aplicación.
// - Exponer el estado de carga.
// - Cerrar sesión.
// - Proporcionar helpers de autorización para la UI.
//
// SEGURIDAD:
// - Este contexto NO sustituye RLS.
// - Este contexto NO constituye autorización de seguridad.
// - Las operaciones sensibles deben validarse en servidor/RLS.
// - Nunca utilizar SERVICE_ROLE_KEY aquí.
// ==========================================================

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { User } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase/client';

import type {
  UserProfile,
  UserRole,
} from '@/types/user';

// ==========================================================
// TIPOS
// ==========================================================

export interface AuthProfile extends UserProfile {
  /**
   * Modelo de perfil normalizado para toda la aplicación.
   *
   * El resto de la aplicación debe utilizar:
   *
   * profile.nombre
   * profile.rol
   *
   * y NO acceder directamente a:
   *
   * full_name
   * role
   *
   * de Supabase.
   */
}

export interface AuthContextType {
  /**
   * Usuario autenticado de Supabase Auth.
   */
  user: User | null;

  /**
   * Perfil normalizado.
   */
  profile: AuthProfile | null;

  /**
   * Estado de carga inicial.
   */
  loading: boolean;

  /**
   * Cerrar sesión.
   */
  signOut: () => Promise<void>;

  /**
   * Indica si existe una sesión.
   */
  isAuthenticated: boolean;

  /**
   * Comprueba si el usuario posee un rol.
   */
  hasRole: (role: UserRole) => boolean;

  /**
   * Indica si el usuario es administrador.
   */
  isAdmin: boolean;
}

// ==========================================================
// CONTEXTO
// ==========================================================

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

// ==========================================================
// NORMALIZACIÓN DE ROLES
// ==========================================================

/**
 * Convierte los posibles valores almacenados en
 * Supabase al modelo canónico utilizado por Credi Marketplace.
 *
 * MODELO CANÓNICO:
 *
 * admin
 * vendedor
 * afiliado
 * cliente
 * empresa
 * profesional
 */
function normalizeRole(
  value: unknown
): UserRole {
  if (typeof value !== 'string') {
    return 'cliente';
  }

  const role = value
    .trim()
    .toLowerCase();

  switch (role) {
    case 'admin':
    case 'administrator':
    case 'administrador':
      return 'admin';

    case 'vendor':
    case 'seller':
    case 'vendedor':
      return 'vendedor';

    case 'affiliate':
    case 'afiliado':
      return 'afiliado';

    case 'company':
    case 'business':
    case 'empresa':
      return 'empresa';

    case 'professional':
    case 'profesional':
      return 'profesional';

    case 'customer':
    case 'client':
    case 'cliente':
    case 'user':
      return 'cliente';

    default:
      /**
       * Nunca confiamos ciegamente en un valor externo.
       * Si aparece un rol desconocido, se utiliza el rol
       * de menor privilegio para la interfaz.
       */
      return 'cliente';
  }
}

// ==========================================================
// PROVIDER
// ==========================================================

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [profile, setProfile] =
    useState<AuthProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  // ========================================================
  // OBTENER PERFIL
  // ========================================================

  const fetchProfile = useCallback(
    async (
      userId: string,
      fallbackEmail?: string | null
    ): Promise<void> => {
      try {
        const {
          data,
          error,
        } = await supabase
          .from('profiles')
          .select(
            `
              id,
              email,
              full_name,
              role,
              avatar_url,
              is_active,
              created_at,
              updated_at
            `
          )
          .eq('id', userId)
          .maybeSingle();

        // ----------------------------------------------
        // ERROR DE CONSULTA
        // ----------------------------------------------

        if (error) {
          console.error(
            '[AuthContext] Error obteniendo perfil:',
            error
          );

          setProfile(null);
          return;
        }

        // ----------------------------------------------
        // PERFIL NO ENCONTRADO
        // ----------------------------------------------

        if (!data) {
          console.warn(
            '[AuthContext] Perfil no encontrado para:',
            userId
          );

          setProfile(null);
          return;
        }

        // ----------------------------------------------
        // ROL NORMALIZADO
        // ----------------------------------------------

        const role =
          normalizeRole(data.role);

        // ----------------------------------------------
        // PERFIL NORMALIZADO
        // ----------------------------------------------

        setProfile({
          id: data.id,

          email:
            data.email ??
            fallbackEmail ??
            '',

          nombre:
            data.full_name ??
            '',

          rol: role,

          avatarUrl:
            data.avatar_url ??
            null,

          isActive:
            data.is_active ??
            true,

          createdAt:
            data.created_at,

          updatedAt:
            data.updated_at ??
            null,
        });
      } catch (error) {
        console.error(
          '[AuthContext] Error inesperado obteniendo perfil:',
          error
        );

        setProfile(null);
      }
    },
    []
  );

  // ========================================================
  // INICIALIZACIÓN
  // ========================================================

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        const {
          data,
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error(
            '[AuthContext] Error obteniendo sesión:',
            error
          );

          if (mounted) {
            setUser(null);
            setProfile(null);
          }

          return;
        }

        if (!mounted) {
          return;
        }

        const currentUser =
          data.session?.user ??
          null;

        setUser(currentUser);

        if (currentUser) {
          await fetchProfile(
            currentUser.id,
            currentUser.email
          );
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error(
          '[AuthContext] Error inicializando autenticación:',
          error
        );

        if (mounted) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void initializeAuth();

    // ======================================================
    // LISTENER SUPABASE AUTH
    // ======================================================

    const {
      data: authListener,
    } =
      supabase.auth.onAuthStateChange(
        (event, session) => {
          if (!mounted) {
            return;
          }

          const currentUser =
            session?.user ??
            null;

          setUser(currentUser);

          // --------------------------------------------
          // SIN SESIÓN
          // --------------------------------------------

          if (!currentUser) {
            setProfile(null);
            setLoading(false);
            return;
          }

          // --------------------------------------------
          // ACTUALIZAR PERFIL
          // --------------------------------------------

          if (
            event === 'SIGNED_IN' ||
            event === 'INITIAL_SESSION' ||
            event === 'USER_UPDATED'
          ) {
            /**
             * Ejecutamos fuera del callback inmediato
             * de autenticación para evitar encadenamientos
             * innecesarios dentro del listener.
             */
            void fetchProfile(
              currentUser.id,
              currentUser.email
            );
          }

          setLoading(false);
        }
      );

    // ======================================================
    // CLEANUP
    // ======================================================

    return () => {
      mounted = false;

      authListener.subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // ========================================================
  // CERRAR SESIÓN
  // ========================================================

  const signOut = useCallback(
    async (): Promise<void> => {
      const {
        error,
      } =
        await supabase.auth.signOut();

      if (error) {
        console.error(
          '[AuthContext] Error cerrando sesión:',
          error
        );

        throw error;
      }

      setUser(null);
      setProfile(null);
    },
    []
  );

  // ========================================================
  // ESTADO DE AUTENTICACIÓN
  // ========================================================

  const isAuthenticated =
    user !== null;

  // ========================================================
  // COMPROBAR ROL
  // ========================================================

  const hasRole = useCallback(
    (role: UserRole): boolean => {
      return profile?.rol === role;
    },
    [profile?.rol]
  );

  // ========================================================
  // ADMIN
  // ========================================================

  const isAdmin =
    profile?.rol === 'admin';

  // ========================================================
  // VALOR DEL CONTEXTO
  // ========================================================

  const contextValue =
    useMemo<AuthContextType>(
      () => ({
        user,
        profile,
        loading,
        signOut,
        isAuthenticated,
        hasRole,
        isAdmin,
      }),
      [
        user,
        profile,
        loading,
        signOut,
        isAuthenticated,
        hasRole,
        isAdmin,
      ]
    );

  // ========================================================
  // PROVIDER
  // ========================================================

  return (
    <AuthContext.Provider
      value={contextValue}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ==========================================================
// HOOK
// ==========================================================

export function useAuth(): AuthContextType {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth debe utilizarse dentro de un AuthProvider.'
    );
  }

  return context;
}
```
