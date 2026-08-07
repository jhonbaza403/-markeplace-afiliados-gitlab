export type UserRole = 'customer' | 'vendor' | 'admin'

export interface Profile {
  id: string
  full_name: string
  email: string
  role: UserRole
  avatar_url?: string
  created_at: string
}