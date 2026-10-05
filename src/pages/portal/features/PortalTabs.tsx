import { cn } from '../../../lib/utils';

/** A tab is either a plain name, or a name plus the label shown (e.g. "Pending (3)"). */
export type Tab = string | { key: string; label: string };

export function PortalTabs({
  tabs,
  active,
  onChange
}: {
  tabs: Tab[];
  active: string;
  onChange: (t: string) => void;
}) {
  return (
    <div className="mb-6 flex flex-wrap gap-1 border-b border-slate-200">
      {tabs.map((t) => {
        const key = typeof t === 'string' ? t : t.key;
        const label = typeof t === 'string' ? t : t.label;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={cn(
              '-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors',
              active === key
                ? 'border-accent text-primary'
                : 'border-transparent text-slate-500 hover:text-primary'
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
