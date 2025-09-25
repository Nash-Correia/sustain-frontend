"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: AuthUser | null;
  signIn: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// LocalStorage Keys
const USERS_KEY = "demo-auth-users";
const SESSION_KEY = "demo-auth-session";

// Very light “hash” (NOT secure; demo only)
const hash = (s: string) => btoa(encodeURIComponent(s));

function readUsers(): Array<AuthUser & { password: string }> {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: Array<AuthUser & { password: string }>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeSession(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else localStorage.removeItem(SESSION_KEY);
  // let other tabs/components know
  window.dispatchEvent(new Event("auth:changed"));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  // hydrate session
  useEffect(() => {
    setUser(readSession());
    const handler = () => setUser(readSession());
    window.addEventListener("auth:changed", handler);
    window.addEventListener("storage", handler); // cross-tab
    return () => {
      window.removeEventListener("auth:changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      async signIn(email, password) {
        const users = readUsers();
        const u = users.find((x) => x.email.toLowerCase() === email.toLowerCase());
        if (!u) return { ok: false as const, error: "No account found for this email." };
        if (u.password !== hash(password)) return { ok: false as const, error: "Invalid credentials." };
        const sessionUser: AuthUser = { id: u.id, name: u.name, email: u.email };
        writeSession(sessionUser);
        setUser(sessionUser);
        return { ok: true as const };
      },
      async signUp(name, email, password) {
        const users = readUsers();
        if (users.some((x) => x.email.toLowerCase() === email.toLowerCase())) {
          return { ok: false as const, error: "Email already exists." };
        }
        const newUser: AuthUser & { password: string } = {
          id: crypto.randomUUID(),
          name: name.trim() || email.split("@")[0],
          email: email.trim(),
          password: hash(password),
        };
        users.push(newUser);
        writeUsers(users);
        const sessionUser: AuthUser = { id: newUser.id, name: newUser.name, email: newUser.email };
        writeSession(sessionUser);
        setUser(sessionUser);
        return { ok: true as const };
      },
      signOut() {
        writeSession(null);
        setUser(null);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
