import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    app: 'Bank WorkDesk',
    status: 'healthy',
    mode: 'local-development',
  });
}
