// ==========================================================
// ARCHIVO: src/types/b2b.ts
// Tipos de datos para Productos, Órdenes y Calificaciones B2B
// ==========================================================

export type B2BProductStatus = 'draft' | 'active' | 'inactive';
export type B2BOrderStatus = 'pending' | 'verifying' | 'completed' | 'cancelled';
export type B2BPaymentMethod = 'binance_pay' | 'usdt_trc20' | 'bank_transfer';

export interface B2BProduct {
  id: string;
  supplier_id: string;
  title: string;
  description?: string;
  sku?: string;
  regular_price_usd?: number;
  unit_price_usdt: number; // Precio unitario en USDT / USD
  moq: number;              // Minimum Order Quantity (Cantidad Mínima)
  stock_available: number;
  category?: string;
  image_url?: string;
  status?: B2BProductStatus;
  created_at?: string;
  updated_at?: string;
}

export interface B2BOrder {
  id: string;
  user_id: string;
  product_id: string;
  product_title: string;
  supplier_id?: string;
  quantity: number;
  unit_price_usd: number;
  total_usd: number;
  payment_method: B2BPaymentMethod;
  binance_tx_id?: string;
  status: B2BOrderStatus;
  created_at?: string;
  updated_at?: string;
}

export interface Rating {
  id: string;
  reviewer_id: string;
  target_user_id: string;
  rating: number; // 1 a 5
  comment: string;
  is_scam_report: boolean;
  created_at?: string;
}