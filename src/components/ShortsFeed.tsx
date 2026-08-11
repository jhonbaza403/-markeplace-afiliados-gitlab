'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import ShareModal from './ShareModal'

interface ShortVideo {
  id: string
  title: string
  creator: string
  videoUrl: string
  likes: number
  productLink: string
}

export default function ShortsFeed() {
  const { user } = useAuth()
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin)
    }
  }, [])

  const [videos] = useState<ShortVideo[]>([
    {
      id: '1',
      title: '¡Aprende a vender más con nuestro sistema de afiliados!',
      creator: 'Marketing Fácil',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      likes: 1250,
      productLink: '/dashboard/affiliate'
    },
    {
      id: '2',
      title: 'Nueva Revista Científica Internacional Disponible',
      creator: 'Editorial Académica',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      likes: 430,
      productLink: '/magazines'
    }
  ])

  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set())
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [currentShare, setCurrentShare] = useState({ title: '', url: '' })

  const handleLike = (id: string) => {
    setLikedVideos(prev => {
      const newLiked = new Set(prev)
      if (newLiked.has(id)) {
        newLiked.delete(id)
      } else {
        newLiked.add(id)
      }
      return newLiked
    })
  }

  const handleShareClick = (title: string, videoId: string) => {
    // Generar URL dinámica usando el origen real y el ID de usuario autenticado
    const refParam = user?.id ? `?ref=${user.id}` : ''
    const baseUrl = origin || 'https://marketplace.com'
    const shareUrl = `${baseUrl}/video/${videoId}${refParam}`
    
    setCurrentShare({ title, url: shareUrl })
    setIsShareModalOpen(true)
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8 relative">
      <h2 className="mb-6 text-2xl font-bold text-foreground text-center">Publicidad y Shorts</h2>
      
      <div className="space-y-8">
        {videos.map((video) => {
          const isLiked = likedVideos.has(video.id)
          
          return (
            <div key={video.id} className="rounded-2xl bg-black overflow-hidden shadow-2xl relative flex flex-col items-center justify-center h-[550px] group border border-border">
              <video
                src={video.videoUrl}
                controls
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              
              {/* Overlay de información (Izquierda/Abajo) */}
              <div className="absolute bottom-16 left-4 right-16 text-white pointer-events-none drop-shadow-md">
                <h3 className="font-bold text-lg leading-tight mb-1">{video.title}</h3>
                <p className="text-sm text-gray-300 font-medium mb-3">@{video.creator}</p>
                <div className="pointer-events-auto">
                  <Link 
                    href={video.productLink} 
                    className="inline-block bg-primary hover:opacity-90 px-4 py-2 rounded-xl text-primary-foreground text-sm font-bold transition shadow-lg"
                  >
                    Ver Oferta / Producto
                  </Link>
                </div>
              </div>

              {/* Barra de acciones (Derecha) */}
              <div className="absolute bottom-16 right-4 flex flex-col items-center gap-6 text-white drop-shadow-md">
                <button 
                  type="button"
                  onClick={() => handleLike(video.id)} 
                  className="flex flex-col items-center transition hover:scale-110 cursor-pointer"
                >
                  <div className={`p-3 rounded-full bg-black/50 backdrop-blur-md transition-colors ${isLiked ? 'text-red-500' : 'text-white'}`}>
                    <svg className="w-7 h-7" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold mt-1">{video.likes + (isLiked ? 1 : 0)}</span>
                </button>
                
                <button 
                  type="button"
                  onClick={() => handleShareClick(video.title, video.id)} 
                  className="flex flex-col items-center transition hover:scale-110 cursor-pointer"
                >
                  <div className="p-3 rounded-full bg-black/50 backdrop-blur-md text-white">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold mt-1">Compartir</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        url={currentShare.url} 
        title={currentShare.title} 
      />
    </div>
  )
}