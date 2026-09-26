# Bank WorkDesk

A corporate banking productivity platform for daily internal work, document handling, task tracking, email drafting, AI assistance, and secure local work management.

## Features

- WorkDesk dashboard with analytics widgets
- Task management and notes
- Global search / command palette
- Customer required documents workflow
- Bank document library
- File manager and PDF/image studio mockups with real upload handling
- Email drafting and templates
- AI assistant with local fallback
- Secure vault and privacy controls
- Calculators and backup / restore setup
- PWA-ready structure

## Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite for local development
- Auth.js / NextAuth
- Zod

## Run locally

```bash
npm install
npm run dev
```

Then visit http://localhost:3000.

## Prisma

```bash
npx prisma generate
npx prisma db push
```

## Notes

This app is structured to be production-ready but also runnable without external cloud services in local development.
