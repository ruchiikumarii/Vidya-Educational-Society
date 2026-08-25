import { Link } from 'react-router-dom';
import { Phone, ArrowRight } from 'lucide-react';
import { siteInfo } from '../data';

export function CtaStrip() {
  return (
    <section className="bg-accent py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 text-white sm:px-6 lg:flex-row lg:px-8">
        <div className="text-center lg:text-left">
          <h2 className="font-heading text-xl font-extrabold sm:text-2xl">
            Admission Open - Join a New Batch
          </h2>
          <p className="mt-1 text-sm text-white/90">
            Morning & evening batches available. Visit our Keonjhar centre or call us to enrol today.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={`tel:${siteInfo.contact.phone}`}
            className="inline-flex items-center gap-2 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wide text-accent transition-colors hover:bg-slate-100"
          >
            <Phone size={16} /> {siteInfo.contact.phone}
          </a>
          <Link
            to="/admissions"
            className="inline-flex items-center gap-2 border-2 border-white px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-accent"
          >
            Apply Now <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
