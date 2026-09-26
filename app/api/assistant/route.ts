import { NextResponse } from 'next/server';
import { getLocalAssistantResponse } from '@/lib/ai/local-assistant';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({ prompt: '' }));
  const prompt = typeof body.prompt === 'string' ? body.prompt : '';

  return NextResponse.json({
    ok: true,
    response: getLocalAssistantResponse(prompt),
    provider: 'local',
    mode: 'local-workdesk-assistant',
  });
}
