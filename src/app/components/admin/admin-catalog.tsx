import { useMemo, useState } from "react";
import { Link } from "react-router";
import { Eye, Edit3, Save, X, Trash2, Download, Star } from "lucide-react";
import {
  artisans, groupements, formations, formatPrice,
  type Artisan, type Groupement, type Formation
} from "../../data/mock-data";
import { useLocalState } from "../../hooks/use-admin-data";
import { useEntityCrud } from "../../hooks/use-entity-crud";
import { useSeo } from "../../hooks/use-seo";
import { PageHeader, AddButton, DataCard, SearchInput, StatusPill, EmptyRow, NumberInput, SortHeader, useSortable, usePagination, Pagination, useBulkSelection, BulkBar, SelectCheckbox } from "./admin-shared";
import { Button } from "../ui/button";
import { LazyImage } from "../lazy-image";
import { toast } from "sonner";
import { useConfirm } from "../../hooks/use-confirm";
import { logAudit, previewArtisanCascade } from "../../hooks/use-admin-audit";
import { useAdmin } from "../../hooks/use-admin";
import { exportCSV } from "../../utils/export-utils";

// ===== ARTISANS =====
export function AdminArtisansPage() {
  useSeo({ title: "Admin - Artisans", noIndex: true });
  const { session } = useAdmin();
  const confirm = useConfirm();
  const [pending, setPending] = useLocalState<{ name: string; email: string; craft: string; date: string }[]>("ipk:admin:artisanCandidates:v1", [
    { name: "Akossiwa Adjovi", email: "akossiwa@example.com", craft: "Poterie", date: new Date(Date.now() - 86400000 * 2).toISOString() },
    { name: "Boukary Sanou", email: "boukary@example.com", craft: "Sculpture", date: new Date(Date.now() - 86400000 * 5).toISOString() },
  ]);
  const [search, setSearch] = useState("");
  const [removed, setRemoved] = useLocalState<string[]>("ipk:admin:artisanRemoved:v1", []);

  const list = artisans.filter(a => !removed.includes(a.id) && (search.trim() === "" || a.name.toLowerCase().includes(search.toLowerCase()) || a.specialty.toLowerCase().includes(search.toLowerCase()) || a.country.toLowerCase().includes(search.toLowerCase())));

  return (
    <div>
      <PageHeader title="Artisans" subtitle={`${artisans.length - removed.length} artisans actifs - ${pending.length} candidatures en attente`} />

      {pending.length > 0 && (
        <DataCard className="mb-4 border-amber-200 bg-amber-50/40">
          <h3 className="mb-3" style={{ fontSize: "14px", fontWeight: 600, color: "var(--ipk-ink)" }}>Candidatures à valider</h3>
          <ul className="space-y-2">
            {pending.map((c, i) => (
              <li key={i} className="flex items-center gap-3 flex-wrap p-3 bg-white rounded-xl">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[var(--ipk-ink)] truncate">{c.name}</div>
                  <div className="text-[var(--ipk-text)] truncate" style={{ fontSize: "12px" }}>{c.email} • {c.craft}</div>
                </div>
                <Button onClick={() => { setPending(p => p.filter((_, j) => j !== i)); logAudit({ actor: session?.username || "system", action: "approve", entity: "artisan", details: c.name }); toast.success(`${c.name} validé(e)`); }} className="bg-[var(--ipk-green-dark)] text-white rounded-lg h-9 px-3" style={{ fontSize: "12px" }}>Valider</Button>
                <Button onClick={() => { setPending(p => p.filter((_, j) => j !== i)); logAudit({ actor: session?.username || "system", action: "reject", entity: "artisan", details: c.name }); toast.info("Candidature rejetée"); }} variant="outline" className="rounded-lg h-9 px-3" style={{ fontSize: "12px" }}>Rejeter</Button>
              </li>
            ))}
          </ul>
        </DataCard>
      )}

      <DataCard className="mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Nom, spécialité, pays…" />
      </DataCard>

      {list.length === 0 ? (
        <DataCard><EmptyRow message="Aucun artisan." /></DataCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {list.map(a => (
            <DataCard key={a.id} className="!p-4">
              <div className="flex gap-3">
                <div className="w-14 h-14 rounded-full overflow-hidden shrink-0">
                  <LazyImage src={a.image} alt={a.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate" style={{ fontSize: "14px", fontWeight: 600, color: "var(--ipk-ink)" }}>{a.name}</h3>
                  <p className="text-[var(--ipk-text)] truncate" style={{ fontSize: "12px" }}>{a.specialty}</p>
                  <p className="text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>{a.region}, {a.country}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--ipk-border)]">
                <span className="inline-flex items-center gap-1 text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>{a.productsCount} oeuvres • <Star className="w-3 h-3 text-[var(--ipk-amber)]" /> {a.rating}</span>
                <div className="flex gap-1">
                  <Link to={`/groupements/${groupements.find(g => g.id === a.groupementId)?.slug}`} target="_blank" rel="noreferrer" aria-label="Voir groupement" className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-[var(--ipk-border)] text-[var(--ipk-text)]"><Eye className="w-3.5 h-3.5" /></Link>
                  <Button onClick={async () => { if (await confirm({ title: "Désactiver l'artisan", message: `${a.name} ne sera plus visible. Vous pourrez le restaurer.`, tone: "danger", confirmLabel: "Désactiver" })) { setRemoved(r => [...r, a.id]); logAudit({ actor: session?.username || "system", action: "archive", entity: "artisan", entityId: a.id, details: a.name }); toast.success("Artisan désactivé"); } }} variant="outline" className="rounded-lg h-8 w-8 p-0 text-red-600" aria-label="Désactiver"><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            </DataCard>
          ))}
        </div>
      )}

      {removed.length > 0 && (
        <DataCard className="mt-4">
          <div className="flex items-center justify-between">
            <span className="text-[var(--ipk-text)]" style={{ fontSize: "13px" }}>{removed.length} artisan(s) désactivé(s)</span>
            <Button onClick={() => { setRemoved([]); toast.success("Restauration effectuée"); }} variant="outline" className="rounded-xl h-9">Tout restaurer</Button>
          </div>
        </DataCard>
      )}
    </div>
  );
}

// ===== GROUPEMENTS =====
interface GroupementOverride { conformity?: number; artisanCount?: number; }

export function AdminGroupementsPage() {
  useSeo({ title: "Admin - Groupements", noIndex: true });
  const { session } = useAdmin();
  const [overrides, setOverrides] = useLocalState<Record<string, GroupementOverride>>("ipk:admin:groupementOverrides:v1", {});
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<GroupementOverride>({});
  const [search, setSearch] = useState("");

  const merged = groupements.map(g => ({
    ...g,
    conformity: overrides[g.id]?.conformity ?? g.conformity,
    artisanCount: overrides[g.id]?.artisanCount ?? g.artisanCount,
  }));

  const filtered = merged.filter(g => search.trim() === "" || g.name.toLowerCase().includes(search.toLowerCase()) || g.country.toLowerCase().includes(search.toLowerCase()));

  type GSortKey = "name" | "country" | "artisanCount" | "conformity";
  const { sorted, sort, onSort } = useSortable<typeof filtered[number], GSortKey>(filtered, (item, key) => item[key] as any, { key: "name", dir: "asc" });
  const { page, pageCount, total: pageTotal, slice, setPage } = usePagination(sorted, 20);

  const exportData = () => exportCSV(`groupements-${new Date().toISOString().slice(0, 10)}.csv`, sorted.map(g => ({
    nom: g.name, pays: g.country, artisans: g.artisanCount, conformite: g.conformity, specialites: g.specialties.join(" / "),
  })));

  return (
    <div>
      <PageHeader title="Groupements" subtitle={`${groupements.length} groupements`} action={
        <Button onClick={exportData} variant="outline" className="rounded-xl h-10"><Download className="w-4 h-4 mr-1" /> CSV</Button>
      } />

      <DataCard className="mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Nom ou pays…" />
      </DataCard>

      <DataCard>
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full" style={{ fontSize: "13px" }}>
            <thead className="text-[var(--ipk-text)] border-b border-[var(--ipk-border)]">
              <tr>
                <th className="text-left py-2 font-medium"><SortHeader label="Groupement" sortKey="name" state={sort} onSort={onSort} /></th>
                <th className="text-left py-2 font-medium hidden md:table-cell"><SortHeader label="Pays" sortKey="country" state={sort} onSort={onSort} /></th>
                <th className="text-right py-2 font-medium"><SortHeader label="Artisans" sortKey="artisanCount" state={sort} onSort={onSort} align="right" /></th>
                <th className="text-right py-2 font-medium"><SortHeader label="Conformité" sortKey="conformity" state={sort} onSort={onSort} align="right" /></th>
                <th className="text-right py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {slice.length === 0 ? (
                <tr><td colSpan={5}><EmptyRow message="Aucun groupement." /></td></tr>
              ) : slice.map(g => {
                const isEdit = editing === g.id;
                const tone = g.conformity >= 90 ? "success" : g.conformity >= 75 ? "warn" : "danger";
                return (
                  <tr key={g.id} className="border-b border-[var(--ipk-border)] last:border-0">
                    <td className="py-3 pr-2">
                      <div className="font-medium text-[var(--ipk-ink)] truncate max-w-[220px]">{g.name}</div>
                      <div className="text-[var(--ipk-text)] truncate max-w-[220px]" style={{ fontSize: "11px" }}>{g.specialties.join(" • ")}</div>
                    </td>
                    <td className="py-3 pr-2 hidden md:table-cell text-[var(--ipk-text)]">{g.country}</td>
                    <td className="py-3 pr-2 text-right">
                      {isEdit ? <NumberInput value={draft.artisanCount ?? 0} onChange={v => setDraft(d => ({ ...d, artisanCount: v }))} min={0} integer className="w-16 text-right" /> : g.artisanCount}
                    </td>
                    <td className="py-3 pr-2 text-right">
                      {isEdit ? <NumberInput value={draft.conformity ?? 0} onChange={v => setDraft(d => ({ ...d, conformity: v }))} min={0} max={100} integer className="w-16 text-right" /> : <StatusPill status={`${g.conformity}%`} tone={tone} />}
                    </td>
                    <td className="py-3 text-right whitespace-nowrap">
                      {isEdit ? (
                        <div className="inline-flex gap-1">
                          <Button onClick={() => { setOverrides(prev => ({ ...prev, [g.id]: { ...prev[g.id], ...draft } })); setEditing(null); logAudit({ actor: session?.username || "system", action: "update", entity: "groupement", entityId: g.id }); toast.success("Groupement mis à jour"); }} className="bg-[var(--ipk-green-dark)] text-white rounded-lg h-8 w-8 p-0" aria-label="Enregistrer"><Save className="w-3.5 h-3.5" /></Button>
                          <Button onClick={() => setEditing(null)} variant="outline" className="rounded-lg h-8 w-8 p-0" aria-label="Annuler"><X className="w-3.5 h-3.5" /></Button>
                        </div>
                      ) : (
                        <div className="inline-flex gap-1">
                          <Link to={`/groupements/${g.slug}`} target="_blank" rel="noreferrer" aria-label="Voir" className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-[var(--ipk-border)] text-[var(--ipk-text)]"><Eye className="w-3.5 h-3.5" /></Link>
                          <Button onClick={() => { setEditing(g.id); setDraft({ conformity: g.conformity, artisanCount: g.artisanCount }); }} variant="outline" className="rounded-lg h-8 w-8 p-0" aria-label="Modifier"><Edit3 className="w-3.5 h-3.5" /></Button>
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
    </div>
  );
}

// ===== FORMATIONS =====
interface FormationOverride { price?: number; nextDate?: string; published?: boolean; }
interface AdminEnrolment { formationId: string; name: string; email: string; date: string; }

export function AdminFormationsPage() {
  useSeo({ title: "Admin - Formations", noIndex: true });
  const { session } = useAdmin();
  const crud = useEntityCrud<typeof formations[number], FormationOverride>({
    overridesKey: "ipk:admin:formationOverrides:v1",
    removedKey: "ipk:admin:formationRemoved:v1",
    seed: formations,
    entityName: "formation",
    actor: session?.username || "system",
    searchableFields: ["title", "level"],
  });
  const [enrolments] = useLocalState<AdminEnrolment[]>("ipk:admin:enrolments:v1", [
    { formationId: "f1", name: "Aïssata D.", email: "aissata@example.com", date: new Date(Date.now() - 86400000).toISOString() },
    { formationId: "f1", name: "Marc P.", email: "marc@example.com", date: new Date(Date.now() - 86400000 * 3).toISOString() },
    { formationId: "f3", name: "Sophie L.", email: "sophie@example.com", date: new Date(Date.now() - 86400000 * 4).toISOString() },
  ]);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState<FormationOverride>({});

  const merged = crud.merged.map(f => ({ ...f, published: f.published ?? true }));
  const filtered = crud.filter(search).map(f => ({ ...f, published: f.published ?? true }));

  type FSortKey = "title" | "nextDate" | "price" | "published";
  const { sorted, sort, onSort } = useSortable<typeof filtered[number], FSortKey>(filtered, (item, key) => item[key] as any, { key: "title", dir: "asc" });
  const { page, pageCount, total: pageTotal, slice, setPage } = usePagination(sorted, 20);
  const bulk = useBulkSelection(slice);

  const bulkPublish = (publish: boolean) => {
    const ids = bulk.selectedItems.map(f => f.id);
    crud.bulkUpdate(ids, { published: publish }, publish ? "publiée" : "dépubliée");
    bulk.clear();
    toast.success(`${ids.length} formation(s) ${publish ? "publiée" : "dépubliée"}(s)`);
  };
  const exportData = () => exportCSV(`formations-${new Date().toISOString().slice(0, 10)}.csv`, sorted.map(f => ({
    titre: f.title, niveau: f.level, mode: f.mode, prochaine: f.nextDate, prix: f.price, publie: f.published ? "oui" : "non",
  })));

  return (
    <div>
      <PageHeader title="Formations" subtitle={`${formations.length} formations - ${enrolments.length} inscriptions`} action={
        <div className="flex gap-2">
          <Button onClick={exportData} variant="outline" className="rounded-xl h-10"><Download className="w-4 h-4 mr-1" /> CSV</Button>
          <AddButton onClick={() => toast.info("Création formation en démo")} label="Nouvelle formation" />
        </div>
      } />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <DataCard className="mb-4"><SearchInput value={search} onChange={setSearch} placeholder="Titre, niveau…" /></DataCard>
          {bulk.count > 0 && (
            <BulkBar count={bulk.count} onClear={bulk.clear}>
              <Button onClick={() => bulkPublish(true)} variant="outline" className="rounded-lg h-9" style={{ fontSize: "12px" }}>Publier</Button>
              <Button onClick={() => bulkPublish(false)} variant="outline" className="rounded-lg h-9" style={{ fontSize: "12px" }}>Dépublier</Button>
            </BulkBar>
          )}
          <DataCard>
            <div className="overflow-x-auto -mx-5 px-5">
              <table className="w-full" style={{ fontSize: "13px" }}>
                <thead className="text-[var(--ipk-text)] border-b border-[var(--ipk-border)]">
                  <tr>
                    <th className="py-2 w-8"><SelectCheckbox checked={bulk.allSelected} indeterminate={bulk.someSelected && !bulk.allSelected} onChange={bulk.toggleAll} ariaLabel="Tout sélectionner" /></th>
                    <th className="text-left py-2 font-medium"><SortHeader label="Formation" sortKey="title" state={sort} onSort={onSort} /></th>
                    <th className="text-left py-2 font-medium hidden sm:table-cell"><SortHeader label="Prochaine" sortKey="nextDate" state={sort} onSort={onSort} /></th>
                    <th className="text-right py-2 font-medium"><SortHeader label="Prix" sortKey="price" state={sort} onSort={onSort} align="right" /></th>
                    <th className="text-left py-2 font-medium"><SortHeader label="Statut" sortKey="published" state={sort} onSort={onSort} /></th>
                    <th className="text-right py-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {slice.length === 0 ? (
                    <tr><td colSpan={6}><EmptyRow message="Aucune formation." /></td></tr>
                  ) : slice.map(f => {
                    const isEdit = crud.editing === f.id;
                    return (
                      <tr key={f.id} className="border-b border-[var(--ipk-border)] last:border-0">
                        <td className="py-3 pr-2"><SelectCheckbox checked={bulk.selected.has(f.id)} onChange={() => bulk.toggle(f.id)} ariaLabel={`Sélectionner ${f.title}`} /></td>
                        <td className="py-3 pr-2">
                          <div className="font-medium text-[var(--ipk-ink)] truncate max-w-[200px]">{f.title}</div>
                          <div className="text-[var(--ipk-text)] truncate" style={{ fontSize: "11px" }}>{f.level} • {f.mode}</div>
                        </td>
                        <td className="py-3 pr-2 hidden sm:table-cell text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>
                          {isEdit ? <input type="text" value={draft.nextDate} onChange={e => setDraft(d => ({ ...d, nextDate: e.target.value }))} className="w-32 border border-[var(--ipk-border)] rounded-lg px-2 py-1" /> : f.nextDate}
                        </td>
                        <td className="py-3 pr-2 text-right">
                          {isEdit ? <NumberInput value={draft.price ?? 0} onChange={v => setDraft(d => ({ ...d, price: v }))} min={0} integer className="w-24 text-right" /> : <span style={{ fontWeight: 600 }}>{f.price === 0 ? "Gratuit" : formatPrice(f.price)}</span>}
                        </td>
                        <td className="py-3 pr-2">
                          {isEdit ? (
                            <select value={draft.published ? "1" : "0"} onChange={e => setDraft(d => ({ ...d, published: e.target.value === "1" }))} className="border border-[var(--ipk-border)] rounded-lg px-2 py-1">
                              <option value="1">Publiée</option><option value="0">Brouillon</option>
                            </select>
                          ) : <StatusPill status={f.published ? "Publiée" : "Brouillon"} tone={f.published ? "success" : "warn"} />}
                        </td>
                        <td className="py-3 text-right whitespace-nowrap">
                          {isEdit ? (
                            <div className="inline-flex gap-1">
                              <Button onClick={() => { crud.save(f.id, draft); toast.success("Formation mise à jour"); }} className="bg-[var(--ipk-green-dark)] text-white rounded-lg h-8 w-8 p-0" aria-label="Enregistrer"><Save className="w-3.5 h-3.5" /></Button>
                              <Button onClick={crud.cancelEdit} variant="outline" className="rounded-lg h-8 w-8 p-0" aria-label="Annuler"><X className="w-3.5 h-3.5" /></Button>
                            </div>
                          ) : (
                            <div className="inline-flex gap-1">
                              <Link to={`/formations/${f.slug}`} target="_blank" rel="noreferrer" aria-label="Voir" className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-[var(--ipk-border)] text-[var(--ipk-text)]"><Eye className="w-3.5 h-3.5" /></Link>
                              <Button onClick={() => { crud.startEdit(f.id); setDraft({ price: f.price, nextDate: f.nextDate, published: f.published }); }} variant="outline" className="rounded-lg h-8 w-8 p-0" aria-label="Modifier"><Edit3 className="w-3.5 h-3.5" /></Button>
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
        </div>

        <DataCard>
          <h3 className="mb-3" style={{ fontSize: "14px", fontWeight: 600, color: "var(--ipk-ink)" }}>Dernières inscriptions</h3>
          {enrolments.length === 0 ? <EmptyRow message="Aucune inscription." /> : (
            <ul className="space-y-2">
              {enrolments.slice(0, 8).map((e, i) => {
                const f = formations.find(x => x.id === e.formationId);
                return (
                  <li key={i} className="p-2 bg-[var(--ipk-surface)] rounded-lg">
                    <div className="font-medium text-[var(--ipk-ink)] truncate" style={{ fontSize: "13px" }}>{e.name}</div>
                    <div className="text-[var(--ipk-text)] truncate" style={{ fontSize: "11px" }}>{e.email}</div>
                    <div className="text-[var(--ipk-text)] truncate mt-1" style={{ fontSize: "11px" }}>→ {f?.title || "-"}</div>
                  </li>
                );
              })}
            </ul>
          )}
        </DataCard>
      </div>
    </div>
  );
}
