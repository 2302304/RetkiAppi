'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Mountain, LogOut } from 'lucide-react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email || !password) return;
      setSubmitting(true);
      setError('');
      setSuccess('');

      if (isRegistering) {
        const { error } = await signUp(email, password);
        setSubmitting(false);
        if (error) {
          setError(error.message === 'User already registered'
            ? 'Tili on jo olemassa. Kirjaudu sisään.'
            : 'Rekisteröinti epäonnistui. Salasanan tulee olla vähintään 6 merkkiä.');
        } else {
          setSuccess('Tili luotu! Voit nyt kirjautua sisään.');
          setIsRegistering(false);
        }
      } else {
        const { error } = await signIn(email, password);
        setSubmitting(false);
        if (error) {
          setError('Väärä sähköposti tai salasana.');
        }
      }
    };

    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-sm mx-4">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <Mountain size={48} className="mx-auto text-green-700 mb-3" />
              <h1 className="text-xl font-bold text-gray-900">Retkeilysovellus</h1>
              <p className="text-sm text-gray-500 mt-1">
                {isRegistering ? 'Luo uusi tili' : 'Kirjaudu sisään'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="email"
                type="email"
                label="Sähköposti"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nimi@esimerkki.fi"
                required
              />
              <Input
                id="password"
                type="password"
                label="Salasana"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isRegistering ? 'Vähintään 6 merkkiä' : '••••••'}
                minLength={6}
                required
              />
              {error && <p className="text-xs text-red-600">{error}</p>}
              {success && <p className="text-xs text-green-600">{success}</p>}
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting
                  ? 'Odota...'
                  : isRegistering
                  ? 'Luo tili'
                  : 'Kirjaudu sisään'}
              </Button>
            </form>

            <div className="text-center mt-4">
              <button
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError('');
                  setSuccess('');
                }}
                className="text-sm text-green-700 hover:underline"
              >
                {isRegistering
                  ? 'Onko sinulla jo tili? Kirjaudu sisään'
                  : 'Ei vielä tiliä? Luo uusi'}
              </button>
            </div>
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
