import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { supabase, isSupabaseConfigured, loginIdToEmail, type Profile } from './supabase';

interface AuthState {
  profile: Profile | null;
  loading: boolean;
  configured: boolean;
  signIn: (loginId: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

function isExpired(profile: Profile) {
  if (profile.role !== 'student' || !profile.valid_until) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(profile.valid_until) < today;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  /** User id whose profile is already loaded - stops repeat fetches on token refresh. */
  const loadedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let active = true;

    const applyUser = async (userId: string | null) => {
      if (!supabase || !active) return;

      if (!userId) {
        loadedUserId.current = null;
        setProfile(null);
        setLoading(false);
        return;
      }
      // Token refreshes and tab re-focus fire again for the same user - nothing to redo.
      if (loadedUserId.current === userId) {
        setLoading(false);
        return;
      }

      const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      if (!active) return;

      const prof = (data as Profile) ?? null;
      if (prof && isExpired(prof)) {
        loadedUserId.current = null;
        setProfile(null);
        await supabase.auth.signOut();
      } else {
        loadedUserId.current = prof ? userId : null;
        setProfile(prof);
      }
      setLoading(false);
    };

    supabase.auth.getSession().then(({ data }) => applyUser(data.session?.user.id ?? null));

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      // IMPORTANT: supabase-js holds an internal lock while this callback runs, so
      // awaiting another Supabase call here can dead-lock the client - which showed up
      // as a login that hung until the page was refreshed. Defer the work instead.
      const userId = event === 'SIGNED_OUT' ? null : (session?.user.id ?? null);
      setTimeout(() => {
        applyUser(userId);
      }, 0);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn: AuthState['signIn'] = async (loginId, password) => {
    if (!supabase) return { error: 'Portal is not configured yet.' };
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginIdToEmail(loginId),
      password
    });
    if (error) return { error: 'Invalid Login ID or Password.' };

    const { data: prof } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    if (!prof) {
      loadedUserId.current = null;
      await supabase.auth.signOut();
      return { error: 'No profile found for this account.' };
    }
    if (isExpired(prof as Profile)) {
      loadedUserId.current = null;
      await supabase.auth.signOut();
      return { error: 'Your access has expired. Please contact the office.' };
    }

    // Mark it loaded before the SIGNED_IN event lands, so it does not fetch again.
    loadedUserId.current = data.user.id;
    setProfile(prof as Profile);
    setLoading(false);
    return {};
  };

  const signOut = async () => {
    loadedUserId.current = null;
    setProfile(null);
    if (supabase) await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{ profile, loading, configured: isSupabaseConfigured, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
