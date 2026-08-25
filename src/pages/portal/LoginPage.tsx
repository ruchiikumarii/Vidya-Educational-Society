import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Info, ShieldCheck } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { useAuth } from '../../lib/auth';

export function LoginPage() {
  const { profile, configured, signIn } = useAuth();
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (profile) navigate('/dashboard', { replace: true });
  }, [profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    const { error } = await signIn(loginId, password);
    setBusy(false);
    if (error) setError(error);
    else navigate('/dashboard', { replace: true });
  };

  return (
    <>
      <PageHeader title="Student / Staff Login" subtitle="Log in to access your dashboard, notes and study material." />

      <section className="bg-bg-alt py-16">
        <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
          {!configured && (
            <div className="mb-6 flex gap-3 border-l-4 border-l-amber-500 bg-amber-50 p-4 text-sm text-slate-700">
              <Info size={18} className="mt-0.5 shrink-0 text-amber-600" />
              <p>The login portal is not connected yet. Please set up Supabase to enable it.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Login ID</span>
              <input
                type="text"
                required
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="e.g. VES2025001"
                className="mt-1.5 w-full border border-slate-300 px-4 py-3 text-sm focus:border-primary focus:outline-none"
              />
            </label>

            <label className="mt-5 block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1.5 w-full border border-slate-300 px-4 py-3 text-sm focus:border-primary focus:outline-none"
              />
            </label>

            {error && (
              <p className="mt-4 border-l-4 border-l-red-600 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}

            <button type="submit" disabled={busy} className="btn-primary mt-6 w-full disabled:opacity-60">
              <LogIn size={16} /> {busy ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 flex gap-3 border border-slate-200 bg-white p-5 text-sm text-slate-600">
            <ShieldCheck size={20} className="mt-0.5 shrink-0 text-accent" />
            <p>Forgot your Login ID or password? Please contact the institute office.</p>
          </div>
        </div>
      </section>
    </>
  );
}
