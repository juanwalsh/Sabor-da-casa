import { NextRequest, NextResponse } from 'next/server';

// Credenciais do admin - mantidas apenas no backend
// Usuario: admin | Senha: eplopesfortedogelo (case insensitive)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'eplopesfortedogelo',
};

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

    // Comparacao case insensitive
    const isValidUser = username.toLowerCase() === ADMIN_CREDENTIALS.username.toLowerCase();
    const isValidPassword = password.toLowerCase() === ADMIN_CREDENTIALS.password.toLowerCase();

    if (isValidUser && isValidPassword) {
      return NextResponse.json({
        success: true,
        user: {
          id: 'admin-1',
          name: 'Administrador',
          email: 'admin@eplopes.com.br',
          role: 'admin',
        }
      });
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
