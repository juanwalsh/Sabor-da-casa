import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

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

    const adminPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!adminPassword || !jwtSecret) {
      console.error('CRITICAL: ADMIN_PASSWORD or JWT_SECRET not configured in .env');
      return NextResponse.json({ success: false, error: 'Configuration Error' }, { status: 500 });
    }

    // Comparacao segura (sem case insensitive para senha em prod, mas mantendo para usuario 'admin')
    const isValidUser = username.toLowerCase() === 'admin';
    const isValidPassword = password === adminPassword; // Case sensitive password

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
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 horas
        path: '/',
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

// DELETE - Logout (Limpar Cookie)
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_token');
  return response;
}
