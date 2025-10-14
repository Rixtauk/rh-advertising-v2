import { NextRequest, NextResponse } from 'next/server';
import { getAssetSpecsForChannel } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const channel = searchParams.get('channel');

    if (!channel) {
      return NextResponse.json({ error: 'Channel parameter required' }, { status: 400 });
    }

    const specs = getAssetSpecsForChannel(channel);
    return NextResponse.json(specs);
  } catch (error) {
    console.error('Error loading asset specs:', error);
    return NextResponse.json(
      { error: 'Failed to load asset specifications' },
      { status: 500 }
    );
  }
}
