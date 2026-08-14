# ============================================================================

# CREDI MARKETPLACE — EDGE / CDN HEADERS

# Next.js 16.3 · React 19.2 · Node.js 24

# ============================================================================

#

# NOTA:

# Este archivo solo tendrá efecto si la plataforma/CDN de despliegue

# reconoce el formato "_headers".

#

# La configuración principal de seguridad debe mantenerse también en

# next.config.ts para garantizar su aplicación dentro de Next.js.

# ============================================================================

# ============================================================================

# NEXT.JS STATIC ASSETS

# ============================================================================

#

# Los archivos generados por Next.js contienen hashes/versionado.

# Por ello pueden almacenarse durante un año de manera inmutable.

#

/_next/static/*
Cache-Control: public, max-age=31536000, immutable

# ============================================================================

# STATIC FONTS

# ============================================================================

/*.woff2
Cache-Control: public, max-age=31536000, immutable

/*.woff
Cache-Control: public, max-age=31536000, immutable

/*.ttf
Cache-Control: public, max-age=31536000, immutable

# ============================================================================

# PUBLIC IMAGES

# ============================================================================

#

# Las imágenes públicas pueden cachearse, pero no se consideran

# necesariamente inmutables porque podrían reemplazarse.

#

/images/*
Cache-Control: public, max-age=86400, stale-while-revalidate=604800

# ============================================================================

# FAVICON

# ============================================================================

/favicon.ico
Cache-Control: public, max-age=86400, stale-while-revalidate=604800

# ============================================================================

# SECURITY HEADERS

# ============================================================================

/*
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), accelerometer=(), gyroscope=(), magnetometer=()
Cross-Origin-Opener-Policy: same-origin-allow-popups
Cross-Origin-Resource-Policy: same-origin
X-DNS-Prefetch-Control: on

# ============================================================================

# HSTS

# ============================================================================

#

# SOLO debe utilizarse cuando el dominio completo funciona correctamente

# mediante HTTPS.

#

# Si existen subdominios que todavía necesitan HTTP, elimina temporalmente

# "includeSubDomains".

#

Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

# ============================================================================

# API / DYNAMIC RESPONSES

# ============================================================================

#

# Las rutas API no deben quedar almacenadas por CDN de manera accidental.

#

/api/*
Cache-Control: private, no-store, max-age=0
X-Content-Type-Options: nosniff
