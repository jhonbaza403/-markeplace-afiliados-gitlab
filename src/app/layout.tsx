// ==========================================================
// ARCHIVO: src/app/layout.tsx
// CREDI MARKETPLACE
//
// Root Layout
// Next.js 16.3
// React 19
// Node.js 24
//
// Arquitectura:
// - Server Component
// - App Router
// - SEO global
// - Accesibilidad
// - Auth global
// - Región global
// - Tipografía optimizada
// ==========================================================

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import '@/app/globals.css';

import { AuthProvider } from '@/context/AuthContext';
import { RegionProvider } from '@/context/RegionContext';
import Navbar from '@/components/Navbar';

// ==========================================================
// 1. CONFIGURACIÓN DE FUENTE
// ==========================================================
//
// next/font permite:
// - Servir la fuente desde Next.js.
// - Evitar requests innecesarios del navegador.
// - Mejorar CLS.
// - Controlar el fallback.
// - Exponer la variable CSS --font-inter.
//
// ==========================================================

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: [
    'ui-sans-serif',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'sans-serif',
  ],
});

// ==========================================================
// 2. CONFIGURACIÓN DEL VIEWPORT
// ==========================================================
//
// IMPORTANTE:
//
// No se bloquea el zoom del usuario.
//
// Esto preserva:
// - Accesibilidad.
// - Usabilidad móvil.
// - WCAG.
//
// ==========================================================

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,

  colorScheme: 'light dark',

  themeColor: [
    {
      media: '(prefers-color-scheme: light)',
      color: '#2563eb',
    },
    {
      media: '(prefers-color-scheme: dark)',
      color: '#0f172a',
    },
  ],
};

// ==========================================================
// 3. METADATA GLOBAL
// ==========================================================
//
// Esta metadata se hereda automáticamente por todas las
// páginas del App Router.
//
// Las páginas específicas pueden sobrescribir:
// - title
// - description
// - canonical
// - Open Graph
// - Twitter
// - robots
//
// ==========================================================

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),

  applicationName: 'Credi Marketplace',

  title: {
    default:
      'Credi Marketplace | Plataforma Comercial Global',
    template: '%s | Credi Marketplace',
  },

  description:
    'Credi Marketplace es un ecosistema digital para comprar, vender y conectar compradores, vendedores, profesionales, empresas y proveedores mediante operaciones B2C y B2B.',

  keywords: [
    'Credi Marketplace',
    'marketplace',
    'marketplace global',
    'marketplace B2B',
    'marketplace B2C',
    'comercio electrónico',
    'ecommerce',
    'compras online',
    'ventas online',
    'proveedores',
    'productos',
    'servicios',
    'empresas',
    'comercio mayorista',
    'comercio minorista',
  ],

  authors: [
    {
      name: 'Credi Marketplace',
    },
  ],

  creator: 'Credi Marketplace',

  publisher: 'Credi Marketplace',

  category: 'ecommerce',

  referrer: 'strict-origin-when-cross-origin',

  alternates: {
    canonical: '/',
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  openGraph: {
    type: 'website',

    locale: 'es_VE',

    siteName: 'Credi Marketplace',

    title:
      'Credi Marketplace | Plataforma Comercial Global',

    description:
      'Compra, vende y conecta con proveedores, empresas, profesionales y clientes dentro de un ecosistema comercial digital B2B y B2C.',

    url: '/',

    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Credi Marketplace',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',

    title:
      'Credi Marketplace | Plataforma Comercial Global',

    description:
      'El ecosistema digital para comprar, vender y hacer crecer tu negocio.',

    images: ['/og-image.jpg'],
  },

  icons: {
    icon: [
      {
        url: '/favicon.ico',
      },
    ],

    apple: [
      {
        url: '/apple-touch-icon.png',
      },
    ],
  },

  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

// ==========================================================
// 4. ROOT LAYOUT
// ==========================================================
//
// Este componente permanece como Server Component.
//
// Los providers pueden ser Client Components internamente
// sin necesidad de convertir este archivo en:
//
// 'use client'
//
// Esto permite conservar las ventajas del App Router.
//
// ==========================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      dir="ltr"
      className={`${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <AuthProvider>
          <RegionProvider>
            <div className="flex min-h-screen flex-col">

              {/* ==================================================
                  NAVEGACIÓN GLOBAL
                 ================================================== */}

              <Navbar />

              {/* ==================================================
                  CONTENIDO PRINCIPAL
                 ================================================== */}

              <main
                id="main-content"
                className="flex min-h-0 flex-1 flex-col"
              >
                {children}
              </main>

            </div>
          </RegionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}