'use client';

// ==========================================================
// ARCHIVO: src/context/AuthContext.tsx
// Credi Marketplace
//
// Contexto global de autenticación.
//
// Responsabilidades:
// - Mantener el usuario autenticado.
// - Obtener el perfil público desde public.profiles.
// - Escuchar cambios de sesión de Supabase Auth.
// - Exponer el estado de carga.
// - Cerrar la sesión.
// - Mantener una única representación tipada del usuario.
//
// IMPORTANTE:
// - Este contexto NO sustituye RLS.
// - Este contexto NO determina permisos de seguridad.
// - Los permisos reales deben validarse en Supabase/RLS
//   y, cuando corresponda, en el servidor.
// - Nunca utilizar SERVICE_ROLE_KEY en este archivo.
//
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
   * Perfil obtenido desde public.profiles.
   *
   * UserProfile representa el modelo de dominio común.
   * AuthProfile puede ampliarse posteriormente sin duplicar
   * el modelo principal.
   */
}

export interface AuthContextType {
  /**
   * Usuario autenticado de Supabase Auth.
   */
  user: User | null;

  /**
   * Perfil público asociado al usuario.
   */
  profile: AuthProfile | null;

  /**
   * Indica si el estado inicial de autenticación
   * todavía está siendo determinado.
   */
  loading: boolean;

  /**
   * Cierra la sesión actual.
   */
  signOut: () => Promise<void>;

  /**
   * Indica si existe una sesión autenticada.
   */
  isAuthenticated: boolean;

  /**
   * Indica si el usuario posee un rol concreto.
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
            'id, email, full_name, role, avatar_url, is_active, created_at, updated_at'
          )
          .eq('id', userId)
          .maybeSingle();

        // ----------------------------------------------
        // Perfil no encontrado
        // ----------------------------------------------

        if (!data) {
          if (error) {
            console.error(
              '[AuthContext] Error obteniendo perfil:',
              error
            );
          }

          setProfile(null);
          return;
        }

        // ----------------------------------------------
        // Validación defensiva del rol
        // ----------------------------------------------

        const validRoles: UserRole[] = [
          'customer',
          'vendor',
          'professional',
          'company',
          'admin',
        ];

        const role = validRoles.includes(
          data.role as UserRole
        )
          ? (data.role as UserRole)
          : 'customer';

        // ----------------------------------------------
        // Construcción del perfil
        // ----------------------------------------------

        setProfile({
          id: data.id,
          email:
            data.email ??
            fallbackEmail ??
            '',
          fullName:
            data.full_name ?? '',
          role,

          avatarUrl:
            data.avatar_url ?? null,

          isActive:
            data.is_active ?? true,

          createdAt:
            data.created_at,

          updatedAt:
            data.updated_at ?? null,
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
  // INICIALIZACIÓN DE AUTENTICACIÓN
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
          data.session?.user ?? null;

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
    // LISTENER DE AUTENTICACIÓN
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
            session?.user ?? null;

          setUser(currentUser);

          if (!currentUser) {
            setProfile(null);
            setLoading(false);
            return;
          }

          /*
           * Evitamos realizar operaciones innecesarias
           * dentro del callback de Supabase Auth.
           *
           * El perfil se obtiene después del cambio de
           * estado de autenticación.
           */
          if (
            event === 'SIGNED_IN' ||
            event === 'INITIAL_SESSION' ||
            event === 'TOKEN_REFRESHED' ||
            event === 'USER_UPDATED'
          ) {
            void fetchProfile(
              currentUser.id,
              currentUser.email
            );
          }

          setLoading(false);
        }
      );

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
      const { error } =
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
  // AUTENTICACIÓN
  // ========================================================

  const isAuthenticated =
    user !== null;

  // ========================================================
  // COMPROBAR ROL
  // ========================================================

  const hasRole = useCallback(
    (role: UserRole): boolean => {
      return profile?.role === role;
    },
    [profile]
  );

  // ========================================================
  // ADMINISTRADOR
  // ========================================================

  const isAdmin =
    profile?.role === 'admin';

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
  // RENDER
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