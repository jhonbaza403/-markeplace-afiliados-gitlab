import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* 🚀 React Compiler (React 19) */
  experimental: {
    reactCompiler: true,
  },

  /* ⚡ Optimización de Imágenes en Vercel */
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  /* 🛡️ Modos de seguridad y Headers para Cloudflare */
  reactStrictMode: true,
  poweredByHeader: false, // Oculta 'X-Powered-By: Next.js' por seguridad

  /* 🌐 Confianza en las cabeceras del proxy de Cloudflare */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

export default nextConfig;