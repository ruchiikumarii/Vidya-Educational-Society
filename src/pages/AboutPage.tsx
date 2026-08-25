import { CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { SectionHeading } from '../components/SectionHeading';
import { Stats } from '../components/Stats';
import { DirectorMessage } from '../components/DirectorMessage';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { CtaStrip } from '../components/CtaStrip';
import { siteInfo, instituteVideo } from '../data';

const milestones = [
  { year: '1997', text: 'Vidya Educational Society (NEURON) founded in Keonjhar to bring computer education to the region.' },
  { year: 'NIOS', text: 'Became an authorized study centre of NIOS, New Delhi for certificate courses like CDEO and CIC.' },
  { year: 'OKCL', text: 'Became an authorized OKCL learning centre under the Dept. of E & IT, Govt. of Odisha.' },
  { year: 'ITCT', text: 'Approved as an ITCT centre for diploma courses including PGDCA and DCA.' },
  { year: 'Online', text: 'Started offering OKCL skill courses in both online and offline mode.' },
  { year: 'Today', text: 'A trusted, established computer training institute serving Keonjhar for nearly three decades.' }
];

const infrastructure = [
  'Computer lab with individual practice machines',
  'Licensed software including Tally Prime, CorelDRAW and MS Office',
  'Programming and DTP practice setup (C, C++, Photoshop, PageMaker)',
  'Internet-enabled systems for OKCL online courses',
  'Morning and evening batches from 7:00 AM to 7:30 PM',
  'Both online and offline learning options',
  'Study material and previous question papers',
  'Experienced trainers for every course'
];

export function AboutPage() {
  return (
    <>
      <PageHeader
        title="About Us"
        subtitle={`${siteInfo.name} (NEURON) - an authorized NIOS, OKCL and ITCT computer training institute in Keonjhar, running successfully since ${siteInfo.established}.`}
      />

      {/* Introduction */}
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeading title="Who We Are" align="left" />
            <p className="mt-5 text-sm leading-relaxed text-slate-600 sm:text-base">
              {siteInfo.name} (NEURON) has been conducting computer training in Keonjhar, Odisha since{' '}
              {siteInfo.established}. We were started with a straightforward objective - to make quality, recognised
              computer education accessible and affordable for students of our region.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              We are an authorized study centre of NIOS (New Delhi), an authorized OKCL learning centre under the
              Department of E & IT, Government of Odisha - certified by Odisha State Open University, Sambalpur - and an
              approved centre of ITCT (Ministry of Corporate Affairs). Our courses span certificate, diploma, skill,
              accounting and programming streams.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              Our courses are available in both online and offline mode, with flexible morning and evening batches so
              that students, working people and homemakers can all learn at a time that suits them.
            </p>
          </div>
          <img
            src="/images/institute-building.jpg"
            alt="Vidya Educational Society building, Keonjhar"
            className="w-full object-cover shadow-lg lg:h-[440px]"
          />
        </div>
      </section>

      <Stats />

      {/* Institute video */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Take a Look at Our Institute" />
          <div className="mt-8 overflow-hidden bg-black shadow-lg">
            <video
              className="h-full w-full"
              controls
              preload="none"
              poster={instituteVideo.poster}
            >
              <source src={instituteVideo.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      <DirectorMessage />

      {/* Journey */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Our Journey" subtitle="From a single computer classroom in 1997 to a recognised NIOS, OKCL and ITCT training centre." />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {milestones.map((item) => (
              <div key={item.year} className="card-institutional border-l-4 border-l-primary p-6">
                <span className="number-font text-2xl font-extrabold text-accent">{item.year}</span>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="bg-bg-alt py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <img
            src="/images/classroom.jpg"
            alt="Classroom with projector at the institute"
            className="w-full object-cover shadow-lg lg:h-[400px]"
          />
          <div>
            <SectionHeading title="Our Infrastructure" align="left" />
            <ul className="mt-6 grid gap-3">
              {infrastructure.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <CtaStrip />
    </>
  );
}
