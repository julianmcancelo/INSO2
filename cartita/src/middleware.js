import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get('origin');
  
  // SEGURIDAD: Forzar HTTPS en producción
  if (process.env.NODE_ENV === 'production') {
    const protocol = request.headers.get('x-forwarded-proto');
    if (protocol === 'http') {
      const url = request.nextUrl.clone();
      url.protocol = 'https:';
      return NextResponse.redirect(url, 301);
    }
  }

  // Lista de orígenes permitidos
  const allowedOrigins = [
    'https://cartita.digital',
    'https://www.cartita.digital',
    'http://localhost:3000',
    'http://localhost:3001'
  ];

  const isAllowedOrigin = allowedOrigins.includes(origin);
  const corsOrigin = isAllowedOrigin ? origin : allowedOrigins[0];

  // Manejar las peticiones CORS preflight
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'true',
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
      // Silenciar error en producción
    }
  }

  // Agregar headers de seguridad a todas las respuestas
  const response = NextResponse.next();
  
  // CORS con orígenes específicos
  response.headers.set('Access-Control-Allow-Origin', corsOrigin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  
  // Headers de seguridad adicionales
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // HSTS - Forzar HTTPS por 1 año (solo en producción)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://cartita.digital https://nominatim.openstreetmap.org;"
  );
  
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
