export const locales = ['es', 'en', 'pt', 'fr'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'es';

export const currencyMap: Record<Locale, string> = {
  es: 'EUR', // o tu moneda por defecto para español (ej. USD, MXN, COP)
  en: 'USD',
  pt: 'BRL',
  fr: 'EUR',
};