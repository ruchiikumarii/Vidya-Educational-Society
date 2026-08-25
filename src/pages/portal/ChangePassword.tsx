import { useState } from 'react';
import { KeyRound, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function ChangePassword() {
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (pw.length < 6) return setMsg({ type: 'err', text: 'Password must be at least 6 characters.' });
    if (pw !== pw2) return setMsg({ type: 'err', text: 'Both passwords do not match.' });
    if (!supabase) return;
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) setMsg({ type: 'err', text: 'Could not change password. Please try again.' });
    else {
      setMsg({ type: 'ok', text: 'Password changed successfully.' });
      setPw('');
      setPw2('');
    }
  };

  return (
    <div className="border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="flex items-center gap-2 font-heading text-base font-bold text-primary">
        <KeyRound size={18} className="text-accent" /> Change My Password
      </h3>
      <form onSubmit={submit} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="block flex-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">New Password</span>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="mt-1.5 w-full border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </label>
        <label className="block flex-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Confirm Password</span>
          <input
            type="password"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            className="mt-1.5 w-full border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </label>
        <button type="submit" disabled={busy} className="btn-primary shrink-0 disabled:opacity-60">
          {busy ? <Loader2 size={15} className="animate-spin" /> : <KeyRound size={15} />} Update
        </button>
      </form>
      {msg && (
        <p className={`mt-3 border-l-4 px-3 py-2 text-sm ${msg.type === 'ok' ? 'border-l-green-600 bg-green-50 text-green-700' : 'border-l-red-600 bg-red-50 text-red-700'}`}>
          {msg.text}
        </p>
      )}
    </div>
  );
}
