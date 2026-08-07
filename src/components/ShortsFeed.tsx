'use client'
import { useState } from 'react'
import Link from 'next/link'

interface ShortVideo {
  id: string
  title: string
  creator: string
  videoUrl: string
  likes: number
  productLink: string
}

export default function ShortsFeed() {
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

  // Estado para manejar los "Me gusta" localmente
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set())

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

  const handleShare = async (title: string) => {
    try {
      await navigator.clipboard.writeText(`¡Mira este video en Markeplace Afiliados!: ${title}`)
      alert('¡Enlace de afiliado copiado al portapapeles!')
    } catch (err) {
      console.error('Error al copiar', err)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h2 className="mb-6 text-2xl font-bold text-gray-800 text-center">Publicidad y Shorts</h2>
      
      <div className="space-y-8">
        {videos.map((video) => {
          const isLiked = likedVideos.has(video.id)
          
          return (
            <div key={video.id} className="rounded-xl bg-black overflow-hidden shadow-xl relative flex flex-col items-center justify-center h-[550px] group">
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
                    className="inline-block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white text-sm font-bold transition shadow-lg"
                  >
                    Ver Oferta / Producto
                  </Link>
                </div>
              </div>

              {/* Barra de acciones (Derecha) */}
              <div className="absolute bottom-16 right-4 flex flex-col items-center gap-6 text-white drop-shadow-md">
                <button 
                  onClick={() => handleLike(video.id)} 
                  className="flex flex-col items-center transition hover:scale-110"
                >
                  <div className={`p-3 rounded-full bg-black/40 backdrop-blur-sm ${isLiked ? 'text-red-500' : 'text-white'}`}>
                    <svg className="w-7 h-7" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold mt-1">{video.likes + (isLiked ? 1 : 0)}</span>
                </button>
                
                <button 
                  onClick={() => handleShare(video.title)} 
                  className="flex flex-col items-center transition hover:scale-110"
                >
                  <div className="p-3 rounded-full bg-black/40 backdrop-blur-sm text-white">
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
    </div>
  )
}