// ==========================================================
// ARCHIVO: src/lib/validation.ts
// Funciones auxiliares de validación de entradas de usuario
// ==========================================================

/**
 * Valida si una cadena tiene formato de correo electrónico válido.
 */
export function isValidEmail(email: string | undefined | null): boolean {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Valida que una contraseña tenga al menos 8 caracteres,
 * incluyendo al menos una letra mayúscula y un número.
 */
export function isStrongPassword(password: string | undefined | null): boolean {
  if (!password || typeof password !== 'string' || password.length < 8) {
    return false;
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);

  return hasUpperCase && hasNumbers;
}

/**
 * Valida si un valor es un precio numérico válido y dentro de un rango lógico.
 */
export function isValidPrice(price: number | undefined | null): boolean {
  if (typeof price !== 'number' || Number.isNaN(price) || !Number.isFinite(price)) {
    return false;
  }

  return price > 0 && price < 1_000_000; // Límite arbitrario superior
}