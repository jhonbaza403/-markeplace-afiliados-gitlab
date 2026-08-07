export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled'

export interface OrderItem {
  id: string
  order_id: string
  product_id?: string
  store_id: string
  quantity: number
  unit_price: number
}

export interface Order {
  id: string
  customer_id: string
  total_amount: number
  status: OrderStatus
  shipping_address: Record<string, any>
  created_at: string
  order_items?: OrderItem[]
}