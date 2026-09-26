import { NextResponse } from 'next/server';

const requirements = [
  {
    id: 'req-1',
    service: 'Individual Account Opening',
    title: 'Citizen ID Copy',
    optional: false,
    notes: 'DEMO / EDITABLE requirement',
  },
  {
    id: 'req-2',
    service: 'Corporate Account Opening',
    title: 'Company Registration Certificate',
    optional: false,
    notes: 'DEMO / EDITABLE requirement',
  },
  {
    id: 'req-3',
    service: 'SWIFT',
    title: 'Purpose of transfer letter',
    optional: true,
    notes: 'DEMO / EDITABLE requirement',
  },
];

export async function GET() {
  return NextResponse.json({ requirements });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const item = {
    id: `req-${Date.now()}`,
    service: typeof body.service === 'string' ? body.service : 'Other',
    title: typeof body.title === 'string' ? body.title : 'New requirement',
    optional: Boolean(body.optional),
    notes: typeof body.notes === 'string' ? body.notes : '',
  };

  requirements.unshift(item);
  return NextResponse.json({ item, ok: true });
}
