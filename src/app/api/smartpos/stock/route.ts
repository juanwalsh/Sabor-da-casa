import { NextResponse } from 'next/server';
import { updateSmartPOSStock } from '@/lib/smartpos';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, quantity, operation } = body;
    
    if (!productId || quantity === undefined || !operation) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const success = await updateSmartPOSStock({
      productId,
      quantity,
      stockOperation: operation
    });

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to update stock' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating stock:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
