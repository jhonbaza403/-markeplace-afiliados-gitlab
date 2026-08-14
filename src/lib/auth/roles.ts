import 'server-only'

export const ROLES = {
  CUSTOMER: 'customer',
  VENDOR: 'vendor',
  PROFESSIONAL: 'professional',
  COMPANY: 'company',
  ADMIN: 'admin',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ALL_ROLES: readonly Role[] = Object.values(ROLES)

export function isRole(value: unknown): value is Role {
  return (
    typeof value === 'string' &&
    ALL_ROLES.includes(value as Role)
  )
}

export function normalizeRole(value: unknown): Role {
  if (isRole(value)) {
    return value
  }

  return ROLES.CUSTOMER
}

export function hasRole(
  userRole: Role,
  allowedRoles: readonly Role[],
): boolean {
  return allowedRoles.includes(userRole)
}

export function isAdmin(role: Role): boolean {
  return role === ROLES.ADMIN
}

export function isVendor(role: Role): boolean {
  return role === ROLES.VENDOR
}

export function isProfessional(role: Role): boolean {
  return role === ROLES.PROFESSIONAL
}

export function isCompany(role: Role): boolean {
  return role === ROLES.COMPANY
}