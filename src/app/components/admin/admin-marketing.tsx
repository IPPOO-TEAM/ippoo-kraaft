import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid } from "recharts";
import { Tag, Gift, Trophy, Ticket as TicketIcon, Sparkles, Coins, Calendar, Mail, Trash2, Plus, Pencil, Power, X, Megaphone, Clock, StopCircle, Dice5, Award, Lock, Unlock, Ban, PlusCircle, User, Settings, RotateCcw, Minus } from "lucide-react";
import { useMarketing, type LoyaltyTxn } from "../../hooks/use-marketing";
import { useAuditLog } from "../../hooks/use-admin-audit";
import { Download, Bell } from "lucide-react";
import { CONTEST_KIND_LABEL, CONTEST_RANKING_LABEL, type Promotion, type FlashDeal, type Contest, type ContestKind, type ContestRanking, type CouponTheme, type CouponPattern, type PromotionKind, type PromotionSegment, type GiftTicket, type MarketDay, type WheelPrize } from "../../data/marketing-data";
import { useSeo } from "../../hooks/use-seo";
import { PageHeader, DataCard, SearchInput, StatusPill, EmptyRow } from "./admin-shared";
import { toast } from "sonner";

type Tab = "overview" | "promotions" | "flash" | "contests" | "giftcards" | "tickets" | "loyalty" | "marketdays" | "wheel" | "transverse" | "journal";

const TABS: Array<{ key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { key: "overview", label: "Vue d'ensemble", icon: Sparkles },
  { key: "promotions", label: "Promotions", icon: Tag },
  { key: "flash", label: "Ventes flash", icon: Sparkles },
  { key: "contests", label: "Concours", icon: Trophy },
  { key: "giftcards", label: "Cartes cadeaux", icon: Gift },
  { key: "tickets", label: "Tickets", icon: TicketIcon },
  { key: "loyalty", label: "Fidélité", icon: Coins },
  { key: "marketdays", label: "Jour de marché", icon: Calendar },
  { key: "wheel", label: "Roue", icon: Dice5 },
  { key: "transverse", label: "Export & Push", icon: Megaphone },
  { key: "journal", label: "Journal", icon: Clock },
];

function fmt(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n);
}
function fmtDate(iso: string) {
  try { return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }); } catch { return iso; }
}

export function AdminMarketingPage() {
  useSeo({ title: "Admin — Marketing", noIndex: true });
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div>
      <PageHeader title="Marketing" subtitle="Promotions, concours, cartes cadeaux, fidélité, jours de marché" />

      <DataCard className="mb-4">
        <div className="flex flex-wrap gap-1.5">
          {TABS.map(t => {
            const active = tab === t.key;
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${active ? "bg-[var(--ipk-green-dark)] text-white" : "bg-[var(--ipk-surface)] text-[var(--ipk-text)] hover:bg-[var(--ipk-border)]/50"}`}
                style={{ fontSize: "12px", fontWeight: 500 }}
              >
                <Icon className="w-3.5 h-3.5" /> {t.label}
              </button>
            );
          })}
        </div>
      </DataCard>

      {tab === "overview" && <OverviewTab />}
      {tab === "promotions" && <PromotionsTab />}
      {tab === "flash" && <FlashTab />}
      {tab === "contests" && <ContestsTab />}
      {tab === "giftcards" && <GiftCardsTab />}
      {tab === "tickets" && <TicketsTab />}
      {tab === "loyalty" && <LoyaltyTab />}
      {tab === "marketdays" && <MarketDaysTab />}
      {tab === "wheel" && <WheelTab />}
      {tab === "transverse" && <TransverseTab />}
      {tab === "journal" && <JournalTab />}
    </div>
  );
}

function Kpi({ label, value, hint, tone = "default" }: { label: string; value: string | number; hint?: string; tone?: "default" | "success" | "warn" }) {
  const color = tone === "success" ? "text-emerald-700" : tone === "warn" ? "text-amber-700" : "text-[var(--ipk-ink)]";
  return (
    <div className="p-4 rounded-2xl bg-white border border-[var(--ipk-border)]">
      <div className="text-[var(--ipk-text-muted)]" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
      <div className={`mt-1 ${color}`} style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: 700 }}>{value}</div>
      {hint && <div className="text-[var(--ipk-text-muted)] mt-0.5" style={{ fontSize: "11px" }}>{hint}</div>}
    </div>
  );
}

function OverviewTab() {
  const { giftCards, tickets, contestEntries, loyaltyPoints, loyaltyHistory, promotions, flashDeals, contests, marketDays, wheelStats, wheelPrizes, loyaltyUsers } = useMarketing();
  const today = new Date();
  const md = marketDays.find(d => new Date(d.date).toDateString() === today.toDateString());
  const activePromos = promotions.filter(p => !p.disabled && new Date(p.validUntil) >= today).length;
  const activeTickets = tickets.filter(t => t.status === "active").length;
  const expiredTickets = tickets.filter(t => t.status === "expired").length;
  const usedTickets = tickets.filter(t => t.status === "used").length;
  const gcSold = giftCards.length;
  const gcAmount = giftCards.reduce((s, c) => s + c.initialAmount, 0);
  const gcRemaining = giftCards.reduce((s, c) => s + c.remainingAmount, 0);
  const totalPointsEarned = loyaltyHistory.filter(h => h.delta > 0).reduce((s, h) => s + h.delta, 0);
  const totalPointsRedeemed = Math.abs(loyaltyHistory.filter(h => h.delta < 0).reduce((s, h) => s + h.delta, 0));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi label="Promotions actives" value={activePromos} hint={`sur ${promotions.length} configurées`} />
        <Kpi label="Ventes flash" value={flashDeals.length} hint="campagnes en cours" tone="warn" />
        <Kpi label="Concours" value={contests.length} hint={`${contestEntries.length} participations`} />
        <Kpi label="Tickets actifs" value={activeTickets} hint={`${usedTickets} utilisés · ${expiredTickets} expirés`} tone="success" />
        <Kpi label="Cartes cadeaux vendues" value={gcSold} hint={`${fmt(gcAmount)} Fcfa émis`} />
        <Kpi label="Solde cartes" value={`${fmt(gcRemaining)} F`} hint="à dépenser" />
        <Kpi label="Points fidélité (vous)" value={fmt(loyaltyPoints)} hint={`${fmt(totalPointsEarned)} gagnés · ${fmt(totalPointsRedeemed)} convertis`} tone="success" />
        <Kpi label="Jour de marché" value={md ? "Aujourd'hui" : "—"} hint={md?.theme || "Aucun aujourd'hui"} />
      </div>

      <AnalyticsSection
        promotions={promotions}
        flashDeals={flashDeals}
        contests={contests}
        contestEntries={contestEntries}
        giftCards={giftCards}
        tickets={tickets}
        wheelStats={wheelStats}
        wheelPrizes={wheelPrizes}
        loyaltyUsers={loyaltyUsers}
        loyaltyHistory={loyaltyHistory}
      />

      <DataCard>
        <h3 className="mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 700 }}>Promotions à expirer prochainement</h3>
        <div className="space-y-2">
          {promotions
            .filter(p => !p.disabled && new Date(p.validUntil) >= today)
            .sort((a, b) => +new Date(a.validUntil) - +new Date(b.validUntil))
            .slice(0, 5)
            .map(p => {
              const days = Math.ceil((+new Date(p.validUntil) - +today) / (1000 * 60 * 60 * 24));
              return (
                <div key={p.id} className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[var(--ipk-surface)]">
                  <div className="min-w-0">
                    <div className="truncate" style={{ fontSize: "13px", fontWeight: 600 }}>{p.title}</div>
                    <div className="text-[var(--ipk-text-muted)] truncate" style={{ fontSize: "11px" }}>{p.code} · {p.kind === "percent" ? `-${p.value}%` : `${fmt(p.value)} Fcfa`}</div>
                  </div>
                  <StatusPill status={`${days} j`} tone={days <= 7 ? "warn" : "info"} />
                </div>
              );
            })}
          {promotions.filter(p => !p.disabled && new Date(p.validUntil) >= today).length === 0 && <EmptyRow message="Aucune promotion active." />}
        </div>
      </DataCard>
    </div>
  );
}

type Analytics = {
  promotions: Promotion[];
  flashDeals: FlashDeal[];
  contests: Contest[];
  contestEntries: { contestId: string; createdAt: string }[];
  giftCards: { initialAmount: number; remainingAmount: number; createdAt: string; status?: string }[];
  tickets: { status: string; earnedAt: string }[];
  wheelStats: Array<{ prizeId: string; at: string; day: string }>;
  wheelPrizes: WheelPrize[];
  loyaltyUsers: Array<{ email: string; points: number }>;
  loyaltyHistory: LoyaltyTxn[];
};

const CHART_COLORS = ["#0B6B3A", "#B45309", "#BE185D", "#1E40AF", "#7C3AED", "#0E7490", "#A16207", "#DC2626"];

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <DataCard>
      <div className="mb-2">
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "15px", fontWeight: 700 }}>{title}</h3>
        {subtitle && <div className="text-[var(--ipk-text-muted)]" style={{ fontSize: "11px" }}>{subtitle}</div>}
      </div>
      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer>{children as React.ReactElement}</ResponsiveContainer>
      </div>
    </DataCard>
  );
}

function AnalyticsSection({ promotions, flashDeals, contests, contestEntries, giftCards, tickets, wheelStats, wheelPrizes, loyaltyUsers, loyaltyHistory }: Analytics) {
  // 1. Roue : distribution réelle vs théorique
  const wheelData = useMemo(() => {
    const totalWeight = wheelPrizes.reduce((s, p) => s + p.weight, 0) || 1;
    const totalSpins = wheelStats.length || 1;
    return wheelPrizes.map((p, index) => {
      const realCount = wheelStats.filter(s => s.prizeId === p.id).length;
      return {
        id: `${p.id}-${index}`,
        name: p.label,
        Théorique: Math.round((p.weight / totalWeight) * 100),
        Réel: Math.round((realCount / totalSpins) * 100),
      };
    });
  }, [wheelPrizes, wheelStats]);

  // 2. Concours : participations par concours (pie)
  const contestData = useMemo(() => contests.map((c, index) => ({
    id: `${c.id}-${index}`,
    name: c.title.length > 20 ? c.title.slice(0, 18) + "…" : c.title,
    value: contestEntries.filter(e => e.contestId === c.id).length,
  })).filter(d => d.value > 0), [contests, contestEntries]);

  // 3. Cartes cadeaux : émis vs solde restant par mois
  const giftCardData = useMemo(() => {
    const buckets = new Map<string, { mois: string; Émis: number; Restant: number }>();
    giftCards.forEach(c => {
      const key = c.createdAt.slice(0, 7); // YYYY-MM
      const cur = buckets.get(key) || { mois: key, Émis: 0, Restant: 0 };
      cur["Émis"] += c.initialAmount;
      cur["Restant"] += c.remainingAmount;
      buckets.set(key, cur);
    });
    return Array.from(buckets.values()).sort((a, b) => a.mois.localeCompare(b.mois)).slice(-6);
  }, [giftCards]);

  // 4. Fidélité : top 5 clients
  const topLoyalty = useMemo(() => loyaltyUsers.slice(0, 5).map((u, index) => ({
    id: `${u.email}-${index}`,
    email: u.email.length > 18 ? u.email.slice(0, 16) + "…" : u.email,
    Points: u.points,
  })), [loyaltyUsers]);

  // 5. Évolution cumulée des points (visiteur démo)
  const loyaltyTrend = useMemo(() => {
    const sorted = [...loyaltyHistory].reverse(); // chronologique
    let cumul = 0;
    return sorted.map((h, index) => {
      cumul += h.delta;
      return { id: `${h.at}-${index}`, date: h.at.slice(5, 10), Cumul: cumul };
    }).slice(-30);
  }, [loyaltyHistory]);

  // 6. KPIs synthèse
  const flashStockSold = flashDeals.reduce((s, d) => s + ((d as FlashDeal).totalStock - (d as FlashDeal).stockLeft), 0);
  const flashRevenue = flashDeals.reduce((s, d) => {
    const sold = (d as FlashDeal).totalStock - (d as FlashDeal).stockLeft;
    return s + sold * (d as FlashDeal).flashPrice;
  }, 0);
  const flashSavings = flashDeals.reduce((s, d) => {
    const sold = (d as FlashDeal).totalStock - (d as FlashDeal).stockLeft;
    return s + sold * ((d as FlashDeal).basePrice - (d as FlashDeal).flashPrice);
  }, 0);
  const ticketsConvRate = tickets.length === 0 ? 0 : Math.round((tickets.filter(t => t.status === "used").length / tickets.length) * 100);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi label="Articles flash vendus" value={fmt(flashStockSold)} hint={`${fmt(flashRevenue)} F générés`} tone="success" />
        <Kpi label="Économies clients flash" value={`${fmt(flashSavings)} F`} hint="vs prix de base" tone="warn" />
        <Kpi label="Taux d'usage tickets" value={`${ticketsConvRate}%`} hint={`${tickets.filter(t => t.status === "used").length}/${tickets.length}`} />
        <Kpi label="Promos actives" value={promotions.filter(p => !p.disabled).length} hint={`${promotions.length} totales`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Roue — distribution des spins" subtitle="Probabilité théorique vs. réelle (%)">
          <BarChart data={wheelData} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" angle={-30} textAnchor="end" height={60} style={{ fontSize: "10px" }} />
            <YAxis style={{ fontSize: "10px" }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            <Bar dataKey="Théorique" fill="#94a3b8" />
            <Bar dataKey="Réel" fill="#0B6B3A" />
          </BarChart>
        </ChartCard>

        <ChartCard title="Concours — participations" subtitle="Répartition par concours actif">
          {contestData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-[var(--ipk-text-muted)]" style={{ fontSize: "12px" }}>Aucune participation.</div>
          ) : (
            <PieChart>
              <Pie data={contestData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={(e) => `${e.name} (${e.value})`} style={{ fontSize: "10px" }}>
                {contestData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
        </ChartCard>

        <ChartCard title="Cartes cadeaux — émis vs restant" subtitle="Sur les 6 derniers mois (Fcfa)">
          {giftCardData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-[var(--ipk-text-muted)]" style={{ fontSize: "12px" }}>Aucune carte émise.</div>
          ) : (
            <BarChart data={giftCardData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="mois" style={{ fontSize: "10px" }} />
              <YAxis style={{ fontSize: "10px" }} />
              <Tooltip formatter={(v: number) => `${fmt(v)} F`} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="Émis" fill="#1E40AF" />
              <Bar dataKey="Restant" fill="#0E7490" />
            </BarChart>
          )}
        </ChartCard>

        <ChartCard title="Fidélité — top 5 clients" subtitle="Soldes en points">
          {topLoyalty.length === 0 ? (
            <div className="flex items-center justify-center h-full text-[var(--ipk-text-muted)]" style={{ fontSize: "12px" }}>Aucun compte fidélité.</div>
          ) : (
            <BarChart data={topLoyalty} layout="vertical" margin={{ top: 10, right: 10, left: 60, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" style={{ fontSize: "10px" }} />
              <YAxis type="category" dataKey="email" style={{ fontSize: "10px" }} width={100} />
              <Tooltip />
              <Bar dataKey="Points" fill="#7C3AED" />
            </BarChart>
          )}
        </ChartCard>
      </div>

      {loyaltyTrend.length > 1 && (
        <ChartCard title="Évolution des points (visiteur démo)" subtitle="Solde cumulé sur les 30 dernières transactions">
          <LineChart data={loyaltyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" style={{ fontSize: "10px" }} />
            <YAxis style={{ fontSize: "10px" }} />
            <Tooltip />
            <Line type="monotone" dataKey="Cumul" stroke="#0B6B3A" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ChartCard>
      )}
    </div>
  );
}

function PromotionsTab() {
  const { promotions, createPromotion, updatePromotion, deletePromotion, togglePromotion } = useMarketing();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Promotion | "new" | null>(null);
  const today = new Date();
  const filtered = promotions.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DataCard>
      <div className="mb-3 flex flex-wrap items-center gap-2 justify-between">
        <SearchInput value={search} onChange={setSearch} placeholder="Titre ou code…" />
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--ipk-green-dark)] text-white"
          style={{ fontSize: "12px", fontWeight: 600 }}
        >
          <Plus className="w-3.5 h-3.5" /> Nouvelle promotion
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full" style={{ fontSize: "13px" }}>
          <thead className="bg-[var(--ipk-surface)] text-left text-[var(--ipk-text-muted)]">
            <tr>
              <th className="px-3 py-2">Promo</th>
              <th className="px-3 py-2">Code</th>
              <th className="px-3 py-2">Remise</th>
              <th className="px-3 py-2">Segment</th>
              <th className="px-3 py-2">Valide jusqu'à</th>
              <th className="px-3 py-2">Statut</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const expired = new Date(p.validUntil) < today;
              const status = p.disabled ? "Désactivée" : expired ? "Expirée" : "Active";
              const tone = p.disabled ? "neutral" : expired ? "danger" : "success";
              return (
                <tr key={p.id} className="border-t border-[var(--ipk-border)]">
                  <td className="px-3 py-2">
                    <div style={{ fontWeight: 600 }}>{p.title}</div>
                    <div className="text-[var(--ipk-text-muted)]" style={{ fontSize: "11px" }}>{p.artisanName ? `Artisan : ${p.artisanName}` : p.category || "—"}</div>
                  </td>
                  <td className="px-3 py-2"><code className="px-1.5 py-0.5 rounded bg-[var(--ipk-surface)]">{p.code}</code></td>
                  <td className="px-3 py-2">{p.kind === "percent" ? `-${p.value}%` : `${fmt(p.value)} F`}{p.minCart ? <span className="text-[var(--ipk-text-muted)]" style={{ fontSize: "11px" }}> · min {fmt(p.minCart)} F</span> : null}</td>
                  <td className="px-3 py-2">{p.segment === "all" ? "Tous" : p.segment === "new" ? "Nouveaux" : "Fidélité"}</td>
                  <td className="px-3 py-2">{fmtDate(p.validUntil)}</td>
                  <td className="px-3 py-2"><StatusPill status={status} tone={tone} /></td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => togglePromotion(p.id)} title={p.disabled ? "Activer" : "Désactiver"} className="p-1.5 rounded-lg hover:bg-[var(--ipk-surface)]"><Power className={`w-3.5 h-3.5 ${p.disabled ? "text-[var(--ipk-text-muted)]" : "text-emerald-700"}`} /></button>
                      <button onClick={() => setEditing(p)} title="Éditer" className="p-1.5 rounded-lg hover:bg-[var(--ipk-surface)]"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => { if (confirm(`Supprimer la promotion "${p.title}" ?`)) { deletePromotion(p.id); toast.success("Promotion supprimée"); } }} title="Supprimer" className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && <tr><td colSpan={7}><EmptyRow message="Aucune promotion." /></td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <PromotionEditor
          initial={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={(data) => {
            if (editing === "new") { createPromotion(data); toast.success("Promotion créée"); }
            else { updatePromotion(editing.id, data); toast.success("Promotion mise à jour"); }
            setEditing(null);
          }}
        />
      )}
    </DataCard>
  );
}

const THEMES: CouponTheme[] = ["amber", "rose", "emerald", "indigo", "fuchsia", "cyan", "slate", "terracotta", "ochre", "bronze", "clay", "ivory"];
const PATTERNS: CouponPattern[] = ["kente", "dots", "rays", "diamonds", "weave", "adinkra", "bogolan"];

function PromotionEditor({ initial, onClose, onSave }: { initial: Promotion | null; onClose: () => void; onSave: (data: Omit<Promotion, "id">) => void }) {
  const [form, setForm] = useState<Omit<Promotion, "id">>(() => initial ? { ...initial } as Omit<Promotion, "id"> : {
    title: "", description: "", kind: "percent" as PromotionKind, value: 10, code: "",
    validUntil: new Date(Date.now() + 30 * 86400_000).toISOString().slice(0, 10),
    category: "", segment: "all" as PromotionSegment, style: { theme: "emerald", pattern: "kente" },
  });
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.title.trim() || !form.code.trim()) { toast.error("Titre et code requis"); return; }
    if (form.value <= 0) { toast.error("Valeur invalide"); return; }
    onSave({ ...form, code: form.code.toUpperCase().trim(), pct: form.kind === "percent" ? form.value : undefined });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-3" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white px-5 py-3 border-b border-[var(--ipk-border)] flex items-center justify-between">
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700 }}>{initial ? "Éditer la promotion" : "Nouvelle promotion"}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--ipk-surface)]"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ fontSize: "13px" }}>
          <Field label="Titre" className="sm:col-span-2">
            <input value={form.title} onChange={e => set("title", e.target.value)} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={2} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Code (majuscules)">
            <input value={form.code} onChange={e => set("code", e.target.value.toUpperCase())} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl font-mono uppercase" />
          </Field>
          <Field label="Valable jusqu'au">
            <input type="date" value={form.validUntil.slice(0, 10)} onChange={e => set("validUntil", e.target.value)} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Type de remise">
            <select value={form.kind} onChange={e => set("kind", e.target.value as PromotionKind)} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl">
              <option value="percent">Pourcentage</option>
              <option value="fixed">Montant fixe (Fcfa)</option>
            </select>
          </Field>
          <Field label={form.kind === "percent" ? "Pourcentage (%)" : "Montant (Fcfa)"}>
            <input type="number" min={1} value={form.value} onChange={e => set("value", Number(e.target.value))} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Segment">
            <select value={form.segment} onChange={e => set("segment", e.target.value as PromotionSegment)} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl">
              <option value="all">Tous</option>
              <option value="new">Nouveaux clients</option>
              <option value="loyalty">Fidélité (≥ 3 commandes)</option>
            </select>
          </Field>
          <Field label="Panier minimum (Fcfa)">
            <input type="number" min={0} value={form.minCart || 0} onChange={e => set("minCart", Number(e.target.value) || undefined)} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Catégorie (libellé)">
            <input value={form.category || ""} onChange={e => set("category", e.target.value)} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Slug artisan (optionnel)">
            <input value={form.artisanSlug || ""} onChange={e => set("artisanSlug", e.target.value || undefined)} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Nom artisan (optionnel)">
            <input value={form.artisanName || ""} onChange={e => set("artisanName", e.target.value || undefined)} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Thème visuel">
            <select value={form.style.theme} onChange={e => set("style", { ...form.style, theme: e.target.value as CouponTheme })} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl">
              {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Motif">
            <select value={form.style.pattern} onChange={e => set("style", { ...form.style, pattern: e.target.value as CouponPattern })} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl">
              {PATTERNS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
        </div>
        <div className="sticky bottom-0 bg-white px-5 py-3 border-t border-[var(--ipk-border)] flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 rounded-full border border-[var(--ipk-border)]" style={{ fontSize: "12px" }}>Annuler</button>
          <button onClick={submit} className="px-3 py-1.5 rounded-full bg-[var(--ipk-green-dark)] text-white" style={{ fontSize: "12px", fontWeight: 600 }}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="block mb-1 text-[var(--ipk-text-muted)]" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
      {children}
    </label>
  );
}

function FlashTab() {
  const { flashDeals, createFlashDeal, updateFlashDeal, deleteFlashDeal, endFlashDealNow, extendFlashDeal, broadcastFlashDeal } = useMarketing();
  const [editing, setEditing] = useState<FlashDeal | "new" | null>(null);

  return (
    <DataCard>
      <div className="mb-3 flex items-center justify-end">
        <button onClick={() => setEditing("new")} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--ipk-green-dark)] text-white" style={{ fontSize: "12px", fontWeight: 600 }}>
          <Plus className="w-3.5 h-3.5" /> Nouvelle vente flash
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full" style={{ fontSize: "13px" }}>
          <thead className="bg-[var(--ipk-surface)] text-left text-[var(--ipk-text-muted)]">
            <tr>
              <th className="px-3 py-2">Produit</th>
              <th className="px-3 py-2">Prix base</th>
              <th className="px-3 py-2">Prix flash</th>
              <th className="px-3 py-2">Stock</th>
              <th className="px-3 py-2">Fin</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {flashDeals.map(d => {
              const pct = Math.round((1 - d.flashPrice / d.basePrice) * 100);
              const left = Math.round((+new Date(d.endsAt) - Date.now()) / (1000 * 60 * 60));
              const ended = left <= 0;
              return (
                <tr key={d.id} className="border-t border-[var(--ipk-border)]">
                  <td className="px-3 py-2">
                    <div style={{ fontWeight: 600 }}>{d.productName}</div>
                    {d.disabled && <div className="text-[var(--ipk-text-muted)]" style={{ fontSize: "11px" }}>Désactivée</div>}
                  </td>
                  <td className="px-3 py-2 text-[var(--ipk-text-muted)]"><s>{fmt(d.basePrice)} F</s></td>
                  <td className="px-3 py-2"><strong>{fmt(d.flashPrice)} F</strong> <span className="text-emerald-700" style={{ fontSize: "11px" }}>(-{pct}%)</span></td>
                  <td className="px-3 py-2">{d.stockLeft}/{d.totalStock}</td>
                  <td className="px-3 py-2">{ended ? <StatusPill status="Terminée" tone="danger" /> : `${left}h`}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { broadcastFlashDeal(d.id); toast.success("Diffusé aux visiteurs en cours"); }} title="Diffuser" className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-700"><Megaphone className="w-3.5 h-3.5" /></button>
                      <button onClick={() => { extendFlashDeal(d.id, 6); toast.success("Prolongée de 6 h"); }} title="Prolonger 6h" className="p-1.5 rounded-lg hover:bg-[var(--ipk-surface)]"><Clock className="w-3.5 h-3.5" /></button>
                      <button onClick={() => { if (confirm("Terminer cette vente flash maintenant ?")) { endFlashDealNow(d.id); toast.success("Vente terminée"); } }} title="Terminer" className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><StopCircle className="w-3.5 h-3.5" /></button>
                      <button onClick={() => updateFlashDeal(d.id, { disabled: !d.disabled })} title={d.disabled ? "Activer" : "Désactiver"} className="p-1.5 rounded-lg hover:bg-[var(--ipk-surface)]"><Power className={`w-3.5 h-3.5 ${d.disabled ? "text-[var(--ipk-text-muted)]" : "text-emerald-700"}`} /></button>
                      <button onClick={() => setEditing(d)} title="Éditer" className="p-1.5 rounded-lg hover:bg-[var(--ipk-surface)]"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => { if (confirm(`Supprimer "${d.productName}" ?`)) { deleteFlashDeal(d.id); toast.success("Supprimée"); } }} title="Supprimer" className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {flashDeals.length === 0 && <tr><td colSpan={6}><EmptyRow message="Aucune vente flash." /></td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <FlashEditor
          initial={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={(data) => {
            if (editing === "new") { createFlashDeal(data); toast.success("Vente flash créée"); }
            else { updateFlashDeal(editing.id, data); toast.success("Vente mise à jour"); }
            setEditing(null);
          }}
        />
      )}
    </DataCard>
  );
}

function FlashEditor({ initial, onClose, onSave }: { initial: FlashDeal | null; onClose: () => void; onSave: (data: Omit<FlashDeal, "id">) => void }) {
  const defaultEnds = new Date(Date.now() + 24 * 3600_000);
  const toLocal = (iso: string) => {
    const d = new Date(iso);
    const tz = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tz).toISOString().slice(0, 16);
  };
  const [form, setForm] = useState<Omit<FlashDeal, "id">>(() => initial ? { ...initial } : {
    productName: "", basePrice: 50000, flashPrice: 30000,
    endsAt: defaultEnds.toISOString(),
    stockLeft: 10, totalStock: 10,
    style: { theme: "rose", pattern: "rays" },
  });
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.productName.trim()) { toast.error("Nom du produit requis"); return; }
    if (form.flashPrice >= form.basePrice) { toast.error("Le prix flash doit être inférieur au prix de base"); return; }
    if (form.stockLeft < 0 || form.totalStock <= 0) { toast.error("Stock invalide"); return; }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-3" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white px-5 py-3 border-b border-[var(--ipk-border)] flex items-center justify-between">
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700 }}>{initial ? "Éditer la vente flash" : "Nouvelle vente flash"}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--ipk-surface)]"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ fontSize: "13px" }}>
          <Field label="Produit" className="sm:col-span-2">
            <input value={form.productName} onChange={e => set("productName", e.target.value)} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Prix de base (Fcfa)">
            <input type="number" min={0} value={form.basePrice} onChange={e => set("basePrice", Number(e.target.value))} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Prix flash (Fcfa)">
            <input type="number" min={0} value={form.flashPrice} onChange={e => set("flashPrice", Number(e.target.value))} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Stock restant">
            <input type="number" min={0} value={form.stockLeft} onChange={e => set("stockLeft", Number(e.target.value))} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Stock total initial">
            <input type="number" min={1} value={form.totalStock} onChange={e => set("totalStock", Number(e.target.value))} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Fin de la vente" className="sm:col-span-2">
            <input
              type="datetime-local"
              value={toLocal(form.endsAt)}
              onChange={e => { const d = new Date(e.target.value); if (!isNaN(d.getTime())) set("endsAt", d.toISOString()); }}
              className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl"
            />
          </Field>
          <Field label="Thème visuel">
            <select value={form.style.theme} onChange={e => set("style", { ...form.style, theme: e.target.value as CouponTheme })} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl">
              {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Motif">
            <select value={form.style.pattern} onChange={e => set("style", { ...form.style, pattern: e.target.value as CouponPattern })} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl">
              {PATTERNS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
        </div>
        <div className="sticky bottom-0 bg-white px-5 py-3 border-t border-[var(--ipk-border)] flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 rounded-full border border-[var(--ipk-border)]" style={{ fontSize: "12px" }}>Annuler</button>
          <button onClick={submit} className="px-3 py-1.5 rounded-full bg-[var(--ipk-green-dark)] text-white" style={{ fontSize: "12px", fontWeight: 600 }}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

function ContestsTab() {
  const { contests, contestEntries, rankingFor, createContest, updateContest, deleteContest, closeContest, reopenContest, deleteContestEntry, drawContestWinner, awardBadge } = useMarketing();
  const [editing, setEditing] = useState<Contest | "new" | null>(null);
  const [moderating, setModerating] = useState<string | null>(null);
  const [awarding, setAwarding] = useState<{ contestId: string; suggestedEmail?: string } | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <button onClick={() => setEditing("new")} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--ipk-green-dark)] text-white" style={{ fontSize: "12px", fontWeight: 600 }}>
          <Plus className="w-3.5 h-3.5" /> Nouveau concours
        </button>
      </div>

      {contests.map(c => {
        const ranking = rankingFor(c.id);
        const entries = contestEntries.filter(e => e.contestId === c.id);
        const ended = new Date(c.endsAt) < new Date();
        return (
          <DataCard key={c.id}>
            <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 700 }}>{c.title}</h3>
                  {c.closed && <StatusPill status="Clôturé" tone="neutral" />}
                  {c.disabled && <StatusPill status="Masqué" tone="warn" />}
                  {ended && !c.closed && <StatusPill status="Date dépassée" tone="warn" />}
                </div>
                <div className="text-[var(--ipk-text-muted)]" style={{ fontSize: "12px" }}>
                  Fin {fmtDate(c.endsAt)} · {CONTEST_KIND_LABEL[c.kind]} · {CONTEST_RANKING_LABEL[c.ranking]} · {entries.length} participation{entries.length > 1 ? "s" : ""}
                </div>
                <div className="text-[var(--ipk-text-muted)] mt-1" style={{ fontSize: "12px" }}>🏆 {c.prize}</div>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <button onClick={() => {
                  const r = drawContestWinner(c.id);
                  if (r.ok) { toast.success(`Gagnant·e : ${r.entry.name} (${r.entry.email})`); }
                  else toast.error(r.reason);
                }} title="Tirer au sort" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100" style={{ fontSize: "11px", fontWeight: 600 }}>
                  <Dice5 className="w-3.5 h-3.5" /> Tirage
                </button>
                <button onClick={() => setAwarding({ contestId: c.id })} title="Attribuer un badge" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 hover:bg-purple-100" style={{ fontSize: "11px", fontWeight: 600 }}>
                  <Award className="w-3.5 h-3.5" /> Badge
                </button>
                <button onClick={() => setModerating(c.id)} className="px-2.5 py-1 rounded-lg bg-[var(--ipk-surface)]" style={{ fontSize: "11px", fontWeight: 600 }}>
                  Modérer ({entries.length})
                </button>
                {c.closed
                  ? <button onClick={() => { reopenContest(c.id); toast.success("Concours rouvert"); }} title="Rouvrir" className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-700"><Unlock className="w-3.5 h-3.5" /></button>
                  : <button onClick={() => { if (confirm("Clôturer ce concours ?")) { closeContest(c.id); toast.success("Clôturé"); } }} title="Clôturer" className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-700"><Lock className="w-3.5 h-3.5" /></button>
                }
                <button onClick={() => updateContest(c.id, { disabled: !c.disabled })} title={c.disabled ? "Afficher" : "Masquer"} className="p-1.5 rounded-lg hover:bg-[var(--ipk-surface)]"><Power className={`w-3.5 h-3.5 ${c.disabled ? "text-[var(--ipk-text-muted)]" : "text-emerald-700"}`} /></button>
                <button onClick={() => setEditing(c)} title="Éditer" className="p-1.5 rounded-lg hover:bg-[var(--ipk-surface)]"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => { if (confirm(`Supprimer "${c.title}" et toutes ses participations ?`)) { deleteContest(c.id); toast.success("Supprimé"); } }} title="Supprimer" className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            {ranking.length > 0 ? (
              <div className="space-y-1">
                {ranking.slice(0, 5).map(r => (
                  <div key={r.id} className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg bg-[var(--ipk-surface)]" style={{ fontSize: "12px" }}>
                    <span className="truncate min-w-0"><span className="text-[var(--ipk-text-muted)]">#{r.rank}</span> <strong>{r.name}</strong> <span className="text-[var(--ipk-text-muted)]">· {r.email}</span></span>
                    <span className="shrink-0">{r.votes} vote{r.votes > 1 ? "s" : ""}</span>
                  </div>
                ))}
              </div>
            ) : <EmptyRow message="Aucune participation." />}
          </DataCard>
        );
      })}

      {editing && (
        <ContestEditor
          initial={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={(data) => {
            if (editing === "new") { createContest(data); toast.success("Concours créé"); }
            else { updateContest(editing.id, data); toast.success("Concours mis à jour"); }
            setEditing(null);
          }}
        />
      )}

      {moderating && (() => {
        const c = contests.find(x => x.id === moderating);
        const list = contestEntries.filter(e => e.contestId === moderating);
        return (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-3" onClick={() => setModerating(null)}>
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="px-5 py-3 border-b border-[var(--ipk-border)] flex items-center justify-between">
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700 }}>Modération · {c?.title}</h3>
                <button onClick={() => setModerating(null)} className="p-1 rounded-lg hover:bg-[var(--ipk-surface)]"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-4 overflow-y-auto flex-1">
                {list.length === 0 ? <EmptyRow message="Aucune participation." /> : (
                  <ul className="space-y-2">
                    {list.map(e => (
                      <li key={e.id} className="p-2.5 rounded-xl border border-[var(--ipk-border)]">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div style={{ fontSize: "13px", fontWeight: 600 }}>{e.name}</div>
                            <div className="text-[var(--ipk-text-muted)]" style={{ fontSize: "11px" }}>{e.email} {e.phone ? `· ${e.phone}` : ""} · {fmtDate(e.createdAt)}</div>
                            {e.submission && <div className="mt-1 text-[var(--ipk-text)]" style={{ fontSize: "12px", wordBreak: "break-word" }}>{e.submission}</div>}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => setAwarding({ contestId: moderating, suggestedEmail: e.email })} title="Attribuer un badge" className="p-1.5 rounded-lg hover:bg-purple-50 text-purple-700"><Award className="w-3.5 h-3.5" /></button>
                            <button onClick={() => { if (confirm(`Supprimer la participation de ${e.name} ?`)) { deleteContestEntry(e.id); toast.success("Supprimée"); } }} title="Supprimer" className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {awarding && (
        <BadgeAwardModal
          contestId={awarding.contestId}
          suggestedEmail={awarding.suggestedEmail}
          onClose={() => setAwarding(null)}
          onAward={(input) => { awardBadge(input); toast.success(`Badge « ${input.label} » attribué`); setAwarding(null); }}
        />
      )}
    </div>
  );
}

const BADGE_PRESETS: Array<{ kind: import("../../hooks/use-marketing").BadgeKind; label: string }> = [
  { kind: "winner", label: "Gagnant·e du concours" },
  { kind: "top3", label: "Podium" },
  { kind: "creator", label: "Créateur·rice" },
  { kind: "voter", label: "Votant·e fidèle" },
  { kind: "first-entry", label: "Premier pas" },
];

function BadgeAwardModal({ contestId, suggestedEmail, onClose, onAward }: { contestId: string; suggestedEmail?: string; onClose: () => void; onAward: (input: { email: string; kind: import("../../hooks/use-marketing").BadgeKind; label: string; contestId?: string }) => void }) {
  const [email, setEmail] = useState(suggestedEmail || "");
  const [preset, setPreset] = useState(0);
  const [customLabel, setCustomLabel] = useState("");
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-3" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-3 border-b border-[var(--ipk-border)] flex items-center justify-between">
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 700 }}>Attribuer un badge</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--ipk-surface)]"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-3" style={{ fontSize: "13px" }}>
          <Field label="Email du destinataire">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Type de badge">
            <select value={preset} onChange={e => setPreset(Number(e.target.value))} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl">
              {BADGE_PRESETS.map((b, i) => <option key={b.kind} value={i}>{b.label} ({b.kind})</option>)}
            </select>
          </Field>
          <Field label="Libellé personnalisé (optionnel)">
            <input value={customLabel} onChange={e => setCustomLabel(e.target.value)} placeholder={BADGE_PRESETS[preset].label} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
        </div>
        <div className="px-5 py-3 border-t border-[var(--ipk-border)] flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 rounded-full border border-[var(--ipk-border)]" style={{ fontSize: "12px" }}>Annuler</button>
          <button onClick={() => {
            if (!email.includes("@")) { toast.error("Email invalide"); return; }
            const p = BADGE_PRESETS[preset];
            onAward({ email, kind: p.kind, label: customLabel.trim() || p.label, contestId });
          }} className="px-3 py-1.5 rounded-full bg-[var(--ipk-green-dark)] text-white" style={{ fontSize: "12px", fontWeight: 600 }}>Attribuer</button>
        </div>
      </div>
    </div>
  );
}

const CONTEST_KINDS: ContestKind[] = ["buyer", "artisan", "design", "share"];
const CONTEST_RANKINGS: ContestRanking[] = ["votes", "draw", "jury"];

function ContestEditor({ initial, onClose, onSave }: { initial: Contest | null; onClose: () => void; onSave: (data: Omit<Contest, "id">) => void }) {
  const [form, setForm] = useState<Omit<Contest, "id">>(() => initial ? { ...initial } : {
    title: "", prize: "", description: "",
    endsAt: new Date(Date.now() + 30 * 86400_000).toISOString().slice(0, 10),
    participants: 0, rules: [],
    style: { theme: "fuchsia", pattern: "rays" },
    kind: "buyer" as ContestKind, ranking: "draw" as ContestRanking,
  });
  const [rulesText, setRulesText] = useState(initial?.rules.join("\n") || "");
  const [hasSubmission, setHasSubmission] = useState(!!initial?.submission);
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.title.trim() || !form.prize.trim()) { toast.error("Titre et prix requis"); return; }
    onSave({
      ...form,
      rules: rulesText.split("\n").map(r => r.trim()).filter(Boolean),
      submission: hasSubmission ? (form.submission || { type: "text", label: "Décrivez votre œuvre" }) : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-3" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white px-5 py-3 border-b border-[var(--ipk-border)] flex items-center justify-between">
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700 }}>{initial ? "Éditer le concours" : "Nouveau concours"}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--ipk-surface)]"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ fontSize: "13px" }}>
          <Field label="Titre" className="sm:col-span-2">
            <input value={form.title} onChange={e => set("title", e.target.value)} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Prix à gagner" className="sm:col-span-2">
            <input value={form.prize} onChange={e => set("prize", e.target.value)} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={2} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Type de concours">
            <select value={form.kind} onChange={e => set("kind", e.target.value as ContestKind)} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl">
              {CONTEST_KINDS.map(k => <option key={k} value={k}>{CONTEST_KIND_LABEL[k]}</option>)}
            </select>
          </Field>
          <Field label="Mode de classement">
            <select value={form.ranking} onChange={e => set("ranking", e.target.value as ContestRanking)} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl">
              {CONTEST_RANKINGS.map(r => <option key={r} value={r}>{CONTEST_RANKING_LABEL[r]}</option>)}
            </select>
          </Field>
          <Field label="Date de fin">
            <input type="date" value={form.endsAt.slice(0, 10)} onChange={e => set("endsAt", e.target.value)} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Participants initiaux (compteur)">
            <input type="number" min={0} value={form.participants} onChange={e => set("participants", Number(e.target.value))} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Règles (une par ligne)" className="sm:col-span-2">
            <textarea value={rulesText} onChange={e => setRulesText(e.target.value)} rows={3} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Soumission requise" className="sm:col-span-2">
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-1.5">
                <input type="checkbox" checked={hasSubmission} onChange={e => setHasSubmission(e.target.checked)} />
                <span>Demander une soumission</span>
              </label>
              {hasSubmission && (
                <>
                  <select
                    value={form.submission?.type || "text"}
                    onChange={e => set("submission", { type: e.target.value as "image" | "text", label: form.submission?.label || "Décrivez votre œuvre" })}
                    className="px-2 py-1 border border-[var(--ipk-border)] rounded-lg"
                  >
                    <option value="text">Texte</option>
                    <option value="image">URL image</option>
                  </select>
                  <input
                    value={form.submission?.label || ""}
                    onChange={e => set("submission", { type: form.submission?.type || "text", label: e.target.value })}
                    placeholder="Libellé du champ"
                    className="flex-1 px-2 py-1 border border-[var(--ipk-border)] rounded-lg"
                  />
                </>
              )}
            </div>
          </Field>
          <Field label="Thème visuel">
            <select value={form.style.theme} onChange={e => set("style", { ...form.style, theme: e.target.value as CouponTheme })} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl">
              {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Motif">
            <select value={form.style.pattern} onChange={e => set("style", { ...form.style, pattern: e.target.value as CouponPattern })} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl">
              {PATTERNS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
        </div>
        <div className="sticky bottom-0 bg-white px-5 py-3 border-t border-[var(--ipk-border)] flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 rounded-full border border-[var(--ipk-border)]" style={{ fontSize: "12px" }}>Annuler</button>
          <button onClick={submit} className="px-3 py-1.5 rounded-full bg-[var(--ipk-green-dark)] text-white" style={{ fontSize: "12px", fontWeight: 600 }}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

function GiftCardsTab() {
  const { giftCards, issueGiftCard, sendGiftCardEmail, topUpGiftCard, cancelGiftCard, toggleGiftCardBlock, deleteGiftCard } = useMarketing();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "blocked" | "cancelled" | "spent">("all");
  const [issuing, setIssuing] = useState(false);
  const [topUp, setTopUp] = useState<{ code: string } | null>(null);

  const computed = giftCards.map(c => {
    const status = c.status ?? (c.remainingAmount <= 0 ? "spent" : "active");
    return { ...c, _status: status };
  });
  const filtered = computed.filter(c =>
    (filterStatus === "all" || c._status === filterStatus) &&
    (!search || c.code.toLowerCase().includes(search.toLowerCase()) || c.recipientEmail?.toLowerCase().includes(search.toLowerCase()) || c.recipientName?.toLowerCase().includes(search.toLowerCase()))
  );

  const totals = useMemo(() => ({
    count: computed.length,
    active: computed.filter(c => c._status === "active").length,
    outstanding: computed.filter(c => c._status === "active").reduce((s, c) => s + c.remainingAmount, 0),
    issued: computed.reduce((s, c) => s + c.initialAmount, 0),
  }), [computed]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi label="Cartes émises" value={totals.count} />
        <Kpi label="Actives" value={totals.active} tone="success" />
        <Kpi label="Solde restant" value={`${fmt(totals.outstanding)} F`} />
        <Kpi label="Total émis" value={`${fmt(totals.issued)} F`} />
      </div>

      <DataCard>
        <div className="mb-3 flex flex-wrap items-center gap-2 justify-between">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="min-w-[200px] flex-1"><SearchInput value={search} onChange={setSearch} placeholder="Code, nom ou email…" /></div>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as typeof filterStatus)} className="px-3 py-1.5 border border-[var(--ipk-border)] rounded-full bg-white" style={{ fontSize: "12px" }}>
              <option value="all">Tous statuts</option>
              <option value="active">Actives</option>
              <option value="blocked">Bloquées</option>
              <option value="cancelled">Annulées</option>
              <option value="spent">Épuisées</option>
            </select>
          </div>
          <button onClick={() => setIssuing(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--ipk-green-dark)] text-white" style={{ fontSize: "12px", fontWeight: 600 }}>
            <Plus className="w-3.5 h-3.5" /> Émettre une carte
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" style={{ fontSize: "13px" }}>
            <thead className="bg-[var(--ipk-surface)] text-left text-[var(--ipk-text-muted)]">
              <tr>
                <th className="px-3 py-2">Code</th>
                <th className="px-3 py-2">Destinataire</th>
                <th className="px-3 py-2">Montant</th>
                <th className="px-3 py-2">Solde</th>
                <th className="px-3 py-2">Statut</th>
                <th className="px-3 py-2">Origine</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const tone = c._status === "active" ? "success" : c._status === "spent" ? "info" : c._status === "blocked" ? "warn" : "danger";
                const label = c._status === "active" ? "Active" : c._status === "spent" ? "Épuisée" : c._status === "blocked" ? "Bloquée" : "Annulée";
                return (
                  <tr key={c.code} className="border-t border-[var(--ipk-border)]">
                    <td className="px-3 py-2"><code>{c.code}</code></td>
                    <td className="px-3 py-2">
                      <div style={{ fontWeight: 600 }}>{c.recipientName || "—"}</div>
                      <div className="text-[var(--ipk-text-muted)]" style={{ fontSize: "11px" }}>{c.recipientEmail || c.recipientAddress || "—"}</div>
                    </td>
                    <td className="px-3 py-2">{fmt(c.initialAmount)} F</td>
                    <td className="px-3 py-2"><strong>{fmt(c.remainingAmount)} F</strong></td>
                    <td className="px-3 py-2"><StatusPill status={label} tone={tone as "success" | "info" | "warn" | "danger"} /></td>
                    <td className="px-3 py-2"><StatusPill status={c.issuedBy === "admin" ? "Admin" : "Client"} tone={c.issuedBy === "admin" ? "info" : "neutral"} /></td>
                    <td className="px-3 py-2">{fmtDate(c.createdAt)}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-1">
                        {c.delivery === "digital" && c.recipientEmail && (
                          <button title={c.emailSentAt ? "Renvoyer email" : "Envoyer email"}
                            onClick={() => { const r = sendGiftCardEmail(c.code); r.ok ? toast.success("Email envoyé") : toast.error(r.reason); }}
                            className="p-1.5 rounded-lg hover:bg-[var(--ipk-surface)]"><Mail className="w-3.5 h-3.5" /></button>
                        )}
                        <button title="Recharger" onClick={() => setTopUp({ code: c.code })} className="p-1.5 rounded-lg hover:bg-[var(--ipk-surface)]"><PlusCircle className="w-3.5 h-3.5" /></button>
                        <button title={c._status === "blocked" ? "Débloquer" : "Bloquer"} onClick={() => { toggleGiftCardBlock(c.code); toast.success(c._status === "blocked" ? "Débloquée" : "Bloquée"); }} className="p-1.5 rounded-lg hover:bg-[var(--ipk-surface)]">
                          {c._status === "blocked" ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        </button>
                        {c._status !== "cancelled" && (
                          <button title="Annuler" onClick={() => { if (confirm(`Annuler la carte ${c.code} ? Le solde sera remis à zéro.`)) { cancelGiftCard(c.code); toast.success("Carte annulée"); } }} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-700"><Ban className="w-3.5 h-3.5" /></button>
                        )}
                        <button title="Supprimer" onClick={() => { if (confirm(`Supprimer définitivement la carte ${c.code} ?`)) { deleteGiftCard(c.code); toast.success("Carte supprimée"); } }} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={8}><EmptyRow message="Aucune carte cadeau." /></td></tr>}
            </tbody>
          </table>
        </div>
      </DataCard>

      {issuing && (
        <GiftCardIssuer
          onClose={() => setIssuing(false)}
          onSave={(data) => {
            const card = issueGiftCard(data);
            toast.success(`Carte émise : ${card.code}`);
            setIssuing(false);
          }}
        />
      )}
      {topUp && (
        <GiftCardTopUp
          code={topUp.code}
          onClose={() => setTopUp(null)}
          onSubmit={(amount) => {
            const r = topUpGiftCard(topUp.code, amount);
            if (r.ok) { toast.success(`Solde rechargé : ${fmt(r.balance)} F`); setTopUp(null); }
            else toast.error(r.reason);
          }}
        />
      )}
    </div>
  );
}

function GiftCardIssuer({ onClose, onSave }: { onClose: () => void; onSave: (data: { amount: number; recipientName?: string; recipientEmail?: string; recipientAddress?: string; message?: string; delivery: "digital" | "physical"; expiresAt?: string }) => void }) {
  const [amount, setAmount] = useState(25000);
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [message, setMessage] = useState("");
  const [delivery, setDelivery] = useState<"digital" | "physical">("digital");
  const [expiresAt, setExpiresAt] = useState("");

  const submit = () => {
    if (amount <= 0) { toast.error("Montant invalide"); return; }
    if (delivery === "digital" && !recipientEmail.includes("@")) { toast.error("Email destinataire requis"); return; }
    if (delivery === "physical" && !recipientAddress.trim()) { toast.error("Adresse destinataire requise"); return; }
    onSave({
      amount,
      recipientName: recipientName.trim() || undefined,
      recipientEmail: recipientEmail.trim() || undefined,
      recipientAddress: recipientAddress.trim() || undefined,
      message: message.trim() || undefined,
      delivery,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-3" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white px-5 py-3 border-b border-[var(--ipk-border)] flex items-center justify-between">
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700 }}>Émettre une carte cadeau</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--ipk-surface)]"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ fontSize: "13px" }}>
          <Field label="Montant (Fcfa)">
            <input type="number" min={1000} step={1000} value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Livraison">
            <select value={delivery} onChange={e => setDelivery(e.target.value as "digital" | "physical")} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl">
              <option value="digital">Digitale (email)</option>
              <option value="physical">Physique (adresse)</option>
            </select>
          </Field>
          <Field label="Nom destinataire">
            <input value={recipientName} onChange={e => setRecipientName(e.target.value)} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Email destinataire">
            <input type="email" value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          {delivery === "physical" && (
            <Field label="Adresse de livraison" className="sm:col-span-2">
              <textarea value={recipientAddress} onChange={e => setRecipientAddress(e.target.value)} rows={2} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
            </Field>
          )}
          <Field label="Message personnalisé" className="sm:col-span-2">
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={2} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" placeholder="Geste commercial, anniversaire, dédommagement…" />
          </Field>
          <Field label="Date d'expiration (optionnelle)">
            <input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
        </div>
        <div className="sticky bottom-0 bg-white px-5 py-3 border-t border-[var(--ipk-border)] flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 rounded-full border border-[var(--ipk-border)]" style={{ fontSize: "12px" }}>Annuler</button>
          <button onClick={submit} className="px-3 py-1.5 rounded-full bg-[var(--ipk-green-dark)] text-white" style={{ fontSize: "12px", fontWeight: 600 }}>Émettre</button>
        </div>
      </div>
    </div>
  );
}

function GiftCardTopUp({ code, onClose, onSubmit }: { code: string; onClose: () => void; onSubmit: (amount: number) => void }) {
  const [amount, setAmount] = useState(5000);
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-3" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-3 border-b border-[var(--ipk-border)] flex items-center justify-between">
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 700 }}>Recharger {code}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--ipk-surface)]"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5" style={{ fontSize: "13px" }}>
          <Field label="Montant à ajouter (Fcfa)">
            <input type="number" min={1000} step={1000} value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" autoFocus />
          </Field>
        </div>
        <div className="px-5 py-3 border-t border-[var(--ipk-border)] flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 rounded-full border border-[var(--ipk-border)]" style={{ fontSize: "12px" }}>Annuler</button>
          <button onClick={() => onSubmit(amount)} className="px-3 py-1.5 rounded-full bg-[var(--ipk-green-dark)] text-white" style={{ fontSize: "12px", fontWeight: 600 }}>Recharger</button>
        </div>
      </div>
    </div>
  );
}

function TicketsTab() {
  const { tickets, ticketTemplates, awardTicket, extendTicket, cancelTicket, deleteTicket, createTicketTemplate, updateTicketTemplate, deleteTicketTemplate } = useMarketing();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "used" | "expired" | "cancelled">("all");
  const [issuing, setIssuing] = useState<{ template?: GiftTicket } | null>(null);
  const [editingTpl, setEditingTpl] = useState<GiftTicket | "new" | null>(null);

  const counts = useMemo(() => ({
    active: tickets.filter(t => t.status === "active").length,
    used: tickets.filter(t => t.status === "used").length,
    expired: tickets.filter(t => t.status === "expired").length,
    cancelled: tickets.filter(t => t.status === "cancelled").length,
  }), [tickets]);

  const filtered = tickets.filter(t =>
    (filterStatus === "all" || t.status === filterStatus) &&
    (!search || t.code.toLowerCase().includes(search.toLowerCase()) || t.label.toLowerCase().includes(search.toLowerCase()) || t.assignedEmail?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi label="Actifs" value={counts.active} tone="success" />
        <Kpi label="Utilisés" value={counts.used} />
        <Kpi label="Expirés" value={counts.expired} tone="warn" />
        <Kpi label="Annulés" value={counts.cancelled} />
      </div>

      <DataCard>
        <div className="mb-3 flex items-center justify-between">
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 700 }}>Modèles de tickets</h3>
          <button onClick={() => setEditingTpl("new")} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--ipk-green-dark)] text-white" style={{ fontSize: "12px", fontWeight: 600 }}>
            <Plus className="w-3.5 h-3.5" /> Nouveau modèle
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {ticketTemplates.map(t => (
            <div key={t.id} className="p-3 rounded-xl bg-[var(--ipk-surface)] flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div style={{ fontSize: "13px", fontWeight: 600 }}>{t.label}</div>
                <div className="text-[var(--ipk-text-muted)]" style={{ fontSize: "11px" }}>{t.description}</div>
                <div className="text-[var(--ipk-text-muted)] mt-1" style={{ fontSize: "11px" }}>CTA : <span className="font-mono">{t.cta}</span></div>
              </div>
              <div className="flex items-center gap-1 flex-none">
                <button title="Émettre depuis ce modèle" onClick={() => setIssuing({ template: t })} className="p-1.5 rounded-lg hover:bg-white"><PlusCircle className="w-3.5 h-3.5" /></button>
                <button title="Éditer" onClick={() => setEditingTpl(t)} className="p-1.5 rounded-lg hover:bg-white"><Pencil className="w-3.5 h-3.5" /></button>
                <button title="Supprimer" onClick={() => { if (confirm(`Supprimer le modèle "${t.label}" ?`)) { deleteTicketTemplate(t.id); toast.success("Modèle supprimé"); } }} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
          {ticketTemplates.length === 0 && <div className="col-span-full text-[var(--ipk-text-muted)] text-center py-4" style={{ fontSize: "13px" }}>Aucun modèle.</div>}
        </div>
      </DataCard>

      <DataCard>
        <div className="mb-3 flex flex-wrap items-center gap-2 justify-between">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="min-w-[200px] flex-1"><SearchInput value={search} onChange={setSearch} placeholder="Code, libellé, email…" /></div>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as typeof filterStatus)} className="px-3 py-1.5 border border-[var(--ipk-border)] rounded-full bg-white" style={{ fontSize: "12px" }}>
              <option value="all">Tous statuts</option>
              <option value="active">Actifs</option>
              <option value="used">Utilisés</option>
              <option value="expired">Expirés</option>
              <option value="cancelled">Annulés</option>
            </select>
          </div>
          <button onClick={() => setIssuing({})} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--ipk-green-dark)] text-white" style={{ fontSize: "12px", fontWeight: 600 }}>
            <Plus className="w-3.5 h-3.5" /> Émettre un ticket
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ fontSize: "13px" }}>
            <thead className="bg-[var(--ipk-surface)] text-left text-[var(--ipk-text-muted)]">
              <tr>
                <th className="px-3 py-2">Code</th>
                <th className="px-3 py-2">Libellé</th>
                <th className="px-3 py-2">Destinataire</th>
                <th className="px-3 py-2">Avantage</th>
                <th className="px-3 py-2">Expire</th>
                <th className="px-3 py-2">Statut</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => {
                const tone = t.status === "active" ? "success" : t.status === "used" ? "info" : t.status === "expired" ? "warn" : "danger";
                const label = t.status === "active" ? "Actif" : t.status === "used" ? "Utilisé" : t.status === "expired" ? "Expiré" : "Annulé";
                return (
                  <tr key={t.id} className="border-t border-[var(--ipk-border)]">
                    <td className="px-3 py-2"><code>{t.code}</code></td>
                    <td className="px-3 py-2">
                      <div style={{ fontWeight: 600 }}>{t.label}</div>
                      <div className="text-[var(--ipk-text-muted)]" style={{ fontSize: "11px" }}>Émis {fmtDate(t.earnedAt)} · {t.issuedBy === "admin" ? "admin" : "système"}</div>
                    </td>
                    <td className="px-3 py-2">{t.assignedEmail || <span className="text-[var(--ipk-text-muted)]">—</span>}</td>
                    <td className="px-3 py-2">{t.pct ? `-${t.pct}%` : t.amount ? `${fmt(t.amount)} F` : "—"}</td>
                    <td className="px-3 py-2">{fmtDate(t.expiresAt)}</td>
                    <td className="px-3 py-2"><StatusPill status={label} tone={tone as "success" | "info" | "warn" | "danger"} /></td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-1">
                        {(t.status === "active" || t.status === "expired") && (
                          <button title="Prolonger +30 jours" onClick={() => { extendTicket(t.id, 30); toast.success("Expiration prolongée de 30 jours"); }} className="p-1.5 rounded-lg hover:bg-[var(--ipk-surface)]"><Clock className="w-3.5 h-3.5" /></button>
                        )}
                        {t.status === "active" && (
                          <button title="Annuler" onClick={() => { if (confirm(`Annuler le ticket ${t.code} ?`)) { cancelTicket(t.id); toast.success("Ticket annulé"); } }} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-700"><Ban className="w-3.5 h-3.5" /></button>
                        )}
                        <button title="Supprimer" onClick={() => { if (confirm(`Supprimer définitivement le ticket ${t.code} ?`)) { deleteTicket(t.id); toast.success("Ticket supprimé"); } }} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={7}><EmptyRow message="Aucun ticket." /></td></tr>}
            </tbody>
          </table>
        </div>
      </DataCard>

      {issuing && (
        <TicketIssuer
          template={issuing.template}
          onClose={() => setIssuing(null)}
          onSave={(data) => {
            const t = awardTicket({ ...data, issuedBy: "admin" });
            toast.success(`Ticket émis : ${t.code}`);
            setIssuing(null);
          }}
        />
      )}
      {editingTpl && (
        <TicketTemplateEditor
          initial={editingTpl === "new" ? null : editingTpl}
          onClose={() => setEditingTpl(null)}
          onSave={(data) => {
            if (editingTpl === "new") { createTicketTemplate(data); toast.success("Modèle créé"); }
            else { updateTicketTemplate(editingTpl.id, data); toast.success("Modèle mis à jour"); }
            setEditingTpl(null);
          }}
        />
      )}
    </div>
  );
}

function TicketIssuer({ template, onClose, onSave }: { template?: GiftTicket; onClose: () => void; onSave: (data: { label: string; assignedEmail?: string; pct?: number; amount?: number; expiresInDays: number; templateId?: string }) => void }) {
  const [label, setLabel] = useState(template?.label || "");
  const [assignedEmail, setAssignedEmail] = useState("");
  const [advantage, setAdvantage] = useState<"pct" | "amount">("pct");
  const [pct, setPct] = useState(10);
  const [amount, setAmount] = useState(5000);
  const [expiresInDays, setExpiresInDays] = useState(60);

  const submit = () => {
    if (!label.trim()) { toast.error("Libellé requis"); return; }
    if (assignedEmail && !assignedEmail.includes("@")) { toast.error("Email invalide"); return; }
    if (advantage === "pct" && pct <= 0) { toast.error("Pourcentage invalide"); return; }
    if (advantage === "amount" && amount <= 0) { toast.error("Montant invalide"); return; }
    onSave({
      label: label.trim(),
      assignedEmail: assignedEmail.trim() || undefined,
      pct: advantage === "pct" ? pct : undefined,
      amount: advantage === "amount" ? amount : undefined,
      expiresInDays,
      templateId: template?.id,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-3" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white px-5 py-3 border-b border-[var(--ipk-border)] flex items-center justify-between">
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700 }}>Émettre un ticket{template ? ` — ${template.label}` : ""}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--ipk-surface)]"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ fontSize: "13px" }}>
          <Field label="Libellé" className="sm:col-span-2">
            <input value={label} onChange={e => setLabel(e.target.value)} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Email destinataire (optionnel)" className="sm:col-span-2">
            <input type="email" value={assignedEmail} onChange={e => setAssignedEmail(e.target.value)} placeholder="laisser vide pour ticket non nominatif" className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Type d'avantage">
            <select value={advantage} onChange={e => setAdvantage(e.target.value as "pct" | "amount")} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl">
              <option value="pct">Pourcentage</option>
              <option value="amount">Montant fixe (Fcfa)</option>
            </select>
          </Field>
          <Field label={advantage === "pct" ? "Pourcentage (%)" : "Montant (Fcfa)"}>
            {advantage === "pct"
              ? <input type="number" min={1} max={100} value={pct} onChange={e => setPct(Number(e.target.value))} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
              : <input type="number" min={500} step={500} value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />}
          </Field>
          <Field label="Validité (jours)" className="sm:col-span-2">
            <input type="number" min={1} max={365} value={expiresInDays} onChange={e => setExpiresInDays(Number(e.target.value))} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
        </div>
        <div className="sticky bottom-0 bg-white px-5 py-3 border-t border-[var(--ipk-border)] flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 rounded-full border border-[var(--ipk-border)]" style={{ fontSize: "12px" }}>Annuler</button>
          <button onClick={submit} className="px-3 py-1.5 rounded-full bg-[var(--ipk-green-dark)] text-white" style={{ fontSize: "12px", fontWeight: 600 }}>Émettre</button>
        </div>
      </div>
    </div>
  );
}

function TicketTemplateEditor({ initial, onClose, onSave }: { initial: GiftTicket | null; onClose: () => void; onSave: (data: Omit<GiftTicket, "id">) => void }) {
  const [form, setForm] = useState<Omit<GiftTicket, "id">>(() => initial ? { ...initial } as Omit<GiftTicket, "id"> : {
    label: "", description: "", cta: "Activer", style: { theme: "ochre", pattern: "adinkra" },
  });
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.label.trim()) { toast.error("Libellé requis"); return; }
    if (!form.cta.trim()) { toast.error("CTA requis"); return; }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-3" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-xl" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-3 border-b border-[var(--ipk-border)] flex items-center justify-between">
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700 }}>{initial ? "Éditer le modèle" : "Nouveau modèle"}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--ipk-surface)]"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ fontSize: "13px" }}>
          <Field label="Libellé" className="sm:col-span-2">
            <input value={form.label} onChange={e => set("label", e.target.value)} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={2} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="CTA (libellé bouton)">
            <input value={form.cta} onChange={e => set("cta", e.target.value)} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Thème visuel">
            <select value={form.style.theme} onChange={e => set("style", { ...form.style, theme: e.target.value as CouponTheme })} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl">
              {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Motif">
            <select value={form.style.pattern} onChange={e => set("style", { ...form.style, pattern: e.target.value as CouponPattern })} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl">
              {PATTERNS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
        </div>
        <div className="px-5 py-3 border-t border-[var(--ipk-border)] flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 rounded-full border border-[var(--ipk-border)]" style={{ fontSize: "12px" }}>Annuler</button>
          <button onClick={submit} className="px-3 py-1.5 rounded-full bg-[var(--ipk-green-dark)] text-white" style={{ fontSize: "12px", fontWeight: 600 }}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

function LoyaltyTab() {
  const { loyaltyPoints, loyaltyHistory, loyaltyUsers, loyaltyConfig, updateLoyaltyConfig, adjustUserPoints, resetUserPoints, loyaltyForUser } = useMarketing();
  const [search, setSearch] = useState("");
  const [adjusting, setAdjusting] = useState<{ email: string; mode: "credit" | "debit" } | null>(null);
  const [creating, setCreating] = useState(false);
  const [viewing, setViewing] = useState<string | null>(null);

  const totalEarned = loyaltyHistory.filter(h => h.delta > 0).reduce((s, h) => s + h.delta, 0);
  const totalRedeemed = Math.abs(loyaltyHistory.filter(h => h.delta < 0).reduce((s, h) => s + h.delta, 0));
  const totalAcrossUsers = loyaltyUsers.reduce((s, u) => s + u.points, 0);
  const filtered = loyaltyUsers.filter(u => !search || u.email.includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi label="Solde visiteur" value={fmt(loyaltyPoints)} tone="success" />
        <Kpi label="Comptes clients" value={loyaltyUsers.length} />
        <Kpi label="Points en circulation" value={fmt(totalAcrossUsers)} />
        <Kpi label="Convertis (visiteur)" value={fmt(totalRedeemed)} tone="warn" />
      </div>

      <DataCard>
        <h3 className="mb-3 inline-flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 700 }}>
          <Settings className="w-4 h-4" /> Configuration du programme
        </h3>
        <LoyaltyConfigForm config={loyaltyConfig} onSave={(patch) => { updateLoyaltyConfig(patch); toast.success("Configuration enregistrée"); }} />
      </DataCard>

      <DataCard>
        <div className="mb-3 flex flex-wrap items-center gap-2 justify-between">
          <h3 className="inline-flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 700 }}>
            <User className="w-4 h-4" /> Comptes fidélité clients
          </h3>
          <button onClick={() => setCreating(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--ipk-green-dark)] text-white" style={{ fontSize: "12px", fontWeight: 600 }}>
            <Plus className="w-3.5 h-3.5" /> Créditer un client
          </button>
        </div>
        <div className="mb-3"><SearchInput value={search} onChange={setSearch} placeholder="Email du client…" /></div>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ fontSize: "13px" }}>
            <thead className="bg-[var(--ipk-surface)] text-left text-[var(--ipk-text-muted)]">
              <tr>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Solde</th>
                <th className="px-3 py-2">Équivalent Fcfa</th>
                <th className="px-3 py-2">Dernière activité</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.email} className="border-t border-[var(--ipk-border)]">
                  <td className="px-3 py-2"><button onClick={() => setViewing(u.email)} className="hover:underline">{u.email}</button></td>
                  <td className="px-3 py-2"><strong>{fmt(u.points)}</strong> pts</td>
                  <td className="px-3 py-2 text-[var(--ipk-text-muted)]">{fmt(u.points * loyaltyConfig.toFcfaRatio)} F</td>
                  <td className="px-3 py-2">{u.history[0] ? fmtDate(u.history[0].at) : "—"}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-1">
                      <button title="Créditer" onClick={() => setAdjusting({ email: u.email, mode: "credit" })} className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-700"><Plus className="w-3.5 h-3.5" /></button>
                      <button title="Débiter" onClick={() => setAdjusting({ email: u.email, mode: "debit" })} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-700"><Minus className="w-3.5 h-3.5" /></button>
                      <button title="Voir l'historique" onClick={() => setViewing(u.email)} className="p-1.5 rounded-lg hover:bg-[var(--ipk-surface)]"><Coins className="w-3.5 h-3.5" /></button>
                      <button title="Réinitialiser à 0" onClick={() => { if (confirm(`Réinitialiser le solde de ${u.email} à 0 ?`)) { resetUserPoints(u.email); toast.success("Solde réinitialisé"); } }} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><RotateCcw className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5}><EmptyRow message="Aucun compte fidélité." /></td></tr>}
            </tbody>
          </table>
        </div>
      </DataCard>

      <DataCard>
        <h3 className="mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 700 }}>Historique du compte visiteur (démo)</h3>
        {loyaltyHistory.length === 0 ? <EmptyRow message="Aucune transaction." /> : (
          <div className="space-y-1">
            <div className="text-[var(--ipk-text-muted)] mb-2" style={{ fontSize: "11px" }}>Total gagné : {fmt(totalEarned)} pts</div>
            {loyaltyHistory.slice(0, 30).map(h => (
              <div key={h.id} className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg bg-[var(--ipk-surface)]" style={{ fontSize: "12px" }}>
                <span className="truncate min-w-0">{h.reason} <span className="text-[var(--ipk-text-muted)]">· {fmtDate(h.at)}</span></span>
                <span className={`shrink-0 ${h.delta > 0 ? "text-emerald-700" : "text-amber-700"}`} style={{ fontWeight: 700 }}>{h.delta > 0 ? "+" : ""}{fmt(h.delta)} pts</span>
              </div>
            ))}
          </div>
        )}
      </DataCard>

      {creating && (
        <LoyaltyAdjustModal
          email=""
          mode="credit"
          allowEmailEdit
          onClose={() => setCreating(false)}
          onSave={(email, delta, reason) => {
            adjustUserPoints(email, delta, reason);
            toast.success(`${delta >= 0 ? "+" : ""}${delta} pts → ${email}`);
            setCreating(false);
          }}
        />
      )}
      {adjusting && (
        <LoyaltyAdjustModal
          email={adjusting.email}
          mode={adjusting.mode}
          onClose={() => setAdjusting(null)}
          onSave={(email, delta, reason) => {
            adjustUserPoints(email, delta, reason);
            toast.success(`${delta >= 0 ? "+" : ""}${delta} pts → ${email}`);
            setAdjusting(null);
          }}
        />
      )}
      {viewing && (
        <LoyaltyHistoryModal
          user={loyaltyForUser(viewing)}
          ratio={loyaltyConfig.toFcfaRatio}
          onClose={() => setViewing(null)}
        />
      )}
    </div>
  );
}

function LoyaltyConfigForm({ config, onSave }: { config: { perFcfa: number; toFcfaRatio: number; redeemMin: number }; onSave: (patch: { perFcfa?: number; toFcfaRatio?: number; redeemMin?: number }) => void }) {
  // perFcfa stocké en "points par 100 Fcfa" pour l'UI
  const [perHundred, setPerHundred] = useState(config.perFcfa * 100);
  const [toFcfaRatio, setToFcfaRatio] = useState(config.toFcfaRatio);
  const [redeemMin, setRedeemMin] = useState(config.redeemMin);

  const submit = () => {
    if (perHundred <= 0 || toFcfaRatio <= 0 || redeemMin <= 0) { toast.error("Valeurs invalides"); return; }
    onSave({ perFcfa: perHundred / 100, toFcfaRatio, redeemMin });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" style={{ fontSize: "13px" }}>
      <Field label="Points gagnés / 100 Fcfa">
        <input type="number" min={0.1} step={0.1} value={perHundred} onChange={e => setPerHundred(Number(e.target.value))} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
      </Field>
      <Field label="Valeur d'1 point (Fcfa)">
        <input type="number" min={1} step={1} value={toFcfaRatio} onChange={e => setToFcfaRatio(Number(e.target.value))} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
      </Field>
      <Field label="Conversion minimum (points)">
        <input type="number" min={100} step={100} value={redeemMin} onChange={e => setRedeemMin(Number(e.target.value))} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
      </Field>
      <div className="sm:col-span-3 flex items-center justify-between gap-2 mt-1">
        <div className="text-[var(--ipk-text-muted)]" style={{ fontSize: "11px" }}>
          Aperçu : un achat de 50 000 Fcfa = <strong>{Math.floor(50000 * (perHundred / 100) * 100) / 100} pts</strong> · {redeemMin} pts = <strong>{redeemMin * toFcfaRatio} Fcfa</strong>
        </div>
        <button onClick={submit} className="px-3 py-1.5 rounded-full bg-[var(--ipk-green-dark)] text-white" style={{ fontSize: "12px", fontWeight: 600 }}>Enregistrer</button>
      </div>
    </div>
  );
}

function LoyaltyAdjustModal({ email: initialEmail, mode, allowEmailEdit, onClose, onSave }: { email: string; mode: "credit" | "debit"; allowEmailEdit?: boolean; onClose: () => void; onSave: (email: string, delta: number, reason: string) => void }) {
  const [email, setEmail] = useState(initialEmail);
  const [points, setPoints] = useState(100);
  const [reason, setReason] = useState(mode === "credit" ? "Geste commercial" : "Correction admin");

  const submit = () => {
    if (!email.includes("@")) { toast.error("Email invalide"); return; }
    if (points <= 0) { toast.error("Quantité invalide"); return; }
    if (!reason.trim()) { toast.error("Raison requise"); return; }
    onSave(email.trim().toLowerCase(), mode === "credit" ? points : -points, reason.trim());
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-3" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-3 border-b border-[var(--ipk-border)] flex items-center justify-between">
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700 }}>{mode === "credit" ? "Créditer" : "Débiter"} des points</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--ipk-surface)]"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 grid grid-cols-1 gap-3" style={{ fontSize: "13px" }}>
          <Field label="Email du client">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} disabled={!allowEmailEdit && !!initialEmail} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl disabled:bg-[var(--ipk-surface)]" />
          </Field>
          <Field label={`Points à ${mode === "credit" ? "créditer" : "débiter"}`}>
            <input type="number" min={1} value={points} onChange={e => setPoints(Number(e.target.value))} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" autoFocus />
          </Field>
          <Field label="Raison (visible dans l'historique)">
            <input value={reason} onChange={e => setReason(e.target.value)} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
        </div>
        <div className="px-5 py-3 border-t border-[var(--ipk-border)] flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 rounded-full border border-[var(--ipk-border)]" style={{ fontSize: "12px" }}>Annuler</button>
          <button onClick={submit} className={`px-3 py-1.5 rounded-full text-white ${mode === "credit" ? "bg-[var(--ipk-green-dark)]" : "bg-amber-600"}`} style={{ fontSize: "12px", fontWeight: 600 }}>{mode === "credit" ? "Créditer" : "Débiter"}</button>
        </div>
      </div>
    </div>
  );
}

function LoyaltyHistoryModal({ user, ratio, onClose }: { user: { email: string; points: number; history: LoyaltyTxn[] }; ratio: number; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-3" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white px-5 py-3 border-b border-[var(--ipk-border)] flex items-center justify-between">
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700 }}>{user.email}</h3>
            <div className="text-[var(--ipk-text-muted)]" style={{ fontSize: "12px" }}><strong>{fmt(user.points)}</strong> pts · ≈ {fmt(user.points * ratio)} Fcfa</div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--ipk-surface)]"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-1" style={{ fontSize: "12px" }}>
          {user.history.length === 0 ? <EmptyRow message="Aucune transaction." /> : user.history.map(h => (
            <div key={h.id} className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg bg-[var(--ipk-surface)]">
              <span className="truncate min-w-0">{h.reason} <span className="text-[var(--ipk-text-muted)]">· {fmtDate(h.at)}</span></span>
              <span className={`shrink-0 ${h.delta > 0 ? "text-emerald-700" : h.delta < 0 ? "text-amber-700" : "text-[var(--ipk-text-muted)]"}`} style={{ fontWeight: 700 }}>{h.delta > 0 ? "+" : ""}{fmt(h.delta)} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MarketDaysTab() {
  const { marketDays, createMarketDay, updateMarketDay, deleteMarketDay } = useMarketing();
  const [editing, setEditing] = useState<MarketDay | "new" | null>(null);
  const today = new Date();

  return (
    <div className="space-y-4">
      <DataCard>
        <div className="mb-3 flex items-center justify-between">
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 700 }}>{marketDays.length} journée{marketDays.length > 1 ? "s" : ""} programmée{marketDays.length > 1 ? "s" : ""}</h3>
          <button onClick={() => setEditing("new")} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--ipk-green-dark)] text-white" style={{ fontSize: "12px", fontWeight: 600 }}>
            <Plus className="w-3.5 h-3.5" /> Nouvelle journée
          </button>
        </div>
        <div className="space-y-2">
          {marketDays.map(d => {
            const isToday = new Date(d.date).toDateString() === today.toDateString();
            const past = new Date(d.date) < today && !isToday;
            return (
              <div key={d.id} className="p-3 rounded-xl bg-[var(--ipk-surface)] flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center flex-wrap gap-2">
                    <div style={{ fontWeight: 700 }}>{d.weekday} · {fmtDate(d.date)}</div>
                    {isToday && <StatusPill status="Aujourd'hui" tone="success" />}
                    {past && <StatusPill status="Passé" tone="neutral" />}
                    <span className="px-2 py-0.5 rounded-full bg-white border border-[var(--ipk-border)] text-[var(--ipk-text-muted)]" style={{ fontSize: "10px" }}>{d.style.theme} · {d.style.pattern}</span>
                  </div>
                  <div className="text-[var(--ipk-text-muted)]" style={{ fontSize: "12px" }}>{d.theme} — {d.description}</div>
                  <div className="mt-1" style={{ fontSize: "12px", fontWeight: 600 }}>{d.highlight}</div>
                </div>
                <div className="flex items-center gap-1 flex-none">
                  <button title="Éditer" onClick={() => setEditing(d)} className="p-1.5 rounded-lg hover:bg-white"><Pencil className="w-3.5 h-3.5" /></button>
                  <button title="Supprimer" onClick={() => { if (confirm(`Supprimer la journée "${d.theme}" du ${d.date} ?`)) { deleteMarketDay(d.id); toast.success("Journée supprimée"); } }} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            );
          })}
          {marketDays.length === 0 && <EmptyRow message="Aucune journée programmée." />}
        </div>
      </DataCard>

      {editing && (
        <MarketDayEditor
          initial={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={(data) => {
            if (editing === "new") { createMarketDay(data); toast.success("Journée créée"); }
            else { updateMarketDay(editing.id, data); toast.success("Journée mise à jour"); }
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

const WEEKDAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

function MarketDayEditor({ initial, onClose, onSave }: { initial: MarketDay | null; onClose: () => void; onSave: (data: Omit<MarketDay, "id">) => void }) {
  const [form, setForm] = useState<Omit<MarketDay, "id">>(() => initial ? { ...initial } as Omit<MarketDay, "id"> : {
    weekday: WEEKDAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1],
    date: new Date().toISOString().slice(0, 10),
    theme: "",
    description: "",
    highlight: "",
    style: { theme: "amber", pattern: "kente" },
  });
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.theme.trim() || !form.highlight.trim()) { toast.error("Thème et offre phare requis"); return; }
    if (!form.date) { toast.error("Date requise"); return; }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-3" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white px-5 py-3 border-b border-[var(--ipk-border)] flex items-center justify-between">
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700 }}>{initial ? "Éditer la journée" : "Nouvelle journée"}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--ipk-surface)]"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ fontSize: "13px" }}>
          <Field label="Date">
            <input type="date" value={form.date} onChange={e => {
              const d = e.target.value;
              const day = new Date(d).getDay();
              set("date", d);
              set("weekday", WEEKDAYS[day === 0 ? 6 : day - 1]);
            }} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Jour de la semaine">
            <select value={form.weekday} onChange={e => set("weekday", e.target.value)} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl">
              {WEEKDAYS.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </Field>
          <Field label="Thème" className="sm:col-span-2">
            <input value={form.theme} onChange={e => set("theme", e.target.value)} placeholder="Bijoux & parures, Textiles & wax…" className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={2} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Offre phare (highlight)" className="sm:col-span-2">
            <input value={form.highlight} onChange={e => set("highlight", e.target.value)} placeholder="-15% sur la collection bijoux" className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Thème visuel">
            <select value={form.style.theme} onChange={e => set("style", { ...form.style, theme: e.target.value as CouponTheme })} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl">
              {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Motif">
            <select value={form.style.pattern} onChange={e => set("style", { ...form.style, pattern: e.target.value as CouponPattern })} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl">
              {PATTERNS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
        </div>
        <div className="sticky bottom-0 bg-white px-5 py-3 border-t border-[var(--ipk-border)] flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 rounded-full border border-[var(--ipk-border)]" style={{ fontSize: "12px" }}>Annuler</button>
          <button onClick={submit} className="px-3 py-1.5 rounded-full bg-[var(--ipk-green-dark)] text-white" style={{ fontSize: "12px", fontWeight: 600 }}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

const WHEEL_TYPES: WheelPrize["type"][] = ["discount", "freeship", "giftcard", "lose", "ticket", "points"];
const WHEEL_TYPE_LABEL: Record<WheelPrize["type"], string> = {
  discount: "Remise %",
  freeship: "Livraison offerte",
  giftcard: "Carte cadeau",
  lose: "Rejouez / perdu",
  ticket: "Ticket bonus",
  points: "Points fidélité",
};

function WheelTab() {
  const { wheelPrizes, createWheelPrize, updateWheelPrize, deleteWheelPrize, wheelConfig, updateWheelConfig, wheelStats, resetWheelStats } = useMarketing();
  const [editing, setEditing] = useState<WheelPrize | "new" | null>(null);
  const [maxSpins, setMaxSpins] = useState(wheelConfig.maxSpinsPerDay);

  const totalWeight = wheelPrizes.reduce((s, p) => s + p.weight, 0);
  const todayKey = new Date();
  const todayStr = `${todayKey.getFullYear()}-${todayKey.getMonth() + 1}-${todayKey.getDate()}`;
  const spinsToday = wheelStats.filter(s => s.day === todayStr).length;

  const statsByPrize = useMemo(() => {
    const m = new Map<string, number>();
    wheelStats.forEach(s => m.set(s.prizeId, (m.get(s.prizeId) || 0) + 1));
    return m;
  }, [wheelStats]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi label="Lots configurés" value={wheelPrizes.length} />
        <Kpi label="Spins enregistrés" value={fmt(wheelStats.length)} />
        <Kpi label="Spins aujourd'hui" value={spinsToday} tone="success" />
        <Kpi label="Quota / visiteur / jour" value={wheelConfig.maxSpinsPerDay} />
      </div>

      <DataCard>
        <h3 className="mb-3 inline-flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 700 }}>
          <Settings className="w-4 h-4" /> Configuration
        </h3>
        <div className="flex flex-wrap items-end gap-3" style={{ fontSize: "13px" }}>
          <Field label="Spins maximum par jour et par visiteur" className="flex-1 min-w-[240px]">
            <input type="number" min={1} max={20} value={maxSpins} onChange={e => setMaxSpins(Number(e.target.value))} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <button onClick={() => { if (maxSpins > 0) { updateWheelConfig({ maxSpinsPerDay: maxSpins }); toast.success("Quota mis à jour"); } else toast.error("Quota invalide"); }} className="px-3 py-1.5 rounded-full bg-[var(--ipk-green-dark)] text-white" style={{ fontSize: "12px", fontWeight: 600 }}>Enregistrer</button>
        </div>
      </DataCard>

      <DataCard>
        <div className="mb-3 flex items-center justify-between">
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 700 }}>Lots de la roue</h3>
          <button onClick={() => setEditing("new")} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--ipk-green-dark)] text-white" style={{ fontSize: "12px", fontWeight: 600 }}>
            <Plus className="w-3.5 h-3.5" /> Nouveau lot
          </button>
        </div>
        <div className="text-[var(--ipk-text-muted)] mb-2" style={{ fontSize: "11px" }}>Poids total : <strong>{totalWeight}</strong> — la probabilité d'un lot = poids / total.</div>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ fontSize: "13px" }}>
            <thead className="bg-[var(--ipk-surface)] text-left text-[var(--ipk-text-muted)]">
              <tr>
                <th className="px-3 py-2">Lot</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Valeur</th>
                <th className="px-3 py-2">Poids</th>
                <th className="px-3 py-2">Probabilité</th>
                <th className="px-3 py-2">Tirages</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {wheelPrizes.map(p => {
                const proba = totalWeight > 0 ? (p.weight / totalWeight) * 100 : 0;
                const drawn = statsByPrize.get(p.id) || 0;
                return (
                  <tr key={p.id} className="border-t border-[var(--ipk-border)]">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-4 h-4 rounded-full border border-white shadow" style={{ background: p.color }} />
                        <strong>{p.label}</strong>
                      </div>
                    </td>
                    <td className="px-3 py-2">{WHEEL_TYPE_LABEL[p.type]}</td>
                    <td className="px-3 py-2">{p.value ?? "—"}</td>
                    <td className="px-3 py-2">{p.weight}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 rounded-full bg-[var(--ipk-border)]/40 overflow-hidden">
                          <div className="h-full bg-[var(--ipk-green-dark)]" style={{ width: `${Math.min(100, proba)}%` }} />
                        </div>
                        <span style={{ fontVariantNumeric: "tabular-nums" }}>{proba.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2"><strong>{fmt(drawn)}</strong></td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-1">
                        <button title="Éditer" onClick={() => setEditing(p)} className="p-1.5 rounded-lg hover:bg-[var(--ipk-surface)]"><Pencil className="w-3.5 h-3.5" /></button>
                        <button title="Supprimer" onClick={() => { if (confirm(`Supprimer le lot "${p.label}" ?`)) { deleteWheelPrize(p.id); toast.success("Lot supprimé"); } }} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {wheelPrizes.length === 0 && <tr><td colSpan={7}><EmptyRow message="Aucun lot configuré." /></td></tr>}
            </tbody>
          </table>
        </div>
      </DataCard>

      <DataCard>
        <div className="flex items-center justify-between mb-3">
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 700 }}>Statistiques</h3>
          {wheelStats.length > 0 && (
            <button onClick={() => { if (confirm("Réinitialiser toutes les statistiques de la roue ?")) { resetWheelStats(); toast.success("Statistiques réinitialisées"); } }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--ipk-border)] text-[var(--ipk-text-muted)]" style={{ fontSize: "12px" }}>
              <RotateCcw className="w-3.5 h-3.5" /> Réinitialiser
            </button>
          )}
        </div>
        {wheelStats.length === 0 ? <EmptyRow message="Aucun spin enregistré." /> : (
          <div className="space-y-1">
            {wheelStats.slice(0, 30).map((s, i) => {
              const prize = wheelPrizes.find(p => p.id === s.prizeId);
              return (
                <div key={i} className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg bg-[var(--ipk-surface)]" style={{ fontSize: "12px" }}>
                  <span className="inline-flex items-center gap-2 min-w-0 truncate">
                    <span className="inline-block w-3 h-3 rounded-full border border-white shadow" style={{ background: prize?.color || "#999" }} />
                    <strong>{prize?.label || s.prizeId}</strong>
                  </span>
                  <span className="text-[var(--ipk-text-muted)]">{new Date(s.at).toLocaleString("fr-FR")}</span>
                </div>
              );
            })}
            {wheelStats.length > 30 && <div className="text-[var(--ipk-text-muted)] text-center pt-2" style={{ fontSize: "11px" }}>… et {wheelStats.length - 30} spins de plus</div>}
          </div>
        )}
      </DataCard>

      {editing && (
        <WheelPrizeEditor
          initial={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={(data) => {
            if (editing === "new") { createWheelPrize(data); toast.success("Lot créé"); }
            else { updateWheelPrize(editing.id, data); toast.success("Lot mis à jour"); }
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function WheelPrizeEditor({ initial, onClose, onSave }: { initial: WheelPrize | null; onClose: () => void; onSave: (data: Omit<WheelPrize, "id">) => void }) {
  const [form, setForm] = useState<Omit<WheelPrize, "id">>(() => initial ? { ...initial } as Omit<WheelPrize, "id"> : {
    label: "", type: "discount", value: 5, weight: 10, color: "#0B6B3A",
  });
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.label.trim()) { toast.error("Libellé requis"); return; }
    if (form.weight <= 0) { toast.error("Poids invalide"); return; }
    onSave(form);
  };

  const needsValue = form.type === "discount" || form.type === "giftcard" || form.type === "points";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-3" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-xl" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-3 border-b border-[var(--ipk-border)] flex items-center justify-between">
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700 }}>{initial ? "Éditer le lot" : "Nouveau lot"}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--ipk-surface)]"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ fontSize: "13px" }}>
          <Field label="Libellé (affiché sur la roue)" className="sm:col-span-2">
            <input value={form.label} onChange={e => set("label", e.target.value)} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Type">
            <select value={form.type} onChange={e => set("type", e.target.value as WheelPrize["type"])} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl">
              {WHEEL_TYPES.map(t => <option key={t} value={t}>{WHEEL_TYPE_LABEL[t]}</option>)}
            </select>
          </Field>
          <Field label={form.type === "discount" ? "Pourcentage (%)" : form.type === "giftcard" ? "Montant Fcfa" : form.type === "points" ? "Points" : "Valeur (n/a)"}>
            <input type="number" min={0} value={form.value ?? 0} onChange={e => set("value", Number(e.target.value))} disabled={!needsValue} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl disabled:bg-[var(--ipk-surface)]" />
          </Field>
          <Field label="Poids (probabilité relative)">
            <input type="number" min={1} max={100} value={form.weight} onChange={e => set("weight", Number(e.target.value))} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Couleur">
            <div className="flex items-center gap-2">
              <input type="color" value={form.color} onChange={e => set("color", e.target.value)} className="w-10 h-9 rounded-lg border border-[var(--ipk-border)] cursor-pointer" />
              <input value={form.color} onChange={e => set("color", e.target.value)} className="flex-1 px-3 py-2 border border-[var(--ipk-border)] rounded-xl font-mono" />
            </div>
          </Field>
        </div>
        <div className="px-5 py-3 border-t border-[var(--ipk-border)] flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 rounded-full border border-[var(--ipk-border)]" style={{ fontSize: "12px" }}>Annuler</button>
          <button onClick={submit} className="px-3 py-1.5 rounded-full bg-[var(--ipk-green-dark)] text-white" style={{ fontSize: "12px", fontWeight: 600 }}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

// ===== Helpers d'export CSV =====
function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = typeof v === "string" ? v : typeof v === "object" ? JSON.stringify(v) : String(v);
  if (/[",\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}
function downloadCSV(filename: string, rows: Array<Record<string, unknown>>) {
  if (rows.length === 0) { toast.error("Aucune donnée à exporter"); return; }
  const headers = Array.from(rows.reduce((set, r) => { Object.keys(r).forEach(k => set.add(k)); return set; }, new Set<string>()));
  const lines = [headers.join(","), ...rows.map(r => headers.map(h => csvEscape(r[h])).join(","))];
  const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
  toast.success(`${rows.length} ligne${rows.length > 1 ? "s" : ""} exportée${rows.length > 1 ? "s" : ""}`);
}

function TransverseTab() {
  const { promotions, flashDeals, contests, contestEntries, giftCards, tickets, marketDays, wheelPrizes, wheelStats, loyaltyUsers, broadcastPush } = useMarketing();
  const { entries: auditEntries } = useAuditLog();
  const marketingActions = useMemo(() => auditEntries.filter(a => a.entity === "promo"), [auditEntries]);

  const [pushTitle, setPushTitle] = useState("Nouveauté IPK");
  const [pushBody, setPushBody] = useState("Découvrez nos nouvelles promotions du jour !");
  const [pushUrl, setPushUrl] = useState("/promotions");
  const [permission, setPermission] = useState<NotificationPermission>(typeof Notification !== "undefined" ? Notification.permission : "default");

  // Analytics rapides à partir du journal d'audit
  const analytics = useMemo(() => {
    const byAction = new Map<string, number>();
    const byDay = new Map<string, number>();
    marketingActions.forEach(a => {
      byAction.set(a.action, (byAction.get(a.action) || 0) + 1);
      const d = a.date.slice(0, 10);
      byDay.set(d, (byDay.get(d) || 0) + 1);
    });
    const topActions = [...byAction.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
    const last7 = [...byDay.entries()].sort((a, b) => b[0].localeCompare(a[0])).slice(0, 7).reverse();
    return { topActions, last7, totalActions: marketingActions.length };
  }, [marketingActions]);

  const requestNotif = async () => {
    if (typeof Notification === "undefined") { toast.error("Notifications non supportées"); return; }
    const p = await Notification.requestPermission();
    setPermission(p);
    if (p === "granted") toast.success("Notifications activées");
    else toast.error("Permission refusée");
  };

  const sendPush = () => {
    if (!pushTitle.trim() || !pushBody.trim()) { toast.error("Titre et message requis"); return; }
    broadcastPush({ title: pushTitle.trim(), body: pushBody.trim(), url: pushUrl.trim() || undefined });
    toast.success("Push diffusé");
  };

  return (
    <div className="space-y-4">
      {/* === Push broadcast === */}
      <DataCard>
        <h3 className="mb-3 inline-flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 700 }}>
          <Bell className="w-4 h-4" /> Diffuser une notification
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ fontSize: "13px" }}>
          <Field label="Titre">
            <input value={pushTitle} onChange={e => setPushTitle(e.target.value)} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Lien (url interne)">
            <input value={pushUrl} onChange={e => setPushUrl(e.target.value)} placeholder="/promotions" className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
          <Field label="Message" className="sm:col-span-2">
            <textarea value={pushBody} onChange={e => setPushBody(e.target.value)} rows={2} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </Field>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 justify-between">
          <div className="text-[var(--ipk-text-muted)]" style={{ fontSize: "11px" }}>
            Permission navigateur : <strong>{permission}</strong> · La diffusion envoie un toast à tous les onglets ouverts + une notification système si autorisée.
          </div>
          <div className="flex gap-2">
            {permission !== "granted" && <button onClick={requestNotif} className="px-3 py-1.5 rounded-full border border-[var(--ipk-border)]" style={{ fontSize: "12px" }}>Activer notifications</button>}
            <button onClick={sendPush} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--ipk-green-dark)] text-white" style={{ fontSize: "12px", fontWeight: 600 }}>
              <Megaphone className="w-3.5 h-3.5" /> Diffuser
            </button>
          </div>
        </div>
      </DataCard>

      {/* === Exports CSV === */}
      <DataCard>
        <h3 className="mb-3 inline-flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 700 }}>
          <Download className="w-4 h-4" /> Exports CSV
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <ExportBtn label="Promotions" count={promotions.length} onClick={() => downloadCSV("ipk-promotions.csv", promotions.map(p => ({ id: p.id, title: p.title, code: p.code, kind: p.kind, value: p.value, segment: p.segment, validUntil: p.validUntil, disabled: p.disabled || false })))} />
          <ExportBtn label="Ventes flash" count={flashDeals.length} onClick={() => downloadCSV("ipk-flash.csv", flashDeals.map(f => ({ id: f.id, productName: f.productName, basePrice: f.basePrice, flashPrice: f.flashPrice, stockLeft: f.stockLeft, totalStock: f.totalStock, endsAt: f.endsAt, disabled: f.disabled || false })))} />
          <ExportBtn label="Concours" count={contests.length} onClick={() => downloadCSV("ipk-concours.csv", contests.map(c => ({ id: c.id, title: c.title, kind: c.kind, ranking: c.ranking, endsAt: c.endsAt, participants: c.participants, closed: c.closed || false })))} />
          <ExportBtn label="Participations concours" count={contestEntries.length} onClick={() => downloadCSV("ipk-concours-entries.csv", contestEntries.map(e => ({ id: e.id, contestId: e.contestId, name: e.name, email: e.email, phone: e.phone || "", submission: e.submission || "", createdAt: e.createdAt })))} />
          <ExportBtn label="Cartes cadeaux" count={giftCards.length} onClick={() => downloadCSV("ipk-giftcards.csv", giftCards.map(g => ({ code: g.code, initialAmount: g.initialAmount, remainingAmount: g.remainingAmount, recipientName: g.recipientName || "", recipientEmail: g.recipientEmail || "", delivery: g.delivery, status: g.status || "active", issuedBy: g.issuedBy || "customer", createdAt: g.createdAt, expiresAt: g.expiresAt || "" })))} />
          <ExportBtn label="Tickets" count={tickets.length} onClick={() => downloadCSV("ipk-tickets.csv", tickets.map(t => ({ id: t.id, code: t.code, label: t.label, pct: t.pct || "", amount: t.amount || "", status: t.status, assignedEmail: t.assignedEmail || "", earnedAt: t.earnedAt, expiresAt: t.expiresAt, issuedBy: t.issuedBy || "system" })))} />
          <ExportBtn label="Comptes fidélité" count={loyaltyUsers.length} onClick={() => downloadCSV("ipk-loyalty.csv", loyaltyUsers.map(u => ({ email: u.email, points: u.points, transactions: u.history.length, lastActivity: u.history[0]?.at || "" })))} />
          <ExportBtn label="Jours de marché" count={marketDays.length} onClick={() => downloadCSV("ipk-jours-marche.csv", marketDays.map(d => ({ id: d.id, weekday: d.weekday, date: d.date, theme: d.theme, highlight: d.highlight })))} />
          <ExportBtn label="Spins de la roue" count={wheelStats.length} onClick={() => downloadCSV("ipk-wheel-stats.csv", wheelStats.map(s => ({ prizeId: s.prizeId, prizeLabel: wheelPrizes.find(p => p.id === s.prizeId)?.label || "", at: s.at, day: s.day })))} />
        </div>
      </DataCard>

      {/* === Analytics === */}
      <DataCard>
        <h3 className="mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 700 }}>Analytics marketing</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <Kpi label="Actions journal" value={fmt(analytics.totalActions)} />
          <Kpi label="Promos actives" value={promotions.filter(p => !p.disabled).length} tone="success" />
          <Kpi label="Tickets actifs" value={tickets.filter(t => t.status === "active").length} />
          <Kpi label="Cartes en circulation" value={giftCards.filter(c => (c.status ?? "active") === "active").length} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-[var(--ipk-text-muted)] mb-2" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Top actions (30 derniers jours)</div>
            <div className="space-y-1.5">
              {analytics.topActions.length === 0 && <EmptyRow message="Aucune donnée." />}
              {analytics.topActions.map(([action, count]) => {
                const max = analytics.topActions[0][1];
                return (
                  <div key={action}>
                    <div className="flex items-center justify-between" style={{ fontSize: "12px" }}>
                      <span className="font-mono truncate min-w-0">{action}</span>
                      <strong className="ml-2">{count}</strong>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--ipk-border)]/40 overflow-hidden mt-0.5">
                      <div className="h-full bg-[var(--ipk-green-dark)]" style={{ width: `${(count / max) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <div className="text-[var(--ipk-text-muted)] mb-2" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Activité par jour</div>
            <div className="space-y-1.5">
              {analytics.last7.length === 0 && <EmptyRow message="Aucune donnée." />}
              {analytics.last7.map(([day, count]) => {
                const max = Math.max(...analytics.last7.map(([, c]) => c));
                return (
                  <div key={day}>
                    <div className="flex items-center justify-between" style={{ fontSize: "12px" }}>
                      <span>{day}</span>
                      <strong>{count}</strong>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--ipk-border)]/40 overflow-hidden mt-0.5">
                      <div className="h-full bg-amber-600" style={{ width: `${(count / max) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DataCard>

      {/* === Journal filtré === */}
      <DataCard>
        <div className="flex items-center justify-between mb-3">
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 700 }}>Journal marketing</h3>
          <button onClick={() => downloadCSV("ipk-audit-marketing.csv", marketingActions.map(a => ({ date: a.date, actor: a.actor, action: a.action, entityId: a.entityId || "", details: a.details || "" })))} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--ipk-border)]" style={{ fontSize: "12px" }}>
            <Download className="w-3.5 h-3.5" /> Exporter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ fontSize: "12px" }}>
            <thead className="bg-[var(--ipk-surface)] text-left text-[var(--ipk-text-muted)]">
              <tr>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Acteur</th>
                <th className="px-3 py-2">Action</th>
                <th className="px-3 py-2">Cible</th>
                <th className="px-3 py-2">Détails</th>
              </tr>
            </thead>
            <tbody>
              {marketingActions.slice(0, 50).map(a => (
                <tr key={a.id} className="border-t border-[var(--ipk-border)]">
                  <td className="px-3 py-2 whitespace-nowrap">{new Date(a.date).toLocaleString("fr-FR")}</td>
                  <td className="px-3 py-2"><code>{a.actor}</code></td>
                  <td className="px-3 py-2 font-mono">{a.action}</td>
                  <td className="px-3 py-2"><code className="text-[var(--ipk-text-muted)]">{a.entityId || "—"}</code></td>
                  <td className="px-3 py-2 truncate max-w-[300px]">{a.details || "—"}</td>
                </tr>
              ))}
              {marketingActions.length === 0 && <tr><td colSpan={5}><EmptyRow message="Aucune action marketing journalisée." /></td></tr>}
            </tbody>
          </table>
        </div>
        {marketingActions.length > 50 && <div className="text-[var(--ipk-text-muted)] text-center pt-2" style={{ fontSize: "11px" }}>… et {marketingActions.length - 50} entrées de plus (export pour la liste complète)</div>}
      </DataCard>
    </div>
  );
}

function ExportBtn({ label, count, onClick }: { label: string; count: number; onClick: () => void }) {
  return (
    <button onClick={onClick} className="p-3 rounded-xl bg-[var(--ipk-surface)] hover:bg-white border border-[var(--ipk-border)] text-left transition-colors">
      <div className="flex items-center justify-between gap-2">
        <span style={{ fontSize: "13px", fontWeight: 600 }}>{label}</span>
        <Download className="w-3.5 h-3.5 text-[var(--ipk-text-muted)]" />
      </div>
      <div className="text-[var(--ipk-text-muted)] mt-1" style={{ fontSize: "11px" }}>{count} ligne{count > 1 ? "s" : ""}</div>
    </button>
  );
}

// ============= JOURNAL D'AUDIT MARKETING =============

const MARKETING_PREFIXES = ["promotion_", "flash_", "contest_", "badge_", "giftcard_", "ticket_", "loyalty_", "marketday_", "wheel_", "marketing_"];

type EntityFilter = "all" | "promotion" | "flash" | "contest" | "badge" | "giftcard" | "ticket" | "loyalty" | "marketday" | "wheel" | "broadcast";

const ENTITY_LABEL: Record<EntityFilter, string> = {
  all: "Toutes",
  promotion: "Promotions",
  flash: "Ventes flash",
  contest: "Concours",
  badge: "Badges",
  giftcard: "Cartes cadeaux",
  ticket: "Tickets",
  loyalty: "Fidélité",
  marketday: "Jour de marché",
  wheel: "Roue",
  broadcast: "Push",
};

const ACTION_LABEL: Record<string, { label: string; tone: "success" | "warn" | "danger" | "info" | "neutral" }> = {
  promotion_created: { label: "Promotion créée", tone: "success" },
  promotion_updated: { label: "Promotion mise à jour", tone: "info" },
  promotion_deleted: { label: "Promotion supprimée", tone: "danger" },
  promotion_toggled: { label: "Promotion activée/désactivée", tone: "warn" },
  flash_created: { label: "Vente flash créée", tone: "success" },
  flash_updated: { label: "Vente flash mise à jour", tone: "info" },
  flash_deleted: { label: "Vente flash supprimée", tone: "danger" },
  flash_ended: { label: "Vente flash arrêtée", tone: "warn" },
  flash_extended: { label: "Vente flash prolongée", tone: "info" },
  flash_broadcast: { label: "Vente flash diffusée", tone: "info" },
  contest_created: { label: "Concours créé", tone: "success" },
  contest_updated: { label: "Concours mis à jour", tone: "info" },
  contest_deleted: { label: "Concours supprimé", tone: "danger" },
  contest_closed: { label: "Concours clôturé", tone: "warn" },
  contest_reopened: { label: "Concours rouvert", tone: "info" },
  contest_drawn: { label: "Tirage au sort", tone: "success" },
  contest_entry: { label: "Participation", tone: "neutral" },
  contest_entry_deleted: { label: "Participation supprimée", tone: "danger" },
  contest_vote: { label: "Vote", tone: "neutral" },
  badge_awarded: { label: "Badge attribué", tone: "success" },
  badge_earned: { label: "Badge gagné", tone: "success" },
  giftcard_created: { label: "Carte créée (client)", tone: "info" },
  giftcard_issued: { label: "Carte émise (admin)", tone: "success" },
  giftcard_topup: { label: "Carte rechargée", tone: "info" },
  giftcard_cancelled: { label: "Carte annulée", tone: "warn" },
  giftcard_toggle_block: { label: "Carte bloquée/débloquée", tone: "warn" },
  giftcard_deleted: { label: "Carte supprimée", tone: "danger" },
  giftcard_email_sent: { label: "Email carte envoyé", tone: "neutral" },
  ticket_awarded: { label: "Ticket émis", tone: "success" },
  ticket_extended: { label: "Ticket prolongé", tone: "info" },
  ticket_cancelled: { label: "Ticket annulé", tone: "warn" },
  ticket_deleted: { label: "Ticket supprimé", tone: "danger" },
  ticket_template_created: { label: "Modèle ticket créé", tone: "success" },
  ticket_template_updated: { label: "Modèle ticket mis à jour", tone: "info" },
  ticket_template_deleted: { label: "Modèle ticket supprimé", tone: "danger" },
  loyalty_earned: { label: "Points gagnés", tone: "success" },
  loyalty_redeemed: { label: "Points convertis", tone: "warn" },
  loyalty_user_credited: { label: "Client crédité", tone: "success" },
  loyalty_user_debited: { label: "Client débité", tone: "warn" },
  loyalty_user_reset: { label: "Solde réinitialisé", tone: "danger" },
  loyalty_config_updated: { label: "Config fidélité modifiée", tone: "info" },
  marketday_created: { label: "Journée créée", tone: "success" },
  marketday_updated: { label: "Journée mise à jour", tone: "info" },
  marketday_deleted: { label: "Journée supprimée", tone: "danger" },
  wheel_prize_created: { label: "Lot roue créé", tone: "success" },
  wheel_prize_updated: { label: "Lot roue mis à jour", tone: "info" },
  wheel_prize_deleted: { label: "Lot roue supprimé", tone: "danger" },
  wheel_config_updated: { label: "Config roue modifiée", tone: "info" },
  wheel_stats_reset: { label: "Stats roue réinitialisées", tone: "warn" },
  marketing_broadcast: { label: "Push diffusé", tone: "info" },
};

function entityFromAction(action: string): EntityFilter {
  if (action.startsWith("promotion_")) return "promotion";
  if (action.startsWith("flash_")) return "flash";
  if (action.startsWith("contest_") || action === "badge_awarded" || action === "badge_earned") return action.startsWith("badge") ? "badge" : "contest";
  if (action.startsWith("giftcard_")) return "giftcard";
  if (action.startsWith("ticket_")) return "ticket";
  if (action.startsWith("loyalty_")) return "loyalty";
  if (action.startsWith("marketday_")) return "marketday";
  if (action.startsWith("wheel_")) return "wheel";
  if (action.startsWith("marketing_")) return "broadcast";
  return "all";
}

function JournalTab() {
  const { entries } = useAuditLog();
  const [search, setSearch] = useState("");
  const [entity, setEntity] = useState<EntityFilter>("all");
  const [actor, setActor] = useState<"all" | "admin" | "system" | "user">("all");
  const [days, setDays] = useState<7 | 30 | 90 | 0>(30);

  const marketing = useMemo(() => entries.filter(e => MARKETING_PREFIXES.some(p => e.action.startsWith(p))), [entries]);

  const filtered = useMemo(() => {
    const cutoff = days === 0 ? 0 : Date.now() - days * 24 * 60 * 60 * 1000;
    return marketing.filter(e => {
      if (cutoff && new Date(e.date).getTime() < cutoff) return false;
      if (entity !== "all" && entityFromAction(e.action) !== entity) return false;
      if (actor === "admin" && e.actor !== "admin") return false;
      if (actor === "system" && e.actor !== "system") return false;
      if (actor === "user" && (e.actor === "admin" || e.actor === "system")) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!e.action.toLowerCase().includes(q) && !(e.details || "").toLowerCase().includes(q) && !(e.entityId || "").toLowerCase().includes(q) && !e.actor.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [marketing, entity, actor, days, search]);

  const counts = useMemo(() => {
    const m = new Map<EntityFilter, number>();
    marketing.forEach(e => { const k = entityFromAction(e.action); m.set(k, (m.get(k) || 0) + 1); });
    return m;
  }, [marketing]);

  const exportCsv = () => {
    const header = ["date", "actor", "action", "entity", "entityId", "details"];
    const rows = filtered.map(e => [e.date, e.actor, e.action, entityFromAction(e.action), e.entityId || "", (e.details || "").replace(/"/g, '""')]);
    const csv = [header, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `audit-marketing-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success(`${filtered.length} entrées exportées`);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi label="Événements marketing" value={fmt(marketing.length)} hint={`${filtered.length} filtré${filtered.length > 1 ? "s" : ""}`} />
        <Kpi label="Promotions" value={counts.get("promotion") || 0} />
        <Kpi label="Concours + badges" value={(counts.get("contest") || 0) + (counts.get("badge") || 0)} />
        <Kpi label="Cartes + tickets" value={(counts.get("giftcard") || 0) + (counts.get("ticket") || 0)} />
      </div>

      <DataCard>
        <div className="mb-3 flex flex-wrap items-center gap-2 justify-between">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="min-w-[200px] flex-1"><SearchInput value={search} onChange={setSearch} placeholder="Action, ID, détail, acteur…" /></div>
            <select value={entity} onChange={e => setEntity(e.target.value as EntityFilter)} className="px-3 py-1.5 border border-[var(--ipk-border)] rounded-full bg-white" style={{ fontSize: "12px" }}>
              {(Object.keys(ENTITY_LABEL) as EntityFilter[]).map(k => (
                <option key={k} value={k}>{ENTITY_LABEL[k]}{k !== "all" ? ` (${counts.get(k) || 0})` : ""}</option>
              ))}
            </select>
            <select value={actor} onChange={e => setActor(e.target.value as typeof actor)} className="px-3 py-1.5 border border-[var(--ipk-border)] rounded-full bg-white" style={{ fontSize: "12px" }}>
              <option value="all">Tous acteurs</option>
              <option value="admin">Admin</option>
              <option value="system">Système</option>
              <option value="user">Clients</option>
            </select>
            <select value={days} onChange={e => setDays(Number(e.target.value) as 7 | 30 | 90 | 0)} className="px-3 py-1.5 border border-[var(--ipk-border)] rounded-full bg-white" style={{ fontSize: "12px" }}>
              <option value={7}>7 jours</option>
              <option value={30}>30 jours</option>
              <option value={90}>90 jours</option>
              <option value={0}>Tout</option>
            </select>
          </div>
          <button onClick={exportCsv} disabled={filtered.length === 0} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--ipk-green-dark)] text-white disabled:opacity-50" style={{ fontSize: "12px", fontWeight: 600 }}>
            <Megaphone className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" style={{ fontSize: "13px" }}>
            <thead className="bg-[var(--ipk-surface)] text-left text-[var(--ipk-text-muted)]">
              <tr>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Acteur</th>
                <th className="px-3 py-2">Action</th>
                <th className="px-3 py-2">Catégorie</th>
                <th className="px-3 py-2">Cible / détail</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 200).map(e => {
                const meta = ACTION_LABEL[e.action] || { label: e.action, tone: "neutral" as const };
                const cat = entityFromAction(e.action);
                return (
                  <tr key={e.id} className="border-t border-[var(--ipk-border)] align-top">
                    <td className="px-3 py-2 whitespace-nowrap text-[var(--ipk-text-muted)]" style={{ fontSize: "11px" }}>
                      {new Date(e.date).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className="font-mono" style={{ fontSize: "11px" }}>{e.actor}</span>
                    </td>
                    <td className="px-3 py-2"><StatusPill status={meta.label} tone={meta.tone} /></td>
                    <td className="px-3 py-2 text-[var(--ipk-text-muted)]" style={{ fontSize: "11px" }}>{ENTITY_LABEL[cat]}</td>
                    <td className="px-3 py-2">
                      {e.entityId && <code className="text-[var(--ipk-text-muted)] mr-2" style={{ fontSize: "11px" }}>{e.entityId}</code>}
                      {e.details && <span style={{ fontSize: "12px" }}>{e.details}</span>}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={5}><EmptyRow message="Aucune entrée correspondante." /></td></tr>}
            </tbody>
          </table>
          {filtered.length > 200 && (
            <div className="text-center text-[var(--ipk-text-muted)] py-3" style={{ fontSize: "11px" }}>… {filtered.length - 200} entrées de plus (affinez les filtres ou exportez en CSV)</div>
          )}
        </div>
      </DataCard>
    </div>
  );
}
