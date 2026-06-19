import { useCallback, useEffect, useMemo, useState } from "react";
import { Trash2, Mail, MailOpen, Plus, Save, History, ShieldCheck, Edit3 as Edit3Icon, Download, Upload, Database } from "lucide-react";
import { exportAdminBackup, importAdminBackup } from "../../utils/export-utils";
import { useLocalState, getStorageUsage } from "../../hooks/use-admin-data";
import { useAuditLog, logAudit } from "../../hooks/use-admin-audit";
import { useAdmin } from "../../hooks/use-admin";
import { useSeo } from "../../hooks/use-seo";
import { PageHeader, DataCard, SearchInput, StatusPill, EmptyRow, NumberInput } from "./admin-shared";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useSyncQueue, getSyncEndpoint, setSyncEndpoint, getSyncAuth, setSyncAuth } from "../../hooks/use-sync-queue";
import { Wifi, WifiOff, RefreshCw, AlertTriangle, HardDrive, Bell } from "lucide-react";
import { useAlertWebhookSettings, DEFAULT_CRITICAL_ACTIONS } from "../../hooks/use-alert-webhook";
import { getGatewayConfig, setGatewayConfig } from "../../hooks/use-payments";
import { CreditCard, Globe } from "lucide-react";
import { useCurrencyConfig, DEFAULT_CURRENCIES, type CurrencyCode } from "../../hooks/use-currency";

// ============= MESSAGES =============
interface Message { id: string; type: string; name: string; email: string; subject: string; message: string; date: string; read?: boolean; }

export function AdminMessagesPage() {
  useSeo({ title: "Admin — Messages", noIndex: true });
  const [messages, setMessages] = useLocalState<Message[]>("ipk:admin:messages:v1", []);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(() => messages.filter(m => {
    if (filter === "unread" && m.read) return false;
    if (filter === "read" && !m.read) return false;
    if (search.trim()) { const q = search.toLowerCase(); return m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q) || m.message.toLowerCase().includes(q); }
    return true;
  }), [messages, search, filter]);

  const counts = { all: messages.length, unread: messages.filter(m => !m.read).length, read: messages.filter(m => m.read).length };

  const toggleRead = (id: string) => setMessages(prev => prev.map(m => m.id === id ? { ...m, read: !m.read } : m));
  const remove = (id: string) => { if (!confirm("Supprimer ce message ?")) return; setMessages(prev => prev.filter(m => m.id !== id)); setSelected(null); toast.success("Message supprimé"); };
  const open = (id: string) => { setSelected(id); setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m)); };

  const current = messages.find(m => m.id === selected);

  return (
    <div>
      <PageHeader title="Messages" subtitle={`${messages.length} messages — ${counts.unread} non lu${counts.unread > 1 ? "s" : ""}`} />

      <DataCard className="mb-4">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <SearchInput value={search} onChange={setSearch} placeholder="Nom, email, sujet…" />
          <div className="flex gap-1">
            {(["all", "unread", "read"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full ${filter === f ? "bg-[var(--ipk-green-dark)] text-white" : "bg-[var(--ipk-surface)] text-[var(--ipk-text)]"}`} style={{ fontSize: "12px", fontWeight: 500 }}>
                {f === "all" ? "Tous" : f === "unread" ? "Non lus" : "Lus"} ({counts[f]})
              </button>
            ))}
          </div>
        </div>
      </DataCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DataCard>
          {filtered.length === 0 ? <EmptyRow message="Aucun message. Les soumissions du formulaire de contact apparaîtront ici." /> : (
            <ul className="divide-y divide-[var(--ipk-border)]">
              {filtered.map(m => (
                <li key={m.id}>
                  <button onClick={() => open(m.id)} className={`w-full text-left py-3 px-2 -mx-2 rounded-lg hover:bg-[var(--ipk-surface)] ${selected === m.id ? "bg-[var(--ipk-surface)]" : ""}`}>
                    <div className="flex items-center gap-2 mb-1">
                      {m.read ? <MailOpen className="w-3.5 h-3.5 text-[var(--ipk-text)]" /> : <Mail className="w-3.5 h-3.5 text-[var(--ipk-blue)]" />}
                      <span className={`truncate ${m.read ? "text-[var(--ipk-text)]" : "text-[var(--ipk-ink)] font-medium"}`} style={{ fontSize: "13px" }}>{m.name}</span>
                      <StatusPill status={m.type} tone="neutral" />
                      <span className="ml-auto text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>{new Date(m.date).toLocaleDateString("fr-FR")}</span>
                    </div>
                    <div className="text-[var(--ipk-ink)] truncate" style={{ fontSize: "13px", fontWeight: m.read ? 400 : 500 }}>{m.subject}</div>
                    <div className="text-[var(--ipk-text)] truncate" style={{ fontSize: "12px" }}>{m.message}</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </DataCard>

        <DataCard>
          {!current ? <EmptyRow message="Sélectionnez un message pour le lire." /> : (
            <div>
              <div className="flex items-start justify-between gap-2 mb-3 pb-3 border-b border-[var(--ipk-border)]">
                <div className="min-w-0">
                  <h3 className="text-[var(--ipk-ink)] truncate" style={{ fontSize: "16px", fontWeight: 600 }}>{current.subject}</h3>
                  <p className="text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>De <span className="font-medium">{current.name}</span> &lt;{current.email}&gt; — {new Date(current.date).toLocaleString("fr-FR")}</p>
                </div>
                <div className="flex gap-1">
                  <Button onClick={() => toggleRead(current.id)} variant="outline" className="rounded-lg h-8 px-3" style={{ fontSize: "11px" }}>{current.read ? "Marquer non lu" : "Marquer lu"}</Button>
                  <Button onClick={() => remove(current.id)} variant="outline" className="rounded-lg h-8 w-8 p-0 text-red-600" aria-label="Supprimer"><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
              <p className="text-[var(--ipk-text)] whitespace-pre-wrap" style={{ fontSize: "13px", lineHeight: 1.6 }}>{current.message}</p>
              <div className="mt-4 pt-3 border-t border-[var(--ipk-border)]">
                <a href={`mailto:${current.email}?subject=Re: ${encodeURIComponent(current.subject)}`} className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--ipk-green-dark)] text-white rounded-xl" style={{ fontSize: "13px", fontWeight: 500 }}>
                  <Mail className="w-4 h-4" /> Répondre
                </a>
              </div>
            </div>
          )}
        </DataCard>
      </div>
    </div>
  );
}

// ============= AUDIT LOG =============
const ACTION_TONES: Record<string, "success" | "warn" | "danger" | "neutral"> = {
  update: "neutral", create: "success", approve: "success",
  delete: "danger", archive: "warn", status_change: "neutral", login: "neutral",
};
const ENTITY_LABELS: Record<string, string> = {
  product: "Produit", order: "Commande", review: "Avis", artisan: "Artisan",
  groupement: "Groupement", formation: "Formation", event: "Événement",
  blog: "Article", group_buying: "Offre", message: "Message", settings: "Paramètres",
};

export function AdminAuditPage() {
  useSeo({ title: "Admin — Journal d'audit", noIndex: true });
  const { entries, clear } = useAuditLog();
  const { session } = useAdmin();
  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState<string>("all");
  const [actorFilter, setActorFilter] = useState<string>("all");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 50;

  const entities = useMemo(() => Array.from(new Set(entries.map(e => e.entity))).sort(), [entries]);
  const actors = useMemo(() => Array.from(new Set(entries.map(e => e.actor))).sort(), [entries]);
  const actions = useMemo(() => Array.from(new Set(entries.map(e => e.action))).sort(), [entries]);

  const fromTs = dateFrom ? new Date(dateFrom + "T00:00:00").getTime() : null;
  const toTs = dateTo ? new Date(dateTo + "T23:59:59").getTime() : null;

  const filtered = useMemo(() => entries.filter(e => {
    if (entityFilter !== "all" && e.entity !== entityFilter) return false;
    if (actorFilter !== "all" && e.actor !== actorFilter) return false;
    if (actionFilter !== "all" && e.action !== actionFilter) return false;
    const ts = new Date(e.date).getTime();
    if (fromTs !== null && ts < fromTs) return false;
    if (toTs !== null && ts > toTs) return false;
    if (search.trim()) { const q = search.toLowerCase(); return (e.actor + e.action + e.entity + (e.entityId || "") + (e.details || "")).toLowerCase().includes(q); }
    return true;
  }), [entries, search, entityFilter, actorFilter, actionFilter, fromTs, toTs]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const slice = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const resetFilters = () => { setSearch(""); setEntityFilter("all"); setActorFilter("all"); setActionFilter("all"); setDateFrom(""); setDateTo(""); setPage(1); };
  const hasFilters = search || entityFilter !== "all" || actorFilter !== "all" || actionFilter !== "all" || dateFrom || dateTo;

  return (
    <div>
      <PageHeader title="Journal d'audit" subtitle={`${filtered.length} / ${entries.length} entrée${entries.length > 1 ? "s" : ""} (max 500, plus anciennes purgées)`} action={
        entries.length > 0 ? (
          <div className="flex gap-2">
            <Button onClick={() => { import("../../utils/export-utils").then(m => m.exportCSV(`audit-${new Date().toISOString().slice(0, 10)}.csv`, filtered.map(e => ({ date: e.date, acteur: e.actor, action: e.action, entite: e.entity, id: e.entityId || "", details: e.details || "" })))); toast.success(`${filtered.length} entrée(s) exportée(s)`); }} variant="outline" className="rounded-xl h-10">
              <Download className="w-4 h-4 mr-1" /> Export CSV
            </Button>
            <Button onClick={() => { if (confirm("Effacer tout le journal ?")) { clear(); logAudit({ actor: session?.username || "system", action: "clear", entity: "audit" }); } }} variant="outline" className="rounded-xl h-10 text-red-600">
              <Trash2 className="w-4 h-4 mr-1" /> Effacer
            </Button>
          </div>
        ) : null
      } />

      <AuditHeatmap entries={entries} onPickDate={(d) => { setDateFrom(d); setDateTo(d); setPage(1); }} />

      <DataCard className="mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Acteur, action, ID, détails…" />
          <select value={entityFilter} onChange={e => { setEntityFilter(e.target.value); setPage(1); }} className="bg-[var(--ipk-surface)] border border-[var(--ipk-border)] rounded-xl px-3 h-10" style={{ fontSize: "12px" }} aria-label="Entité">
            <option value="all">Toutes entités</option>
            {entities.map(e => <option key={e} value={e}>{ENTITY_LABELS[e] || e}</option>)}
          </select>
          <select value={actorFilter} onChange={e => { setActorFilter(e.target.value); setPage(1); }} className="bg-[var(--ipk-surface)] border border-[var(--ipk-border)] rounded-xl px-3 h-10" style={{ fontSize: "12px" }} aria-label="Acteur">
            <option value="all">Tous acteurs</option>
            {actors.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={actionFilter} onChange={e => { setActionFilter(e.target.value); setPage(1); }} className="bg-[var(--ipk-surface)] border border-[var(--ipk-border)] rounded-xl px-3 h-10" style={{ fontSize: "12px" }} aria-label="Action">
            <option value="all">Toutes actions</option>
            {actions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <div className="flex gap-2 items-center">
            <label className="text-[var(--ipk-text)] flex-shrink-0" style={{ fontSize: "11px" }}>Du</label>
            <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }} className="bg-[var(--ipk-surface)] border border-[var(--ipk-border)] rounded-xl px-2 h-10 flex-1" style={{ fontSize: "12px" }} aria-label="Date de début" />
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-[var(--ipk-text)] flex-shrink-0" style={{ fontSize: "11px" }}>Au</label>
            <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1); }} className="bg-[var(--ipk-surface)] border border-[var(--ipk-border)] rounded-xl px-2 h-10 flex-1" style={{ fontSize: "12px" }} aria-label="Date de fin" />
          </div>
          {hasFilters && (
            <Button onClick={resetFilters} variant="outline" className="rounded-xl h-10 sm:col-span-2 lg:col-span-2" style={{ fontSize: "12px" }}>Réinitialiser les filtres</Button>
          )}
        </div>
      </DataCard>

      <DataCard>
        {slice.length === 0 ? <EmptyRow message={hasFilters ? "Aucune entrée ne correspond aux filtres." : "Aucune entrée. Les actions admin apparaîtront ici."} /> : (
          <>
            <ul className="divide-y divide-[var(--ipk-border)]">
              {slice.map(e => (
                <li key={e.id} className="py-3 flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-[var(--ipk-text)] mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-[var(--ipk-ink)]" style={{ fontSize: "13px" }}>{e.actor}</span>
                      <StatusPill status={e.action} tone={ACTION_TONES[e.action] || "neutral"} />
                      <StatusPill status={ENTITY_LABELS[e.entity] || e.entity} tone="neutral" />
                      {e.entityId && <span className="font-mono text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>{e.entityId}</span>}
                      <span className="ml-auto text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>{new Date(e.date).toLocaleString("fr-FR")}</span>
                    </div>
                    {e.details && <p className="text-[var(--ipk-text)] mt-1" style={{ fontSize: "12px" }}>{e.details}</p>}
                  </div>
                </li>
              ))}
            </ul>
            {pageCount > 1 && (
              <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-[var(--ipk-border)]">
                <span className="text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>Page {safePage} / {pageCount} — {filtered.length} entrées</span>
                <div className="flex gap-1">
                  <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1} variant="outline" className="rounded-lg h-8 px-3" style={{ fontSize: "12px" }}>Précédent</Button>
                  <Button onClick={() => setPage(p => Math.min(pageCount, p + 1))} disabled={safePage === pageCount} variant="outline" className="rounded-lg h-8 px-3" style={{ fontSize: "12px" }}>Suivant</Button>
                </div>
              </div>
            )}
          </>
        )}
      </DataCard>
    </div>
  );
}

// ============= SETTINGS =============
interface ShopSettings { name: string; email: string; phone: string; address: string; whatsapp: string; deliveryDelay: string; }
interface PromoCode { code: string; label: string; pct: number; }

const DEFAULT_SETTINGS: ShopSettings = {
  name: "IPPOO KRAAFT",
  email: "contact@ipookraaft.com",
  phone: "+228 90 12 34 56",
  whatsapp: "+228 90 12 34 56",
  address: "Lomé, Togo",
  deliveryDelay: "5-10 jours ouvrés",
};

const DEFAULT_PROMOS: PromoCode[] = [
  { code: "IPK10", label: "−10%", pct: 10 },
  { code: "BIENVENUE", label: "−15% nouveau client", pct: 15 },
  { code: "ARTISAN20", label: "−20% artisans", pct: 20 },
];

export function AdminSettingsPage() {
  useSeo({ title: "Admin — Paramètres", noIndex: true });
  const { session } = useAdmin();
  const [settings, setSettings] = useLocalState<ShopSettings>("ipk:admin:settings:v1", DEFAULT_SETTINGS);
  const [promos, setPromos] = useLocalState<PromoCode[]>("ipk:admin:promos:v1", DEFAULT_PROMOS);
  const [draft, setDraft] = useState<ShopSettings>(settings);
  const [newPromo, setNewPromo] = useState<PromoCode>({ code: "", label: "", pct: 10 });

  const saveSettings = () => { setSettings(draft); toast.success("Paramètres enregistrés"); };

  const addPromo = () => {
    const code = newPromo.code.trim().toUpperCase();
    if (!code || !newPromo.label.trim()) { toast.error("Code et libellé requis"); return; }
    if (promos.some(p => p.code === code)) { toast.error("Ce code existe déjà"); return; }
    setPromos(prev => [...prev, { ...newPromo, code }]);
    setNewPromo({ code: "", label: "", pct: 10 });
    toast.success(`Code « ${code} » ajouté`);
  };

  const removePromo = (code: string) => { if (!confirm(`Supprimer le code « ${code} » ?`)) return; setPromos(prev => prev.filter(p => p.code !== code)); toast.success("Code supprimé"); };

  const usage = getStorageUsage();
  const formatBytes = (b: number) => b < 1024 ? `${b} B` : b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} kB` : `${(b / 1024 / 1024).toFixed(2)} MB`;

  const fields: { key: keyof ShopSettings; label: string; type?: string }[] = [
    { key: "name", label: "Nom de la boutique" },
    { key: "email", label: "Email", type: "email" },
    { key: "phone", label: "Téléphone" },
    { key: "whatsapp", label: "WhatsApp" },
    { key: "address", label: "Adresse" },
    { key: "deliveryDelay", label: "Délai de livraison" },
  ];

  return (
    <div>
      <PageHeader title="Paramètres" subtitle="Informations boutique et codes promo" />

      <DataCard className="mb-4">
        <h3 className="mb-4 text-[var(--ipk-ink)]" style={{ fontSize: "15px", fontWeight: 600 }}>Informations boutique</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fields.map(f => (
            <div key={f.key}>
              <label htmlFor={`set-${f.key}`} className="text-[var(--ipk-text)]" style={{ fontSize: "12px", fontWeight: 500 }}>{f.label}</label>
              <input id={`set-${f.key}`} type={f.type || "text"} value={draft[f.key]} onChange={e => setDraft(d => ({ ...d, [f.key]: e.target.value }))} className="w-full mt-1 px-3 py-2 bg-[var(--ipk-surface)] border border-[var(--ipk-border)] rounded-xl" style={{ fontSize: "13px" }} />
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={saveSettings} className="bg-[var(--ipk-green-dark)] text-white rounded-xl h-10 px-4"><Save className="w-4 h-4 mr-2" /> Enregistrer</Button>
        </div>
      </DataCard>

      <CurrencySettingsCard />

      <DataCard className="mb-4">
        <h3 className="mb-3 text-[var(--ipk-ink)] flex items-center gap-2" style={{ fontSize: "15px", fontWeight: 600 }}><Database className="w-4 h-4" /> Sauvegarde & restauration</h3>
        <p className="text-[var(--ipk-text)] mb-3" style={{ fontSize: "12px" }}>Exporte toutes les données admin (paramètres, commandes, codes promo, journal d'audit, messages…) en JSON, ou restaure depuis un fichier précédent.</p>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => { exportAdminBackup(); toast.success("Sauvegarde téléchargée"); }} className="bg-[var(--ipk-green-dark)] text-white rounded-xl h-10 px-4"><Download className="w-4 h-4 mr-1" /> Exporter JSON</Button>
          <label className="inline-flex items-center gap-1 px-4 h-10 border border-[var(--ipk-border)] rounded-xl cursor-pointer hover:bg-[var(--ipk-surface)]" style={{ fontSize: "13px", fontWeight: 500 }}>
            <Upload className="w-4 h-4" /> Importer JSON
            <input type="file" accept="application/json" className="hidden" onChange={async e => {
              const f = e.target.files?.[0]; if (!f) return;
              try {
                const text = await f.text();
                const { restored } = importAdminBackup(text);
                logAudit({ actor: session?.username || "system", action: "restore", entity: "settings", details: `Backup importée — ${restored} clés restaurées` });
                toast.success(`${restored} clés restaurées`, { description: "Rechargez la page pour appliquer." });
              } catch (err) {
                toast.error("Import échoué", { description: (err as Error).message });
              } finally { e.target.value = ""; }
            }} />
          </label>
        </div>
      </DataCard>

      <DataCard className="mb-4">
        <h3 className="mb-3 text-[var(--ipk-ink)]" style={{ fontSize: "15px", fontWeight: 600 }}>Stockage local</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>{formatBytes(usage.bytes)} / {formatBytes(usage.limitBytes)} ({usage.pct.toFixed(1)}%)</span>
          {usage.pct > 80 && <StatusPill status="Critique" tone="danger" />}
          {usage.pct > 50 && usage.pct <= 80 && <StatusPill status="Élevé" tone="warn" />}
        </div>
        <div className="w-full h-2 bg-[var(--ipk-surface)] rounded-full overflow-hidden">
          <div className={`h-full ${usage.pct > 80 ? "bg-red-500" : usage.pct > 50 ? "bg-amber-500" : "bg-[var(--ipk-green-dark)]"}`} style={{ width: `${usage.pct}%` }} />
        </div>
        {usage.perKey.length > 0 && (
          <details className="mt-3">
            <summary className="cursor-pointer text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>Détail par clé ({usage.perKey.length})</summary>
            <ul className="mt-2 space-y-1 max-h-48 overflow-y-auto">
              {usage.perKey.slice(0, 20).map(k => (
                <li key={k.key} className="flex justify-between gap-3" style={{ fontSize: "11px" }}>
                  <code className="font-mono text-[var(--ipk-text)] truncate">{k.key}</code>
                  <span className="text-[var(--ipk-text)] flex-shrink-0">{formatBytes(k.bytes)}</span>
                </li>
              ))}
            </ul>
          </details>
        )}
      </DataCard>

      <OfflineCachePanel />

      <SyncQueuePanel />

      <AlertWebhookPanel />

      <PaymentGatewayPanel />

      <DataCard>
        <h3 className="mb-4 text-[var(--ipk-ink)]" style={{ fontSize: "15px", fontWeight: 600 }}>Codes promo ({promos.length})</h3>
        <ul className="space-y-2 mb-4">
          {promos.length === 0 ? <li><EmptyRow message="Aucun code promo." /></li> : promos.map(p => (
            <li key={p.code} className="flex items-center gap-3 p-3 bg-[var(--ipk-surface)] rounded-xl">
              <span className="font-mono px-2 py-1 bg-white rounded border border-[var(--ipk-border)]" style={{ fontSize: "12px", fontWeight: 600 }}>{p.code}</span>
              <span className="text-[var(--ipk-ink)] flex-1 truncate" style={{ fontSize: "13px" }}>{p.label}</span>
              <StatusPill status={`-${p.pct}%`} tone="success" />
              <Button onClick={() => removePromo(p.code)} variant="outline" className="rounded-lg h-8 w-8 p-0 text-red-600" aria-label="Supprimer"><Trash2 className="w-3.5 h-3.5" /></Button>
            </li>
          ))}
        </ul>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-3 border-t border-[var(--ipk-border)]">
          <input value={newPromo.code} onChange={e => setNewPromo(p => ({ ...p, code: e.target.value }))} placeholder="CODE" className="px-3 py-2 bg-[var(--ipk-surface)] border border-[var(--ipk-border)] rounded-xl font-mono uppercase" style={{ fontSize: "13px" }} />
          <input value={newPromo.label} onChange={e => setNewPromo(p => ({ ...p, label: e.target.value }))} placeholder="Libellé" className="px-3 py-2 bg-[var(--ipk-surface)] border border-[var(--ipk-border)] rounded-xl sm:col-span-2" style={{ fontSize: "13px" }} />
          <div className="flex gap-2">
            <NumberInput value={newPromo.pct} onChange={v => setNewPromo(p => ({ ...p, pct: v }))} min={1} max={90} integer className="w-16 bg-[var(--ipk-surface)]" ariaLabel="Pourcentage" />
            <Button onClick={addPromo} className="bg-[var(--ipk-green-dark)] text-white rounded-xl h-10 px-3 flex-1"><Plus className="w-4 h-4" /></Button>
          </div>
        </div>
      </DataCard>
    </div>
  );
}

function AuditHeatmap({ entries, onPickDate }: { entries: { date: string }[]; onPickDate: (iso: string) => void }) {
  const WEEKS = 12;
  const data = useMemo(() => {
    const byDay = new Map<string, number>();
    for (const e of entries) {
      const d = new Date(e.date);
      const k = d.toISOString().slice(0, 10);
      byDay.set(k, (byDay.get(k) || 0) + 1);
    }
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const startOffset = today.getDay() === 0 ? 6 : today.getDay() - 1;
    const lastMonday = new Date(today); lastMonday.setDate(today.getDate() - startOffset);
    const cells: { iso: string; count: number; isFuture: boolean }[][] = [];
    for (let w = WEEKS - 1; w >= 0; w--) {
      const col: { iso: string; count: number; isFuture: boolean }[] = [];
      for (let d = 0; d < 7; d++) {
        const day = new Date(lastMonday); day.setDate(lastMonday.getDate() - w * 7 + d);
        const iso = day.toISOString().slice(0, 10);
        col.push({ iso, count: byDay.get(iso) || 0, isFuture: day.getTime() > today.getTime() });
      }
      cells.push(col);
    }
    const max = Math.max(1, ...Array.from(byDay.values()));
    return { cells, max };
  }, [entries]);

  const tone = (count: number, isFuture: boolean) => {
    if (isFuture) return "bg-transparent";
    if (count === 0) return "bg-[var(--ipk-surface)]";
    const ratio = count / data.max;
    if (ratio > 0.66) return "bg-[var(--ipk-green-dark)]";
    if (ratio > 0.33) return "bg-[var(--ipk-green)]";
    return "bg-emerald-200";
  };

  return (
    <DataCard className="mb-4">
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <h3 className="text-[var(--ipk-ink)]" style={{ fontSize: "15px", fontWeight: 600 }}>Activité — 12 dernières semaines</h3>
        <div className="flex items-center gap-1 text-[var(--ipk-text)]" style={{ fontSize: "10px" }}>
          <span>moins</span>
          <span className="w-3 h-3 rounded-sm bg-[var(--ipk-surface)] border border-[var(--ipk-border)]" />
          <span className="w-3 h-3 rounded-sm bg-emerald-200" />
          <span className="w-3 h-3 rounded-sm bg-[var(--ipk-green)]" />
          <span className="w-3 h-3 rounded-sm bg-[var(--ipk-green-dark)]" />
          <span>plus</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="inline-flex gap-1">
          {data.cells.map((col, i) => (
            <div key={i} className="flex flex-col gap-1">
              {col.map(c => (
                <button
                  key={c.iso}
                  onClick={() => !c.isFuture && c.count > 0 && onPickDate(c.iso)}
                  disabled={c.isFuture || c.count === 0}
                  className={`w-3.5 h-3.5 rounded-sm ${tone(c.count, c.isFuture)} ${!c.isFuture && c.count > 0 ? "hover:ring-2 hover:ring-[var(--ipk-ink)] cursor-pointer" : "cursor-default"} transition`}
                  title={c.isFuture ? "" : `${new Date(c.iso).toLocaleDateString("fr-FR")} — ${c.count} événement${c.count > 1 ? "s" : ""}`}
                  aria-label={`${c.iso}: ${c.count} événements`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </DataCard>
  );
}

function OfflineCachePanel() {
  const [registered, setRegistered] = useState<boolean | null>(null);
  const [cacheBytes, setCacheBytes] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) { setRegistered(false); return; }
    const reg = await navigator.serviceWorker.getRegistration();
    setRegistered(!!reg);
    if ("caches" in window) {
      try {
        const keys = await caches.keys();
        let total = 0;
        for (const k of keys) {
          const c = await caches.open(k);
          const reqs = await c.keys();
          for (const r of reqs) {
            const res = await c.match(r);
            if (res) { const buf = await res.clone().arrayBuffer(); total += buf.byteLength; }
          }
        }
        setCacheBytes(total);
      } catch { setCacheBytes(null); }
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const clearCache = async () => {
    if (!confirm("Vider le cache hors-ligne et recharger ? Les bundles seront re-téléchargés.")) return;
    setBusy(true);
    try {
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
      const reg = await navigator.serviceWorker?.getRegistration();
      if (reg?.waiting) reg.waiting.postMessage("skipWaiting");
      toast.success("Cache vidé — rechargement…");
      setTimeout(() => window.location.reload(), 600);
    } catch (err) {
      toast.error("Échec", { description: (err as Error).message });
      setBusy(false);
    }
  };

  const unregister = async () => {
    if (!confirm("Désinscrire le Service Worker ? Le mode hors-ligne sera désactivé jusqu'au prochain rechargement.")) return;
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker?.getRegistration();
      if (reg) await reg.unregister();
      toast.success("Service Worker désinscrit");
      void refresh();
    } finally { setBusy(false); }
  };

  const fmt = (b: number) => b < 1024 ? `${b} B` : b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} kB` : `${(b / 1024 / 1024).toFixed(2)} MB`;

  return (
    <DataCard className="mb-4">
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <h3 className="text-[var(--ipk-ink)] flex items-center gap-2" style={{ fontSize: "15px", fontWeight: 600 }}>
          <HardDrive className="w-4 h-4" /> Cache hors-ligne
        </h3>
        <StatusPill status={registered === null ? "…" : registered ? "Actif" : "Inactif"} tone={registered ? "success" : "neutral"} />
      </div>
      <p className="text-[var(--ipk-text)] mb-3" style={{ fontSize: "12px" }}>
        Le Service Worker met en cache les bundles JS/CSS et assets pour permettre l'usage de l'admin hors-ligne. {cacheBytes !== null && <>Taille actuelle : <span className="font-medium">{fmt(cacheBytes)}</span>.</>}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button onClick={refresh} variant="outline" className="rounded-xl h-9 px-3" style={{ fontSize: "12px" }} disabled={busy}><RefreshCw className="w-3.5 h-3.5 mr-1" /> Rafraîchir</Button>
        <Button onClick={clearCache} variant="outline" className="rounded-xl h-9 px-3 text-red-600" style={{ fontSize: "12px" }} disabled={busy || !registered}>Vider le cache & recharger</Button>
        {registered && <Button onClick={unregister} variant="outline" className="rounded-xl h-9 px-3" style={{ fontSize: "12px" }} disabled={busy}>Désinscrire le SW</Button>}
      </div>
    </DataCard>
  );
}

function PaymentGatewayPanel() {
  const initial = getGatewayConfig();
  const [url, setUrl] = useState(initial.url);
  const [publicKey, setPublicKey] = useState(initial.publicKey);
  const [testing, setTesting] = useState(false);

  const save = () => {
    setGatewayConfig({ url: url.trim(), publicKey: publicKey.trim() });
    logAudit({ actor: "system", action: "payment_gateway_config", entity: "settings", details: url ? `Gateway: ${url}` : "Gateway désactivée (mock)" });
    toast.success(url ? "Gateway de paiement configurée" : "Gateway désactivée — mode mock actif");
  };

  const test = async () => {
    if (!url.trim()) { toast.error("URL requise pour tester"); return; }
    setTesting(true);
    const tid = toast.loading("Test de connexion…");
    try {
      const res = await fetch(url.trim(), {
        method: "OPTIONS",
        headers: publicKey.trim() ? { "Authorization": `Bearer ${publicKey.trim()}` } : undefined,
      });
      if (res.ok || res.status === 204) toast.success(`Connexion OK (${res.status})`, { id: tid });
      else toast.warning(`Réponse HTTP ${res.status}`, { id: tid });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur réseau", { id: tid });
    } finally { setTesting(false); }
  };

  return (
    <DataCard className="mb-4">
      <h3 className="mb-3 text-[var(--ipk-ink)] flex items-center gap-2" style={{ fontSize: "15px", fontWeight: 600 }}>
        <CreditCard className="w-4 h-4" /> Passerelle de paiement
      </h3>
      <p className="text-[var(--ipk-text)] mb-3" style={{ fontSize: "12px" }}>
        Configurez l'URL et la clé publique de votre passerelle (CinetPay, Paydunya, Stripe…). Sans configuration, un processeur mock simule les paiements (taux de succès 88-92%).
      </p>
      <div className="space-y-3">
        <div>
          <label className="text-[var(--ipk-text)]" style={{ fontSize: "12px", fontWeight: 500 }}>URL de la gateway</label>
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://api.cinetpay.com/v2/payment" className="w-full mt-1 px-3 py-2 bg-[var(--ipk-surface)] border border-[var(--ipk-border)] rounded-xl font-mono" style={{ fontSize: "12px" }} />
        </div>
        <div>
          <label className="text-[var(--ipk-text)]" style={{ fontSize: "12px", fontWeight: 500 }}>Clé publique / API key</label>
          <input value={publicKey} onChange={e => setPublicKey(e.target.value)} placeholder="pk_live_…" type="password" className="w-full mt-1 px-3 py-2 bg-[var(--ipk-surface)] border border-[var(--ipk-border)] rounded-xl font-mono" style={{ fontSize: "12px" }} />
          <p className="mt-1 text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>Envoyée comme header <code>Authorization: Bearer …</code></p>
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button onClick={test} variant="outline" disabled={testing} className="rounded-xl h-10 px-4">
          {testing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Wifi className="w-4 h-4 mr-2" />} Tester
        </Button>
        <Button onClick={save} className="bg-[var(--ipk-green-dark)] text-white rounded-xl h-10 px-4">
          <Save className="w-4 h-4 mr-2" /> Enregistrer
        </Button>
      </div>
    </DataCard>
  );
}

function AlertWebhookPanel() {
  const { url, setUrl, actions, setActions, enabled, setEnabled, save, test } = useAlertWebhookSettings();
  const [busy, setBusy] = useState(false);
  const ALL_ACTIONS = Array.from(new Set([...DEFAULT_CRITICAL_ACTIONS, "create", "update", "approve", "status_change", "login"]));

  const toggleAction = (a: string) => setActions(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  const onSave = () => {
    const trimmed = url.trim();
    if (enabled && trimmed && !/^https?:\/\//i.test(trimmed)) { toast.error("URL invalide (http(s) requis)"); return; }
    save();
    toast.success(enabled && trimmed ? "Webhook actif" : "Webhook désactivé");
  };
  const onTest = async () => {
    if (!url.trim()) { toast.error("Saisissez une URL d'abord"); return; }
    setBusy(true);
    try { await test(); toast.success("Test envoyé avec succès"); }
    catch (err) { toast.error("Échec du test", { description: (err as Error).message }); }
    finally { setBusy(false); }
  };

  return (
    <DataCard className="mb-4">
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <h3 className="text-[var(--ipk-ink)] flex items-center gap-2" style={{ fontSize: "15px", fontWeight: 600 }}>
          <Bell className="w-4 h-4" /> Webhook d'alerte
        </h3>
        <label className="flex items-center gap-2 cursor-pointer" style={{ fontSize: "12px" }}>
          <input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} className="w-4 h-4" />
          Activé
        </label>
      </div>
      <p className="text-[var(--ipk-text)] mb-3" style={{ fontSize: "12px" }}>
        Envoie un POST JSON à votre URL (Slack, Discord, n8n, Zapier…) à chaque action critique loguée. Dédup 2s sur la même opération.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2 mb-3">
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://hooks.slack.com/services/…"
          className="border border-[var(--ipk-border)] rounded-xl px-3 h-9 bg-white"
          style={{ fontSize: "12px" }}
          aria-label="URL webhook"
        />
        <Button onClick={onSave} variant="outline" className="rounded-xl h-9 px-3" style={{ fontSize: "12px" }}>Enregistrer</Button>
        <Button onClick={onTest} disabled={busy || !url.trim()} variant="outline" className="rounded-xl h-9 px-3" style={{ fontSize: "12px" }}>{busy ? "Envoi…" : "Tester"}</Button>
      </div>
      <div>
        <p className="text-[var(--ipk-text)] mb-2" style={{ fontSize: "11px", fontWeight: 500 }}>Actions surveillées</p>
        <div className="flex flex-wrap gap-1">
          {ALL_ACTIONS.map(a => {
            const on = actions.includes(a);
            return (
              <button key={a} onClick={() => toggleAction(a)} className={`px-2.5 py-1 rounded-full border ${on ? "bg-[var(--ipk-green-dark)] text-white border-[var(--ipk-green-dark)]" : "bg-[var(--ipk-surface)] text-[var(--ipk-text)] border-[var(--ipk-border)]"}`} style={{ fontSize: "11px", fontWeight: 500 }}>
                {a}
              </button>
            );
          })}
        </div>
      </div>
    </DataCard>
  );
}

const OP_LABELS: Record<string, string> = { create: "Création", update: "Mise à jour", delete: "Suppression", status_change: "Changement statut" };
const ENTITY_LABELS_SYNC: Record<string, string> = { product: "Produit", order: "Commande", artisan: "Artisan", groupement: "Groupement", formation: "Formation", event: "Événement", blog: "Article", groupbuy: "Achat groupé", review: "Avis", message: "Message", promo: "Code promo" };

function SyncQueuePanel() {
  const { isOnline, queue, pendingCount, failedCount, conflictCount, failures, flush, clearAll, removeEntry, retryEntry, clearFailureLog } = useSyncQueue();
  const tone = !isOnline ? "danger" : conflictCount > 0 || failedCount > 0 ? "danger" : pendingCount > 0 ? "warn" : "success";
  const [endpoint, setEndpoint] = useState(() => getSyncEndpoint());
  const [auth, setAuth] = useState(() => getSyncAuth());
  const saveEndpoint = () => {
    const trimmed = endpoint.trim();
    if (trimmed && !/^https?:\/\//i.test(trimmed)) { toast.error("URL invalide (http(s) requis)"); return; }
    setSyncEndpoint(trimmed);
    setSyncAuth(auth.trim());
    toast.success(trimmed ? "Endpoint enregistré" : "Endpoint réinitialisé (mode démo)");
  };

  return (
    <DataCard className="mb-4">
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <h3 className="text-[var(--ipk-ink)] flex items-center gap-2" style={{ fontSize: "15px", fontWeight: 600 }}>
          {isOnline ? <Wifi className="w-4 h-4 text-emerald-600" /> : <WifiOff className="w-4 h-4 text-amber-600" />}
          File de synchronisation
        </h3>
        <StatusPill status={!isOnline ? "Hors-ligne" : conflictCount > 0 ? `${conflictCount} conflit(s)` : pendingCount > 0 ? `${pendingCount} en attente` : failedCount > 0 ? `${failedCount} échec(s)` : "À jour"} tone={tone} />
      </div>
      <p className="text-[var(--ipk-text)] mb-3" style={{ fontSize: "12px" }}>
        Les modifications faites hors-ligne sont mises en file et rejouées automatiquement à la reconnexion. {endpoint ? <>Envoi vers <span className="font-mono">{endpoint}</span> via POST JSON.</> : <>Aucun endpoint configuré — l'envoi est simulé (90% de réussite, 200–700 ms).</>}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 mb-3">
        <input
          type="url"
          value={endpoint}
          onChange={e => setEndpoint(e.target.value)}
          placeholder="https://api.exemple.com/sync"
          className="border border-[var(--ipk-border)] rounded-xl px-3 h-9 bg-white"
          style={{ fontSize: "12px" }}
          aria-label="URL endpoint"
        />
        <input
          type="text"
          value={auth}
          onChange={e => setAuth(e.target.value)}
          placeholder="Authorization (token ou Bearer …)"
          className="border border-[var(--ipk-border)] rounded-xl px-3 h-9 bg-white font-mono"
          style={{ fontSize: "12px" }}
          aria-label="Header Authorization"
        />
        <Button onClick={saveEndpoint} variant="outline" className="rounded-xl h-9 px-3" style={{ fontSize: "12px" }}>Enregistrer</Button>
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        <Button onClick={flush} disabled={!isOnline || pendingCount + failedCount === 0} className="bg-[var(--ipk-green-dark)] text-white rounded-xl h-9 px-3 disabled:opacity-50" style={{ fontSize: "12px" }}><RefreshCw className="w-3.5 h-3.5 mr-1" /> Forcer la synchro</Button>
        {queue.length > 0 && <Button onClick={clearAll} variant="outline" className="rounded-xl h-9 px-3 text-red-600" style={{ fontSize: "12px" }}>Vider la file</Button>}
      </div>
      {queue.length === 0 ? (
        <div className="text-[var(--ipk-text)] py-4 text-center" style={{ fontSize: "13px" }}>Aucune opération en attente.</div>
      ) : (
        <div className="overflow-x-auto -mx-5 px-5 max-h-72 overflow-y-auto">
          <table className="w-full" style={{ fontSize: "12px" }}>
            <thead className="text-[var(--ipk-text)] border-b border-[var(--ipk-border)] sticky top-0 bg-white">
              <tr>
                <th className="text-left py-2 font-medium">Opération</th>
                <th className="text-left py-2 font-medium">Entité</th>
                <th className="text-left py-2 font-medium hidden sm:table-cell">ID</th>
                <th className="text-left py-2 font-medium">Statut</th>
                <th className="text-right py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {queue.slice(0, 50).map(e => (
                <tr key={e.id} className="border-b border-[var(--ipk-border)] last:border-0">
                  <td className="py-2 pr-2">{OP_LABELS[e.op] || e.op}</td>
                  <td className="py-2 pr-2">{ENTITY_LABELS_SYNC[e.entity] || e.entity}</td>
                  <td className="py-2 pr-2 font-mono text-[var(--ipk-text)] truncate max-w-[120px] hidden sm:table-cell" style={{ fontSize: "11px" }}>{e.entityId}</td>
                  <td className="py-2 pr-2">
                    {e.status === "pending" && <StatusPill status="En attente" tone="warn" />}
                    {e.status === "syncing" && <span className="inline-flex items-center gap-1 text-blue-600"><RefreshCw className="w-3 h-3 animate-spin" /> En cours</span>}
                    {e.status === "conflict" && (
                      <span className="inline-flex items-center gap-1 text-orange-600" title={e.lastError}><AlertTriangle className="w-3 h-3" /> Conflit (409)</span>
                    )}
                    {e.status === "failed" && (
                      <span className="inline-flex flex-col items-start text-red-600" title={e.lastError}>
                        <span className="inline-flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Échec ({e.attempts})</span>
                        {e.nextAttemptAt && new Date(e.nextAttemptAt).getTime() > Date.now() && (
                          <span className="text-[var(--ipk-text)]" style={{ fontSize: "10px" }}>retry {new Date(e.nextAttemptAt).toLocaleTimeString("fr-FR")}</span>
                        )}
                      </span>
                    )}
                  </td>
                  <td className="py-2 text-right whitespace-nowrap">
                    {(e.status === "failed" || e.status === "conflict") && <Button onClick={() => retryEntry(e.id)} variant="outline" className="rounded-lg h-7 px-2 mr-1" style={{ fontSize: "11px" }}>Réessayer</Button>}
                    <Button onClick={() => removeEntry(e.id)} variant="outline" className="rounded-lg h-7 w-7 p-0 text-red-600" aria-label="Retirer"><Trash2 className="w-3 h-3" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {failures.length > 0 && (
        <details className="mt-4 pt-3 border-t border-[var(--ipk-border)]">
          <summary className="cursor-pointer flex items-center gap-2 text-[var(--ipk-ink)]" style={{ fontSize: "13px", fontWeight: 500 }}>
            <History className="w-4 h-4" /> Historique des échecs ({failures.length})
            <button onClick={(e) => { e.preventDefault(); if (confirm("Vider l'historique des échecs ?")) clearFailureLog(); }} className="ml-auto text-red-600 hover:underline" style={{ fontSize: "11px" }}>Vider</button>
          </summary>
          <ul className="mt-2 space-y-1 max-h-64 overflow-y-auto">
            {failures.map(f => (
              <li key={f.id} className="flex items-start gap-2 py-1.5 px-2 rounded hover:bg-[var(--ipk-surface)]" style={{ fontSize: "11px" }}>
                <StatusPill status={f.kind === "conflict" ? "Conflit" : "Épuisé"} tone={f.kind === "conflict" ? "warn" : "danger"} />
                <span className="text-[var(--ipk-ink)]">{OP_LABELS[f.op] || f.op}</span>
                <span className="text-[var(--ipk-text)]">{ENTITY_LABELS_SYNC[f.entity] || f.entity}</span>
                <span className="font-mono text-[var(--ipk-text)] truncate max-w-[140px]">{f.entityId}</span>
                <span className="text-red-600 truncate flex-1" title={f.reason}>{f.reason}</span>
                <span className="ml-auto text-[var(--ipk-text)] flex-shrink-0">{new Date(f.failedAt).toLocaleString("fr-FR")}</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </DataCard>
  );
}


function CurrencySettingsCard() {
  const { config, save } = useCurrencyConfig();
  const codes = Object.keys(DEFAULT_CURRENCIES) as CurrencyCode[];
  const isEnabled = (c: CurrencyCode) => config.enabled.includes(c);

  const toggle = (c: CurrencyCode) => {
    const next = isEnabled(c) ? config.enabled.filter(x => x !== c) : [...config.enabled, c];
    if (next.length === 0) { toast.error("Au moins une devise doit rester activée"); return; }
    if (!next.includes("XOF")) next.unshift("XOF");
    save({ ...config, enabled: next });
    logAudit({ actor: "system", action: "update", entity: "settings", details: `Devises actives : ${next.join(", ")}` });
  };

  const setRate = (c: CurrencyCode, rate: number) => {
    if (rate <= 0) return;
    save({ ...config, rates: { ...config.rates, [c]: rate } });
  };

  const resetRate = (c: CurrencyCode) => {
    const next = { ...config.rates };
    delete next[c];
    save({ ...config, rates: next });
    toast.success(`Taux ${c} remis par défaut`);
  };

  return (
    <DataCard className="mb-4">
      <h3 className="mb-3 text-[var(--ipk-ink)] flex items-center gap-2" style={{ fontSize: "15px", fontWeight: 600 }}><Globe className="w-4 h-4" /> Devises & taux de change</h3>
      <p className="text-[var(--ipk-text)] mb-3" style={{ fontSize: "12px" }}>Sélectionnez les devises disponibles côté boutique. Les taux sont exprimés en « 1 XOF = X devise ». Le franc CFA reste la devise de référence stockée.</p>
      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full" style={{ fontSize: "13px" }}>
          <thead className="text-[var(--ipk-text)] border-b border-[var(--ipk-border)]">
            <tr>
              <th className="text-left py-2 font-medium">Active</th>
              <th className="text-left py-2 font-medium">Devise</th>
              <th className="text-left py-2 font-medium">Symbole</th>
              <th className="text-right py-2 font-medium">Taux (1 XOF =)</th>
              <th className="text-right py-2 font-medium">Aperçu (10 000 XOF)</th>
              <th className="text-right py-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {codes.map(c => {
              const def = DEFAULT_CURRENCIES[c];
              const rate = config.rates[c] ?? def.rateFromXOF;
              const preview = (10000 * rate);
              const previewFmt = c === "XOF"
                ? `${Math.round(preview).toLocaleString("fr-FR")} ${def.symbol}`
                : `${def.symbol}${preview.toLocaleString("fr-FR", { minimumFractionDigits: def.decimals, maximumFractionDigits: def.decimals })}`;
              const overridden = config.rates[c] !== undefined;
              return (
                <tr key={c} className="border-b border-[var(--ipk-border)] last:border-0">
                  <td className="py-3 pr-2"><input type="checkbox" checked={isEnabled(c)} onChange={() => toggle(c)} disabled={c === "XOF"} aria-label={`Activer ${c}`} /></td>
                  <td className="py-3 pr-2"><span className="font-medium text-[var(--ipk-ink)]">{def.label}</span> <span className="text-[var(--ipk-text)] font-mono ml-1" style={{ fontSize: "11px" }}>{c}</span></td>
                  <td className="py-3 pr-2 font-mono">{def.symbol}</td>
                  <td className="py-3 pr-2 text-right">
                    <input type="number" step="0.00001" min="0" value={rate} onChange={e => setRate(c, Number(e.target.value))} disabled={c === "XOF"} className="w-28 border border-[var(--ipk-border)] rounded-lg px-2 py-1 text-right disabled:opacity-50 font-mono" style={{ fontSize: "12px" }} />
                  </td>
                  <td className="py-3 pr-2 text-right text-[var(--ipk-text)]">{previewFmt}</td>
                  <td className="py-3 text-right">
                    {overridden && c !== "XOF" ? (
                      <button onClick={() => resetRate(c)} className="text-[var(--ipk-blue)] hover:underline" style={{ fontSize: "12px" }}>Réinitialiser</button>
                    ) : <span className="text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>{c === "XOF" ? "Référence" : "Taux par défaut"}</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-[var(--ipk-text)] mt-3" style={{ fontSize: "11px" }}>Note : les taux ne sont pas mis à jour automatiquement. Pensez à les rafraîchir périodiquement selon le marché.</p>
    </DataCard>
  );
}
