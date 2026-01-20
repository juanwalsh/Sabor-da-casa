import { NextResponse } from 'next/server';
import { getProductMapping, updateSmartPOSStock } from '@/lib/smartpos';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body; // Items do carrinho

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ success: false, error: 'Invalid items data' }, { status: 400 });
    }

    const results = [];

    for (const item of items) {
      // O item do carrinho tem a estrutura: { product: { id: string, name: string, ... }, quantity: number }
      const siteProductId = item.product.id;
      const quantity = item.quantity;
      const productName = item.product.name;

      // 1. Buscar mapeamento
      const mapping = await getProductMapping(siteProductId);

      if (mapping) {
        // 2. Atualizar estoque no SmartPOS
        const success = await updateSmartPOSStock({
          productId: mapping.smartposProductId,
          quantity: quantity,
          stockOperation: 'REMOVE'
        });

        results.push({
          siteProductId,
          smartposProductId: mapping.smartposProductId,
          productName,
          status: success ? 'updated' : 'failed'
        });
      } else {
        results.push({
          siteProductId,
          productName,
          status: 'skipped',
          reason: 'no_mapping'
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      results,
      message: 'Stock update process completed' 
    });

  } catch (error) {
    console.error('Error processing order stock:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
