import type { NextConfig } from 'next'

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value:
      'accelerometer=(), autoplay=(), camera=(), display-capture=(), encrypted-media=(), fullscreen=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), usb=(), xr-spatial-tracking=()',
  },
]

const nextConfig: NextConfig = {
  /**
   * =======================================================
   * REACT 19 / REACT COMPILER
   * =======================================================
   *
   * Stable in Next.js 16.
   *
   * Automatically optimizes React components and reduces
   * the need for manual useMemo/useCallback optimization.
   */
  reactCompiler: true,

  /**
   * =======================================================
   * REACT
   * =======================================================
   */
  reactStrictMode: true,

  /**
   * =======================================================
   * SECURITY
   * =======================================================
   */
  poweredByHeader: false,

  /**
   * =======================================================
   * IMAGES
   * =======================================================
   */
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    dangerouslyAllowSVG: false,
  },

  /**
   * =======================================================
   * TYPESCRIPT
   * =======================================================
   *
   * Never bypass TypeScript errors during production builds.
   */
  typescript: {
    ignoreBuildErrors: false,
  },

  /**
   * =======================================================
   * ESLINT
   * =======================================================
   *
   * Linting is handled by the project's ESLint setup/CI.
   * Next.js 16 no longer relies on `next lint`.
   */

  /**
   * =======================================================
   * PERFORMANCE / BUNDLE OPTIMIZATION
   * =======================================================
   */
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      'zod',
    ],
  },

  /**
   * =======================================================
   * TYPED ROUTES
   * =======================================================
   *
   * Gives compile-time checking for internal Next.js links.
   */
  typedRoutes: true,

  /**
   * =======================================================
   * SECURITY HEADERS
   * =======================================================
   */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig