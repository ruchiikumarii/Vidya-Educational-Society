import { Link } from 'react-router-dom';
import { Clock, GraduationCap, ArrowRight } from 'lucide-react';
import type { Course } from '../data';

export function CourseCard({ course }: { course: Course }) {
  return (
    <article className="card-institutional group flex flex-col overflow-hidden">
      <div className="relative h-44 overflow-hidden">
        <img
          src={course.image}
          alt={course.shortTitle}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-0 left-0 bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
          {course.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-base leading-snug font-bold text-primary">{course.shortTitle}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
          {course.summary.length > 130 ? `${course.summary.slice(0, 130)}…` : course.summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-slate-100 pt-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Clock size={13} className="text-accent" /> {course.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <GraduationCap size={13} className="text-accent" /> {course.eligibility}
          </span>
          <span className="flex items-center gap-1.5 font-semibold text-primary">{course.fees}</span>
        </div>

        <Link
          to={`/courses/${course.slug}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-accent"
        >
          View Details <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}
