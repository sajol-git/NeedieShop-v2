import { NextResponse } from 'next/server';
import { sendSMS } from '@/lib/sms';

export async function POST(req: Request) {
  try {
    const { phone, code } = await req.json();

    if (!phone || !code) {
      return NextResponse.json({ error: 'Phone and code are required' }, { status: 400 });
    }

    const message = `Your NeedieShop verification code is: ${code}. Do not share this with anyone.`;
    const result = await sendSMS(phone, message);

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: result.error || 'Failed to send SMS' }, { status: 500 });
    }
  } catch (error) {
    console.error('SMS Send Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
