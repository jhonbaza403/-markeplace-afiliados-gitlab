import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // Aquí puedes implementar la lógica de validación de sesión con Supabase o tu token de autenticación
  const res = NextResponse.next()
  
  // Ejemplo básico de protección de ruta para el panel de administración o dashboard
  const path = req.nextUrl.pathname

  if (path.startsWith('/dashboard')) {
    // Validación de sesión o redirección a login si no está autenticado
    // const token = req.cookies.get('sb-access-token')
    // if (!token) {
    //   return NextResponse.redirect(new URL('/auth/login', req.url))
    // }
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/checkout/:path*'],
}