import { NextResponse } from 'next/server';
import { clearConfigCache } from '@/lib/config';

export async function POST() {
  try {
    clearConfigCache();
    return NextResponse.json({ success: true, message: 'Config cache cleared' });
  } catch (error) {
    console.error('Error clearing config cache:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
