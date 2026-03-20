import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Navigation } from '@/components/layout/Navigation';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Retkeilysovellus',
  description: 'Seuraa retkiäsi ja kansallispuistokäyntejäsi',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fi">
      <body className={`${geistSans.variable} antialiased bg-gray-50 font-sans`}>
        <Navigation />
        <main className="max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-6">
          {children}
        </main>
      </body>
    </html>
  );
}
