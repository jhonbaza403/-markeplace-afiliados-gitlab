export interface B2BProduct {
  id: string
  title: string
  sku: string
  regularPriceUSD: number
  wholesalePriceUSD: number // Precio al mayor
  minOrderQuantity: number // Cantidad mínima de pedido (MOQ)
  stockAvailable: number
  supplierId: string
  supplierName: string
  isB2BOnly: boolean
}

export interface B2BOrder {
  id: string
  productId: string
  quantity: number
  totalUSD: number
  paymentMethod: 'binance_pay' | 'usdt_trc20' | 'bank_transfer'
  paymentStatus: 'pending' | 'verifying' | 'completed' | 'cancelled'
  binancePayId?: string
}