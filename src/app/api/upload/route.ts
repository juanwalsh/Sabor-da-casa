import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import mime from 'mime-types'; // Note: might not be installed, better to use a simple map if not installed

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      );
    }

    // Validar tipo de arquivo
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo invalido. Use JPG, PNG, WebP ou GIF.' },
        { status: 400 }
      );
    }

    // Validar tamanho (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Maximo 5MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Gerar nome unico e seguro
    const timestamp = Date.now();
    
    // Mapeamento seguro de MIME para extensao
    const mimeMap: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
    };
    
    const extension = mimeMap[file.type] || 'jpg';
    const filename = `produto-${timestamp}.${extension}`;

    // Salvar arquivo na pasta public/uploads
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    // Garantir que diretorio existe
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Ignorar erro se ja existe
    }

    const filepath = join(uploadDir, filename);

    await writeFile(filepath, buffer);

    // Retornar URL relativa do arquivo
    const url = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url,
      filename
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer upload do arquivo' },
      { status: 500 }
    );
  }
}
