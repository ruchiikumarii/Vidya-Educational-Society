interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
}

/** Shared banded heading used above every major section. */
export function SectionHeading({ title, subtitle, align = 'center' }: SectionHeadingProps) {
  const isCentered = align === 'center';

  return (
    <div className={isCentered ? 'text-center' : 'text-left'}>
      <h2 className="section-title">{title}</h2>
      <div className={isCentered ? 'section-rule' : 'mt-3 h-1 w-24 bg-accent'} />
      {subtitle && (
        <p
          className={`mt-4 text-sm leading-relaxed text-slate-600 sm:text-base ${
            isCentered ? 'mx-auto max-w-3xl' : 'max-w-3xl'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
