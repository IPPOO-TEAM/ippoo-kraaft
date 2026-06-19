/**
 * Provider minimal pour la page de login admin
 * Ne charge que l'authentification, sans tous les autres providers
 */
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

const KEY = "ipk:admin:v1";
const LOCKOUT_KEY = "ipk:admin:lockout:v1";

interface DemoCred { user: string; pass: string; role: AdminRole }
const DEMO_CREDS: DemoCred[] = [
  { user: "admin",      pass: "admin",      role: "admin" },
  { user: "moderateur", pass: "moderateur", role: "moderator" },
  { user: "groupement", pass: "groupement", role: "groupement" },
];

const SESSION_TTL_MS = 30 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000;

export type AdminRole = "admin" | "artisan" | "entreprise" | "moderator" | "groupement";

interface AdminSession {
  username: string;
  loggedAt: string;
  expiresAt: string;
  role: AdminRole;
  userId?: string;
}

interface LockoutState {
  attempts: number;
  lockedUntil: string | null;
}

export type LoginResult = { ok: true } | { ok: false; reason: "credentials" | "locked"; lockedUntil?: string; remaining?: number };

interface Ctx {
  session: AdminSession | null;
  login: (username: string, password: string) => LoginResult;
  logout: () => void;
  lockedUntil: Date | null;
  attempts: number;
}

const MinimalAdminContext = createContext<Ctx | null>(null);

function readLockout(): LockoutState {
  try {
    const raw = localStorage.getItem(LOCKOUT_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { attempts: 0, lockedUntil: null };
}

function writeLockout(state: LockoutState) {
  try { localStorage.setItem(LOCKOUT_KEY, JSON.stringify(state)); } catch {}
}

function isExpired(s: AdminSession): boolean {
  return new Date(s.expiresAt).getTime() <= Date.now();
}

export function MinimalAdminProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [lockout, setLockoutState] = useState<LockoutState>({ attempts: 0, lockedUntil: null });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed: AdminSession = JSON.parse(raw);
        if (parsed.expiresAt && !isExpired(parsed)) {
          setSession(parsed);
        } else {
          localStorage.removeItem(KEY);
        }
      }
    } catch {
      localStorage.removeItem(KEY);
    }
    setLockoutState(readLockout());
  }, []);

  const login = useCallback((username: string, password: string): LoginResult => {
    const current = readLockout();
    if (current.lockedUntil && new Date(current.lockedUntil).getTime() > Date.now()) {
      return { ok: false, reason: "locked", lockedUntil: current.lockedUntil };
    }
    const cred = DEMO_CREDS.find(c => c.user === username && c.pass === password);
    if (cred) {
      const now = Date.now();
      const s: AdminSession = {
        username,
        loggedAt: new Date(now).toISOString(),
        expiresAt: new Date(now + SESSION_TTL_MS).toISOString(),
        role: cred.role,
      };
      try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
      writeLockout({ attempts: 0, lockedUntil: null });
      setLockoutState({ attempts: 0, lockedUntil: null });
      setSession(s);
      return { ok: true };
    }
    const attempts = current.attempts + 1;
    if (attempts >= MAX_ATTEMPTS) {
      const lockedUntil = new Date(Date.now() + LOCKOUT_MS).toISOString();
      const next = { attempts, lockedUntil };
      writeLockout(next);
      setLockoutState(next);
      return { ok: false, reason: "locked", lockedUntil };
    }
    const next = { attempts, lockedUntil: null };
    writeLockout(next);
    setLockoutState(next);
    return { ok: false, reason: "credentials", remaining: MAX_ATTEMPTS - attempts };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(KEY);
    setSession(null);
  }, []);

  const lockedUntil = lockout.lockedUntil && new Date(lockout.lockedUntil).getTime() > Date.now()
    ? new Date(lockout.lockedUntil)
    : null;

  return (
    <MinimalAdminContext.Provider value={{ session, login, logout, lockedUntil, attempts: lockout.attempts }}>
      {children}
    </MinimalAdminContext.Provider>
  );
}

export function useMinimalAdmin() {
  const ctx = useContext(MinimalAdminContext);
  if (!ctx) throw new Error("useMinimalAdmin must be used inside MinimalAdminProvider");
  return ctx;
}
