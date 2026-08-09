import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Simulamos la lectura del token de sesión (Supabase por defecto usa cookies específicas)
  // En producción, aquí verificarías la cookie real de autenticación.
  const authCookie = request.cookies.get('sb-access-token') || request.cookies.get('supabase-auth-token');
  
  const { pathname } = request.nextUrl;

  // Proteger rutas de Dashboard y Admin
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

  if (isProtectedRoute && !authCookie) {
    // Si intenta acceder a una ruta protegida sin sesión, redirigir al login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirigir si el usuario ya está logueado e intenta ir a login/register
  const isAuthRoute = pathname === '/login' || pathname === '/register';
  
  if (isAuthRoute && authCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Rutas en las que se ejecutará este middleware
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/register'],
};