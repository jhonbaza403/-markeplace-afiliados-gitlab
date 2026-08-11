'use client'

import { useState } from 'react'
import B2BCheckoutModal from '../B2BCheckoutModal'

export interface B2BProductItem {
  id: string
  title: string
  category: string
  supplierName: string
  wholesalePriceUSD: number
  regularPriceUSD: number
  minOrderQuantity: number
  stockAvailable: number
  imageUrl: string
  binancePayId: string
  usdtWalletAddress: string
}

export default function B2BMarketplace() {
  const [selectedProduct, setSelectedProduct] = useState<B2BProductItem | null>(null)

  // Productos B2B de prueba
  const [products] = useState<B2BProductItem[]>([
    {
      id: 'b2b-1',
      title: 'Lote de 50 Auriculares Bluetooth TWS i12',
      category: 'Electrónica',
      supplierName: 'Importadora Tech Global C.A.',
      wholesalePriceUSD: 3.5,
      regularPriceUSD: 8.0,
      minOrderQuantity: 10,
      stockAvailable: 500,
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80',
      binancePayId: '218391029',
      usdtWalletAddress: 'TYDx129381092830192830192830'
    },
    {
      id: 'b2b-2',
      title: 'Caja x24 Revistas Científicas de Inteligencia Artificial',
      category: 'Educación & Publicaciones',
      supplierName: 'Editorial Académica Internacional',
      wholesalePriceUSD: 12.0,
      regularPriceUSD: 25.0,
      minOrderQuantity: 5,
      stockAvailable: 120,
      imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&q=80',
      binancePayId: '218391029',
      usdtWalletAddress: 'TYDx129381092830192830192830'
    }
  ])

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Banner Encabezado B2B */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 p-8 text-slate-950 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <span className="bg-slate-950/20 text-slate-950 border border-slate-950/30 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            Mercado Mayorista & B2B 🏬
          </span>
          <h1 className="text-2xl md:text-4xl font-black mt-3 leading-tight">
            Compra al Mayor Directo de Fabricantes e Importadores
          </h1>
          <p className="text-slate-900/80 text-sm mt-2 font-medium">
            Precios especiales por volumen. Cancela de forma segura mediante <strong>Binance Pay (USDT)</strong> o Transferencias Bancarias.
          </p>
        </div>
        <div className="shrink-0 bg-slate-950/10 backdrop-blur-md p-4 rounded-2xl border border-slate-950/10 text-center space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-900">Pagos Cripto Integrados</p>
          <p className="text-xl font-extrabold text-slate-950">⚡ Binance Pay / USDT</p>
        </div>
      </div>

      {/* Grid de Productos Mayoristas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const discount = Math.round(((product.regularPriceUSD - product.wholesalePriceUSD) / product.regularPriceUSD) * 100)

          return (
            <div 
              key={product.id}
              className="bg-card text-card-foreground border border-border rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 bg-muted overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow">
                    -{discount}% al Mayor
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{product.category}</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      Stock: {product.stockAvailable} unid.
                    </span>
                  </div>

                  <h3 className="font-bold text-base leading-snug text-foreground line-clamp-2">
                    {product.title}
                  </h3>

                  <p className="text-xs text-muted-foreground">
                    Proveedor: <strong className="text-foreground">{product.supplierName}</strong>
                  </p>

                  <div className="p-3 bg-muted/40 rounded-xl border border-border space-y-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-muted-foreground">Precio Mayorista:</span>
                      <span className="text-lg font-black text-amber-500">
                        ${product.wholesalePriceUSD.toFixed(2)} USDT
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-muted-foreground">Precio Ref. Detal:</span>
                      <span className="line-through text-muted-foreground">
                        ${product.regularPriceUSD.toFixed(2)} USD
                      </span>
                    </div>
                    <div className="pt-2 border-t border-border flex justify-between text-xs font-bold text-foreground">
                      <span>Pedido Mínimo (MOQ):</span>
                      <span>{product.minOrderQuantity} unidades</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(product)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Hacer Pedido Mayorista</span>
                  <span>⚡</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal de Pago Binance para el producto seleccionado */}
      {selectedProduct && (
        <B2BCheckoutModal
          productName={selectedProduct.title}
          wholesalePrice={selectedProduct.wholesalePriceUSD}
          minQuantity={selectedProduct.minOrderQuantity}
          binancePayId={selectedProduct.binancePayId}
          usdtWalletAddress={selectedProduct.usdtWalletAddress}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  )
}