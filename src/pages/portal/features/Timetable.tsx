import { useEffect, useState } from 'react';
import { CalendarDays, Trash2, Plus, Loader2 } from 'lucide-react';
import { supabase, type TimetableEntry, type UserRole } from '../../../lib/supabase';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function Timetable({ role }: { role: UserRole }) {
  const [items, setItems] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [day, setDay] = useState('Monday');
  const [timeSlot, setTimeSlot] = useState('');
  const [subject, setSubject] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [busy, setBusy] = useState(false);

  const canEdit = role === 'admin' || role === 'teacher';

  const load = async () => {
    if (!supabase) return;
    const { data } = await supabase.from('timetable').select('*');
    setItems((data as TimetableEntry[]) ?? []);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    await supabase.from('timetable').insert({ day, time_slot: timeSlot, subject, teacher_name: teacherName || null });
    setBusy(false);
    setTimeSlot('');
    setSubject('');
    setTeacherName('');
    await load();
  };

  const del = async (id: string) => {
    if (!supabase || !confirm('Delete this class?')) return;
    await supabase.from('timetable').delete().eq('id', id);
    await load();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
      {canEdit && (
        <div>
          <h3 className="flex items-center gap-2 font-heading text-base font-bold text-primary">
            <Plus size={18} className="text-accent" /> Add Class
          </h3>
          <form onSubmit={add} className="mt-4 space-y-4 border border-slate-200 bg-white p-5 shadow-sm">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Day</span>
              <select value={day} onChange={(e) => setDay(e.target.value)}
                className="mt-1.5 w-full border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none">
                {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Time *</span>
              <input required value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} placeholder="e.g. 8:00 AM - 9:00 AM"
                className="mt-1.5 w-full border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Subject / Course *</span>
              <input required value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Tally Prime"
                className="mt-1.5 w-full border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Teacher (optional)</span>
              <input value={teacherName} onChange={(e) => setTeacherName(e.target.value)}
                className="mt-1.5 w-full border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </label>
            <button type="submit" disabled={busy} className="btn-accent w-full disabled:opacity-60">
              {busy ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Add to Timetable
            </button>
          </form>
        </div>
      )}

      <div className={canEdit ? '' : 'lg:col-span-2'}>
        <h3 className="flex items-center gap-2 font-heading text-base font-bold text-primary">
          <CalendarDays size={18} className="text-accent" /> Class Timetable
        </h3>
        {loading ? (
          <div className="mt-4 flex items-center gap-2 bg-white p-6 text-slate-500 shadow-sm">
            <Loader2 size={18} className="animate-spin" /> Loading…
          </div>
        ) : items.length === 0 ? (
          <p className="mt-4 bg-white p-6 text-sm text-slate-500 shadow-sm">No classes added yet.</p>
        ) : (
          <div className="mt-4 space-y-5">
            {DAYS.filter((d) => items.some((i) => i.day === d)).map((d) => (
              <div key={d}>
                <h4 className="font-heading text-sm font-bold uppercase tracking-wide text-accent">{d}</h4>
                <div className="mt-2 overflow-x-auto bg-white shadow-sm">
                  <table className="w-full min-w-[420px] border-collapse text-sm">
                    <tbody>
                      {items.filter((i) => i.day === d).map((i) => (
                        <tr key={i.id} className="border-b border-slate-100 last:border-b-0">
                          <td className="px-4 py-2.5 font-semibold text-primary whitespace-nowrap">{i.time_slot}</td>
                          <td className="px-4 py-2.5 text-slate-700">{i.subject}</td>
                          <td className="px-4 py-2.5 text-slate-500">{i.teacher_name}</td>
                          {canEdit && (
                            <td className="px-4 py-2.5 text-right">
                              <button onClick={() => del(i.id)} className="text-slate-400 hover:text-red-600">
                                <Trash2 size={14} />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
