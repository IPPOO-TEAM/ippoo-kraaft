import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { products, formatPrice } from "../../data/mock-data";
import { useLocalState, ORDER_STATUS, type AdminOrder } from "../../hooks/use-admin-data";
import { logAudit } from "../../hooks/use-admin-audit";
import { useAdmin } from "../../hooks/use-admin";
import { useSeo } from "../../hooks/use-seo";
import { exportCSV } from "../../utils/export-utils";
import { Download } from "lucide-react";
import { Button } from "../ui/button";
import { PageHeader, DataCard, SearchInput, StatusPill, EmptyRow, SortHeader, useSortable, usePagination, Pagination } from "./admin-shared";
import { toast } from "sonner";

const FAKE_CUSTOMERS = [
  { name: "Aïssata Diallo", email: "aissata@example.com" },
  { name: "Kofi Mensah", email: "kofi@example.com" },
  { name: "Marie Dubois", email: "marie@example.com" },
  { name: "Ousmane Traoré", email: "ousmane@example.com" },
  { name: "Sophie Lambert", email: "sophie@example.com" },
];

function seedOrders(): AdminOrder[] {
  return products.slice(0, 12).map((p, i) => {
    const c = FAKE_CUSTOMERS[i % FAKE_CUSTOMERS.length];
    const qty = (i % 3) + 1;
    const statuses: AdminOrder["status"][] = ["pending", "paid", "shipped", "delivered", "delivered", "cancelled"];
    const dt = new Date();
    dt.setDate(dt.getDate() - i * 2);
    return {
      id: `IPK-${10000 + i}`,
      productId: p.id,
      customer: c.name,
      email: c.email,
      quantity: qty,
      total: p.price * qty,
      status: statuses[i % statuses.length],
      date: dt.toISOString(),
    };
  });
}

export function AdminOrdersPage() {
  useSeo({ title: "Admin — Commandes", noIndex: true });
  const [orders, setOrders] = useLocalState<AdminOrder[]>("ipk:admin:orders:v1", seedOrders());
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<AdminOrder["status"] | "all">("all");

  const filtered = useMemo(() => orders.filter(o => {
    if (filter !== "all" && o.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.email.toLowerCase().includes(q);
    }
    return true;
  }), [orders, search, filter]);

  type OrderSortKey = "id" | "customer" | "quantity" | "total" | "status" | "date";
  const { sorted, sort, onSort } = useSortable<typeof filtered[number], OrderSortKey>(filtered, (item, key) => item[key] as any, { key: "date", dir: "desc" });
  const { page, pageCount, total: pageTotal, slice, setPage } = usePagination(sorted, 20);

  const { session } = useAdmin();
  const setStatus = (id: string, status: AdminOrder["status"]) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    logAudit({ actor: session?.username || "system", action: "status_change", entity: "order", entityId: id, details: `→ ${ORDER_STATUS[status].label}` });
    toast.success(`Statut → ${ORDER_STATUS[status].label}`);
  };

  const totals = orders.reduce((acc, o) => {
    if (o.status !== "cancelled") acc.revenue += o.total;
    acc.count[o.status]++;
    return acc;
  }, { revenue: 0, count: { pending: 0, paid: 0, shipped: 0, delivered: 0, cancelled: 0 } as Record<AdminOrder["status"], number> });

  return (
    <div>
      <PageHeader title="Commandes" subtitle={`${orders.length} commandes — ${formatPrice(totals.revenue)} encaissé`} action={
        <Button onClick={() => exportCSV(`commandes-${new Date().toISOString().slice(0, 10)}.csv`, sorted.map(o => ({
          ref: o.id, client: o.customer, email: o.email, produit: products.find(p => p.id === o.productId)?.name || "", quantite: o.quantity, total: o.total, statut: ORDER_STATUS[o.status].label, date: o.date,
        })))} variant="outline" className="rounded-xl h-10">
          <Download className="w-4 h-4 mr-1" /> Export CSV
        </Button>
      } />

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
        {(["pending", "paid", "shipped", "delivered", "cancelled"] as const).map(s => (
          <DataCard key={s} className="!p-3 text-center">
            <div className="text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>{ORDER_STATUS[s].label}</div>
            <div className="mt-1" style={{ fontSize: "20px", fontWeight: 700, color: "var(--ipk-ink)" }}>{totals.count[s]}</div>
          </DataCard>
        ))}
      </div>

      <DataCard className="mb-4">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <SearchInput value={search} onChange={setSearch} placeholder="Réf, client, email…" />
          <div className="flex gap-1 flex-wrap">
            <button onClick={() => setFilter("all")} className={`px-3 py-1.5 rounded-full ${filter === "all" ? "bg-[var(--ipk-green-dark)] text-white" : "bg-[var(--ipk-surface)] text-[var(--ipk-text)]"}`} style={{ fontSize: "12px", fontWeight: 500 }}>Tous</button>
            {(Object.keys(ORDER_STATUS) as AdminOrder["status"][]).map(s => (
              <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-full ${filter === s ? "bg-[var(--ipk-green-dark)] text-white" : "bg-[var(--ipk-surface)] text-[var(--ipk-text)]"}`} style={{ fontSize: "12px", fontWeight: 500 }}>
                {ORDER_STATUS[s].label}
              </button>
            ))}
          </div>
        </div>
      </DataCard>

      <DataCard>
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full" style={{ fontSize: "13px" }}>
            <thead className="text-[var(--ipk-text)] border-b border-[var(--ipk-border)]">
              <tr>
                <th className="text-left py-2 font-medium"><SortHeader label="Réf" sortKey="id" state={sort} onSort={onSort} /></th>
                <th className="text-left py-2 font-medium"><SortHeader label="Client" sortKey="customer" state={sort} onSort={onSort} /></th>
                <th className="text-left py-2 font-medium hidden md:table-cell">Produit</th>
                <th className="text-right py-2 font-medium"><SortHeader label="Qté" sortKey="quantity" state={sort} onSort={onSort} align="right" /></th>
                <th className="text-right py-2 font-medium"><SortHeader label="Total" sortKey="total" state={sort} onSort={onSort} align="right" /></th>
                <th className="text-left py-2 font-medium"><SortHeader label="Statut" sortKey="status" state={sort} onSort={onSort} /></th>
                <th className="text-left py-2 font-medium hidden sm:table-cell"><SortHeader label="Date" sortKey="date" state={sort} onSort={onSort} /></th>
              </tr>
            </thead>
            <tbody>
              {slice.length === 0 ? (
                <tr><td colSpan={7}><EmptyRow message="Aucune commande." /></td></tr>
              ) : slice.map(o => {
                const product = products.find(p => p.id === o.productId);
                return (
                  <tr key={o.id} className="border-b border-[var(--ipk-border)] last:border-0">
                    <td className="py-3 pr-2 font-mono text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>{o.id}</td>
                    <td className="py-3 pr-2">
                      <div className="font-medium text-[var(--ipk-ink)] truncate max-w-[140px]">{o.customer}</div>
                      <div className="text-[var(--ipk-text)] truncate max-w-[140px]" style={{ fontSize: "11px" }}>{o.email}</div>
                    </td>
                    <td className="py-3 pr-2 hidden md:table-cell text-[var(--ipk-text)] truncate max-w-[160px]">{product?.name || "—"}</td>
                    <td className="py-3 pr-2 text-right">{o.quantity}</td>
                    <td className="py-3 pr-2 text-right" style={{ fontWeight: 600 }}>{formatPrice(o.total)}</td>
                    <td className="py-3 pr-2">
                      <select value={o.status} onChange={e => setStatus(o.id, e.target.value as AdminOrder["status"])} className="bg-[var(--ipk-surface)] border border-[var(--ipk-border)] rounded-lg px-2 py-1" style={{ fontSize: "11px" }} aria-label={`Statut commande ${o.id}`}>
                        {(Object.keys(ORDER_STATUS) as AdminOrder["status"][]).map(s => (
                          <option key={s} value={s}>{ORDER_STATUS[s].label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 pr-2 hidden sm:table-cell text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>{new Date(o.date).toLocaleDateString("fr-FR")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination page={page} pageCount={pageCount} total={pageTotal} pageSize={20} onChange={setPage} />
      </DataCard>
    </div>
  );
}
