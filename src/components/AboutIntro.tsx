import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { siteInfo } from '../data';

const highlights = [
  'Authorized study centre of NIOS, New Delhi',
  'Authorized OKCL learning centre (Govt. of Odisha)',
  'Approved centre of ITCT for PGDCA & DCA',
  'Courses available in online and offline mode',
  'Affordable fees from ₹3,000 to ₹11,500',
  'Online verifiable certificates and mark sheets'
];

export function AboutIntro() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
        <div className="relative">
          <img
            src="/images/mission-shakti-training.jpg"
            alt="Computer training class in progress at the institute"
            className="w-full object-cover shadow-lg lg:h-[420px]"
          />
          <div className="absolute -right-3 -bottom-6 bg-accent px-6 py-5 text-white shadow-xl sm:right-6">
            <span className="number-font block text-3xl font-extrabold">28+</span>
            <span className="text-xs font-semibold uppercase tracking-wide">Years of Service</span>
          </div>
        </div>

        <div>
          <SectionHeading title="About Us" align="left" />
          <p className="mt-5 text-sm leading-relaxed text-slate-600 sm:text-base">
            <strong className="text-primary">{siteInfo.name} (NEURON)</strong> has been running in Keonjhar, Odisha
            since {siteInfo.established}, providing computer training to students of the region. We were founded on a
            single idea - that students here should have access to quality, recognised computer education close to home.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            We are an authorized study centre of NIOS (New Delhi), an authorized OKCL learning centre under the
            Department of E & IT, Government of Odisha (certified by OSOU, Sambalpur), and an approved centre of ITCT.
            From certificate courses to PGDCA, our programmes are chosen to make students genuinely employable.
          </p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {highlights.map((point) => (
              <li key={point} className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-accent" />
                {point}
              </li>
            ))}
          </ul>

          <Link to="/about" className="btn-primary mt-8">
            Read More About Us <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
