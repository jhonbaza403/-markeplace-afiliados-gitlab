// ==========================================================
// ARCHIVO: src/i18n/config.ts
// Configuración de Internacionalización (i18n) y Métodos de Pago
// ==========================================================

import type { B2BPaymentMethod } from '@/types/b2b';

export const locales = ['es', 'en', 'pt', 'fr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

export const currencyMap: Record<Locale, string> = {
  es: 'VES',
  en: 'USD',
  pt: 'BRL',
  fr: 'EUR',
};

export const SUPPORTED_CURRENCIES = {
  FIAT: ['VES', 'USD', 'BRL', 'EUR', 'COP', 'MXN', 'ARS'],
  CRYPTO: ['USDT'],
} as const;

export interface B2BPaymentOption {
  id: B2BPaymentMethod;
  name: string;
  icon: string;
  type: 'crypto' | 'fiat';
}

// Métodos de pago aceptados para B2B y Mayoristas
export const B2B_PAYMENT_METHODS: readonly B2BPaymentOption[] = [
  { id: 'binance_pay', name: 'Binance Pay (USDT)', icon: '⚡', type: 'crypto' },
  { id: 'usdt_trc20', name: 'USDT (Red TRC20 / Polygon)', icon: '🌐', type: 'crypto' },
  { id: 'bank_transfer', name: 'Transferencia Bancaria Mayorista', icon: '🏦', type: 'fiat' },
] as const;