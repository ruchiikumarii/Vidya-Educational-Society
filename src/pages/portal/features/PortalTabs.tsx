import { cn } from '../../../lib/utils';

export function PortalTabs({
  tabs,
  active,
  onChange
}: {
  tabs: string[];
  active: string;
  onChange: (t: string) => void;
}) {
  return (
    <div className="mb-6 flex flex-wrap gap-1 border-b border-slate-200">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={cn(
            '-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors',
            active === t
              ? 'border-accent text-primary'
              : 'border-transparent text-slate-500 hover:text-primary'
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
