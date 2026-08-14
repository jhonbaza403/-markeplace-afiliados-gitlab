// ==========================================================
// ARCHIVO: src/lib/supabase/server.ts
// Credi Marketplace
//
// Cliente Supabase para:
// - Server Components
// - Server Actions
// - Route Handlers
//
// Next.js App Router
// @supabase/ssr
// ==========================================================

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// ==========================================================
// VARIABLES DE ENTORNO
// ==========================================================

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!url) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL no está configurada.',
    );
  }

  return url;
}

function getSupabasePublishableKey(): string {
  /**
   * Supabase recomienda actualmente utilizar la publishable key
   * para clientes que operan con el contexto del usuario.
   *
   * Se mantiene ANON_KEY como fallback temporal para facilitar
   * migraciones de proyectos existentes.
   */
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!key) {
    throw new Error(
      'Debe configurarse NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ' +
      'o NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    );
  }

  return key;
}

// ==========================================================
// CLIENTE SERVER
// ==========================================================

/**
 * Crea un cliente Supabase asociado a las cookies
 * de autenticación de la solicitud actual.
 *
 * IMPORTANTE:
 *
 * No convertir esta función en singleton.
 *
 * Cada contexto de servidor debe obtener un cliente asociado
 * a la solicitud correspondiente.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
    {
      cookies: {
        /**
         * Obtiene todas las cookies necesarias para que
         * Supabase pueda reconstruir la sesión.
         */
        getAll() {
          return cookieStore.getAll();
        },

        /**
         * Permite a Supabase actualizar las cookies de sesión.
         *
         * En algunos Server Components Next.js no permite
         * modificar cookies. En esos casos el middleware
         * debe encargarse del refresco de sesión.
         */
        setAll(cookiesToSet) {
          try {
            for (const {
              name,
              value,
              options,
            } of cookiesToSet) {
              cookieStore.set(
                name,
                value,
                options,
              );
            }
          } catch {
            /**
             * Server Components pueden ejecutar este callback
             * en un contexto donde las cookies son de solo lectura.
             *
             * No lanzamos una excepción aquí.
             *
             * El middleware debe refrescar la sesión cuando
             * corresponda.
             */
          }
        },
      },
    },
  );
}