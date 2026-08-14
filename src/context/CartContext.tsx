'use client';

// ==========================================================
// ARCHIVO: src/context/CartContext.tsx
// Credi Marketplace
//
// Contexto global del carrito de compras.
//
// Responsabilidades:
// - Gestión del carrito en el cliente
// - Alta de productos
// - Actualización de cantidades
// - Eliminación de productos
// - Vaciar carrito
// - Cálculo del subtotal
// - Validación básica de cantidades
// - Validación de productos activos
// - Control de stock disponible
//
// IMPORTANTE:
// Este contexto NO sustituye la validación del servidor.
//
// El precio, stock, disponibilidad y demás condiciones
// comerciales deben volver a validarse en el backend antes
// de crear una orden.
//
// ==========================================================

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { Product } from '@/types/product';

// ==========================================================
// TIPOS
// ==========================================================

export interface CartItem {
  /**
   * Producto incorporado al carrito.
   */
  product: Product;

  /**
   * Cantidad solicitada.
   */
  quantity: number;
}

export interface CartContextType {
  /**
   * Productos actualmente incluidos en el carrito.
   */
  cart: CartItem[];

  /**
   * Cantidad total de unidades.
   */
  itemCount: number;

  /**
   * Número de líneas diferentes del carrito.
   */
  lineCount: number;

  /**
   * Subtotal monetario del carrito.
   */
  totalAmount: number;

  /**
   * Agrega un producto al carrito.
   */
  addToCart: (
    product: Product,
    quantity?: number
  ) => boolean;

  /**
   * Actualiza la cantidad de un producto.
   */
  updateQuantity: (
    productId: string,
    quantity: number
  ) => boolean;

  /**
   * Incrementa la cantidad de un producto.
   */
  incrementQuantity: (
    productId: string,
    amount?: number
  ) => boolean;

  /**
   * Disminuye la cantidad de un producto.
   */
  decrementQuantity: (
    productId: string,
    amount?: number
  ) => boolean;

  /**
   * Elimina completamente un producto.
   */
  removeFromCart: (
    productId: string
  ) => void;

  /**
   * Vacía completamente el carrito.
   */
  clearCart: () => void;

  /**
   * Comprueba si un producto está en el carrito.
   */
  hasProduct: (
    productId: string
  ) => boolean;

  /**
   * Obtiene la cantidad de un producto.
   */
  getProductQuantity: (
    productId: string
  ) => number;
}

// ==========================================================
// CONSTANTES
// ==========================================================

const DEFAULT_QUANTITY = 1;

const MAX_QUANTITY_PER_PRODUCT = 999;

// ==========================================================
// CONTEXTO
// ==========================================================

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

// ==========================================================
// UTILIDADES
// ==========================================================

/**
 * Normaliza una cantidad para evitar:
 *
 * - NaN
 * - Infinity
 * - decimales
 * - valores negativos
 * - cantidades excesivas
 */
function normalizeQuantity(
  quantity: number
): number {
  if (!Number.isFinite(quantity)) {
    return 0;
  }

  const normalized = Math.floor(quantity);

  if (normalized <= 0) {
    return 0;
  }

  return Math.min(
    normalized,
    MAX_QUANTITY_PER_PRODUCT
  );
}

/**
 * Determina si un producto puede agregarse
 * al carrito.
 */
function isProductAvailable(
  product: Product
): boolean {
  return (
    Boolean(product.id) &&
    Boolean(product.title) &&
    product.is_active === true &&
    Number.isInteger(product.stock) &&
    product.stock > 0 &&
    Number.isFinite(product.price) &&
    product.price > 0
  );
}

/**
 * Redondea valores monetarios a dos decimales.
 *
 * IMPORTANTE:
 * Esto mejora la presentación y reduce errores
 * derivados de operaciones de punto flotante.
 *
 * La autoridad financiera definitiva siempre debe
 * ser el backend.
 */
function roundMoney(
  value: number
): number {
  return Math.round(
    (value + Number.EPSILON) * 100
  ) / 100;
}

// ==========================================================
// PROVIDER
// ==========================================================

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // ========================================================
  // AGREGAR PRODUCTO
  // ========================================================

  const addToCart = useCallback(
    (
      product: Product,
      quantity: number = DEFAULT_QUANTITY
    ): boolean => {
      const normalizedQuantity =
        normalizeQuantity(quantity);

      if (
        normalizedQuantity <= 0 ||
        !isProductAvailable(product)
      ) {
        return false;
      }

      setCart((currentCart) => {
        const existingItem =
          currentCart.find(
            (item) =>
              item.product.id === product.id
          );

        // ----------------------------------------------
        // Producto ya existente
        // ----------------------------------------------

        if (existingItem) {
          const requestedQuantity =
            existingItem.quantity +
            normalizedQuantity;

          const finalQuantity =
            Math.min(
              requestedQuantity,
              product.stock,
              MAX_QUANTITY_PER_PRODUCT
            );

          if (
            finalQuantity <=
            existingItem.quantity
          ) {
            return currentCart;
          }

          return currentCart.map((item) =>
            item.product.id === product.id
              ? {
                  ...item,
                  product,
                  quantity: finalQuantity,
                }
              : item
          );
        }

        // ----------------------------------------------
        // Producto nuevo
        // ----------------------------------------------

        const finalQuantity =
          Math.min(
            normalizedQuantity,
            product.stock,
            MAX_QUANTITY_PER_PRODUCT
          );

        if (finalQuantity <= 0) {
          return currentCart;
        }

        return [
          ...currentCart,
          {
            product,
            quantity: finalQuantity,
          },
        ];
      });

      return true;
    },
    []
  );

  // ========================================================
  // ACTUALIZAR CANTIDAD
  // ========================================================

  const updateQuantity = useCallback(
    (
      productId: string,
      quantity: number
    ): boolean => {
      if (!productId) {
        return false;
      }

      const normalizedQuantity =
        normalizeQuantity(quantity);

      // Una cantidad igual o menor a cero
      // elimina el producto.
      if (normalizedQuantity <= 0) {
        setCart((currentCart) =>
          currentCart.filter(
            (item) =>
              item.product.id !== productId
          )
        );

        return true;
      }

      let updated = false;

      setCart((currentCart) =>
        currentCart.map((item) => {
          if (
            item.product.id !== productId
          ) {
            return item;
          }

          if (!isProductAvailable(item.product)) {
            return item;
          }

          const finalQuantity =
            Math.min(
              normalizedQuantity,
              item.product.stock,
              MAX_QUANTITY_PER_PRODUCT
            );

          updated = finalQuantity > 0;

          return {
            ...item,
            quantity: finalQuantity,
          };
        })
      );

      return updated;
    },
    []
  );

  // ========================================================
  // INCREMENTAR
  // ========================================================

  const incrementQuantity = useCallback(
    (
      productId: string,
      amount: number = 1
    ): boolean => {
      const increment =
        normalizeQuantity(amount);

      if (increment <= 0) {
        return false;
      }

      let updated = false;

      setCart((currentCart) =>
        currentCart.map((item) => {
          if (
            item.product.id !== productId
          ) {
            return item;
          }

          const newQuantity = Math.min(
            item.quantity + increment,
            item.product.stock,
            MAX_QUANTITY_PER_PRODUCT
          );

          updated =
            newQuantity !== item.quantity;

          return {
            ...item,
            quantity: newQuantity,
          };
        })
      );

      return updated;
    },
    []
  );

  // ========================================================
  // DECREMENTAR
  // ========================================================

  const decrementQuantity = useCallback(
    (
      productId: string,
      amount: number = 1
    ): boolean => {
      const decrement =
        normalizeQuantity(amount);

      if (decrement <= 0) {
        return false;
      }

      let updated = false;

      setCart((currentCart) =>
        currentCart
          .map((item) => {
            if (
              item.product.id !== productId
            ) {
              return item;
            }

            const newQuantity =
              item.quantity - decrement;

            updated = true;

            return {
              ...item,
              quantity: newQuantity,
            };
          })
          .filter(
            (item) => item.quantity > 0
          )
      );

      return updated;
    },
    []
  );

  // ========================================================
  // ELIMINAR
  // ========================================================

  const removeFromCart = useCallback(
    (productId: string): void => {
      if (!productId) {
        return;
      }

      setCart((currentCart) =>
        currentCart.filter(
          (item) =>
            item.product.id !== productId
        )
      );
    },
    []
  );

  // ========================================================
  // VACIAR CARRITO
  // ========================================================

  const clearCart = useCallback((): void => {
    setCart([]);
  }, []);

  // ========================================================
  // COMPROBAR PRODUCTO
  // ========================================================

  const hasProduct = useCallback(
    (productId: string): boolean => {
      return cart.some(
        (item) =>
          item.product.id === productId
      );
    },
    [cart]
  );

  // ========================================================
  // OBTENER CANTIDAD
  // ========================================================

  const getProductQuantity = useCallback(
    (productId: string): number => {
      return (
        cart.find(
          (item) =>
            item.product.id === productId
        )?.quantity ?? 0
      );
    },
    [cart]
  );

  // ========================================================
  // CANTIDAD TOTAL DE UNIDADES
  // ========================================================

  const itemCount = useMemo(
    () =>
      cart.reduce(
        (total, item) =>
          total + item.quantity,
        0
      ),
    [cart]
  );

  // ========================================================
  // CANTIDAD DE LÍNEAS
  // ========================================================

  const lineCount = cart.length;

  // ========================================================
  // TOTAL DEL CARRITO
  // ========================================================

  const totalAmount = useMemo(
    () =>
      roundMoney(
        cart.reduce(
          (total, item) =>
            total +
            item.product.price *
              item.quantity,
          0
        )
      ),
    [cart]
  );

  // ========================================================
  // VALOR DEL CONTEXTO
  // ========================================================

  const contextValue = useMemo<CartContextType>(
    () => ({
      cart,
      itemCount,
      lineCount,
      totalAmount,

      addToCart,
      updateQuantity,
      incrementQuantity,
      decrementQuantity,
      removeFromCart,
      clearCart,
      hasProduct,
      getProductQuantity,
    }),
    [
      cart,
      itemCount,
      lineCount,
      totalAmount,
      addToCart,
      updateQuantity,
      incrementQuantity,
      decrementQuantity,
      removeFromCart,
      clearCart,
      hasProduct,
      getProductQuantity,
    ]
  );

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

// ==========================================================
// HOOK
// ==========================================================

export function useCart(): CartContextType {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      'useCart debe utilizarse dentro de un CartProvider.'
    );
  }

  return context;
}