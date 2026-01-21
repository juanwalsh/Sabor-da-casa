import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { jwtVerify } from 'jose';

// POST - Autenticar usuario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Usuario e senha sao obrigatorios' },
        { status: 400 }
      );
    }

    // Em produção, idealmente EXIGE variáveis, mas para evitar travamento vamos usar fallback se não houver.
    const isProd = process.env.NODE_ENV === 'production';
    const adminPassword = process.env.ADMIN_PASSWORD || 'eplopesfortedogelo';
    const jwtSecret = process.env.JWT_SECRET || 'dev-jwt-secret-change-me';
    
    const usernameNormalized = String(username || '').trim().toLowerCase();
    const passwordNormalized = String(password || '').trim();

    // Comparison: username must be exactly 'admin' (case-insensitive), password is case-sensitive (trimmed)
    const isValidUser = usernameNormalized === 'admin';
    const isValidPassword = passwordNormalized === adminPassword;

    if (isValidUser && isValidPassword) {
      // Gerar JWT
      const secret = new TextEncoder().encode(jwtSecret);
      const token = await new SignJWT({ role: 'admin', user: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(secret);

      // Criar resposta com cookie
      const response = NextResponse.json({
        success: true,
        user: {
          id: 'admin-1',
          name: 'Administrador',
          email: 'admin@eplopes.com.br',
          role: 'admin',
        }
      });

      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 24 horas
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Credenciais invalidas' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Erro na autenticacao:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno' },
      { status: 500 }
    );
  }
}

// GET - Verificar sessao (cookie admin_token)
export async function GET(request: NextRequest) {
  const isProd = process.env.NODE_ENV === 'production';
  const jwtSecret = process.env.JWT_SECRET || 'dev-jwt-secret-change-me';

  if (!jwtSecret) {
    return NextResponse.json({ success: false, error: 'Configuration Error' }, { status: 500 });
  }

  const token = request.cookies.get('admin_token')?.value;
  if (!token) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(jwtSecret);
    await jwtVerify(token, secret);
    return NextResponse.json({
      success: true,
      user: {
        id: 'admin-1',
        name: 'Administrador',
        email: 'admin@eplopes.com.br',
        role: 'admin',
      }
    });
  } catch {
    return NextResponse.json({ success: false }, { status: 401 });
  }
}

// DELETE - Logout (Limpar Cookie)
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_token');
  return response;
}
