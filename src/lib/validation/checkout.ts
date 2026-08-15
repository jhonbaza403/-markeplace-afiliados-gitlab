import {
  isUUID,
  normalizeString,
} from './common'

import {
  validateOrderItems,
  type ValidatedOrderItem,
} from './order'

export interface CheckoutValidationSuccess {
  success: true
  items: ValidatedOrderItem[]
  region: string
  affiliateRef: string | null
}

export interface CheckoutValidationFailure {
  success: false
  error: string
}

export type CheckoutValidationResult =
  | CheckoutValidationSuccess
  | CheckoutValidationFailure

export function validateCheckoutPayload(
  body: unknown,
): CheckoutValidationResult {
  if (!body || typeof body !== 'object') {
    return {
      success: false,
      error: 'Solicitud de checkout inválida.',
    }
  }

  const data = body as Record<string, unknown>

  const itemsResult =
    validateOrderItems(data.items)

  if (!itemsResult.success) {
    return itemsResult
  }

  const region =
    normalizeString(data.region) ?? 'GLOBAL'

  if (region.length > 50) {
    return {
      success: false,
      error: 'La región indicada no es válida.',
    }
  }

  const affiliateRef =
    normalizeString(data.affiliate_ref)

  return {
    success: true,
    items: itemsResult.items,
    region,
    affiliateRef,
  }
}

export function validateCustomerId(
  value: unknown,
): boolean {
  return isUUID(value)
}