export interface Store {
  id: string
  vendor_id: string
  store_name: string
  slug: string
  description?: string
  is_verified: boolean
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  parent_id?: string
  children?: Category[] // Añadido para soportar subcategorías en árbol
}

export interface Product {
  id: string
  store_id: string
  category_id?: string
  title: string
  slug: string
  description?: string
  price: number
  stock: number
  images: string[]
  is_active: boolean
  created_at: string
}