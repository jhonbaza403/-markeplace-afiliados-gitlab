import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 1. Compilador experimental de React 19 */
  experimental: {
    reactCompiler: true,
  },

  /* 2. Optimización de imágenes (ejemplo con dominios externos como Supabase o GitLab) */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Permite cargar imágenes desde cualquier host HTTPS
      },
    ],
  },

  /* 3. Modo estricto de React */
  reactStrictMode: true,
};

export default nextConfig;