import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
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

  async function loadProfile() {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data && isExpired(data as Profile)) {
      await supabase.auth.signOut();
      setProfile(null);
    } else {
      setProfile((data as Profile) ?? null);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadProfile();
    if (!supabase) return;
    const { data: sub } = supabase.auth.onAuthStateChange(() => loadProfile());
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      .single();

    if (!prof) {
      await supabase.auth.signOut();
      return { error: 'No profile found for this account.' };
    }
    if (isExpired(prof as Profile)) {
      await supabase.auth.signOut();
      return { error: 'Your access has expired. Please contact the office.' };
    }
    setProfile(prof as Profile);
    return {};
  };

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
    setProfile(null);
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
