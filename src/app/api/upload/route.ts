import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Validacao de magic bytes para tipos de imagem permitidos
const MAGIC_BYTES: Record<string, { bytes: number[]; mask?: number[] }[]> = {
  'image/jpeg': [{ bytes: [0xFF, 0xD8, 0xFF] }],
  'image/png': [{ bytes: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] }],
  'image/gif': [{ bytes: [0x47, 0x49, 0x46, 0x38] }], // GIF87a ou GIF89a
  'image/webp': [{ bytes: [0x52, 0x49, 0x46, 0x46] }], // RIFF header (WebP starts with RIFF)
};

function detectMimeType(buffer: Buffer): string | null {
  for (const [mime, signatures] of Object.entries(MAGIC_BYTES)) {
    for (const sig of signatures) {
      if (buffer.length < sig.bytes.length) continue;

      let match = true;
      for (let i = 0; i < sig.bytes.length; i++) {
        const byte = sig.mask ? buffer[i] & sig.mask[i] : buffer[i];
        if (byte !== sig.bytes[i]) {
          match = false;
          break;
        }
      }

      // Verificacao adicional para WebP (precisa ter "WEBP" na posicao 8)
      if (match && mime === 'image/webp') {
        if (buffer.length < 12 || buffer.toString('ascii', 8, 12) !== 'WEBP') {
          match = false;
        }
      }

      if (match) return mime;
    }
  }
  return null;
}

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

    // Validar tamanho (max 5MB) - antes de ler o buffer
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Maximo 5MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validacao REAL por magic bytes (nao confia no header do cliente)
    const detectedMime = detectMimeType(buffer);
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (!detectedMime || !allowedMimes.includes(detectedMime)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo invalido. Use JPG, PNG, WebP ou GIF.' },
        { status: 400 }
      );
    }

    // Gerar nome unico e seguro
    const timestamp = Date.now();

    // Mapeamento seguro de MIME para extensao (usa tipo detectado, nao o header)
    const mimeMap: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
    };

    const extension = mimeMap[detectedMime] || 'jpg';
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
