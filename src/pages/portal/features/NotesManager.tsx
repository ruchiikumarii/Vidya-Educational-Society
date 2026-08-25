import { useEffect, useState } from 'react';
import { Plus, Trash2, Loader2, FileText, LinkIcon, Download } from 'lucide-react';
import { supabase, type Note } from '../../../lib/supabase';
import { useAuth } from '../../../lib/auth';

export function NotesManager() {
  const { profile } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const loadNotes = async () => {
    if (!supabase || !profile) return;
    const { data } = await supabase
      .from('notes')
      .select('*')
      .eq('teacher_id', profile.id)
      .order('created_at', { ascending: false });
    setNotes((data as Note[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !profile) return;
    setBusy(true);
    setMsg('');
    let filePath: string | null = null;
    let fileName: string | null = null;
    try {
      if (file) {
        const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        filePath = `${profile.id}/${Date.now()}-${safe}`;
        const { error: upErr } = await supabase.storage.from('notes').upload(filePath, file);
        if (upErr) throw upErr;
        fileName = file.name;
      }
      const { error } = await supabase.from('notes').insert({
        teacher_id: profile.id,
        teacher_name: profile.full_name,
        title,
        description: description || null,
        link_url: linkUrl || null,
        file_path: filePath,
        file_name: fileName
      });
      if (error) throw error;
      setTitle('');
      setDescription('');
      setLinkUrl('');
      setFile(null);
      const el = document.getElementById('note-file') as HTMLInputElement | null;
      if (el) el.value = '';
      setMsg('Note added successfully.');
      await loadNotes();
    } catch {
      setMsg('Could not add the note. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (note: Note) => {
    if (!supabase) return;
    if (!confirm('Delete this note?')) return;
    if (note.file_path) await supabase.storage.from('notes').remove([note.file_path]);
    await supabase.from('notes').delete().eq('id', note.id);
    await loadNotes();
  };

  const openFile = async (note: Note) => {
    if (!supabase || !note.file_path) return;
    const { data } = await supabase.storage.from('notes').createSignedUrl(note.file_path, 3600);
    if (data?.signedUrl) window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
      <div>
        <h3 className="flex items-center gap-2 font-heading text-base font-bold text-primary">
          <Plus size={18} className="text-accent" /> Add Note / Material
        </h3>
        <form onSubmit={handleAdd} className="mt-4 space-y-4 border border-slate-200 bg-white p-5 shadow-sm">
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
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Link (optional)</span>
            <input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://…"
              className="mt-1.5 w-full border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">File (PDF / image / doc)</span>
            <input id="note-file" type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-1.5 w-full text-sm text-slate-600 file:mr-3 file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:text-white" />
          </label>
          {msg && <p className="text-sm font-medium text-primary">{msg}</p>}
          <button type="submit" disabled={busy} className="btn-accent w-full disabled:opacity-60">
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            {busy ? 'Saving…' : 'Add Note'}
          </button>
        </form>
      </div>

      <div>
        <h3 className="font-heading text-base font-bold text-primary">My Notes ({notes.length})</h3>
        {loading ? (
          <div className="mt-4 flex items-center gap-2 bg-white p-6 text-slate-500 shadow-sm">
            <Loader2 size={18} className="animate-spin" /> Loading…
          </div>
        ) : notes.length === 0 ? (
          <p className="mt-4 bg-white p-6 text-sm text-slate-500 shadow-sm">You have not added any notes yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="flex items-start justify-between gap-4 border border-slate-200 bg-white p-4 shadow-sm">
                <div className="min-w-0">
                  <h4 className="font-heading text-sm font-bold text-primary">{note.title}</h4>
                  <p className="mt-0.5 text-xs text-slate-500">{new Date(note.created_at).toLocaleDateString('en-IN')}</p>
                  {note.description && <p className="mt-1 text-sm text-slate-600">{note.description}</p>}
                  <div className="mt-2 flex flex-wrap gap-3 text-xs">
                    {note.file_path && (
                      <button onClick={() => openFile(note)} className="inline-flex items-center gap-1 font-semibold text-primary hover:text-accent">
                        <Download size={12} /> {note.file_name}
                      </button>
                    )}
                    {note.link_url && (
                      <a href={note.link_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary hover:text-accent">
                        <LinkIcon size={12} /> Link
                      </a>
                    )}
                    {!note.file_path && !note.link_url && (
                      <span className="inline-flex items-center gap-1 text-slate-400"><FileText size={12} /> Text</span>
                    )}
                  </div>
                </div>
                <button onClick={() => handleDelete(note)} aria-label="Delete" className="shrink-0 text-slate-400 hover:text-red-600">
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
