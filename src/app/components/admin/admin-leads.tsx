import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Circle, Inbox, Mail, Phone, Search, Trash2, Download } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { useLeads, type LeadType } from "../../hooks/use-leads";
import { useConfirm } from "../../hooks/use-confirm";
import { EmptyState } from "../empty-state";
import { toast } from "sonner";

const LEAD_TYPE_LABELS: Record<LeadType, string> = {
  quote: "Devis",
  order_groupement: "Commande groupement",
  partner: "Partenariat",
  event_invite: "Invitation événement",
  newsletter: "Newsletter",
  formation_signup: "Inscription formation",
  brochure: "Brochure",
  notify_groupbuy: "Notif. achat groupé",
  showroom_visit: "Visite showroom",
  contact: "Contact",
  blog_like: "Like article",
};

const TYPE_COLORS: Record<LeadType, string> = {
  quote: "bg-blue-100 text-blue-700",
  order_groupement: "bg-emerald-100 text-emerald-700",
  partner: "bg-purple-100 text-purple-700",
  event_invite: "bg-orange-100 text-orange-700",
  newsletter: "bg-amber-100 text-amber-700",
  formation_signup: "bg-cyan-100 text-cyan-700",
  brochure: "bg-slate-100 text-slate-700",
  notify_groupbuy: "bg-pink-100 text-pink-700",
  showroom_visit: "bg-indigo-100 text-indigo-700",
  contact: "bg-gray-100 text-gray-700",
  blog_like: "bg-rose-100 text-rose-700",
};

export function AdminLeadsPage() {
  const { leads, removeLead, markAllRead, toggleProcessed, unreadCount, pendingCount } = useLeads();
  const confirm = useConfirm();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<LeadType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "processed">("pending");

  useEffect(() => { if (unreadCount > 0) markAllRead(); }, [unreadCount, markAllRead]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter(l => {
      if (statusFilter === "pending" && l.processed) return false;
      if (statusFilter === "processed" && !l.processed) return false;
      if (typeFilter !== "all" && l.type !== typeFilter) return false;
      if (!q) return true;
      return [l.name, l.email, l.phone, l.message, l.refLabel, l.ref].some(v => (v || "").toLowerCase().includes(q));
    });
  }, [leads, query, typeFilter, statusFilter]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const l of leads) map.set(l.type, (map.get(l.type) || 0) + 1);
    return map;
  }, [leads]);

  const exportCsv = () => {
    if (filtered.length === 0) { toast.info("Aucune donnée à exporter"); return; }
    const header = ["id", "type", "ref", "refLabel", "name", "email", "phone", "message", "createdAt"];
    const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = filtered.map(l => header.map(h => escape((l as Record<string, unknown>)[h])).join(","));
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `ipk-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  const onDelete = async (id: string) => {
    const ok = await confirm({ title: "Supprimer cette demande ?", message: "Action irréversible.", confirmLabel: "Supprimer", tone: "danger" });
    if (!ok) return;
    removeLead(id);
    toast.success("Demande supprimée");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-medium flex items-center gap-2"><Inbox className="w-5 h-5" /> Demandes captées</h1>
          <p className="text-sm text-muted-foreground">{leads.length} demande{leads.length > 1 ? "s" : ""} · {pendingCount} à traiter</p>
        </div>
        <Button variant="outline" onClick={exportCsv} className="gap-2"><Download className="w-4 h-4" /> Export CSV</Button>
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm">Filtres</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Recherche nom, email, message, référence…" className="pl-9" />
          </div>
          <div className="flex flex-wrap gap-1.5 pb-2 border-b border-border">
            {([
              { v: "pending" as const, label: `À traiter (${pendingCount})` },
              { v: "processed" as const, label: `Traités (${leads.length - pendingCount})` },
              { v: "all" as const, label: `Tous (${leads.length})` },
            ]).map(o => (
              <button
                key={o.v}
                onClick={() => setStatusFilter(o.v)}
                className={`px-2.5 py-1 rounded-full border text-xs ${statusFilter === o.v ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground"}`}
              >
                {o.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setTypeFilter("all")}
              className={`px-2.5 py-1 rounded-full border text-xs ${typeFilter === "all" ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground"}`}
            >
              Tous ({leads.length})
            </button>
            {(Object.keys(LEAD_TYPE_LABELS) as LeadType[]).map(t => {
              const c = counts.get(t) || 0;
              if (c === 0) return null;
              return (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-2.5 py-1 rounded-full border text-xs ${typeFilter === t ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground"}`}
                >
                  {LEAD_TYPE_LABELS[t]} ({c})
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState title="Aucune demande" message="Aucune demande ne correspond à ces filtres." />
      ) : (
        <div className="space-y-2">
          {filtered.map(lead => (
            <Card key={lead.id} className={lead.processed ? "opacity-60" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge className={`${TYPE_COLORS[lead.type]} border-0`}>{LEAD_TYPE_LABELS[lead.type]}</Badge>
                      {lead.refLabel && <span className="text-xs text-muted-foreground truncate">→ {lead.refLabel}</span>}
                      <span className="text-xs text-muted-foreground">{new Date(lead.createdAt).toLocaleString("fr-FR")}</span>
                    </div>
                    {lead.name && <div className="font-medium text-sm">{lead.name}</div>}
                    <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-muted-foreground">
                      {lead.email && (
                        <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-foreground"><Mail className="w-3 h-3" />{lead.email}</a>
                      )}
                      {lead.phone && (
                        <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-foreground"><Phone className="w-3 h-3" />{lead.phone}</a>
                      )}
                    </div>
                    {lead.message && <p className="text-sm mt-2 text-muted-foreground whitespace-pre-wrap">{lead.message}</p>}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant={lead.processed ? "default" : "outline"}
                      size="sm"
                      onClick={() => { toggleProcessed(lead.id); toast.success(lead.processed ? "Remis à traiter" : "Marqué comme traité"); }}
                      className="gap-1"
                    >
                      {lead.processed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                      {lead.processed ? "Traité" : "À traiter"}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(lead.id)} aria-label="Supprimer">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
