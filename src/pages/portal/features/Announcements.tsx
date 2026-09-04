import { useEffect, useState } from 'react';
import { Megaphone, Trash2, Plus, Loader2, Paperclip, Globe, Pin, ExternalLink } from 'lucide-react';
import { supabase, type Announcement, type UserRole } from '../../../lib/supabase';
import { useAuth } from '../../../lib/auth';
import { NOTICE_BUCKET, NOTICE_FOLDER } from '../../../lib/announcements';

export function Announcements({ role }: { role: UserRole }) {
  const { profile } = useAuth();
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState<Announcement['audience']>(role === 'teacher' ? 'students' : 'all');
  const [isPublic, setIsPublic] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const canPost = role === 'admin' || role === 'teacher';
  // Only an admin may publish a notice to the public website.
  const canPublish = role === 'admin';

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

  const resetForm = () => {
    setTitle('');
    setBody('');
    setIsPublic(false);
    setPinned(false);
    setLinkUrl('');
    setExpiresAt('');
    setFile(null);
    const el = document.getElementById('announcement-file') as HTMLInputElement | null;
    if (el) el.value = '';
  };

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !profile) return;
    setBusy(true);
    setMsg('');
    try {
      let fileUrl: string | null = null;
      let fileName: string | null = null;
      let fileType: Announcement['file_type'] = null;

      if (file) {
        const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const path = NOTICE_FOLDER + '/' + Date.now() + '-' + safe;
        const { error: upErr } = await supabase.storage.from(NOTICE_BUCKET).upload(path, file);
        if (upErr) throw upErr;
        fileUrl = supabase.storage.from(NOTICE_BUCKET).getPublicUrl(path).data.publicUrl;
        fileName = file.name;
        fileType = file.type.startsWith('image/') ? 'image' : 'file';
      }

      const { error } = await supabase.from('announcements').insert({
        author_id: profile.id,
        author_name: profile.full_name,
        audience: role === 'teacher' ? 'students' : audience,
        title,
        body: body || null,
        is_public: canPublish ? isPublic : false,
        pinned: canPublish ? pinned : false,
        file_url: fileUrl,
        file_name: fileName,
        file_type: fileType,
        link_url: linkUrl.trim() || null,
        expires_at: expiresAt || null
      });
      if (error) throw error;

      setMsg(isPublic ? 'Posted — this notice is now live on the website.' : 'Posted to the portal.');
      resetForm();
      await load();
    } catch {
      setMsg('Could not post. Run SUPABASE_SETUP_PART5.md once, and make sure the "gallery" bucket exists.');
    } finally {
      setBusy(false);
    }
  };

  const del = async (id: string) => {
    if (!supabase || !confirm('Delete this announcement?')) return;
    await supabase.from('announcements').delete().eq('id', id);
    await load();
  };

  const togglePublic = async (a: Announcement) => {
    if (!supabase || !canPublish) return;
    await supabase.from('announcements').update({ is_public: !a.is_public }).eq('id', a.id);
    await load();
  };

  const inputClass =
    'mt-1.5 w-full border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none';
  const labelClass = 'text-xs font-semibold uppercase tracking-wide text-slate-600';

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
      {canPost && (
        <div>
          <h3 className="flex items-center gap-2 font-heading text-base font-bold text-primary">
            <Plus size={18} className="text-accent" /> Post Announcement
          </h3>
          <form onSubmit={add} className="mt-4 space-y-4 border border-slate-200 bg-white p-5 shadow-sm">
            {role === 'admin' && (
              <label className="block">
                <span className={labelClass}>Send to</span>
                <select value={audience} onChange={(e) => setAudience(e.target.value as Announcement['audience'])}
                  className={inputClass + ' bg-white'}>
                  <option value="all">Everyone</option>
                  <option value="students">Students only</option>
                  <option value="teachers">Teachers only</option>
                </select>
              </label>
            )}
            <label className="block">
              <span className={labelClass}>Title *</span>
              <input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Message</span>
              <textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} className={inputClass} />
            </label>

            <label className="block">
              <span className={labelClass}>
                Attachment <span className="font-normal normal-case text-slate-400">(image, PDF or any file)</span>
              </span>
              <input id="announcement-file" type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="mt-1.5 w-full text-sm text-slate-600 file:mr-3 file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:text-white" />
              <span className="mt-1 block text-xs text-slate-400">
                Images are shown on the notice; other files get a download button.
              </span>
            </label>

            <label className="block">
              <span className={labelClass}>
                Link <span className="font-normal normal-case text-slate-400">(optional)</span>
              </span>
              <input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://…" className={inputClass} />
            </label>

            {canPublish && (
              <div className="space-y-3 border border-dashed border-slate-300 bg-bg-alt p-3">
                <label className="flex items-start gap-2.5">
                  <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-accent" />
                  <span className="text-sm font-semibold text-primary">
                    Also show on the website
                    <span className="block text-xs font-normal text-slate-500">
                      Appears on the Home page notice board and the Notices page.
                    </span>
                  </span>
                </label>
                {isPublic && (
                  <>
                    <label className="flex items-center gap-2.5">
                      <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)}
                        className="h-4 w-4 accent-accent" />
                      <span className="text-sm text-slate-700">Pin to the top</span>
                    </label>
                    <label className="block">
                      <span className={labelClass}>Hide after (optional)</span>
                      <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)}
                        className={inputClass} />
                    </label>
                  </>
                )}
              </div>
            )}

            {msg && <p className="text-sm font-medium text-primary">{msg}</p>}
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
                  <div className="min-w-0">
                    <h4 className="flex flex-wrap items-center gap-2 font-heading text-sm font-bold text-primary">
                      {a.pinned && <Pin size={13} className="text-accent" />}
                      {a.title}
                      {a.is_public && (
                        <span className="inline-flex items-center gap-1 bg-green-600 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                          <Globe size={10} /> On website
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {a.author_name} · {new Date(a.created_at).toLocaleDateString('en-IN')}
                      {role === 'admin' && a.audience !== 'all' ? ` · to ${a.audience}` : ''}
                      {a.expires_at ? ` · hides on ${new Date(a.expires_at).toLocaleDateString('en-IN')}` : ''}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    {canPublish && (
                      <button
                        onClick={() => togglePublic(a)}
                        title={a.is_public ? 'Remove from website' : 'Show on website'}
                        className={a.is_public ? 'text-green-600 hover:text-slate-400' : 'text-slate-400 hover:text-green-600'}
                      >
                        <Globe size={15} />
                      </button>
                    )}
                    {(role === 'admin' || a.author_id === profile?.id) && (
                      <button onClick={() => del(a.id)} className="text-slate-400 hover:text-red-600">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
                {a.body && <p className="mt-2 text-sm leading-relaxed text-slate-600">{a.body}</p>}
                {(a.file_url || a.link_url) && (
                  <div className="mt-2 flex flex-wrap items-center gap-4">
                    {a.file_url && (
                      <a href={a.file_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-accent">
                        <Paperclip size={13} /> {a.file_name || 'Attachment'}
                      </a>
                    )}
                    {a.link_url && (
                      <a href={a.link_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-accent">
                        <ExternalLink size={13} /> Link
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
