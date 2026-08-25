import { GraduationCap, Clock } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { getInitials } from '../components/Faculty';
import { CtaStrip } from '../components/CtaStrip';
import { faculty } from '../data';

export function FacultyPage() {
  return (
    <>
      <PageHeader
        title="Our Faculty"
        subtitle="Meet the experienced trainers of Vidya Educational Society (NEURON), guiding students across NIOS, OKCL and ITCT courses."
      />

      <section className="bg-bg-alt py-14">
        <div className="mx-auto max-w-6xl space-y-5 px-4 sm:px-6 lg:px-8">
          {faculty.map((member) => (
            <article
              key={member.id}
              className="card-institutional flex items-start gap-5 border-l-4 border-l-accent p-5 sm:gap-6 sm:p-6"
            >
              {/* Compact portrait */}
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-40 w-32 shrink-0 rounded object-cover object-top ring-1 ring-slate-200 sm:h-44 sm:w-36"
                />
              ) : (
                <div className="flex h-40 w-32 shrink-0 items-center justify-center rounded bg-primary font-heading text-3xl font-bold text-white sm:h-44 sm:w-36">
                  {getInitials(member.name)}
                </div>
              )}

              {/* Details fill the remaining width */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h2 className="font-heading text-lg font-bold text-primary">{member.name}</h2>
                  <span className="bg-accent px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary-dark">
                    {member.role}
                  </span>
                </div>

                <div className="mt-2 flex flex-col gap-1.5 text-sm text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <GraduationCap size={15} className="shrink-0 text-accent" />
                    {member.qualification}
                  </span>
                  <span className="flex items-start gap-1.5">
                    <Clock size={15} className="mt-0.5 shrink-0 text-accent" />
                    {member.experience}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {member.subjects.map((subject) => (
                    <span
                      key={subject}
                      className="border border-slate-200 bg-bg-alt px-2 py-0.5 text-xs font-medium text-slate-600"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaStrip />
    </>
  );
}
