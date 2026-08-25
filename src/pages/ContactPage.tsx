import { useState } from 'react';
import { MapPin, Phone, Clock, MessageCircle, ChevronDown, CheckCircle2, Send } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { SectionHeading } from '../components/SectionHeading';
import { cn } from '../lib/utils';
import { siteInfo, faqs, courses } from '../data';

export function ContactPage() {
  const [openFaq, setOpenFaq] = useState<string | null>(faqs[0]?.id ?? null);
  const [submitted, setSubmitted] = useState(false);

  const contactDetails = [
    { Icon: MapPin, label: 'Address', value: siteInfo.contact.address },
    {
      Icon: Phone,
      label: 'Phone',
      value: `${siteInfo.contact.phone}, ${siteInfo.contact.altPhone}, ${siteInfo.contact.thirdPhone}`
    },
    { Icon: MessageCircle, label: 'WhatsApp / Email', value: `${siteInfo.contact.whatsapp} · ${siteInfo.contact.email}` },
    { Icon: Clock, label: 'Office Hours', value: siteInfo.contact.hours }
  ];

  return (
    <>
      <PageHeader
        title="Contact Us"
        subtitle="Visit our head office, call us, or send an admission enquiry - we respond to every enquiry within one working day."
        image="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&q=80&w=1600"
      />

      {/* Contact cards */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {contactDetails.map(({ Icon, label, value }) => (
              <div key={label} className="card-institutional border-t-4 border-t-primary p-6 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center bg-accent text-white">
                  <Icon size={22} />
                </span>
                <h3 className="mt-4 font-heading text-sm font-bold uppercase tracking-wide text-primary">{label}</h3>
                <p className="mt-2 text-sm leading-relaxed break-words text-slate-600">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry form + map */}
      <section className="bg-bg-alt py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeading title="Admission Enquiry" align="left" />

            {submitted ? (
              <div className="mt-6 border-l-4 border-l-green-600 bg-green-50 p-6">
                <CheckCircle2 size={34} className="text-green-600" />
                <h3 className="mt-3 font-heading text-lg font-bold text-primary">Enquiry Submitted</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Thank you. Our counsellor will call you within one working day. For anything urgent, please call{' '}
                  {siteInfo.contact.phone}.
                </p>
              </div>
            ) : (
              <form
                className="mt-6 grid gap-5 bg-white p-6 shadow-sm sm:grid-cols-2 sm:p-8"
                onSubmit={(event) => {
                  event.preventDefault();
                  setSubmitted(true);
                }}
              >
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Full Name <span className="text-accent">*</span>
                  </span>
                  <input
                    type="text"
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
                    required
                    placeholder="+91 00000 00000"
                    className="mt-1.5 w-full border border-slate-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Email Address</span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="mt-1.5 w-full border border-slate-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Course of Interest
                  </span>
                  <select
                    defaultValue=""
                    className="mt-1.5 w-full border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.slug}>
                        {course.shortTitle}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Your Message</span>
                  <textarea
                    rows={4}
                    placeholder="Tell us what you would like to know about the course, fees or batch timings"
                    className="mt-1.5 w-full border border-slate-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                  />
                </label>

                <button type="submit" className="btn-accent sm:col-span-2">
                  <Send size={16} /> Send Enquiry
                </button>
              </form>
            )}
          </div>

          <div>
            <SectionHeading title="Find Us" align="left" />
            <div className="mt-6 h-[300px] bg-white shadow-sm sm:h-[380px]">
              <iframe
                title="Institute location map - Keonjhar, Odisha"
                src="https://www.openstreetmap.org/export/embed.html?bbox=85.55%2C21.60%2C85.62%2C21.66&layer=mapnik&marker=21.6288%2C85.5817"
                className="h-full w-full border-0"
                loading="lazy"
              />
            </div>
            <div className="mt-6 bg-primary p-6 text-white">
              <h3 className="font-heading text-base font-bold">Visit Our Head Office</h3>
              <p className="mt-2 text-sm text-slate-200">{siteInfo.contact.address}</p>
              <p className="mt-3 text-sm text-slate-200">
                Open {siteInfo.contact.hours}. Walk in during office hours - no appointment needed. Bring your last mark
                sheet if you want to discuss eligibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Frequently Asked Questions"
            subtitle="Answers to what students and parents ask us most often about admission, fees, certificates and placement."
          />

          <div className="mt-8 divide-y divide-slate-200 border border-slate-200">
            {faqs.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div key={faq.id}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-bg-alt"
                  >
                    <span className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-accent">{faq.category}</span>
                      <span className="mt-0.5 font-heading text-sm font-bold text-primary">{faq.question}</span>
                    </span>
                    <ChevronDown
                      size={19}
                      className={cn('shrink-0 text-slate-400 transition-transform', isOpen && 'rotate-180')}
                    />
                  </button>
                  {isOpen && (
                    <p className="border-t border-slate-100 bg-bg-alt px-5 py-4 text-sm leading-relaxed text-slate-600">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
