import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Rutas que NO requieren verificación de setup
  const publicPaths = [
    '/setup',
    '/api/setup/check',
    '/api/setup/initialize',
    '/admin/login',
    '/admin/forgot-password',
    '/',
    '/menu',
    '/api/locales/slug',
    '/api/productos',
    '/api/pedidos',
    '/api/solicitudes',
    '/api/categorias'
  ];

  // Si es una ruta pública, permitir acceso sin verificar setup
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Para rutas admin (excepto login), verificar si necesita setup
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    try {
      const setupCheckUrl = new URL('/api/setup/check', request.url);
      const setupResponse = await fetch(setupCheckUrl);
      const setupData = await setupResponse.json();

      // Si necesita setup, redirigir a /setup
      if (setupData.setupNeeded) {
        return NextResponse.redirect(new URL('/setup', request.url));
      }
    } catch (error) {
      console.error('Error checking setup in middleware:', error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
