// CSV utilities - minimal, RFC 4180 compliant for common cases.

function csvEscape(v: unknown): string {
  if (v == null) return "";
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function toCSV<T extends Record<string, unknown>>(rows: T[], columns?: { key: keyof T; label?: string }[]): string {
  if (rows.length === 0) return "";
  const cols = columns || Object.keys(rows[0]).map(k => ({ key: k as keyof T, label: k }));
  const header = cols.map(c => csvEscape(c.label || String(c.key))).join(",");
  const body = rows.map(r => cols.map(c => csvEscape(r[c.key])).join(",")).join("\n");
  return `${header}\n${body}`;
}

export function downloadFile(filename: string, content: string, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportCSV<T extends Record<string, unknown>>(filename: string, rows: T[], columns?: { key: keyof T; label?: string }[]) {
  const csv = toCSV(rows, columns);
  // BOM for Excel UTF-8 detection
  downloadFile(filename, "﻿" + csv, "text/csv;charset=utf-8");
}

export function exportJSON(filename: string, data: unknown) {
  downloadFile(filename, JSON.stringify(data, null, 2), "application/json");
}

// ============= CSV IMPORT =============

export function parseCSV(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const cleaned = text.replace(/^﻿/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines: string[][] = [];
  let cur: string[] = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (inQuotes) {
      if (ch === '"') {
        if (cleaned[i + 1] === '"') { cell += '"'; i++; }
        else inQuotes = false;
      } else cell += ch;
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ",") { cur.push(cell); cell = ""; }
      else if (ch === "\n") { cur.push(cell); lines.push(cur); cur = []; cell = ""; }
      else cell += ch;
    }
  }
  if (cell.length > 0 || cur.length > 0) { cur.push(cell); lines.push(cur); }
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = lines[0].map(h => h.trim());
  const rows = lines.slice(1).filter(l => l.some(c => c.trim() !== "")).map(l => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = (l[i] ?? "").trim(); });
    return obj;
  });
  return { headers, rows };
}

// ============= ADMIN BACKUP =============

const ADMIN_KEYS_PREFIX = "ipk:admin:";
const PUBLIC_KEYS = ["ipk:reviews:v1"]; // user-generated content also worth backing up

export function exportAdminBackup() {
  const dump: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k) continue;
    if (k.startsWith(ADMIN_KEYS_PREFIX) || PUBLIC_KEYS.includes(k)) {
      try { dump[k] = JSON.parse(localStorage.getItem(k) || "null"); } catch { dump[k] = localStorage.getItem(k); }
    }
  }
  exportJSON(`ipk-backup-${new Date().toISOString().slice(0, 10)}.json`, { version: 1, exportedAt: new Date().toISOString(), data: dump });
}

export function importAdminBackup(json: string): { restored: number } {
  const parsed = JSON.parse(json);
  const data = (parsed && typeof parsed === "object" && parsed.data) ? parsed.data : parsed;
  if (!data || typeof data !== "object") throw new Error("Format de sauvegarde invalide");
  let restored = 0;
  Object.entries(data).forEach(([k, v]) => {
    if (typeof k !== "string") return;
    if (!k.startsWith(ADMIN_KEYS_PREFIX) && !PUBLIC_KEYS.includes(k)) return;
    try { localStorage.setItem(k, JSON.stringify(v)); restored++; } catch {}
  });
  return { restored };
}
