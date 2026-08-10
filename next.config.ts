import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Excluye Prisma del empaquetado interno de Webpack para Cloudflare Workers
  serverExternalPackages: ["@prisma/client", "prisma"],

  reactStrictMode: true,

  poweredByHeader: false,

  compress: true,

  generateEtags: true,

  productionBrowserSourceMaps: false,

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@fortawesome/fontawesome-free",
    ],
  },

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
  },

  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
      },
    ];
  },
};

export default nextConfig;

export default config;