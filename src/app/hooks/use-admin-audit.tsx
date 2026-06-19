import { useEffect, useState, useCallback } from "react";

const AUDIT_KEY = "ipk:admin:audit:v1";
const MAX_ENTRIES = 500;

export interface AuditEntry {
  id: string;
  date: string;
  actor: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: string;
}

function safeRead(): AuditEntry[] {
  try {
    const raw = localStorage.getItem(AUDIT_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) return list;
    }
  } catch {}
  return [];
}

function safeWrite(list: AuditEntry[]) {
  try { localStorage.setItem(AUDIT_KEY, JSON.stringify(list.slice(0, MAX_ENTRIES))); } catch {}
}

export function logAudit(entry: Omit<AuditEntry, "id" | "date">) {
  const next: AuditEntry = {
    id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    date: new Date().toISOString(),
    ...entry,
  };
  const list = safeRead();
  list.unshift(next);
  safeWrite(list);
  try { window.dispatchEvent(new CustomEvent("ipk:audit", { detail: next })); } catch {}
}

export function useAuditLog() {
  const [entries, setEntries] = useState<AuditEntry[]>(() => safeRead());

  useEffect(() => {
    const refresh = () => setEntries(safeRead());
    window.addEventListener("ipk:audit", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("ipk:audit", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const clear = useCallback(() => { safeWrite([]); setEntries([]); }, []);

  return { entries, clear };
}

// ============= CASCADE DELETE =============

interface CascadeReport {
  reviewsDeleted: number;
  ordersAffected: number;
  candidatesAffected: number;
}

function safeJsonGet<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); if (raw) return JSON.parse(raw) as T; } catch {}
  return fallback;
}
function safeJsonSet(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function previewProductCascade(productId: string): CascadeReport {
  const reviews = safeJsonGet<Record<string, unknown[]>>("ipk:reviews:v1", {});
  const orders = safeJsonGet<{ productId: string }[]>("ipk:admin:orders:v1", []);
  return {
    reviewsDeleted: reviews[productId]?.length || 0,
    ordersAffected: orders.filter(o => o.productId === productId).length,
    candidatesAffected: 0,
  };
}

export function cascadeProductDelete(productId: string): CascadeReport {
  const report = previewProductCascade(productId);
  if (report.reviewsDeleted > 0) {
    const reviews = safeJsonGet<Record<string, unknown[]>>("ipk:reviews:v1", {});
    delete reviews[productId];
    safeJsonSet("ipk:reviews:v1", reviews);
  }
  // Orders are kept for accounting history but tagged as orphan via missing product lookup.
  return report;
}

export function previewArtisanCascade(artisanId: string): { candidatesAffected: number } {
  const candidates = safeJsonGet<{ id?: string }[]>("ipk:admin:artisanCandidates:v1", []);
  return { candidatesAffected: candidates.filter(c => c.id === artisanId).length };
}

export function cascadeArtisanDelete(artisanId: string) {
  const candidates = safeJsonGet<{ id?: string }[]>("ipk:admin:artisanCandidates:v1", []);
  safeJsonSet("ipk:admin:artisanCandidates:v1", candidates.filter(c => c.id !== artisanId));
}
