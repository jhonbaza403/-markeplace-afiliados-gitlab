import { UserRole } from '@/types/users';

/**
 * Verifica si un usuario tiene un rol específico.
 * Los administradores siempre tienen permiso.
 */
export function hasRequiredRole(userRoles: UserRole[], requiredRole: UserRole): boolean {
  if (!userRoles || userRoles.length === 0) return false;
  if (userRoles.includes('admin')) return true; // El admin todo lo puede
  
  return userRoles.includes(requiredRole);
}

/**
 * Sanitización básica de strings para prevenir inyecciones XSS simples
 * en inputs que luego se renderizarán.
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}