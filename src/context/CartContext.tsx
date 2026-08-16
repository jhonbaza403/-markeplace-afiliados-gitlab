"use client";

// ==========================================================
// ARCHIVO: src/context/CartContext.tsx
// Credi Marketplace
//
// Contexto global del carrito
//
// Next.js App Router
// TypeScript
// ==========================================================

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";


// ==========================================================
// TIPOS
// ==========================================================

export interface CartProduct {

  id: string;

  name: string;

  slug?: string;

  image?: string;

  price: number;

  currency?: string;

  sellerId?: string;

  quantity: number;

}


export interface CartContextValue {

  items: CartProduct[];

  totalItems: number;

  subtotal: number;


  addItem(
    product: Omit<CartProduct, "quantity">,
    quantity?: number,
  ): void;


  removeItem(
    productId: string,
  ): void;


  updateQuantity(
    productId: string,
    quantity: number,
  ): void;


  clearCart(): void;


  hasItem(
    productId: string,
  ): boolean;

}


// ==========================================================
// CONSTANTES
// ==========================================================

const CART_STORAGE_KEY =
  "credi-marketplace-cart";


// ==========================================================
// CONTEXT
// ==========================================================

const CartContext =
  createContext<
    CartContextValue | undefined
  >(undefined);


// ==========================================================
// PROVIDER
// ==========================================================

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {


  const [
    items,
    setItems,
  ] =
    useState<CartProduct[]>([]);



  // --------------------------------------------------------
  // Cargar carrito
  // --------------------------------------------------------

  useEffect(() => {

    try {

      const stored =
        localStorage.getItem(
          CART_STORAGE_KEY,
        );


      if (stored) {

        setItems(
          JSON.parse(stored),
        );

      }

    } catch {

      setItems([]);

    }

  }, []);




  // --------------------------------------------------------
  // Guardar carrito
  // --------------------------------------------------------

  useEffect(() => {

    try {

      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(items),
      );

    } catch {

      // Evita romper la aplicación
      // si localStorage está bloqueado

    }

  }, [items]);





  // --------------------------------------------------------
  // Agregar producto
  // --------------------------------------------------------

  function addItem(
    product:
      Omit<CartProduct, "quantity">,
    quantity = 1,
  ) {


    setItems(
      current => {


        const exists =
          current.find(
            item =>
              item.id === product.id,
          );



        if (exists) {

          return current.map(
            item =>
              item.id === product.id

                ? {
                    ...item,

                    quantity:
                      item.quantity +
                      quantity,
                  }

                : item,
          );

        }



        return [

          ...current,

          {
            ...product,

            quantity,

          },

        ];

      },
    );

  }





  // --------------------------------------------------------
  // Eliminar
  // --------------------------------------------------------

  function removeItem(
    productId: string,
  ) {

    setItems(
      current =>
        current.filter(
          item =>
            item.id !== productId,
        ),
    );

  }





  // --------------------------------------------------------
  // Actualizar cantidad
  // --------------------------------------------------------

  function updateQuantity(
    productId: string,
    quantity: number,
  ) {


    if (quantity <= 0) {

      removeItem(productId);

      return;

    }



    setItems(
      current =>
        current.map(
          item =>

            item.id === productId

              ? {
                  ...item,
                  quantity,
                }

              : item,
        ),
    );

  }





  // --------------------------------------------------------
  // Vaciar carrito
  // --------------------------------------------------------

  function clearCart() {

    setItems([]);

  }





  // --------------------------------------------------------
  // Existe producto
  // --------------------------------------------------------

  function hasItem(
    productId: string,
  ) {

    return items.some(
      item =>
        item.id === productId,
    );

  }





  // --------------------------------------------------------
  // Totales
  // --------------------------------------------------------

  const totalItems =
    useMemo(
      () =>
        items.reduce(
          (
            total,
            item,
          ) =>
            total +
            item.quantity,

          0,
        ),

      [items],
    );



  const subtotal =
    useMemo(
      () =>
        items.reduce(
          (
            total,
            item,
          ) =>
            total +
            (
              item.price *
              item.quantity
            ),

          0,
        ),

      [items],
    );





  const value =
    useMemo<CartContextValue>(
      () => ({

        items,

        totalItems,

        subtotal,


        addItem,

        removeItem,

        updateQuantity,

        clearCart,

        hasItem,

      }),

      [
        items,
        totalItems,
        subtotal,
      ],
    );





  return (

    <CartContext.Provider
      value={value}
    >

      {children}

    </CartContext.Provider>

  );

}


// ==========================================================
// HOOK
// ==========================================================

export function useCart() {

  const context =
    useContext(
      CartContext,
    );


  if (!context) {

    throw new Error(
      "useCart debe utilizarse dentro de CartProvider",
    );

  }


  return context;

}
