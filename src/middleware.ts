```tsx
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const PUBLIC_ROUTES = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/update-password',
  '/auth/verify-email',
  '/auth/error',
  '/marketplace',
  '/b2b',
]

const AUTH_ONLY_ROUTES = [
  '/dashboard',
  '/checkout',
  '/cart',
  '/orders',
  '/account',
  '/profile',
]

const AUTH_ROUTE_PREFIXES = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/update-password',
]

function pathnameStartsWith(
  pathname: string,
  routes: string[],
): boolean {
  return routes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`),
  )
}

function isPublicRoute(
  pathname: string,
): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) {
    return true
  }

  /*
   * Los detalles públicos de marketplace/B2B pueden
   * ser consultados sin autenticación.
   */
  if (
    pathname.startsWith('/marketplace/') ||
    pathname.startsWith('/b2b/')
  ) {
    return true
  }

  /*
   * Las rutas de API tienen sus propios controles.
   * No las redirigimos como páginas HTML.
   */
  if (pathname.startsWith('/api/')) {
    return true
  }

  return false
}

function isAuthOnlyRoute(
  pathname: string,
): boolean {
  return pathnameStartsWith(
    pathname,
    AUTH_ONLY_ROUTES,
  )
}

function isAuthRoute(
  pathname: string,
): boolean {
  return pathnameStartsWith(
    pathname,
    AUTH_ROUTE_PREFIXES,
  )
}

function redirectToLogin(
  request: NextRequest,
): NextResponse {
  const loginUrl = new URL(
    '/auth/login',
    request.url,
  )

  /*
   * Guardamos únicamente una ruta interna.
   *
   * No aceptamos una URL externa enviada por el
   * usuario para evitar open redirects.
   */
  const pathname =
    request.nextUrl.pathname

  const search =
    request.nextUrl.search

  if (
    pathname.startsWith('/') &&
    !pathname.startsWith('//')
  ) {
    const nextPath = `${pathname}${search}`

    loginUrl.searchParams.set(
      'next',
      nextPath,
    )
  }

  return NextResponse.redirect(
    loginUrl,
  )
}

function redirectToDashboard(
  request: NextRequest,
): NextResponse {
  return NextResponse.redirect(
    new URL(
      '/dashboard',
      request.url,
    ),
  )
}

export async function middleware(
  request: NextRequest,
) {
  let response =
    NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

  const supabase =
    createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },

          setAll(
            cookiesToSet,
          ) {
            cookiesToSet.forEach(
              ({
                name,
                value,
                options,
              }) => {
                request.cookies.set(
                  name,
                  value,
                )

                response.cookies.set(
                  name,
                  value,
                  options,
                )
              },
            )
          },
        },
      },
    )

  /*
   * IMPORTANTE:
   *
   * getUser() permite que Supabase valide/refresque
   * la sesión mediante el mecanismo SSR.
   *
   * No utilizamos getSession() para autorización.
   */
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  const pathname =
    request.nextUrl.pathname

  /*
   * Si Supabase devuelve un error de autenticación,
   * tratamos al usuario como no autenticado.
   */
  const isAuthenticated =
    !error && Boolean(user)

  /*
   * ----------------------------------------------------------
   * API
   * ----------------------------------------------------------
   *
   * Las API routes deben devolver JSON/HTTP status propio.
   * No debemos convertir un 401 API en una redirección HTML.
   */
  if (pathname.startsWith('/api/')) {
    return response
  }

  /*
   * ----------------------------------------------------------
   * Rutas públicas
   * ----------------------------------------------------------
   */
  if (isPublicRoute(pathname)) {
    /*
     * Si el usuario ya está autenticado e intenta acceder
     * a login/register, lo enviamos al dashboard.
     */
    if (
      isAuthenticated &&
      isAuthRoute(pathname)
    ) {
      return redirectToDashboard(
        request,
      )
    }

    return response
  }

  /*
   * ----------------------------------------------------------
   * Rutas protegidas
   * ----------------------------------------------------------
   */
  if (isAuthOnlyRoute(pathname)) {
    if (!isAuthenticated) {
      return redirectToLogin(
        request,
      )
    }

    return response
  }

  /*
   * ----------------------------------------------------------
   * Protección por defecto
   * ----------------------------------------------------------
   *
   * Las nuevas páginas no quedan accidentalmente expuestas
   * solamente porque alguien olvidó agregarlas a una lista.
   *
   * Esta política puede ajustarse posteriormente cuando
   * terminemos de clasificar todas las áreas públicas.
   */
  if (!isAuthenticated) {
    /*
     * Archivos y rutas internas que no deben ser tratados
     * como páginas protegidas.
     */
    if (
      pathname.startsWith('/_next/') ||
      pathname === '/favicon.ico' ||
      pathname.includes('.')
    ) {
      return response
    }

    return redirectToLogin(
      request,
    )
  }

  return response
}

/*
 * Matcher de alto rendimiento.
 *
 * Excluimos:
 * - _next/static
 * - _next/image
 * - favicon
 * - archivos estáticos comunes
 *
 * Las API permanecen dentro del matcher para que podamos
 * preservar explícitamente su flujo sin redirecciones.
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml|woff|woff2|ttf)$).*)',
  ],
}
```
