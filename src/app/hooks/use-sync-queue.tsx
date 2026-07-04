import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";

// Sync queue: persistant, à plat - chaque entrée représente une opération à
// rejouer sur un futur backend. Pour l'instant, "flush" simule un POST.

const QUEUE_KEY = "ipk:admin:syncQueue:v1";
const ENDPOINT_KEY = "ipk:admin:syncEndpoint:v1";
const AUTH_KEY = "ipk:admin:syncAuth:v1";
const FAILURES_KEY = "ipk:admin:syncFailures:v1";
const MAX_FAILURES = 200;

class HttpError extends Error { constructor(public status: number, msg: string) { super(msg); } }
const MAX_RETRIES = 5;
const BASE_BACKOFF_MS = 1000;
const MAX_BACKOFF_MS = 30_000;

export function getSyncEndpoint(): string {
  try { return localStorage.getItem(ENDPOINT_KEY) || ""; } catch { return ""; }
}
export function setSyncEndpoint(url: string) {
  try { url ? localStorage.setItem(ENDPOINT_KEY, url) : localStorage.removeItem(ENDPOINT_KEY); } catch {}
}
export function getSyncAuth(): string {
  try { return localStorage.getItem(AUTH_KEY) || ""; } catch { return ""; }
}
export function setSyncAuth(token: string) {
  try { token ? localStorage.setItem(AUTH_KEY, token) : localStorage.removeItem(AUTH_KEY); } catch {}
}
function backoffDelay(attempts: number): number {
  return Math.min(BASE_BACKOFF_MS * Math.pow(2, Math.max(0, attempts - 1)), MAX_BACKOFF_MS);
}

export type SyncOp = "create" | "update" | "delete" | "status_change";
export type SyncEntity = "product" | "order" | "artisan" | "groupement" | "formation" | "event" | "blog" | "groupbuy" | "review" | "message" | "promo";

export interface SyncEntry {
  id: string;
  op: SyncOp;
  entity: SyncEntity;
  entityId: string;
  payload?: unknown;
  createdAt: string;
  attempts: number;
  lastError?: string;
  status: "pending" | "syncing" | "failed" | "conflict";
  nextAttemptAt?: string;
  conflictAt?: string;
}

export interface FailureRecord {
  id: string;
  op: SyncOp;
  entity: SyncEntity;
  entityId: string;
  createdAt: string;
  failedAt: string;
  attempts: number;
  reason: string;
  kind: "exhausted" | "conflict";
}

export function loadFailures(): FailureRecord[] {
  try { return JSON.parse(localStorage.getItem(FAILURES_KEY) || "[]"); } catch { return []; }
}
function saveFailures(f: FailureRecord[]) {
  try { localStorage.setItem(FAILURES_KEY, JSON.stringify(f.slice(0, MAX_FAILURES))); } catch {}
}
export function clearFailures() { try { localStorage.removeItem(FAILURES_KEY); } catch {} }

interface SyncContextValue {
  isOnline: boolean;
  queue: SyncEntry[];
  pendingCount: number;
  failedCount: number;
  conflictCount: number;
  failures: FailureRecord[];
  enqueue: (op: Omit<SyncEntry, "id" | "createdAt" | "attempts" | "status">) => void;
  flush: () => Promise<void>;
  clearAll: () => void;
  removeEntry: (id: string) => void;
  retryEntry: (id: string) => void;
  clearFailureLog: () => void;
}

const SyncContext = createContext<SyncContextValue | null>(null);

function loadQueue(): SyncEntry[] {
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]"); } catch { return []; }
}
function saveQueue(q: SyncEntry[]) {
  try { localStorage.setItem(QUEUE_KEY, JSON.stringify(q)); } catch {}
}

// Standalone enqueue - utilisable hors composant React (services, hooks bas-niveau).
// Le SyncProvider observe `ipk:sync:enqueue` et fusionne dans son state, garantissant
// la persistance et le déclenchement du flush au prochain cycle online.
export function enqueueSync(entry: Omit<SyncEntry, "id" | "createdAt" | "attempts" | "status">) {
  try {
    const full: SyncEntry = {
      ...entry,
      id: `sync-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
      attempts: 0,
      status: "pending",
    };
    const current = loadQueue();
    saveQueue([...current, full]);
    window.dispatchEvent(new CustomEvent("ipk:sync:enqueue", { detail: full }));
  } catch {}
}

export function SyncProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [queue, setQueue] = useState<SyncEntry[]>(loadQueue);
  const [failures, setFailures] = useState<FailureRecord[]>(loadFailures);
  const flushingRef = useRef(false);

  useEffect(() => { saveQueue(queue); }, [queue]);
  useEffect(() => { saveFailures(failures); }, [failures]);

  const recordFailure = useCallback((entry: SyncEntry, kind: "exhausted" | "conflict", reason: string) => {
    setFailures(prev => [{
      id: entry.id, op: entry.op, entity: entry.entity, entityId: entry.entityId,
      createdAt: entry.createdAt, failedAt: new Date().toISOString(),
      attempts: entry.attempts + 1, reason, kind,
    }, ...prev].slice(0, MAX_FAILURES));
  }, []);

  useEffect(() => {
    const onOnline = () => { setIsOnline(true); toast.success("Connexion rétablie", { description: "Synchronisation des changements…" }); };
    const onOffline = () => { setIsOnline(false); toast.warning("Hors-ligne", { description: "Vos modifications seront synchronisées plus tard." }); };
    const onExternalEnqueue = (e: Event) => {
      const detail = (e as CustomEvent<SyncEntry>).detail;
      if (!detail) return;
      setQueue(prev => prev.some(x => x.id === detail.id) ? prev : [...prev, detail]);
    };
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    window.addEventListener("ipk:sync:enqueue", onExternalEnqueue as EventListener);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("ipk:sync:enqueue", onExternalEnqueue as EventListener);
    };
  }, []);

  const enqueue: SyncContextValue["enqueue"] = useCallback((entry) => {
    setQueue(prev => [...prev, { ...entry, id: `sync-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, createdAt: new Date().toISOString(), attempts: 0, status: "pending" }]);
  }, []);

  // Send one entry: if an endpoint is configured, POST to it; otherwise simulate.
  const sendOne = async (entry: SyncEntry): Promise<void> => {
    const endpoint = getSyncEndpoint();
    if (!endpoint) {
      // Mock: 90% success rate, 200-700 ms latency
      await new Promise<void>((resolve, reject) => {
        const delay = 200 + Math.random() * 500;
        setTimeout(() => Math.random() < 0.9 ? resolve() : reject(new Error("Échec réseau simulé")), delay);
      });
      return;
    }
    const auth = getSyncAuth();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (auth) headers["Authorization"] = /^(Bearer|Basic) /i.test(auth) ? auth : `Bearer ${auth}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({ id: entry.id, op: entry.op, entity: entry.entity, entityId: entry.entityId, payload: entry.payload, createdAt: entry.createdAt }),
        signal: controller.signal,
      });
      if (!res.ok) throw new HttpError(res.status, `HTTP ${res.status}`);
    } finally {
      clearTimeout(timeout);
    }
  };

  const flush = useCallback(async () => {
    if (flushingRef.current || !isOnline) return;
    flushingRef.current = true;
    const current = loadQueue();
    const now = Date.now();
    const pending = current.filter(e => {
      if (e.status === "conflict") return false;
      if (e.status === "failed" && e.attempts >= MAX_RETRIES) return false;
      if (e.nextAttemptAt && new Date(e.nextAttemptAt).getTime() > now) return false;
      return true;
    });
    if (pending.length === 0) { flushingRef.current = false; return; }

    setQueue(prev => prev.map(e => pending.find(p => p.id === e.id) ? { ...e, status: "syncing" } : e));

    let success = 0, failed = 0, conflicts = 0;
    for (const entry of pending) {
      try {
        await sendOne(entry);
        setQueue(prev => prev.filter(e => e.id !== entry.id));
        success++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erreur inconnue";
        const isConflict = err instanceof HttpError && err.status === 409;
        if (isConflict) {
          recordFailure(entry, "conflict", msg);
          setQueue(prev => prev.map(e => e.id !== entry.id ? e : { ...e, status: "conflict", attempts: e.attempts + 1, lastError: msg, conflictAt: new Date().toISOString(), nextAttemptAt: undefined }));
          conflicts++;
        } else {
          const attempts = entry.attempts + 1;
          const exhausted = attempts >= MAX_RETRIES;
          if (exhausted) recordFailure(entry, "exhausted", msg);
          setQueue(prev => prev.map(e => {
            if (e.id !== entry.id) return e;
            const nextAttemptAt = exhausted ? undefined : new Date(Date.now() + backoffDelay(attempts)).toISOString();
            return { ...e, status: "failed", attempts, lastError: msg, nextAttemptAt };
          }));
          failed++;
        }
      }
    }

    flushingRef.current = false;
    if (success > 0) toast.success(`${success} opération(s) synchronisée(s)${failed > 0 ? `, ${failed} échec(s)` : ""}${conflicts > 0 ? `, ${conflicts} conflit(s)` : ""}`);
    else if (conflicts > 0) toast.error(`${conflicts} conflit(s) - révision manuelle requise`);
    else if (failed > 0) toast.error(`${failed} opération(s) en échec`);
  }, [isOnline, recordFailure]);

  // Auto-flush when coming back online
  useEffect(() => {
    if (isOnline && queue.some(e => e.status === "pending")) {
      flush();
    }
  }, [isOnline]); // eslint-disable-line react-hooks/exhaustive-deps

  // Bridge: auto-enqueue from audit events for write actions
  useEffect(() => {
    const WRITE_ACTIONS = new Set(["create", "update", "delete", "archive", "status_change", "approve", "reject"]);
    const SYNC_ENTITIES: SyncEntity[] = ["product", "order", "artisan", "groupement", "formation", "event", "blog", "groupbuy", "review", "message", "promo"];
    const onAudit = (e: Event) => {
      const detail = (e as CustomEvent).detail as { action: string; entity: string; entityId?: string; details?: string } | undefined;
      if (!detail) return;
      if (!WRITE_ACTIONS.has(detail.action)) return;
      if (!SYNC_ENTITIES.includes(detail.entity as SyncEntity)) return;
      const op: SyncOp = detail.action === "delete" || detail.action === "archive" ? "delete"
        : detail.action === "status_change" ? "status_change"
        : detail.action === "create" ? "create" : "update";
      enqueue({ op, entity: detail.entity as SyncEntity, entityId: detail.entityId || "-", payload: detail.details });
    };
    window.addEventListener("ipk:audit", onAudit);
    return () => window.removeEventListener("ipk:audit", onAudit);
  }, [enqueue]);

  const clearAll = useCallback(() => setQueue([]), []);
  const removeEntry = useCallback((id: string) => setQueue(prev => prev.filter(e => e.id !== id)), []);
  const retryEntry = useCallback((id: string) => setQueue(prev => prev.map(e => e.id === id ? { ...e, status: "pending", attempts: 0, lastError: undefined, nextAttemptAt: undefined, conflictAt: undefined } : e)), []);
  const clearFailureLog = useCallback(() => setFailures([]), []);

  useEffect(() => {
    const id = setInterval(() => {
      if (!isOnline) return;
      const now = Date.now();
      const due = queue.some(e => e.status === "failed" && e.attempts < MAX_RETRIES && (!e.nextAttemptAt || new Date(e.nextAttemptAt).getTime() <= now));
      if (due) flush();
    }, 5000);
    return () => clearInterval(id);
  }, [isOnline, queue, flush]);

  const value = useMemo<SyncContextValue>(() => ({
    isOnline, queue, failures,
    pendingCount: queue.filter(e => e.status === "pending" || e.status === "syncing").length,
    failedCount: queue.filter(e => e.status === "failed").length,
    conflictCount: queue.filter(e => e.status === "conflict").length,
    enqueue, flush, clearAll, removeEntry, retryEntry, clearFailureLog,
  }), [isOnline, queue, failures, enqueue, flush, clearAll, removeEntry, retryEntry, clearFailureLog]);

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
}

export function useSyncQueue(): SyncContextValue {
  const ctx = useContext(SyncContext);
  if (!ctx) throw new Error("useSyncQueue must be used within SyncProvider");
  return ctx;
}
