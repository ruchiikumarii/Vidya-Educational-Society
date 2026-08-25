import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { CourseCard } from '../components/CourseCard';
import { CtaStrip } from '../components/CtaStrip';
import { cn } from '../lib/utils';
import { courses, courseCategories } from '../data';

export function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const active = searchParams.get('category') ?? 'All';

  const visible = active === 'All' ? courses : courses.filter((course) => course.category === active);

  const selectCategory = (category: string) => {
    if (category === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  return (
    <>
      <PageHeader
        title="Courses Offered"
        subtitle="Twelve diploma, certificate and vocational programmes - each taught with a minimum of 60% practical lab time and an online-verifiable certificate on completion."
        image="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1600"
      />

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {courseCategories.map((category) => (
              <button
                key={category}
                onClick={() => selectCategory(category)}
                className={cn(
                  'border px-5 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors',
                  active === category
                    ? 'border-primary bg-primary text-white'
                    : 'border-slate-300 text-slate-600 hover:border-primary hover:text-primary'
                )}
              >
                {category}
              </button>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Showing {visible.length} {visible.length === 1 ? 'course' : 'courses'}
            {active !== 'All' && ` in ${active}`}
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {visible.length === 0 && (
            <p className="mt-10 text-center text-sm text-slate-500">
              No courses found in this category. Please select another category.
            </p>
          )}
        </div>
      </section>

      <CtaStrip />
    </>
  );
}
