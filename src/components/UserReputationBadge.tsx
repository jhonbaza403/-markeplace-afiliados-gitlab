'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface UserReputationBadgeProps {
  userId: string
}

export default function UserReputationBadge({ userId }: UserReputationBadgeProps) {
  const [avgRating, setAvgRating] = useState<number | null>(null)
  const [totalRatings, setTotalRatings] = useState<number>(0)
  const [isActive, setIsActive] = useState<boolean>(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReputation() {
      try {
        const supabase = createClient()

        // 1. Obtener perfil para ver si está activo
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_active')
          .eq('id', userId)
          .single()

        if (profile && typeof profile.is_active === 'boolean') {
          setIsActive(profile.is_active)
        }

        // 2. Calcular promedio de calificaciones
        const { data: ratings, error } = await supabase
          .from('ratings')
          .select('rating')
          .eq('target_user_id', userId)

        if (!error && ratings && ratings.length > 0) {
          const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0)
          setAvgRating(Number((sum / ratings.length).toFixed(1)))
          setTotalRatings(ratings.length)
        }
      } catch (err) {
        console.error('Error cargando reputación:', err)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchReputation()
    }
  }, [userId])

  if (loading) {
    return <span className="text-xs text-muted-foreground animate-pulse">Cargando reputación...</span>
  }

  return (
    <div className="flex items-center gap-2">
      {!isActive ? (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-destructive/10 text-destructive border border-destructive/20">
          ⚠️ Cuenta Suspendida por Fraude
        </span>
      ) : (
        <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1 rounded-full border border-border">
          <span className="text-amber-400 text-sm">★</span>
          <span className="text-xs font-bold text-foreground">
            {avgRating !== null ? avgRating : 'Nuevo'}
          </span>
          <span className="text-[11px] text-muted-foreground">
            ({totalRatings} {totalRatings === 1 ? 'opinión' : 'opiniones'})
          </span>
        </div>
      )}
    </div>
  )
}