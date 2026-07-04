import { useMemo, useState } from "react";
import { Edit3, Trash2, Save, X, Eye, Download } from "lucide-react";
import { Link } from "react-router";
import { events as seedEvents, blogArticles as seedBlog, groupBuyingOffers as seedGB, formatPrice } from "../../data/mock-data";
import { useLocalState } from "../../hooks/use-admin-data";
import { useSeo } from "../../hooks/use-seo";
import { PageHeader, AddButton, DataCard, SearchInput, StatusPill, EmptyRow, NumberInput, SortHeader, useSortable, usePagination, Pagination, useBulkSelection, BulkBar, SelectCheckbox } from "./admin-shared";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useConfirm } from "../../hooks/use-confirm";
import { logAudit } from "../../hooks/use-admin-audit";
import { useAdmin } from "../../hooks/use-admin";
import { exportCSV } from "../../utils/export-utils";
import { useEntityCrud } from "../../hooks/use-entity-crud";

// ============= EVENTS =============
interface EventOverride { ticketPrice?: number; spotsLeft?: number; date?: string; published?: boolean; }

export function AdminEventsPage() {
  useSeo({ title: "Admin - Événements", noIndex: true });
  const { session } = useAdmin();
  const confirm = useConfirm();
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState({ ticketPrice: 0, spotsLeft: 0, date: "", published: true });

  const crud = useEntityCrud<typeof seedEvents[number], EventOverride>({
    overridesKey: "ipk:admin:eventOverrides:v1",
    removedKey: "ipk:admin:eventRemoved:v1",
    seed: seedEvents,
    entityName: "event",
    actor: session?.username || "system",
    searchableFields: ["title", "location"],
  });

  const merged = crud.merged.map(e => ({ ...e, published: e.published ?? true }));
  const filtered = merged.filter(e => !search.trim() || e.title.toLowerCase().includes(search.toLowerCase()) || e.location.toLowerCase().includes(search.toLowerCase()));

  type EventSortKey = "title" | "location" | "date" | "ticketPrice" | "spotsLeft" | "published";
  const { sorted, sort, onSort } = useSortable<typeof filtered[number], EventSortKey>(filtered, (item, key) => item[key] as any, { key: "date", dir: "desc" });
  const { page, pageCount, total: pageTotal, slice, setPage } = usePagination(sorted, 20);
  const bulk = useBulkSelection(slice);

  const startEdit = (e: typeof merged[number]) => { crud.startEdit(e.id); setDraft({ ticketPrice: e.ticketPrice, spotsLeft: e.spotsLeft, date: e.date.slice(0, 10), published: e.published }); };
  const save = (id: string) => { crud.save(id, draft); toast.success("Événement mis à jour"); };
  const remove = async (id: string, title: string) => {
    if (!await confirm({ title: "Archiver l'événement", message: `« ${title} » sera retiré du site. Vous pourrez le restaurer.`, tone: "danger", confirmLabel: "Archiver" })) return;
    crud.remove(id, title);
    toast.success("Événement archivé");
  };
  const bulkArchive = async () => {
    if (!await confirm({ title: "Archiver la sélection", message: `${bulk.count} événement(s) seront archivés.`, tone: "danger", confirmLabel: "Archiver" })) return;
    crud.bulkRemove(bulk.selectedItems.map(e => e.id));
    const n = bulk.count;
    bulk.clear();
    toast.success(`${n} événement(s) archivé(s)`);
  };
  const bulkPublish = (publish: boolean) => {
    const ids = bulk.selectedItems.map(e => e.id);
    crud.bulkUpdate(ids, { published: publish }, publish ? "publié" : "dépublié");
    bulk.clear();
    toast.success(`${ids.length} événement(s) ${publish ? "publié" : "dépublié"}(s)`);
  };
  const exportData = () => exportCSV(`evenements-${new Date().toISOString().slice(0, 10)}.csv`, sorted.map(e => ({
    titre: e.title, lieu: e.location, date: e.date, prix: e.ticketPrice, places: e.spotsLeft, publie: e.published ? "oui" : "non",
  })));

  return (
    <div>
      <PageHeader title="Événements" subtitle={`${merged.length} événements - ${crud.removedCount} archivés`} action={
        <div className="flex gap-2">
          <Button onClick={exportData} variant="outline" className="rounded-xl h-10"><Download className="w-4 h-4 mr-1" /> CSV</Button>
          <AddButton onClick={() => toast.info("Création événement", { description: "Édition inline disponible." })} label="Nouvel événement" />
        </div>
      } />
      <DataCard className="mb-4"><SearchInput value={search} onChange={setSearch} placeholder="Titre, lieu…" /></DataCard>
      {bulk.count > 0 && (
        <BulkBar count={bulk.count} onClear={bulk.clear}>
          <Button onClick={() => bulkPublish(true)} variant="outline" className="rounded-lg h-9" style={{ fontSize: "12px" }}>Publier</Button>
          <Button onClick={() => bulkPublish(false)} variant="outline" className="rounded-lg h-9" style={{ fontSize: "12px" }}>Dépublier</Button>
          <Button onClick={bulkArchive} variant="outline" className="rounded-lg h-9 text-red-600" style={{ fontSize: "12px" }}>Archiver</Button>
        </BulkBar>
      )}
      <DataCard>
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full" style={{ fontSize: "13px" }}>
            <thead className="text-[var(--ipk-text)] border-b border-[var(--ipk-border)]">
              <tr>
                <th className="py-2 w-8"><SelectCheckbox checked={bulk.allSelected} indeterminate={bulk.someSelected && !bulk.allSelected} onChange={bulk.toggleAll} ariaLabel="Tout sélectionner" /></th>
                <th className="text-left py-2 font-medium"><SortHeader label="Titre" sortKey="title" state={sort} onSort={onSort} /></th>
                <th className="text-left py-2 font-medium hidden md:table-cell"><SortHeader label="Lieu" sortKey="location" state={sort} onSort={onSort} /></th>
                <th className="text-left py-2 font-medium"><SortHeader label="Date" sortKey="date" state={sort} onSort={onSort} /></th>
                <th className="text-right py-2 font-medium"><SortHeader label="Prix" sortKey="ticketPrice" state={sort} onSort={onSort} align="right" /></th>
                <th className="text-right py-2 font-medium"><SortHeader label="Places" sortKey="spotsLeft" state={sort} onSort={onSort} align="right" /></th>
                <th className="text-left py-2 font-medium"><SortHeader label="Statut" sortKey="published" state={sort} onSort={onSort} /></th>
                <th className="text-right py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {slice.length === 0 ? (
                <tr><td colSpan={8}><EmptyRow message="Aucun événement." /></td></tr>
              ) : slice.map(e => {
                const isEditing = crud.editing === e.id;
                return (
                  <tr key={e.id} className="border-b border-[var(--ipk-border)] last:border-0">
                    <td className="py-3 pr-2"><SelectCheckbox checked={bulk.selected.has(e.id)} onChange={() => bulk.toggle(e.id)} ariaLabel={`Sélectionner ${e.title}`} /></td>
                    <td className="py-3 pr-2 font-medium text-[var(--ipk-ink)] truncate max-w-[200px]">{e.title}</td>
                    <td className="py-3 pr-2 hidden md:table-cell text-[var(--ipk-text)] truncate max-w-[160px]">{e.location}</td>
                    <td className="py-3 pr-2">
                      {isEditing ? <input type="date" value={draft.date} onChange={ev => setDraft(d => ({ ...d, date: ev.target.value }))} className="border border-[var(--ipk-border)] rounded-lg px-2 py-1" /> : <span className="text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>{new Date(e.date).toLocaleDateString("fr-FR")}</span>}
                    </td>
                    <td className="py-3 pr-2 text-right">
                      {isEditing ? <NumberInput value={draft.ticketPrice} onChange={v => setDraft(d => ({ ...d, ticketPrice: v }))} min={0} integer className="w-24 text-right" /> : <span style={{ fontWeight: 600 }}>{e.ticketPrice === 0 ? "Gratuit" : formatPrice(e.ticketPrice)}</span>}
                    </td>
                    <td className="py-3 pr-2 text-right">
                      {isEditing ? <NumberInput value={draft.spotsLeft} onChange={v => setDraft(d => ({ ...d, spotsLeft: v }))} min={0} integer className="w-16 text-right" /> : <StatusPill status={String(e.spotsLeft)} tone={e.spotsLeft === 0 ? "danger" : e.spotsLeft <= 5 ? "warn" : "success"} />}
                    </td>
                    <td className="py-3 pr-2">
                      {isEditing ? (
                        <select value={String(draft.published)} onChange={ev => setDraft(d => ({ ...d, published: ev.target.value === "true" }))} className="border border-[var(--ipk-border)] rounded-lg px-2 py-1"><option value="true">Publié</option><option value="false">Brouillon</option></select>
                      ) : <StatusPill status={e.published ? "Publié" : "Brouillon"} tone={e.published ? "success" : "warn"} />}
                    </td>
                    <td className="py-3 text-right whitespace-nowrap">
                      {isEditing ? (
                        <div className="inline-flex gap-1">
                          <Button onClick={() => save(e.id)} className="bg-[var(--ipk-green-dark)] text-white rounded-lg h-8 w-8 p-0" aria-label="Enregistrer"><Save className="w-3.5 h-3.5" /></Button>
                          <Button onClick={crud.cancelEdit} variant="outline" className="rounded-lg h-8 w-8 p-0" aria-label="Annuler"><X className="w-3.5 h-3.5" /></Button>
                        </div>
                      ) : (
                        <div className="inline-flex gap-1">
                          <Link to={`/evenements/${e.slug}`} target="_blank" rel="noreferrer" aria-label="Voir" className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-[var(--ipk-border)] text-[var(--ipk-text)] hover:text-[var(--ipk-blue)]"><Eye className="w-3.5 h-3.5" /></Link>
                          <Button onClick={() => startEdit(e)} variant="outline" className="rounded-lg h-8 w-8 p-0" aria-label="Modifier"><Edit3 className="w-3.5 h-3.5" /></Button>
                          <Button onClick={() => remove(e.id, e.title)} variant="outline" className="rounded-lg h-8 w-8 p-0 text-red-600" aria-label="Archiver"><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination page={page} pageCount={pageCount} total={pageTotal} pageSize={20} onChange={setPage} />
      </DataCard>
      {crud.removedCount > 0 && (
        <DataCard className="mt-4"><div className="flex items-center justify-between"><span className="text-[var(--ipk-text)]" style={{ fontSize: "13px" }}>{crud.removedCount} archivé{crud.removedCount > 1 ? "s" : ""}</span><Button onClick={() => { crud.restoreAll(); toast.success("Restauration effectuée"); }} variant="outline" className="rounded-xl h-9">Tout restaurer</Button></div></DataCard>
      )}
    </div>
  );
}

// ============= BLOG =============
interface BlogOverride { published?: boolean; category?: string; }

export function AdminBlogPage() {
  useSeo({ title: "Admin - Blog", noIndex: true });
  const { session } = useAdmin();
  const confirm = useConfirm();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  const crud = useEntityCrud<typeof seedBlog[number], BlogOverride>({
    overridesKey: "ipk:admin:blogOverrides:v1",
    removedKey: "ipk:admin:blogRemoved:v1",
    seed: seedBlog,
    entityName: "blog",
    actor: session?.username || "system",
    searchableFields: ["title", "author", "category"],
  });

  const merged = crud.merged.map(b => ({ ...b, published: b.published ?? true }));
  const filtered = merged.filter(b => {
    if (filter === "published" && !b.published) return false;
    if (filter === "draft" && b.published) return false;
    if (search.trim()) { const q = search.toLowerCase(); return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.category.toLowerCase().includes(q); }
    return true;
  });

  type BlogSortKey = "title" | "author" | "category" | "date" | "published";
  const { sorted, sort, onSort } = useSortable<typeof filtered[number], BlogSortKey>(filtered, (item, key) => item[key] as any, { key: "date", dir: "desc" });
  const { page, pageCount, total: pageTotal, slice, setPage } = usePagination(sorted, 20);
  const bulk = useBulkSelection(slice);

  const togglePublish = (b: typeof merged[number]) => {
    crud.save(b.id, { published: !b.published }, b.published ? "dépublié" : "publié");
    toast.success("Statut mis à jour");
  };
  const remove = async (id: string, title: string) => {
    if (!await confirm({ title: "Archiver l'article", message: `« ${title} » sera retiré du blog.`, tone: "danger", confirmLabel: "Archiver" })) return;
    crud.remove(id, title);
    toast.success("Article archivé");
  };
  const bulkPublish = (publish: boolean) => {
    const ids = bulk.selectedItems.map(b => b.id);
    crud.bulkUpdate(ids, { published: publish }, publish ? "publié" : "dépublié");
    bulk.clear();
    toast.success(`${ids.length} article(s) ${publish ? "publié" : "dépublié"}(s)`);
  };
  const bulkArchive = async () => {
    if (!await confirm({ title: "Archiver la sélection", message: `${bulk.count} article(s) seront archivés.`, tone: "danger", confirmLabel: "Archiver" })) return;
    const ids = bulk.selectedItems.map(b => b.id);
    crud.bulkRemove(ids);
    bulk.clear();
    toast.success(`${ids.length} article(s) archivé(s)`);
  };
  const exportData = () => exportCSV(`blog-${new Date().toISOString().slice(0, 10)}.csv`, sorted.map(b => ({
    titre: b.title, auteur: b.author, categorie: b.category, date: b.date, publie: b.published ? "oui" : "non",
  })));

  const counts = { all: merged.length, published: merged.filter(b => b.published).length, draft: merged.filter(b => !b.published).length };

  return (
    <div>
      <PageHeader title="Blog" subtitle={`${merged.length} articles - ${crud.removedCount} archivés`} action={
        <div className="flex gap-2">
          <Button onClick={exportData} variant="outline" className="rounded-xl h-10"><Download className="w-4 h-4 mr-1" /> CSV</Button>
          <AddButton onClick={() => toast.info("Création article", { description: "Édition inline disponible." })} label="Nouvel article" />
        </div>
      } />
      <DataCard className="mb-4">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <SearchInput value={search} onChange={setSearch} placeholder="Titre, auteur, catégorie…" />
          <div className="flex gap-1">
            {(["all", "published", "draft"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full ${filter === f ? "bg-[var(--ipk-green-dark)] text-white" : "bg-[var(--ipk-surface)] text-[var(--ipk-text)]"}`} style={{ fontSize: "12px", fontWeight: 500 }}>
                {f === "all" ? "Tous" : f === "published" ? "Publiés" : "Brouillons"} ({counts[f]})
              </button>
            ))}
          </div>
        </div>
      </DataCard>
      {bulk.count > 0 && (
        <BulkBar count={bulk.count} onClear={bulk.clear}>
          <Button onClick={() => bulkPublish(true)} variant="outline" className="rounded-lg h-9" style={{ fontSize: "12px" }}>Publier</Button>
          <Button onClick={() => bulkPublish(false)} variant="outline" className="rounded-lg h-9" style={{ fontSize: "12px" }}>Dépublier</Button>
          <Button onClick={bulkArchive} variant="outline" className="rounded-lg h-9 text-red-600" style={{ fontSize: "12px" }}>Archiver</Button>
        </BulkBar>
      )}
      <DataCard>
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full" style={{ fontSize: "13px" }}>
            <thead className="text-[var(--ipk-text)] border-b border-[var(--ipk-border)]">
              <tr>
                <th className="py-2 w-8"><SelectCheckbox checked={bulk.allSelected} indeterminate={bulk.someSelected && !bulk.allSelected} onChange={bulk.toggleAll} ariaLabel="Tout sélectionner" /></th>
                <th className="text-left py-2 font-medium"><SortHeader label="Titre" sortKey="title" state={sort} onSort={onSort} /></th>
                <th className="text-left py-2 font-medium hidden sm:table-cell"><SortHeader label="Auteur" sortKey="author" state={sort} onSort={onSort} /></th>
                <th className="text-left py-2 font-medium hidden md:table-cell"><SortHeader label="Catégorie" sortKey="category" state={sort} onSort={onSort} /></th>
                <th className="text-left py-2 font-medium"><SortHeader label="Date" sortKey="date" state={sort} onSort={onSort} /></th>
                <th className="text-left py-2 font-medium"><SortHeader label="Statut" sortKey="published" state={sort} onSort={onSort} /></th>
                <th className="text-right py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {slice.length === 0 ? (
                <tr><td colSpan={7}><EmptyRow message="Aucun article." /></td></tr>
              ) : slice.map(b => (
                <tr key={b.id} className="border-b border-[var(--ipk-border)] last:border-0">
                  <td className="py-3 pr-2"><SelectCheckbox checked={bulk.selected.has(b.id)} onChange={() => bulk.toggle(b.id)} ariaLabel={`Sélectionner ${b.title}`} /></td>
                  <td className="py-3 pr-2 font-medium text-[var(--ipk-ink)] truncate max-w-[240px]">{b.title}</td>
                  <td className="py-3 pr-2 hidden sm:table-cell text-[var(--ipk-text)]">{b.author}</td>
                  <td className="py-3 pr-2 hidden md:table-cell text-[var(--ipk-text)]">{b.category}</td>
                  <td className="py-3 pr-2 text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>{new Date(b.date).toLocaleDateString("fr-FR")}</td>
                  <td className="py-3 pr-2"><StatusPill status={b.published ? "Publié" : "Brouillon"} tone={b.published ? "success" : "warn"} /></td>
                  <td className="py-3 text-right whitespace-nowrap">
                    <div className="inline-flex gap-1">
                      <Link to={`/blog/${b.slug}`} target="_blank" rel="noreferrer" aria-label="Voir" className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-[var(--ipk-border)] text-[var(--ipk-text)] hover:text-[var(--ipk-blue)]"><Eye className="w-3.5 h-3.5" /></Link>
                      <Button onClick={() => togglePublish(b)} variant="outline" className="rounded-lg h-8 px-3" style={{ fontSize: "11px" }}>{b.published ? "Dépublier" : "Publier"}</Button>
                      <Button onClick={() => remove(b.id, b.title)} variant="outline" className="rounded-lg h-8 w-8 p-0 text-red-600" aria-label="Archiver"><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} pageCount={pageCount} total={pageTotal} pageSize={20} onChange={setPage} />
      </DataCard>
      {crud.removedCount > 0 && (
        <DataCard className="mt-4"><div className="flex items-center justify-between"><span className="text-[var(--ipk-text)]" style={{ fontSize: "13px" }}>{crud.removedCount} archivé{crud.removedCount > 1 ? "s" : ""}</span><Button onClick={() => { crud.restoreAll(); toast.success("Restauration effectuée"); }} variant="outline" className="rounded-xl h-9">Tout restaurer</Button></div></DataCard>
      )}
    </div>
  );
}

// ============= GROUP BUYING =============
interface GBOverride { currentParticipants?: number; deadline?: string; status?: "active" | "closing_soon" | "completed" | "upcoming"; }
const GB_STATUS: Record<NonNullable<GBOverride["status"]>, { label: string; tone: "success" | "warn" | "danger" | "neutral" }> = {
  active: { label: "Active", tone: "success" },
  closing_soon: { label: "Bientôt clos", tone: "warn" },
  completed: { label: "Clôturée", tone: "neutral" },
  upcoming: { label: "À venir", tone: "neutral" },
};

export function AdminGroupBuyingPage() {
  useSeo({ title: "Admin - Achats groupés", noIndex: true });
  const { session } = useAdmin();
  const confirm = useConfirm();
  const crud = useEntityCrud<typeof seedGB[number], GBOverride>({
    overridesKey: "ipk:admin:groupBuyingOverrides:v1",
    removedKey: "ipk:admin:groupBuyingRemoved:v1",
    seed: seedGB,
    entityName: "groupbuy",
    actor: session?.username || "system",
    searchableFields: ["title", "category"],
  });
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState<{ currentParticipants: number; deadline: string; status: NonNullable<GBOverride["status"]> }>({ currentParticipants: 0, deadline: "", status: "active" });

  const merged = crud.merged.map(o => ({
    ...o,
    currentParticipants: o.currentParticipants ?? 0,
    deadline: o.deadline ?? "",
    status: (o.status ?? "active") as NonNullable<GBOverride["status"]>,
  }));

  const filtered = crud.filter(search).map(o => ({
    ...o,
    currentParticipants: o.currentParticipants ?? 0,
    deadline: o.deadline ?? "",
    status: (o.status ?? "active") as NonNullable<GBOverride["status"]>,
  }));

  type GBSortKey = "title" | "category" | "currentParticipants" | "deadline" | "status";
  const { sorted, sort, onSort } = useSortable<typeof filtered[number], GBSortKey>(filtered, (item, key) => item[key] as any, { key: "deadline", dir: "asc" });
  const { page, pageCount, total: pageTotal, slice, setPage } = usePagination(sorted, 20);
  const bulk = useBulkSelection(slice);

  const startEdit = (o: typeof merged[number]) => { crud.startEdit(o.id); setDraft({ currentParticipants: o.currentParticipants, deadline: o.deadline.slice(0, 10), status: o.status }); };
  const save = (id: string) => {
    crud.save(id, draft);
    toast.success("Offre mise à jour");
  };
  const remove = async (id: string, title: string) => {
    if (!await confirm({ title: "Archiver l'offre", message: `« ${title} » sera retirée du site.`, tone: "danger", confirmLabel: "Archiver" })) return;
    crud.remove(id, title);
    toast.success("Offre archivée");
  };
  const bulkArchive = async () => {
    if (!await confirm({ title: "Archiver la sélection", message: `${bulk.count} offre(s) seront archivées.`, tone: "danger", confirmLabel: "Archiver" })) return;
    const ids = bulk.selectedItems.map(o => o.id);
    crud.bulkRemove(ids);
    bulk.clear();
    toast.success(`${ids.length} offre(s) archivée(s)`);
  };
  const bulkSetStatus = (status: NonNullable<GBOverride["status"]>) => {
    const ids = bulk.selectedItems.map(o => o.id);
    crud.bulkUpdate(ids, { status }, GB_STATUS[status].label);
    bulk.clear();
    toast.success(`${ids.length} offre(s) → ${GB_STATUS[status].label}`);
  };
  const exportData = () => exportCSV(`achats-groupes-${new Date().toISOString().slice(0, 10)}.csv`, sorted.map(o => ({
    titre: o.title, categorie: o.category, participants: o.currentParticipants, max: o.maxParticipants, echeance: o.deadline, statut: GB_STATUS[o.status].label,
  })));

  return (
    <div>
      <PageHeader title="Achats groupés" subtitle={`${merged.length} offres - ${crud.removedCount} archivées`} action={
        <div className="flex gap-2">
          <Button onClick={exportData} variant="outline" className="rounded-xl h-10"><Download className="w-4 h-4 mr-1" /> CSV</Button>
          <AddButton onClick={() => toast.info("Création offre", { description: "Édition inline disponible." })} label="Nouvelle offre" />
        </div>
      } />
      <DataCard className="mb-4"><SearchInput value={search} onChange={setSearch} placeholder="Titre, catégorie…" /></DataCard>
      {bulk.count > 0 && (
        <BulkBar count={bulk.count} onClear={bulk.clear}>
          <Button onClick={() => bulkSetStatus("active")} variant="outline" className="rounded-lg h-9" style={{ fontSize: "12px" }}>Activer</Button>
          <Button onClick={() => bulkSetStatus("completed")} variant="outline" className="rounded-lg h-9" style={{ fontSize: "12px" }}>Clôturer</Button>
          <Button onClick={bulkArchive} variant="outline" className="rounded-lg h-9 text-red-600" style={{ fontSize: "12px" }}>Archiver</Button>
        </BulkBar>
      )}
      <DataCard>
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full" style={{ fontSize: "13px" }}>
            <thead className="text-[var(--ipk-text)] border-b border-[var(--ipk-border)]">
              <tr>
                <th className="py-2 w-8"><SelectCheckbox checked={bulk.allSelected} indeterminate={bulk.someSelected && !bulk.allSelected} onChange={bulk.toggleAll} ariaLabel="Tout sélectionner" /></th>
                <th className="text-left py-2 font-medium"><SortHeader label="Titre" sortKey="title" state={sort} onSort={onSort} /></th>
                <th className="text-left py-2 font-medium hidden md:table-cell"><SortHeader label="Catégorie" sortKey="category" state={sort} onSort={onSort} /></th>
                <th className="text-right py-2 font-medium"><SortHeader label="Participants" sortKey="currentParticipants" state={sort} onSort={onSort} align="right" /></th>
                <th className="text-left py-2 font-medium"><SortHeader label="Échéance" sortKey="deadline" state={sort} onSort={onSort} /></th>
                <th className="text-left py-2 font-medium"><SortHeader label="Statut" sortKey="status" state={sort} onSort={onSort} /></th>
                <th className="text-right py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {slice.length === 0 ? (
                <tr><td colSpan={7}><EmptyRow message="Aucune offre." /></td></tr>
              ) : slice.map(o => {
                const isEditing = crud.editing === o.id;
                return (
                  <tr key={o.id} className="border-b border-[var(--ipk-border)] last:border-0">
                    <td className="py-3 pr-2"><SelectCheckbox checked={bulk.selected.has(o.id)} onChange={() => bulk.toggle(o.id)} ariaLabel={`Sélectionner ${o.title}`} /></td>
                    <td className="py-3 pr-2 font-medium text-[var(--ipk-ink)] truncate max-w-[220px]">{o.title}</td>
                    <td className="py-3 pr-2 hidden md:table-cell text-[var(--ipk-text)]">{o.category}</td>
                    <td className="py-3 pr-2 text-right">
                      {isEditing ? <NumberInput value={draft.currentParticipants} onChange={v => setDraft(d => ({ ...d, currentParticipants: v }))} min={0} integer className="w-16 text-right" /> : <span style={{ fontWeight: 600 }}>{o.currentParticipants}/{o.maxParticipants}</span>}
                    </td>
                    <td className="py-3 pr-2">
                      {isEditing ? <input type="date" value={draft.deadline} onChange={ev => setDraft(d => ({ ...d, deadline: ev.target.value }))} className="border border-[var(--ipk-border)] rounded-lg px-2 py-1" /> : <span className="text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>{new Date(o.deadline).toLocaleDateString("fr-FR")}</span>}
                    </td>
                    <td className="py-3 pr-2">
                      {isEditing ? (
                        <select value={draft.status} onChange={ev => setDraft(d => ({ ...d, status: ev.target.value as NonNullable<GBOverride["status"]> }))} className="border border-[var(--ipk-border)] rounded-lg px-2 py-1">
                          {(Object.keys(GB_STATUS) as NonNullable<GBOverride["status"]>[]).map(s => <option key={s} value={s}>{GB_STATUS[s].label}</option>)}
                        </select>
                      ) : <StatusPill status={GB_STATUS[o.status].label} tone={GB_STATUS[o.status].tone} />}
                    </td>
                    <td className="py-3 text-right whitespace-nowrap">
                      {isEditing ? (
                        <div className="inline-flex gap-1">
                          <Button onClick={() => save(o.id)} className="bg-[var(--ipk-green-dark)] text-white rounded-lg h-8 w-8 p-0" aria-label="Enregistrer"><Save className="w-3.5 h-3.5" /></Button>
                          <Button onClick={crud.cancelEdit} variant="outline" className="rounded-lg h-8 w-8 p-0" aria-label="Annuler"><X className="w-3.5 h-3.5" /></Button>
                        </div>
                      ) : (
                        <div className="inline-flex gap-1">
                          <Link to={`/achats-groupes/${o.slug}`} target="_blank" rel="noreferrer" aria-label="Voir" className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-[var(--ipk-border)] text-[var(--ipk-text)] hover:text-[var(--ipk-blue)]"><Eye className="w-3.5 h-3.5" /></Link>
                          <Button onClick={() => startEdit(o)} variant="outline" className="rounded-lg h-8 w-8 p-0" aria-label="Modifier"><Edit3 className="w-3.5 h-3.5" /></Button>
                          <Button onClick={() => remove(o.id, o.title)} variant="outline" className="rounded-lg h-8 w-8 p-0 text-red-600" aria-label="Archiver"><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination page={page} pageCount={pageCount} total={pageTotal} pageSize={20} onChange={setPage} />
      </DataCard>
      {crud.removedCount > 0 && (
        <DataCard className="mt-4"><div className="flex items-center justify-between"><span className="text-[var(--ipk-text)]" style={{ fontSize: "13px" }}>{crud.removedCount} archivée{crud.removedCount > 1 ? "s" : ""}</span><Button onClick={() => { crud.restoreAll(); toast.success("Restauration effectuée"); }} variant="outline" className="rounded-xl h-9">Tout restaurer</Button></div></DataCard>
      )}
    </div>
  );
}
