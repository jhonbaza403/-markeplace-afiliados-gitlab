// ==========================================================
// ARCHIVO: src/features/auth/services/authService.ts
// Servicio de Autenticación con Supabase Auth
// ==========================================================

import { supabase } from '@/lib/supabase/client';
import type { UserRole } from '@/types/users';

/**
 * Registra un nuevo usuario en Supabase Auth
 */
export async function signUpUser(email: string, password: string, fullName: string) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: origin ? `${origin}/auth/callback` : undefined,
      data: {
        full_name: fullName,
        roles: ['customer'] as UserRole[],
      },
    },
  });

  if (error) throw error;
  return data;
}

/**
 * Inicia sesión con Email y Contraseña
 */
export async function signInUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Cierra la sesión activa del usuario
 */
export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Obtiene el usuario autenticado actualmente en la sesión activa
 */
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  return user;
}