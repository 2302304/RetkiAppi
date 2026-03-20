'use client';

import { AuthGuard } from './AuthGuard';
import { Navigation } from '@/components/layout/Navigation';
import { useAuth } from '@/hooks/useAuth';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <AuthGuard>
      {user && <Navigation />}
      <main className="max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-6">
        {children}
      </main>
    </AuthGuard>
  );
}
