import { NextResponse } from 'next/server';
import { sendSMS } from '@/lib/sms';

export async function POST(req: Request) {
  try {
    const { number, message } = await req.json();
    if (!number || !message) {
      return NextResponse.json({ status: 'error', message: 'Missing number or message' }, { status: 400 });
    }
    const result = await sendSMS(number, message);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed to send SMS' }, { status: 500 });
  }
}
