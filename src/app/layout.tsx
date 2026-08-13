import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { RegionProvider } from '@/context/RegionContext';
import Navbar from '@/components/Navbar';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

// Configuración moderna de Viewport en App Router
export const viewport: Viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
};

// Metadata API de Server Components
export const metadata: Metadata = {
  title: {
    default: 'Marketplace Afiliados',
    template: '%s | Marketplace Afiliados',
  },
  description: 'Plataforma de afiliados y marketplace',
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
    <html lang="es" className={inter.className}>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <AuthProvider>
          <RegionProvider>
            <Navbar />
            <main id="main-content" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </main>
          </RegionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}