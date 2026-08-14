'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface B2BFormData {
  title: string
  category: string
  wholesalePriceUSD: string
  regularPriceUSD: string
  minOrderQuantity: string
  stockAvailable: string
  binancePayId: string
  usdtWalletAddress: string
  imageUrl: string
  description: string
}

const INITIAL_FORM: B2BFormData = {
  title: '',
  category: 'Electrónica',
  wholesalePriceUSD: '',
  regularPriceUSD: '',
  minOrderQuantity: '10',
  stockAvailable: '',
  binancePayId: '',
  usdtWalletAddress: '',
  imageUrl: '',
  description: '',
}

const CATEGORIES = [
  'Electrónica',
  'Moda & Accesorios',
  'Educación & Publicaciones',
  'Hogar & Construcción',
]

export default function B2BProductForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<B2BFormData>(INITIAL_FORM)

  const updateField = <K extends keyof B2BFormData>(
    field: K,
    value: B2BFormData[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const validateForm = (): string | null => {
    const title = formData.title.trim()
    const description = formData.description.trim()
    const wholesalePrice = Number(formData.wholesalePriceUSD)
    const regularPrice = Number(formData.regularPriceUSD)
    const minQuantity = Number(formData.minOrderQuantity)
    const stock = Number(formData.stockAvailable)
    const binancePayId = formData.binancePayId.trim()
    const wallet = formData.usdtWalletAddress.trim()
    const imageUrl = formData.imageUrl.trim()

    if (!title) {
      return 'Debes indicar el título del producto o lote.'
    }

    if (title.length < 3) {
      return 'El título debe contener al menos 3 caracteres.'
    }

    if (!description) {
      return 'Debes proporcionar una descripción del producto.'
    }

    if (description.length < 20) {
      return 'La descripción debe contener al menos 20 caracteres.'
    }

    if (!Number.isFinite(wholesalePrice) || wholesalePrice <= 0) {
      return 'El precio mayorista debe ser mayor que 0.'
    }

    if (!Number.isFinite(regularPrice) || regularPrice <= 0) {
      return 'El precio de referencia debe ser mayor que 0.'
    }

    if (wholesalePrice >= regularPrice) {
      return 'El precio mayorista debe ser inferior al precio de referencia al detal.'
    }

    if (!Number.isInteger(minQuantity) || minQuantity < 1) {
      return 'La cantidad mínima de pedido debe ser un número entero mayor que 0.'
    }

    if (!Number.isInteger(stock) || stock < 0) {
      return 'El stock disponible debe ser un número entero igual o mayor que 0.'
    }

    if (stock < minQuantity) {
      return 'El stock disponible no puede ser inferior a la cantidad mínima de pedido.'
    }

    if (!binancePayId) {
      return 'Debes indicar el Binance Pay ID.'
    }

    if (!wallet) {
      return 'Debes indicar la dirección USDT TRC20.'
    }

    if (!imageUrl) {
      return 'Debes indicar la URL de la imagen del producto.'
    }

    try {
      new URL(imageUrl)
    } catch {
      return 'La URL de la imagen no es válida.'
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (loading) return

    const validationError = validateForm()

    if (validationError) {
      alert(validationError)
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) {
        console.error('Error obteniendo usuario:', authError)
        alert('No fue posible verificar tu sesión.')
        return
      }

      if (!user) {
        alert('Debes iniciar sesión para publicar productos mayoristas.')
        return
      }

      const wholesalePrice = Number(formData.wholesalePriceUSD)
      const regularPrice = Number(formData.regularPriceUSD)
      const minQuantity = Number(formData.minOrderQuantity)
      const stock = Number(formData.stockAvailable)

      const productPayload = {
        supplier_id: user.id,
        title: formData.title.trim(),
        category: formData.category,
        wholesale_price_usd: wholesalePrice,
        regular_price_usd: regularPrice,
        min_order_quantity: minQuantity,
        stock_available: stock,
        binance_pay_id: formData.binancePayId.trim(),
        usdt_wallet_address: formData.usdtWalletAddress.trim(),
        image_url: formData.imageUrl.trim(),
        description: formData.description.trim(),

        // Recomendado si tu tabla posee este campo.
        // status: 'pending',
      }

      const { error: insertError } = await supabase
        .from('b2b_products')
        .insert(productPayload)

      if (insertError) {
        console.error('Error Supabase:', insertError)
        throw insertError
      }

      alert(
        '¡Producto B2B registrado exitosamente! La oferta ha sido enviada para procesamiento.',
      )

      setFormData(INITIAL_FORM)
    } catch (error: unknown) {
      console.error('Error publicando producto B2B:', error)

      const message =
        error instanceof Error
          ? error.message
          : 'Error desconocido al publicar el producto.'

      console.error('Detalle:', message)

      alert(
        'No fue posible publicar el producto mayorista. Verifica los datos e intenta nuevamente.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="max-w-3xl mx-auto bg-card text-card-foreground border border-border p-6 md:p-8 rounded-2xl shadow-lg space-y-6"
    >
      {/* ENCABEZADO */}
      <div className="border-b border-border pb-5">
        <span className="inline-flex text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-lg border border-amber-500/20">
          Portal de Vendedores B2B 📦
        </span>

        <h2 className="text-xl md:text-2xl font-bold text-foreground mt-2">
          Publicar Producto o Lote Mayorista
        </h2>

        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          Registra una oferta mayorista indicando precios, cantidades,
          disponibilidad y datos de pago.
        </p>
      </div>

      {/* INFORMACIÓN GENERAL */}
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">
            Información del producto
          </h3>

          <p className="text-[11px] text-muted-foreground mt-1">
            Estos datos serán utilizados para presentar tu oferta a compradores
            B2B.
          </p>
        </div>

        <div>
          <label
            htmlFor="b2b-title"
            className="text-xs font-semibold text-muted-foreground block mb-1.5"
          >
            Título del Producto / Lote
          </label>

          <input
            id="b2b-title"
            type="text"
            required
            minLength={3}
            maxLength={150}
            placeholder="Ej: Lote de 50 Cornetas Bluetooth Impermeables"
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div>
          <label
            htmlFor="b2b-category"
            className="text-xs font-semibold text-muted-foreground block mb-1.5"
          >
            Categoría
          </label>

          <select
            id="b2b-category"
            value={formData.category}
            onChange={(e) => updateField('category', e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="b2b-description"
            className="text-xs font-semibold text-muted-foreground block mb-1.5"
          >
            Descripción
          </label>

          <textarea
            id="b2b-description"
            required
            minLength={20}
            maxLength={3000}
            rows={5}
            placeholder="Describe características, condiciones de venta, presentación, garantía, tiempos de entrega y cualquier información relevante para el comprador."
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground resize-none focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />

          <div className="text-right text-[10px] text-muted-foreground mt-1">
            {formData.description.length}/3000
          </div>
        </div>
      </section>

      {/* PRECIOS Y CANTIDADES */}
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">
            Precios y disponibilidad
          </h3>

          <p className="text-[11px] text-muted-foreground mt-1">
            Utiliza valores numéricos expresados en USD/USDT.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="b2b-wholesale-price"
              className="text-xs font-semibold text-muted-foreground block mb-1.5"
            >
              Precio Mayorista
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-500">
                $
              </span>

              <input
                id="b2b-wholesale-price"
                type="number"
                min="0.01"
                step="0.01"
                required
                placeholder="5.50"
                value={formData.wholesalePriceUSD}
                onChange={(e) =>
                  updateField('wholesalePriceUSD', e.target.value)
                }
                className="w-full bg-muted/50 border border-border rounded-xl pl-8 pr-4 py-2.5 text-sm font-bold text-emerald-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <p className="text-[10px] text-muted-foreground mt-1">
              Precio por unidad.
            </p>
          </div>

          <div>
            <label
              htmlFor="b2b-regular-price"
              className="text-xs font-semibold text-muted-foreground block mb-1.5"
            >
              Precio de Referencia al Detal
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                $
              </span>

              <input
                id="b2b-regular-price"
                type="number"
                min="0.01"
                step="0.01"
                required
                placeholder="12.00"
                value={formData.regularPriceUSD}
                onChange={(e) =>
                  updateField('regularPriceUSD', e.target.value)
                }
                className="w-full bg-muted/50 border border-border rounded-xl pl-8 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-amber-500"
              />
            </div>

            <p className="text-[10px] text-muted-foreground mt-1">
              Debe ser superior al precio mayorista.
            </p>
          </div>

          <div>
            <label
              htmlFor="b2b-moq"
              className="text-xs font-semibold text-muted-foreground block mb-1.5"
            >
              Cantidad Mínima de Pedido (MOQ)
            </label>

            <input
              id="b2b-moq"
              type="number"
              min="1"
              step="1"
              required
              placeholder="10"
              value={formData.minOrderQuantity}
              onChange={(e) =>
                updateField('minOrderQuantity', e.target.value)
              }
              className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label
              htmlFor="b2b-stock"
              className="text-xs font-semibold text-muted-foreground block mb-1.5"
            >
              Stock Total Disponible
            </label>

            <input
              id="b2b-stock"
              type="number"
              min="0"
              step="1"
              required
              placeholder="500"
              value={formData.stockAvailable}
              onChange={(e) =>
                updateField('stockAvailable', e.target.value)
              }
              className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </section>

      {/* IMAGEN */}
      <section>
        <label
          htmlFor="b2b-image"
          className="text-xs font-semibold text-muted-foreground block mb-1.5"
        >
          URL de Imagen del Producto
        </label>

        <input
          id="b2b-image"
          type="url"
          required
          placeholder="https://ejemplo.com/producto.jpg"
          value={formData.imageUrl}
          onChange={(e) => updateField('imageUrl', e.target.value)}
          className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-amber-500"
        />

        <p className="text-[10px] text-muted-foreground mt-1">
          Recomendación: posteriormente integrar almacenamiento propio de
          imágenes mediante Supabase Storage.
        </p>
      </section>

      {/* PAGOS */}
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">
            Configuración de pagos
          </h3>

          <p className="text-[11px] text-muted-foreground mt-1">
            Estos datos serán utilizados para identificar el destino del pago
            mayorista.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="b2b-binance-id"
              className="text-xs font-semibold text-muted-foreground block mb-1.5"
            >
              Binance Pay ID
            </label>

            <input
              id="b2b-binance-id"
              type="text"
              required
              maxLength={100}
              placeholder="Ej: 218391029"
              value={formData.binancePayId}
              onChange={(e) =>
                updateField('binancePayId', e.target.value)
              }
              className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm font-mono text-foreground focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label
              htmlFor="b2b-wallet"
              className="text-xs font-semibold text-muted-foreground block mb-1.5"
            >
              Dirección USDT TRC20
            </label>

            <input
              id="b2b-wallet"
              type="text"
              required
              maxLength={100}
              placeholder="Dirección de red TRON"
              value={formData.usdtWalletAddress}
              onChange={(e) =>
                updateField('usdtWalletAddress', e.target.value)
              }
              className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm font-mono text-foreground focus:outline-none focus:border-amber-500"
            />

            <p className="text-[10px] text-muted-foreground mt-1">
              TRC20 corresponde a la red TRON.
            </p>
          </div>
        </div>
      </section>

      {/* AVISO */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          <strong className="text-amber-500">
            Importante:
          </strong>{' '}
          la publicación de una oferta no implica que el pago haya sido
          verificado. La plataforma debe validar posteriormente la operación
          y el cumplimiento de las condiciones de la oferta.
        </p>
      </div>

      {/* BOTÓN */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3.5 rounded-xl transition shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading
          ? 'Publicando oferta...'
          : 'Publicar Oferta Mayorista ⚡'}
      </button>
    </form>
  )
}