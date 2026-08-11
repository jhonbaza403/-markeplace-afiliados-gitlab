'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function B2BProductForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    category: 'Electrónica',
    wholesalePriceUSD: '',
    regularPriceUSD: '',
    minOrderQuantity: '10',
    stockAvailable: '',
    binancePayId: '',
    usdtWalletAddress: '',
    imageUrl: '',
    description: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        alert('Debes iniciar sesión para publicar productos mayoristas.')
        return
      }

      const { error } = await supabase.from('b2b_products').insert([
        {
          supplier_id: user.id,
          title: formData.title,
          category: formData.category,
          wholesale_price_usd: parseFloat(formData.wholesalePriceUSD),
          regular_price_usd: parseFloat(formData.regularPriceUSD),
          min_order_quantity: parseInt(formData.minOrderQuantity),
          stock_available: parseInt(formData.stockAvailable),
          binance_pay_id: formData.binancePayId,
          usdt_wallet_address: formData.usdtWalletAddress,
          image_url: formData.imageUrl,
          description: formData.description
        }
      ])

      if (error) throw error

      alert('¡Producto B2B publicado exitosamente!')
      setFormData({
        title: '',
        category: 'Electrónica',
        wholesalePriceUSD: '',
        regularPriceUSD: '',
        minOrderQuantity: '10',
        stockAvailable: '',
        binancePayId: '',
        usdtWalletAddress: '',
        imageUrl: '',
        description: ''
      })
    } catch (err: any) {
      console.error('Error publicando producto B2B:', err)
      alert('Error al publicar el producto mayorista.')
    } flex {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-card text-card-foreground border border-border p-6 rounded-2xl shadow-lg space-y-6">
      <div className="border-b border-border pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded border border-amber-500/20">
          Portal de Vendedores B2B 📦
        </span>
        <h2 className="text-xl font-bold text-foreground mt-1">Publicar Producto o Lote Mayorista</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Título del Producto / Lote</label>
          <input
            type="text"
            required
            placeholder="Ej: Lote de 50 Cornetas Bluetooth Impermeables"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Categoría</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-amber-500"
          >
            <option value="Electrónica">Electrónica</option>
            <option value="Moda">Moda & Accesorios</option>
            <option value="Educación & Publicaciones">Educación & Publicaciones</option>
            <option value="Hogar & Construcción">Hogar & Construcción</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Cantidad Mínima de Pedido (MOQ)</label>
          <input
            type="number"
            min="1"
            required
            placeholder="10"
            value={formData.minOrderQuantity}
            onChange={(e) => setFormData({ ...formData, minOrderQuantity: e.target.value })}
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Precio Mayorista (USDT por unidad)</label>
          <input
            type="number"
            step="0.01"
            required
            placeholder="5.50"
            value={formData.wholesalePriceUSD}
            onChange={(e) => setFormData({ ...formData, wholesalePriceUSD: e.target.value })}
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-xs font-bold text-emerald-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Precio Ref. al Detal (USD por unidad)</label>
          <input
            type="number"
            step="0.01"
            required
            placeholder="12.00"
            value={formData.regularPriceUSD}
            onChange={(e) => setFormData({ ...formData, regularPriceUSD: e.target.value })}
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Stock Total Disponible</label>
          <input
            type="number"
            required
            placeholder="500"
            value={formData.stockAvailable}
            onChange={(e) => setFormData({ ...formData, stockAvailable: e.target.value })}
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">URL de Imagen del Producto</label>
          <input
            type="url"
            required
            placeholder="https://..."
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Binance Pay ID</label>
          <input
            type="text"
            required
            placeholder="Ej: 218391029"
            value={formData.binancePayId}
            onChange={(e) => setFormData({ ...formData, binancePayId: e.target.value })}
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-xs font-mono text-foreground focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Dirección USDT TRC20</label>
          <input
            type="text"
            required
            placeholder="Ej: TYDx129381092830192830192830"
            value={formData.usdtWalletAddress}
            onChange={(e) => setFormData({ ...formData, usdtWalletAddress: e.target.value })}
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-xs font-mono text-foreground focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3.5 rounded-xl transition shadow-md cursor-pointer disabled:opacity-50"
      >
        {loading ? 'Publicando...' : 'Publicar Oferta Mayorista ⚡'}
      </button>
    </form>
  )
}