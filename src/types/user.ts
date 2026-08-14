// ==========================================================
// ARCHIVO: src/types/user.ts
// Tipos de usuarios, perfiles y tiendas
// Credi Marketplace
// ==========================================================

/**
 * Roles disponibles en Credi Marketplace.
 *
 * Debe mantenerse sincronizado con:
 * public.user_role en Supabase.
 */
export type UserRole =
  | 'customer'
  | 'vendor'
  | 'professional'
  | 'company'
  | 'admin';

/**
 * Perfil público del usuario.
 */
export interface UserProfile {
  /** UUID del usuario en auth.users */
  id: string;

  /** Correo electrónico del usuario */
  email: string;

  /** Nombre completo */
  fullName: string;

  /** Rol principal dentro de la plataforma */
  role: UserRole;

  /** URL del avatar, si existe */
  avatarUrl?: string | null;

  /** Indica si la cuenta está habilitada */
  isActive: boolean;

  /** Fecha de creación en formato ISO */
  createdAt: string;

  /** Fecha de última actualización, si está disponible */
  updatedAt?: string | null;
}

/**
 * Perfil comercial de una tienda.
 */
export interface StoreProfile {
  /** UUID de la tienda */
  id: string;

  /** UUID del propietario/vendedor */
  vendorId: string;

  /** Nombre comercial de la tienda */
  storeName: string;

  /** Identificador URL amigable */
  slug: string;

  /** Descripción comercial */
  description?: string | null;

  /** Indica si la tienda ha sido verificada */
  isVerified: boolean;

  /** Fecha de creación */
  createdAt: string;

  /** Fecha de última actualización */
  updatedAt?: string | null;
}

/**
 * Datos mínimos utilizados para mostrar
 * información resumida de un usuario.
 */
export interface UserSummary {
  id: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string | null;
}

/**
 * Datos mínimos de una tienda para tarjetas,
 * listados y resultados de búsqueda.
 */
export interface StoreSummary {
  id: string;
  storeName: string;
  slug: string;
  isVerified: boolean;
}

/**
 * Perfil combinado utilizado en determinadas
 * vistas del marketplace.
 */
export interface UserWithStore extends UserProfile {
  store?: StoreProfile | null;
}