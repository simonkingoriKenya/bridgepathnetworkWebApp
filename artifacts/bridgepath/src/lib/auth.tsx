import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { absoluteAppUrl } from "./utils";
import type { Session, User } from "@supabase/supabase-js";
import {
  findDemoAccount,
  getStoredDemoUser,
  setStoredDemoUser,
  clearDemoStorage,
} from "./demoAuth";

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
  signInWithPassword: (email: string, password: string) => Promise<{ error?: string; role?: AppUser["role"] }>;
  signUpWithPassword: (
    email: string,
    password: string,
    name: string,
    role: "job_seeker" | "employer",
  ) => Promise<{ error?: string; needsConfirmation?: boolean }>;
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

const confirmationRedirect = () => absoluteAppUrl("auth/callback");

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const demoUser = getStoredDemoUser();
      if (demoUser) {
        if (!cancelled) {
          setUser(demoUser);
          setIsLoading(false);
        }
        return;
      }

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
      // Don't let supabase's session events override an active demo session
      if (getStoredDemoUser()) return;

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

  const signUpWithPassword = async (
    email: string,
    password: string,
    name: string,
    role: "job_seeker" | "employer",
  ) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    localStorage.setItem(ROLE_KEY, role);
    localStorage.setItem(NAME_KEY, cleanName);

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        emailRedirectTo: confirmationRedirect(),
        data: {
          full_name: cleanName,
          name: cleanName,
          role,
        },
      },
    });

    if (error) return { error: error.message };

    if (data.session?.user) {
      const appUser = await syncProfileToUser(data.session.user).catch(() =>
        buildAppUser(data.session!.user, role, cleanName)
      );
      setSession(data.session);
      setUser(appUser);
    }

    return { needsConfirmation: !data.session };
  };

  const signInWithPassword = async (email: string, password: string) => {
    // Demo accounts: bypass Supabase entirely
    const demoUser = findDemoAccount(email, password);
    if (demoUser) {
      setStoredDemoUser(demoUser);
      localStorage.setItem(ROLE_KEY, demoUser.role);
      localStorage.setItem(NAME_KEY, demoUser.name);
      setSession(null);
      setUser(demoUser);
      return { role: demoUser.role };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) return { error: error.message };

    if (data.session?.user) {
      const appUser = await syncProfileToUser(data.session.user).catch(() =>
        buildAppUser(data.session!.user)
      );
      setSession(data.session);
      setUser(appUser);
      return { role: appUser.role };
    }

    return {};
  };

  const logout = async () => {
    const wasDemo = !!getStoredDemoUser();
    clearDemoStorage();
    if (!wasDemo) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(NAME_KEY);
    setUser(null);
    setSession(null);
    window.location.href = absoluteAppUrl("auth/login");
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
        signInWithPassword,
        signUpWithPassword,
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
