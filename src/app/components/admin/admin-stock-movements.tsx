import { useMemo, useState } from "react";
import { Download, Trash2, ArrowDown, ArrowUp } from "lucide-react";
import { toast } from "sonner";
import { useStockMovements, REASON_LABEL, type MovementReason } from "../../hooks/use-stock-movements";
import { useConfirm } from "../../hooks/use-confirm";
import { useAdmin } from "../../hooks/use-admin";
import { logAudit } from "../../hooks/use-admin-audit";
import { useSeo } from "../../hooks/use-seo";
import { PageHeader, DataCard, SearchInput, StatusPill, EmptyRow, usePagination, Pagination } from "./admin-shared";
import { Button } from "../ui/button";
import { exportCSV } from "../../utils/export-utils";

const REASON_TONE: Record<MovementReason, "success" | "warn" | "danger" | "info" | "neutral"> = {
  reception: "success",
  sale: "info",
  loss: "danger",
  breakage: "danger",
  inventory: "neutral",
  return: "warn",
  other: "neutral",
};

export function AdminStockMovementsPage() {
  useSeo({ title: "Admin - Mouvements de stock", noIndex: true });
  const { session } = useAdmin();
  const actor = session?.username || "system";
  const confirm = useConfirm();
  const { movements, clear } = useStockMovements();

  const [search, setSearch] = useState("");
  const [reasonFilter, setReasonFilter] = useState<"all" | MovementReason>("all");
  const [direction, setDirection] = useState<"all" | "in" | "out">("all");
  const [days, setDays] = useState<number>(30);

  const filtered = useMemo(() => {
    const cutoff = days === 0 ? 0 : Date.now() - days * 86_400_000;
    return movements.filter(m => {
      if (cutoff && new Date(m.date).getTime() < cutoff) return false;
      if (reasonFilter !== "all" && m.reason !== reasonFilter) return false;
      if (direction === "in" && m.qty <= 0) return false;
      if (direction === "out" && m.qty >= 0) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!m.productName.toLowerCase().includes(q) && !(m.note || "").toLowerCase().includes(q) && !m.actor.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [movements, search, reasonFilter, direction, days]);

  const { page, pageCount, total, slice, setPage } = usePagination(filtered, 25);

  const kpis = useMemo(() => {
    const inQty = filtered.filter(m => m.qty > 0).reduce((s, m) => s + m.qty, 0);
    const outQty = filtered.filter(m => m.qty < 0).reduce((s, m) => s + Math.abs(m.qty), 0);
    return { count: filtered.length, in: inQty, out: outQty, net: inQty - outQty };
  }, [filtered]);

  const handleExport = () => {
    exportCSV(`mouvements-stock-${new Date().toISOString().slice(0, 10)}.csv`, filtered.map(m => ({
      date: new Date(m.date).toISOString(),
      produit: m.productName,
      quantite: m.qty,
      motif: REASON_LABEL[m.reason],
      note: m.note || "",
      acteur: m.actor,
      stock_apres: m.balanceAfter,
    })));
    toast.success(`${filtered.length} ligne(s) exportée(s)`);
  };

  const handleClear = async () => {
    const ok = await confirm({ title: "Vider le journal ?", message: `${movements.length} mouvement(s) seront supprimés. Cette action est irréversible.`, confirmLabel: "Vider", tone: "danger" });
    if (!ok) return;
    clear();
    logAudit({ actor, action: "stock_journal_cleared", entity: "product", details: `${movements.length} mouvements purgés` });
    toast.success("Journal vidé");
  };

  return (
    <div>
      <PageHeader
        title="Mouvements de stock"
        subtitle={`${movements.length} mouvement(s) au total`}
        action={
          <div className="flex gap-2">
            <Button onClick={handleExport} disabled={filtered.length === 0} variant="outline" className="rounded-xl h-10 disabled:opacity-50"><Download className="w-4 h-4 mr-1" /> CSV</Button>
            <Button onClick={handleClear} disabled={movements.length === 0} variant="outline" className="rounded-xl h-10 text-red-600 disabled:opacity-50"><Trash2 className="w-4 h-4 mr-1" /> Vider</Button>
          </div>
        }
      />

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <KpiCard label="Mouvements" value={kpis.count} />
        <KpiCard label="Entrées" value={`+${kpis.in}`} accent="var(--ipk-green-dark)" />
        <KpiCard label="Sorties" value={`-${kpis.out}`} accent="#DC2626" />
        <KpiCard label="Net" value={`${kpis.net >= 0 ? "+" : ""}${kpis.net}`} accent={kpis.net >= 0 ? "var(--ipk-green-dark)" : "#DC2626"} />
      </section>

      <DataCard className="mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <SearchInput value={search} onChange={setSearch} placeholder="Produit, note, acteur…" />
          <select value={reasonFilter} onChange={e => setReasonFilter(e.target.value as any)} className="border border-[var(--ipk-border)] rounded-xl px-3 py-2 bg-white" style={{ fontSize: "13px" }}>
            <option value="all">Tous motifs</option>
            {(Object.keys(REASON_LABEL) as MovementReason[]).map(r => <option key={r} value={r}>{REASON_LABEL[r]}</option>)}
          </select>
          <div className="inline-flex rounded-xl border border-[var(--ipk-border)] overflow-hidden">
            {(["all", "in", "out"] as const).map(d => (
              <button key={d} onClick={() => setDirection(d)} className={`px-3 py-2 ${direction === d ? "bg-[var(--ipk-green-dark)] text-white" : "bg-white text-[var(--ipk-text)]"}`} style={{ fontSize: "12px", fontWeight: 500 }}>
                {d === "all" ? "Tous" : d === "in" ? "Entrées" : "Sorties"}
              </button>
            ))}
          </div>
          <select value={days} onChange={e => setDays(Number(e.target.value))} className="border border-[var(--ipk-border)] rounded-xl px-3 py-2 bg-white" style={{ fontSize: "13px" }}>
            <option value={7}>7 jours</option>
            <option value={30}>30 jours</option>
            <option value={90}>90 jours</option>
            <option value={0}>Tout</option>
          </select>
        </div>
      </DataCard>

      <DataCard>
        {slice.length === 0 ? <EmptyRow message="Aucun mouvement ne correspond aux filtres." /> : (
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full" style={{ fontSize: "13px" }}>
              <thead className="text-[var(--ipk-text)] border-b border-[var(--ipk-border)]">
                <tr>
                  <th className="text-left py-2 font-medium">Date</th>
                  <th className="text-left py-2 font-medium">Produit</th>
                  <th className="text-right py-2 font-medium">Quantité</th>
                  <th className="text-left py-2 font-medium">Motif</th>
                  <th className="text-left py-2 font-medium">Note</th>
                  <th className="text-left py-2 font-medium">Acteur</th>
                  <th className="text-right py-2 font-medium">Stock après</th>
                </tr>
              </thead>
              <tbody>
                {slice.map(m => (
                  <tr key={m.id} className="border-b border-[var(--ipk-border)] last:border-0">
                    <td className="py-3 pr-2 text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>{new Date(m.date).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}</td>
                    <td className="py-3 pr-2 font-medium text-[var(--ipk-ink)] truncate max-w-[180px]">{m.productName}</td>
                    <td className="py-3 pr-2 text-right">
                      <span className={`inline-flex items-center gap-1 ${m.qty > 0 ? "text-[var(--ipk-green-dark)]" : "text-red-600"}`} style={{ fontWeight: 600 }}>
                        {m.qty > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        {m.qty > 0 ? `+${m.qty}` : m.qty}
                      </span>
                    </td>
                    <td className="py-3 pr-2"><StatusPill status={REASON_LABEL[m.reason]} tone={REASON_TONE[m.reason]} /></td>
                    <td className="py-3 pr-2 text-[var(--ipk-text)] truncate max-w-[200px]" style={{ fontSize: "12px" }}>{m.note || "-"}</td>
                    <td className="py-3 pr-2 text-[var(--ipk-text)]" style={{ fontSize: "12px", fontFamily: "monospace" }}>{m.actor}</td>
                    <td className="py-3 text-right" style={{ fontWeight: 600 }}>{m.balanceAfter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} pageCount={pageCount} total={total} pageSize={25} onChange={setPage} />
      </DataCard>
    </div>
  );
}

function KpiCard({ label, value, accent = "var(--ipk-ink)" }: { label: string; value: string | number; accent?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--ipk-border)] p-4">
      <div className="text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>{label}</div>
      <div className="mt-1" style={{ fontSize: "20px", fontWeight: 700, color: accent }}>{value}</div>
    </div>
  );
}
