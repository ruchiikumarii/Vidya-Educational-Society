import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { CourseCard } from './CourseCard';
import { courses } from '../data';

export function Courses() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Courses Offered"
          subtitle="Diploma, certificate and vocational programmes designed for employment - every course is taught with a minimum of 60% practical lab time."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {courses.slice(0, 8).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/courses" className="btn-primary">
            View All {courses.length} Courses <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
