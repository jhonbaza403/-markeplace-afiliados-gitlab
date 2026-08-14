// ==========================================================
// ARCHIVO: src/app/layout.tsx
// CREDI MARKETPLACE
// Root Layout — Next.js 16.3 / React 19 / Node.js 24
// ==========================================================

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import '@/app/globals.css';

import { AuthProvider } from '@/context/AuthContext';
import { RegionProvider } from '@/context/RegionContext';
import Navbar from '@/components/Navbar';

// ==========================================================
// 1. TIPOGRAFÍA
// ==========================================================
//
// next/font descarga y sirve la fuente durante el build,
// evitando solicitudes externas del navegador.
//
// La variable --font-inter puede ser utilizada desde Tailwind
// y desde CSS.
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
// 2. VIEWPORT
// ==========================================================
//
// IMPORTANTE:
// No usamos maximumScale=1.
//
// Bloquear el zoom perjudica la accesibilidad, especialmente
// en dispositivos móviles.
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
// Esta metadata se hereda por todas las rutas del App Router.
// Las páginas individuales pueden sobrescribir title,
// description, Open Graph, etc.
//
// ==========================================================

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  ),

  applicationName: 'Credi Marketplace',

  title: {
    default: 'Credi Marketplace | Plataforma Comercial Global',
    template: '%s | Credi Marketplace',
  },

  description:
    'Credi Marketplace es un ecosistema digital para comprar, vender y conectar empresas, proveedores, profesionales y clientes en mercados B2C y B2B.',

  keywords: [
    'Credi Marketplace',
    'marketplace',
    'marketplace B2B',
    'marketplace B2C',
    'comercio electrónico',
    'compras',
    'ventas',
    'proveedores',
    'productos',
    'servicios',
    'afiliados',
  ],

  authors: [
    {
      name: 'Credi Marketplace',
    },
  ],

  creator: 'Credi Marketplace',
  publisher: 'Credi Marketplace',

  category: 'ecommerce',

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
    title: 'Credi Marketplace | Plataforma Comercial Global',
    description:
      'Compra, vende y conecta con proveedores, empresas, profesionales y clientes en un ecosistema comercial digital.',
    url: '/',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Credi Marketplace | Plataforma Comercial Global',
    description:
      'El ecosistema digital para comprar, vender y hacer crecer tu negocio.',
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
              {/* ==========================================
                  NAVEGACIÓN PRINCIPAL
                 ========================================== */}

              <Navbar />

              {/* ==========================================
                  CONTENIDO PRINCIPAL
                 ========================================== */}

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