'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Profile } from '@/types/user'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        
        if (session?.user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          setProfile(data)
        }
      } catch (error) {
        console.error('Error fetching session:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        setProfile(data)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
[9:47 p.m., 7/8/2026] jhonbazayasociados: 'use client'

import React from 'react'
import { ProductCard } from '@/features/marketplace/components/ProductCard'
import { Product } from '@/types/product'

const mockProducts: Product[] = [
  {
    id: '1',
    store_id: 'store-1',
    title: 'Smartphone de Última Generación',
    slug: 'smartphone-ultima-generacion',
    description: 'Pantalla AMOLED de 6.7 pulgadas, 256GB de almacenamiento y cámara dual.',
    price: 499.99,
    stock: 15,
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500&auto=format&fit=crop'],
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    store_id: 'store-2',
    title: 'Laptop Profesional Ultradelgada',
    slug: 'laptop-profesional-ultradelgada',
    description: 'Procesador de alta velocidad, 16GB RAM y disco estado sólido de 512GB.',
    price: 899.50,
    stock: 8,
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=500&auto=format&fit=crop'],
    is_active: true,
    created_at: new Date().toISOString(),
  },
]

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Credi Marketplace</h1>
          <p className="mt-2 text-sm text-gray-600">
            Explora una amplia variedad de productos y servicios de nuestros vendedores verificados.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
