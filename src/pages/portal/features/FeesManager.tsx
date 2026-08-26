import { useEffect, useState } from 'react';
import { Wallet, Loader2, Save } from 'lucide-react';
import { supabase, type Profile, type Fees } from '../../../lib/supabase';

interface Row {
  student: Profile;
  total: string;
  paid: string;
  due: string;
  note: string;
  saved: boolean;
}

export function FeesManager() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!supabase) return;
    const { data: students } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'student')
      .order('login_id');
    const { data: fees } = await supabase.from('fees').select('*');
    const feeMap = new Map<string, Fees>();
    ((fees as Fees[]) ?? []).forEach((f) => feeMap.set(f.student_id, f));
    setRows(
      ((students as Profile[]) ?? []).map((s) => {
        const f = feeMap.get(s.id);
        return {
          student: s,
          total: f ? String(f.total_amount) : '',
          paid: f ? String(f.paid_amount) : '',
          due: f?.next_due_date ?? '',
          note: f?.note ?? '',
          saved: true
        };
      })
    );
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const update = (id: string, field: keyof Row, value: string) =>
    setRows((rs) => rs.map((r) => (r.student.id === id ? { ...r, [field]: value, saved: false } : r)));

  const save = async (row: Row) => {
    if (!supabase) return;
    await supabase.from('fees').upsert({
      student_id: row.student.id,
      total_amount: Number(row.total) || 0,
      paid_amount: Number(row.paid) || 0,
      next_due_date: row.due || null,
      note: row.note || null,
      updated_at: new Date().toISOString()
    });
    setRows((rs) => rs.map((r) => (r.student.id === row.student.id ? { ...r, saved: true } : r)));
  };

  return (
    <div>
      <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-primary">
        <Wallet size={20} className="text-accent" /> Student Fees
      </h2>
      <p className="mt-1 text-xs text-slate-400">
        Enter total fees and amount paid for each student. Pending is calculated automatically. Click Save on the row.
      </p>

      {loading ? (
        <div className="mt-4 flex items-center gap-2 bg-white p-6 text-slate-500 shadow-sm">
          <Loader2 size={18} className="animate-spin" /> Loading…
        </div>
      ) : rows.length === 0 ? (
        <p className="mt-4 bg-white p-6 text-sm text-slate-500 shadow-sm">No students found. Create students first.</p>
      ) : (
        <div className="mt-4 overflow-x-auto bg-white shadow-sm">
          <table className="w-full min-w-[820px] border-collapse text-sm">
            <thead>
              <tr className="bg-primary text-left text-xs uppercase tracking-wide text-white">
                <th className="px-4 py-3 font-semibold">Student</th>
                <th className="px-4 py-3 font-semibold">Total (₹)</th>
                <th className="px-4 py-3 font-semibold">Paid (₹)</th>
                <th className="px-4 py-3 font-semibold">Pending (₹)</th>
                <th className="px-4 py-3 font-semibold">Next Due</th>
                <th className="px-4 py-3 font-semibold">Note</th>
                <th className="px-4 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const pending = (Number(r.total) || 0) - (Number(r.paid) || 0);
                return (
                  <tr key={r.student.id} className="border-b border-slate-200 last:border-b-0">
                    <td className="px-4 py-2.5">
                      <span className="font-semibold text-primary">{r.student.full_name}</span>
                      <span className="block text-xs text-slate-500">{r.student.login_id}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <input type="number" value={r.total} onChange={(e) => update(r.student.id, 'total', e.target.value)}
                        className="w-24 border border-slate-300 px-2 py-1 text-sm focus:border-primary focus:outline-none" />
                    </td>
                    <td className="px-4 py-2.5">
                      <input type="number" value={r.paid} onChange={(e) => update(r.student.id, 'paid', e.target.value)}
                        className="w-24 border border-slate-300 px-2 py-1 text-sm focus:border-primary focus:outline-none" />
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={pending > 0 ? 'font-semibold text-red-600' : 'font-semibold text-green-600'}>
                        {pending}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <input type="date" value={r.due} onChange={(e) => update(r.student.id, 'due', e.target.value)}
                        className="border border-slate-300 px-2 py-1 text-xs focus:border-primary focus:outline-none" />
                    </td>
                    <td className="px-4 py-2.5">
                      <input value={r.note} onChange={(e) => update(r.student.id, 'note', e.target.value)} placeholder="optional"
                        className="w-28 border border-slate-300 px-2 py-1 text-xs focus:border-primary focus:outline-none" />
                    </td>
                    <td className="px-4 py-2.5">
                      <button onClick={() => save(r)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold uppercase ${r.saved ? 'bg-slate-100 text-slate-400' : 'bg-accent text-primary-dark'}`}>
                        <Save size={13} /> {r.saved ? 'Saved' : 'Save'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
