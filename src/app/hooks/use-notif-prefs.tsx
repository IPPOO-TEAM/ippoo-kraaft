import { useCallback, useEffect, useState } from "react";
import type { NotificationCategory } from "./use-notifications";

export type ChannelPrefs = {
  toast: boolean;
  inApp: boolean;
  sound: boolean;
};

export type NotifPrefs = ChannelPrefs & {
  quietHours: { enabled: boolean; from: string; to: string };
  categories: Record<NotificationCategory, boolean>;
};

const STORAGE_KEY = "ipk:notif:prefs:v1";

const DEFAULT_PREFS: NotifPrefs = {
  toast: true,
  inApp: true,
  sound: false,
  quietHours: { enabled: false, from: "22:00", to: "07:00" },
  categories: { marketing: true, order: true, reward: true, system: true, alert: true },
};

function load(): NotifPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PREFS, ...parsed, categories: { ...DEFAULT_PREFS.categories, ...(parsed.categories || {}) }, quietHours: { ...DEFAULT_PREFS.quietHours, ...(parsed.quietHours || {}) } };
  } catch { return DEFAULT_PREFS; }
}

function save(p: NotifPrefs) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
  try { window.dispatchEvent(new CustomEvent("ipk:notif:prefs", { detail: p })); } catch {}
}

function inQuietHours(p: NotifPrefs, now = new Date()): boolean {
  if (!p.quietHours.enabled) return false;
  const [fh, fm] = p.quietHours.from.split(":").map(Number);
  const [th, tm] = p.quietHours.to.split(":").map(Number);
  const cur = now.getHours() * 60 + now.getMinutes();
  const from = fh * 60 + fm;
  const to = th * 60 + tm;
  return from <= to ? (cur >= from && cur < to) : (cur >= from || cur < to);
}

export function getPrefsSnapshot(): NotifPrefs { return load(); }

export function shouldShowToast(category: NotificationCategory): boolean {
  const p = load();
  if (!p.toast) return false;
  if (!p.categories[category]) return false;
  if (inQuietHours(p)) return false;
  return true;
}

export function shouldStoreInApp(category: NotificationCategory): boolean {
  const p = load();
  if (!p.inApp) return false;
  if (!p.categories[category]) return false;
  return true;
}

export function shouldPlaySound(): boolean {
  const p = load();
  return p.sound && !inQuietHours(p);
}

export function playNotifSound() {
  if (!shouldPlaySound()) return;
  try {
    const Ctx = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = 880;
    o.type = "sine";
    g.gain.setValueAtTime(0.001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    o.connect(g); g.connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + 0.36);
  } catch {}
}

export function useNotifPrefs() {
  const [prefs, setPrefs] = useState<NotifPrefs>(() => load());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => { if (e.key === STORAGE_KEY) setPrefs(load()); };
    const onCustom = (e: Event) => { const d = (e as CustomEvent<NotifPrefs>).detail; if (d) setPrefs(d); };
    window.addEventListener("storage", onStorage);
    window.addEventListener("ipk:notif:prefs", onCustom as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("ipk:notif:prefs", onCustom as EventListener);
    };
  }, []);

  const update = useCallback((patch: Partial<NotifPrefs>) => {
    setPrefs(prev => { const next = { ...prev, ...patch }; save(next); return next; });
  }, []);

  const toggleCategory = useCallback((cat: NotificationCategory) => {
    setPrefs(prev => {
      const next = { ...prev, categories: { ...prev.categories, [cat]: !prev.categories[cat] } };
      save(next); return next;
    });
  }, []);

  const reset = useCallback(() => { save(DEFAULT_PREFS); setPrefs(DEFAULT_PREFS); }, []);

  return { prefs, update, toggleCategory, reset };
}
