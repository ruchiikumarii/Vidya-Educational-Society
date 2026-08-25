import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  image?: string;
}

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1600';

/** Blue banner with breadcrumb shown at the top of every inner page. */
export function PageHeader({ title, subtitle, image = DEFAULT_IMAGE }: PageHeaderProps) {
  return (
    <section className="relative bg-primary-dark py-14 sm:py-16">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
      <div className="relative mx-auto max-w-7xl px-4 text-white sm:px-6 lg:px-8">
        <h1 className="font-heading text-2xl font-extrabold uppercase sm:text-3xl lg:text-4xl">{title}</h1>
        <div className="mt-3 h-1 w-20 bg-accent" />
        {subtitle && <p className="mt-4 max-w-3xl text-sm text-slate-200 sm:text-base">{subtitle}</p>}
        <nav className="mt-5 flex items-center gap-1 text-xs text-slate-300">
          <Link to="/" className="hover:text-accent">
            Home
          </Link>
          <ChevronRight size={13} />
          <span className="text-accent">{title}</span>
        </nav>
      </div>
    </section>
  );
}
