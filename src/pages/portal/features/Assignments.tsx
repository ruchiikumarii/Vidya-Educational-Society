import { useEffect, useState } from 'react';
import { ClipboardList, Trash2, Plus, Loader2, Download, CalendarClock } from 'lucide-react';
import { supabase, type Assignment, type UserRole } from '../../../lib/supabase';
import { useAuth } from '../../../lib/auth';

export function Assignments({ role }: { role: UserRole }) {
  const { profile } = useAuth();
  const [items, setItems] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const canPost = role === 'teacher' || role === 'admin';

  const load = async () => {
    if (!supabase) return;
    const { data } = await supabase.from('assignments').select('*').order('created_at', { ascending: false });
    setItems((data as Assignment[]) ?? []);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !profile) return;
    setBusy(true);
    let filePath: string | null = null;
    let fileName: string | null = null;
    try {
      if (file) {
        const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        filePath = `assignments/${profile.id}/${Date.now()}-${safe}`;
        const { error } = await supabase.storage.from('notes').upload(filePath, file);
        if (error) throw error;
        fileName = file.name;
      }
      await supabase.from('assignments').insert({
        teacher_id: profile.id,
        teacher_name: profile.full_name,
        title,
        description: description || null,
        due_date: dueDate || null,
        file_path: filePath,
        file_name: fileName
      });
      setTitle('');
      setDescription('');
      setDueDate('');
      setFile(null);
      const el = document.getElementById('assignment-file') as HTMLInputElement | null;
      if (el) el.value = '';
      await load();
    } finally {
      setBusy(false);
    }
  };

  const del = async (a: Assignment) => {
    if (!supabase || !confirm('Delete this assignment?')) return;
    if (a.file_path) await supabase.storage.from('notes').remove([a.file_path]);
    await supabase.from('assignments').delete().eq('id', a.id);
    await load();
  };

  const openFile = async (a: Assignment) => {
    if (!supabase || !a.file_path) return;
    const { data } = await supabase.storage.from('notes').createSignedUrl(a.file_path, 3600);
    if (data?.signedUrl) window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      {canPost && (
        <div>
          <h3 className="flex items-center gap-2 font-heading text-base font-bold text-primary">
            <Plus size={18} className="text-accent" /> Give Assignment
          </h3>
          <form onSubmit={add} className="mt-4 space-y-4 border border-slate-200 bg-white p-5 shadow-sm">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Title *</span>
              <input required value={title} onChange={(e) => setTitle(e.target.value)}
                className="mt-1.5 w-full border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Description</span>
              <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                className="mt-1.5 w-full border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Due Date</span>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                className="mt-1.5 w-full border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">File (optional)</span>
              <input id="assignment-file" type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="mt-1.5 w-full text-sm text-slate-600 file:mr-3 file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:text-white" />
            </label>
            <button type="submit" disabled={busy} className="btn-accent w-full disabled:opacity-60">
              {busy ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Add Assignment
            </button>
          </form>
        </div>
      )}

      <div className={canPost ? '' : 'lg:col-span-2'}>
        <h3 className="flex items-center gap-2 font-heading text-base font-bold text-primary">
          <ClipboardList size={18} className="text-accent" /> Assignments
        </h3>
        {loading ? (
          <div className="mt-4 flex items-center gap-2 bg-white p-6 text-slate-500 shadow-sm">
            <Loader2 size={18} className="animate-spin" /> Loading…
          </div>
        ) : items.length === 0 ? (
          <p className="mt-4 bg-white p-6 text-sm text-slate-500 shadow-sm">No assignments yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {items.map((a) => (
              <div key={a.id} className="border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-heading text-sm font-bold text-primary">{a.title}</h4>
                    <p className="text-xs text-slate-500">By {a.teacher_name}</p>
                  </div>
                  {a.due_date && (
                    <span className="flex shrink-0 items-center gap-1 bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                      <CalendarClock size={12} /> Due {new Date(a.due_date).toLocaleDateString('en-IN')}
                    </span>
                  )}
                </div>
                {a.description && <p className="mt-2 text-sm leading-relaxed text-slate-600">{a.description}</p>}
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {a.file_path && (
                    <button onClick={() => openFile(a)} className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-accent">
                      <Download size={13} /> {a.file_name}
                    </button>
                  )}
                  {(role === 'admin' || a.teacher_id === profile?.id) && (
                    <button onClick={() => del(a)} className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-red-600">
                      <Trash2 size={13} /> Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
