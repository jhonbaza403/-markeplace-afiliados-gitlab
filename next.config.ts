import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Inicializa el entorno local de desarrollo para Cloudflare Workers
initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,

  // Optimización de imágenes para Cloudflare Edge / Remote Patterns
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Habilita Server Actions y características experimentales si son requeridas por React 19
  experimental: {
    // Optimización adicional para empaquetado Edge
    serverMinification: true,
  },
};

export default nextConfig;