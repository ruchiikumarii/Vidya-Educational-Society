import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BadgeCheck, ArrowRight, ShieldCheck, ExternalLink, ZoomIn, X } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { SectionHeading } from '../components/SectionHeading';
import { CtaStrip } from '../components/CtaStrip';
import { courses, siteInfo } from '../data';

interface AffiliationBody {
  id: string;
  name: string;
  role: string;
  match: string;
  description: string;
  logo: string;
  website: string;
  certificate?: { label: string; image: string; pdf: string };
}

const bodies: AffiliationBody[] = [
  {
    id: 'nios',
    name: 'NIOS, New Delhi',
    role: 'Authorized Study Centre',
    match: 'NIOS',
    description:
      'The National Institute of Open Schooling (NIOS) is an autonomous body under the Ministry of Education, Government of India. As an authorized NIOS study centre, we deliver its recognised certificate courses such as CDEO and CIC.',
    logo: 'https://placehold.co/240x100/0d3b7a/ffffff?text=NIOS+New+Delhi',
    website: 'https://voc.nios.ac.in/'
  },
  {
    id: 'okcl',
    name: 'OKCL, Bhubaneswar',
    role: 'Authorized Learning Centre',
    match: 'OKCL',
    description:
      'Odisha Knowledge Corporation Limited (OKCL) operates under the Department of Electronics & Information Technology, Government of Odisha. Our OKCL courses (OC-CIP, OCOC) are certified by Odisha State Open University (OSOU), Sambalpur, and run in both online and offline mode. OKCL’s OS-CIT is recognised by the Government of Odisha for recruitment eligibility, as per the Odisha Gazette notification.',
    logo: 'https://placehold.co/240x100/0d3b7a/ffffff?text=OKCL+%2F+OSOU',
    website: 'https://okcl.org/',
    certificate: {
      label: 'OS-CIT Government Recognition (Odisha Gazette)',
      image: '/images/certificates/okcl-oscit-gazette.jpg',
      pdf: '/documents/okcl-oscit-gazette-notification.pdf'
    }
  },
  {
    id: 'ipcm',
    name: 'ITCT',
    role: 'Authorized Franchisee Centre',
    match: 'ITCT',
    description:
      'ITCT Learning Systems Pvt. Ltd. is registered under the Ministry of Corporate Affairs, Government of India (Reg. No. U 36940 MH 2004 PTC 146845) and is an ISO certified company. We are its authorized franchisee centre in Keonjhar (Membership No. 1342), offering diploma programmes including PGDCA and DCA.',
    logo: 'https://placehold.co/240x100/0d3b7a/ffffff?text=ITCT',
    website: 'https://www.itctedu.in/',
    certificate: {
      label: 'ITCT Franchisee Certificate',
      image: '/images/certificates/itct-franchisee-certificate.jpg',
      pdf: '/documents/itct-franchisee-certificate.pdf'
    }
  }
];

export function AffiliationsPage() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <>
      <PageHeader
        title="Our Affiliations"
        subtitle="Vidya Educational Society (NEURON) is an authorized centre of NIOS, OKCL and ITCT - so the certificates our students earn carry genuine recognition."
        image="/images/institute-building.jpg"
      />

      {/* Registrations strip */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Recognitions & Approvals"
            subtitle="The government-recognised bodies we are authorized by."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {siteInfo.registrations.map((item) => (
              <div key={item} className="flex items-start gap-3 border border-slate-200 bg-bg-alt p-5">
                <ShieldCheck size={20} className="mt-0.5 shrink-0 text-accent" />
                <span className="text-sm font-semibold text-primary">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Each body + its courses */}
      <section className="bg-bg-alt py-14">
        <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
          {bodies.map((body) => {
            const bodyCourses = courses.filter((course) => course.affiliation.includes(body.match));
            return (
              <article key={body.id} className="grid gap-0 bg-white shadow-sm lg:grid-cols-[300px_1fr]">
                <div className="flex flex-col items-center justify-center gap-4 bg-primary p-8 text-center text-white">
                  <img src={body.logo} alt={body.name} className="w-full max-w-[220px]" />
                  <div>
                    <h3 className="font-heading text-lg font-bold">{body.name}</h3>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-accent">{body.role}</p>
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  <p className="text-sm leading-relaxed text-slate-600">{body.description}</p>

                  {bodyCourses.length > 0 && (
                    <>
                      <h4 className="mt-6 font-heading text-sm font-bold uppercase tracking-wide text-primary">
                        Courses under {body.name}
                      </h4>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {bodyCourses.map((course) => (
                          <Link
                            key={course.id}
                            to={`/courses/${course.slug}`}
                            className="flex items-center gap-1.5 border border-slate-200 bg-bg-alt px-3 py-2 text-xs font-semibold text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white"
                          >
                            <BadgeCheck size={13} className="text-accent" />
                            {course.shortTitle}
                          </Link>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Certificate image */}
                  {body.certificate && (
                    <div className="mt-6">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {body.certificate.label}
                      </p>
                      <button
                        onClick={() => setLightbox(body.certificate!.image)}
                        className="group relative mt-2 block w-full max-w-[380px] overflow-hidden border border-slate-200 bg-white"
                      >
                        <img
                          src={body.certificate.image}
                          alt={body.certificate.label}
                          loading="lazy"
                          className="w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                        <span className="absolute inset-0 flex items-center justify-center bg-primary/0 transition-colors group-hover:bg-primary/25">
                          <span className="flex items-center gap-1.5 bg-white/90 px-3 py-1.5 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                            <ZoomIn size={14} /> Click to view
                          </span>
                        </span>
                      </button>
                    </div>
                  )}

                  <div className="mt-5">
                    <a
                      href={body.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-accent"
                    >
                      <ExternalLink size={15} /> Visit Official Website
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Note */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <SectionHeading title="Admission & Enrolment" />
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Enrolment for NIOS, OKCL and ITCT courses is done through our centre. Visit us with your qualification
            documents and our office will complete your admission and registration with the respective body. For any
            query on eligibility or fees, contact us directly.
          </p>
          <Link to="/contact" className="btn-primary mt-8">
            Contact for Admission <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Lightbox */}
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

      <CtaStrip />
    </>
  );
}
