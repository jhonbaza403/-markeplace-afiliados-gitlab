'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

// Tipado del perfil basado en tu esquema (adaptado a lo que lee el Navbar)
export type UserProfile = {
  id: string
  email: string
  nombre: string
  rol: 'admin' | 'vendedor' | 'cliente' | 'empresa' | 'profesional' | string
}

type AuthContextType = {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // 1. Obtener la sesión actual al cargar
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email)
      } else {
        setLoading(false)
      }
    }

    initializeAuth()

    // 2. Escuchar cambios de estado en la autenticación (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Función auxiliar para obtener el perfil desde la tabla 'profiles'
  const fetchProfile = async (userId: string, email: string | undefined) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, role, email')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
      }

      if (data) {
        setProfile({
          id: userId,
          email: data.email || email || '',
          nombre: data.full_name,
          rol: data.role === 'vendor' ? 'vendedor' : data.role, // Mapeo de DB a UI
        })
      }
    } catch (error) {
      console.error('Unexpected error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personalizado para usar el contexto fácilmente en cualquier componente
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}