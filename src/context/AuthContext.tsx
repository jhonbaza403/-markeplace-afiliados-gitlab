'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export interface Profile {
  id: string
  nombre?: string
  full_name?: string
  rol?: 'admin' | 'vendedor' | 'cliente' | 'afiliado' | string
  role?: string
  avatar_url?: string
  updated_at?: string
  [key: string]: unknown
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // Función reutilizable para obtener la información del perfil del usuario
  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('Error al obtener el perfil de Supabase:', error.message)
        return null
      }
      return data as Profile | null
    } catch (err) {
      console.error('Error inesperado consultando perfil:', err)
      return null
    }
  }

  useEffect(() => {
    let mounted = true

    // 1. Carga inicial de sesión
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error('Error al obtener la sesión actual:', error.message)
        }

        if (mounted) {
          const currentUser = session?.user ?? null
          setUser(currentUser)

          if (currentUser) {
            const userProfile = await fetchProfile(currentUser.id)
            if (mounted) setProfile(userProfile)
          }
        }
      } catch (err) {
        console.error('Error inicializando autenticación:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    initializeAuth()

    // 2. Escuchar cambios de estado en tiempo real (login, logout, refresh de token)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return

      const currentUser = session?.user ?? null
      setUser(currentUser)

      if (currentUser) {
        const userProfile = await fetchProfile(currentUser.id)
        if (mounted) setProfile(userProfile)
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    } finally {
      setUser(null)
      setProfile(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider')
  }
  return context
}