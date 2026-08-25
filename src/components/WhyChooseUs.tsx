import {
  ShieldCheck,
  Users,
  Monitor,
  Briefcase,
  Wallet,
  Award,
  type LucideIcon
} from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { whyUsPoints } from '../data';

const icons: Record<string, LucideIcon> = {
  ShieldCheck,
  Users,
  Monitor,
  Briefcase,
  Wallet,
  Award
};

export function WhyChooseUs() {
  return (
    <section className="bg-bg-alt py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Why Choose Us"
          subtitle="Six reasons students and parents in Keonjhar have trusted us since 1997."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyUsPoints.map((point) => {
            const Icon = icons[point.icon] ?? Award;
            return (
              <div
                key={point.id}
                className="card-institutional group border-t-4 border-t-primary p-6 transition-colors hover:border-t-accent"
              >
                <span className="flex h-12 w-12 items-center justify-center bg-primary text-white transition-colors group-hover:bg-accent">
                  <Icon size={24} />
                </span>
                <h3 className="mt-4 font-heading text-base font-bold text-primary">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{point.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
