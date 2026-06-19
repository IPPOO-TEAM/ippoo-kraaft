import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

const KEY = "ipk:admin:v1";
const LOCKOUT_KEY = "ipk:admin:lockout:v1";

// In a real app, this would be server-side with hashed passwords.
// Demo credentials are intentionally trivial but no longer displayed in the UI.
// Comptes de démo (mock). À remplacer par une vraie auth serveur.
interface DemoCred { user: string; pass: string; role: AdminRole }
const DEMO_CREDS: DemoCred[] = [
  { user: "admin",      pass: "admin",      role: "admin" },
  { user: "moderateur", pass: "moderateur", role: "moderator" },
  { user: "groupement", pass: "groupement", role: "groupement" },
];

const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000; // 5 minutes

export type AdminRole = "admin" | "artisan" | "entreprise" | "moderator" | "groupement";

/** Pages accessibles par chaque rôle dans /admin. "*" = tout autorisé. */
export const ROLE_ZONES: Record<AdminRole, readonly string[]> = {
  admin:      ["*"],
  moderator:  ["/admin", "/admin/avis", "/admin/messages"],
  groupement: ["/admin", "/admin/artisans", "/admin/groupements", "/admin/produits"],
  artisan:    [], // pas d'accès admin
  entreprise: [], // pas d'accès admin
};

export function canAccessAdminPath(role: AdminRole, path: string): boolean {
  const zones = ROLE_ZONES[role];
  if (zones.includes("*")) return true;
  return zones.includes(path);
}

interface AdminSession {
  username: string;
  loggedAt: string;
  expiresAt: string;
  role: AdminRole;
  userId?: string;
}

export interface BridgedUser {
  id: string;
  fullName: string;
  email: string;
  accountType?: "particulier" | "artisan" | "entreprise";
}

interface LockoutState {
  attempts: number;
  lockedUntil: string | null;
}

export type LoginResult = { ok: true } | { ok: false; reason: "credentials" | "locked"; lockedUntil?: string; remaining?: number };

interface Ctx {
  session: AdminSession | null;
  login: (username: string, password: string) => LoginResult;
  loginAsUser: (user: BridgedUser) => void;
  logout: () => void;
  refresh: () => void;
  lockedUntil: Date | null;
  attempts: number;
}

const AdminContext = createContext<Ctx | null>(null);

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

export function AdminProvider({ children }: { children: ReactNode }) {
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

  // Auto-logout when session expires
  useEffect(() => {
    if (!session) return;
    const remaining = new Date(session.expiresAt).getTime() - Date.now();
    if (remaining <= 0) {
      setSession(null);
      localStorage.removeItem(KEY);
      return;
    }
    const t = setTimeout(() => {
      setSession(null);
      localStorage.removeItem(KEY);
    }, remaining);
    return () => clearTimeout(t);
  }, [session]);

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

  const loginAsUser = useCallback((user: BridgedUser) => {
    if (user.accountType !== "artisan" && user.accountType !== "entreprise") return;
    const now = Date.now();
    const s: AdminSession = {
      username: user.email,
      loggedAt: new Date(now).toISOString(),
      expiresAt: new Date(now + SESSION_TTL_MS).toISOString(),
      role: user.accountType,
      userId: user.id,
    };
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
    setSession(s);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(KEY);
    setSession(null);
  }, []);

  // Per role spec: artisans/entreprises must NOT have any access to /admin.
  // The cross-auth bridge is intentionally removed; artisans use /espace-artisan only.

  const refresh = useCallback(() => {
    if (!session) return;
    const next = { ...session, expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
    setSession(next);
  }, [session]);

  const lockedUntil = lockout.lockedUntil && new Date(lockout.lockedUntil).getTime() > Date.now()
    ? new Date(lockout.lockedUntil)
    : null;

  return (
    <AdminContext.Provider value={{ session, login, loginAsUser, logout, refresh, lockedUntil, attempts: lockout.attempts }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
  return ctx;
}

export const ADMIN_SESSION_TTL_MIN = SESSION_TTL_MS / 60000;
export const ADMIN_MAX_ATTEMPTS = MAX_ATTEMPTS;
