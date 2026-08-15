import 'server-only'

import type { Role } from './roles'

export const AUTH_ROUTES = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  UPDATE_PASSWORD: '/auth/update-password',
  VERIFY_EMAIL: '/auth/verify-email',
  AUTH_ERROR: '/auth/error',
} as const

export const APP_ROUTES = {
  DASHBOARD: '/dashboard',
  MARKETPLACE: '/marketplace',
  B2B: '/b2b',
} as const

export function getDefaultRedirectForRole(
  role: Role,
): string {
  switch (role) {
    case 'admin':
      return '/admin'

    case 'vendor':
      return '/dashboard/vendor'

    case 'professional':
      return '/dashboard/professional'

    case 'company':
      return '/dashboard/company'

    case 'customer':
    default:
      return '/dashboard'
  }
}

export function sanitizeRedirect(
  value: string | null | undefined,
  fallback = APP_ROUTES.DASHBOARD,
): string {
  if (!value) {
    return fallback
  }

  /*
   * Evita open redirects.
   *
   * Solo aceptamos rutas internas:
   * /dashboard
   * /marketplace
   * /checkout
   *
   * Nunca:
   * https://sitio-malicioso.com
   * //sitio-malicioso.com
   */
  if (!value.startsWith('/') || value.startsWith('//')) {
    return fallback
  }

  return value
}