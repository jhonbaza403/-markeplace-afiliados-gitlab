import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { RegionProvider } from '@/context/RegionContext';

export const metadata = {
  title: 'Credi Marketplace',
  description: 'Plataforma global de servicios y comercio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <LanguageProvider>
            <RegionProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </RegionProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}