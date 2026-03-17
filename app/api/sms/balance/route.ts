import { NextResponse } from 'next/server';
import { getSMSBalance } from '@/lib/sms';

export async function GET() {
  try {
    const result = await getSMSBalance();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed to get balance' }, { status: 500 });
  }
}
