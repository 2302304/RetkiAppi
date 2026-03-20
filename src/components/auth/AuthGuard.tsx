'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Mountain, Mail, LogOut } from 'lucide-react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, signIn, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Mountain size={48} className="mx-auto text-green-700 mb-3 animate-pulse" />
          <p className="text-gray-500">Ladataan...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-sm mx-4">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <Mountain size={48} className="mx-auto text-green-700 mb-3" />
              <h1 className="text-xl font-bold text-gray-900">Retkeilysovellus</h1>
              <p className="text-sm text-gray-500 mt-1">
                Kirjaudu sisään sähköpostilinkillä
              </p>
            </div>

            {sent ? (
              <div className="text-center">
                <Mail size={32} className="mx-auto text-green-600 mb-3" />
                <p className="text-sm text-gray-700 font-medium">
                  Tarkista sähköpostisi!
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Lähetimme kirjautumislinkin osoitteeseen {email}
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="text-xs text-green-700 hover:underline mt-4"
                >
                  Lähetä uudelleen
                </button>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!email) return;
                  setSubmitting(true);
                  setError('');
                  const { error } = await signIn(email);
                  setSubmitting(false);
                  if (error) {
                    setError('Kirjautuminen epäonnistui. Yritä uudelleen.');
                  } else {
                    setSent(true);
                  }
                }}
                className="space-y-4"
              >
                <Input
                  id="email"
                  type="email"
                  label="Sähköposti"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nimi@esimerkki.fi"
                  required
                />
                {error && <p className="text-xs text-red-600">{error}</p>}
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? 'Lähetetään...' : 'Lähetä kirjautumislinkki'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

export function SignOutButton() {
  const { signOut } = useAuth();
  return (
    <button
      onClick={signOut}
      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
    >
      <LogOut size={16} />
      Kirjaudu ulos
    </button>
  );
}
