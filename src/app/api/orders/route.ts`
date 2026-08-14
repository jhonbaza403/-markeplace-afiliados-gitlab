# `src/app/api/orders/route.ts`

```tsx
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/orders
 *
 * Crea una orden pendiente de pago.
 *
 * Principios de seguridad:
 *
 * - El usuario se obtiene desde Supabase Auth.
 * - Nunca se confía en el precio enviado por el cliente.
 * - El producto se vuelve a consultar en servidor.
 * - El stock se valida en servidor.
 * - La referencia de afiliado se valida antes de almacenarla.
 * - La orden nace como "pending".
 * - El pago NO se considera completado desde esta ruta.
 * - La operación de inventario debe ser atómica mediante RPC.
 */

export const runtime = 'nodejs'

export const dynamic = 'force-dynamic'

const MAX_QUANTITY = 100

type CreateOrderPayload = {
  product_id?: unknown
  quantity?: unknown
  affiliate_ref?: unknown
}

type RpcOrderResult = {
  order_id: string
  total_amount: number
}

function jsonError(
  message: string,
  status: number,
  code?: string
) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(code ? { code } : {}),
    },
    { status }
  )
}

function isValidUUID(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  )
}

function normalizeAffiliateRef(
  value: unknown
): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim()

  if (!normalized) {
    return null
  }

  /*
   * Evitamos referencias arbitrariamente grandes.
   * La validación definitiva del afiliado ocurre
   * nuevamente en PostgreSQL.
   */
  if (normalized.length > 128) {
    return null
  }

  return normalized
}

function parseQuantity(
  value: unknown
): number | null {
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    !Number.isInteger(value)
  ) {
    return null
  }

  if (value < 1 || value > MAX_QUANTITY) {
    return null
  }

  return value
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID()

  try {
    /*
     * ---------------------------------------------------------
     * 1. Validar Content-Type
     * ---------------------------------------------------------
     */

    const contentType =
      request.headers.get('content-type') || ''

    if (!contentType.includes('application/json')) {
      return jsonError(
        'La solicitud debe utilizar Content-Type: application/json.',
        415,
        'UNSUPPORTED_MEDIA_TYPE'
      )
    }

    /*
     * ---------------------------------------------------------
     * 2. Obtener usuario autenticado
     * ---------------------------------------------------------
     */

    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      console.error(
        `[orders:${requestId}] Auth error:`,
        authError
      )

      return jsonError(
        'No fue posible verificar la sesión.',
        401,
        'AUTHENTICATION_ERROR'
      )
    }

    if (!user) {
      return jsonError(
        'Debes iniciar sesión para realizar una compra.',
        401,
        'UNAUTHENTICATED'
      )
    }

    /*
     * ---------------------------------------------------------
     * 3. Leer y validar body
     * ---------------------------------------------------------
     */

    let body: CreateOrderPayload

    try {
      body = await request.json()
    } catch {
      return jsonError(
        'El cuerpo de la solicitud no contiene JSON válido.',
        400,
        'INVALID_JSON'
      )
    }

    const productId =
      typeof body.product_id === 'string'
        ? body.product_id.trim()
        : ''

    if (!productId || !isValidUUID(productId)) {
      return jsonError(
        'El identificador del producto no es válido.',
        400,
        'INVALID_PRODUCT_ID'
      )
    }

    const quantity = parseQuantity(body.quantity)

    if (quantity === null) {
      return jsonError(
        `La cantidad debe ser un número entero entre 1 y ${MAX_QUANTITY}.`,
        400,
        'INVALID_QUANTITY'
      )
    }

    const affiliateRef =
      normalizeAffiliateRef(body.affiliate_ref)

    /*
     * ---------------------------------------------------------
     * 4. Verificar producto en servidor
     * ---------------------------------------------------------
     *
     * IMPORTANTE:
     *
     * Nunca usamos product.price enviado desde el navegador.
     */

    const {
      data: product,
      error: productError,
    } = await supabase
      .from('products')
      .select(
        'id, title, price, stock, is_active, store_id'
      )
      .eq('id', productId)
      .maybeSingle()

    if (productError) {
      console.error(
        `[orders:${requestId}] Product query error:`,
        productError
      )

      return jsonError(
        'No fue posible verificar el producto.',
        500,
        'PRODUCT_LOOKUP_FAILED'
      )
    }

    if (!product) {
      return jsonError(
        'El producto solicitado no existe.',
        404,
        'PRODUCT_NOT_FOUND'
      )
    }

    if (!product.is_active) {
      return jsonError(
        'El producto ya no está disponible.',
        409,
        'PRODUCT_INACTIVE'
      )
    }

    if (
      typeof product.stock !== 'number' ||
      product.stock <= 0
    ) {
      return jsonError(
        'El producto se encuentra agotado.',
        409,
        'OUT_OF_STOCK'
      )
    }

    if (quantity > product.stock) {
      return jsonError(
        `La cantidad solicitada supera el inventario disponible. Stock actual: ${product.stock}.`,
        409,
        'INSUFFICIENT_STOCK'
      )
    }

    /*
     * ---------------------------------------------------------
     * 5. Validar precio almacenado
     * ---------------------------------------------------------
     */

    const unitPrice = Number(product.price)

    if (
      !Number.isFinite(unitPrice) ||
      unitPrice < 0
    ) {
      console.error(
        `[orders:${requestId}] Invalid product price for ${product.id}`
      )

      return jsonError(
        'El producto tiene un precio inválido.',
        500,
        'INVALID_PRODUCT_PRICE'
      )
    }

    /*
     * ---------------------------------------------------------
     * 6. Validar referencia de afiliado
     * ---------------------------------------------------------
     *
     * La referencia se trata como dato no confiable.
     *
     * La validación definitiva puede hacerse dentro de la RPC
     * contra la tabla correspondiente de afiliados.
     */

    let validatedAffiliateRef: string | null = null

    if (affiliateRef) {
      /*
       * Si tu sistema utiliza UUID como referencia de afiliado,
       * validamos el formato aquí.
       *
       * Si posteriormente utilizas códigos tipo:
       * "JOHNBAZA10"
       *
       * esta condición debe sustituirse por la consulta
       * correspondiente a tu tabla de afiliados.
       */
      if (isValidUUID(affiliateRef)) {
        validatedAffiliateRef = affiliateRef
      } else {
        /*
         * Por seguridad no rechazamos automáticamente códigos
         * alfanuméricos legítimos.
         *
         * La RPC deberá verificar que el código realmente existe.
         */
        validatedAffiliateRef = affiliateRef
      }
    }

    /*
     * ---------------------------------------------------------
     * 7. Calcular total únicamente como comprobación
     * ---------------------------------------------------------
     *
     * Este valor NO constituye la fuente de verdad.
     *
     * PostgreSQL debe volver a calcular:
     *
     * unit_price × quantity
     */

    const expectedTotal = Number(
      (unitPrice * quantity).toFixed(2)
    )

    if (!Number.isFinite(expectedTotal)) {
      return jsonError(
        'No fue posible calcular el total de la orden.',
        500,
        'INVALID_ORDER_TOTAL'
      )
    }

    /*
     * ---------------------------------------------------------
     * 8. Crear orden mediante RPC ATÓMICA
     * ---------------------------------------------------------
     *
     * La función PostgreSQL recomendada:
     *
     * create_pending_order(
     *   p_buyer_id,
     *   p_product_id,
     *   p_quantity,
     *   p_affiliate_ref
     * )
     *
     * Debe:
     *
     * 1. bloquear la fila del producto FOR UPDATE;
     * 2. volver a comprobar is_active;
     * 3. volver a comprobar stock;
     * 4. obtener el precio real;
     * 5. calcular el total;
     * 6. validar afiliado;
     * 7. insertar la orden;
     * 8. descontar/reservar inventario;
     * 9. hacer COMMIT como una única operación.
     *
     * Esto evita race conditions.
     */

    const {
      data: rpcData,
      error: rpcError,
    } = await supabase.rpc(
      'create_pending_order',
      {
        p_buyer_id: user.id,
        p_product_id: product.id,
        p_quantity: quantity,
        p_affiliate_ref: validatedAffiliateRef,
      }
    )

    if (rpcError) {
      console.error(
        `[orders:${requestId}] RPC create_pending_order error:`,
        rpcError
      )

      /*
       * No exponemos detalles internos de PostgreSQL
       * al navegador.
       */

      const message =
        rpcError.message?.toLowerCase() || ''

      if (
        message.includes('insufficient_stock') ||
        message.includes('stock')
      ) {
        return jsonError(
          'El inventario disponible cambió. Actualiza la página e inténtalo nuevamente.',
          409,
          'STOCK_CHANGED'
        )
      }

      if (
        message.includes('inactive') ||
        message.includes('product_not_available')
      ) {
        return jsonError(
          'El producto ya no está disponible.',
          409,
          'PRODUCT_NOT_AVAILABLE'
        )
      }

      if (
        message.includes('affiliate') ||
        message.includes('referral')
      ) {
        return jsonError(
          'La referencia de afiliado no es válida.',
          400,
          'INVALID_AFFILIATE'
        )
      }

      return jsonError(
        'No fue posible crear la orden.',
        500,
        'ORDER_CREATION_FAILED'
      )
    }

    /*
     * ---------------------------------------------------------
     * 9. Normalizar respuesta RPC
     * ---------------------------------------------------------
     */

    const rawOrder = Array.isArray(rpcData)
      ? rpcData[0]
      : rpcData

    const order =
      rawOrder as RpcOrderResult | null

    if (
      !order ||
      typeof order.order_id !== 'string'
    ) {
      console.error(
        `[orders:${requestId}] Invalid RPC response:`,
        rpcData
      )

      return jsonError(
        'La orden fue procesada de forma incompleta. Contacta al soporte.',
        500,
        'INVALID_ORDER_RESPONSE'
      )
    }

    /*
     * ---------------------------------------------------------
     * 10. Respuesta pública
     * ---------------------------------------------------------
     *
     * No devolvemos información sensible.
     */

    return NextResponse.json(
      {
        success: true,
        order_id: order.order_id,
        status: 'pending',
        total_amount:
          typeof order.total_amount === 'number'
            ? order.total_amount
            : expectedTotal,
        currency: 'USD',
        message:
          'Orden creada correctamente. Continúa con el proceso de pago.',
      },
      {
        status: 201,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch (error: unknown) {
    console.error(
      `[orders:${requestId}] Unexpected error:`,
      error
    )

    return jsonError(
      'Ocurrió un error inesperado al procesar la orden.',
      500,
      'INTERNAL_SERVER_ERROR'
    )
  }
}
```
