import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { checkRateLimit } from '@/lib/ratelimit';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

  // 0. Rate Limiting para APIs
  if (pathname.startsWith('/api/')) {
    const { success, limit, remaining, reset } = await checkRateLimit(ip);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Too Many Requests' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          }
        }
      );
    }
  }

  // 1. Proteger rotas de API administrativas
  if (pathname.startsWith('/api/')) {
    // Permitir GET em produtos (publico)
    if (pathname === '/api/products' && request.method === 'GET') {
      return NextResponse.next();
    }
    
    // Permitir POST em pedidos (criar pedido - publico)
    if (pathname === '/api/orders' && request.method === 'POST') {
      return NextResponse.next();
    }

    // Permitir rotas de auth e upload (upload deve ter validacao interna ou ser protegido, vamos proteger por seguranca se for admin upload)
    // Upload de produto eh admin only.
    if (pathname === '/api/auth') {
      return NextResponse.next();
    }

    // Rotas protegidas: /api/products (POST, PUT, DELETE), /api/orders (GET, PUT), /api/upload
    // Verificar Token
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.error('CRITICAL: JWT_SECRET not configured');
        return NextResponse.json({ error: 'Configuration Error' }, { status: 500 });
      }
      const secret = new TextEncoder().encode(jwtSecret);
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
    }
  }

  // 2. Proteger paginas /admin
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        // Se nao tem secret, nao da pra validar, entao falha fechado (redirect login)
        console.error('CRITICAL: JWT_SECRET not configured');
        return NextResponse.redirect(new URL('/login', request.url));
      }
      const secret = new TextEncoder().encode(jwtSecret);
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/admin/:path*',
  ],
};
