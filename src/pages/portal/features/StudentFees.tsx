import { useEffect, useState } from 'react';
import { Wallet, Loader2, CalendarClock } from 'lucide-react';
import { supabase, type Fees } from '../../../lib/supabase';
import { useAuth } from '../../../lib/auth';

export function StudentFees() {
  const { profile } = useAuth();
  const [fees, setFees] = useState<Fees | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!supabase || !profile) return;
      const { data } = await supabase.from('fees').select('*').eq('student_id', profile.id).maybeSingle();
      setFees((data as Fees) ?? null);
      setLoading(false);
    })();
  }, [profile]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 bg-white p-6 text-slate-500 shadow-sm">
        <Loader2 size={18} className="animate-spin" /> Loading…
      </div>
    );
  }

  if (!fees) {
    return (
      <div>
        <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-primary">
          <Wallet size={20} className="text-accent" /> My Fees
        </h3>
        <p className="mt-4 bg-white p-6 text-sm text-slate-500 shadow-sm">
          No fee details have been added yet. Please contact the office.
        </p>
      </div>
    );
  }

  const pending = Number(fees.total_amount) - Number(fees.paid_amount);

  return (
    <div>
      <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-primary">
        <Wallet size={20} className="text-accent" /> My Fees
      </h3>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="border-t-4 border-t-primary bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Fees</p>
          <p className="mt-1 font-heading text-2xl font-extrabold text-primary">₹{fees.total_amount}</p>
        </div>
        <div className="border-t-4 border-t-green-600 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Paid</p>
          <p className="mt-1 font-heading text-2xl font-extrabold text-green-600">₹{fees.paid_amount}</p>
        </div>
        <div className={`border-t-4 bg-white p-5 shadow-sm ${pending > 0 ? 'border-t-red-600' : 'border-t-green-600'}`}>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pending</p>
          <p className={`mt-1 font-heading text-2xl font-extrabold ${pending > 0 ? 'text-red-600' : 'text-green-600'}`}>
            ₹{pending}
          </p>
        </div>
      </div>

      {(fees.next_due_date || fees.note) && (
        <div className="mt-4 flex flex-wrap items-center gap-4 border border-slate-200 bg-white p-4 text-sm shadow-sm">
          {fees.next_due_date && (
            <span className="flex items-center gap-2 font-semibold text-primary">
              <CalendarClock size={16} className="text-accent" />
              Next Due: {new Date(fees.next_due_date).toLocaleDateString('en-IN')}
            </span>
          )}
          {fees.note && <span className="text-slate-600">{fees.note}</span>}
        </div>
      )}
    </div>
  );
}
