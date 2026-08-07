export type UserRole = 'customer' | 'vendor' | 'professional' | 'company' | 'admin'

export interface UserProfile {
  id: string
  email: string
  fullName: string
  role: UserRole
  avatarUrl?: string
  isActive: boolean
  createdAt: string
}

export interface StoreProfile {
  id: string
  vendorId: string
  storeName: string
  slug: string
  description?: string
  isVerified: boolean
  createdAt: string
}