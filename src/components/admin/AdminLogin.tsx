'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authenticateAdmin, setAdminSession } from '@/lib/admin-auth';

export function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    window.setTimeout(() => {
      if (!authenticateAdmin(username.trim(), password)) {
        setError('Invalid credentials.');
        setLoading(false);
        return;
      }
      setAdminSession();
      router.replace('/admin/dashboard');
    }, 250);
  }

  return (
    <div className="min-h-[70dvh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md border border-espresso/15 bg-white/40 p-7 sm:p-10 shadow-sm">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-wine mb-4">Private workspace</p>
        <h1 className="font-serif text-4xl mb-3">CARRYFORM admin</h1>
        <p className="text-sm text-espresso/60 leading-relaxed mb-8">
          Manage the catalogue and the stories that shape the showroom.
        </p>
        <form onSubmit={submit} className="space-y-5">
          <label className="block text-sm font-medium">
            Username
            <input required value={username} onChange={(event) => setUsername(event.target.value)} className="admin-input mt-2" autoComplete="username" />
          </label>
          <label className="block text-sm font-medium">
            Password
            <span className="relative block mt-2">
              <input required type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} className="admin-input pr-20" autoComplete="current-password" />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-wine">
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </span>
          </label>
          {error && <p role="alert" className="text-sm text-wine bg-wine/10 px-3 py-2">{error}</p>}
          <button disabled={loading} className="admin-primary w-full" type="submit">{loading ? 'Checking…' : 'Enter dashboard'}</button>
        </form>
        <Link href="/" className="block text-center text-sm text-espresso/55 hover:text-wine mt-6">← Back to Home</Link>
        <p className="text-[11px] text-espresso/40 mt-8 pt-5 border-t border-espresso/10">
          Development mode only. This temporary session is not production authentication. Configure Supabase Auth before deployment.
        </p>
      </div>
    </div>
  );
}
