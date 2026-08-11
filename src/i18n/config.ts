export const locales = ['es', 'en', 'pt', 'fr'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'es'

// Mapeo de monedas fiats locales según el idioma/región predeterminado
export const currencyMap: Record<Locale, string> = {
  es: 'VES', // Bolívar (Venezuela) o USD según la preferencia local
  en: 'USD', // Dólar estadounidense
  pt: 'BRL', // Real brasileño
  fr: 'EUR', // Euro
}

// Configuración de monedas soportadas por la plataforma
export const SUPPORTED_CURRENCIES = {
  FIAT: ['VES', 'USD', 'BRL', 'EUR', 'COP', 'MXN', 'ARS'],
  CRYPTO: ['USDT'],
} as const

export type Currency = typeof SUPPORTED_CURRENCIES.FIAT[number] | typeof SUPPORTED_CURRENCIES.CRYPTO[number]