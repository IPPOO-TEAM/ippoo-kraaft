import { useMemo, useRef, useState } from "react";
import { Upload, Link2, Search, Trash2, Edit3, Check, X, Image as ImageIcon, Copy } from "lucide-react";
import { useMedia, type MediaAsset } from "../../hooks/use-media";
import { useConfirm } from "../../hooks/use-confirm";
import { toast } from "sonner";
import { DataCard, EmptyRow } from "./admin-shared";
import { copyToClipboard } from "../../utils/clipboard";

function formatSize(bytes: number): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(2)} Mo`;
}

export function MediaLibraryPanel({ onPick }: { onPick?: (asset: MediaAsset) => void }) {
  const { assets, uploadFile, importUrl, update, remove } = useMedia();
  const confirm = useConfirm();
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ name: string; alt: string; tags: string }>({ name: "", alt: "", tags: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allTags = useMemo(() => Array.from(new Set(assets.flatMap(a => a.tags))).sort(), [assets]);
  const filtered = assets.filter(a => {
    if (tagFilter && !a.tags.includes(tagFilter)) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return a.name.toLowerCase().includes(q) || (a.alt || "").toLowerCase().includes(q) || a.tags.some(t => t.toLowerCase().includes(q));
  });

  const handleFiles = async (files: FileList | null) => {
    if (!files || !files.length) return;
    let ok = 0, ko = 0;
    for (const f of Array.from(files)) {
      try { await uploadFile(f); ok++; }
      catch (e) { ko++; toast.error(e instanceof Error ? e.message : "Échec upload"); }
    }
    if (ok) toast.success(`${ok} fichier${ok > 1 ? "s" : ""} importé${ok > 1 ? "s" : ""}`);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImportUrl = async () => {
    const u = urlInput.trim();
    if (!u) return;
    try { await importUrl(u); toast.success("Image importée"); setUrlInput(""); }
    catch (e) { toast.error(e instanceof Error ? e.message : "URL invalide"); }
  };

  const startEdit = (a: MediaAsset) => {
    setEditId(a.id);
    setDraft({ name: a.name, alt: a.alt || "", tags: a.tags.join(", ") });
  };
  const saveEdit = () => {
    if (!editId) return;
    update(editId, {
      name: draft.name.trim() || "image",
      alt: draft.alt.trim() || undefined,
      tags: draft.tags.split(",").map(t => t.trim()).filter(Boolean),
    });
    setEditId(null);
    toast.success("Média mis à jour");
  };

  const handleRemove = async (a: MediaAsset) => {
    if (!await confirm({ title: "Supprimer le média", message: `« ${a.name} » sera retiré de la bibliothèque.`, tone: "danger", confirmLabel: "Supprimer" })) return;
    remove(a.id);
    toast.success("Média supprimé");
  };

  const copyUrl = async (a: MediaAsset) => {
    const success = await copyToClipboard(a.url);
    if (success) {
      toast.success("URL copiée");
    } else {
      toast.error("Impossible de copier l'URL");
    }
  };

  const totalBytes = assets.reduce((s, a) => s + a.size, 0);

  return (
    <div className="space-y-4">
      <DataCard>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--ipk-green-dark)] text-white hover:bg-[var(--ipk-green-darker)]"
            style={{ fontSize: "13px", fontWeight: 600 }}
          >
            <Upload className="w-4 h-4" /> Uploader des fichiers
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={(e) => handleFiles(e.target.files)} className="hidden" />
          <div className="flex-1 min-w-[200px] flex items-center gap-1">
            <input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleImportUrl(); }}
              placeholder="Importer depuis URL https://..."
              className="flex-1 px-3 py-2 rounded-lg border border-[var(--ipk-border)]"
              style={{ fontSize: "13px" }}
            />
            <button
              onClick={handleImportUrl}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-[var(--ipk-border)] hover:bg-[var(--ipk-surface)]"
              style={{ fontSize: "13px", fontWeight: 500 }}
            >
              <Link2 className="w-4 h-4" /> Importer
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ipk-text-muted)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher (nom, alt, tag)…"
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[var(--ipk-border)]"
              style={{ fontSize: "13px" }}
            />
          </div>
          {allTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              <button
                onClick={() => setTagFilter(null)}
                className={`px-2 py-1 rounded-full border ${tagFilter === null ? "bg-[var(--ipk-green-dark)] text-white border-transparent" : "border-[var(--ipk-border)]"}`}
                style={{ fontSize: "11px" }}
              >Tous</button>
              {allTags.map(t => (
                <button
                  key={t}
                  onClick={() => setTagFilter(t)}
                  className={`px-2 py-1 rounded-full border ${tagFilter === t ? "bg-[var(--ipk-green-dark)] text-white border-transparent" : "border-[var(--ipk-border)]"}`}
                  style={{ fontSize: "11px" }}
                >{t}</button>
              ))}
            </div>
          )}
          <div className="text-[var(--ipk-text-muted)]" style={{ fontSize: "11px" }}>
            {assets.length} média{assets.length > 1 ? "s" : ""} · {formatSize(totalBytes)}
          </div>
        </div>
      </DataCard>

      <DataCard>
        {filtered.length === 0 ? (
          <EmptyRow message={assets.length === 0 ? "Aucun média. Importez votre première image." : "Aucun média correspondant aux filtres."} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filtered.map(a => {
              const editing = editId === a.id;
              return (
                <div key={a.id} className="group relative border border-[var(--ipk-border)] rounded-lg overflow-hidden bg-white">
                  <div className="aspect-square bg-[var(--ipk-surface)] flex items-center justify-center overflow-hidden">
                    {a.mime.startsWith("image") || a.source === "url" ? (
                      <img src={a.url} alt={a.alt || a.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-[var(--ipk-text-muted)]" />
                    )}
                  </div>
                  {editing ? (
                    <div className="p-2 space-y-1">
                      <input value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} placeholder="Nom" className="w-full px-2 py-1 rounded border border-[var(--ipk-border)]" style={{ fontSize: "11px" }} />
                      <input value={draft.alt} onChange={e => setDraft(d => ({ ...d, alt: e.target.value }))} placeholder="Texte alternatif" className="w-full px-2 py-1 rounded border border-[var(--ipk-border)]" style={{ fontSize: "11px" }} />
                      <input value={draft.tags} onChange={e => setDraft(d => ({ ...d, tags: e.target.value }))} placeholder="tag1, tag2" className="w-full px-2 py-1 rounded border border-[var(--ipk-border)]" style={{ fontSize: "11px" }} />
                      <div className="flex gap-1 pt-1">
                        <button onClick={saveEdit} className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1 rounded bg-[var(--ipk-green-dark)] text-white" style={{ fontSize: "11px" }}><Check className="w-3 h-3" /> OK</button>
                        <button onClick={() => setEditId(null)} className="px-2 py-1 rounded border border-[var(--ipk-border)]" style={{ fontSize: "11px" }}><X className="w-3 h-3" /></button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2">
                      <div className="truncate" title={a.name} style={{ fontSize: "11px", fontWeight: 600 }}>{a.name}</div>
                      <div className="text-[var(--ipk-text-muted)] flex items-center justify-between" style={{ fontSize: "10px" }}>
                        <span>{a.width && a.height ? `${a.width}×${a.height}` : a.source}</span>
                        <span>{formatSize(a.size)}</span>
                      </div>
                      {a.tags.length > 0 && (
                        <div className="flex flex-wrap gap-0.5 mt-1">
                          {a.tags.slice(0, 3).map(t => <span key={t} className="px-1.5 py-0.5 rounded bg-[var(--ipk-surface)] text-[var(--ipk-text-muted)]" style={{ fontSize: "9px" }}>{t}</span>)}
                        </div>
                      )}
                    </div>
                  )}
                  {!editing && (
                    <div className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {onPick && (
                        <button onClick={() => onPick(a)} className="px-2 py-1 rounded bg-[var(--ipk-green-dark)] text-white" style={{ fontSize: "10px", fontWeight: 600 }} title="Choisir">
                          Choisir
                        </button>
                      )}
                      <button onClick={() => copyUrl(a)} className="p-1 rounded bg-white/90 border border-[var(--ipk-border)]" title="Copier l'URL"><Copy className="w-3 h-3" /></button>
                      <button onClick={() => startEdit(a)} className="p-1 rounded bg-white/90 border border-[var(--ipk-border)]" title="Modifier"><Edit3 className="w-3 h-3" /></button>
                      <button onClick={() => handleRemove(a)} className="p-1 rounded bg-white/90 border border-[var(--ipk-border)] text-[var(--ipk-danger,#c0392b)]" title="Supprimer"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </DataCard>
    </div>
  );
}

export function AdminMediaPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 700 }}>Bibliothèque média</h1>
        <p className="text-[var(--ipk-text-muted)]" style={{ fontSize: "13px" }}>
          Stockez et organisez les images réutilisables dans tout le site (héros, sections, articles…).
        </p>
      </div>
      <MediaLibraryPanel />
    </div>
  );
}
