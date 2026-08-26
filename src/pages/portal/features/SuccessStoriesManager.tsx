import { useEffect, useState } from 'react';
import { Star, Trash2, Plus, Loader2 } from 'lucide-react';
import { supabase, type SuccessStory } from '../../../lib/supabase';
import { useAuth } from '../../../lib/auth';

export function SuccessStoriesManager() {
  const { profile } = useAuth();
  const [items, setItems] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [story, setStory] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const load = async () => {
    if (!supabase) return;
    const { data } = await supabase.from('success_stories').select('*').order('created_at', { ascending: false });
    setItems((data as SuccessStory[]) ?? []);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !profile) return;
    setBusy(true);
    setMsg('');
    try {
      let imageUrl: string | null = null;
      if (file) {
        const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const path = `stories/${Date.now()}-${safe}`;
        const { error: upErr } = await supabase.storage.from('gallery').upload(path, file);
        if (upErr) throw upErr;
        imageUrl = supabase.storage.from('gallery').getPublicUrl(path).data.publicUrl;
      }
      const { error } = await supabase.from('success_stories').insert({
        name,
        course: course || null,
        story,
        image_url: imageUrl,
        created_by: profile.id
      });
      if (error) throw error;
      setName('');
      setCourse('');
      setStory('');
      setFile(null);
      const el = document.getElementById('story-file') as HTMLInputElement | null;
      if (el) el.value = '';
      setMsg('Success story added — it will show on the website.');
      await load();
    } catch {
      setMsg('Could not add. Make sure the "gallery" bucket exists (for the photo).');
    } finally {
      setBusy(false);
    }
  };

  const del = async (item: SuccessStory) => {
    if (!supabase || !confirm('Delete this success story?')) return;
    await supabase.from('success_stories').delete().eq('id', item.id);
    await load();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
      <div>
        <h3 className="flex items-center gap-2 font-heading text-base font-bold text-primary">
          <Plus size={18} className="text-accent" /> Add Success Story
        </h3>
        <form onSubmit={add} className="mt-4 space-y-4 border border-slate-200 bg-white p-5 shadow-sm">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Student Name *</span>
            <input required value={name} onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Course / Achievement</span>
            <input value={course} onChange={(e) => setCourse(e.target.value)} placeholder="e.g. PGDCA · Now working as Accountant"
              className="mt-1.5 w-full border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Story *</span>
            <textarea required rows={4} value={story} onChange={(e) => setStory(e.target.value)}
              className="mt-1.5 w-full border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Photo (optional)</span>
            <input id="story-file" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-1.5 w-full text-sm text-slate-600 file:mr-3 file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:text-white" />
          </label>
          {msg && <p className="text-sm font-medium text-primary">{msg}</p>}
          <button type="submit" disabled={busy} className="btn-accent w-full disabled:opacity-60">
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Star size={16} />} Add Story
          </button>
        </form>
      </div>

      <div>
        <h3 className="flex items-center gap-2 font-heading text-base font-bold text-primary">
          <Star size={18} className="text-accent" /> Success Stories ({items.length})
        </h3>
        {loading ? (
          <div className="mt-4 flex items-center gap-2 bg-white p-6 text-slate-500 shadow-sm">
            <Loader2 size={18} className="animate-spin" /> Loading…
          </div>
        ) : items.length === 0 ? (
          <p className="mt-4 bg-white p-6 text-sm text-slate-500 shadow-sm">No success stories added yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {items.map((s) => (
              <div key={s.id} className="flex items-start justify-between gap-4 border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex gap-3">
                  {s.image_url && <img src={s.image_url} alt={s.name} className="h-12 w-12 shrink-0 rounded object-cover" />}
                  <div>
                    <h4 className="font-heading text-sm font-bold text-primary">{s.name}</h4>
                    {s.course && <p className="text-xs text-accent">{s.course}</p>}
                    <p className="mt-1 text-sm text-slate-600">{s.story}</p>
                  </div>
                </div>
                <button onClick={() => del(s)} className="shrink-0 text-slate-400 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
