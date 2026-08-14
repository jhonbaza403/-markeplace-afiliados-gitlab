// ==========================================================
// ARCHIVO: src/lib/supabase/client.ts
// Credi Marketplace
//
// Supabase Browser Client
// Next.js App Router
// React 19
// @supabase/ssr
//
// USO:
// - Client Components
// - Autenticación en navegador
// - Consultas protegidas mediante RLS
// - Operaciones de usuario
//
// SEGURIDAD:
// - SOLO claves públicas
// - NUNCA SERVICE_ROLE_KEY
// - La autorización real permanece en PostgreSQL/RLS
// ==========================================================

import { createBrowserClient } from '@supabase/ssr';

// ==========================================================
// VARIABLES DE ENTORNO
// ==========================================================

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ==========================================================
// VALIDACIÓN DE CONFIGURACIÓN
// ==========================================================

if (!supabaseUrl) {
  throw new Error(
    'Falta la variable de entorno NEXT_PUBLIC_SUPABASE_URL.',
  );
}

if (!supabasePublishableKey) {
  throw new Error(
    'Falta la variable de entorno ' +
      'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ' +
      '(o NEXT_PUBLIC_SUPABASE_ANON_KEY durante la transición).',
  );
}

// ==========================================================
// CLIENTE SUPABASE
// ==========================================================

/**
 * Cliente singleton de Supabase para el navegador.
 *
 * createBrowserClient() está diseñado para trabajar con
 * @supabase/ssr y gestionar correctamente la sesión del
 * usuario en Client Components.
 *
 * La clave utilizada aquí es pública y está protegida por
 * las políticas RLS de PostgreSQL.
 */
export const supabase = createBrowserClient(
  supabaseUrl,
  supabasePublishableKey,
);