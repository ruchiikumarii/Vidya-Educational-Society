import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, Paperclip, Image as ImageIcon, ExternalLink, ArrowRight, Pin } from 'lucide-react';
import { type Announcement } from '../lib/supabase';
import { fetchPublicAnnouncements, noticeDate, isNew } from '../lib/announcements';

/**
 * "Latest Notices" board on the Home page - shows the three most recent public
 * announcements posted by the admin. The whole section hides itself when there
 * are none, so the Home page never shows an empty box.
 */
export function NoticeBoard() {
  const [items, setItems] = useState<Announcement[]>([]);

  useEffect(() => {
    fetchPublicAnnouncements(3).then(setItems);
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="bg-bg-alt py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border border-slate-200 bg-white shadow-sm">
          {/* Board header */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-primary px-5 py-3.5">
            <h2 className="flex items-center gap-2.5 font-heading text-base font-bold uppercase tracking-wide text-white sm:text-lg">
              <Megaphone size={20} className="text-accent" />
              Latest Notices
              <span className="blink ml-1 hidden h-2 w-2 rounded-full bg-accent sm:inline-block" />
            </h2>
            <Link
              to="/announcements"
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-accent hover:text-white"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <ul className="divide-y divide-slate-200">
            {items.map((a) => (
              <li key={a.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-start sm:gap-5">
                {/* Date chip */}
                <span className="flex w-fit shrink-0 flex-col items-center border border-slate-200 bg-bg-alt px-3 py-1.5 text-center sm:w-16">
                  <span className="number-font text-lg leading-none font-extrabold text-primary">
                    {new Date(a.created_at).getDate()}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    {new Date(a.created_at).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })}
                  </span>
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="flex flex-wrap items-center gap-2 font-heading text-sm font-bold text-primary sm:text-base">
                    {a.pinned && <Pin size={14} className="shrink-0 text-accent" />}
                    {a.title}
                    {isNew(a.created_at) && (
                      <span className="blink bg-accent px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                        New
                      </span>
                    )}
                  </h3>
                  {a.body && (
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-600">{a.body}</p>
                  )}

                  {(a.file_url || a.link_url) && (
                    <div className="mt-2 flex flex-wrap items-center gap-4">
                      {a.file_url && (
                        <a
                          href={a.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-accent"
                        >
                          {a.file_type === 'image' ? <ImageIcon size={13} /> : <Paperclip size={13} />}
                          {a.file_type === 'image' ? 'View image' : (a.file_name || 'Attachment')}
                        </a>
                      )}
                      {a.link_url && (
                        <a
                          href={a.link_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-accent"
                        >
                          <ExternalLink size={13} /> Open link
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <span className="hidden shrink-0 self-center text-xs text-slate-400 lg:block">
                  {noticeDate(a.created_at)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
