import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { shouldFire } from "../lib/throttle-queue";
import { shouldStoreInApp } from "./use-notif-prefs";

export type NotificationCategory = "marketing" | "order" | "reward" | "system" | "alert";
export type NotificationTone = "info" | "success" | "reward" | "warn" | "danger";

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  url?: string;
  at: string;
  read: boolean;
  source: "broadcast" | "system";
  category?: NotificationCategory;
  tone?: NotificationTone;
};

type Ctx = {
  items: NotificationItem[];
  unreadCount: number;
  add: (input: Omit<NotificationItem, "id" | "at" | "read">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "ipk:notifications:v1";
const MAX_ITEMS = 50;
const DEDUP_WINDOW_MS = 30_000;

const NotificationsContext = createContext<Ctx | null>(null);

function load(): NotificationItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function save(items: NotificationItem[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<NotificationItem[]>(() => load());

  useEffect(() => { save(items); }, [items]);

  const add: Ctx["add"] = useCallback((input) => {
    setItems(prev => {
      const now = Date.now();
      const dupe = prev.find(n => n.title === input.title && n.body === input.body && (now - new Date(n.at).getTime()) < DEDUP_WINDOW_MS);
      if (dupe) return prev;
      const next: NotificationItem = {
        id: `ntf_${now}_${Math.random().toString(36).slice(2, 7)}`,
        at: new Date().toISOString(),
        read: false,
        ...input,
      };
      return [next, ...prev].slice(0, MAX_ITEMS);
    });
  }, []);

  const markRead: Ctx["markRead"] = useCallback((id) => {
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead: Ctx["markAllRead"] = useCallback(() => {
    setItems(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const remove: Ctx["remove"] = useCallback((id) => {
    setItems(prev => prev.filter(n => n.id !== id));
  }, []);

  const clear: Ctx["clear"] = useCallback(() => setItems([]), []);

  // Listen to marketing broadcasts and append to history
  useEffect(() => {
    const onBroadcast = (e: Event) => {
      const detail = (e as CustomEvent<{ title: string; body: string; url?: string }>).detail;
      if (!detail) return;
      if (!shouldFire(`broadcast:${detail.title}:${detail.body}`, { ttlMs: 5 * 60 * 1000, persist: true })) return;
      if (!shouldStoreInApp("marketing")) return;
      add({ title: detail.title, body: detail.body, url: detail.url, source: "broadcast", category: "marketing", tone: "info" });
    };
    window.addEventListener("ipk:marketing:broadcast", onBroadcast as EventListener);
    const onReward = (e: Event) => {
      const d = (e as CustomEvent<{ title: string; description?: string; highlight?: string; url?: string }>).detail;
      if (!d) return;
      const body = [d.highlight, d.description].filter(Boolean).join(" — ");
      if (!shouldStoreInApp("reward")) return;
      add({ title: d.title, body, url: d.url, source: "system", category: "reward", tone: "reward" });
    };
    window.addEventListener("ipk:reward", onReward as EventListener);
    return () => {
      window.removeEventListener("ipk:marketing:broadcast", onBroadcast as EventListener);
      window.removeEventListener("ipk:reward", onReward as EventListener);
    };
  }, [add]);

  // Cross-tab sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try { setItems(JSON.parse(e.newValue)); } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo<Ctx>(() => ({
    items,
    unreadCount: items.filter(n => !n.read).length,
    add, markRead, markAllRead, remove, clear,
  }), [items, add, markRead, markAllRead, remove, clear]);

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}
