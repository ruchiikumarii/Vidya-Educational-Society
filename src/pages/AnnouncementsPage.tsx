import { useEffect, useState } from 'react';
import { Megaphone, Paperclip, Download, ExternalLink, Pin, Loader2, CalendarDays } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { type Announcement } from '../lib/supabase';
import { fetchPublicAnnouncements, noticeDate, isNew } from '../lib/announcements';

/** Public notice board - every announcement the admin has published to the website. */
export function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicAnnouncements().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <PageHeader
        title="Notices & Announcements"
        subtitle="Admission dates, exam and result notices, holidays and important updates from Vidya Educational Society (NEURON)."
      />

      <section className="bg-bg-alt py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center gap-2 border border-slate-200 bg-white p-12 text-slate-500 shadow-sm">
              <Loader2 size={18} className="animate-spin" /> Loading notices…
            </div>
          ) : items.length === 0 ? (
            <div className="border border-slate-200 bg-white p-12 text-center shadow-sm">
              <Megaphone size={36} className="mx-auto text-slate-300" />
              <p className="mt-4 text-center text-sm text-slate-500">
                No notices at the moment. Please check back later.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((a) => (
                <article
                  key={a.id}
                  className="card-institutional border-l-4 border-l-accent p-5 sm:p-6"
                >
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays size={13} className="text-accent" /> {noticeDate(a.created_at)}
                    </span>
                    {a.pinned && (
                      <span className="inline-flex items-center gap-1 bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                        <Pin size={10} /> Pinned
                      </span>
                    )}
                    {isNew(a.created_at) && (
                      <span className="blink bg-accent px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                        New
                      </span>
                    )}
                  </div>

                  <h2 className="mt-2 font-heading text-lg font-bold text-primary sm:text-xl">{a.title}</h2>

                  {a.body && (
                    <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-slate-600">{a.body}</p>
                  )}

                  {/* Image attachments are shown inline, other files as a download button. */}
                  {a.file_url && a.file_type === 'image' && (
                    <a href={a.file_url} target="_blank" rel="noopener noreferrer" className="mt-4 block">
                      <img
                        src={a.file_url}
                        alt={a.title}
                        className="max-h-[520px] w-full border border-slate-200 object-contain"
                      />
                    </a>
                  )}

                  {(a.file_url || a.link_url) && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {a.file_url && (
                        <a
                          href={a.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={a.file_name ?? undefined}
                          className="btn-primary px-5 py-2.5 text-xs"
                        >
                          {a.file_type === 'image' ? <Download size={15} /> : <Paperclip size={15} />}
                          {a.file_type === 'image' ? 'Download Image' : `Download ${a.file_name ?? 'Attachment'}`}
                        </a>
                      )}
                      {a.link_url && (
                        <a
                          href={a.link_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-accent px-5 py-2.5 text-xs"
                        >
                          <ExternalLink size={15} /> Open Link
                        </a>
                      )}
                    </div>
                  )}

                  <p className="mt-4 text-xs text-slate-400">Posted by {a.author_name}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
