/**
 * Valida si un formato de email es correcto
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida contraseñas (mínimo 8 caracteres, una mayúscula y un número)
 */
export function isStrongPassword(password: string): boolean {
  if (password.length < 8) return false;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  return hasUpperCase && hasNumbers;
}

/**
 * Valida si un precio es un monto lógico
 */
export function isValidPrice(price: number): boolean {
  return typeof price === 'number' && price > 0 && price < 1000000; // límite arbitrario superior
}