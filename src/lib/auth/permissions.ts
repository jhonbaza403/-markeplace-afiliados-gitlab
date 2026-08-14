import 'server-only'

import type { Role } from './roles'
import { ROLES } from './roles'

export const PERMISSIONS = {
  PROFILE_READ: 'profile:read',
  PROFILE_UPDATE: 'profile:update',

  PRODUCT_READ: 'product:read',
  PRODUCT_CREATE: 'product:create',
  PRODUCT_UPDATE: 'product:update',
  PRODUCT_DELETE: 'product:delete',

  STORE_READ: 'store:read',
  STORE_CREATE: 'store:create',
  STORE_UPDATE: 'store:update',

  ORDER_READ: 'order:read',
  ORDER_CREATE: 'order:create',
  ORDER_UPDATE: 'order:update',

  JOB_READ: 'job:read',
  JOB_CREATE: 'job:create',
  JOB_UPDATE: 'job:update',

  PROFESSIONAL_READ: 'professional:read',
  PROFESSIONAL_UPDATE: 'professional:update',

  COMPANY_READ: 'company:read',
  COMPANY_UPDATE: 'company:update',

  ADMIN_READ: 'admin:read',
  ADMIN_USERS: 'admin:users',
  ADMIN_ORDERS: 'admin:orders',
  ADMIN_PRODUCTS: 'admin:products',
  ADMIN_STORES: 'admin:stores',
  ADMIN_SETTINGS: 'admin:settings',
} as const

export type Permission =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  [ROLES.CUSTOMER]: [
    PERMISSIONS.PROFILE_READ,
    PERMISSIONS.PROFILE_UPDATE,
    PERMISSIONS.PRODUCT_READ,
    PERMISSIONS.ORDER_READ,
    PERMISSIONS.ORDER_CREATE,
  ],

  [ROLES.VENDOR]: [
    PERMISSIONS.PROFILE_READ,
    PERMISSIONS.PROFILE_UPDATE,

    PERMISSIONS.PRODUCT_READ,
    PERMISSIONS.PRODUCT_CREATE,
    PERMISSIONS.PRODUCT_UPDATE,
    PERMISSIONS.PRODUCT_DELETE,

    PERMISSIONS.STORE_READ,
    PERMISSIONS.STORE_CREATE,
    PERMISSIONS.STORE_UPDATE,

    PERMISSIONS.ORDER_READ,
    PERMISSIONS.ORDER_UPDATE,
  ],

  [ROLES.PROFESSIONAL]: [
    PERMISSIONS.PROFILE_READ,
    PERMISSIONS.PROFILE_UPDATE,

    PERMISSIONS.PRODUCT_READ,

    PERMISSIONS.JOB_READ,

    PERMISSIONS.PROFESSIONAL_READ,
    PERMISSIONS.PROFESSIONAL_UPDATE,
  ],

  [ROLES.COMPANY]: [
    PERMISSIONS.PROFILE_READ,
    PERMISSIONS.PROFILE_UPDATE,

    PERMISSIONS.PRODUCT_READ,

    PERMISSIONS.JOB_READ,
    PERMISSIONS.JOB_CREATE,
    PERMISSIONS.JOB_UPDATE,

    PERMISSIONS.COMPANY_READ,
    PERMISSIONS.COMPANY_UPDATE,
  ],

  [ROLES.ADMIN]: Object.values(PERMISSIONS),
}

export function hasPermission(
  role: Role,
  permission: Permission,
): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function getPermissions(
  role: Role,
): readonly Permission[] {
  return ROLE_PERMISSIONS[role] ?? []
}