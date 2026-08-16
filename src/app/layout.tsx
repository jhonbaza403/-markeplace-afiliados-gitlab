// ==========================================================
// ARCHIVO: src/app/layout.tsx
// Credi Marketplace
//
// Root Layout Global
//
// Next.js App Router
// TypeScript
// ==========================================================

import type { Metadata } from "next";

import "./globals.css";

import {
  AuthProvider,
} from "@/context/AuthContext";

import {
  CartProvider,
} from "@/context/CartContext";

import {
  LanguageProvider,
} from "@/context/LanguageContext";

import {
  RegionProvider,
} from "@/context/RegionContext";


// ==========================================================
// METADATA
// ==========================================================

export const metadata: Metadata = {

  title:
    "Credi Marketplace",

  description:
    "Marketplace B2B, afiliados, productos, servicios y comercio digital.",

  keywords: [
    "Marketplace",
    "B2B",
    "Afiliados",
    "Comercio electrónico",
    "Ventas digitales",
  ],

  applicationName:
    "Credi Marketplace",

};



// ==========================================================
// ROOT LAYOUT
// ==========================================================

export default function RootLayout({

  children,

}: Readonly<{

  children: React.ReactNode;

}>) {


  return (

    <html
      lang="es"
    >

      <body>

        <LanguageProvider>

          <RegionProvider>

            <AuthProvider>

              <CartProvider>

                {children}

              </CartProvider>

            </AuthProvider>

          </RegionProvider>

        </LanguageProvider>

      </body>

    </html>

  );

}
