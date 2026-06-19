import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const USER_KEY = "ipk:user:v1";
const USERS_KEY = "ipk:users:v1";

export type Sex = "homme" | "femme" | "autre";
export type AccountType = "particulier" | "artisan" | "entreprise";
export type AuthProvider = "email" | "google";

export interface User {
  id: string;
  fullName: string;
  dateOfBirth?: string;
  sex?: Sex;
  phone?: string;
  email: string;
  address?: string;
  countryCode?: string;
  nationality?: string;
  accountType?: AccountType;
  provider: AuthProvider;
  profileComplete: boolean;
  emailVerified: boolean;
  idDoc?: string;
  profilePhoto?: string;
  activityProof?: string;
  cguAccepted: boolean;
  niches?: string[];
  createdAt: string;
}

const TOKENS_KEY = "ipk:authTokens:v1";
type TokenKind = "verify" | "reset";
interface AuthToken { code: string; email: string; kind: TokenKind; expiresAt: number; }
function loadTokens(): AuthToken[] {
  try { return JSON.parse(localStorage.getItem(TOKENS_KEY) || "[]"); } catch { return []; }
}
function saveTokens(t: AuthToken[]) { try { localStorage.setItem(TOKENS_KEY, JSON.stringify(t)); } catch {} }
function generateCode(): string { return Math.floor(100000 + Math.random() * 900000).toString(); }

interface StoredUser extends User {
  passwordHash?: string;
}

export interface SignupPayload {
  fullName: string;
  dateOfBirth: string;
  sex: Sex;
  phone: string;
  email: string;
  address: string;
  countryCode: string;
  nationality: string;
  accountType: AccountType;
  password: string;
  idDoc?: string;
  profilePhoto?: string;
  activityProof?: string;
  cguAccepted: boolean;
  niches?: string[];
}

interface UserContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (payload: SignupPayload) => Promise<{ ok: boolean; error?: string }>;
  signupWithGoogle: () => Promise<{ ok: boolean; needsCompletion: boolean }>;
  completeProfile: (patch: Partial<SignupPayload>) => Promise<{ ok: boolean; error?: string }>;
  updateProfile: (patch: Partial<User>) => void;
  logout: () => void;
  requestEmailVerification: () => { ok: boolean; code?: string; error?: string };
  confirmEmailVerification: (code: string) => { ok: boolean; error?: string };
  requestPasswordReset: (email: string) => { ok: boolean; code?: string; error?: string };
  confirmPasswordReset: (email: string, code: string, newPassword: string) => Promise<{ ok: boolean; error?: string }>;
}

const UserContext = createContext<UserContextValue | null>(null);

// PBKDF2-SHA256 via WebCrypto. Stored format: "pbkdf2$<iter>$<saltHex>$<hashHex>".
// Legacy "h_<base36>" entries from the old trivial hash are migrated on next successful login.
const PBKDF2_ITERATIONS = 100_000;
const PBKDF2_HASH = "SHA-256";
const PBKDF2_KEY_LEN = 32; // bytes

function bytesToHex(buf: ArrayBuffer | Uint8Array): string {
  const arr = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = ""; for (let i = 0; i < arr.length; i++) s += arr[i].toString(16).padStart(2, "0");
  return s;
}
function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
  return out;
}
function randomSaltHex(byteLen = 16): string {
  const b = new Uint8Array(byteLen);
  crypto.getRandomValues(b);
  return bytesToHex(b);
}
async function pbkdf2(password: string, saltBytes: Uint8Array, iter: number): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: saltBytes, iterations: iter, hash: PBKDF2_HASH },
    key,
    PBKDF2_KEY_LEN * 8,
  );
  return bytesToHex(bits);
}
async function hashPassword(password: string): Promise<string> {
  const saltHex = randomSaltHex(16);
  const hex = await pbkdf2(password, hexToBytes(saltHex), PBKDF2_ITERATIONS);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${saltHex}$${hex}`;
}
/** Compare en temps constant — protège contre les attaques de timing simples. */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
/** Vérifie un mdp contre un hash stocké (PBKDF2 ou legacy h_xxx). */
async function verifyPassword(password: string, stored: string | undefined): Promise<boolean> {
  if (!stored) return false;
  if (stored.startsWith("pbkdf2$")) {
    const [, iterStr, saltHex, expected] = stored.split("$");
    const iter = parseInt(iterStr, 10) || PBKDF2_ITERATIONS;
    const computed = await pbkdf2(password, hexToBytes(saltHex), iter);
    return constantTimeEqual(computed, expected);
  }
  // Legacy fallback (sera migré après succès)
  if (stored.startsWith("h_")) {
    let h = 0;
    for (let i = 0; i < password.length; i++) h = ((h << 5) - h + password.charCodeAt(i)) | 0;
    return stored === `h_${(h >>> 0).toString(36)}`;
  }
  return false;
}

function loadCurrent(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const u = JSON.parse(raw);
    if (typeof u.emailVerified !== "boolean") u.emailVerified = false;
    return u;
  } catch { return null; }
}
function saveCurrent(u: User | null) {
  try { u ? localStorage.setItem(USER_KEY, JSON.stringify(u)) : localStorage.removeItem(USER_KEY); } catch {}
}
function loadUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; }
}
function saveUsers(list: StoredUser[]) {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(list)); } catch {}
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadCurrent);

  useEffect(() => {
    saveCurrent(user);
    if (typeof window !== "undefined") {
      const detail = user ? { id: user.id, fullName: user.fullName, email: user.email, accountType: user.accountType } : null;
      window.dispatchEvent(new CustomEvent("ipk:user:auth", { detail }));
    }
  }, [user]);

  const login = useCallback(async (email: string, password: string) => {
    const users = loadUsers();
    const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) return { ok: false, error: "Aucun compte trouvé avec cet e-mail." };
    if (found.provider === "google" && !found.passwordHash) return { ok: false, error: "Ce compte utilise la connexion Google." };
    const ok = await verifyPassword(password, found.passwordHash);
    if (!ok) return { ok: false, error: "Mot de passe incorrect." };
    // Migration paresseuse depuis le hash legacy h_xxx → PBKDF2
    if (found.passwordHash && found.passwordHash.startsWith("h_")) {
      const upgraded = await hashPassword(password);
      const all = loadUsers();
      const idx = all.findIndex(u => u.id === found.id);
      if (idx >= 0) { all[idx] = { ...all[idx], passwordHash: upgraded }; saveUsers(all); }
    }
    const { passwordHash: _ph, ...publicUser } = found;
    setUser(publicUser);
    return { ok: true };
  }, []);

  const signup = useCallback(async (payload: SignupPayload) => {
    const users = loadUsers();
    if (users.some(u => u.email.toLowerCase() === payload.email.trim().toLowerCase())) {
      return { ok: false, error: "Un compte existe déjà avec cet e-mail." };
    }
    if (!payload.cguAccepted) return { ok: false, error: "Vous devez accepter les CGU." };
    const newUser: StoredUser = {
      id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      fullName: payload.fullName,
      dateOfBirth: payload.dateOfBirth,
      sex: payload.sex,
      phone: payload.phone,
      email: payload.email.trim(),
      address: payload.address,
      countryCode: payload.countryCode,
      nationality: payload.nationality,
      accountType: payload.accountType,
      provider: "email",
      profileComplete: true,
      emailVerified: false,
      idDoc: payload.idDoc,
      profilePhoto: payload.profilePhoto,
      activityProof: payload.activityProof,
      cguAccepted: true,
      niches: payload.niches,
      createdAt: new Date().toISOString(),
      passwordHash: await hashPassword(payload.password),
    };
    saveUsers([...users, newUser]);
    const { passwordHash: _ph, ...publicUser } = newUser;
    setUser(publicUser);
    return { ok: true };
  }, []);

  const signupWithGoogle = useCallback(async () => {
    // Mock OAuth — generates a partial profile
    const mockEmail = `user.google${Math.floor(Math.random() * 1000)}@gmail.com`;
    const mockName = "Utilisateur Google";
    const users = loadUsers();
    const existing = users.find(u => u.email === mockEmail);
    if (existing) {
      const { passwordHash: _ph, ...publicUser } = existing;
      setUser(publicUser);
      return { ok: true, needsCompletion: !existing.profileComplete };
    }
    const newUser: StoredUser = {
      id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      fullName: mockName,
      email: mockEmail,
      provider: "google",
      profileComplete: false,
      emailVerified: true,
      cguAccepted: false,
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    const { passwordHash: _ph, ...publicUser } = newUser;
    setUser(publicUser);
    return { ok: true, needsCompletion: true };
  }, []);

  const completeProfile = useCallback(async (patch: Partial<SignupPayload>) => {
    if (!user) return { ok: false, error: "Non connecté." };
    if (patch.cguAccepted === false) return { ok: false, error: "Vous devez accepter les CGU." };
    const users = loadUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx < 0) return { ok: false, error: "Utilisateur introuvable." };
    const merged: StoredUser = {
      ...users[idx],
      ...patch,
      email: users[idx].email,
      provider: users[idx].provider,
      cguAccepted: patch.cguAccepted ?? users[idx].cguAccepted,
      profileComplete: true,
    };
    if (patch.password) merged.passwordHash = await hashPassword(patch.password);
    const next = [...users];
    next[idx] = merged;
    saveUsers(next);
    const { passwordHash: _ph, ...publicUser } = merged;
    setUser(publicUser);
    return { ok: true };
  }, [user]);

  const updateProfile = useCallback((patch: Partial<User>) => {
    if (!user) return;
    const users = loadUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      const merged: StoredUser = { ...users[idx], ...patch, id: users[idx].id, email: users[idx].email };
      const next = [...users];
      next[idx] = merged;
      saveUsers(next);
      const { passwordHash: _ph, ...publicUser } = merged;
      setUser(publicUser);
    } else {
      setUser({ ...user, ...patch });
    }
  }, [user]);

  const requestEmailVerification = useCallback(() => {
    if (!user) return { ok: false as const, error: "Non connecté." };
    if (user.emailVerified) return { ok: false as const, error: "E-mail déjà vérifié." };
    const tokens = loadTokens().filter(t => !(t.email === user.email && t.kind === "verify"));
    const code = generateCode();
    tokens.push({ code, email: user.email, kind: "verify", expiresAt: Date.now() + 15 * 60 * 1000 });
    saveTokens(tokens);
    return { ok: true as const, code };
  }, [user]);

  const confirmEmailVerification = useCallback((code: string) => {
    if (!user) return { ok: false as const, error: "Non connecté." };
    const tokens = loadTokens();
    const tok = tokens.find(t => t.email === user.email && t.kind === "verify" && t.code === code.trim());
    if (!tok) return { ok: false as const, error: "Code invalide." };
    if (tok.expiresAt < Date.now()) return { ok: false as const, error: "Code expiré." };
    saveTokens(tokens.filter(t => t !== tok));
    const users = loadUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) { users[idx] = { ...users[idx], emailVerified: true }; saveUsers(users); }
    setUser({ ...user, emailVerified: true });
    return { ok: true as const };
  }, [user]);

  const requestPasswordReset = useCallback((email: string) => {
    const normalized = email.trim().toLowerCase();
    const found = loadUsers().find(u => u.email.toLowerCase() === normalized);
    if (!found) return { ok: false as const, error: "Aucun compte trouvé pour cet e-mail." };
    if (found.provider === "google" && !found.passwordHash) return { ok: false as const, error: "Ce compte utilise Google ; pas de mot de passe à réinitialiser." };
    const tokens = loadTokens().filter(t => !(t.email === found.email && t.kind === "reset"));
    const code = generateCode();
    tokens.push({ code, email: found.email, kind: "reset", expiresAt: Date.now() + 15 * 60 * 1000 });
    saveTokens(tokens);
    return { ok: true as const, code };
  }, []);

  const confirmPasswordReset = useCallback(async (email: string, code: string, newPassword: string) => {
    if (newPassword.length < 8) return { ok: false as const, error: "Mot de passe : 8 caractères minimum." };
    const normalized = email.trim().toLowerCase();
    const tokens = loadTokens();
    const tok = tokens.find(t => t.email.toLowerCase() === normalized && t.kind === "reset" && t.code === code.trim());
    if (!tok) return { ok: false as const, error: "Code invalide." };
    if (tok.expiresAt < Date.now()) return { ok: false as const, error: "Code expiré." };
    const users = loadUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === normalized);
    if (idx < 0) return { ok: false as const, error: "Compte introuvable." };
    users[idx] = { ...users[idx], passwordHash: await hashPassword(newPassword) };
    saveUsers(users);
    saveTokens(tokens.filter(t => t !== tok));
    return { ok: true as const };
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const value = useMemo<UserContextValue>(() => ({
    user,
    isAuthenticated: !!user,
    login, signup, signupWithGoogle, completeProfile, updateProfile, logout,
    requestEmailVerification, confirmEmailVerification, requestPasswordReset, confirmPasswordReset,
  }), [user, login, signup, signupWithGoogle, completeProfile, updateProfile, logout, requestEmailVerification, confirmEmailVerification, requestPasswordReset, confirmPasswordReset]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
