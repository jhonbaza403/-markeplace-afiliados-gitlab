// ==========================================================
// ARCHIVO: src/lib/supabase/client.ts
// Credi Marketplace
//
// Supabase Browser Client
//
// Next.js App Router
// TypeScript
// ==========================================================

import {
  createBrowserClient,
} from "@supabase/ssr";


// ==========================================================
// VARIABLES DE ENTORNO
// ==========================================================

const supabaseUrl =
  process.env
    .NEXT_PUBLIC_SUPABASE_URL;


const supabaseAnonKey =
  process.env
    .NEXT_PUBLIC_SUPABASE_ANON_KEY;



// ==========================================================
// VALIDACIÓN
// ==========================================================

if (!supabaseUrl) {

  throw new Error(
    "Falta NEXT_PUBLIC_SUPABASE_URL en variables de entorno",
  );

}


if (!supabaseAnonKey) {

  throw new Error(
    "Falta NEXT_PUBLIC_SUPABASE_ANON_KEY en variables de entorno",
  );

}



// ==========================================================
// CLIENTE SUPABASE
// ==========================================================

export const supabaseClient =
  createBrowserClient(

    supabaseUrl,

    supabaseAnonKey,

  );
