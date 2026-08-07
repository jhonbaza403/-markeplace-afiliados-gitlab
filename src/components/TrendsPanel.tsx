'use client'
import { useState } from 'react'

interface TrendingItem {
  id: string
  name: string
  category: string
  growth: string
  bestPlatform: string
  suggestedHashtags: string
  demandLevel: 'Alta' | 'Explosiva' | 'Media'
}

export default function TrendsPanel() {
  const [trends] = useState<TrendingItem[]>([
    {
      id: '1',
      name: 'Gadgets Tecnológicos & Auriculares TWS',
      category: 'Electrónica',
      growth: '+320%',
      bestPlatform: 'TikTok & Instagram Reels',
      suggestedHashtags: '#Tecnologia #Gadgets2026 #Ofertas',
      demandLevel: 'Explosiva'
    },
    {
      id: '2',
      name: 'Revistas & Artículos Académicos de IA',
      category: 'Educación & Ciencia',
      growth: '+185%',
      bestPlatform: 'LinkedIn & Telegram',
      suggestedHashtags: '#Ciencia #Investigacion #IA',
      demandLevel: 'Alta'
    },
    {
      id: '3',
      name: 'Moda y Accesorios de Verano',
      category: 'Moda',
      growth: '+140%',
      bestPlatform: 'Instagram & Pinterest',
      suggestedHashtags: '#Moda2026 #OutfitInspo #Tendencias',
      demandLevel: 'Alta'
    }
  ])

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 my-8">
      {/* Cabecera del Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-ping"></span>
            <h2 className="text-xl font-bold text-gray-800">
              Panel de Inteligencia Comercial & Tendencias 🧠⚡
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            El algoritmo analiza tendencias globales en redes sociales para sugerirte qué y dónde publicar para vender más.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
          ● Algoritmo Activo (Escucha Social)
        </span>
      </div>

      {/* Métricas rápidas de impacto */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 border border-blue-100">
          <span className="text-xs font-bold uppercase text-blue-600">Red con Mayor Conversión</span>
          <p className="text-xl font-extrabold text-gray-800 mt-1">TikTok & WhatsApp</p>
          <p className="text-xs text-gray-500 mt-1">68% de las compras masivas provienen de enlaces compartidos aquí.</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 p-4 border border-emerald-100">
          <span className="text-xs font-bold uppercase text-emerald-600">Formato Más Viral</span>
          <p className="text-xl font-extrabold text-gray-800 mt-1">Videos Shorts (15s-60s)</p>
          <p className="text-xs text-gray-500 mt-1">Los videos con llamado a la acción convierten 3.5x más rápido.</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 p-4 border border-purple-100">
          <span className="text-xs font-bold uppercase text-purple-600">Horario Pico de Publicación</span>
          <p className="text-xl font-extrabold text-gray-800 mt-1">6:00 PM - 9:30 PM</p>
          <p className="text-xs text-gray-500 mt-1">Mayor interacción del público comprador en redes sociales.</p>
        </div>
      </div>

      {/* Tabla de Productos/Categorías con Demanda Explosiva */}
      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
        🔥 Tendencias Detectadas y Recomendaciones de Venta
      </h3>

      <div className="space-y-4">
        {trends.map((item) => (
          <div 
            key={item.id}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border p-4 hover:border-emerald-500 hover:shadow-sm transition bg-gray-50/50"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  item.demandLevel === 'Explosiva' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  Demanda {item.demandLevel}
                </span>
                <span className="text-xs text-gray-500 font-medium">{item.category}</span>
              </div>
              <h4 className="font-bold text-gray-800">{item.name}</h4>
              <p className="text-xs text-gray-600">
                <strong className="text-gray-700">Hashtags recomendados:</strong> {item.suggestedHashtags}
              </p>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0">
              <div className="text-left md:text-right">
                <p className="text-xs text-gray-500">Crecimiento de interés</p>
                <p className="text-lg font-black text-emerald-600">{item.growth}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-xs text-gray-500">Mejor Red Social</p>
                <p className="text-xs font-bold text-gray-800">{item.bestPlatform}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}