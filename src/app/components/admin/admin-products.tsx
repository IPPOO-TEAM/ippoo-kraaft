import { useMemo, useState } from "react";
import { Edit3, Trash2, Save, X, Eye, Boxes, Plus, Image as ImageIcon, ArrowUp, ArrowDown, Star as StarIcon, Tag as TagIcon, ArrowDownUp, Network, FileEdit, Download, Upload } from "lucide-react";
import { exportCSV, parseCSV } from "../../utils/export-utils";
import { logStockMovement, REASON_LABEL, type MovementReason } from "../../hooks/use-stock-movements";
import { CRAFT_TAXONOMY, effectiveNiches, nicheLabel } from "../../data/craft-taxonomy";
import { MediaPickerButton } from "./media-picker";
import { Link } from "react-router";
import { products as seedProducts, formatPrice, type Product } from "../../data/mock-data";
import { useCategories } from "../../hooks/use-categories";
import { useLocalState } from "../../hooks/use-admin-data";
import { logAudit, previewProductCascade, cascadeProductDelete } from "../../hooks/use-admin-audit";
import { useAdmin } from "../../hooks/use-admin";
import { useSeo } from "../../hooks/use-seo";
import { PageHeader, AddButton, DataCard, SearchInput, StatusPill, EmptyRow, SortHeader, useSortable, usePagination, Pagination, useBulkSelection, BulkBar, SelectCheckbox, NumberInput } from "./admin-shared";
import { Button } from "../ui/button";
import { useConfirm } from "../../hooks/use-confirm";
import { toast } from "sonner";

export interface Variant {
  id: string;
  label: string;
  priceDelta: number;
  stock: number;
  sku?: string;
}

interface Override {
  price?: number;
  stock?: number;
  status?: "active" | "draft" | "archived";
  lowStockThreshold?: number;
  variants?: Variant[];
  images?: string[];
  badges?: string[];
  tags?: string[];
  niches?: string[];
  name?: string;
  slug?: string;
  category?: string;
  story?: string;
  ancestrality?: string;
  dimensions?: string;
  weight?: string;
  materials?: string[];
  care?: string;
  origin?: { country: string; region: string; village: string };
  delivery?: { zones: string; delay: string; cost: string };
  norms?: { code: string; name: string; status: "Validé" | "En cours" | "Non applicable" }[];
  isUnique?: boolean;
  isExclusive?: boolean;
  seo?: { title?: string; description?: string; ogImage?: string; keywords?: string };
  promo?: { percent: number; startsAt?: string; endsAt?: string };
}

export function isPromoActive(promo?: { percent: number; startsAt?: string; endsAt?: string }, now: Date = new Date()): boolean {
  if (!promo || !promo.percent || promo.percent <= 0) return false;
  const t = now.getTime();
  if (promo.startsAt && new Date(promo.startsAt).getTime() > t) return false;
  if (promo.endsAt && new Date(promo.endsAt).getTime() < t) return false;
  return true;
}

export function applyPromo(price: number, promo?: { percent: number; startsAt?: string; endsAt?: string }): number {
  if (!isPromoActive(promo)) return price;
  return Math.round(price * (1 - (promo!.percent / 100)));
}

export const SUGGESTED_BADGES = ["Nouveau", "Exclusif", "Promo", "Dernière pièce", "Coup de coeur", "Tendance", "Fait main", "Édition limitée"];

export const DEFAULT_LOW_STOCK = 3;

export function effectiveStock(p: { stock: number }, variants?: Variant[]): number {
  if (variants && variants.length > 0) return variants.reduce((s, v) => s + v.stock, 0);
  return p.stock;
}

export function stockTone(stock: number, threshold: number): "danger" | "warn" | "success" {
  if (stock === 0) return "danger";
  if (stock <= threshold) return "warn";
  return "success";
}

export function AdminProductsPage() {
  useSeo({ title: "Admin — Produits", noIndex: true });
  const { session } = useAdmin();
  const actor = session?.username || "system";
  const [overrides, setOverrides] = useLocalState<Record<string, Override>>("ipk:admin:productOverrides:v1", {});
  const [removed, setRemoved] = useLocalState<string[]>("ipk:admin:productRemoved:v1", []);
  const [created, setCreated] = useLocalState<Product[]>("ipk:admin:newProducts:v1", []);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "draft" | "archived">("all");
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ price: number; stock: number; status: "active" | "draft" | "archived" }>({ price: 0, stock: 0, status: "active" });
  const [creating, setCreating] = useState(false);

  const [variantsModal, setVariantsModal] = useState<string | null>(null);
  const [mediaModal, setMediaModal] = useState<string | null>(null);
  const [tagsModal, setTagsModal] = useState<string | null>(null);
  const [stockModal, setStockModal] = useState<string | null>(null);
  const [nichesModal, setNichesModal] = useState<string | null>(null);
  const [editorModal, setEditorModal] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [bulkEditOpen, setBulkEditOpen] = useState(false);

  const handleExportAll = () => {
    exportCSV(`produits-${new Date().toISOString().slice(0, 10)}.csv`, merged.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      price: p.price,
      stock: p.stock,
      status: p.adminStatus,
      country: p.origin?.country || "",
      region: p.origin?.region || "",
      village: p.origin?.village || "",
      story: p.story || "",
      dimensions: p.dimensions || "",
      weight: p.weight || "",
      materials: (p.materials || []).join("|"),
      badges: (p.badges || []).join("|"),
      tags: (p.tags || []).join("|"),
      niches: (p.niches || []).join("|"),
      images: (p.images || []).join("|"),
    })));
    toast.success(`${merged.length} produit(s) exporté(s)`);
  };

  const handleImport = (rows: ImportRow[]) => {
    let createdCount = 0;
    let updatedCount = 0;
    const newCreated: Product[] = [];
    const newOverrides = { ...overrides };
    rows.forEach(r => {
      if (r.match) {
        newOverrides[r.match] = { ...newOverrides[r.match], ...r.patch };
        updatedCount++;
      } else if (r.product) {
        newCreated.push(r.product);
        createdCount++;
      }
    });
    if (newCreated.length > 0) setCreated(prev => [...newCreated, ...prev]);
    if (updatedCount > 0) setOverrides(newOverrides);
    logAudit({ actor, action: "import", entity: "product", details: `Import CSV — ${createdCount} créé(s), ${updatedCount} mis à jour` });
    toast.success(`Import : ${createdCount} créé(s) · ${updatedCount} mis à jour`);
    setImportOpen(false);
  };

  const merged = useMemo(() => {
    return [...created, ...seedProducts]
      .filter(p => !removed.includes(p.id))
      .map(p => {
        const o = overrides[p.id];
        const variants = o?.variants;
        const baseStock = o?.stock ?? p.stock;
        const imgs = o?.images ?? p.images;
        const cat = o?.category ?? p.category;
        const basePrice = o?.price ?? p.price;
        const promoActive = isPromoActive(o?.promo);
        const finalPrice = promoActive ? applyPromo(basePrice, o?.promo) : basePrice;
        const baseBadges = o?.badges ?? p.badges ?? [];
        const promoBadge = promoActive ? `-${o!.promo!.percent}%` : null;
        const mergedBadges = promoBadge && !baseBadges.includes(promoBadge) ? [promoBadge, ...baseBadges] : baseBadges;
        return {
          ...p,
          name: o?.name ?? p.name,
          slug: o?.slug ?? p.slug,
          category: cat,
          story: o?.story ?? p.story,
          ancestrality: o?.ancestrality ?? p.ancestrality,
          dimensions: o?.dimensions ?? p.dimensions,
          weight: o?.weight ?? p.weight,
          materials: o?.materials ?? p.materials,
          care: o?.care ?? p.care,
          origin: o?.origin ?? p.origin,
          delivery: o?.delivery ?? p.delivery,
          norms: o?.norms ?? p.norms,
          isUnique: o?.isUnique ?? p.isUnique,
          isExclusive: o?.isExclusive ?? p.isExclusive,
          images: imgs,
          price: finalPrice,
          originalPrice: promoActive ? basePrice : undefined,
          promo: o?.promo,
          stock: baseStock,
          adminStatus: o?.status ?? "active",
          variants,
          lowStockThreshold: o?.lowStockThreshold ?? DEFAULT_LOW_STOCK,
          totalStock: effectiveStock({ stock: baseStock }, variants),
          badges: mergedBadges,
          tags: o?.tags ?? [],
          niches: o?.niches ?? p.niches,
          effectiveNicheList: effectiveNiches({ niches: o?.niches ?? p.niches, category: cat }),
        };
      });
  }, [overrides, removed, created]);

  const filtered = useMemo(() => merged.filter(p => {
    if (statusFilter !== "all" && p.adminStatus !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    }
    return true;
  }), [merged, statusFilter, search]);

  type SortKey = "name" | "category" | "price" | "stock" | "adminStatus";
  const { sorted, sort, onSort } = useSortable<typeof filtered[number], SortKey>(filtered, (item, key) => item[key] as any);
  const { page, pageCount, total, slice, setPage } = usePagination(sorted, 20);
  const bulk = useBulkSelection(slice);
  const confirm = useConfirm();

  const startEdit = (p: typeof merged[number]) => {
    setEditing(p.id);
    setDraft({ price: p.price, stock: p.stock, status: p.adminStatus });
  };

  const save = (id: string) => {
    setOverrides(prev => ({ ...prev, [id]: { ...prev[id], ...draft } }));
    setEditing(null);
    const product = seedProducts.find(p => p.id === id);
    logAudit({ actor, action: "update", entity: "product", entityId: id, details: `« ${product?.name || id} » → prix ${draft.price}, stock ${draft.stock}, ${draft.status}` });
    toast.success("Produit mis à jour");
  };

  const remove = async (p: Product) => {
    const cascade = previewProductCascade(p.id);
    const ok = await confirm({
      title: `Archiver « ${p.name} » ?`,
      message: cascade.reviewsDeleted > 0 || cascade.ordersAffected > 0
        ? <span>Cela supprimera <strong>{cascade.reviewsDeleted}</strong> avis et laissera <strong>{cascade.ordersAffected}</strong> commande(s) sans produit lié.</span>
        : "Vous pourrez le restaurer depuis la liste des archivés.",
      confirmLabel: "Archiver",
      tone: "danger",
    });
    if (!ok) return;
    const report = cascadeProductDelete(p.id);
    setRemoved(prev => [...prev, p.id]);
    logAudit({ actor, action: "archive", entity: "product", entityId: p.id, details: `« ${p.name} » — ${report.reviewsDeleted} avis purgés, ${report.ordersAffected} commande(s) orphelines` });
    toast.success("Produit archivé", { description: report.reviewsDeleted > 0 ? `${report.reviewsDeleted} avis liés supprimés.` : undefined });
  };

  const bulkArchive = async () => {
    const items = bulk.selectedItems;
    const ok = await confirm({
      title: `Archiver ${items.length} produit${items.length > 1 ? "s" : ""} ?`,
      message: "Cette action archive les produits et purge les avis associés. Restauration possible depuis la liste des archivés.",
      confirmLabel: "Tout archiver",
      tone: "danger",
    });
    if (!ok) return;
    let totalReviews = 0;
    items.forEach(p => { totalReviews += cascadeProductDelete(p.id).reviewsDeleted; });
    setRemoved(prev => [...prev, ...items.map(p => p.id)]);
    logAudit({ actor, action: "archive", entity: "product", details: `Bulk: ${items.length} produits, ${totalReviews} avis purgés` });
    bulk.clear();
    toast.success(`${items.length} produits archivés`, { description: totalReviews > 0 ? `${totalReviews} avis purgés.` : undefined });
  };

  const applyBulkEdit = (patch: BulkEditPatch) => {
    const items = bulk.selectedItems;
    if (items.length === 0) return;
    setOverrides(prev => {
      const next = { ...prev };
      items.forEach(p => {
        const cur: Override = { ...next[p.id] };
        if (patch.category) cur.category = patch.category;
        if (patch.priceMode === "set" && typeof patch.priceValue === "number") {
          cur.price = Math.max(0, Math.round(patch.priceValue));
        } else if (patch.priceMode === "percent" && typeof patch.priceValue === "number") {
          const base = cur.price ?? p.price;
          cur.price = Math.max(0, Math.round(base * (1 + patch.priceValue / 100)));
        }
        if (patch.badgesMode && patch.badgesList) {
          const existing = cur.badges ?? p.badges ?? [];
          if (patch.badgesMode === "replace") cur.badges = patch.badgesList;
          else if (patch.badgesMode === "add") cur.badges = Array.from(new Set([...existing, ...patch.badgesList]));
          else if (patch.badgesMode === "remove") cur.badges = existing.filter(b => !patch.badgesList!.includes(b));
        }
        if (patch.promoAction === "set" && patch.promo) cur.promo = patch.promo;
        else if (patch.promoAction === "clear") cur.promo = undefined;
        if (patch.lowStockThreshold !== undefined) cur.lowStockThreshold = patch.lowStockThreshold;
        next[p.id] = cur;
      });
      return next;
    });
    const summary: string[] = [];
    if (patch.category) summary.push(`catégorie → ${patch.category}`);
    if (patch.priceMode) summary.push(`prix ${patch.priceMode === "set" ? "=" : (patch.priceValue! >= 0 ? "+" : "")}${patch.priceValue}${patch.priceMode === "percent" ? "%" : ""}`);
    if (patch.badgesMode) summary.push(`badges ${patch.badgesMode}`);
    if (patch.promoAction === "set") summary.push(`promo -${patch.promo!.percent}%`);
    if (patch.promoAction === "clear") summary.push("promo retirée");
    if (patch.lowStockThreshold !== undefined) summary.push(`seuil bas ${patch.lowStockThreshold}`);
    logAudit({ actor, action: "update", entity: "product", details: `Bulk edit (${items.length}): ${summary.join(", ")}` });
    toast.success(`${items.length} produit(s) mis à jour`);
    bulk.clear();
    setBulkEditOpen(false);
  };

  const bulkStatus = (status: "active" | "draft" | "archived") => {
    const ids = bulk.selectedItems.map(p => p.id);
    setOverrides(prev => {
      const next = { ...prev };
      ids.forEach(id => { next[id] = { ...next[id], status }; });
      return next;
    });
    logAudit({ actor, action: "update", entity: "product", details: `Bulk: ${ids.length} produits → statut ${status}` });
    bulk.clear();
    toast.success(`${ids.length} produits → ${status}`);
  };

  const counts = {
    all: merged.length,
    active: merged.filter(p => p.adminStatus === "active").length,
    draft: merged.filter(p => p.adminStatus === "draft").length,
    archived: merged.filter(p => p.adminStatus === "archived").length,
  };

  return (
    <div>
      <PageHeader
        title="Produits"
        subtitle={`${merged.length} produits — ${removed.length} archivés`}
        action={
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleExportAll} variant="outline" className="rounded-xl h-10"><Download className="w-4 h-4 mr-1" /> Export CSV</Button>
            <Button onClick={() => setImportOpen(true)} variant="outline" className="rounded-xl h-10"><Upload className="w-4 h-4 mr-1" /> Import CSV</Button>
            <AddButton onClick={() => setCreating(true)} label="Nouveau produit" />
          </div>
        }
      />

      <DataCard className="mb-4">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <SearchInput value={search} onChange={setSearch} placeholder="Rechercher un produit…" />
          <div className="flex gap-1 flex-wrap">
            {(["all", "active", "draft", "archived"] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full transition-colors ${statusFilter === s ? "bg-[var(--ipk-green-dark)] text-white" : "bg-[var(--ipk-surface)] text-[var(--ipk-text)]"}`}
                style={{ fontSize: "12px", fontWeight: 500 }}
              >
                {s === "all" ? "Tous" : s === "active" ? "Actifs" : s === "draft" ? "Brouillons" : "Archivés"} ({counts[s]})
              </button>
            ))}
          </div>
        </div>
      </DataCard>

      <BulkBar count={bulk.count} onClear={bulk.clear}>
        <Button onClick={() => setBulkEditOpen(true)} className="rounded-lg h-8 px-3 bg-[var(--ipk-green-dark)] hover:bg-[var(--ipk-green-darker)] text-white" style={{ fontSize: "12px" }}><Edit3 className="w-3.5 h-3.5 mr-1" /> Édition en lot</Button>
        <Button onClick={() => bulkStatus("active")} variant="outline" className="rounded-lg h-8 px-3 bg-white text-[var(--ipk-ink)]" style={{ fontSize: "12px" }}>Activer</Button>
        <Button onClick={() => bulkStatus("draft")} variant="outline" className="rounded-lg h-8 px-3 bg-white text-[var(--ipk-ink)]" style={{ fontSize: "12px" }}>Brouillon</Button>
        <Button onClick={bulkArchive} className="rounded-lg h-8 px-3 bg-red-600 hover:bg-red-700 text-white" style={{ fontSize: "12px" }}>Archiver</Button>
      </BulkBar>

      <DataCard>
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full" style={{ fontSize: "13px" }}>
            <thead className="text-[var(--ipk-text)] border-b border-[var(--ipk-border)]">
              <tr>
                <th className="py-2 w-8"><SelectCheckbox checked={bulk.allSelected} indeterminate={bulk.someSelected && !bulk.allSelected} onChange={bulk.toggleAll} ariaLabel="Tout sélectionner" /></th>
                <th className="text-left py-2 font-medium"><SortHeader label="Produit" sortKey="name" state={sort} onSort={onSort} /></th>
                <th className="text-left py-2 font-medium hidden sm:table-cell"><SortHeader label="Catégorie" sortKey="category" state={sort} onSort={onSort} /></th>
                <th className="text-right py-2 font-medium"><SortHeader label="Prix" sortKey="price" state={sort} onSort={onSort} align="right" /></th>
                <th className="text-right py-2 font-medium"><SortHeader label="Stock" sortKey="stock" state={sort} onSort={onSort} align="right" /></th>
                <th className="text-left py-2 font-medium"><SortHeader label="Statut" sortKey="adminStatus" state={sort} onSort={onSort} /></th>
                <th className="text-right py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {slice.length === 0 ? (
                <tr><td colSpan={7}><EmptyRow message="Aucun produit ne correspond à vos critères." /></td></tr>
              ) : slice.map(p => {
                const isEditing = editing === p.id;
                const variantCount = p.variants?.length || 0;
                const tone = stockTone(p.totalStock, p.lowStockThreshold);
                return (
                  <tr key={p.id} className={`border-b border-[var(--ipk-border)] last:border-0 align-middle ${bulk.selected.has(p.id) ? "bg-[var(--ipk-surface)]" : ""}`}>
                    <td className="py-3 pr-2"><SelectCheckbox checked={bulk.selected.has(p.id)} onChange={() => bulk.toggle(p.id)} ariaLabel={`Sélectionner ${p.name}`} /></td>
                    <td className="py-3 pr-2">
                      <div className="font-medium text-[var(--ipk-ink)] truncate max-w-[200px]">{p.name}</div>
                      <div className="text-[var(--ipk-text)] sm:hidden" style={{ fontSize: "11px" }}>{p.category}</div>
                    </td>
                    <td className="py-3 pr-2 hidden sm:table-cell text-[var(--ipk-text)]">{p.category}</td>
                    <td className="py-3 pr-2 text-right">
                      {isEditing ? (
                        <NumberInput value={draft.price} onChange={v => setDraft(d => ({ ...d, price: v }))} min={0} max={9_999_999} integer className="w-24" ariaLabel="Prix (Fcfa)" />
                      ) : <span style={{ fontWeight: 600 }}>{formatPrice(p.price)}</span>}
                    </td>
                    <td className="py-3 pr-2 text-right">
                      {isEditing ? (
                        <NumberInput value={draft.stock} onChange={v => setDraft(d => ({ ...d, stock: v }))} min={0} max={99_999} integer className="w-16" ariaLabel="Stock" />
                      ) : (
                        <div className="inline-flex items-center gap-1">
                          <StatusPill status={String(p.totalStock)} tone={tone} />
                          {variantCount > 0 && <span className="text-[var(--ipk-text)]" style={{ fontSize: "10px" }}>×{variantCount}</span>}
                        </div>
                      )}
                    </td>
                    <td className="py-3 pr-2">
                      {isEditing ? (
                        <select value={draft.status} onChange={e => setDraft(d => ({ ...d, status: e.target.value as Override["status"] as any }))} className="border border-[var(--ipk-border)] rounded-lg px-2 py-1">
                          <option value="active">Actif</option>
                          <option value="draft">Brouillon</option>
                          <option value="archived">Archivé</option>
                        </select>
                      ) : (
                        <StatusPill
                          status={p.adminStatus === "active" ? "Actif" : p.adminStatus === "draft" ? "Brouillon" : "Archivé"}
                          tone={p.adminStatus === "active" ? "success" : p.adminStatus === "draft" ? "warn" : "neutral"}
                        />
                      )}
                    </td>
                    <td className="py-3 text-right whitespace-nowrap">
                      {isEditing ? (
                        <div className="inline-flex gap-1">
                          <Button onClick={() => save(p.id)} className="bg-[var(--ipk-green-dark)] text-white rounded-lg h-8 w-8 p-0" aria-label="Enregistrer"><Save className="w-3.5 h-3.5" /></Button>
                          <Button onClick={() => setEditing(null)} variant="outline" className="rounded-lg h-8 w-8 p-0" aria-label="Annuler"><X className="w-3.5 h-3.5" /></Button>
                        </div>
                      ) : (
                        <div className="inline-flex gap-1">
                          <Link to={`/boutique/${p.slug}`} target="_blank" rel="noreferrer" aria-label="Voir sur le site" className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-[var(--ipk-border)] text-[var(--ipk-text)] hover:text-[var(--ipk-blue)]"><Eye className="w-3.5 h-3.5" /></Link>
                          <Button onClick={() => setEditorModal(p.id)} variant="outline" className="rounded-lg h-8 w-8 p-0" aria-label="Édition complète"><FileEdit className="w-3.5 h-3.5" /></Button>
                          <Button onClick={() => startEdit(p)} variant="outline" className="rounded-lg h-8 w-8 p-0" aria-label="Édition rapide"><Edit3 className="w-3.5 h-3.5" /></Button>
                          <Button onClick={() => setMediaModal(p.id)} variant="outline" className={`rounded-lg h-8 w-8 p-0 ${(p.images?.length || 0) > 1 ? "text-[var(--ipk-blue)]" : ""}`} aria-label="Médias"><ImageIcon className="w-3.5 h-3.5" /></Button>
                          <Button onClick={() => setVariantsModal(p.id)} variant="outline" className={`rounded-lg h-8 w-8 p-0 ${variantCount > 0 ? "text-[var(--ipk-blue)]" : ""}`} aria-label="Variantes"><Boxes className="w-3.5 h-3.5" /></Button>
                          <Button onClick={() => setTagsModal(p.id)} variant="outline" className={`rounded-lg h-8 w-8 p-0 ${(p.badges?.length || 0) + (p.tags?.length || 0) > 0 ? "text-[var(--ipk-blue)]" : ""}`} aria-label="Tags & badges"><TagIcon className="w-3.5 h-3.5" /></Button>
                          <Button onClick={() => setStockModal(p.id)} variant="outline" className="rounded-lg h-8 w-8 p-0" aria-label="Ajuster le stock"><ArrowDownUp className="w-3.5 h-3.5" /></Button>
                          <Button onClick={() => setNichesModal(p.id)} variant="outline" className={`rounded-lg h-8 w-8 p-0 ${(p.niches?.length || 0) > 0 ? "text-[var(--ipk-blue)]" : ""}`} aria-label="Niches"><Network className="w-3.5 h-3.5" /></Button>
                          <Button onClick={() => remove(p)} variant="outline" className="rounded-lg h-8 w-8 p-0 text-red-600" aria-label="Archiver"><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination page={page} pageCount={pageCount} total={total} pageSize={20} onChange={setPage} />
      </DataCard>

      {removed.length > 0 && (
        <DataCard className="mt-4">
          <div className="flex items-center justify-between">
            <span className="text-[var(--ipk-text)]" style={{ fontSize: "13px" }}>{removed.length} produit{removed.length > 1 ? "s" : ""} archivé{removed.length > 1 ? "s" : ""}</span>
            <Button onClick={() => { setRemoved([]); toast.success("Restauration effectuée"); }} variant="outline" className="rounded-xl h-9">Tout restaurer</Button>
          </div>
        </DataCard>
      )}

      {editorModal && (() => {
        const p = merged.find(x => x.id === editorModal);
        if (!p) return null;
        return (
          <FullProductEditor
            product={p}
            onClose={() => setEditorModal(null)}
            onSave={(patch) => {
              setOverrides(prev => ({ ...prev, [p.id]: { ...prev[p.id], ...patch } }));
              logAudit({ actor, action: "update", entity: "product", entityId: p.id, details: `« ${p.name} » — édition complète (${Object.keys(patch).length} champs)` });
              toast.success("Produit enregistré");
              setEditorModal(null);
            }}
          />
        );
      })()}

      {nichesModal && (() => {
        const p = merged.find(x => x.id === nichesModal);
        if (!p) return null;
        return (
          <NichesModal
            productName={p.name}
            category={p.category}
            initialNiches={p.niches || []}
            fallbackNiches={p.effectiveNicheList}
            onClose={() => setNichesModal(null)}
            onSave={(niches) => {
              setOverrides(prev => ({ ...prev, [p.id]: { ...prev[p.id], niches: niches.length > 0 ? niches : undefined } }));
              logAudit({ actor, action: "update", entity: "product", entityId: p.id, details: `« ${p.name} » — ${niches.length} niche(s) : ${niches.join(", ") || "—"}` });
              toast.success("Niches enregistrées");
              setNichesModal(null);
            }}
          />
        );
      })()}

      {stockModal && (() => {
        const p = merged.find(x => x.id === stockModal);
        if (!p) return null;
        return (
          <StockAdjustModal
            productName={p.name}
            currentStock={p.stock}
            onClose={() => setStockModal(null)}
            onSave={(qty, reason, note) => {
              const newStock = Math.max(0, p.stock + qty);
              setOverrides(prev => ({ ...prev, [p.id]: { ...prev[p.id], stock: newStock } }));
              logStockMovement({ productId: p.id, productName: p.name, qty, reason, note, actor, balanceAfter: newStock });
              logAudit({ actor, action: "stock_adjusted", entity: "product", entityId: p.id, details: `« ${p.name} » ${qty > 0 ? "+" : ""}${qty} (${REASON_LABEL[reason]}) → ${newStock}` });
              toast.success(`Stock ajusté : ${qty > 0 ? "+" : ""}${qty} → ${newStock}`);
              setStockModal(null);
            }}
          />
        );
      })()}

      {tagsModal && (() => {
        const p = merged.find(x => x.id === tagsModal);
        if (!p) return null;
        return (
          <TagsBadgesModal
            productName={p.name}
            initialBadges={p.badges || []}
            initialTags={p.tags || []}
            onClose={() => setTagsModal(null)}
            onSave={(badges, tags) => {
              setOverrides(prev => ({ ...prev, [p.id]: { ...prev[p.id], badges, tags } }));
              logAudit({ actor, action: "update", entity: "product", entityId: p.id, details: `« ${p.name} » — badges: ${badges.join(", ") || "—"} | tags: ${tags.join(", ") || "—"}` });
              toast.success("Tags & badges enregistrés");
              setTagsModal(null);
            }}
          />
        );
      })()}

      {mediaModal && (() => {
        const p = merged.find(x => x.id === mediaModal);
        if (!p) return null;
        return (
          <MediaModal
            productName={p.name}
            initialImages={p.images || []}
            onClose={() => setMediaModal(null)}
            onSave={(images) => {
              setOverrides(prev => ({ ...prev, [p.id]: { ...prev[p.id], images } }));
              logAudit({ actor, action: "update", entity: "product", entityId: p.id, details: `« ${p.name} » — ${images.length} image(s), principale réordonnée` });
              toast.success("Galerie mise à jour");
              setMediaModal(null);
            }}
          />
        );
      })()}

      {variantsModal && (() => {
        const p = merged.find(x => x.id === variantsModal);
        if (!p) return null;
        return (
          <VariantsModal
            productName={p.name}
            initialVariants={p.variants || []}
            initialThreshold={p.lowStockThreshold}
            basePrice={p.price}
            onClose={() => setVariantsModal(null)}
            onSave={(variants, threshold) => {
              setOverrides(prev => ({ ...prev, [p.id]: { ...prev[p.id], variants: variants.length > 0 ? variants : undefined, lowStockThreshold: threshold === DEFAULT_LOW_STOCK ? undefined : threshold } }));
              logAudit({ actor, action: "update", entity: "product", entityId: p.id, details: `« ${p.name} » — ${variants.length} variante(s), seuil bas ${threshold}` });
              toast.success("Variantes enregistrées");
              setVariantsModal(null);
            }}
          />
        );
      })()}

      {importOpen && (
        <ImportCSVModal
          existingIds={new Set(merged.map(p => p.id))}
          existingSlugs={new Map(merged.map(p => [p.slug, p.id]))}
          onClose={() => setImportOpen(false)}
          onConfirm={handleImport}
        />
      )}

      {bulkEditOpen && (
        <BulkEditModal
          count={bulk.count}
          categories={merged.length > 0 ? Array.from(new Set(merged.map(p => p.category))) : []}
          onClose={() => setBulkEditOpen(false)}
          onApply={applyBulkEdit}
        />
      )}

      {creating && (
        <CreateProductModal
          onClose={() => setCreating(false)}
          onCreate={(p) => {
            setCreated(prev => [p, ...prev]);
            logAudit({ actor, action: "create", entity: "product", entityId: p.id, details: `« ${p.name} » — ${formatPrice(p.price)}, stock ${p.stock}` });
            toast.success("Produit créé", { description: p.name });
            setCreating(false);
          }}
        />
      )}
    </div>
  );
}

interface BulkEditPatch {
  category?: string;
  priceMode?: "set" | "percent";
  priceValue?: number;
  badgesMode?: "add" | "replace" | "remove";
  badgesList?: string[];
  promoAction?: "set" | "clear";
  promo?: { percent: number; startsAt?: string; endsAt?: string };
  lowStockThreshold?: number;
}

function BulkEditModal({ count, categories, onClose, onApply }: {
  count: number;
  categories: string[];
  onClose: () => void;
  onApply: (patch: BulkEditPatch) => void;
}) {
  const { visibleCategories } = useCategories();
  const allCats = Array.from(new Set([...visibleCategories.map(c => c.name), ...categories]));

  const [doCategory, setDoCategory] = useState(false);
  const [category, setCategory] = useState(allCats[0] || "");

  const [doPrice, setDoPrice] = useState(false);
  const [priceMode, setPriceMode] = useState<"set" | "percent">("percent");
  const [priceValue, setPriceValue] = useState<number>(0);

  const [doBadges, setDoBadges] = useState(false);
  const [badgesMode, setBadgesMode] = useState<"add" | "replace" | "remove">("add");
  const [badgesPicked, setBadgesPicked] = useState<string[]>([]);
  const [badgeCustom, setBadgeCustom] = useState("");

  const [doPromo, setDoPromo] = useState(false);
  const [promoAction, setPromoAction] = useState<"set" | "clear">("set");
  const [promoPercent, setPromoPercent] = useState<number>(10);
  const [promoStart, setPromoStart] = useState("");
  const [promoEnd, setPromoEnd] = useState("");

  const [doThreshold, setDoThreshold] = useState(false);
  const [threshold, setThreshold] = useState<number>(DEFAULT_LOW_STOCK);

  const toggleBadge = (b: string) => setBadgesPicked(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  const addCustomBadge = () => {
    const t = badgeCustom.trim();
    if (t && !badgesPicked.includes(t)) setBadgesPicked(prev => [...prev, t]);
    setBadgeCustom("");
  };

  const submit = () => {
    const patch: BulkEditPatch = {};
    if (doCategory && category) patch.category = category;
    if (doPrice) { patch.priceMode = priceMode; patch.priceValue = priceValue; }
    if (doBadges) { patch.badgesMode = badgesMode; patch.badgesList = badgesPicked; }
    if (doPromo) {
      patch.promoAction = promoAction;
      if (promoAction === "set") patch.promo = { percent: promoPercent, startsAt: promoStart || undefined, endsAt: promoEnd || undefined };
    }
    if (doThreshold) patch.lowStockThreshold = threshold;
    if (Object.keys(patch).length === 0) { toast.error("Activez au moins une action"); return; }
    onApply(patch);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-[var(--ipk-border)] px-5 py-4 flex items-center justify-between">
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--ipk-ink)" }}>Édition en lot</h2>
            <p className="text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>{count} produit(s) sélectionné(s) — cochez les actions à appliquer</p>
          </div>
          <Button onClick={onClose} variant="outline" className="rounded-lg h-8 w-8 p-0" aria-label="Fermer"><X className="w-4 h-4" /></Button>
        </div>

        <div className="p-5 space-y-3" style={{ fontSize: "13px" }}>
          <Section enabled={doCategory} onToggle={setDoCategory} title="Changer la catégorie">
            <select value={category} onChange={e => setCategory(e.target.value)} disabled={!doCategory} className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2 bg-white disabled:opacity-50">
              {allCats.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Section>

          <Section enabled={doPrice} onToggle={setDoPrice} title="Modifier le prix">
            <div className="grid grid-cols-2 gap-2">
              <select value={priceMode} onChange={e => setPriceMode(e.target.value as any)} disabled={!doPrice} className="border border-[var(--ipk-border)] rounded-lg px-3 py-2 bg-white disabled:opacity-50">
                <option value="percent">Variation en %</option>
                <option value="set">Prix fixe (Fcfa)</option>
              </select>
              <NumberInput value={priceValue} onChange={setPriceValue} integer min={priceMode === "percent" ? -90 : 0} max={priceMode === "percent" ? 500 : 9_999_999} className="w-full" />
            </div>
            <p className="text-[var(--ipk-text)] mt-1" style={{ fontSize: "11px" }}>
              {priceMode === "percent" ? "Ex. -20 pour réduire de 20%, +15 pour augmenter de 15%." : "Le même prix sera appliqué à tous les produits sélectionnés."}
            </p>
          </Section>

          <Section enabled={doBadges} onToggle={setDoBadges} title="Badges">
            <select value={badgesMode} onChange={e => setBadgesMode(e.target.value as any)} disabled={!doBadges} className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2 bg-white disabled:opacity-50 mb-2">
              <option value="add">Ajouter aux badges existants</option>
              <option value="replace">Remplacer les badges</option>
              <option value="remove">Retirer ces badges</option>
            </select>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_BADGES.map(b => (
                <button key={b} type="button" disabled={!doBadges} onClick={() => toggleBadge(b)} className={`px-2.5 py-1 rounded-full border ${badgesPicked.includes(b) ? "bg-[var(--ipk-green-dark)] text-white border-transparent" : "border-[var(--ipk-border)] text-[var(--ipk-text)]"} disabled:opacity-50`} style={{ fontSize: "11px", fontWeight: 600 }}>{b}</button>
              ))}
              {badgesPicked.filter(b => !SUGGESTED_BADGES.includes(b)).map(b => (
                <button key={b} type="button" disabled={!doBadges} onClick={() => toggleBadge(b)} className="px-2.5 py-1 rounded-full bg-[var(--ipk-blue)] text-white" style={{ fontSize: "11px", fontWeight: 600 }}>{b} ×</button>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <input value={badgeCustom} disabled={!doBadges} onChange={e => setBadgeCustom(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addCustomBadge(); } }} placeholder="Badge personnalisé" className="flex-1 border border-[var(--ipk-border)] rounded-lg px-2 py-1 disabled:opacity-50" style={{ fontSize: "12px" }} />
              <Button type="button" onClick={addCustomBadge} disabled={!doBadges} variant="outline" className="rounded-lg h-8" style={{ fontSize: "12px" }}>+</Button>
            </div>
          </Section>

          <Section enabled={doPromo} onToggle={setDoPromo} title="Promotion">
            <div className="flex gap-2 mb-2">
              <label className="flex items-center gap-1"><input type="radio" disabled={!doPromo} checked={promoAction === "set"} onChange={() => setPromoAction("set")} /> Appliquer</label>
              <label className="flex items-center gap-1"><input type="radio" disabled={!doPromo} checked={promoAction === "clear"} onChange={() => setPromoAction("clear")} /> Retirer</label>
            </div>
            {promoAction === "set" && (
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="block mb-1 text-[var(--ipk-ink)]" style={{ fontSize: "11px", fontWeight: 500 }}>Remise (%)</span>
                  <NumberInput value={promoPercent} onChange={setPromoPercent} min={1} max={90} integer className="w-full" />
                </div>
                <div>
                  <span className="block mb-1 text-[var(--ipk-ink)]" style={{ fontSize: "11px", fontWeight: 500 }}>Début</span>
                  <input type="date" disabled={!doPromo} value={promoStart} onChange={e => setPromoStart(e.target.value)} className="w-full border border-[var(--ipk-border)] rounded-lg px-2 py-1.5 disabled:opacity-50" style={{ fontSize: "12px" }} />
                </div>
                <div>
                  <span className="block mb-1 text-[var(--ipk-ink)]" style={{ fontSize: "11px", fontWeight: 500 }}>Fin</span>
                  <input type="date" disabled={!doPromo} value={promoEnd} onChange={e => setPromoEnd(e.target.value)} className="w-full border border-[var(--ipk-border)] rounded-lg px-2 py-1.5 disabled:opacity-50" style={{ fontSize: "12px" }} />
                </div>
              </div>
            )}
          </Section>

          <Section enabled={doThreshold} onToggle={setDoThreshold} title="Seuil de stock bas">
            <NumberInput value={threshold} onChange={setThreshold} min={0} max={999} integer className="w-32" />
          </Section>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-[var(--ipk-border)] px-5 py-3 flex justify-end gap-2">
          <Button onClick={onClose} variant="outline" className="rounded-xl h-10">Annuler</Button>
          <Button onClick={submit} className="bg-[var(--ipk-green-dark)] hover:bg-[var(--ipk-green-darker)] text-white rounded-xl h-10 px-4">Appliquer à {count} produit(s)</Button>
        </div>
      </div>
    </div>
  );
}

function Section({ enabled, onToggle, title, children }: { enabled: boolean; onToggle: (v: boolean) => void; title: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-xl border p-3 ${enabled ? "border-[var(--ipk-green-dark)] bg-[var(--ipk-surface)]" : "border-[var(--ipk-border)]"}`}>
      <label className="flex items-center gap-2 mb-2 cursor-pointer">
        <input type="checkbox" checked={enabled} onChange={e => onToggle(e.target.checked)} />
        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--ipk-ink)" }}>{title}</span>
      </label>
      <div className={enabled ? "" : "opacity-60 pointer-events-none"}>{children}</div>
    </div>
  );
}

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function CreateProductModal({ onClose, onCreate }: { onClose: () => void; onCreate: (p: Product) => void }) {
  const { visibleCategories } = useCategories();
  const [name, setName] = useState("");
  const [category, setCategory] = useState(visibleCategories[0]?.name || "Sculpture");
  const [price, setPrice] = useState(10000);
  const [stock, setStock] = useState(5);
  const [story, setStory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [country, setCountry] = useState("Togo");
  const [region, setRegion] = useState("Lomé");
  const [village, setVillage] = useState("");

  const canSave = name.trim().length >= 3 && price >= 0 && stock >= 0;

  const handleSave = () => {
    if (!canSave) return;
    const id = `pn-${Date.now().toString(36)}`;
    const product: Product = {
      id,
      name: name.trim(),
      slug: slugify(name) || id,
      category,
      technique: category,
      artisanId: "",
      groupementId: "",
      origin: { country, region, village: village || region },
      story: story.trim(),
      ancestrality: "",
      norms: [],
      materials: [],
      dimensions: "",
      weight: "",
      care: "",
      price,
      currency: "Fcfa",
      stock,
      isUnique: stock === 1,
      isExclusive: false,
      images: imageUrl.trim() ? [imageUrl.trim()] : ["https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?w=800"],
      rating: 0,
      reviewCount: 0,
      badges: ["Nouveau"],
      delivery: { zones: country, delay: "5-10 jours", cost: "Sur devis" },
    };
    onCreate(product);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-[var(--ipk-border)] px-5 py-4 flex items-center justify-between">
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--ipk-ink)" }}>Nouveau produit</h2>
          <Button onClick={onClose} variant="outline" className="rounded-lg h-8 w-8 p-0" aria-label="Fermer"><X className="w-4 h-4" /></Button>
        </div>
        <div className="p-5 space-y-3" style={{ fontSize: "13px" }}>
          <Field label="Nom *">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Masque Yoruba traditionnel" className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Catégorie">
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2 bg-white">
                {visibleCategories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Prix (Fcfa) *">
              <input type="number" min={0} value={price} onChange={e => setPrice(Number(e.target.value) || 0)} className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2" />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Stock">
              <input type="number" min={0} value={stock} onChange={e => setStock(Number(e.target.value) || 0)} className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2" />
            </Field>
            <Field label="Pays">
              <input value={country} onChange={e => setCountry(e.target.value)} className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2" />
            </Field>
            <Field label="Région">
              <input value={region} onChange={e => setRegion(e.target.value)} className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2" />
            </Field>
          </div>
          <Field label="Village (optionnel)">
            <input value={village} onChange={e => setVillage(e.target.value)} className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2" />
          </Field>
          <Field label="Image">
            <div className="space-y-2">
              <MediaPickerButton
                value={imageUrl}
                onChange={(url) => setImageUrl(url)}
                label="Choisir depuis la bibliothèque"
              />
              <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="…ou collez une URL https://…" className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2" style={{ fontSize: "13px" }} />
            </div>
          </Field>
          <Field label="Histoire / description">
            <textarea value={story} onChange={e => setStory(e.target.value)} rows={4} placeholder="L'histoire et la signification de cette pièce…" className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2 resize-y" />
          </Field>
          {imageUrl.trim() && (
            <div className="rounded-lg overflow-hidden border border-[var(--ipk-border)] aspect-video bg-[var(--ipk-surface)]">
              <img src={imageUrl} alt="Aperçu" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = "none")} />
            </div>
          )}
        </div>
        <div className="sticky bottom-0 bg-white border-t border-[var(--ipk-border)] px-5 py-3 flex justify-end gap-2">
          <Button onClick={onClose} variant="outline" className="rounded-xl h-10">Annuler</Button>
          <Button onClick={handleSave} disabled={!canSave} className="bg-[var(--ipk-green-dark)] hover:bg-[var(--ipk-green-darker)] text-white rounded-xl h-10 px-4 disabled:opacity-50">Créer le produit</Button>
        </div>
      </div>
    </div>
  );
}

interface ImportRow {
  match: string | null; // existing product id
  product?: Product; // when creating new
  patch?: Partial<Override>; // when updating existing
  errors: string[];
  raw: Record<string, string>;
}

function ImportCSVModal({ existingIds, existingSlugs, onClose, onConfirm }: {
  existingIds: Set<string>;
  existingSlugs: Map<string, string>;
  onClose: () => void;
  onConfirm: (rows: ImportRow[]) => void;
}) {
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState<ImportRow[]>([]);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const t = String(reader.result || "");
      setText(t);
      analyse(t);
    };
    reader.readAsText(file, "utf-8");
  };

  const analyse = (raw: string) => {
    if (!raw.trim()) { setParsed([]); return; }
    try {
      const { rows } = parseCSV(raw);
      const out: ImportRow[] = rows.map(r => {
        const errors: string[] = [];
        const name = r.name?.trim();
        if (!name) errors.push("nom manquant");
        const id = r.id?.trim();
        const slug = r.slug?.trim() || (name ? slugify(name) : "");
        const matchById = id && existingIds.has(id) ? id : null;
        const matchBySlug = !matchById && slug && existingSlugs.get(slug);
        const match = matchById || matchBySlug || null;
        const price = r.price ? Number(r.price) : NaN;
        const stock = r.stock ? Number(r.stock) : NaN;
        if (r.price && Number.isNaN(price)) errors.push("prix invalide");
        if (r.stock && Number.isNaN(stock)) errors.push("stock invalide");
        const splitPipes = (s: string | undefined) => (s || "").split("|").map(x => x.trim()).filter(Boolean);
        const patch: Partial<Override> = {
          name: name || undefined,
          slug: slug || undefined,
          category: r.category?.trim() || undefined,
          price: Number.isFinite(price) ? price : undefined,
          stock: Number.isFinite(stock) ? stock : undefined,
          status: (["active", "draft", "archived"].includes(r.status) ? r.status as any : undefined),
          story: r.story || undefined,
          dimensions: r.dimensions || undefined,
          weight: r.weight || undefined,
          materials: r.materials ? splitPipes(r.materials) : undefined,
          badges: r.badges ? splitPipes(r.badges) : undefined,
          tags: r.tags ? splitPipes(r.tags) : undefined,
          niches: r.niches ? splitPipes(r.niches) : undefined,
          images: r.images ? splitPipes(r.images) : undefined,
          origin: (r.country || r.region || r.village) ? { country: r.country || "", region: r.region || "", village: r.village || r.region || "" } : undefined,
        };
        let product: Product | undefined;
        if (!match && errors.length === 0 && name) {
          const newId = id || `pi-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
          product = {
            id: newId, name, slug: slug || newId,
            category: r.category || "Artisanat", technique: r.category || "Fait main",
            artisanId: "", groupementId: "",
            origin: { country: r.country || "Togo", region: r.region || "Lomé", village: r.village || r.region || "Lomé" },
            story: r.story || "", ancestrality: "", norms: [],
            materials: splitPipes(r.materials),
            dimensions: r.dimensions || "", weight: r.weight || "", care: r.care || "",
            price: Number.isFinite(price) ? price : 0, currency: "Fcfa",
            stock: Number.isFinite(stock) ? stock : 0,
            isUnique: stock === 1, isExclusive: false,
            images: splitPipes(r.images).length > 0 ? splitPipes(r.images) : ["https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?w=800"],
            rating: 0, reviewCount: 0,
            badges: splitPipes(r.badges).length > 0 ? splitPipes(r.badges) : ["Nouveau"],
            delivery: { zones: r.country || "Togo", delay: "5-10 jours", cost: "Sur devis" },
          };
        }
        return { match, product, patch, errors, raw: r };
      });
      setParsed(out);
    } catch (e: any) {
      toast.error("Erreur de parsing CSV : " + (e?.message || "format invalide"));
      setParsed([]);
    }
  };

  const valid = parsed.filter(r => r.errors.length === 0);
  const toCreate = valid.filter(r => !r.match).length;
  const toUpdate = valid.filter(r => r.match).length;
  const errorCount = parsed.length - valid.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-3xl max-h-[92vh] overflow-y-auto flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-[var(--ipk-border)] px-5 py-4 flex items-center justify-between">
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--ipk-ink)" }}>Import CSV produits</h2>
            <p className="text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>Colonnes acceptées : id, name, slug, category, price, stock, status, country, region, village, story, dimensions, weight, materials, badges, tags, niches, images (multi-valeurs séparés par <code>|</code>)</p>
          </div>
          <Button onClick={onClose} variant="outline" className="rounded-lg h-8 w-8 p-0" aria-label="Fermer"><X className="w-4 h-4" /></Button>
        </div>
        <div className="p-5 space-y-4" style={{ fontSize: "13px" }}>
          <div className="flex items-center gap-2">
            <input type="file" accept=".csv,text/csv" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} className="text-[var(--ipk-text)]" style={{ fontSize: "12px" }} />
            <Button onClick={() => analyse(text)} variant="outline" className="rounded-xl h-9" disabled={!text.trim()}>Analyser</Button>
          </div>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={6} placeholder="…ou collez un CSV ici (avec en-tête)" className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2 font-mono" style={{ fontSize: "12px" }} />

          {parsed.length > 0 && (
            <>
              <div className="grid grid-cols-3 gap-2">
                <SummaryBox label="À créer" value={toCreate} accent="var(--ipk-green-dark)" />
                <SummaryBox label="À mettre à jour" value={toUpdate} accent="var(--ipk-blue)" />
                <SummaryBox label="En erreur" value={errorCount} accent={errorCount > 0 ? "#DC2626" : "var(--ipk-text)"} />
              </div>
              <div className="border border-[var(--ipk-border)] rounded-xl max-h-64 overflow-y-auto">
                <table className="w-full" style={{ fontSize: "12px" }}>
                  <thead className="text-[var(--ipk-text)] bg-[var(--ipk-surface)] sticky top-0">
                    <tr>
                      <th className="text-left px-2 py-1">Statut</th>
                      <th className="text-left px-2 py-1">Nom</th>
                      <th className="text-right px-2 py-1">Prix</th>
                      <th className="text-right px-2 py-1">Stock</th>
                      <th className="text-left px-2 py-1">Erreurs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.map((r, i) => (
                      <tr key={i} className="border-t border-[var(--ipk-border)]">
                        <td className="px-2 py-1">{r.errors.length > 0 ? <span className="text-red-600">×</span> : r.match ? <span className="text-[var(--ipk-blue)]">↻</span> : <span className="text-[var(--ipk-green-dark)]">+</span>}</td>
                        <td className="px-2 py-1 truncate max-w-[180px]">{r.raw.name || "—"}</td>
                        <td className="px-2 py-1 text-right">{r.raw.price || "—"}</td>
                        <td className="px-2 py-1 text-right">{r.raw.stock || "—"}</td>
                        <td className="px-2 py-1 text-red-600 truncate" style={{ fontSize: "11px" }}>{r.errors.join(", ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
        <div className="sticky bottom-0 bg-white border-t border-[var(--ipk-border)] px-5 py-3 flex justify-end gap-2">
          <Button onClick={onClose} variant="outline" className="rounded-xl h-10">Annuler</Button>
          <Button onClick={() => onConfirm(valid)} disabled={valid.length === 0} className="bg-[var(--ipk-green-dark)] hover:bg-[var(--ipk-green-darker)] text-white rounded-xl h-10 px-4 disabled:opacity-50">Importer {valid.length > 0 ? `(${valid.length})` : ""}</Button>
        </div>
      </div>
    </div>
  );
}

function SummaryBox({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="bg-[var(--ipk-surface)] rounded-xl p-3 text-center">
      <div className="text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>{label}</div>
      <div className="mt-1" style={{ fontSize: "18px", fontWeight: 700, color: accent }}>{value}</div>
    </div>
  );
}

type EditorPatch = Partial<Override>;

function FullProductEditor({ product, onClose, onSave }: {
  product: Product & { adminStatus: "active" | "draft" | "archived"; lowStockThreshold: number };
  onClose: () => void;
  onSave: (patch: EditorPatch) => void;
}) {
  const { visibleCategories } = useCategories();
  const [tab, setTab] = useState<"general" | "specs" | "origin" | "norms" | "delivery" | "seo" | "promo">("general");

  const [name, setName] = useState(product.name);
  const [slug, setSlug] = useState(product.slug);
  const [category, setCategory] = useState(product.category);
  const [price, setPrice] = useState(product.price);
  const [stock, setStock] = useState(product.stock);
  const [status, setStatus] = useState<"active" | "draft" | "archived">(product.adminStatus);
  const [story, setStory] = useState(product.story || "");
  const [ancestrality, setAncestrality] = useState(product.ancestrality || "");
  const [isUnique, setIsUnique] = useState(!!product.isUnique);
  const [isExclusive, setIsExclusive] = useState(!!product.isExclusive);

  const [dimensions, setDimensions] = useState(product.dimensions || "");
  const [weight, setWeight] = useState(product.weight || "");
  const [care, setCare] = useState(product.care || "");
  const [materialsText, setMaterialsText] = useState((product.materials || []).join(", "));

  const [country, setCountry] = useState(product.origin?.country || "");
  const [region, setRegion] = useState(product.origin?.region || "");
  const [village, setVillage] = useState(product.origin?.village || "");

  const [norms, setNorms] = useState(product.norms || []);
  const [zones, setZones] = useState(product.delivery?.zones || "");
  const [delay, setDelay] = useState(product.delivery?.delay || "");
  const [cost, setCost] = useState(product.delivery?.cost || "");

  const existingPromo = (product as any).promo as { percent: number; startsAt?: string; endsAt?: string } | undefined;
  const [promoPercent, setPromoPercent] = useState<number>(existingPromo?.percent || 0);
  const [promoStart, setPromoStart] = useState<string>(existingPromo?.startsAt?.slice(0, 10) || "");
  const [promoEnd, setPromoEnd] = useState<string>(existingPromo?.endsAt?.slice(0, 10) || "");

  const existingSeo = (product as any).seo as { title?: string; description?: string; ogImage?: string; keywords?: string } | undefined;
  const [seoTitle, setSeoTitle] = useState(existingSeo?.title || "");
  const [seoDescription, setSeoDescription] = useState(existingSeo?.description || "");
  const [seoOgImage, setSeoOgImage] = useState(existingSeo?.ogImage || "");
  const [seoKeywords, setSeoKeywords] = useState(existingSeo?.keywords || "");

  const handleSave = () => {
    if (!name.trim()) { toast.error("Le nom est obligatoire"); return; }
    const patch: EditorPatch = {
      name: name.trim(),
      slug: slug.trim() || slugify(name),
      category,
      price,
      stock,
      status,
      story,
      ancestrality,
      isUnique,
      isExclusive,
      dimensions,
      weight,
      care,
      materials: materialsText.split(",").map(s => s.trim()).filter(Boolean),
      origin: { country, region, village },
      delivery: { zones, delay, cost },
      norms,
      seo: (seoTitle.trim() || seoDescription.trim() || seoOgImage.trim() || seoKeywords.trim())
        ? { title: seoTitle.trim() || undefined, description: seoDescription.trim() || undefined, ogImage: seoOgImage.trim() || undefined, keywords: seoKeywords.trim() || undefined }
        : undefined,
      promo: promoPercent > 0
        ? { percent: promoPercent, startsAt: promoStart || undefined, endsAt: promoEnd || undefined }
        : undefined,
    };
    onSave(patch);
  };

  const TABS: { key: typeof tab; label: string }[] = [
    { key: "general", label: "Général" },
    { key: "specs", label: "Spécifications" },
    { key: "origin", label: "Origine" },
    { key: "norms", label: "Normes" },
    { key: "delivery", label: "Livraison" },
    { key: "promo", label: "Promo" },
    { key: "seo", label: "SEO" },
  ];

  const promoNow = isPromoActive({ percent: promoPercent, startsAt: promoStart || undefined, endsAt: promoEnd || undefined });
  const promoFinalPrice = promoNow ? Math.round(price * (1 - promoPercent / 100)) : price;

  const seoTitleFallback = name.trim() || product.name;
  const seoDescFallback = (story || "").slice(0, 160);
  const seoImageFallback = product.images?.[0] || "";
  const titleLen = (seoTitle || `${seoTitleFallback} — IPPOO KRAAFT`).length;
  const descLen = (seoDescription || seoDescFallback).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-3xl max-h-[92vh] overflow-y-auto flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-[var(--ipk-border)] px-5 py-4 flex items-center justify-between">
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--ipk-ink)" }}>Édition complète du produit</h2>
            <p className="text-[var(--ipk-text)] truncate" style={{ fontSize: "12px" }}>{product.name}</p>
          </div>
          <Button onClick={onClose} variant="outline" className="rounded-lg h-8 w-8 p-0" aria-label="Fermer"><X className="w-4 h-4" /></Button>
        </div>

        <div className="px-5 pt-3 border-b border-[var(--ipk-border)] flex gap-1 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`px-3 py-2 rounded-t-lg ${tab === t.key ? "bg-[var(--ipk-surface)] text-[var(--ipk-ink)] border-b-2 border-[var(--ipk-green-dark)]" : "text-[var(--ipk-text)]"}`} style={{ fontSize: "13px", fontWeight: 500 }}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-5 space-y-4" style={{ fontSize: "13px" }}>
          {tab === "general" && (
            <>
              <Field label="Nom *">
                <input value={name} onChange={e => setName(e.target.value)} className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Slug">
                  <input value={slug} onChange={e => setSlug(e.target.value)} placeholder={slugify(name)} className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2 font-mono" style={{ fontSize: "12px" }} />
                </Field>
                <Field label="Catégorie">
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2 bg-white">
                    {visibleCategories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    {!visibleCategories.some(c => c.name === category) && <option value={category}>{category} (héritée)</option>}
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Prix (Fcfa)">
                  <NumberInput value={price} onChange={setPrice} min={0} integer className="w-full" />
                </Field>
                <Field label="Stock">
                  <NumberInput value={stock} onChange={setStock} min={0} integer className="w-full" />
                </Field>
                <Field label="Statut">
                  <select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2 bg-white">
                    <option value="active">Actif</option>
                    <option value="draft">Brouillon</option>
                    <option value="archived">Archivé</option>
                  </select>
                </Field>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2"><input type="checkbox" checked={isUnique} onChange={e => setIsUnique(e.target.checked)} /> Pièce unique</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={isExclusive} onChange={e => setIsExclusive(e.target.checked)} /> Exclusivité</label>
              </div>
              <Field label="Histoire">
                <textarea value={story} onChange={e => setStory(e.target.value)} rows={3} className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2 resize-y" />
              </Field>
              <Field label="Ancestralité / contexte">
                <textarea value={ancestrality} onChange={e => setAncestrality(e.target.value)} rows={2} className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2 resize-y" />
              </Field>
            </>
          )}

          {tab === "specs" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Dimensions">
                  <input value={dimensions} onChange={e => setDimensions(e.target.value)} placeholder="30 × 20 × 15 cm" className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2" />
                </Field>
                <Field label="Poids">
                  <input value={weight} onChange={e => setWeight(e.target.value)} placeholder="800 g" className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2" />
                </Field>
              </div>
              <Field label="Matériaux (séparés par virgule)">
                <input value={materialsText} onChange={e => setMaterialsText(e.target.value)} placeholder="bois d'iroko, cire d'abeille, pigments naturels" className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2" />
              </Field>
              <Field label="Entretien">
                <textarea value={care} onChange={e => setCare(e.target.value)} rows={3} placeholder="Nettoyer avec un chiffon sec…" className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2 resize-y" />
              </Field>
            </>
          )}

          {tab === "origin" && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Pays"><input value={country} onChange={e => setCountry(e.target.value)} className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2" /></Field>
                <Field label="Région"><input value={region} onChange={e => setRegion(e.target.value)} className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2" /></Field>
                <Field label="Village"><input value={village} onChange={e => setVillage(e.target.value)} className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2" /></Field>
              </div>
              <p className="text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>Ces informations apparaissent sur la fiche produit (provenance et traçabilité QR).</p>
            </>
          )}

          {tab === "norms" && (
            <>
              {norms.length === 0 ? <div className="text-center py-4 text-[var(--ipk-text)]">Aucune norme enregistrée.</div> : (
                <ul className="space-y-2">
                  {norms.map((n, i) => (
                    <li key={i} className="grid grid-cols-12 gap-2 items-end p-3 border border-[var(--ipk-border)] rounded-xl">
                      <div className="col-span-3"><span className="block mb-1 text-[var(--ipk-ink)]" style={{ fontSize: "11px", fontWeight: 500 }}>Code</span><input value={n.code} onChange={e => setNorms(arr => arr.map((x, k) => k === i ? { ...x, code: e.target.value } : x))} className="w-full border border-[var(--ipk-border)] rounded-lg px-2 py-1" /></div>
                      <div className="col-span-5"><span className="block mb-1 text-[var(--ipk-ink)]" style={{ fontSize: "11px", fontWeight: 500 }}>Nom</span><input value={n.name} onChange={e => setNorms(arr => arr.map((x, k) => k === i ? { ...x, name: e.target.value } : x))} className="w-full border border-[var(--ipk-border)] rounded-lg px-2 py-1" /></div>
                      <div className="col-span-3"><span className="block mb-1 text-[var(--ipk-ink)]" style={{ fontSize: "11px", fontWeight: 500 }}>Statut</span>
                        <select value={n.status} onChange={e => setNorms(arr => arr.map((x, k) => k === i ? { ...x, status: e.target.value as any } : x))} className="w-full border border-[var(--ipk-border)] rounded-lg px-2 py-1 bg-white">
                          <option value="Validé">Validé</option><option value="En cours">En cours</option><option value="Non applicable">Non applicable</option>
                        </select>
                      </div>
                      <div className="col-span-1 flex justify-end"><Button onClick={() => setNorms(arr => arr.filter((_, k) => k !== i))} variant="outline" className="rounded-lg h-8 w-8 p-0 text-red-600" aria-label="Supprimer"><Trash2 className="w-3.5 h-3.5" /></Button></div>
                    </li>
                  ))}
                </ul>
              )}
              <Button onClick={() => setNorms(arr => [...arr, { code: "", name: "", status: "En cours" }])} variant="outline" className="rounded-xl h-10 w-full"><Plus className="w-4 h-4 mr-1" /> Ajouter une norme</Button>
            </>
          )}

          {tab === "promo" && (
            <>
              <p className="text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>Définissez un pourcentage de remise et, optionnellement, une fenêtre de validité. Le badge « -X% » et le prix barré s'activent automatiquement durant cette période.</p>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Remise (%)">
                  <NumberInput value={promoPercent} onChange={setPromoPercent} min={0} max={90} integer className="w-full" />
                </Field>
                <Field label="Début (optionnel)">
                  <input type="date" value={promoStart} onChange={e => setPromoStart(e.target.value)} className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2" />
                </Field>
                <Field label="Fin (optionnel)">
                  <input type="date" value={promoEnd} onChange={e => setPromoEnd(e.target.value)} className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2" />
                </Field>
              </div>
              {promoPercent > 0 && (
                <div className="rounded-xl border border-[var(--ipk-border)] bg-[var(--ipk-surface)] p-3 flex items-center justify-between">
                  <div>
                    <div className="text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>Prix après remise</div>
                    <div className="flex items-baseline gap-2">
                      <span style={{ fontSize: "18px", fontWeight: 700, color: "var(--ipk-green-dark)" }}>{promoFinalPrice.toLocaleString("fr-FR")} Fcfa</span>
                      <span className="line-through text-[var(--ipk-text)]" style={{ fontSize: "13px" }}>{price.toLocaleString("fr-FR")} Fcfa</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-lg ${promoNow ? "bg-[var(--ipk-green-dark)] text-white" : "bg-amber-100 text-amber-800"}`} style={{ fontSize: "11px", fontWeight: 700 }}>
                    {promoNow ? `Active · -${promoPercent}%` : "Hors période"}
                  </span>
                </div>
              )}
              {promoPercent > 0 && (
                <Button onClick={() => { setPromoPercent(0); setPromoStart(""); setPromoEnd(""); }} variant="outline" className="rounded-xl h-9">Désactiver la promo</Button>
              )}
            </>
          )}

          {tab === "seo" && (
            <>
              <p className="text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>Ces champs surchargent le titre, la description et l'image partagée sur Google et les réseaux sociaux. Laisser vide pour utiliser les valeurs par défaut.</p>
              <Field label="Meta title">
                <input value={seoTitle} onChange={e => setSeoTitle(e.target.value)} maxLength={70} placeholder={`${seoTitleFallback} — IPPOO KRAAFT`} className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2" />
                <div className="mt-1 flex justify-between text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>
                  <span>Idéal : 50–60 caractères</span>
                  <span className={titleLen > 60 ? "text-amber-600" : ""}>{titleLen}/70</span>
                </div>
              </Field>
              <Field label="Meta description">
                <textarea value={seoDescription} onChange={e => setSeoDescription(e.target.value)} maxLength={200} rows={3} placeholder={seoDescFallback || "Décrit l'oeuvre, sa provenance, sa technique…"} className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2 resize-y" />
                <div className="mt-1 flex justify-between text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>
                  <span>Idéal : 120–160 caractères</span>
                  <span className={descLen > 160 ? "text-amber-600" : ""}>{descLen}/200</span>
                </div>
              </Field>
              <Field label="Image Open Graph">
                <div className="space-y-2">
                  <MediaPickerButton value={seoOgImage} onChange={url => setSeoOgImage(url)} label="Choisir depuis la bibliothèque" />
                  <input value={seoOgImage} onChange={e => setSeoOgImage(e.target.value)} placeholder={seoImageFallback || "…ou collez une URL https://…"} className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2" style={{ fontSize: "13px" }} />
                </div>
                {(seoOgImage || seoImageFallback) && (
                  <div className="mt-2 aspect-[1200/630] max-w-xs rounded-lg overflow-hidden bg-[var(--ipk-surface)] border border-[var(--ipk-border)]">
                    <img src={seoOgImage || seoImageFallback} alt="Aperçu OG" className="w-full h-full object-cover" />
                  </div>
                )}
              </Field>
              <Field label="Mots-clés (séparés par virgule)">
                <input value={seoKeywords} onChange={e => setSeoKeywords(e.target.value)} placeholder="artisanat, togo, tissage…" className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2" />
              </Field>
              <div className="rounded-xl border border-[var(--ipk-border)] bg-[var(--ipk-surface)] p-3">
                <div className="text-[var(--ipk-text)] mb-1" style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase" }}>Aperçu Google</div>
                <div className="text-[#1a0dab] truncate" style={{ fontSize: "16px" }}>{seoTitle || `${seoTitleFallback} — IPPOO KRAAFT`}</div>
                <div className="text-[#006621] truncate" style={{ fontSize: "12px" }}>ippoo-kraaft.com › boutique › {slug || slugify(name)}</div>
                <div className="text-[#545454] line-clamp-2" style={{ fontSize: "13px" }}>{seoDescription || seoDescFallback || "Décrit l'oeuvre, sa provenance, sa technique…"}</div>
              </div>
            </>
          )}

          {tab === "delivery" && (
            <>
              <Field label="Zones de livraison"><input value={zones} onChange={e => setZones(e.target.value)} placeholder="Afrique de l'Ouest, France, USA" className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2" /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Délai"><input value={delay} onChange={e => setDelay(e.target.value)} placeholder="5-10 jours ouvrés" className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2" /></Field>
                <Field label="Coût"><input value={cost} onChange={e => setCost(e.target.value)} placeholder="Sur devis / 5 000 Fcfa" className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2" /></Field>
              </div>
            </>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-[var(--ipk-border)] px-5 py-3 flex justify-end gap-2">
          <Button onClick={onClose} variant="outline" className="rounded-xl h-10">Annuler</Button>
          <Button onClick={handleSave} className="bg-[var(--ipk-green-dark)] hover:bg-[var(--ipk-green-darker)] text-white rounded-xl h-10 px-4">Enregistrer</Button>
        </div>
      </div>
    </div>
  );
}

function NichesModal({ productName, category, initialNiches, fallbackNiches, onClose, onSave }: {
  productName: string;
  category: string;
  initialNiches: string[];
  fallbackNiches: string[];
  onClose: () => void;
  onSave: (niches: string[]) => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initialNiches));
  const [activeDomain, setActiveDomain] = useState<string>(CRAFT_TAXONOMY[0]?.slug || "");
  const [search, setSearch] = useState("");

  const toggle = (slug: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug); else next.add(slug);
      return next;
    });
  };

  const domain = CRAFT_TAXONOMY.find(d => d.slug === activeDomain) || CRAFT_TAXONOMY[0];
  const filteredNiches = domain.niches.filter(n => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return n.label.toLowerCase().includes(q) || (n.subNiches || []).some(s => s.label.toLowerCase().includes(q));
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-[var(--ipk-border)] px-5 py-4 flex items-center justify-between">
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--ipk-ink)" }}>Niches & taxonomie</h2>
            <p className="text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>{productName} · catégorie : {category} · <strong>{selected.size}</strong> sélectionnée{selected.size > 1 ? "s" : ""}</p>
          </div>
          <Button onClick={onClose} variant="outline" className="rounded-lg h-8 w-8 p-0" aria-label="Fermer"><X className="w-4 h-4" /></Button>
        </div>

        <div className="p-5 space-y-3" style={{ fontSize: "13px" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher dans la niche…" className="w-full border border-[var(--ipk-border)] rounded-xl px-3 py-2" />
          {selected.size === 0 && fallbackNiches.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-800" style={{ fontSize: "12px" }}>
              Aucune niche assignée → fallback automatique sur la catégorie : <strong>{fallbackNiches.map(s => nicheLabel(s)).join(", ")}</strong>
            </div>
          )}
          {selected.size > 0 && (
            <div className="flex flex-wrap gap-1">
              {Array.from(selected).map(s => (
                <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--ipk-blue)] text-white" style={{ fontSize: "11px" }}>
                  {nicheLabel(s)}
                  <button onClick={() => toggle(s)} aria-label="Retirer"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-12 gap-3 pt-2">
            <div className="col-span-12 sm:col-span-4 border border-[var(--ipk-border)] rounded-xl p-2 max-h-[340px] overflow-y-auto">
              {CRAFT_TAXONOMY.map(d => (
                <button key={d.slug} onClick={() => setActiveDomain(d.slug)} className={`w-full text-left px-3 py-2 rounded-lg ${activeDomain === d.slug ? "bg-[var(--ipk-green-dark)] text-white" : "text-[var(--ipk-ink)] hover:bg-[var(--ipk-surface)]"}`} style={{ fontSize: "12px", fontWeight: 500 }}>
                  {d.label}
                </button>
              ))}
            </div>
            <div className="col-span-12 sm:col-span-8 border border-[var(--ipk-border)] rounded-xl p-3 max-h-[340px] overflow-y-auto">
              {filteredNiches.length === 0 ? (
                <div className="text-center py-6 text-[var(--ipk-text)]" style={{ fontSize: "13px" }}>Aucune niche.</div>
              ) : filteredNiches.map(n => (
                <div key={n.slug} className="mb-3 last:mb-0">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={selected.has(n.slug)} onChange={() => toggle(n.slug)} />
                    <span className="text-[var(--ipk-ink)]" style={{ fontSize: "13px", fontWeight: 600 }}>{n.label}</span>
                  </label>
                  {n.subNiches && n.subNiches.length > 0 && (
                    <div className="ml-5 mt-1 space-y-1">
                      {n.subNiches.map(s => {
                        const slug = `${n.slug}/${s.slug}`;
                        return (
                          <label key={slug} className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={selected.has(slug)} onChange={() => toggle(slug)} />
                            <span className="text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>{s.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-[var(--ipk-border)] px-5 py-3 flex justify-between items-center gap-2">
          <Button onClick={() => setSelected(new Set())} variant="outline" className="rounded-xl h-10" disabled={selected.size === 0}>Tout effacer</Button>
          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline" className="rounded-xl h-10">Annuler</Button>
            <Button onClick={() => onSave(Array.from(selected))} className="bg-[var(--ipk-green-dark)] hover:bg-[var(--ipk-green-darker)] text-white rounded-xl h-10 px-4">Enregistrer</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StockAdjustModal({ productName, currentStock, onClose, onSave }: {
  productName: string;
  currentStock: number;
  onClose: () => void;
  onSave: (qty: number, reason: MovementReason, note: string) => void;
}) {
  const [direction, setDirection] = useState<"in" | "out">("in");
  const [qty, setQty] = useState(1);
  const [reason, setReason] = useState<MovementReason>("reception");
  const [note, setNote] = useState("");

  const signedQty = direction === "in" ? qty : -qty;
  const projected = Math.max(0, currentStock + signedQty);
  const canSave = qty > 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="border-b border-[var(--ipk-border)] px-5 py-4 flex items-center justify-between">
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--ipk-ink)" }}>Ajustement de stock</h2>
            <p className="text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>{productName} · stock actuel : <strong>{currentStock}</strong></p>
          </div>
          <Button onClick={onClose} variant="outline" className="rounded-lg h-8 w-8 p-0" aria-label="Fermer"><X className="w-4 h-4" /></Button>
        </div>
        <div className="p-5 space-y-4" style={{ fontSize: "13px" }}>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setDirection("in")} className={`py-3 rounded-xl border transition-colors ${direction === "in" ? "bg-[var(--ipk-green-dark)] text-white border-[var(--ipk-green-dark)]" : "border-[var(--ipk-border)] text-[var(--ipk-text)]"}`} style={{ fontSize: "13px", fontWeight: 600 }}>+ Entrée</button>
            <button onClick={() => setDirection("out")} className={`py-3 rounded-xl border transition-colors ${direction === "out" ? "bg-red-600 text-white border-red-600" : "border-[var(--ipk-border)] text-[var(--ipk-text)]"}`} style={{ fontSize: "13px", fontWeight: 600 }}>− Sortie</button>
          </div>
          <Field label="Quantité">
            <NumberInput value={qty} onChange={setQty} min={1} max={9999} integer className="w-32" />
          </Field>
          <Field label="Motif">
            <select value={reason} onChange={e => setReason(e.target.value as MovementReason)} className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2 bg-white">
              {(Object.keys(REASON_LABEL) as MovementReason[]).map(r => <option key={r} value={r}>{REASON_LABEL[r]}</option>)}
            </select>
          </Field>
          <Field label="Note (optionnelle)">
            <input value={note} onChange={e => setNote(e.target.value)} placeholder="N° de bon de livraison, contexte…" className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2" />
          </Field>
          <div className="bg-[var(--ipk-surface)] rounded-xl p-3 flex items-center justify-between">
            <span className="text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>Stock projeté</span>
            <span style={{ fontSize: "18px", fontWeight: 700, color: projected === 0 ? "var(--ipk-red, #DC2626)" : "var(--ipk-ink)" }}>{projected}</span>
          </div>
        </div>
        <div className="border-t border-[var(--ipk-border)] px-5 py-3 flex justify-end gap-2">
          <Button onClick={onClose} variant="outline" className="rounded-xl h-10">Annuler</Button>
          <Button onClick={() => onSave(signedQty, reason, note.trim())} disabled={!canSave} className="bg-[var(--ipk-green-dark)] hover:bg-[var(--ipk-green-darker)] text-white rounded-xl h-10 px-4 disabled:opacity-50">Enregistrer</Button>
        </div>
      </div>
    </div>
  );
}

function TagsBadgesModal({ productName, initialBadges, initialTags, onClose, onSave }: {
  productName: string;
  initialBadges: string[];
  initialTags: string[];
  onClose: () => void;
  onSave: (badges: string[], tags: string[]) => void;
}) {
  const [badges, setBadges] = useState<string[]>(initialBadges);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [newTag, setNewTag] = useState("");

  const toggleBadge = (b: string) => {
    setBadges(arr => arr.includes(b) ? arr.filter(x => x !== b) : [...arr, b]);
  };
  const addTag = () => {
    const t = newTag.trim();
    if (!t) return;
    if (tags.includes(t)) { toast.error("Tag déjà présent"); return; }
    setTags(arr => [...arr, t]);
    setNewTag("");
  };
  const removeTag = (t: string) => setTags(arr => arr.filter(x => x !== t));

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-[var(--ipk-border)] px-5 py-4 flex items-center justify-between">
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--ipk-ink)" }}>Tags & badges</h2>
            <p className="text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>{productName}</p>
          </div>
          <Button onClick={onClose} variant="outline" className="rounded-lg h-8 w-8 p-0" aria-label="Fermer"><X className="w-4 h-4" /></Button>
        </div>
        <div className="p-5 space-y-5" style={{ fontSize: "13px" }}>
          <section>
            <h3 className="mb-2 text-[var(--ipk-ink)]" style={{ fontSize: "12px", fontWeight: 600 }}>Badges éditoriaux</h3>
            <p className="mb-3 text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>Sélectionnés : {badges.length} · affichés sur les fiches produit.</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_BADGES.map(b => {
                const on = badges.includes(b);
                return (
                  <button key={b} onClick={() => toggleBadge(b)} className={`px-3 py-1.5 rounded-full border transition-colors ${on ? "bg-[var(--ipk-green-dark)] text-white border-[var(--ipk-green-dark)]" : "bg-white border-[var(--ipk-border)] text-[var(--ipk-text)]"}`} style={{ fontSize: "12px", fontWeight: 500 }}>
                    {b}
                  </button>
                );
              })}
            </div>
            {badges.filter(b => !SUGGESTED_BADGES.includes(b)).length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {badges.filter(b => !SUGGESTED_BADGES.includes(b)).map(b => (
                  <span key={b} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--ipk-green-dark)] text-white" style={{ fontSize: "11px" }}>
                    {b}
                    <button onClick={() => toggleBadge(b)} aria-label={`Retirer ${b}`}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </section>

          <section>
            <h3 className="mb-2 text-[var(--ipk-ink)]" style={{ fontSize: "12px", fontWeight: 600 }}>Tags libres</h3>
            <p className="mb-3 text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>Mots-clés internes pour la recherche et le tri (non affichés publiquement).</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {tags.length === 0 && <span className="text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>Aucun tag.</span>}
              {tags.map(t => (
                <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--ipk-surface)] text-[var(--ipk-ink)]" style={{ fontSize: "11px" }}>
                  {t}
                  <button onClick={() => removeTag(t)} aria-label={`Retirer ${t}`} className="text-[var(--ipk-text)]"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={e => e.key === "Enter" && addTag()} placeholder="ajouter un tag…" className="flex-1 border border-[var(--ipk-border)] rounded-lg px-3 py-2" style={{ fontSize: "13px" }} />
              <Button onClick={addTag} variant="outline" className="rounded-xl h-10"><Plus className="w-4 h-4 mr-1" /> Ajouter</Button>
            </div>
          </section>
        </div>
        <div className="sticky bottom-0 bg-white border-t border-[var(--ipk-border)] px-5 py-3 flex justify-end gap-2">
          <Button onClick={onClose} variant="outline" className="rounded-xl h-10">Annuler</Button>
          <Button onClick={() => onSave(badges, tags)} className="bg-[var(--ipk-green-dark)] hover:bg-[var(--ipk-green-darker)] text-white rounded-xl h-10 px-4">Enregistrer</Button>
        </div>
      </div>
    </div>
  );
}

function MediaModal({ productName, initialImages, onClose, onSave }: {
  productName: string;
  initialImages: string[];
  onClose: () => void;
  onSave: (images: string[]) => void;
}) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [newUrl, setNewUrl] = useState("");

  const move = (i: number, dir: -1 | 1) => {
    setImages(arr => {
      const next = [...arr];
      const j = i + dir;
      if (j < 0 || j >= next.length) return next;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };
  const remove = (i: number) => setImages(arr => arr.filter((_, k) => k !== i));
  const setPrimary = (i: number) => setImages(arr => {
    if (i === 0) return arr;
    const next = [...arr];
    const [item] = next.splice(i, 1);
    next.unshift(item);
    return next;
  });
  const addUrl = () => {
    const url = newUrl.trim();
    if (!url) return;
    if (images.includes(url)) { toast.error("Image déjà ajoutée"); return; }
    setImages(arr => [...arr, url]);
    setNewUrl("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-[var(--ipk-border)] px-5 py-4 flex items-center justify-between">
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--ipk-ink)" }}>Galerie média</h2>
            <p className="text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>{productName} · {images.length} image{images.length > 1 ? "s" : ""}</p>
          </div>
          <Button onClick={onClose} variant="outline" className="rounded-lg h-8 w-8 p-0" aria-label="Fermer"><X className="w-4 h-4" /></Button>
        </div>
        <div className="p-5 space-y-4" style={{ fontSize: "13px" }}>
          {images.length === 0 ? (
            <div className="text-center py-6 text-[var(--ipk-text)]">Aucune image. Ajoutez-en ci-dessous.</div>
          ) : (
            <ul className="space-y-2">
              {images.map((url, i) => (
                <li key={`${url}-${i}`} className={`flex items-center gap-3 p-2 rounded-xl border ${i === 0 ? "border-[var(--ipk-green-dark)] bg-green-50/40" : "border-[var(--ipk-border)]"}`}>
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-[var(--ipk-surface)]">
                    <img src={url} alt="" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.opacity = "0.3")} />
                  </div>
                  <div className="min-w-0 flex-1">
                    {i === 0 && <span className="inline-block px-2 py-0.5 rounded-full bg-[var(--ipk-green-dark)] text-white mb-1" style={{ fontSize: "10px", fontWeight: 600 }}>Principale</span>}
                    <div className="text-[var(--ipk-text)] truncate" style={{ fontSize: "11px", fontFamily: "monospace" }}>{url}</div>
                  </div>
                  <div className="inline-flex gap-1 shrink-0">
                    {i !== 0 && <Button onClick={() => setPrimary(i)} variant="outline" className="rounded-lg h-8 w-8 p-0" aria-label="Définir comme principale"><StarIcon className="w-3.5 h-3.5" /></Button>}
                    <Button onClick={() => move(i, -1)} variant="outline" className="rounded-lg h-8 w-8 p-0 disabled:opacity-30" disabled={i === 0} aria-label="Monter"><ArrowUp className="w-3.5 h-3.5" /></Button>
                    <Button onClick={() => move(i, 1)} variant="outline" className="rounded-lg h-8 w-8 p-0 disabled:opacity-30" disabled={i === images.length - 1} aria-label="Descendre"><ArrowDown className="w-3.5 h-3.5" /></Button>
                    <Button onClick={() => remove(i)} variant="outline" className="rounded-lg h-8 w-8 p-0 text-red-600" aria-label="Retirer"><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="bg-[var(--ipk-surface)] rounded-xl p-3 space-y-3">
            <MediaPickerButton
              onChange={(url) => {
                if (!url) return;
                if (images.includes(url)) { toast.error("Image déjà ajoutée"); return; }
                setImages(arr => [...arr, url]);
              }}
              label="Choisir depuis la bibliothèque"
            />
            <div className="flex gap-2">
              <input value={newUrl} onChange={e => setNewUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && addUrl()} placeholder="…ou collez une URL d'image" className="flex-1 border border-[var(--ipk-border)] rounded-lg px-3 py-2" style={{ fontSize: "13px" }} />
              <Button onClick={addUrl} variant="outline" className="rounded-xl h-10"><Plus className="w-4 h-4 mr-1" /> Ajouter</Button>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 bg-white border-t border-[var(--ipk-border)] px-5 py-3 flex justify-end gap-2">
          <Button onClick={onClose} variant="outline" className="rounded-xl h-10">Annuler</Button>
          <Button onClick={() => onSave(images)} disabled={images.length === 0} className="bg-[var(--ipk-green-dark)] hover:bg-[var(--ipk-green-darker)] text-white rounded-xl h-10 px-4 disabled:opacity-50">Enregistrer</Button>
        </div>
      </div>
    </div>
  );
}

function VariantsModal({ productName, initialVariants, initialThreshold, basePrice, onClose, onSave }: {
  productName: string;
  initialVariants: Variant[];
  initialThreshold: number;
  basePrice: number;
  onClose: () => void;
  onSave: (variants: Variant[], threshold: number) => void;
}) {
  const [variants, setVariants] = useState<Variant[]>(initialVariants);
  const [threshold, setThreshold] = useState(initialThreshold);

  const addVariant = () => {
    setVariants(v => [...v, { id: `var-${Date.now().toString(36)}-${v.length}`, label: "", priceDelta: 0, stock: 0, sku: "" }]);
  };
  const updateVariant = (id: string, patch: Partial<Variant>) => {
    setVariants(v => v.map(x => (x.id === id ? { ...x, ...patch } : x)));
  };
  const removeVariant = (id: string) => {
    setVariants(v => v.filter(x => x.id !== id));
  };

  const totalStock = variants.reduce((s, v) => s + v.stock, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-[var(--ipk-border)] px-5 py-4 flex items-center justify-between">
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--ipk-ink)" }}>Variantes & inventaire</h2>
            <p className="text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>{productName}</p>
          </div>
          <Button onClick={onClose} variant="outline" className="rounded-lg h-8 w-8 p-0" aria-label="Fermer"><X className="w-4 h-4" /></Button>
        </div>
        <div className="p-5 space-y-4" style={{ fontSize: "13px" }}>
          <div className="bg-[var(--ipk-surface)] rounded-xl p-3 flex items-center gap-3 flex-wrap">
            <label className="flex items-center gap-2">
              <span className="text-[var(--ipk-ink)]" style={{ fontSize: "12px", fontWeight: 500 }}>Seuil de stock bas</span>
              <NumberInput value={threshold} onChange={setThreshold} min={0} max={9999} integer className="w-20" />
            </label>
            <span className="text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>· Prix de base : {basePrice} Fcfa</span>
            {variants.length > 0 && <span className="text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>· Stock total : <strong>{totalStock}</strong></span>}
          </div>

          {variants.length === 0 ? (
            <div className="text-center py-6 text-[var(--ipk-text)]" style={{ fontSize: "13px" }}>
              Aucune variante. Le produit utilise son stock principal.
            </div>
          ) : (
            <div className="space-y-2">
              {variants.map(v => (
                <div key={v.id} className="grid grid-cols-12 gap-2 items-end p-3 border border-[var(--ipk-border)] rounded-xl">
                  <div className="col-span-12 sm:col-span-4">
                    <span className="block mb-1 text-[var(--ipk-ink)]" style={{ fontSize: "11px", fontWeight: 500 }}>Libellé</span>
                    <input value={v.label} onChange={e => updateVariant(v.id, { label: e.target.value })} placeholder="Taille M / Bleu" className="w-full border border-[var(--ipk-border)] rounded-lg px-2 py-1" />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <span className="block mb-1 text-[var(--ipk-ink)]" style={{ fontSize: "11px", fontWeight: 500 }}>SKU</span>
                    <input value={v.sku || ""} onChange={e => updateVariant(v.id, { sku: e.target.value })} placeholder="SKU-001" className="w-full border border-[var(--ipk-border)] rounded-lg px-2 py-1 font-mono" style={{ fontSize: "11px" }} />
                  </div>
                  <div className="col-span-3 sm:col-span-2">
                    <span className="block mb-1 text-[var(--ipk-ink)]" style={{ fontSize: "11px", fontWeight: 500 }}>Δ Prix</span>
                    <NumberInput value={v.priceDelta} onChange={n => updateVariant(v.id, { priceDelta: n })} className="w-full" />
                  </div>
                  <div className="col-span-2 sm:col-span-2">
                    <span className="block mb-1 text-[var(--ipk-ink)]" style={{ fontSize: "11px", fontWeight: 500 }}>Stock</span>
                    <NumberInput value={v.stock} onChange={n => updateVariant(v.id, { stock: n })} min={0} integer className="w-full" />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Button onClick={() => removeVariant(v.id)} variant="outline" className="rounded-lg h-8 w-8 p-0 text-red-600" aria-label="Supprimer variante"><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button onClick={addVariant} variant="outline" className="rounded-xl h-10 w-full"><Plus className="w-4 h-4 mr-1" /> Ajouter une variante</Button>
        </div>
        <div className="sticky bottom-0 bg-white border-t border-[var(--ipk-border)] px-5 py-3 flex justify-end gap-2">
          <Button onClick={onClose} variant="outline" className="rounded-xl h-10">Annuler</Button>
          <Button onClick={() => onSave(variants.filter(v => v.label.trim()), threshold)} className="bg-[var(--ipk-green-dark)] hover:bg-[var(--ipk-green-darker)] text-white rounded-xl h-10 px-4">Enregistrer</Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block mb-1 text-[var(--ipk-ink)]" style={{ fontSize: "12px", fontWeight: 500 }}>{label}</span>
      {children}
    </label>
  );
}
