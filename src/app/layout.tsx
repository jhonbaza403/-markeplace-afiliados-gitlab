import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { RegionProvider } from "@/context/RegionContext";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Marketplace Afiliados | Credi Marketplace",
    template: "%s | Credi Marketplace",
  },
  description: "Plataforma multi-vendedor y sistema de afiliados global.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://markeplace-afiliados-gitlab.pages.dev"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen flex flex-col bg-background text-foreground`}>
        <AuthProvider>
          <RegionProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
          </RegionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}