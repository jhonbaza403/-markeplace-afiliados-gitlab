'use client'
import { useState } from 'react'

interface ShortVideo {
  id: string
  title: string
  creator: string
  videoUrl: string
  likes: number
}

export default function ShortsFeed() {
  // Lista de ejemplo para videos cortos de hasta 90 segundos
  const [videos] = useState<ShortVideo[]>([
    {
      id: '1',
      title: '¡Aprende a vender más con nuestro sistema de afiliados!',
      creator: 'Marketing Fácil',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      likes: 1250
    },
    {
      id: '2',
      title: 'Nueva Revista Científica Internacional Disponible',
      creator: 'Editorial Académica',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      likes: 430
    }
  ])

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h2 className="mb-6 text-2xl font-bold text-gray-800 text-center">Publicidad y Videos (90s)</h2>
      
      <div className="space-y-8">
        {videos.map((video) => (
          <div key={video.id} className="rounded-xl bg-black overflow-hidden shadow-xl relative flex flex-col items-center justify-center">
            <video
              src={video.videoUrl}
              controls
              loop
              className="w-full h-[450px] object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 text-white bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-xl">
              <h3 className="font-bold text-lg">{video.title}</h3>
              <p className="text-sm text-gray-300">@{video.creator}</p>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span>❤️ {video.likes} Me gusta</span>
                <span className="bg-blue-600 px-2 py-1 rounded text-white font-semibold">Promoción Activa</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}