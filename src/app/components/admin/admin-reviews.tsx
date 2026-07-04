import { useMemo, useState } from "react";
import { Star, Trash2, Check, EyeOff, Flag, MessageCircle, History, X, ShieldCheck } from "lucide-react";
import { products } from "../../data/mock-data";
import { loadReviews, saveReviews, type ReviewModEvent, type ReviewReply } from "../../hooks/use-admin-data";
import { logAudit } from "../../hooks/use-admin-audit";
import { useAdmin } from "../../hooks/use-admin";
import { useSeo } from "../../hooks/use-seo";
import { useConfirm } from "../../hooks/use-confirm";
import { PageHeader, DataCard, SearchInput, StatusPill, EmptyRow, useBulkSelection, BulkBar, SelectCheckbox } from "./admin-shared";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface Row {
  productId: string;
  productName: string;
  rating: number;
  comment: string;
  author: string;
  date: string;
  approved?: boolean;
  flagged?: boolean;
  flagReason?: string;
  verified?: boolean;
  reply?: ReviewReply;
  history?: ReviewModEvent[];
  index: number;
  id: string;
}

type Filter = "all" | "pending" | "approved" | "flagged" | "replied";

export function AdminReviewsPage() {
  useSeo({ title: "Admin - Avis", noIndex: true });
  const { session } = useAdmin();
  const actor = session?.username || "system";
  const [version, setVersion] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [ratingFilter, setRatingFilter] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [replyOn, setReplyOn] = useState<Row | null>(null);
  const [flagOn, setFlagOn] = useState<Row | null>(null);
  const [historyOn, setHistoryOn] = useState<Row | null>(null);
  const confirm = useConfirm();

  const reviews: Row[] = useMemo(() => {
    const all = loadReviews();
    const rows: Row[] = [];
    Object.entries(all).forEach(([productId, list]) => {
      const product = products.find(p => p.id === productId);
      list.forEach((r, idx) => rows.push({
        productId,
        productName: product?.name || "(produit supprimé)",
        rating: r.rating,
        comment: r.comment,
        author: r.author,
        date: r.date,
        approved: r.approved,
        flagged: r.flagged,
        flagReason: r.flagReason,
        verified: (r as any).verified,
        reply: r.reply,
        history: r.history,
        index: idx,
        id: `${productId}-${idx}`,
      }));
    });
    return rows.sort((a, b) => b.date.localeCompare(a.date));
  }, [version]);

  const filtered = reviews.filter(r => {
    if (filter === "pending" && r.approved) return false;
    if (filter === "approved" && !r.approved) return false;
    if (filter === "flagged" && !r.flagged) return false;
    if (filter === "replied" && !r.reply) return false;
    if (ratingFilter > 0 && r.rating !== ratingFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return r.comment.toLowerCase().includes(q) || r.author.toLowerCase().includes(q) || r.productName.toLowerCase().includes(q);
    }
    return true;
  });

  const bulk = useBulkSelection(filtered);

  const mutate = (productId: string, index: number, mut: (r: any) => any) => {
    const all = loadReviews();
    if (!all[productId]) return;
    all[productId] = all[productId].map((r, i) => i === index ? mut({ ...r }) : r);
    saveReviews(all);
    setVersion(v => v + 1);
  };

  const pushHistory = (r: any, ev: Omit<ReviewModEvent, "actor" | "date">): any => ({
    ...r,
    history: [...(r.history || []), { ...ev, actor, date: new Date().toISOString() }],
  });

  const approve = (r: Row) => {
    mutate(r.productId, r.index, x => pushHistory({ ...x, approved: true }, { action: "approve" }));
    logAudit({ actor, action: "approve", entity: "review", entityId: r.productId, details: `par ${r.author}` });
    toast.success("Avis publié");
  };

  const unpublish = (r: Row) => {
    mutate(r.productId, r.index, x => pushHistory({ ...x, approved: false }, { action: "unpublish" }));
    logAudit({ actor, action: "update", entity: "review", entityId: r.productId, details: `dépublié - ${r.author}` });
    toast.success("Avis dépublié");
  };

  const remove = async (r: Row) => {
    const ok = await confirm({ title: "Supprimer cet avis ?", message: `« ${r.comment.slice(0, 80)}${r.comment.length > 80 ? "…" : ""} »`, confirmLabel: "Supprimer", tone: "danger" });
    if (!ok) return;
    const all = loadReviews();
    if (!all[r.productId]) return;
    all[r.productId] = all[r.productId].filter((_, i) => i !== r.index);
    if (all[r.productId].length === 0) delete all[r.productId];
    saveReviews(all);
    setVersion(v => v + 1);
    logAudit({ actor, action: "delete", entity: "review", entityId: r.productId, details: `index ${r.index}` });
    toast.success("Avis supprimé");
  };

  const submitReply = (r: Row, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) { toast.error("Réponse vide"); return; }
    mutate(r.productId, r.index, x => pushHistory({ ...x, reply: { text: trimmed, author: actor, date: new Date().toISOString() } }, { action: "reply", note: trimmed.slice(0, 80) }));
    logAudit({ actor, action: "update", entity: "review", entityId: r.productId, details: `réponse - ${r.author}` });
    toast.success("Réponse publiée");
    setReplyOn(null);
  };

  const removeReply = (r: Row) => {
    mutate(r.productId, r.index, x => pushHistory({ ...x, reply: undefined }, { action: "delete-reply" }));
    toast.success("Réponse retirée");
  };

  const submitFlag = (r: Row, reason: string) => {
    mutate(r.productId, r.index, x => pushHistory({ ...x, flagged: true, flagReason: reason }, { action: "flag", note: reason }));
    logAudit({ actor, action: "update", entity: "review", entityId: r.productId, details: `signalé - ${reason}` });
    toast.warning("Avis signalé");
    setFlagOn(null);
  };

  const unflag = (r: Row) => {
    mutate(r.productId, r.index, x => pushHistory({ ...x, flagged: false, flagReason: undefined }, { action: "unflag" }));
    toast.success("Signalement levé");
  };

  // Bulk actions
  const bulkApprove = () => {
    const items = bulk.selectedItems;
    items.forEach(r => mutate(r.productId, r.index, x => pushHistory({ ...x, approved: true }, { action: "approve" })));
    logAudit({ actor, action: "approve", entity: "review", details: `Bulk: ${items.length} avis` });
    toast.success(`${items.length} avis publié(s)`);
    bulk.clear();
  };

  const bulkUnpublish = () => {
    const items = bulk.selectedItems;
    items.forEach(r => mutate(r.productId, r.index, x => pushHistory({ ...x, approved: false }, { action: "unpublish" })));
    toast.success(`${items.length} avis dépublié(s)`);
    bulk.clear();
  };

  const bulkDelete = async () => {
    const items = bulk.selectedItems;
    const ok = await confirm({ title: `Supprimer ${items.length} avis ?`, message: "Action irréversible.", confirmLabel: "Supprimer", tone: "danger" });
    if (!ok) return;
    const all = loadReviews();
    items.forEach(r => {
      if (!all[r.productId]) return;
      all[r.productId] = all[r.productId].filter((_, i) => i !== r.index);
      if (all[r.productId].length === 0) delete all[r.productId];
    });
    saveReviews(all);
    setVersion(v => v + 1);
    logAudit({ actor, action: "delete", entity: "review", details: `Bulk: ${items.length} avis` });
    toast.success(`${items.length} avis supprimé(s)`);
    bulk.clear();
  };

  const counts = {
    all: reviews.length,
    pending: reviews.filter(r => !r.approved).length,
    approved: reviews.filter(r => r.approved).length,
    flagged: reviews.filter(r => r.flagged).length,
    replied: reviews.filter(r => r.reply).length,
  };
  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "-";

  return (
    <div>
      <PageHeader title="Avis clients" subtitle={`${reviews.length} avis · note moyenne ${avgRating}/5 · ${counts.pending} à modérer · ${counts.flagged} signalé(s)`} />

      <DataCard className="mb-4">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <SearchInput value={search} onChange={setSearch} placeholder="Auteur, commentaire, produit…" />
          <div className="flex gap-2 items-center flex-wrap">
            <select value={ratingFilter} onChange={e => setRatingFilter(Number(e.target.value) as any)} className="border border-[var(--ipk-border)] rounded-full px-3 py-1.5 bg-white" style={{ fontSize: "12px" }}>
              <option value={0}>Toutes notes</option>
              {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} étoile{n > 1 ? "s" : ""}</option>)}
            </select>
            <div className="flex gap-1 flex-wrap">
              {(["all", "pending", "approved", "flagged", "replied"] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full ${filter === f ? "bg-[var(--ipk-green-dark)] text-white" : "bg-[var(--ipk-surface)] text-[var(--ipk-text)]"}`} style={{ fontSize: "12px", fontWeight: 500 }}>
                  {f === "all" ? "Tous" : f === "pending" ? "À modérer" : f === "approved" ? "Publiés" : f === "flagged" ? "Signalés" : "Avec réponse"} ({counts[f]})
                </button>
              ))}
            </div>
          </div>
        </div>
      </DataCard>

      <BulkBar count={bulk.count} onClear={bulk.clear}>
        <Button onClick={bulkApprove} className="rounded-lg h-8 px-3 bg-[var(--ipk-green-dark)] hover:bg-[var(--ipk-green-darker)] text-white" style={{ fontSize: "12px" }}>Publier</Button>
        <Button onClick={bulkUnpublish} variant="outline" className="rounded-lg h-8 px-3 bg-white text-[var(--ipk-ink)]" style={{ fontSize: "12px" }}>Dépublier</Button>
        <Button onClick={bulkDelete} className="rounded-lg h-8 px-3 bg-red-600 hover:bg-red-700 text-white" style={{ fontSize: "12px" }}>Supprimer</Button>
      </BulkBar>

      {filtered.length === 0 ? (
        <DataCard><EmptyRow message="Aucun avis ne correspond." /></DataCard>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-2 px-1">
            <SelectCheckbox checked={bulk.allSelected} indeterminate={bulk.someSelected && !bulk.allSelected} onChange={bulk.toggleAll} ariaLabel="Tout sélectionner" />
            <span className="text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>Tout sélectionner ({filtered.length})</span>
          </div>
          <ul className="space-y-3">
            {filtered.map(r => (
              <li key={r.id}>
                <DataCard className={r.flagged ? "border-red-300 bg-red-50/30" : ""}>
                  <div className="flex items-start gap-3">
                    <SelectCheckbox checked={bulk.selected.has(r.id)} onChange={() => bulk.toggle(r.id)} ariaLabel={`Sélectionner avis de ${r.author}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-medium text-[var(--ipk-ink)]">{r.author}</span>
                            <span className="text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>{new Date(r.date).toLocaleDateString("fr-FR")}</span>
                            <StatusPill status={r.approved ? "Publié" : "À modérer"} tone={r.approved ? "success" : "warn"} />
                            {r.flagged && <StatusPill status="Signalé" tone="danger" />}
                            {r.reply && <StatusPill status="Réponse" tone="info" />}
                            {r.verified && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700" style={{ fontSize: "10px", fontWeight: 700 }}>
                                <ShieldCheck className="w-3 h-3" /> Achat vérifié
                              </span>
                            )}
                          </div>
                          <div className="flex gap-0.5 mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "fill-[var(--ipk-amber)] text-[var(--ipk-amber)]" : "text-[var(--ipk-border)]"}`} />
                            ))}
                          </div>
                          <p className="text-[var(--ipk-text)]" style={{ fontSize: "13px", lineHeight: 1.6 }}>{r.comment}</p>
                          {r.flagged && r.flagReason && (
                            <div className="mt-2 px-2 py-1.5 rounded-lg bg-red-100 text-red-800" style={{ fontSize: "11px" }}>
                              <Flag className="w-3 h-3 inline mr-1" /> Motif : {r.flagReason}
                            </div>
                          )}
                          {r.reply && (
                            <div className="mt-2 ml-4 pl-3 border-l-2 border-[var(--ipk-green-dark)]">
                              <div className="flex items-center justify-between gap-2 mb-0.5">
                                <span className="text-[var(--ipk-ink)]" style={{ fontSize: "11px", fontWeight: 600 }}>Réponse de {r.reply.author} · {new Date(r.reply.date).toLocaleDateString("fr-FR")}</span>
                                <button onClick={() => removeReply(r)} className="text-red-600 hover:underline" style={{ fontSize: "11px" }}>Retirer</button>
                              </div>
                              <p className="text-[var(--ipk-text)]" style={{ fontSize: "12px", lineHeight: 1.5 }}>{r.reply.text}</p>
                            </div>
                          )}
                          <div className="text-[var(--ipk-text)] mt-2" style={{ fontSize: "11px" }}>
                            Sur : <span className="font-medium">{r.productName}</span>
                            {r.history && r.history.length > 0 && (
                              <button onClick={() => setHistoryOn(r)} className="ml-2 text-[var(--ipk-blue)] hover:underline">
                                <History className="w-3 h-3 inline mr-0.5" /> Historique ({r.history.length})
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          {r.approved ? (
                            <Button onClick={() => unpublish(r)} variant="outline" className="rounded-lg h-9 w-9 p-0" aria-label="Dépublier" title="Dépublier"><EyeOff className="w-4 h-4" /></Button>
                          ) : (
                            <Button onClick={() => approve(r)} className="bg-[var(--ipk-green-dark)] text-white rounded-lg h-9 w-9 p-0" aria-label="Approuver" title="Approuver"><Check className="w-4 h-4" /></Button>
                          )}
                          <Button onClick={() => setReplyOn(r)} variant="outline" className={`rounded-lg h-9 w-9 p-0 ${r.reply ? "text-[var(--ipk-green-dark)]" : ""}`} aria-label="Répondre" title="Répondre"><MessageCircle className="w-4 h-4" /></Button>
                          {r.flagged ? (
                            <Button onClick={() => unflag(r)} variant="outline" className="rounded-lg h-9 w-9 p-0 text-red-600" aria-label="Lever le signalement" title="Lever le signalement"><Flag className="w-4 h-4 fill-current" /></Button>
                          ) : (
                            <Button onClick={() => setFlagOn(r)} variant="outline" className="rounded-lg h-9 w-9 p-0" aria-label="Signaler" title="Signaler"><Flag className="w-4 h-4" /></Button>
                          )}
                          <Button onClick={() => remove(r)} variant="outline" className="rounded-lg h-9 w-9 p-0 text-red-600" aria-label="Supprimer" title="Supprimer"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </DataCard>
              </li>
            ))}
          </ul>
        </>
      )}

      {replyOn && <ReplyModal review={replyOn} initialText={replyOn.reply?.text || ""} onClose={() => setReplyOn(null)} onSubmit={(t) => submitReply(replyOn, t)} />}
      {flagOn && <FlagModal review={flagOn} onClose={() => setFlagOn(null)} onSubmit={(reason) => submitFlag(flagOn, reason)} />}
      {historyOn && <HistoryModal review={historyOn} onClose={() => setHistoryOn(null)} />}
    </div>
  );
}

function ReplyModal({ review, initialText, onClose, onSubmit }: { review: Row; initialText: string; onClose: () => void; onSubmit: (t: string) => void }) {
  const [text, setText] = useState(initialText);
  return (
    <ModalShell title={review.reply ? "Modifier la réponse" : "Répondre à l'avis"} subtitle={`À ${review.author}`} onClose={onClose}>
      <div className="px-5 py-4 space-y-3">
        <div className="rounded-xl bg-[var(--ipk-surface)] p-3 text-[var(--ipk-text)]" style={{ fontSize: "12px", lineHeight: 1.5 }}>
          « {review.comment} »
        </div>
        <textarea autoFocus value={text} onChange={e => setText(e.target.value)} rows={5} maxLength={500} placeholder="Réponse de la marque (publique)…" className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2 resize-y" style={{ fontSize: "13px" }} />
        <div className="text-right text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>{text.length}/500</div>
      </div>
      <div className="sticky bottom-0 bg-white border-t border-[var(--ipk-border)] px-5 py-3 flex justify-end gap-2">
        <Button onClick={onClose} variant="outline" className="rounded-xl h-10">Annuler</Button>
        <Button onClick={() => onSubmit(text)} className="bg-[var(--ipk-green-dark)] hover:bg-[var(--ipk-green-darker)] text-white rounded-xl h-10 px-4">Publier la réponse</Button>
      </div>
    </ModalShell>
  );
}

const FLAG_REASONS = ["Contenu offensant", "Spam / publicité", "Hors-sujet", "Faux avis suspect", "Violation de confidentialité", "Autre"];

function FlagModal({ review, onClose, onSubmit }: { review: Row; onClose: () => void; onSubmit: (reason: string) => void }) {
  const [reason, setReason] = useState(FLAG_REASONS[0]);
  const [other, setOther] = useState("");
  const submit = () => onSubmit(reason === "Autre" ? (other.trim() || "Autre") : reason);
  return (
    <ModalShell title="Signaler cet avis" subtitle={`Par ${review.author}`} onClose={onClose}>
      <div className="px-5 py-4 space-y-3">
        <div className="space-y-1">
          {FLAG_REASONS.map(r => (
            <label key={r} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--ipk-border)] hover:bg-[var(--ipk-surface)] cursor-pointer">
              <input type="radio" checked={reason === r} onChange={() => setReason(r)} />
              <span style={{ fontSize: "13px" }}>{r}</span>
            </label>
          ))}
        </div>
        {reason === "Autre" && (
          <input value={other} onChange={e => setOther(e.target.value)} placeholder="Précisez le motif…" className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2" style={{ fontSize: "13px" }} />
        )}
      </div>
      <div className="sticky bottom-0 bg-white border-t border-[var(--ipk-border)] px-5 py-3 flex justify-end gap-2">
        <Button onClick={onClose} variant="outline" className="rounded-xl h-10">Annuler</Button>
        <Button onClick={submit} className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-10 px-4">Signaler</Button>
      </div>
    </ModalShell>
  );
}

function HistoryModal({ review, onClose }: { review: Row; onClose: () => void }) {
  const events = review.history || [];
  return (
    <ModalShell title="Historique de modération" subtitle={`Avis de ${review.author}`} onClose={onClose}>
      <div className="px-5 py-4">
        {events.length === 0 ? (
          <div className="text-center py-6 text-[var(--ipk-text)]">Aucun événement enregistré.</div>
        ) : (
          <ol className="space-y-2">
            {[...events].reverse().map((e, i) => (
              <li key={i} className="flex items-start gap-3 p-3 border border-[var(--ipk-border)] rounded-xl">
                <StatusPill status={ACTION_LABEL[e.action] || e.action} tone={ACTION_TONE[e.action] || "neutral"} />
                <div className="flex-1 min-w-0">
                  <div className="text-[var(--ipk-ink)]" style={{ fontSize: "12px", fontWeight: 600 }}>{e.actor}</div>
                  <div className="text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>{new Date(e.date).toLocaleString("fr-FR")}</div>
                  {e.note && <div className="text-[var(--ipk-text)] mt-1 truncate" style={{ fontSize: "12px" }}>« {e.note} »</div>}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
      <div className="sticky bottom-0 bg-white border-t border-[var(--ipk-border)] px-5 py-3 flex justify-end">
        <Button onClick={onClose} variant="outline" className="rounded-xl h-10">Fermer</Button>
      </div>
    </ModalShell>
  );
}

const ACTION_LABEL: Record<string, string> = {
  approve: "Approuvé",
  unpublish: "Dépublié",
  flag: "Signalé",
  unflag: "Déflagué",
  reply: "Réponse",
  "delete-reply": "Réponse retirée",
  edit: "Édité",
};

const ACTION_TONE: Record<string, "success" | "warn" | "danger" | "info" | "neutral"> = {
  approve: "success",
  unpublish: "warn",
  flag: "danger",
  unflag: "neutral",
  reply: "info",
  "delete-reply": "neutral",
  edit: "info",
};

function ModalShell({ title, subtitle, onClose, children }: { title: string; subtitle?: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-xl max-h-[92vh] overflow-y-auto flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-[var(--ipk-border)] px-5 py-4 flex items-center justify-between">
          <div className="min-w-0">
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--ipk-ink)" }}>{title}</h2>
            {subtitle && <p className="text-[var(--ipk-text)] truncate" style={{ fontSize: "12px" }}>{subtitle}</p>}
          </div>
          <Button onClick={onClose} variant="outline" className="rounded-lg h-8 w-8 p-0" aria-label="Fermer"><X className="w-4 h-4" /></Button>
        </div>
        {children}
      </div>
    </div>
  );
}
