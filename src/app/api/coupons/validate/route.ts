import { NextRequest, NextResponse } from 'next/server';

// Cupons validos (em producao, isso viria de um banco de dados)
const VALID_COUPONS: Record<string, { discount: number; minValue?: number; maxDiscount?: number; validUntil?: string }> = {
  'BEMVINDO10': { discount: 10, minValue: 50 },
  'SABOR15': { discount: 15, minValue: 80, maxDiscount: 20 },
  'FRETE0': { discount: 100, maxDiscount: 8 }, // Frete gratis
};

export async function POST(request: NextRequest) {
  try {
    const { code, orderTotal } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'Codigo do cupom e obrigatorio' },
        { status: 400 }
      );
    }

    const normalizedCode = code.toUpperCase().trim();
    const coupon = VALID_COUPONS[normalizedCode];

    if (!coupon) {
      return NextResponse.json({ valid: false, error: 'Cupom invalido' });
    }

    // Verifica validade
    if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
      return NextResponse.json({ valid: false, error: 'Cupom expirado' });
    }

    // Verifica valor minimo
    if (coupon.minValue && orderTotal < coupon.minValue) {
      return NextResponse.json({
        valid: false,
        error: `Pedido minimo de R$ ${coupon.minValue.toFixed(2)} para este cupom`,
      });
    }

    // Calcula desconto
    let discountValue = (orderTotal * coupon.discount) / 100;
    if (coupon.maxDiscount) {
      discountValue = Math.min(discountValue, coupon.maxDiscount);
    }

    return NextResponse.json({
      valid: true,
      code: normalizedCode,
      discount: coupon.discount,
      discountValue,
      maxDiscount: coupon.maxDiscount,
    });
  } catch (error) {
    console.error('Erro ao validar cupom:', error);
    return NextResponse.json(
      { valid: false, error: 'Erro ao validar cupom' },
      { status: 500 }
    );
  }
}
