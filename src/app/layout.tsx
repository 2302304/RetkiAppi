import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { AppShell } from '@/components/auth/AppShell';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Retkeilysovellus',
  description: 'Seuraa retkiäsi, kansallispuistokäyntejäsi ja suunnittele seuraava seikkailu',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fi">
      <body className={`${geistSans.variable} antialiased bg-gray-50 font-sans`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
