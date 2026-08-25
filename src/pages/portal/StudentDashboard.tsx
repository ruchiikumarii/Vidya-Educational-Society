import { useEffect, useState } from 'react';
import { FileText, LinkIcon, Download, Loader2, BookOpen } from 'lucide-react';
import { supabase, type Note } from '../../lib/supabase';
import { ChangePassword } from './ChangePassword';
import { PortalTabs } from './features/PortalTabs';
import { Assignments } from './features/Assignments';
import { Announcements } from './features/Announcements';
import { Timetable } from './features/Timetable';

function NotesView() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!supabase) return;
      const { data } = await supabase.from('notes').select('*').order('created_at', { ascending: false });
      setNotes((data as Note[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const openFile = async (note: Note) => {
    if (!supabase || !note.file_path) return;
    const { data } = await supabase.storage.from('notes').createSignedUrl(note.file_path, 3600);
    if (data?.signedUrl) window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div>
      <h3 className="flex items-center gap-2 font-heading text-base font-bold text-primary">
        <BookOpen size={18} className="text-accent" /> Notes & Study Material
      </h3>
      {loading ? (
        <div className="mt-4 flex items-center gap-2 bg-white p-6 text-slate-500 shadow-sm">
          <Loader2 size={18} className="animate-spin" /> Loading…
        </div>
      ) : notes.length === 0 ? (
        <p className="mt-4 bg-white p-6 text-sm text-slate-500 shadow-sm">No notes have been shared yet.</p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <article key={note.id} className="flex flex-col border border-slate-200 bg-white p-5 shadow-sm">
              <h4 className="font-heading text-base font-bold text-primary">{note.title}</h4>
              <p className="mt-1 text-xs text-slate-500">
                By {note.teacher_name} · {new Date(note.created_at).toLocaleDateString('en-IN')}
              </p>
              {note.description && <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{note.description}</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                {note.file_path && (
                  <button onClick={() => openFile(note)} className="btn-primary text-xs">
                    <Download size={14} /> {note.file_name || 'Download File'}
                  </button>
                )}
                {note.link_url && (
                  <a href={note.link_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary transition-colors hover:border-primary">
                    <LinkIcon size={14} /> Open Link
                  </a>
                )}
                {!note.file_path && !note.link_url && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-400"><FileText size={14} /> Text note</span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export function StudentDashboard() {
  const [tab, setTab] = useState('Notes');

  return (
    <div>
      <PortalTabs tabs={['Notes', 'Assignments', 'Announcements', 'Timetable']} active={tab} onChange={setTab} />

      {tab === 'Notes' && <NotesView />}
      {tab === 'Assignments' && <Assignments role="student" />}
      {tab === 'Announcements' && <Announcements role="student" />}
      {tab === 'Timetable' && <Timetable role="student" />}

      <div className="mt-10 max-w-2xl">
        <ChangePassword />
      </div>
    </div>
  );
}
