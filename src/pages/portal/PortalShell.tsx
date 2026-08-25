import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../lib/auth';

const roleLabel: Record<string, string> = {
  admin: 'Administrator',
  teacher: 'Teacher',
  student: 'Student'
};

export function PortalShell({ children }: { children: ReactNode }) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <section className="min-h-[70vh] bg-bg-alt py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 border-b-2 border-accent bg-white p-5 shadow-sm sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              {profile ? roleLabel[profile.role] : ''} Dashboard
            </p>
            <h1 className="mt-1 font-heading text-xl font-bold text-primary sm:text-2xl">
              Welcome, {profile?.full_name}
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">Login ID: {profile?.login_id}</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 transition-colors hover:border-primary hover:text-primary"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>

        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}
