import { useState } from 'react';
import { ZoomIn, X } from 'lucide-react';
import { SectionHeading } from './SectionHeading';

export const certificates = [
  { label: 'NIOS Affiliation', image: '/images/certificates/nios-affiliation.jpg' },
  { label: 'OKCL Approval Letter', image: '/images/certificates/okcl-approval-letter.jpg' },
  { label: 'OS-CIT Govt. Recognition (Gazette)', image: '/images/certificates/okcl-oscit-gazette.jpg' },
  { label: 'Govt. of Odisha Gazette (E & IT Dept.)', image: '/images/certificates/govt-odisha-gazette.jpg' },
  { label: 'ITCT Franchisee Certificate', image: '/images/certificates/itct-franchisee-certificate.jpg' },
  { label: 'ISO Certificate', image: '/images/certificates/iso-certificate.jpg' },
  { label: 'Govt. Registration', image: '/images/certificates/govt-registration.jpg' },
  { label: 'Udyami (MSME) Registration', image: '/images/certificates/udyami-registration.jpg' }
];

export function Certificates({ tinted = false }: { tinted?: boolean }) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <section className={`${tinted ? 'bg-bg-alt' : 'bg-white'} py-14`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Certificates & Registrations"
          subtitle="Our official affiliations, approvals and registrations. Click any certificate to view it in full."
        />
        <div className="mt-10 overflow-hidden">
          <div className="marquee-track flex w-max gap-6">
            {[...certificates, ...certificates].map((cert, i) => (
              <button
                key={`${cert.label}-${i}`}
                onClick={() => setLightbox(cert.image)}
                className="card-institutional group flex w-64 shrink-0 flex-col overflow-hidden text-left sm:w-72"
              >
                <div className="aspect-[3/4] overflow-hidden bg-slate-100">
                  <img
                    src={cert.image}
                    alt={cert.label}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex items-center gap-2 border-t border-slate-100 px-4 py-3">
                  <ZoomIn size={15} className="shrink-0 text-accent" />
                  <span className="text-sm font-semibold text-primary">{cert.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-slate-400">Hover to pause · click to view full</p>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            aria-label="Close"
            className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center bg-white/15 text-white hover:bg-accent"
          >
            <X size={22} />
          </button>
          <img src={lightbox} alt="Certificate" className="max-h-[88vh] max-w-full object-contain shadow-2xl" />
        </div>
      )}
    </section>
  );
}
