// ==========================================================
// ARCHIVO: src/app/layout.tsx
// Root Layout - Envoltura principal de la aplicación
// ==========================================================

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { RegionProvider } from '@/context/RegionContext';
import Navbar from '@/components/Navbar';

// Optimización de la fuente: usando variables CSS
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Configuración moderna de Viewport en App Router
export const viewport: Viewport = {
  themeColor: '#2563eb', // blue-600 (Match con la marca)
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Previene el zoom automático en inputs en iOS
};

// Metadata API de Server Components para SEO Avanzado
export const metadata: Metadata = {
  title: {
    default: 'Credi Marketplace | Plataforma Comercial Global',
    template: '%s | Credi Marketplace',
  },
  description: 'Compra, vende y ofrece servicios en Credi Marketplace. Conectamos empresas y profesionales con oportunidades reales en un entorno seguro.',
  keywords: ['marketplace', 'b2b', 'b2c', 'compras', 'ventas', 'servicios', 'cripto', 'afiliados'],
  authors: [{ name: 'Credi Marketplace' }],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'Credi Marketplace',
    title: 'Credi Marketplace | Plataforma Comercial Global',
    description: 'Conectamos empresas y profesionales con oportunidades reales en un entorno seguro y de alta conversión.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Credi Marketplace',
    description: 'El ecosistema digital para crecer sin límites.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      {/* 
        Colores base ajustados al nuevo diseño premium. 
        flex y flex-col permiten que el footer se mantenga al fondo si el contenido es corto.
      */}
      <body className="flex min-h-screen flex-col bg-white text-slate-900 selection:bg-blue-500/30">
        <AuthProvider>
          <RegionProvider>
            <Navbar />
            
            {/* 
              NOTA: Se eliminó el 'max-w-7xl' para no limitar el ancho de las páginas.
              Cada página (page.tsx) es responsable de definir sus propios contenedores.
            */}
            <main id="main-content" className="flex flex-1 flex-col">
              {children}
            </main>
            
          </RegionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}