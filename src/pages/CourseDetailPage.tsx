import { Link, useParams } from 'react-router-dom';
import {
  Clock,
  GraduationCap,
  Wallet,
  Award,
  Briefcase,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Monitor,
  BadgeCheck
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { CourseCard } from '../components/CourseCard';
import { SectionHeading } from '../components/SectionHeading';
import { CtaStrip } from '../components/CtaStrip';
import { courses, siteInfo } from '../data';

export function CourseDetailPage() {
  const { slug } = useParams();
  const course = courses.find((item) => item.slug === slug);

  if (!course) {
    return (
      <>
        <PageHeader title="Course Not Found" />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <p className="text-slate-600">
            The course you are looking for is not available. Please browse our full course list.
          </p>
          <Link to="/courses" className="btn-primary mt-6">
            <ArrowLeft size={16} /> Back to All Courses
          </Link>
        </div>
      </>
    );
  }

  const related = courses.filter((item) => item.id !== course.id && item.category === course.category).slice(0, 4);

  return (
    <>
      <PageHeader title={course.shortTitle} subtitle={course.title} image={course.image} />

      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_330px] lg:px-8">
          {/* Main content */}
          <div>
            <img src={course.image} alt={course.shortTitle} className="h-64 w-full object-cover shadow-sm sm:h-80" />

            <h2 className="mt-8 font-heading text-xl font-bold text-primary sm:text-2xl">Course Overview</h2>
            <div className="mt-2 h-1 w-20 bg-accent" />
            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">{course.summary}</p>

            <h2 className="mt-10 font-heading text-xl font-bold text-primary sm:text-2xl">Syllabus & Modules</h2>
            <div className="mt-2 h-1 w-20 bg-accent" />
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {course.modules.map((module, i) => (
                <li key={module} className="flex items-start gap-3 border border-slate-200 bg-bg-alt p-4 text-sm text-slate-700">
                  <span className="number-font shrink-0 font-bold text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {module}
                </li>
              ))}
            </ul>

            <h2 className="mt-10 font-heading text-xl font-bold text-primary sm:text-2xl">Career Opportunities</h2>
            <div className="mt-2 h-1 w-20 bg-accent" />
            <p className="mt-4 flex items-start gap-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              <Briefcase size={20} className="mt-0.5 shrink-0 text-accent" />
              {course.careerOpportunities}
            </p>

            <h2 className="mt-10 font-heading text-xl font-bold text-primary sm:text-2xl">Certification</h2>
            <div className="mt-2 h-1 w-20 bg-accent" />
            <p className="mt-4 flex items-start gap-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              <Award size={20} className="mt-0.5 shrink-0 text-accent" />
              {course.certification}. On successful completion, the certificate is issued in the name of the
              respective recognised body ({course.affiliation}).
            </p>
          </div>

          {/* Sidebar */}
          <aside className="h-fit space-y-6 lg:sticky lg:top-24">
            <div className="border border-slate-200 bg-bg-alt">
              <h3 className="bg-primary px-5 py-3.5 font-heading text-sm font-bold uppercase tracking-wide text-white">
                Course Details
              </h3>
              <ul className="divide-y divide-slate-200">
                {[
                  { Icon: Clock, label: 'Duration', value: course.duration },
                  { Icon: GraduationCap, label: 'Eligibility', value: course.eligibility },
                  { Icon: Wallet, label: 'Course Fee', value: course.fees },
                  { Icon: Monitor, label: 'Mode', value: course.mode },
                  { Icon: BadgeCheck, label: 'Affiliation', value: course.affiliation },
                  { Icon: Award, label: 'Category', value: course.category }
                ].map(({ Icon, label, value }) => (
                  <li key={label} className="flex gap-3 px-5 py-4">
                    <Icon size={18} className="mt-0.5 shrink-0 text-accent" />
                    <span>
                      <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {label}
                      </span>
                      <span className="block text-sm font-semibold text-primary">{value}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="p-5">
                <Link to="/contact" className="btn-accent w-full text-xs">
                  Apply for Admission <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            <div className="border border-slate-200 p-5">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-primary">
                Included With Every Course
              </h3>
              <ul className="mt-4 space-y-2.5">
                {[
                  'Printed study material & practical file',
                  'Individual computer during lab hours',
                  'Monthly tests & final examination',
                  'Free placement assistance',
                  'Verifiable certificate & mark sheet'
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-primary p-5 text-white">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wide">Need Guidance?</h3>
              <p className="mt-2 text-sm text-slate-200">
                Not sure which course suits you? Call our counsellor for a free discussion.
              </p>
              <a href={`tel:${siteInfo.contact.phone}`} className="mt-4 block font-heading text-lg font-bold text-accent">
                {siteInfo.contact.phone}
              </a>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-bg-alt py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading title="Related Courses" />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <CourseCard key={item.id} course={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaStrip />
    </>
  );
}
