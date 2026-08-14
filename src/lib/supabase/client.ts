// ==========================================================
// ARCHIVO: src/lib/supabase/client.ts
// Credi Marketplace
//
// Supabase Browser Client
// Next.js 16.3
// React 19
// Supabase SSR
//
// USO:
// - Client Components
// - Auth en navegador
// - Consultas protegidas por RLS
//
// IMPORTANTE:
// - Nunca utilizar SERVICE_ROLE_KEY aquí.
// - Solo variables NEXT_PUBLIC_*.
// ==========================================================

import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    'Falta la variable de entorno NEXT_PUBLIC_SUPABASE_URL.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Falta la variable de entorno NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  );
}

/**
 * Cliente Supabase para el navegador.
 *
 * createBrowserClient() administra correctamente la sesión
 * utilizando el mecanismo SSR de Supabase.
 */
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
);