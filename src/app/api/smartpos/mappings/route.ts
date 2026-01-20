import { NextResponse } from 'next/server';
import { getAllMappings } from '@/lib/smartpos';

export async function GET() {
  try {
    const mappings = await getAllMappings();
    return NextResponse.json({ success: true, mappings });
  } catch (error) {
    console.error('Error fetching mappings:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch mappings' }, { status: 500 });
  }
}
