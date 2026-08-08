'use client'

import React, { useState, useEffect } from 'react'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  url: string
  title: string
}

export default function ShareModal({
  isOpen,
  onClose,
  url,
  title,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const [hasNativeShare, setHasNativeShare] = useState(false)

  // Verificación de soporte nativo de la API Navigator Share
  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setHasNativeShare(true)
    }
  }, [])

  // Limpia el estado de copia cuando el modal se cierra
  useEffect(() => {
    if (!isOpen) {
      setCopied(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: 'fa-whatsapp',
      color: 'bg-emerald-600 hover:bg-emerald-700',
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      name: 'Telegram',
      icon: 'fa-telegram',
      color: 'bg-sky-500 hover:bg-sky-600',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: 'Facebook',
      icon: 'fa-facebook',
      color: 'bg-blue-600 hover:bg-blue-700',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: 'X (Twitter)',
      icon: 'fa-x-twitter',
      color: 'bg-slate-900 hover:bg-black dark:bg-slate-800',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
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
      console.log('Error al compartir o el usuario canceló la acción:', error)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Error al copiar el enlace:', err)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-card text-card-foreground p-6 shadow-2xl border border-border relative animate-fade-in-up">
        {/* Botón de cerrar */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-xl font-bold text-foreground mb-2">Compartir y Viralizar 🚀</h3>
        <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{title}</p>

        {hasNativeShare ? (
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-full mb-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-purple-600 py-3 font-bold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity cursor-pointer"
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
                className={`flex flex-col items-center justify-center gap-2 rounded-xl p-3 text-white transition-transform hover:scale-105 shadow-sm ${link.color}`}
                title={`Compartir en ${link.name}`}
              >
                <i className={`fa-brands ${link.icon} text-2xl`}></i>
              </a>
            ))}
          </div>
        )}

        {/* Input con botón de copiar */}
        <div className="relative">
          <div className="flex items-center rounded-xl border border-border bg-muted p-1">
            <input
              type="text"
              readOnly
              value={url}
              className="w-full bg-transparent px-3 py-2 text-xs text-muted-foreground outline-none font-mono"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-primary text-primary-foreground hover:opacity-90'
              }`}
            >
              {copied ? '¡Copiado!' : 'Copiar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}