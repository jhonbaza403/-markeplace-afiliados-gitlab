'use client'

import { useState } from 'react'
import B2BCheckoutModal from '@/components/B2BCheckoutModal'
import Link from 'next/link'

export default function B2BProductDetailPage({ params }: { params: { id: string } }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Datos de ejemplo (sustituir con llamada a Supabase mediante params.id)
  const product = {
    id: params.id,
    title: 'Lote de 50 Auriculares Bluetooth TWS i12',
    category: 'Electrónica',
    supplierName: 'Importadora Tech Global C.A.',
    wholesalePriceUSD: 3.50,
    regularPriceUSD: 8.00,
    minOrderQuantity: 10,
    stockAvailable: 500,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
    binancePayId: '218391029',
    usdtWalletAddress: 'TYDx129381092830192830192830',
    description: 'Auriculares inalámbricos con cancelador de ruido ligero y caja de carga rápida. Ideal para tiendas de retail y revendedores. Envío asegurado a nivel nacional.'
  }

  const discount = Math.round(((product.regularPriceUSD - product.wholesalePriceUSD) / product.regularPriceUSD) * 100)

  return (
    <main className="min-h-screen bg-background text-foreground py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link href="/b2b" className="text-xs text-muted-foreground hover:text-foreground font-semibold flex items-center gap-1">
          ← Volver al Catalogo Mayorista
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-card border border-border p-6 rounded-3xl shadow-xl">
          <div className="relative rounded-2xl overflow-hidden bg-muted h-80 md:h-auto">
            <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
            <span className="absolute top-4 left-4 bg-amber-500 text-slate-950 font-black text-xs uppercase px-3 py-1 rounded-full shadow">
              -{discount}% Mayorista
            </span>
          </div>

          <div className="space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                {product.category}
              </span>
              <h1 className="text-2xl font-black text-foreground">{product.title}</h1>
              <p className="text-xs text-muted-foreground">
                Proveedor Verificado: <strong className="text-foreground">{product.supplierName}</strong>
              </p>
              
              <div className="p-4 bg-muted/40 rounded-2xl border border-border space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-muted-foreground">Precio Mayorista (USDT):</span>
                  <span className="text-2xl font-black text-amber-500">${product.wholesalePriceUSD.toFixed(2)} USDT</span>
                </div>
                <div className="flex justify-between items-baseline text-xs text-muted-foreground">
                  <span>Precio Ref. al Detal:</span>
                  <span className="line-through">${product.regularPriceUSD.toFixed(2)} USD</span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between text-xs font-bold text-foreground">
                  <span>Pedido Mínimo (MOQ):</span>
                  <span>{product.minOrderQuantity} unidades</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{product.description}</p>
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
          wholesalePrice={product.wholesalePriceUSD}
          minQuantity={product.minOrderQuantity}
          binancePayId={product.binancePayId}
          usdtWalletAddress={product.usdtWalletAddress}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </main>
  )
}