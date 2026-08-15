```ts
import type { Locale } from '@/i18n/config'

/**
 * ============================================================
 * Credi Marketplace
 * Tipos del catálogo de productos y enlaces de afiliados
 * ============================================================
 *
 * Este archivo representa productos/promociones afiliadas
 * provenientes de plataformas externas como:
 *
 * - Amazon
 * - SHEIN
 * - AliExpress
 * - Alibaba
 *
 * No confundir con:
 *
 * - usuarios afiliados de Credi Marketplace
 * - comisiones internas
 * - conversiones
 * - liquidaciones
 * - órdenes internas
 *
 * Esos dominios deberán tener sus propios tipos.
 * ============================================================
 */

export type LocalizedText = Partial<Record<Locale, string>>

export type AffiliatePlatform =
  | 'amazon'
  | 'shein'
  | 'aliexpress'
  | 'alibaba'
  | 'other'

export interface AffiliateProduct {
  /**
   * Identificador interno estable.
   */
  id: string

  /**
   * Plataforma o socio comercial.
   */
  name: string

  /**
   * Identificador normalizado de la plataforma.
   */
  platform: AffiliatePlatform

  /**
   * Categoría localizada.
   */
  category: LocalizedText

  /**
   * Título comercial localizado.
   */
  title: LocalizedText

  /**
   * Descripción comercial localizada.
   */
  description: LocalizedText

  /**
   * Etiqueta comercial.
   *
   * Ejemplo:
   * "Oferta Amazon"
   * "Oferta SHEIN"
   * "Top AliExpress"
   */
  badge?: string

  /**
   * Variante visual controlada por la aplicación.
   *
   * No almacenar clases Tailwind arbitrarias provenientes
   * directamente de una fuente externa.
   */
  badgeVariant?:
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'neutral'

  /**
   * Identificador del icono utilizado por la interfaz.
   */
  icon?: string

  /**
   * URL real de afiliación.
   *
   * Esta URL puede contener parámetros o mecanismos
   * de tracking proporcionados por la plataforma externa.
   */
  affiliateUrl: string

  /**
   * Texto localizado del botón.
   */
  buttonText: LocalizedText

  /**
   * Producto disponible para publicación.
   */
  isActive: boolean

  /**
   * Fecha de creación del registro.
   */
  createdAt?: string

  /**
   * Fecha de última actualización.
   */
  updatedAt?: string
}

/**
 * Catálogo de enlaces afiliados externos.
 *
 * Los valores concretos deben mantenerse en configuración
 * segura o en la base de datos según la arquitectura final.
 */
export interface AffiliateLink {
  id: string

  platform: AffiliatePlatform

  name: string

  affiliateUrl: string

  isActive: boolean

  createdAt?: string

  updatedAt?: string
}
```
