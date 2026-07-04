import { Link } from "react-router";
import {
  Package, ShoppingCart, Users, Building2, GraduationCap, Calendar,
  Star, TrendingUp, ArrowRight, Layers, FileText, AlertTriangle
} from "lucide-react";
import {
  products, artisans, groupements, formations, events, blogArticles,
  groupBuyingOffers, formatPrice, categories
} from "../../data/mock-data";
import { useSeo } from "../../hooks/use-seo";
import { useAuditLog } from "../../hooks/use-admin-audit";
import { useLocalState } from "../../hooks/use-admin-data";
import { DEFAULT_LOW_STOCK, effectiveStock, type Variant } from "./admin-products";
import { useMemo } from "react";

interface ProductOverride {
  price?: number; stock?: number; status?: "active" | "draft" | "archived";
  lowStockThreshold?: number; variants?: Variant[];
}

const ENTITY_LABELS: Record<string, string> = {
  product: "Produits", artisan: "Artisans", groupement: "Groupements",
  formation: "Formations", event: "Événements", blog: "Articles",
  groupbuy: "Achats groupés", review: "Avis", order: "Commandes",
  message: "Messages", session: "Sessions", promo: "Promos", settings: "Paramètres",
};

export function AdminDashboardPage() {
  useSeo({ title: "Admin - Tableau de bord", noIndex: true });
  const { entries } = useAuditLog();

  const { dailyActivity, entityBreakdown, totalActions } = useMemo(() => {
    const now = Date.now();
    const days: { day: string; actions: number; ts: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now - i * 86_400_000);
      days.push({
        day: d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }),
        actions: 0,
        ts: new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(),
      });
    }
    const buckets: Record<string, number> = {};
    let total = 0;
    entries.forEach(e => {
      const t = new Date(e.at).getTime();
      const cutoff = now - 30 * 86_400_000;
      if (t < cutoff) return;
      total++;
      const dayKey = new Date(new Date(e.at).getFullYear(), new Date(e.at).getMonth(), new Date(e.at).getDate()).getTime();
      const bucket = days.find(d => d.ts === dayKey);
      if (bucket) bucket.actions++;
      buckets[e.entity] = (buckets[e.entity] || 0) + 1;
    });
    const breakdown = Object.entries(buckets)
      .map(([k, v]) => ({ name: ENTITY_LABELS[k] || k, value: v }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
    return { dailyActivity: days, entityBreakdown: breakdown, totalActions: total };
  }, [entries]);

  const [overrides] = useLocalState<Record<string, ProductOverride>>("ipk:admin:productOverrides:v1", {});
  const [createdProducts] = useLocalState<typeof products>("ipk:admin:newProducts:v1", []);
  const [removedIds] = useLocalState<string[]>("ipk:admin:productRemoved:v1", []);

  const inventoryAlerts = useMemo(() => {
    const all = [...createdProducts, ...products].filter(p => !removedIds.includes(p.id));
    return all.map(p => {
      const o = overrides[p.id] || {};
      const stock = effectiveStock({ stock: o.stock ?? p.stock }, o.variants);
      const threshold = o.lowStockThreshold ?? DEFAULT_LOW_STOCK;
      return { id: p.id, name: p.name, slug: p.slug, stock, threshold, variants: o.variants?.length || 0 };
    }).filter(p => p.stock <= p.threshold).sort((a, b) => a.stock - b.stock);
  }, [overrides, createdProducts, removedIds]);

  const outOfStock = inventoryAlerts.filter(a => a.stock === 0).length;
  const lowStock = inventoryAlerts.length - outOfStock;

  const totalRevenue = products.reduce((s, p) => s + p.price * Math.max(1, 5 - (p.stock % 5)), 0);
  const totalOrders = products.length * 3;
  const avgConformity = Math.round(groupements.reduce((s, g) => s + g.conformity, 0) / groupements.length);

  const kpis = [
    { label: "Chiffre d'affaires", value: formatPrice(totalRevenue), icon: TrendingUp, accent: "var(--ipk-green-dark)" },
    { label: "Commandes (mock)", value: totalOrders, icon: ShoppingCart, accent: "var(--ipk-blue)" },
    { label: "Produits", value: products.length, icon: Package, accent: "var(--ipk-green-dark)" },
    { label: "Artisans", value: artisans.length, icon: Users, accent: "var(--ipk-blue)" },
  ];

  const modules = [
    { to: "/admin/produits", label: "Produits", count: products.length, icon: Package },
    { to: "/admin/artisans", label: "Artisans", count: artisans.length, icon: Users },
    { to: "/admin/groupements", label: "Groupements", count: groupements.length, icon: Building2 },
    { to: "/admin/formations", label: "Formations", count: formations.length, icon: GraduationCap },
    { to: "/admin/evenements", label: "Événements", count: events.length, icon: Calendar },
    { to: "/admin/blog", label: "Articles blog", count: blogArticles.length, icon: FileText },
    { to: "/admin/achats-groupes", label: "Achats groupés", count: groupBuyingOffers.length, icon: Layers },
  ];

  const salesData = [
    { month: "Jan", ventes: 1240000 },
    { month: "Fév", ventes: 1580000 },
    { month: "Mar", ventes: 1820000 },
    { month: "Avr", ventes: 2100000 },
    { month: "Mai", ventes: 2450000 },
    { month: "Juin", ventes: 2780000 },
  ];

  const COLORS = ["#0B6B3A", "#0057FF", "#E5A600", "#7C3AED", "#DC2626", "#16A34A"];
  const catData = categories.slice(0, 6).map(c => ({
    name: c.name,
    value: products.filter(p => p.category === c.name).length,
  })).filter(d => d.value > 0);

  return (
    <div>
      <header className="mb-6">
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 600, color: "var(--ipk-ink)" }}>
          Tableau de bord
        </h1>
        <p className="text-[var(--ipk-text)] mt-1" style={{ fontSize: "14px" }}>Vue d'ensemble de votre boutique IPPOO KRAAFT</p>
      </header>

      {/* KPIs */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {kpis.map((k, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[var(--ipk-border)] p-4">
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <div className="text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>{k.label}</div>
                <div className="mt-1 truncate" style={{ fontSize: "18px", fontWeight: 700, color: "var(--ipk-ink)" }}>{k.value}</div>
              </div>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${k.accent}15` }}>
                <k.icon className="w-4 h-4" style={{ color: k.accent }} />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Alerts inventaire */}
      {inventoryAlerts.length > 0 && (
        <section className={`mb-6 rounded-2xl border p-4 ${outOfStock > 0 ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-4 h-4 ${outOfStock > 0 ? "text-red-700" : "text-amber-700"}`} />
              <span className={outOfStock > 0 ? "text-red-800" : "text-amber-800"} style={{ fontSize: "13px", fontWeight: 600 }}>
                Alerte stock - {outOfStock > 0 ? `${outOfStock} rupture${outOfStock > 1 ? "s" : ""}` : ""}{outOfStock > 0 && lowStock > 0 ? " · " : ""}{lowStock > 0 ? `${lowStock} bas` : ""}
              </span>
            </div>
            <Link to="/admin/produits" className={`inline-flex items-center gap-1 ${outOfStock > 0 ? "text-red-700" : "text-amber-700"}`} style={{ fontSize: "12px", fontWeight: 600 }}>
              Gérer <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {inventoryAlerts.slice(0, 8).map(a => {
              const isOut = a.stock === 0;
              return (
                <li key={a.id} className="bg-white rounded-xl px-3 py-2 flex items-center justify-between gap-2">
                  <span className="truncate text-[var(--ipk-ink)]" style={{ fontSize: "12px", fontWeight: 500 }}>{a.name}</span>
                  <span className="flex items-center gap-2 shrink-0">
                    {a.variants > 0 && <span className="text-[var(--ipk-text)]" style={{ fontSize: "10px" }}>{a.variants} var.</span>}
                    <span className={`px-2 py-0.5 rounded-full ${isOut ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`} style={{ fontSize: "11px", fontWeight: 600 }}>
                      {isOut ? "Rupture" : `${a.stock}/${a.threshold}`}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
          {inventoryAlerts.length > 8 && (
            <div className={`mt-2 text-right ${outOfStock > 0 ? "text-red-700" : "text-amber-700"}`} style={{ fontSize: "11px" }}>
              +{inventoryAlerts.length - 8} autre{inventoryAlerts.length - 8 > 1 ? "s" : ""}
            </div>
          )}
        </section>
      )}

      {/* Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[var(--ipk-border)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--ipk-ink)" }}>Ventes mensuelles</h2>
            <span className="text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>6 derniers mois</span>
          </div>
          <SimpleBarChart
            data={salesData.map(d => ({ label: d.month, value: d.ventes }))}
            color="var(--ipk-green-dark)"
            height={240}
            formatValue={(v) => formatPrice(v)}
          />
        </div>

        <div className="bg-white rounded-2xl border border-[var(--ipk-border)] p-5">
          <h2 className="mb-4" style={{ fontSize: "16px", fontWeight: 600, color: "var(--ipk-ink)" }}>Catégories</h2>
          <SimpleDonut data={catData} colors={COLORS} height={240} />
        </div>
      </section>

      {/* Conformity + modules */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-[var(--ipk-border)] p-5">
          <h2 className="mb-3" style={{ fontSize: "16px", fontWeight: 600, color: "var(--ipk-ink)" }}>Conformité moyenne</h2>
          <div className="flex items-end gap-2">
            <span style={{ fontSize: "36px", fontWeight: 700, color: "var(--ipk-green-dark)" }}>{avgConformity}%</span>
            <span className="text-[var(--ipk-text)] mb-2" style={{ fontSize: "12px" }}>tous groupements</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-[var(--ipk-surface)] overflow-hidden">
            <div className="h-full bg-[var(--ipk-green-dark)] transition-all" style={{ width: `${avgConformity}%` }} />
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-[var(--ipk-border)] p-5">
          <h2 className="mb-3" style={{ fontSize: "16px", fontWeight: 600, color: "var(--ipk-ink)" }}>Accès rapides</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {modules.map(m => (
              <Link key={m.to} to={m.to} className="flex items-center gap-2 p-3 bg-[var(--ipk-surface)] rounded-xl hover:bg-[var(--ipk-border)] transition-colors">
                <m.icon className="w-4 h-4 text-[var(--ipk-green-dark)] shrink-0" />
                <div className="min-w-0">
                  <div className="truncate" style={{ fontSize: "12px", fontWeight: 600, color: "var(--ipk-ink)" }}>{m.label}</div>
                  <div className="text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>{m.count} entrées</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Activité 30 jours */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[var(--ipk-border)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--ipk-ink)" }}>Activité administrateur</h2>
            <span className="text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>{totalActions} actions / 30 j</span>
          </div>
          {totalActions === 0 ? (
            <div className="text-[var(--ipk-text)] py-8 text-center" style={{ fontSize: "13px" }}>Aucune activité enregistrée pour l'instant.</div>
          ) : (
            <SimpleBarChart
              data={dailyActivity.map(d => ({ label: d.day, value: d.actions }))}
              color="var(--ipk-blue)"
              height={200}
              labelInterval={5}
              formatValue={(v) => `${v} action${v > 1 ? "s" : ""}`}
            />
          )}
        </div>

        <div className="bg-white rounded-2xl border border-[var(--ipk-border)] p-5">
          <h2 className="mb-4" style={{ fontSize: "16px", fontWeight: 600, color: "var(--ipk-ink)" }}>Top entités modifiées</h2>
          {entityBreakdown.length === 0 ? (
            <div className="text-[var(--ipk-text)] py-8 text-center" style={{ fontSize: "13px" }}>-</div>
          ) : (
            <ul className="space-y-2">
              {entityBreakdown.map((e, i) => {
                const max = entityBreakdown[0].value;
                const pct = Math.round((e.value / max) * 100);
                return (
                  <li key={e.name}>
                    <div className="flex justify-between mb-1" style={{ fontSize: "12px" }}>
                      <span className="text-[var(--ipk-ink)]" style={{ fontWeight: 500 }}>{e.name}</span>
                      <span className="text-[var(--ipk-text)]">{e.value}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--ipk-surface)] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* Recent orders mock */}
      <section className="bg-white rounded-2xl border border-[var(--ipk-border)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--ipk-ink)" }}>Dernières commandes</h2>
          <Link to="/admin/commandes" className="text-[var(--ipk-blue)] inline-flex items-center gap-1" style={{ fontSize: "12px", fontWeight: 600 }}>
            Tout voir <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full" style={{ fontSize: "13px" }}>
            <thead className="text-[var(--ipk-text)] border-b border-[var(--ipk-border)]">
              <tr>
                <th className="text-left py-2 font-medium">Réf</th>
                <th className="text-left py-2 font-medium">Produit</th>
                <th className="text-left py-2 font-medium">Statut</th>
                <th className="text-right py-2 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 5).map((p, i) => {
                const statuses = ["Payée", "Expédiée", "Livrée", "En cours"];
                const status = statuses[i % statuses.length];
                const colors: Record<string, string> = {
                  "Payée": "bg-blue-100 text-blue-700",
                  "Expédiée": "bg-amber-100 text-amber-700",
                  "Livrée": "bg-green-100 text-green-700",
                  "En cours": "bg-gray-100 text-gray-700",
                };
                return (
                  <tr key={p.id} className="border-b border-[var(--ipk-border)] last:border-0">
                    <td className="py-3 font-mono text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>IPK-{1000 + i}</td>
                    <td className="py-3 truncate max-w-[160px] sm:max-w-none">{p.name}</td>
                    <td className="py-3"><span className={`px-2 py-0.5 rounded-full ${colors[status]}`} style={{ fontSize: "11px" }}>{status}</span></td>
                    <td className="py-3 text-right" style={{ fontWeight: 600 }}>{formatPrice(p.price)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function SimpleDonut({ data, colors, height }: { data: { name: string; value: number }[]; colors: string[]; height: number }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const size = Math.min(height, 180);
  const cx = size / 2, cy = size / 2, rOuter = size * 0.42, rInner = size * 0.24;
  let acc = 0;
  const segments = data.map((d, i) => {
    const start = total > 0 ? (acc / total) * Math.PI * 2 : 0;
    acc += d.value;
    const end = total > 0 ? (acc / total) * Math.PI * 2 : 0;
    const large = end - start > Math.PI ? 1 : 0;
    const x1 = cx + rOuter * Math.sin(start), y1 = cy - rOuter * Math.cos(start);
    const x2 = cx + rOuter * Math.sin(end), y2 = cy - rOuter * Math.cos(end);
    const x3 = cx + rInner * Math.sin(end), y3 = cy - rInner * Math.cos(end);
    const x4 = cx + rInner * Math.sin(start), y4 = cy - rInner * Math.cos(start);
    const path = total === 0 ? "" : `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 ${large} 0 ${x4} ${y4} Z`;
    return { path, color: colors[i % colors.length], name: d.name, value: d.value };
  });
  return (
    <div className="flex items-center gap-3" style={{ height }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        {segments.map((s, i) => (
          <path key={`${s.name}-${i}`} d={s.path} fill={s.color}>
            <title>{s.name}: {s.value}</title>
          </path>
        ))}
      </svg>
      <ul className="flex-1 min-w-0 space-y-1">
        {data.map((d, i) => (
          <li key={`${d.name}-${i}`} className="flex items-center gap-2 text-[var(--ipk-text)] truncate" style={{ fontSize: "11px" }}>
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
            <span className="truncate flex-1">{d.name}</span>
            <span style={{ fontWeight: 600 }}>{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SimpleBarChart({ data, color, height, formatValue, labelInterval = 1 }: {
  data: { label: string; value: number }[];
  color: string;
  height: number;
  formatValue?: (v: number) => string;
  labelInterval?: number;
}) {
  const max = Math.max(1, ...data.map(d => d.value));
  return (
    <div className="w-full" style={{ height }}>
      <div className="relative h-full flex items-end gap-1 pb-6 pt-2">
        {data.map((d, i) => {
          const pct = (d.value / max) * 100;
          const showLabel = i % labelInterval === 0;
          return (
            <div key={`${d.label}-${i}`} className="flex-1 h-full flex flex-col justify-end items-center group relative min-w-0">
              <div
                className="w-full rounded-t transition-all hover:opacity-80 cursor-default"
                style={{ height: `${pct}%`, backgroundColor: color, minHeight: d.value > 0 ? "2px" : "0" }}
                title={formatValue ? formatValue(d.value) : String(d.value)}
              />
              {showLabel && (
                <span className="absolute bottom-0 text-[var(--ipk-text)] truncate" style={{ fontSize: "10px" }}>{d.label}</span>
              )}
              <div className="absolute bottom-full mb-1 px-2 py-1 bg-[var(--ipk-ink)] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10" style={{ fontSize: "11px" }}>
                {formatValue ? formatValue(d.value) : d.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
