// ==========================================================
// ARCHIVO: src/lib/security.ts
// Funciones auxiliares de Seguridad, Control de Accesos y Sanitización
// ==========================================================

import { UserRole } from '@/types/users';

/**
 * Verifica si un usuario posee un rol requerido dentro de sus roles asignados.
 * El rol 'admin' otorga acceso global de manera predeterminada.
 */
export function hasRequiredRole(
  userRoles: UserRole[] | undefined | null,
  requiredRole: UserRole
): boolean {
  if (!userRoles || !Array.isArray(userRoles) || userRoles.length === 0) {
    return false;
  }

  // Permiso absoluto para administradores
  if (userRoles.includes('admin')) {
    return true;
  }

  return userRoles.includes(requiredRole);
}

/**
 * Sanitización básica de cadenas de texto para prevenir inyecciones XSS
 * en valores de entrada de usuario antes de su renderización.
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}