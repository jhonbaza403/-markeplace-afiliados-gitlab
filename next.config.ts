import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), accelerometer=(), gyroscope=(), magnetometer=()",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-origin",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "X-Permitted-Cross-Domain-Policies",
    value: "none",
  },
  {
    key: "X-Download-Options",
    value: "noopen",
  },
];

const contentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https:;
  font-src 'self' data:;
  connect-src 'self' https:;
  frame-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, " ")
  .trim();

const nextConfig: NextConfig = {
  reactStrictMode: true,

  poweredByHeader: false,

  compress: true,

  productionBrowserSourceMaps: false,

  experimental: {
    optimizePackageImports: [
      "@supabase/supabase-js",
      "@supabase/ssr",
    ],
  },

  images: {
    formats: ["image/avif", "image/webp"],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],

    deviceSizes: [
      320,
      420,
      640,
      750,
      828,
      1080,
      1200,
      1440,
      1920,
    ],

    imageSizes: [
      16,
      32,
      48,
      64,
      96,
      128,
      256,
      384,
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          ...securityHeaders,
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
        ],
      },

      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-store, max-age=0",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },

      {
        source: "/api/payments/webhook/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },

      {
        source: "/admin/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-store",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [];
  },

  async rewrites() {
    return [];
  },
};

export default nextConfig;
