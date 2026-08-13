import { z } from 'zod';

const envSchema = z.object({
  // Servidor (Solo accesibles en Server Components / Server Actions)
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "Falta la Service Role Key de Supabase"),
  DATABASE_URL: z.string().url("URL de la base de datos inválida"),
  GEMINI_API_KEY: z.string().optional(),

  // Cliente (Expuetas al navegador con NEXT_PUBLIC_)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("URL de Supabase inválida"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "Falta la Anon Key de Supabase"),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string().default("Credi Marketplace"),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.string().default("es"),
  NEXT_PUBLIC_DEFAULT_CURRENCY: z.string().default("USD"),
  NEXT_PUBLIC_DEFAULT_COUNTRY: z.string().default("VE"),
  NEXT_PUBLIC_ENV: z.enum(['development', 'staging', 'production']).default('development'),
});

// Valida en tiempo de ejecución
export const env = envSchema.parse({
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
  NEXT_PUBLIC_DEFAULT_CURRENCY: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY,
  NEXT_PUBLIC_DEFAULT_COUNTRY: process.env.NEXT_PUBLIC_DEFAULT_COUNTRY,
  NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
});