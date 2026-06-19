import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

let quotaWarned = false;

export function safeStorageWrite(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    const isQuota = e instanceof DOMException && (
      e.code === 22 ||
      e.code === 1014 ||
      e.name === "QuotaExceededError" ||
      e.name === "NS_ERROR_DOM_QUOTA_REACHED"
    );
    if (isQuota && !quotaWarned) {
      quotaWarned = true;
      try {
        toast.error("Stockage local saturé", {
          description: "Exportez puis videz le journal d'audit ou les données archivées dans Paramètres.",
          duration: 8000,
        });
      } catch {}
    } else if (!isQuota) {
      try { console.error(`[useLocalState] write failed for ${key}`, e); } catch {}
    }
    return false;
  }
}

export function safeStorageRead<T>(key: string, fallback: T, validate?: (v: unknown) => v is T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (validate && !validate(parsed)) {
      console.warn(`[useLocalState] invalid shape at ${key}, using fallback`);
      return fallback;
    }
    return parsed as T;
  } catch (e) {
    console.warn(`[useLocalState] parse error at ${key}, using fallback`, e);
    return fallback;
  }
}

export function useLocalState<T>(
  key: string,
  initial: T,
  validate?: (v: unknown) => v is T,
): [T, (v: T | ((p: T) => T)) => void] {
  const [state, setState] = useState<T>(() => safeStorageRead(key, initial, validate));
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return; }
    safeStorageWrite(key, state);
  }, [key, state]);

  return [state, setState];
}

export interface AdminOrder {
  id: string;
  productId: string;
  customer: string;
  email: string;
  quantity: number;
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  date: string;
}

export const ORDER_STATUS: Record<AdminOrder["status"], { label: string; tone: "info" | "success" | "warn" | "danger" | "neutral" }> = {
  pending: { label: "En attente", tone: "neutral" },
  paid: { label: "Payée", tone: "info" },
  shipped: { label: "Expédiée", tone: "warn" },
  delivered: { label: "Livrée", tone: "success" },
  cancelled: { label: "Annulée", tone: "danger" },
};

export interface ReviewModEvent {
  action: "approve" | "unpublish" | "flag" | "unflag" | "reply" | "delete-reply" | "edit";
  actor: string;
  date: string;
  note?: string;
}

export interface ReviewReply {
  text: string;
  author: string;
  date: string;
}

export interface ReviewEntry {
  productId: string;
  rating: number;
  comment: string;
  author: string;
  date: string;
  approved?: boolean;
  flagged?: boolean;
  flagReason?: string;
  verified?: boolean;
  authorEmail?: string;
  reply?: ReviewReply;
  history?: ReviewModEvent[];
}

export function loadReviews(): Record<string, Omit<ReviewEntry, "productId">[]> {
  return safeStorageRead("ipk:reviews:v1", {} as Record<string, Omit<ReviewEntry, "productId">[]>);
}

export function saveReviews(all: Record<string, Omit<ReviewEntry, "productId">[]>) {
  safeStorageWrite("ipk:reviews:v1", all);
}

// ============= QUOTA UTILITIES =============

export function getStorageUsage(): { bytes: number; limitBytes: number; pct: number; perKey: { key: string; bytes: number }[] } {
  let bytes = 0;
  const perKey: { key: string; bytes: number }[] = [];
  if (typeof window === "undefined") return { bytes: 0, limitBytes: 5_000_000, pct: 0, perKey: [] };
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      const v = localStorage.getItem(k) || "";
      const size = (k.length + v.length) * 2; // UTF-16
      bytes += size;
      if (k.startsWith("ipk:")) perKey.push({ key: k, bytes: size });
    }
  } catch {}
  const limitBytes = 5_000_000; // ~5 MB typical browser limit
  perKey.sort((a, b) => b.bytes - a.bytes);
  return { bytes, limitBytes, pct: Math.min(100, (bytes / limitBytes) * 100), perKey };
}
