'use client'
import { useState, useEffect } from 'react'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  url: string
  title: string
}

export default function ShareModal({ isOpen, onClose, url, title }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const [hasNativeShare, setHasNativeShare] = useState(false)

  useEffect(() => {
    // Verificamos si el navegador soporta la función nativa de compartir (común en celulares)
    if (navigator.share) {
      setHasNativeShare(true)
    }
  }, [])

  if (!isOpen) return null

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shareLinks = [
    { name: 'WhatsApp', icon: 'fa-whatsapp', color: 'bg-green-500', href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}` },
    { name: 'Telegram', icon: 'fa-telegram', color: 'bg-blue-500', href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}` },
    { name: 'Facebook', icon: 'fa-facebook', color: 'bg-blue-600', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { name: 'X (Twitter)', icon: 'fa-x-twitter', color: 'bg-black', href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}` },
  ]

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: title,
        text: '¡Mira este increíble producto en Markeplace Afiliados!',
        url: url,
      })
      onClose()
    } catch (error) {
      console.log('Error al compartir o el usuario canceló', error)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Error al copiar el enlace', err)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl relative animate-fade-in-up">
        {/* Botón de cerrar */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-xl font-bold text-gray-800 mb-2">Compartir y Viralizar 🚀</h3>
        <p className="text-sm text-gray-500 mb-6 line-clamp-2">{title}</p>

        {hasNativeShare ? (
          <button 
            onClick={handleNativeShare}
            className="w-full mb-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-bold text-white shadow-lg hover:opacity-90 transition"
          >
            <i className="fa-solid fa-share-nodes"></i>
            Compartir en mis Apps (Instagram, TikTok...)
          </button>
        ) : (
          <div className="grid grid-cols-4 gap-4 mb-6">
            {shareLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center justify-center gap-2 rounded-xl p-3 text-white transition hover:scale-105 ${link.color}`}
                title={`Compartir en ${link.name}`}
              >
                <i className={`fa-brands ${link.icon} text-2xl`}></i>
              </a>
            ))}
          </div>
        )}

        <div className="relative">
          <div className="flex items-center rounded-lg border bg-gray-50 p-1">
            <input 
              type="text" 
              readOnly 
              value={url} 
              className="w-full bg-transparent px-3 py-2 text-xs text-gray-500 outline-none"
            />
            <button 
              onClick={handleCopyLink}
              className={`shrink-0 rounded-md px-4 py-2 text-sm font-semibold text-white transition ${copied ? 'bg-green-500' : 'bg-gray-800 hover:bg-gray-700'}`}
            >
              {copied ? '¡Copiado!' : 'Copiar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}