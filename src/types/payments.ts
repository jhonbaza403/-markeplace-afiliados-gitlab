// ==========================================================
// ARCHIVO: src/types/payments.ts
// Tipos de pagos y transacciones
// Credi Marketplace
// ==========================================================

/**
 * ==========================================================
 * PAYMENT STATUS
 * ==========================================================
 *
 * Estado general de una transacción de pago.
 *
 * Debe mantenerse sincronizado con la lógica de pagos
 * implementada en Supabase / backend.
 */
export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded'
  | 'partially_refunded';

/**
 * ==========================================================
 * PAYMENT PROVIDER
 * ==========================================================
 *
 * Proveedor o mecanismo utilizado para procesar el pago.
 *
 * IMPORTANTE:
 * No confundir provider con currency.
 *
 * Ejemplo:
 *
 * provider = 'stripe'
 * currency = 'USD'
 */
export type PaymentProvider =
  | 'stripe'
  | 'paypal'
  | 'credits'
  | 'binance_pay'
  | 'usdt_trc20'
  | 'bank_transfer';

/**
 * ==========================================================
 * PAYMENT CURRENCY
 * ==========================================================
 *
 * Monedas soportadas por el sistema de pagos.
 *
 * ISO 4217 para monedas FIAT y códigos explícitos
 * para activos digitales.
 */
export type PaymentCurrency =
  | 'USD'
  | 'EUR'
  | 'VES'
  | 'COP'
  | 'MXN'
  | 'BRL'
  | 'USDT';

/**
 * ==========================================================
 * PAYMENT TRANSACTION
 * ==========================================================
 *
 * Representa una transacción financiera asociada
 * a una orden.
 */
export interface PaymentTransaction {
  /** UUID de la transacción */
  id: string;

  /** UUID de la orden relacionada */
  orderId: string;

  /** UUID del comprador */
  buyerId: string;

  /**
   * Importe de la transacción.
   *
   * IMPORTANTE:
   * El valor definitivo debe provenir del backend/database.
   * No debe utilizarse JavaScript para cálculos financieros
   * de precisión crítica.
   */
  amount: number;

  /** Moneda utilizada */
  currency: PaymentCurrency;

  /** Estado actual de la transacción */
  status: PaymentStatus;

  /** Proveedor/método de procesamiento */
  provider: PaymentProvider;

  /** Referencia externa del proveedor, si existe */
  providerTransactionId?: string | null;

  /** Fecha de creación ISO */
  createdAt: string;

  /** Fecha de última actualización ISO */
  updatedAt?: string | null;
}

/**
 * ==========================================================
 * PAYMENT SUMMARY
 * ==========================================================
 *
 * Versión ligera para listados, dashboards y órdenes.
 */
export interface PaymentSummary {
  id: string;
  orderId: string;
  amount: number;
  currency: PaymentCurrency;
  status: PaymentStatus;
  provider: PaymentProvider;
  createdAt: string;
}

/**
 * ==========================================================
 * PAYMENT RESULT
 * ==========================================================
 *
 * Resultado normalizado de una operación de pago.
 *
 * Útil para respuestas de Server Actions, APIs o RPC.
 */
export interface PaymentResult {
  success: boolean;

  transaction?: PaymentTransaction;

  error?: string;

  errorCode?: string;
}

/**
 * ==========================================================
 * PAYMENT CREATION INPUT
 * ==========================================================
 *
 * Datos necesarios para iniciar una transacción.
 *
 * El id, buyerId y createdAt NO deben venir del cliente
 * cuando puedan determinarse de forma segura en servidor.
 */
export interface CreatePaymentInput {
  orderId: string;
  amount: number;
  currency: PaymentCurrency;
  provider: PaymentProvider;
}

/**
 * ==========================================================
 * PAYMENT REFUND
 * ==========================================================
 *
 * Información relacionada con un reembolso.
 */
export interface PaymentRefund {
  id: string;

  paymentId: string;

  amount: number;

  currency: PaymentCurrency;

  reason?: string | null;

  createdAt: string;
}