import { NextResponse } from 'next/server';

const documents = [
  {
    id: 'doc-1',
    title: 'Account Opening Form',
    description: 'Customer onboarding form for individual account opening.',
    category: 'Individual Account',
    tags: ['account', 'form'],
    url: 'https://www.kumaribank.com/download',
    favorite: true,
  },
  {
    id: 'doc-2',
    title: 'Corporate KYC Checklist',
    description: 'Checklist for corporate customer document verification.',
    category: 'KYC',
    tags: ['kyc', 'corporate'],
    url: 'https://www.kumaribank.com/download',
    favorite: false,
  },
];

export async function GET() {
  return NextResponse.json({ documents });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const doc = {
    id: `doc-${Date.now()}`,
    title: typeof body.title === 'string' ? body.title : 'New bank document',
    description: typeof body.description === 'string' ? body.description : '',
    category: typeof body.category === 'string' ? body.category : 'Other',
    tags: Array.isArray(body.tags) ? body.tags : ['bank'],
    url: typeof body.url === 'string' ? body.url : 'https://www.kumaribank.com/download',
    favorite: Boolean(body.favorite),
  };

  documents.unshift(doc);
  return NextResponse.json({ doc, ok: true });
}
