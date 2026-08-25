import { useEffect, useState } from 'react';
import { Megaphone, Trash2, Plus, Loader2 } from 'lucide-react';
import { supabase, type Announcement, type UserRole } from '../../../lib/supabase';
import { useAuth } from '../../../lib/auth';

export function Announcements({ role }: { role: UserRole }) {
  const { profile } = useAuth();
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState<Announcement['audience']>(role === 'teacher' ? 'students' : 'all');
  const [busy, setBusy] = useState(false);

  const canPost = role === 'admin' || role === 'teacher';

  const load = async () => {
    if (!supabase) return;
    const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
    setItems((data as Announcement[]) ?? []);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const visible = items.filter((a) => {
    if (role === 'admin') return true;
    if (role === 'teacher') return a.audience === 'all' || a.audience === 'teachers';
    return a.audience === 'all' || a.audience === 'students';
  });

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !profile) return;
    setBusy(true);
    await supabase.from('announcements').insert({
      author_id: profile.id,
      author_name: profile.full_name,
      audience: role === 'teacher' ? 'students' : audience,
      title,
      body: body || null
    });
    setBusy(false);
    setTitle('');
    setBody('');
    await load();
  };

  const del = async (id: string) => {
    if (!supabase || !confirm('Delete this announcement?')) return;
    await supabase.from('announcements').delete().eq('id', id);
    await load();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      {canPost && (
        <div>
          <h3 className="flex items-center gap-2 font-heading text-base font-bold text-primary">
            <Plus size={18} className="text-accent" /> Post Announcement
          </h3>
          <form onSubmit={add} className="mt-4 space-y-4 border border-slate-200 bg-white p-5 shadow-sm">
            {role === 'admin' && (
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Send to</span>
                <select value={audience} onChange={(e) => setAudience(e.target.value as Announcement['audience'])}
                  className="mt-1.5 w-full border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none">
                  <option value="all">Everyone</option>
                  <option value="students">Students only</option>
                  <option value="teachers">Teachers only</option>
                </select>
              </label>
            )}
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Title *</span>
              <input required value={title} onChange={(e) => setTitle(e.target.value)}
                className="mt-1.5 w-full border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Message</span>
              <textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)}
                className="mt-1.5 w-full border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </label>
            <button type="submit" disabled={busy} className="btn-accent w-full disabled:opacity-60">
              {busy ? <Loader2 size={16} className="animate-spin" /> : <Megaphone size={16} />} Post
            </button>
          </form>
        </div>
      )}

      <div className={canPost ? '' : 'lg:col-span-2'}>
        <h3 className="flex items-center gap-2 font-heading text-base font-bold text-primary">
          <Megaphone size={18} className="text-accent" /> Announcements
        </h3>
        {loading ? (
          <div className="mt-4 flex items-center gap-2 bg-white p-6 text-slate-500 shadow-sm">
            <Loader2 size={18} className="animate-spin" /> Loading…
          </div>
        ) : visible.length === 0 ? (
          <p className="mt-4 bg-white p-6 text-sm text-slate-500 shadow-sm">No announcements yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {visible.map((a) => (
              <div key={a.id} className="border-l-4 border-l-accent bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-heading text-sm font-bold text-primary">{a.title}</h4>
                    <p className="text-xs text-slate-500">
                      {a.author_name} · {new Date(a.created_at).toLocaleDateString('en-IN')}
                      {role === 'admin' && a.audience !== 'all' ? ` · to ${a.audience}` : ''}
                    </p>
                  </div>
                  {(role === 'admin' || a.author_id === profile?.id) && (
                    <button onClick={() => del(a.id)} className="shrink-0 text-slate-400 hover:text-red-600">
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
                {a.body && <p className="mt-2 text-sm leading-relaxed text-slate-600">{a.body}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
