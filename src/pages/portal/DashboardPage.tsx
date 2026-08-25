import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { PortalShell } from './PortalShell';
import { AdminDashboard } from './AdminDashboard';
import { TeacherDashboard } from './TeacherDashboard';
import { StudentDashboard } from './StudentDashboard';

export function DashboardPage() {
  const { profile, loading, configured } = useAuth();

  if (!configured) return <Navigate to="/login" replace />;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-2 text-slate-500">
        <Loader2 size={20} className="animate-spin" /> Loading…
      </div>
    );
  }

  if (!profile) return <Navigate to="/login" replace />;

  return (
    <PortalShell>
      {profile.role === 'admin' && <AdminDashboard />}
      {profile.role === 'teacher' && <TeacherDashboard />}
      {profile.role === 'student' && <StudentDashboard />}
    </PortalShell>
  );
}
