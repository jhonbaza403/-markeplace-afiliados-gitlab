'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  targetUserName: string
  targetUserId: string
  role: 'cliente' | 'vendedor'
}

export default function RatingModal({
  isOpen,
  onClose,
  targetUserName,
  targetUserId,
  role,
}: RatingModalProps) {
  const [rating, setRating] = useState<number>(5)
  const [comment, setComment] = useState('')
  const [isScamReport, setIsScamReport] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  // Resetea los estados si el modal se cierra o cambia de visibilidad
  useEffect(() => {
    if (!isOpen) {
      setLoading(false)
      setSubmitted(false)
      setComment('')
      setIsScamReport(false)
      setRating(5)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 1. Validación de seguridad: Evitar comentarios vacíos
    const trimmedComment = comment.trim()
    if (!trimmedComment) {
      alert('Por favor, ingresa un comentario válido antes de enviar.')
      return
    }

    setLoading(true)

    try {
      // 2. Obtener el usuario autenticado actual (quien califica)
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        alert('Debes iniciar sesión para poder calificar.')
        setLoading(false)
        return
      }

      // 3. Evitar autocalificación
      if (user.id === targetUserId) {
        alert('No puedes calificarte a ti mismo.')
        setLoading(false)
        return
      }

      // 4. Insertar la calificación en la base de datos de Supabase
      const { error: insertError } = await supabase.from('ratings').insert({
        reviewer_id: user.id,
        target_user_id: targetUserId,
        rating: rating,
        comment: trimmedComment,
        is_scam_report: isScamReport,
      })

      if (insertError) throw insertError

      setSubmitted(true)

      // 5. Cierre seguro con temporizador
      setTimeout(() => {
        setSubmitted(false)
        setComment('')
        setRating(5)
        setIsScamReport(false)
        setLoading(false)
        onClose()
      }, 2000)
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al guardar la calificación.'
      console.error('Error al guardar la calificación:', errorMessage)
      alert('Hubo un error al registrar la calificación. Por favor intenta de nuevo.')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-card text-card-foreground p-6 shadow-2xl border border-border relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          ✕
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-3">🛡️</div>
            <h3 className="text-xl font-bold text-foreground">¡Calificación Registrada!</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Gracias por ayudar a mantener nuestra comunidad segura y libre de estafas.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 className="text-xl font-bold text-foreground mb-1">
              Calificar a este {role} ⭐
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Usuario: <strong className="text-foreground">{targetUserName}</strong>
            </p>

            {/* Selector de Estrellas */}
            <div className="mb-6 text-center">
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">
                Puntuación de Experiencia
              </label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-3xl transition-transform hover:scale-125 cursor-pointer ${
                      star <= rating ? 'text-amber-400 scale-110' : 'text-muted-foreground/30'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Comentario sobre la transacción */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-muted-foreground mb-2">
                Opinión sobre el comportamiento o pago:
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ej. Excelente comprador, pago puntual / No respondió a los mensajes..."
                className="w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                required
              />
            </div>

            {/* Alerta de Reporte de Estafa */}
            <div className="mb-6 rounded-xl bg-destructive/10 p-3 border border-destructive/20">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isScamReport}
                  onChange={(e) => setIsScamReport(e.target.checked)}
                  className="rounded border-destructive text-destructive focus:ring-destructive h-4 w-4"
                />
                <span className="text-xs font-bold text-destructive">
                  ⚠️ Reportar intento de estafa o fraude
                </span>
              </label>
              {isScamReport && (
                <p className="text-[11px] text-destructive/90 mt-1 pl-6">
                  Si este usuario acumula reportes por fraude, el sistema procederá con la suspensión o eliminación automática de su cuenta.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-bold transition-all shadow-md cursor-pointer ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                isScamReport
                  ? 'bg-destructive text-destructive-foreground hover:opacity-90'
                  : 'bg-primary text-primary-foreground hover:opacity-90'
              }`}
            >
              {loading
                ? 'Guardando...'
                : isScamReport
                ? 'Enviar Reporte de Seguridad'
                : 'Guardar Calificación'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}