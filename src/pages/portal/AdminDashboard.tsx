import { useEffect, useState } from 'react';
import { UserPlus, Trash2, Loader2, Users, Save, KeyRound } from 'lucide-react';
import { supabase, type Profile, type UserRole } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { PortalTabs } from './features/PortalTabs';
import { NotesManager } from './features/NotesManager';
import { Assignments } from './features/Assignments';
import { Announcements } from './features/Announcements';
import { Timetable } from './features/Timetable';
import { GalleryManager } from './features/GalleryManager';
import { FeesManager } from './features/FeesManager';
import { SuccessStoriesManager } from './features/SuccessStoriesManager';
import { EnquiriesManager } from './features/EnquiriesManager';

function UsersManager() {
  const { profile: me } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [validUntil, setValidUntil] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const loadUsers = async () => {
    if (!supabase) return;
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setUsers((data as Profile[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Auto-generate the next Login ID whenever the role changes or the user list updates.
  const rolePrefix: Record<UserRole, string> = { student: 'VES', teacher: 'VEST', admin: 'VEA' };

  const nextLoginId = (r: UserRole, list: Profile[]) => {
    const prefix = rolePrefix[r];
    const re = new RegExp(`^${prefix}(\\d+)$`, 'i');
    let max = 0;
    for (const u of list) {
      const m = u.login_id.match(re);
      if (m) max = Math.max(max, parseInt(m[1], 10));
    }
    return `${prefix}${String(max + 1).padStart(3, '0')}`;
  };

  useEffect(() => {
    setLoginId(nextLoginId(role, users));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, users]);

  // Default password = FirstName@LoginID  (e.g. Ankit@VES001)
  const defaultPassword = (name: string, id: string) => {
    const first = name.trim().split(/\s+/)[0] || 'user';
    return `${first}@${id}`;
  };

  // Auto-fill the password as the admin types the name / picks the role.
  useEffect(() => {
    setPassword(fullName.trim() ? defaultPassword(fullName, loginId) : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullName, loginId]);

  const callAdmin = (body: Record<string, unknown>) =>
    supabase!.functions.invoke('admin-users', { body });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setMsg(null);
    const { data, error } = await callAdmin({
      action: 'create',
      full_name: fullName,
      login_id: loginId,
      password,
      role,
      valid_until: role === 'student' && validUntil ? validUntil : null
    });
    setBusy(false);
    if (error || (data && (data as { error?: string }).error)) {
      setMsg({ type: 'err', text: (data as { error?: string })?.error || 'Could not create user.' });
    } else {
      setMsg({ type: 'ok', text: `${role} "${loginId}" created successfully.` });
      setFullName('');
      setLoginId('');
      setPassword('');
      setValidUntil('');
      await loadUsers();
    }
  };

  const handleDelete = async (u: Profile) => {
    if (!supabase) return;
    if (!confirm(`Delete ${u.full_name} (${u.login_id})?`)) return;
    await callAdmin({ action: 'delete', id: u.id });
    await loadUsers();
  };

  const handleValidity = async (u: Profile, value: string) => {
    if (!supabase) return;
    await callAdmin({ action: 'update_validity', id: u.id, valid_until: value || null });
    await loadUsers();
  };

  const handleRole = async (u: Profile, role: UserRole) => {
    if (!supabase) return;
    await supabase.from('profiles').update({ role }).eq('id', u.id);
    await loadUsers();
  };

  const handleResetPassword = async (u: Profile) => {
    if (!supabase) return;
    const suggested = defaultPassword(u.full_name, u.login_id);
    const newPass = window.prompt(
      `Set a new password for ${u.full_name} (${u.login_id}):`,
      suggested
    );
    if (!newPass) return;
    if (newPass.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }
    const { data, error } = await callAdmin({ action: 'reset_password', id: u.id, password: newPass });
    if (error || (data && (data as { error?: string }).error)) {
      alert('Could not change password. Please try again.');
    } else {
      alert(`Password for ${u.login_id} is now:\n\n${newPass}\n\nPlease share it with the user.`);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      {/* Create user */}
      <div>
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-primary">
          <UserPlus size={20} className="text-accent" /> Create Login
        </h2>
        <form onSubmit={handleCreate} className="mt-4 space-y-4 border border-slate-200 bg-white p-5 shadow-sm">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Select Role *</span>
            <select value={role} onChange={(e) => setRole(e.target.value as UserRole)}
              className="mt-1.5 w-full border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none">
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Login ID * <span className="font-normal normal-case text-slate-400">(auto-generated)</span>
            </span>
            <input required value={loginId} onChange={(e) => setLoginId(e.target.value)}
              className="mt-1.5 w-full border border-slate-300 bg-bg-alt px-3 py-2 text-sm font-semibold text-primary focus:border-primary focus:outline-none" />
            <span className="mt-1 block text-xs text-slate-400">
              Teacher IDs start with VEST, Student IDs with VES. You can edit if needed.
            </span>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Full Name *</span>
            <input required value={fullName} onChange={(e) => setFullName(e.target.value)}
              className="mt-1.5 w-full border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Password * <span className="font-normal normal-case text-slate-400">(auto: FirstName@ID)</span>
            </span>
            <input required value={password} onChange={(e) => setPassword(e.target.value)} minLength={6}
              className="mt-1.5 w-full border border-slate-300 bg-bg-alt px-3 py-2 text-sm font-semibold text-primary focus:border-primary focus:outline-none" />
            <span className="mt-1 block text-xs text-slate-400">
              Note this password and share it with the user. They can change it later from their dashboard.
            </span>
          </label>
          {role === 'student' && (
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Valid Until (expiry) — leave blank for no expiry
              </span>
              <input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)}
                className="mt-1.5 w-full border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </label>
          )}
          {msg && (
            <p className={`border-l-4 px-3 py-2 text-sm ${msg.type === 'ok' ? 'border-l-green-600 bg-green-50 text-green-700' : 'border-l-red-600 bg-red-50 text-red-700'}`}>
              {msg.text}
            </p>
          )}
          <button type="submit" disabled={busy} className="btn-accent w-full disabled:opacity-60">
            {busy ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
            {busy ? 'Creating…' : 'Create Login'}
          </button>
        </form>
      </div>

      {/* Users list */}
      <div>
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-primary">
          <Users size={20} className="text-accent" /> All Users ({users.length})
        </h2>
        {loading ? (
          <div className="mt-4 flex items-center gap-2 bg-white p-6 text-slate-500 shadow-sm">
            <Loader2 size={18} className="animate-spin" /> Loading…
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto bg-white shadow-sm">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="bg-primary text-left text-xs uppercase tracking-wide text-white">
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Login ID</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Valid Until</th>
                  <th className="px-4 py-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-200 last:border-b-0">
                    <td className="px-4 py-3 font-semibold text-primary">{u.full_name}</td>
                    <td className="px-4 py-3 text-slate-600">{u.login_id}</td>
                    <td className="px-4 py-3">
                      {me?.id === u.id ? (
                        <span className="bg-bg-alt px-2 py-0.5 text-xs font-semibold uppercase text-slate-600">
                          {u.role} (you)
                        </span>
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) => handleRole(u, e.target.value as UserRole)}
                          className="border border-slate-300 bg-white px-2 py-1 text-xs font-semibold uppercase text-slate-700 focus:border-primary focus:outline-none"
                        >
                          <option value="student">student</option>
                          <option value="teacher">teacher</option>
                          <option value="admin">admin</option>
                        </select>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {u.role === 'student' ? (
                        <span className="flex items-center gap-1.5">
                          <input
                            type="date"
                            defaultValue={u.valid_until ?? ''}
                            onBlur={(e) => {
                              if ((e.target.value || '') !== (u.valid_until ?? '')) handleValidity(u, e.target.value);
                            }}
                            className="border border-slate-300 px-2 py-1 text-xs focus:border-primary focus:outline-none"
                          />
                          <Save size={13} className="text-slate-300" />
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleResetPassword(u)}
                          aria-label="Reset password"
                          title="Reset password (if user forgot it)"
                          className="text-slate-400 hover:text-primary"
                        >
                          <KeyRound size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(u)}
                          aria-label="Delete"
                          title="Delete user"
                          className="text-slate-400 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-3 text-xs text-slate-400">
          Tip: change a student’s “Valid Until” date and click outside the box to save — after that date the student cannot log in.
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Forgot password? Click the <KeyRound size={11} className="inline text-slate-500" /> key icon to set a new password for any user.
        </p>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const [tab, setTab] = useState('Enquiries');

  return (
    <div>
      <PortalTabs
        tabs={['Enquiries', 'Users', 'Fees', 'Notes', 'Assignments', 'Announcements', 'Timetable', 'Gallery', 'Success Stories']}
        active={tab}
        onChange={setTab}
      />

      {tab === 'Enquiries' && <EnquiriesManager />}
      {tab === 'Users' && <UsersManager />}
      {tab === 'Fees' && <FeesManager />}
      {tab === 'Notes' && <NotesManager />}
      {tab === 'Assignments' && <Assignments role="admin" />}
      {tab === 'Announcements' && <Announcements role="admin" />}
      {tab === 'Timetable' && <Timetable role="admin" />}
      {tab === 'Gallery' && <GalleryManager />}
      {tab === 'Success Stories' && <SuccessStoriesManager />}
    </div>
  );
}
