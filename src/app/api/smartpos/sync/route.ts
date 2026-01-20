import { NextResponse } from 'next/server';
import { getSmartPOSProducts, saveProductMapping } from '@/lib/smartpos';

export async function GET() {
  try {
    const products = await getSmartPOSProducts();
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching SmartPOS products:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mapping } = body;
    
    if (!mapping || !mapping.siteProductId || !mapping.smartposProductId) {
      return NextResponse.json({ success: false, error: 'Invalid mapping data' }, { status: 400 });
    }

    const success = await saveProductMapping(mapping);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to save mapping' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error saving mapping:', error);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
