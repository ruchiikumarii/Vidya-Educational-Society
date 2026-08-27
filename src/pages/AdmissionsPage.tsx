import { useState } from 'react';
import {
  CheckCircle2,
  FileText,
  ExternalLink,
  ClipboardList,
  UserCheck,
  Send,
  CircleDot
} from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { SectionHeading } from '../components/SectionHeading';
import { CtaStrip } from '../components/CtaStrip';
import { sendEnquiry } from '../lib/utils';
import { siteInfo, courses } from '../data';

const processSteps = [
  {
    step: '01',
    title: 'Choose Your Course',
    description: 'Select the course that suits your qualification and career goal from our list of courses.'
  },
  {
    step: '02',
    title: 'Counselling',
    description: 'Visit our centre for counselling on your selected course - batch timing, syllabus, fees and duration.'
  },
  {
    step: '03',
    title: 'Submit Form & Documents',
    description: 'Fill the admission form and submit the required documents along with passport size photographs.'
  },
  {
    step: '04',
    title: 'Fee Payment & Enrolment',
    description: 'Pay the course fee (installments available) and your admission is confirmed with a batch allotment.'
  }
];

const documents = [
  'Original & self-attested photocopy of 10th Board Certificate',
  'Higher qualification certificates (self-attested photocopies)',
  'Aadhaar Card',
  'Caste Certificate (for SC / ST students only)',
  'Passport size photographs - 3 copies'
];

const prospectusLinks = [
  {
    id: 'nios',
    name: 'NIOS',
    body: 'CDEO, CIC',
    url: 'https://voc.nios.ac.in/'
  },
  {
    id: 'okcl',
    name: 'OKCL',
    body: 'OC-CIP, OC-CIP (A), OCOC',
    url: 'https://okcl.org/'
  },
  {
    id: 'ipcm',
    name: 'ITCT',
    body: 'PGDCA, DCA, Tally, CIC',
    url: 'https://www.itctedu.in/'
  }
];

export function AdmissionsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  return (
    <>
      <PageHeader
        title="Admissions"
        subtitle="Admissions are OPEN. Take admission after a short counselling for your selected course - morning and evening batches available."
        image="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1600"
      />

      {/* Status banner */}
      <section className="bg-white pt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-3 border-l-4 border-l-green-600 bg-green-50 px-6 py-4 sm:flex-row">
            <p className="flex items-center gap-2 font-heading text-base font-bold text-green-700">
              <CircleDot size={18} className="blink" /> Admission Status: OPEN
            </p>
            <p className="text-sm text-slate-600">
              New batches every month. Call {siteInfo.contact.phone} or visit our Keonjhar centre.
            </p>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Admission Process"
            subtitle="You can take admission after completing the counselling for your selected course."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((item) => (
              <div key={item.step} className="card-institutional border-t-4 border-t-primary p-6">
                <span className="number-font font-heading text-3xl font-extrabold text-accent">{item.step}</span>
                <h3 className="mt-2 font-heading text-base font-bold text-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents + Form */}
      <section className="bg-bg-alt py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          {/* Required documents */}
          <div>
            <SectionHeading title="Documents Required" align="left" />
            <p className="mt-4 text-sm text-slate-600">
              Please bring the following original documents along with self-attested photocopies at the time of
              admission:
            </p>
            <ul className="mt-6 space-y-3">
              {documents.map((doc) => (
                <li key={doc} className="flex items-start gap-3 bg-white p-4 text-sm text-slate-700 shadow-sm">
                  <FileText size={17} className="mt-0.5 shrink-0 text-accent" />
                  {doc}
                </li>
              ))}
            </ul>
          </div>

          {/* Admission enquiry form */}
          <div>
            <SectionHeading title="Admission Enquiry Form" align="left" />
            {submitted ? (
              <div className="mt-6 border-l-4 border-l-green-600 bg-green-50 p-6">
                <CheckCircle2 size={34} className="text-green-600" />
                <h3 className="mt-3 font-heading text-lg font-bold text-primary">Enquiry Received</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Thank you. Our team will contact you soon. For anything urgent, please call {siteInfo.contact.phone}.
                </p>
              </div>
            ) : (
              <form
                className="mt-6 grid gap-5 bg-white p-6 shadow-sm sm:grid-cols-2 sm:p-8"
                onSubmit={async (event) => {
                  event.preventDefault();
                  const data = new FormData(event.currentTarget);
                  setError('');
                  setBusy(true);
                  const ok = await sendEnquiry('Admission Enquiry - Website', {
                    Name: String(data.get('name') || ''),
                    Mobile: String(data.get('mobile') || ''),
                    Course: String(data.get('course') || 'Not specified'),
                    Message: String(data.get('message') || '')
                  });
                  setBusy(false);
                  if (ok) setSubmitted(true);
                  else setError('Could not send right now. Please call or WhatsApp us instead.');
                }}
              >
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Full Name <span className="text-accent">*</span>
                  </span>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your name"
                    className="mt-1.5 w-full border border-slate-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Mobile Number <span className="text-accent">*</span>
                  </span>
                  <input
                    type="tel"
                    name="mobile"
                    required
                    placeholder="+91 00000 00000"
                    className="mt-1.5 w-full border border-slate-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Course of Interest</span>
                  <select
                    name="course"
                    defaultValue=""
                    className="mt-1.5 w-full border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.shortTitle}>
                        {course.shortTitle}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Message</span>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Any question about eligibility, fees or batch timing"
                    className="mt-1.5 w-full border border-slate-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                  />
                </label>
                {error && (
                  <p className="border-l-4 border-l-red-600 bg-red-50 px-3 py-2 text-sm text-red-700 sm:col-span-2">
                    {error}
                  </p>
                )}
                <button type="submit" disabled={busy} className="btn-accent sm:col-span-2 disabled:opacity-60">
                  {busy ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {busy ? 'Sending…' : 'Submit Admission Enquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Prospectus / official portals */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Prospectus & Official Portals"
            subtitle="For the detailed prospectus and course login, visit the official website of the respective body."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {prospectusLinks.map((item) => (
              <div key={item.id} className="card-institutional flex flex-col items-center p-6 text-center">
                <span className="flex h-14 w-14 items-center justify-center bg-primary text-white">
                  <ClipboardList size={26} />
                </span>
                <h3 className="mt-4 font-heading text-base font-bold text-primary">{item.name}</h3>
                <p className="mt-1 text-xs text-slate-500">{item.body}</p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary mt-5 w-full text-xs"
                >
                  <ExternalLink size={15} /> Visit Official Website
                </a>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-slate-400">
            These links open the official NIOS, OKCL and ITCT websites in a new tab.
          </p>
        </div>
      </section>

      {/* Counselling note */}
      <section className="bg-bg-alt py-14">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <span className="mx-auto flex h-14 w-14 items-center justify-center bg-accent text-white">
            <UserCheck size={26} />
          </span>
          <h2 className="mt-5 font-heading text-xl font-bold text-primary sm:text-2xl">Free Counselling Available</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Not sure which course is right for you? Visit our centre for a free counselling session, and our faculty
            will help you choose the course that best fits your qualification and career goal.
          </p>
        </div>
      </section>

      <CtaStrip />
    </>
  );
}
