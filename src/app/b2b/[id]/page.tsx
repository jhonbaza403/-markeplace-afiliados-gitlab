'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import B2BCheckoutModal from '@/components/B2BCheckoutModal'
import Link from 'next/link'

interface B2BProduct {
  id: string
  title: string
  description: string
  moq: number
  unit_price_usdt: number
  stock_available: number
  category: string
  image_url: string
  binance_pay_id?: string
  usdt_wallet_address?: string
  supplier_id: string
}

export default function B2BProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<B2BProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    async function fetchProduct() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('b2b_products')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) {
        console.error('Error al cargar el producto B2B:', error)
      } else {
        setProduct(data)
      }
      setLoading(false)
    }

    fetchProduct()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-sm font-semibold animate-pulse">Cargando detalles del lote mayorista...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center space-y-4">
        <p className="text-base font-bold text-destructive">Producto mayorista no encontrado.</p>
        <Link href="/b2b" className="text-xs text-primary font-semibold hover:underline">
          ← Volver al Catálogo Mayorista
        </Link>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link href="/b2b" className="text-xs text-muted-foreground hover:text-foreground font-semibold flex items-center gap-1">
          ← Volver al Catálogo Mayorista
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-card border border-border p-6 rounded-3xl shadow-xl">
          <div className="relative rounded-2xl overflow-hidden bg-muted h-80 md:h-auto">
            <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
            <span className="absolute top-4 left-4 bg-amber-500 text-slate-950 font-black text-xs uppercase px-3 py-1 rounded-full shadow">
              Mayorista B2B
            </span>
          </div>

          <div className="space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                {product.category || 'General'}
              </span>
              <h1 className="text-2xl font-black text-foreground">{product.title}</h1>
              
              <div className="p-4 bg-muted/40 rounded-2xl border border-border space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-muted-foreground">Precio Mayorista (USDT):</span>
                  <span className="text-2xl font-black text-amber-500">${product.unit_price_usdt.toFixed(2)} USDT</span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between text-xs font-bold text-foreground">
                  <span>Pedido Mínimo (MOQ):</span>
                  <span>{product.moq} unidades</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Stock Disponible:</span>
                  <span className="text-emerald-500 font-bold">{product.stock_available} unidades</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{product.description || 'Sin descripción detallada.'}</p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-3.5 rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Comprar al Mayor con Binance Pay</span>
              <span>⚡</span>
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <B2BCheckoutModal
          productName={product.title}
          wholesalePrice={product.unit_price_usdt}
          minQuantity={product.moq}
          binancePayId={product.binance_pay_id || '218391029'}
          usdtWalletAddress={product.usdt_wallet_address || 'TYDx129381092830192830192830'}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </main>
  )
}