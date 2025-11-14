import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Manejar las peticiones CORS preflight
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Rutas que NO requieren verificación de configuración inicial
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

  // Si es una ruta pública, dejar acceder sin verificar la configuración inicial
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Para rutas admin (excepto login), verificar si necesita configuración inicial
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    try {
      const setupCheckUrl = new URL('/api/setup/check', request.url);
      const setupResponse = await fetch(setupCheckUrl);
      const setupData = await setupResponse.json();

      // Si necesita configuración inicial, redirigir a /setup
      if (setupData.setupNeeded) {
        return NextResponse.redirect(new URL('/setup', request.url));
      }
    } catch (error) {
      console.error('Error checking setup in middleware:', error);
    }
  }

  // Agregar headers CORS a todas las respuestas
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Matchear todos los paths de peticiones excepto los que empiezan con:
     * - _next/static (archivos estáticos)
     * - _next/image (archivos de optimización de imágenes)
     * - favicon.ico (archivo favicon)
     * - carpeta public
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
