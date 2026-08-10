import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

const SITE_NAME = "Credi Marketplace";
const SITE_DESCRIPTION =
  "Marketplace global para comprar, vender, descubrir productos y contratar servicios de forma segura, inteligente y personalizada.";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: `${SITE_NAME} | Marketplace Global`,
    template: `%s | ${SITE_NAME}`,
  },

  description: SITE_DESCRIPTION,

  applicationName: SITE_NAME,

  keywords: [
    "marketplace",
    "comprar",
    "vender",
    "productos",
    "servicios",
    "tienda online",
    "comercio electrónico",
    "ecommerce",
    "marketplace global",
    "compras online",
    "ventas online",
    "Credi Marketplace",
  ],

  authors: [
    {
      name: "Credi Marketplace",
    },
  ],

  creator: "Credi Marketplace",
  publisher: "Credi Marketplace",

  category: "ecommerce",

  referrer: "origin-when-cross-origin",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: SITE_URL,
    languages: {
      "es": SITE_URL,
      "en": `${SITE_URL}/en`,
      "pt": `${SITE_URL}/pt`,
    },
  },

  openGraph: {
    type: "website",
    locale: "es_ES",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Marketplace Global`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Marketplace Global`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Marketplace Global`,
    description: SITE_DESCRIPTION,
    images: ["/logo.png"],
  },

  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },

  manifest: "/manifest.webmanifest",

  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#ffffff",
  colorScheme: "light",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/buscar?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>

      <body>
        <AuthProvider>
          <a className="skip-link" href="#contenido-principal">
            Saltar al contenido principal
          </a>

          <div id="app-shell" className="app-shell flex flex-col min-h-screen">
            {/* Barra de navegación global con autenticación y selector de región */}
            <Navbar />

            <main id="contenido-principal" className="app-main flex-1">
              {children}
            </main>
          </div>

          <div id="modal-root" />

          <div id="toast-root" aria-live="polite" aria-atomic="true" />
        </AuthProvider>
      </body>
    </html>
  );
}