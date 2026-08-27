import { useEffect, useState } from 'react';
import { Inbox, Trash2, Loader2, Phone, Mail, RefreshCw } from 'lucide-react';
import { supabase, type Enquiry } from '../../../lib/supabase';

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function EnquiriesManager() {
  const [items, setItems] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
    setItems((data as Enquiry[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const del = async (item: Enquiry) => {
    if (!supabase || !confirm('Delete this enquiry?')) return;
    await supabase.from('enquiries').delete().eq('id', item.id);
    await load();
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h3 className="flex items-center gap-2 font-heading text-base font-bold text-primary">
          <Inbox size={18} className="text-accent" /> Website Enquiries ({items.length})
        </h3>
        <button
          onClick={load}
          className="flex items-center gap-1.5 border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-primary hover:text-primary"
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="mt-4 flex items-center gap-2 bg-white p-6 text-slate-500 shadow-sm">
          <Loader2 size={18} className="animate-spin" /> Loading…
        </div>
      ) : items.length === 0 ? (
        <p className="mt-4 bg-white p-6 text-sm text-slate-500 shadow-sm">
          No enquiries yet. Admission enquiries submitted from the website will appear here.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((e) => (
            <div key={e.id} className="border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h4 className="font-heading text-sm font-bold text-primary">
                    {e.name || 'Unknown'}
                    {e.course && (
                      <span className="ml-2 bg-bg-alt px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent">
                        {e.course}
                      </span>
                    )}
                  </h4>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                    {e.mobile && (
                      <a href={`tel:${e.mobile}`} className="flex items-center gap-1 hover:text-primary">
                        <Phone size={12} /> {e.mobile}
                      </a>
                    )}
                    {e.email && (
                      <a href={`mailto:${e.email}`} className="flex items-center gap-1 hover:text-primary">
                        <Mail size={12} /> {e.email}
                      </a>
                    )}
                  </div>
                  {e.message && <p className="mt-2 text-sm leading-relaxed text-slate-600">{e.message}</p>}
                  <p className="mt-2 text-[11px] uppercase tracking-wide text-slate-400">{formatDate(e.created_at)}</p>
                </div>
                <button
                  onClick={() => del(e)}
                  aria-label="Delete enquiry"
                  title="Delete enquiry"
                  className="shrink-0 text-slate-400 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-3 text-xs text-slate-400">
        Every admission enquiry from the Contact and Admissions pages is saved here automatically — nothing is ever lost.
      </p>
    </div>
  );
}
