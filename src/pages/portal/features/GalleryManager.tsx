import { useEffect, useState } from 'react';
import { Images, Trash2, Upload, Loader2 } from 'lucide-react';
import { supabase, type GalleryItem } from '../../../lib/supabase';
import { useAuth } from '../../../lib/auth';

const CATEGORIES = ['Campus', 'Classroom', 'Students', 'Events'];

export function GalleryManager() {
  const { profile } = useAuth();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Events');
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const load = async () => {
    if (!supabase) return;
    const { data } = await supabase.from('gallery_items').select('*').order('created_at', { ascending: false });
    setItems((data as GalleryItem[]) ?? []);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !profile || !file) return;
    setBusy(true);
    setMsg('');
    try {
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const path = `${Date.now()}-${safe}`;
      const { error: upErr } = await supabase.storage.from('gallery').upload(path, file);
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from('gallery').getPublicUrl(path);
      const { error } = await supabase.from('gallery_items').insert({
        image_url: pub.publicUrl,
        category,
        caption: caption || null,
        created_by: profile.id
      });
      if (error) throw error;
      setCaption('');
      setFile(null);
      const el = document.getElementById('gallery-file') as HTMLInputElement | null;
      if (el) el.value = '';
      setMsg('Photo added to the website gallery.');
      await load();
    } catch {
      setMsg('Could not upload. Make sure the "gallery" bucket exists (Public).');
    } finally {
      setBusy(false);
    }
  };

  const del = async (item: GalleryItem) => {
    if (!supabase || !confirm('Remove this photo from the gallery?')) return;
    await supabase.from('gallery_items').delete().eq('id', item.id);
    await load();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
      <div>
        <h3 className="flex items-center gap-2 font-heading text-base font-bold text-primary">
          <Upload size={18} className="text-accent" /> Add Photo to Gallery
        </h3>
        <form onSubmit={add} className="mt-4 space-y-4 border border-slate-200 bg-white p-5 shadow-sm">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="mt-1.5 w-full border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Caption (optional)</span>
            <input value={caption} onChange={(e) => setCaption(e.target.value)}
              className="mt-1.5 w-full border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Photo *</span>
            <input id="gallery-file" type="file" accept="image/*" required onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-1.5 w-full text-sm text-slate-600 file:mr-3 file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:text-white" />
          </label>
          {msg && <p className="text-sm font-medium text-primary">{msg}</p>}
          <button type="submit" disabled={busy} className="btn-accent w-full disabled:opacity-60">
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />} Upload
          </button>
        </form>
        <p className="mt-2 text-xs text-slate-400">Uploaded photos appear on the public Gallery page of the website.</p>
      </div>

      <div>
        <h3 className="flex items-center gap-2 font-heading text-base font-bold text-primary">
          <Images size={18} className="text-accent" /> Gallery Photos ({items.length})
        </h3>
        {loading ? (
          <div className="mt-4 flex items-center gap-2 bg-white p-6 text-slate-500 shadow-sm">
            <Loader2 size={18} className="animate-spin" /> Loading…
          </div>
        ) : items.length === 0 ? (
          <p className="mt-4 bg-white p-6 text-sm text-slate-500 shadow-sm">No photos added from the dashboard yet.</p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {items.map((item) => (
              <div key={item.id} className="group relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img src={item.image_url} alt={item.caption ?? item.category} className="h-full w-full object-cover" />
                <button onClick={() => del(item)}
                  className="absolute top-1 right-1 flex h-7 w-7 items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600">
                  <Trash2 size={13} />
                </button>
                <span className="absolute inset-x-0 bottom-0 bg-primary/80 px-2 py-1 text-[10px] font-semibold text-white">
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
