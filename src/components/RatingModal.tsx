'use client'
import { useState } from 'react'

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  targetUserName: string
  targetUserId: string
  role: 'cliente' | 'vendedor'
}

export default function RatingModal({ isOpen, onClose, targetUserName, role }: RatingModalProps) {
  const [rating, setRating] = useState<number>(5)
  const [comment, setComment] = useState('')
  const [isScamReport, setIsScamReport] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Aquí se enviaría la calificación a Supabase
    console.log('Calificación enviada:', { targetUserName, rating, comment, isScamReport })
    
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      onClose()
    }, 2000)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 transition"
        >
          ✕
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-3">🛡️</div>
            <h3 className="text-xl font-bold text-gray-800">¡Calificación Registrada!</h3>
            <p className="text-sm text-gray-500 mt-2">
              Gracias por ayudar a mantener nuestra comunidad segura y libre de estafas.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              Calificar a este {role} ⭐
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Usuario: <strong className="text-gray-800">{targetUserName}</strong>
            </p>

            {/* Selector de Estrellas */}
            <div className="mb-6 text-center">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                Puntuación de Experiencia
              </label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-3xl transition ${
                      star <= rating ? 'text-amber-400 scale-110' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Comentario sobre la transacción */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-600 mb-2">
                Opinión sobre el comportamiento o pago:
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ej. Excelente comprador, pago puntual / No respondió a los mensajes..."
                className="w-full rounded-lg border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Alerta de Reporte de Estafa */}
            <div className="mb-6 rounded-xl bg-red-50 p-3 border border-red-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isScamReport}
                  onChange={(e) => setIsScamReport(e.target.checked)}
                  className="rounded border-red-300 text-red-600 focus:ring-red-500 h-4 w-4"
                />
                <span className="text-xs font-bold text-red-700">
                  ⚠️ Reportar intento de estafa o fraude
                </span>
              </label>
              {isScamReport && (
                <p className="text-[11px] text-red-600 mt-1 pl-6">
                  Si este usuario acumula reportes por fraude, el sistema procederá con la suspensión o eliminación automática de su cuenta.
                </p>
              )}
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                isScamReport 
                  ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'
              }`}
            >
              {isScamReport ? 'Enviar Reporte de Seguridad' : 'Guardar Calificación'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}