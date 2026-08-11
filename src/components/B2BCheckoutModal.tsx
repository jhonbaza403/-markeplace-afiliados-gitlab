'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface B2BCheckoutProps {
  productId: string
  productName: string
  supplierId?: string
  wholesalePrice: number
  minQuantity: number
  binancePayId: string
  usdtWalletAddress: string
  onClose: () => void
}

export default function B2BCheckoutModal({
  productId,
  productName,
  supplierId,
  wholesalePrice,
  minQuantity,
  binancePayId,
  usdtWalletAddress,
  onClose
}: B2BCheckoutProps) {
  const [quantity, setQuantity] = useState(minQuantity)
  const [paymentMethod, setPaymentMethod] = useState<'binance_pay' | 'usdt_trc20'>('binance_pay')
  const [txHash, setTxHash] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalUSD = quantity * wholesalePrice

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        alert('Debes iniciar sesión para procesar una orden mayorista.')
        setIsSubmitting(false)
        return
      }

      const { error } = await supabase.from('b2b_orders').insert([
        {
          user_id: user.id,
          product_id: productId,
          product_title: productName,
          supplier_id: supplierId || null,
          quantity: quantity,
          unit_price_usd: wholesalePrice,
          total_usd: totalUSD,
          payment_method: paymentMethod,
          binance_tx_id: txHash,
          status: 'verifying'
        }
      ])

      if (error) throw error

      alert('¡Orden B2B registrada con éxito! El proveedor verificará tu pago en Binance.')
      onClose()
    } catch (err: any) {
      console.error('Error al registrar la orden B2B:', err)
      alert('Hubo un error al registrar la orden. Por favor intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-card text-card-foreground border border-border rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-6">
        <div className="flex justify-between items-center border-b border-border pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded border border-amber-500/20">
              Orden Mayorista B2B 🏬
            </span>
            <h2 className="text-lg font-bold text-foreground mt-1">{productName}</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground font-bold text-xl cursor-pointer">
            ✕
          </button>
        </div>

        {/* Selección de Cantidad B2B */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground block">
            Cantidad a Comprar (Mínimo mayorista: {minQuantity} unidades)
          </label>
          <input
            type="number"
            min={minQuantity}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(minQuantity, parseInt(e.target.value) || minQuantity))}
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2 text-foreground font-bold focus:outline-none focus:border-amber-500"
          />
          <div className="flex justify-between text-xs text-muted-foreground pt-1">
            <span>Precio Mayorista: <strong>${wholesalePrice.toFixed(2)} USDT / unid.</strong></span>
            <span>Total a Pagar: <strong className="text-amber-500 text-sm">${totalUSD.toFixed(2)} USDT</strong></span>
          </div>
        </div>

        {/* Selector de Método de Pago Binance */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-muted-foreground block">Método de Pago Binance</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('binance_pay')}
              className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition cursor-pointer ${
                paymentMethod === 'binance_pay' 
                  ? 'border-amber-500 bg-amber-500/10 text-amber-500 font-bold' 
                  : 'border-border bg-muted/30 text-muted-foreground'
              }`}
            >
              <span className="text-sm">⚡ Binance Pay</span>
              <span className="text-[10px] opacity-80">Sin comisiones internas</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('usdt_trc20')}
              className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition cursor-pointer ${
                paymentMethod === 'usdt_trc20' 
                  ? 'border-amber-500 bg-amber-500/10 text-amber-500 font-bold' 
                  : 'border-border bg-muted/30 text-muted-foreground'
              }`}
            >
              <span className="text-sm">🌐 USDT TRC20</span>
              <span className="text-[10px] opacity-80">Red Tron / Polygon</span>
            </button>
          </div>
        </div>

        {/* Detalle de Pago */}
        <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-3">
          {paymentMethod === 'binance_pay' ? (
            <>
              <p className="text-xs text-muted-foreground">Paga desde la App de Binance usando el Pay ID:</p>
              <div className="flex items-center justify-between bg-card p-3 rounded-lg border border-border">
                <span className="font-mono text-sm font-bold text-foreground">{binancePayId}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(binancePayId)}
                  className="text-xs font-bold text-amber-500 hover:underline cursor-pointer"
                >
                  {isCopied ? '¡Copiado!' : 'Copiar Pay ID'}
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-muted-foreground">Envía exactamente <strong>${totalUSD.toFixed(2)} USDT</strong> a esta dirección:</p>
              <div className="flex items-center justify-between bg-card p-3 rounded-lg border border-border">
                <span className="font-mono text-xs font-bold text-foreground truncate max-w-[240px]">{usdtWalletAddress}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(usdtWalletAddress)}
                  className="text-xs font-bold text-amber-500 hover:underline shrink-0 cursor-pointer"
                >
                  {isCopied ? '¡Copiado!' : 'Copiar Dirección'}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Formulario de confirmación de transacción */}
        <form onSubmit={handleConfirmPayment} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">
              ID de Transacción / Order ID de Binance
            </label>
            <input
              type="text"
              required
              placeholder="Ej: 218391029381029"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2 text-xs text-foreground focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !txHash}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-xl transition shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? 'Verificando...' : 'Confirmar Pedido B2B'}
          </button>
        </form>
      </div>
    </div>
  )
}