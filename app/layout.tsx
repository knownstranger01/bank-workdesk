import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bank WorkDesk',
  description: 'Corporate banking productivity platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
