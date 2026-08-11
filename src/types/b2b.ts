export interface B2BProduct {
  id: string
  title: string
  description?: string
  sku?: string
  regular_price_usd?: number
  unit_price_usdt: number // Coincide con unit_price_usdt de Supabase
  moq: number // Coincide con moq de Supabase
  stock_available: number
  category?: string
  image_url?: string
  supplier_id: string
  status?: 'draft' | 'active' | 'inactive'
}

export interface B2BOrder {
  id: string
  user_id: string
  product_id: string
  product_title: string
  supplier_id?: string
  quantity: number
  unit_price_usd: number
  total_usd: number
  payment_method: 'binance_pay' | 'usdt_trc20' | 'bank_transfer'
  binance_tx_id?: string
  status: 'pending' | 'verifying' | 'completed' | 'cancelled'
  created_at?: string
}

export interface Rating {
  id: string
  reviewer_id: string
  target_user_id: string
  rating: number
  comment: string
  is_scam_report: boolean
  created_at?: string
}