import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Megaphone } from 'lucide-react';
import { type Announcement } from '../lib/supabase';
import { fetchPublicAnnouncements } from '../lib/announcements';

/** A notice scrolls in the ticker for this long after it is posted. */
const TICKER_WINDOW_HOURS = 24;

/**
 * Scrolling notice strip that sits directly under the header on every page.
 * It carries only the notices posted in the last 24 hours, and hides itself
 * completely when there are none - older notices stay on the /announcements page.
 */
export function NoticeTicker() {
  const [items, setItems] = useState<Announcement[]>([]);

  useEffect(() => {
    fetchPublicAnnouncements().then((all) => {
      const cutoff = Date.now() - TICKER_WINDOW_HOURS * 60 * 60 * 1000;
      setItems(all.filter((a) => new Date(a.created_at).getTime() >= cutoff));
    });
  }, []);

  if (items.length === 0) return null;

  // The track is rendered twice so the loop joins up seamlessly at -50%.
  const line = (key: string) => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden={key === 'b'}>
      {items.map((a) => (
        <Link
          key={`${key}-${a.id}`}
          to="/announcements"
          className="flex items-center gap-2.5 px-6 text-sm text-white hover:text-accent"
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          <span className="font-semibold whitespace-nowrap">{a.title}</span>
          {a.body && (
            <span className="whitespace-nowrap text-white/70">
              — {a.body.length > 90 ? `${a.body.slice(0, 90)}…` : a.body}
            </span>
          )}
        </Link>
      ))}
    </div>
  );

  return (
    <div className="flex items-stretch overflow-hidden bg-primary-dark">
      <span className="z-10 flex shrink-0 items-center gap-2 bg-accent px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
        <Megaphone size={15} />
        <span className="hidden sm:inline">Latest Notice</span>
        <span className="sm:hidden">Notice</span>
      </span>
      <div className="relative flex-1 overflow-hidden py-2">
        <div className="ticker-track flex w-max">
          {line('a')}
          {line('b')}
        </div>
      </div>
    </div>
  );
}
