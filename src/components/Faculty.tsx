import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { faculty } from '../data';

export function getInitials(name: string) {
  return name
    .replace(/^(Er\.|Mr\.|Mrs\.|Ms\.|Dr\.)\s*/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function Faculty() {
  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Our Faculty"
          subtitle="Experienced trainers guiding students across NIOS, OKCL and ITCT courses."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {faculty.map((member) => (
            <article key={member.id} className="card-institutional flex items-start gap-4 p-5">
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-14 w-14 shrink-0 object-cover object-top ring-1 ring-slate-200"
                />
              ) : (
                <span className="flex h-14 w-14 shrink-0 items-center justify-center bg-primary font-heading text-lg font-bold text-white">
                  {getInitials(member.name)}
                </span>
              )}
              <div className="min-w-0">
                <h3 className="font-heading text-base font-bold text-primary">{member.name}</h3>
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">{member.role}</p>
                <p className="mt-1 text-xs text-slate-500">{member.qualification}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{member.experience}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/faculty" className="btn-primary">
            View Faculty Details <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
