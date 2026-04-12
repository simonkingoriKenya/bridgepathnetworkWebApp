import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { Session, User } from "@supabase/supabase-js";

export type AppUser = {
  id: string;
  email: string;
  name: string;
  role: "job_seeker" | "employer" | "admin";
  avatarUrl?: string;
};

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password: string, name: string, role: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  resetPasswordForEmail: (email: string) => Promise<{ error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  updateRole: (role: string) => void;
  login: (token: string, user: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_KEY = "bridgepath_user_role";
const NAME_KEY = "bridgepath_user_name";

function buildAppUser(user: User, roleOverride?: string, nameOverride?: string): AppUser {
  const meta = user.user_metadata || {};
  const role = roleOverride || meta.role || localStorage.getItem(ROLE_KEY) || "job_seeker";
  const name = nameOverride || meta.full_name || meta.name || user.email?.split("@")[0] || "User";
  return {
    id: user.id,
    email: user.email || "",
    name,
    role: role as AppUser["role"],
    avatarUrl: meta.avatar_url,
  };
}

async function syncProfileToUser(user: User): Promise<AppUser> {
  const { data: prof } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .maybeSingle();
  const role = prof?.role || user.user_metadata?.role || localStorage.getItem(ROLE_KEY) || "job_seeker";
  const name = prof?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User";
  if (prof?.role) localStorage.setItem(ROLE_KEY, prof.role);
  if (prof?.full_name) localStorage.setItem(NAME_KEY, prof.full_name);
  return buildAppUser(user, role, name);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      setSession(session);
      if (session?.user) {
        try {
          setUser(await syncProfileToUser(session.user));
        } catch {
          setUser(buildAppUser(session.user));
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    void init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        try {
          setUser(await syncProfileToUser(session.user));
        } catch {
          setUser(buildAppUser(session.user));
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    if (data.user) {
      try {
        setUser(await syncProfileToUser(data.user));
      } catch {
        setUser(buildAppUser(data.user));
      }
    }
    return {};
  };

  const signUpWithEmail = async (email: string, password: string, name: string, role: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, name, role },
      },
    });
    if (error) return { error: error.message };
    localStorage.setItem(ROLE_KEY, role);
    localStorage.setItem(NAME_KEY, name);
    if (data.user) {
      try {
        await supabase.from("profiles").upsert(
          { id: data.user.id, role, full_name: name },
          { onConflict: "id" },
        );
      } catch {
        /* table may not exist yet, or session not active until email is confirmed */
      }
      setUser(buildAppUser(data.user, role, name));
    }
    return {};
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) return { error: error.message };
    return {};
  };

  const resetPasswordForEmail = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });
    if (error) return { error: error.message };
    return {};
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { error: error.message };
    return {};
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(NAME_KEY);
    setUser(null);
    setSession(null);
    window.location.href = "/auth/login";
  };

  const updateRole = (role: string) => {
    localStorage.setItem(ROLE_KEY, role);
    if (user) setUser({ ...user, role: role as AppUser["role"] });
  };

  const login = (_token: string, backendUser: any) => {
    if (backendUser) {
      localStorage.setItem(ROLE_KEY, backendUser.role || "job_seeker");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!user,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        resetPasswordForEmail,
        updatePassword,
        logout,
        updateRole,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
