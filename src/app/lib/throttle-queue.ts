type Entry = { at: number };

const memory = new Map<string, Entry>();

const STORAGE_KEY = "ipk:throttle:v1";
const PRUNE_AFTER_MS = 60 * 60 * 1000;

function loadFromStorage(): Map<string, Entry> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Map();
    const parsed = JSON.parse(raw) as Record<string, Entry>;
    return new Map(Object.entries(parsed));
  } catch { return new Map(); }
}

function persist() {
  try {
    const obj: Record<string, Entry> = {};
    const cutoff = Date.now() - PRUNE_AFTER_MS;
    memory.forEach((v, k) => { if (v.at > cutoff) obj[k] = v; });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch {}
}

let hydrated = false;
function hydrate() {
  if (hydrated) return;
  hydrated = true;
  loadFromStorage().forEach((v, k) => memory.set(k, v));
}

export interface ThrottleOptions {
  ttlMs: number;
  persist?: boolean;
}

export function shouldFire(key: string, opts: ThrottleOptions): boolean {
  if (opts.persist) hydrate();
  const now = Date.now();
  const prev = memory.get(key);
  if (prev && now - prev.at < opts.ttlMs) return false;
  memory.set(key, { at: now });
  if (opts.persist) persist();
  return true;
}

export function resetThrottle(key?: string) {
  if (key) memory.delete(key); else memory.clear();
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

type QueuedTask = { id: string; run: () => void | Promise<void>; minGapMs: number };

const queues = new Map<string, { tasks: QueuedTask[]; running: boolean; lastAt: number }>();

export function enqueue(channel: string, task: QueuedTask) {
  let q = queues.get(channel);
  if (!q) { q = { tasks: [], running: false, lastAt: 0 }; queues.set(channel, q); }
  if (q.tasks.some(t => t.id === task.id)) return;
  q.tasks.push(task);
  drain(channel);
}

async function drain(channel: string) {
  const q = queues.get(channel);
  if (!q || q.running) return;
  q.running = true;
  try {
    while (q.tasks.length > 0) {
      const t = q.tasks.shift()!;
      const wait = Math.max(0, q.lastAt + t.minGapMs - Date.now());
      if (wait > 0) await new Promise(r => setTimeout(r, wait));
      try { await t.run(); } catch {}
      q.lastAt = Date.now();
    }
  } finally {
    q.running = false;
  }
}

export function clearQueue(channel?: string) {
  if (channel) queues.delete(channel); else queues.clear();
}
