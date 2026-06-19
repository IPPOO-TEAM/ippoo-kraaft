import { useEffect, useState } from "react";

// Webhook d'alerte pour événements critiques (delete, archive, restore, clear, login_failed…).
// Configurable depuis Réglages. Envoi POST JSON fire-and-forget avec dédup 2s.

const URL_KEY = "ipk:admin:alertWebhook:url:v1";
const ACTIONS_KEY = "ipk:admin:alertWebhook:actions:v1";
const ENABLED_KEY = "ipk:admin:alertWebhook:enabled:v1";

export const DEFAULT_CRITICAL_ACTIONS = ["delete", "archive", "restore", "clear", "login_failed", "reject", "lead"] as const;

export function getAlertWebhookUrl(): string { try { return localStorage.getItem(URL_KEY) || ""; } catch { return ""; } }
export function setAlertWebhookUrl(url: string) { try { url ? localStorage.setItem(URL_KEY, url) : localStorage.removeItem(URL_KEY); } catch {} }
export function getAlertActions(): string[] {
  try { const raw = localStorage.getItem(ACTIONS_KEY); return raw ? JSON.parse(raw) : [...DEFAULT_CRITICAL_ACTIONS]; } catch { return [...DEFAULT_CRITICAL_ACTIONS]; }
}
export function setAlertActions(list: string[]) { try { localStorage.setItem(ACTIONS_KEY, JSON.stringify(list)); } catch {} }
export function getAlertEnabled(): boolean { try { return localStorage.getItem(ENABLED_KEY) === "1"; } catch { return false; } }
export function setAlertEnabled(v: boolean) { try { v ? localStorage.setItem(ENABLED_KEY, "1") : localStorage.removeItem(ENABLED_KEY); } catch {} }

const recentSig = new Map<string, number>(); // dédup
const DEDUP_MS = 2000;

async function dispatchAlert(detail: { actor: string; action: string; entity: string; entityId?: string; details?: string; date?: string; id?: string }) {
  if (!getAlertEnabled()) return;
  const url = getAlertWebhookUrl();
  if (!url) return;
  const actions = new Set(getAlertActions());
  if (!actions.has(detail.action)) return;

  const sig = `${detail.action}|${detail.entity}|${detail.entityId || ""}|${detail.actor}`;
  const now = Date.now();
  const last = recentSig.get(sig);
  if (last && now - last < DEDUP_MS) return;
  recentSig.set(sig, now);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "audit.critical",
        site: "IPPOO KRAAFT",
        ...detail,
        date: detail.date || new Date().toISOString(),
      }),
      signal: controller.signal,
      keepalive: true,
    }).finally(() => clearTimeout(timeout));
  } catch {}
}

export function AlertWebhookProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const onAudit = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) void dispatchAlert(detail);
    };
    const onLead = (e: Event) => {
      const lead = (e as CustomEvent).detail;
      if (!lead) return;
      void dispatchLead(lead);
    };
    window.addEventListener("ipk:audit", onAudit);
    window.addEventListener("ipk:lead", onLead);
    return () => {
      window.removeEventListener("ipk:audit", onAudit);
      window.removeEventListener("ipk:lead", onLead);
    };
  }, []);
  return <>{children}</>;
}

async function dispatchLead(lead: { id: string; type: string; ref?: string; refLabel?: string; name?: string; email?: string; phone?: string; message?: string; createdAt: string }) {
  if (!getAlertEnabled()) return;
  const url = getAlertWebhookUrl();
  if (!url) return;
  const actions = new Set(getAlertActions());
  if (!actions.has(`lead.${lead.type}`) && !actions.has("lead")) return;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "lead", site: "IPPOO KRAAFT", ...lead }),
      signal: controller.signal,
      keepalive: true,
    }).finally(() => clearTimeout(timeout));
  } catch {}
}

export function useAlertWebhookSettings() {
  const [url, setUrl] = useState(() => getAlertWebhookUrl());
  const [actions, setActions] = useState<string[]>(() => getAlertActions());
  const [enabled, setEnabled] = useState(() => getAlertEnabled());

  const save = () => {
    setAlertWebhookUrl(url.trim());
    setAlertActions(actions);
    setAlertEnabled(enabled);
  };
  const test = async () => {
    if (!url.trim()) throw new Error("URL requise");
    const res = await fetch(url.trim(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "audit.test", site: "IPPOO KRAAFT", message: "Test depuis l'admin", date: new Date().toISOString() }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  };
  return { url, setUrl, actions, setActions, enabled, setEnabled, save, test };
}
