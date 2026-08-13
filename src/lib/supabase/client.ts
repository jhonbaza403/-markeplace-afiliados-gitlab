// ==========================================================
// ARCHIVO: src/lib/supabase/client.ts
// Cliente Supabase para Client Components (Browser)
// ==========================================================

import { createBrowserClient } from '@supabase/ssr';

// Función para instanciar el cliente del navegador
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Instancia singleton exportada para mantener compatibilidad con tus imports
export const supabase = createClient();