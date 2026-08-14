'use client';

// ==========================================================
// ARCHIVO: src/components/B2BCheckoutModal.tsx
// Credi Marketplace
//
// PROPÓSITO:
// Modal de creación de órdenes mayoristas B2B.
//
// RESPONSABILIDADES:
// - Seleccionar cantidad mayorista.
// - Calcular el total de la operación.
// - Seleccionar método de pago.
// - Mostrar las instrucciones de pago.
// - Registrar la referencia de pago.
// - Crear una orden B2B en Supabase.
//
// IMPORTANTE:
// Este componente NO verifica blockchain ni Binance.
// Solamente registra la orden y la referencia proporcionada
// por el usuario para su posterior validación.
//
// La seguridad definitiva depende de:
// - autenticación Supabase;
// - Row Level Security (RLS);
// - políticas de INSERT;
// - validaciones del backend;
// - proceso de verificación de pagos.
// ==========================================================

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from 'react';

import { createClient } from '@/lib/supabase/client';

// ==========================================================
// 1. TIPOS
// ==========================================================

type PaymentMethod = 'binance_pay' | 'usdt_trc20';

interface B2BCheckoutModalProps {
  productId: string;
  productName: string;
  supplierId?: string;
  wholesalePrice: number;
  minQuantity: number;
  binancePayId: string;
  usdtWalletAddress: string;
  onClose: () => void;
}

// ==========================================================
// 2. CONSTANTES
// ==========================================================

/**
 * Límite defensivo para evitar cantidades absurdamente grandes
 * introducidas accidentalmente desde el navegador.
 *
 * La validación definitiva debe existir también en backend/DB.
 */
const MAX_B2B_QUANTITY = 1_000_000;

/**
 * Longitud máxima de una referencia de pago.
 */
const MAX_TRANSACTION_REFERENCE_LENGTH = 200;

// ==========================================================
// 3. UTILIDADES
// ==========================================================

function normalizePositiveInteger(value: number): number {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, Math.floor(value));
}

function normalizePositivePrice(value: number): number {
  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }

  return value;
}

function formatUSDT(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// ==========================================================
// 4. COMPONENTE
// ==========================================================

export default function B2BCheckoutModal({
  productId,
  productName,
  supplierId,
  wholesalePrice,
  minQuantity,
  binancePayId,
  usdtWalletAddress,
  onClose,
}: B2BCheckoutModalProps) {
  // --------------------------------------------------------
  // Normalización defensiva de propiedades recibidas
  // --------------------------------------------------------

  const safeMinQuantity = useMemo(
    () =>
      Math.min(
        normalizePositiveInteger(minQuantity),
        MAX_B2B_QUANTITY,
      ),
    [minQuantity],
  );

  const safeWholesalePrice = useMemo(
    () => normalizePositivePrice(wholesalePrice),
    [wholesalePrice],
  );

  // --------------------------------------------------------
  // Estado
  // --------------------------------------------------------

  const [quantity, setQuantity] = useState<number>(
    safeMinQuantity,
  );

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('binance_pay');

  const [paymentReference, setPaymentReference] =
    useState('');

  const [copiedField, setCopiedField] = useState<
    'binance' | 'wallet' | null
  >(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  // --------------------------------------------------------
  // Reajustar cantidad si cambia el mínimo del producto
  // --------------------------------------------------------

  useEffect(() => {
    setQuantity((currentQuantity) =>
      Math.min(
        Math.max(currentQuantity, safeMinQuantity),
        MAX_B2B_QUANTITY,
      ),
    );
  }, [safeMinQuantity]);

  // --------------------------------------------------------
  // Total
  // --------------------------------------------------------

  const totalUSD = useMemo(() => {
    const normalizedQuantity = Math.min(
      Math.max(
        normalizePositiveInteger(quantity),
        safeMinQuantity,
      ),
      MAX_B2B_QUANTITY,
    );

    return normalizedQuantity * safeWholesalePrice;
  }, [
    quantity,
    safeMinQuantity,
    safeWholesalePrice,
  ]);

  // ========================================================
  // COPIAR INFORMACIÓN DE PAGO
  // ========================================================

  const handleCopy = useCallback(
    async (
      text: string,
      field: 'binance' | 'wallet',
    ) => {
      if (!text.trim()) {
        return;
      }

      try {
        await navigator.clipboard.writeText(text);

        setCopiedField(field);

        window.setTimeout(() => {
          setCopiedField(null);
        }, 2000);
      } catch (error: unknown) {
        console.error(
          'No fue posible copiar la información de pago:',
          error,
        );

        setErrorMessage(
          'No fue posible copiar automáticamente. Puedes seleccionar y copiar el dato manualmente.',
        );
      }
    },
    [],
  );

  // ========================================================
  // CAMBIO DE CANTIDAD
  // ========================================================

  const handleQuantityChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const rawValue = event.target.value;

    if (rawValue === '') {
      setQuantity(safeMinQuantity);
      return;
    }

    const parsedValue = Number.parseInt(
      rawValue,
      10,
    );

    if (!Number.isFinite(parsedValue)) {
      setQuantity(safeMinQuantity);
      return;
    }

    const normalizedValue = Math.min(
      Math.max(parsedValue, safeMinQuantity),
      MAX_B2B_QUANTITY,
    );

    setQuantity(normalizedValue);
    setErrorMessage(null);
  };

  // ========================================================
  // CAMBIO DE MÉTODO DE PAGO
  // ========================================================

  const handlePaymentMethodChange = (
    method: PaymentMethod,
  ) => {
    setPaymentMethod(method);
    setPaymentReference('');
    setErrorMessage(null);
    setCopiedField(null);
  };

  // ========================================================
  // VALIDACIÓN
  // ========================================================

  const validateOrder = (): string | null => {
    if (!productId.trim()) {
      return 'El producto seleccionado no es válido.';
    }

    if (!productName.trim()) {
      return 'El producto no tiene un nombre válido.';
    }

    if (
      !Number.isFinite(safeWholesalePrice) ||
      safeWholesalePrice <= 0
    ) {
      return 'El precio mayorista no es válido.';
    }

    if (
      quantity < safeMinQuantity ||
      quantity > MAX_B2B_QUANTITY
    ) {
      return `La cantidad debe estar entre ${safeMinQuantity.toLocaleString()} y ${MAX_B2B_QUANTITY.toLocaleString()} unidades.`;
    }

    const normalizedReference =
      paymentReference.trim();

    if (!normalizedReference) {
      return 'Debes introducir la referencia de pago.';
    }

    if (
      normalizedReference.length >
      MAX_TRANSACTION_REFERENCE_LENGTH
    ) {
      return `La referencia de pago no puede superar los ${MAX_TRANSACTION_REFERENCE_LENGTH} caracteres.`;
    }

    if (paymentMethod === 'binance_pay') {
      if (!binancePayId.trim()) {
        return 'El Binance Pay ID del proveedor no está configurado.';
      }
    }

    if (paymentMethod === 'usdt_trc20') {
      if (!usdtWalletAddress.trim()) {
        return 'La dirección USDT TRC20 del proveedor no está configurada.';
      }
    }

    if (
      !Number.isFinite(totalUSD) ||
      totalUSD <= 0
    ) {
      return 'El importe total de la orden no es válido.';
    }

    return null;
  };

  // ========================================================
  // CREACIÓN DE ORDEN
  // ========================================================

  const handleConfirmPayment = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);

    const validationError = validateOrder();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      // ----------------------------------------------------
      // Obtener usuario autenticado
      // ----------------------------------------------------

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw new Error(
          'No fue posible verificar la sesión actual.',
        );
      }

      if (!user) {
        setErrorMessage(
          'Debes iniciar sesión para procesar una orden mayorista.',
        );
        return;
      }

      // ----------------------------------------------------
      // Normalización final antes de persistir
      // ----------------------------------------------------

      const normalizedQuantity = Math.min(
        Math.max(
          Math.floor(quantity),
          safeMinQuantity,
        ),
        MAX_B2B_QUANTITY,
      );

      const normalizedReference =
        paymentReference.trim();

      const normalizedTotal =
        normalizedQuantity * safeWholesalePrice;

      // ----------------------------------------------------
      // Crear orden B2B
      // ----------------------------------------------------

      const { error: insertError } =
        await supabase
          .from('b2b_orders')
          .insert({
            user_id: user.id,
            product_id: productId.trim(),
            product_title: productName.trim(),
            supplier_id: supplierId?.trim() || null,
            quantity: normalizedQuantity,
            unit_price_usd: safeWholesalePrice,
            total_usd: normalizedTotal,
            payment_method: paymentMethod,

            // Conservamos la referencia en el campo existente
            // mientras el esquema de BD no sea migrado.
            binance_tx_id: normalizedReference,

            status: 'verifying',
          });

      if (insertError) {
        console.error(
          'Supabase B2B order error:',
          insertError,
        );

        throw new Error(
          'No fue posible registrar la orden en el sistema.',
        );
      }

      // ----------------------------------------------------
      // Éxito
      // ----------------------------------------------------

      setSuccessMessage(
        'Orden B2B registrada correctamente. La referencia de pago quedó pendiente de verificación.',
      );

      window.setTimeout(() => {
        onClose();
      }, 2200);
    } catch (error: unknown) {
      console.error(
        'Error al registrar la orden B2B:',
        error,
      );

      const message =
        error instanceof Error
          ? error.message
          : 'Hubo un error al registrar la orden.';

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/70
        p-4
        backdrop-blur-sm
      "
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="b2b-checkout-title"
        className="
          w-full
          max-w-lg
          max-h-[90vh]
          overflow-y-auto
          rounded-2xl
          border
          border-border
          bg-card
          p-6
          text-card-foreground
          shadow-2xl
        "
      >
        {/* ==================================================
            CABECERA
        ================================================== */}

        <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
          <div className="min-w-0">
            <span
              className="
                inline-flex
                items-center
                rounded
                border
                border-amber-500/20
                bg-amber-500/10
                px-2
                py-0.5
                text-[10px]
                font-bold
                uppercase
                tracking-wider
                text-amber-500
              "
            >
              Orden Mayorista B2B
            </span>

            <h2
              id="b2b-checkout-title"
              className="
                mt-2
                break-words
                text-lg
                font-bold
                text-foreground
              "
            >
              {productName}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Cerrar ventana de orden mayorista"
            className="
              shrink-0
              rounded-lg
              p-1
              text-xl
              font-bold
              text-muted-foreground
              transition
              hover:bg-muted
              hover:text-foreground
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-primary
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            ×
          </button>
        </div>

        {/* ==================================================
            MENSAJES
        ================================================== */}

        {errorMessage && (
          <div
            role="alert"
            className="
              mt-5
              rounded-xl
              border
              border-destructive/30
              bg-destructive/10
              p-3
              text-sm
              text-destructive
            "
          >
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="
              mt-5
              rounded-xl
              border
              border-emerald-500/30
              bg-emerald-500/10
              p-3
              text-sm
              text-emerald-600
              dark:text-emerald-400
            "
          >
            {successMessage}
          </div>
        )}

        {/* ==================================================
            CANTIDAD
        ================================================== */}

        <div className="mt-6 space-y-2">
          <label
            htmlFor="b2b-quantity"
            className="
              block
              text-xs
              font-semibold
              text-muted-foreground
            "
          >
            Cantidad a comprar
          </label>

          <p className="text-[11px] text-muted-foreground">
            Pedido mínimo mayorista:{' '}
            <strong className="text-foreground">
              {safeMinQuantity.toLocaleString()}
            </strong>{' '}
            unidades.
          </p>

          <input
            id="b2b-quantity"
            type="number"
            inputMode="numeric"
            min={safeMinQuantity}
            max={MAX_B2B_QUANTITY}
            step={1}
            value={quantity}
            onChange={handleQuantityChange}
            disabled={isSubmitting}
            className="
              w-full
              rounded-xl
              border
              border-border
              bg-muted/50
              px-4
              py-3
              font-bold
              text-foreground
              outline-none
              transition
              focus:border-amber-500
              focus:ring-2
              focus:ring-amber-500/20
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          />

          <div
            className="
              flex
              flex-col
              gap-2
              pt-2
              text-xs
              text-muted-foreground
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <span>
              Precio unitario:{' '}
              <strong className="text-foreground">
                ${formatUSDT(safeWholesalePrice)} USDT
              </strong>
            </span>

            <span>
              Total:{' '}
              <strong className="text-sm text-amber-500">
                ${formatUSDT(totalUSD)} USDT
              </strong>
            </span>
          </div>
        </div>

        {/* ==================================================
            MÉTODO DE PAGO
        ================================================== */}

        <fieldset className="mt-6 space-y-3">
          <legend
            className="
              text-xs
              font-semibold
              text-muted-foreground
            "
          >
            Método de pago
          </legend>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                handlePaymentMethodChange('binance_pay')
              }
              disabled={isSubmitting}
              aria-pressed={
                paymentMethod === 'binance_pay'
              }
              className={`
                rounded-xl
                border
                p-3
                text-left
                transition
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-amber-500
                disabled:cursor-not-allowed
                disabled:opacity-60
                ${
                  paymentMethod === 'binance_pay'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                    : 'border-border bg-muted/30 text-muted-foreground hover:border-amber-500/50'
                }
              `}
            >
              <span className="block text-sm font-bold">
                ⚡ Binance Pay
              </span>

              <span className="mt-1 block text-[10px] opacity-80">
                Pago mediante Binance Pay ID.
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                handlePaymentMethodChange('usdt_trc20')
              }
              disabled={isSubmitting}
              aria-pressed={
                paymentMethod === 'usdt_trc20'
              }
              className={`
                rounded-xl
                border
                p-3
                text-left
                transition
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-amber-500
                disabled:cursor-not-allowed
                disabled:opacity-60
                ${
                  paymentMethod === 'usdt_trc20'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                    : 'border-border bg-muted/30 text-muted-foreground hover:border-amber-500/50'
                }
              `}
            >
              <span className="block text-sm font-bold">
                🌐 USDT TRC20
              </span>

              <span className="mt-1 block text-[10px] opacity-80">
                Red TRON (TRC20).
              </span>
            </button>
          </div>
        </fieldset>

        {/* ==================================================
            INSTRUCCIONES DE PAGO
        ================================================== */}

        <div
          className="
            mt-6
            space-y-3
            rounded-xl
            border
            border-border
            bg-muted/50
            p-4
          "
        >
          {paymentMethod === 'binance_pay' ? (
            <>
              <p className="text-xs text-muted-foreground">
                Envía el importe exacto mediante Binance Pay
                utilizando el siguiente Pay ID:
              </p>

              <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                <span className="min-w-0 flex-1 break-all font-mono text-sm font-bold text-foreground">
                  {binancePayId || 'No configurado'}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      binancePayId,
                      'binance',
                    )
                  }
                  disabled={
                    isSubmitting ||
                    !binancePayId.trim()
                  }
                  className="
                    shrink-0
                    text-xs
                    font-bold
                    text-amber-500
                    hover:underline
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {copiedField === 'binance'
                    ? '¡Copiado!'
                    : 'Copiar'}
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs leading-5 text-muted-foreground">
                Envía exactamente{' '}
                <strong className="text-foreground">
                  ${formatUSDT(totalUSD)} USDT
                </strong>{' '}
                utilizando la red{' '}
                <strong className="text-foreground">
                  TRON (TRC20)
                </strong>
                .
              </p>

              <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                <span className="min-w-0 flex-1 break-all font-mono text-xs font-bold text-foreground">
                  {usdtWalletAddress ||
                    'No configurada'}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      usdtWalletAddress,
                      'wallet',
                    )
                  }
                  disabled={
                    isSubmitting ||
                    !usdtWalletAddress.trim()
                  }
                  className="
                    shrink-0
                    text-xs
                    font-bold
                    text-amber-500
                    hover:underline
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {copiedField === 'wallet'
                    ? '¡Copiado!'
                    : 'Copiar'}
                </button>
              </div>

              <p className="text-[11px] leading-5 text-amber-600 dark:text-amber-400">
                Verifica cuidadosamente la red y la
                dirección antes de enviar fondos. Las
                transferencias realizadas a una red o
                dirección incorrecta pueden no ser
                recuperables.
              </p>
            </>
          )}
        </div>

        {/* ==================================================
            REFERENCIA DE PAGO
        ================================================== */}

        <form
          onSubmit={handleConfirmPayment}
          className="mt-6 space-y-4"
        >
          <div>
            <label
              htmlFor="b2b-payment-reference"
              className="
                mb-1
                block
                text-xs
                font-semibold
                text-muted-foreground
              "
            >
              {paymentMethod === 'binance_pay'
                ? 'Referencia / Order ID de Binance'
                : 'Hash de la transacción (TXID)'}
            </label>

            <input
              id="b2b-payment-reference"
              type="text"
              required
              maxLength={
                MAX_TRANSACTION_REFERENCE_LENGTH
              }
              autoComplete="off"
              spellCheck={false}
              placeholder={
                paymentMethod === 'binance_pay'
                  ? 'Ej.: 218391029381029'
                  : 'Introduce el TXID de la transacción'
              }
              value={paymentReference}
              onChange={(event) => {
                setPaymentReference(
                  event.target.value,
                );
                setErrorMessage(null);
              }}
              disabled={isSubmitting}
              className="
                w-full
                rounded-xl
                border
                border-border
                bg-muted/50
                px-4
                py-3
                text-xs
                text-foreground
                outline-none
                transition
                focus:border-amber-500
                focus:ring-2
                focus:ring-amber-500/20
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            />

            <p className="mt-1 text-[10px] text-muted-foreground">
              La referencia se utilizará para la
              verificación posterior del pago.
            </p>
          </div>

          {/* ==================================================
              BOTÓN
          ================================================== */}

          <button
            type="submit"
            disabled={
              isSubmitting ||
              !paymentReference.trim() ||
              !!successMessage
            }
            className="
              w-full
              rounded-xl
              bg-amber-500
              py-3
              font-bold
              text-slate-950
              shadow-lg
              transition
              hover:bg-amber-600
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-amber-500
              focus-visible:ring-offset-2
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {isSubmitting
              ? 'Registrando orden...'
              : successMessage
                ? 'Orden registrada'
                : 'Registrar Pedido B2B'}
          </button>
        </form>

        {/* ==================================================
            AVISO DE SEGURIDAD
        ================================================== */}

        <p className="mt-4 text-center text-[10px] leading-4 text-muted-foreground">
          La recepción de esta solicitud no constituye por
          sí misma confirmación del pago. La orden quedará
          pendiente hasta completar la verificación
          correspondiente.
        </p>
      </div>
    </div>
  );
}