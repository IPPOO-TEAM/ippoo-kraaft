import { useState } from "react";
import { Edit3, Save, X, Trash2, Eye, EyeOff, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useCategories, type Category } from "../../hooks/use-categories";
import { useAdmin } from "../../hooks/use-admin";
import { useConfirm } from "../../hooks/use-confirm";
import { logAudit } from "../../hooks/use-admin-audit";
import { useSeo } from "../../hooks/use-seo";
import { PageHeader, AddButton, DataCard, SearchInput, StatusPill, EmptyRow, NumberInput } from "./admin-shared";
import { Button } from "../ui/button";

const ICON_OPTIONS = [
  "Hammer", "Scissors", "Coffee", "ShoppingBasket", "Gem", "Wrench", "Briefcase", "Music",
  "Palette", "Box", "Feather", "Flower", "Heart", "Sparkles", "Star", "Tag",
];

export function AdminCategoriesPage() {
  useSeo({ title: "Admin — Catégories", noIndex: true });
  const { session } = useAdmin();
  const actor = session?.username || "system";
  const confirm = useConfirm();
  const { categories, createCategory, updateCategory, deleteCategory, toggleHidden, reset } = useCategories();

  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Category>({ name: "", icon: "Tag", count: 0 });
  const [creating, setCreating] = useState(false);
  const [newCat, setNewCat] = useState<Category>({ name: "", icon: "Tag", count: 0 });

  const filtered = categories.filter(c => search.trim() === "" || c.name.toLowerCase().includes(search.toLowerCase()));

  const startEdit = (c: Category) => { setEditing(c.name); setDraft({ ...c }); };
  const save = (name: string) => {
    if (!draft.name.trim()) return toast.error("Nom obligatoire");
    if (draft.name !== name && categories.some(c => c.name === draft.name)) return toast.error("Ce nom existe déjà");
    updateCategory(name, draft);
    logAudit({ actor, action: "update", entity: "category", entityId: name, details: name !== draft.name ? `« ${name} » → « ${draft.name} »` : `${draft.name} (icône ${draft.icon}, count ${draft.count})` });
    toast.success("Catégorie mise à jour");
    setEditing(null);
  };
  const handleCreate = () => {
    if (!newCat.name.trim()) return toast.error("Nom obligatoire");
    if (categories.some(c => c.name === newCat.name)) return toast.error("Ce nom existe déjà");
    createCategory({ ...newCat, name: newCat.name.trim() });
    logAudit({ actor, action: "create", entity: "category", entityId: newCat.name, details: `${newCat.name} (icône ${newCat.icon})` });
    toast.success("Catégorie créée");
    setCreating(false);
    setNewCat({ name: "", icon: "Tag", count: 0 });
  };
  const handleDelete = async (c: Category) => {
    const ok = await confirm({
      title: `Supprimer « ${c.name} » ?`,
      message: "Les produits existants conservent l'étiquette mais elle ne sera plus proposée à la création.",
      confirmLabel: "Supprimer", tone: "danger",
    });
    if (!ok) return;
    deleteCategory(c.name);
    logAudit({ actor, action: "delete", entity: "category", entityId: c.name });
    toast.success("Catégorie supprimée");
  };
  const handleReset = async () => {
    const ok = await confirm({ title: "Réinitialiser les catégories ?", message: "Toutes vos modifications seront perdues.", confirmLabel: "Réinitialiser", tone: "danger" });
    if (!ok) return;
    reset();
    logAudit({ actor, action: "reset", entity: "category" });
    toast.success("Catégories réinitialisées");
  };

  const visibleCount = categories.filter(c => !c.hidden).length;

  return (
    <div>
      <PageHeader
        title="Catégories"
        subtitle={`${categories.length} catégories — ${visibleCount} visibles publiquement`}
        action={
          <div className="flex gap-2">
            <Button onClick={handleReset} variant="outline" className="rounded-xl h-10"><RotateCcw className="w-4 h-4 mr-1" /> Réinitialiser</Button>
            <AddButton onClick={() => setCreating(true)} label="Nouvelle catégorie" />
          </div>
        }
      />

      <DataCard className="mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Rechercher une catégorie…" />
      </DataCard>

      <DataCard>
        {filtered.length === 0 ? <EmptyRow message="Aucune catégorie." /> : (
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full" style={{ fontSize: "13px" }}>
              <thead className="text-[var(--ipk-text)] border-b border-[var(--ipk-border)]">
                <tr>
                  <th className="text-left py-2 font-medium">Nom</th>
                  <th className="text-left py-2 font-medium">Icône</th>
                  <th className="text-right py-2 font-medium">Compteur</th>
                  <th className="text-left py-2 font-medium">Statut</th>
                  <th className="text-right py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => {
                  const isEdit = editing === c.name;
                  return (
                    <tr key={c.name} className="border-b border-[var(--ipk-border)] last:border-0">
                      <td className="py-3 pr-2">
                        {isEdit
                          ? <input value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} className="w-40 border border-[var(--ipk-border)] rounded-lg px-2 py-1" />
                          : <span className="font-medium text-[var(--ipk-ink)]">{c.name}</span>}
                      </td>
                      <td className="py-3 pr-2">
                        {isEdit
                          ? <select value={draft.icon} onChange={e => setDraft(d => ({ ...d, icon: e.target.value }))} className="border border-[var(--ipk-border)] rounded-lg px-2 py-1">
                              {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
                            </select>
                          : <code className="text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>{c.icon}</code>}
                      </td>
                      <td className="py-3 pr-2 text-right">
                        {isEdit
                          ? <NumberInput value={draft.count} onChange={v => setDraft(d => ({ ...d, count: v }))} min={0} integer className="w-20 text-right" />
                          : c.count}
                      </td>
                      <td className="py-3 pr-2">
                        <StatusPill status={c.hidden ? "Masquée" : "Visible"} tone={c.hidden ? "neutral" : "success"} />
                      </td>
                      <td className="py-3 text-right whitespace-nowrap">
                        {isEdit ? (
                          <div className="inline-flex gap-1">
                            <Button onClick={() => save(c.name)} className="bg-[var(--ipk-green-dark)] text-white rounded-lg h-8 w-8 p-0" aria-label="Enregistrer"><Save className="w-3.5 h-3.5" /></Button>
                            <Button onClick={() => setEditing(null)} variant="outline" className="rounded-lg h-8 w-8 p-0" aria-label="Annuler"><X className="w-3.5 h-3.5" /></Button>
                          </div>
                        ) : (
                          <div className="inline-flex gap-1">
                            <Button onClick={() => { toggleHidden(c.name); logAudit({ actor, action: "toggle", entity: "category", entityId: c.name, details: c.hidden ? "→ visible" : "→ masquée" }); }} variant="outline" className="rounded-lg h-8 w-8 p-0" aria-label={c.hidden ? "Afficher" : "Masquer"}>
                              {c.hidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            </Button>
                            <Button onClick={() => startEdit(c)} variant="outline" className="rounded-lg h-8 w-8 p-0" aria-label="Modifier"><Edit3 className="w-3.5 h-3.5" /></Button>
                            <Button onClick={() => handleDelete(c)} variant="outline" className="rounded-lg h-8 w-8 p-0 text-red-600" aria-label="Supprimer"><Trash2 className="w-3.5 h-3.5" /></Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </DataCard>

      {creating && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setCreating(false)}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md" onClick={e => e.stopPropagation()}>
            <div className="border-b border-[var(--ipk-border)] px-5 py-4 flex items-center justify-between">
              <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--ipk-ink)" }}>Nouvelle catégorie</h2>
              <Button onClick={() => setCreating(false)} variant="outline" className="rounded-lg h-8 w-8 p-0" aria-label="Fermer"><X className="w-4 h-4" /></Button>
            </div>
            <div className="p-5 space-y-3" style={{ fontSize: "13px" }}>
              <label className="block">
                <span className="block mb-1 text-[var(--ipk-ink)]" style={{ fontSize: "12px", fontWeight: 500 }}>Nom *</span>
                <input value={newCat.name} onChange={e => setNewCat(c => ({ ...c, name: e.target.value }))} placeholder="Bois sculpté" className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2" />
              </label>
              <label className="block">
                <span className="block mb-1 text-[var(--ipk-ink)]" style={{ fontSize: "12px", fontWeight: 500 }}>Icône Lucide</span>
                <select value={newCat.icon} onChange={e => setNewCat(c => ({ ...c, icon: e.target.value }))} className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2 bg-white">
                  {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="block mb-1 text-[var(--ipk-ink)]" style={{ fontSize: "12px", fontWeight: 500 }}>Compteur initial</span>
                <NumberInput value={newCat.count} onChange={v => setNewCat(c => ({ ...c, count: v }))} min={0} integer className="w-32" />
              </label>
            </div>
            <div className="border-t border-[var(--ipk-border)] px-5 py-3 flex justify-end gap-2">
              <Button onClick={() => setCreating(false)} variant="outline" className="rounded-xl h-10">Annuler</Button>
              <Button onClick={handleCreate} className="bg-[var(--ipk-green-dark)] hover:bg-[var(--ipk-green-darker)] text-white rounded-xl h-10 px-4">Créer</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
