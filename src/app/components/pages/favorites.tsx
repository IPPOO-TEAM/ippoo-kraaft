import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Heart, ArrowRight, Share2, Copy, Check, X, GitCompareArrows, ShieldCheck, Package, Star, Trash2, Eye } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { formatPrice } from "../../data/mock-data";
import { LazyImage } from "../lazy-image";
import { useSeo } from "../../hooks/use-seo";
import { useStore } from "../../hooks/use-store";
import { useProducts } from "../../hooks/use-products";
import { useCurrency } from "../../hooks/use-currency";
import { toast } from "sonner";

const MAX_COMPARE = 4;

export function FavoritesPage() {
  const { favorites, removeFavorite, toggleFavorite } = useStore();
  const products = useProducts();
  const { format: formatCurrency, active: activeCurrency } = useCurrency();
  const showPrice = (xof: number) => activeCurrency === "XOF" ? formatPrice(xof) : formatCurrency(xof);
  const [searchParams, setSearchParams] = useSearchParams();
  useSeo({ title: "Mes favoris", description: "Retrouvez vos oeuvres favorites IPPOO KRAAFT.", noIndex: true });

  // Imported list via ?ids= takes precedence as a "preview"
  const importedIds = useMemo(() => {
    const raw = searchParams.get("ids");
    return raw ? raw.split(",").filter(Boolean) : [];
  }, [searchParams]);
  const isImported = importedIds.length > 0;
  const activeIds = isImported ? importedIds : favorites;

  const favProducts = useMemo(
    () => activeIds.map(id => products.find(p => p.id === id)).filter(Boolean) as any[],
    [activeIds, products]
  );

  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Drop missing ids from selection if products list changes
  useEffect(() => {
    setCompareIds(prev => prev.filter(id => activeIds.includes(id)));
  }, [activeIds]);

  const toggleCompare = (id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= MAX_COMPARE) {
        toast.error(`Maximum ${MAX_COMPARE} produits comparables`);
        return prev;
      }
      return [...prev, id];
    });
  };

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const sp = new URLSearchParams({ ids: favorites.join(",") });
    return `${window.location.origin}${window.location.pathname}?${sp.toString()}`;
  }, [favorites]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Lien copié");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Impossible de copier le lien");
    }
  };

  const importAll = () => {
    importedIds.forEach(id => { if (!favorites.includes(id)) toggleFavorite(id); });
    setSearchParams({}, { replace: true });
    toast.success(`${importedIds.length} favori(s) ajouté(s)`);
  };

  const compareProducts = useMemo(
    () => compareIds.map(id => favProducts.find(p => p.id === id)).filter(Boolean) as any[],
    [compareIds, favProducts]
  );

  if (favProducts.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center pb-20 lg:pb-6">
        <div className="w-20 h-20 rounded-full bg-[var(--ipk-surface)] flex items-center justify-center mx-auto mb-4">
          <Heart className="w-9 h-9 text-[var(--ipk-text)]" aria-hidden="true" />
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 4vw, 28px)", fontWeight: 600, color: "var(--ipk-ink)" }}>
          {isImported ? "Liste partagée vide" : "Aucun favori pour le moment"}
        </h1>
        <p className="text-[var(--ipk-text)] mt-2 mb-6" style={{ fontSize: "14px" }}>
          {isImported ? "Cette liste ne contient aucun produit disponible." : "Ajoutez des œuvres à vos favoris depuis la boutique."}
        </p>
        <Link to="/boutique">
          <Button className="bg-[var(--ipk-green-dark)] text-white rounded-xl h-11 px-6">
            Explorer la boutique <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-20 lg:pb-6">
      {/* Imported banner */}
      {isImported && (
        <div className="mb-4 p-3 rounded-xl bg-[#0057FF]/8 border border-[var(--ipk-blue)]/20 flex items-start gap-3">
          <Eye className="w-5 h-5 text-[var(--ipk-blue)] shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="text-[var(--ipk-ink)]" style={{ fontSize: "13px", fontWeight: 600 }}>Vous consultez une liste partagée</div>
            <p className="text-[var(--ipk-text)] mt-0.5" style={{ fontSize: "12px" }}>{favProducts.length} produit{favProducts.length > 1 ? "s" : ""} — importez-les dans vos favoris ou retournez à votre liste.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <Button onClick={importAll} className="bg-[var(--ipk-green-dark)] text-white rounded-xl h-9 px-3" style={{ fontSize: "12px" }}>
              Tout ajouter
            </Button>
            <Button onClick={() => setSearchParams({}, { replace: true })} variant="outline" className="rounded-xl h-9 px-3 border-[var(--ipk-border)]" style={{ fontSize: "12px" }}>
              Ma liste
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 600, color: "var(--ipk-ink)" }}>
            {isImported ? "Liste partagée" : "Mes Favoris"}
          </h1>
          <p className="text-[var(--ipk-text)] mt-1" style={{ fontSize: "14px" }}>
            {favProducts.length} œuvre{favProducts.length > 1 ? "s" : ""} · {compareIds.length} sélectionné{compareIds.length > 1 ? "s" : ""} pour comparaison
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setCompareOpen(true)}
            disabled={compareIds.length < 2}
            className="bg-[var(--ipk-blue)] text-white rounded-xl h-10 px-4 gap-2 disabled:opacity-50"
            style={{ fontSize: "13px" }}
          >
            <GitCompareArrows className="w-4 h-4" /> Comparer ({compareIds.length})
          </Button>
          {!isImported && (
            <Button onClick={() => setShareOpen(true)} variant="outline" className="rounded-xl h-10 px-4 gap-2 border-[var(--ipk-border)]" style={{ fontSize: "13px" }}>
              <Share2 className="w-4 h-4" /> Partager
            </Button>
          )}
        </div>
      </div>

      {compareIds.length > 0 && compareIds.length < 2 && (
        <p className="text-[var(--ipk-text)] mb-3" style={{ fontSize: "12px" }}>Sélectionnez au moins 2 produits pour activer le comparateur (max {MAX_COMPARE}).</p>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {favProducts.map((p) => {
          const sel = compareIds.includes(p.id);
          const promo = (p as any).promo as { percent: number } | undefined;
          const original = (p as any).originalPrice as number | undefined;
          return (
            <div key={p.id} className={`bg-white rounded-2xl overflow-hidden border ${sel ? "border-[var(--ipk-blue)] ring-2 ring-[var(--ipk-blue)]/30" : "border-[var(--ipk-border)]"} relative`}>
              <Link to={`/boutique/${p.slug}`} className="block">
                <div className="relative aspect-square overflow-hidden">
                  <LazyImage src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                  {promo?.percent ? (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-[var(--ipk-green-dark)] text-white border-0" style={{ fontSize: "10px" }}>-{promo.percent}%</Badge>
                    </div>
                  ) : null}
                </div>
                <div className="p-3">
                  <h4 className="truncate" style={{ fontSize: "14px", fontWeight: 600, color: "var(--ipk-ink)" }}>{p.name}</h4>
                  <p className="text-[var(--ipk-text)] truncate mt-0.5" style={{ fontSize: "11px" }}>{p.category}</p>
                  <div className="flex items-baseline gap-1.5 mt-1 flex-wrap">
                    <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--ipk-green)" }}>{showPrice(p.price)}</span>
                    {original && original > p.price && (
                      <span className="line-through text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>{showPrice(original)}</span>
                    )}
                  </div>
                </div>
              </Link>
              <div className="px-3 pb-3 flex items-center gap-2">
                <button
                  onClick={() => toggleCompare(p.id)}
                  className={`flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg border transition-colors ${sel ? "bg-[var(--ipk-blue)] text-white border-[var(--ipk-blue)]" : "border-[var(--ipk-border)] text-[var(--ipk-text)]"}`}
                  style={{ fontSize: "11px", fontWeight: 500 }}
                >
                  <GitCompareArrows className="w-3.5 h-3.5" /> {sel ? "Sélectionné" : "Comparer"}
                </button>
                {!isImported && (
                  <button
                    onClick={() => { removeFavorite(p.id); toast.success("Retiré des favoris"); }}
                    className="p-1.5 rounded-lg border border-[var(--ipk-border)] text-[var(--ipk-text)] hover:text-red-500"
                    aria-label={`Retirer ${p.name} des favoris`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {!isImported && (
                <button
                  onClick={() => { removeFavorite(p.id); toast.success("Retiré des favoris"); }}
                  className="absolute top-2 right-2 w-9 h-9 bg-white/95 rounded-full flex items-center justify-center shadow-sm"
                  aria-label={`Retirer ${p.name} des favoris`}
                >
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" aria-hidden="true" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Share modal */}
      {shareOpen && (
        <ModalShell onClose={() => setShareOpen(false)} title="Partager ma liste">
          <p className="text-[var(--ipk-text)] mb-3" style={{ fontSize: "13px" }}>
            Toute personne avec ce lien verra vos {favorites.length} produits favoris et pourra les importer dans son compte.
          </p>
          <div className="flex gap-2">
            <input readOnly value={shareUrl} className="flex-1 bg-[var(--ipk-surface)] border border-[var(--ipk-border)] rounded-xl px-3 py-2 truncate" style={{ fontSize: "12px" }} />
            <Button onClick={handleCopy} className="bg-[var(--ipk-green-dark)] text-white rounded-xl h-10 px-3 gap-1.5">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copié" : "Copier"}
            </Button>
          </div>
        </ModalShell>
      )}

      {/* Compare modal */}
      {compareOpen && compareProducts.length >= 2 && (
        <ModalShell onClose={() => setCompareOpen(false)} title={`Comparateur (${compareProducts.length})`} wide>
          <CompareTable products={compareProducts} showPrice={showPrice} onRemove={(id) => toggleCompare(id)} />
        </ModalShell>
      )}
    </div>
  );
}

function ModalShell({ children, onClose, title, wide }: { children: React.ReactNode; onClose: () => void; title: string; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-stretch sm:items-center justify-center p-0 sm:p-4">
      <div className={`bg-white rounded-none sm:rounded-2xl w-full ${wide ? "max-w-6xl" : "max-w-md"} max-h-screen sm:max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b border-[var(--ipk-border)] sticky top-0 bg-white z-10">
          <h2 className="text-[var(--ipk-ink)]" style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 600 }}>{title}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-[var(--ipk-surface)] rounded-lg" aria-label="Fermer">
            <X className="w-5 h-5 text-[var(--ipk-text)]" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function CompareTable({ products, showPrice, onRemove }: { products: any[]; showPrice: (xof: number) => string; onRemove: (id: string) => void }) {
  type RowDef = {
    label: string;
    get: (p: any) => React.ReactNode;
    rawValues: (p: any) => string;
    highlight?: "max" | "min";
    rawNum?: (p: any) => number | null;
  };

  const rows: RowDef[] = [
    {
      label: "Prix",
      get: (p) => {
        const original = (p as any).originalPrice;
        return (
          <div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--ipk-green)" }}>{showPrice(p.price)}</div>
            {original && original > p.price && <div className="line-through text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>{showPrice(original)}</div>}
          </div>
        );
      },
      rawValues: (p) => String(p.price),
      rawNum: (p) => p.price,
      highlight: "min",
    },
    { label: "Catégorie", get: (p) => p.category, rawValues: (p) => p.category },
    { label: "Technique", get: (p) => p.technique, rawValues: (p) => p.technique },
    {
      label: "Note",
      get: (p) => (
        <span className="inline-flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-[var(--ipk-amber)] text-[var(--ipk-amber)]" /> {p.rating} ({p.reviewCount})
        </span>
      ),
      rawValues: (p) => String(p.rating),
      rawNum: (p) => p.rating,
      highlight: "max",
    },
    {
      label: "Stock",
      get: (p) => p.stock > 0 ? (
        <span className="inline-flex items-center gap-1 text-[var(--ipk-green-dark)]"><Package className="w-3.5 h-3.5" /> {p.stock} dispo</span>
      ) : <span className="text-red-500">Épuisé</span>,
      rawValues: (p) => String(p.stock),
      rawNum: (p) => p.stock,
      highlight: "max",
    },
    {
      label: "Matériaux",
      get: (p) => (
        <div className="flex flex-wrap gap-1">
          {(p.materials || []).map((m: string, i: number) => (
            <span key={i} className="px-1.5 py-0.5 rounded bg-[var(--ipk-surface)] text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>{m}</span>
          ))}
        </div>
      ),
      rawValues: (p) => (p.materials || []).join("|"),
    },
    { label: "Dimensions", get: (p) => p.dimensions || "—", rawValues: (p) => p.dimensions || "" },
    { label: "Poids", get: (p) => p.weight || "—", rawValues: (p) => p.weight || "" },
    { label: "Origine", get: (p) => `${p.origin?.region || ""}, ${p.origin?.country || ""}`, rawValues: (p) => `${p.origin?.region || ""}|${p.origin?.country || ""}` },
    {
      label: "Certifications",
      get: (p) => {
        const validated = (p.norms || []).filter((n: any) => n.status === "Validé").length;
        const total = (p.norms || []).length;
        return (
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className={`w-3.5 h-3.5 ${validated > 0 ? "text-[var(--ipk-green-dark)]" : "text-[var(--ipk-text)]"}`} />
            {validated}/{total} validée{total > 1 ? "s" : ""}
          </span>
        );
      },
      rawValues: (p) => `${(p.norms || []).filter((n: any) => n.status === "Validé").length}/${(p.norms || []).length}`,
      rawNum: (p) => (p.norms || []).filter((n: any) => n.status === "Validé").length,
      highlight: "max",
    },
    {
      label: "Type",
      get: (p) => (
        <div className="flex flex-wrap gap-1">
          {p.isUnique && <Badge className="bg-[var(--ipk-green-dark)] text-white border-0" style={{ fontSize: "10px" }}>Pièce unique</Badge>}
          {p.isExclusive && <Badge className="bg-[var(--ipk-blue)] text-white border-0" style={{ fontSize: "10px" }}>Exclusivité</Badge>}
          {!p.isUnique && !p.isExclusive && <span className="text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>—</span>}
        </div>
      ),
      rawValues: (p) => `${!!p.isUnique}|${!!p.isExclusive}`,
    },
    { label: "Entretien", get: (p) => p.care || "—", rawValues: (p) => p.care || "" },
  ];

  const isDifferent = (row: RowDef) => {
    const set = new Set(products.map(p => row.rawValues(p)));
    return set.size > 1;
  };

  const bestId = (row: RowDef): string | null => {
    if (!row.highlight || !row.rawNum) return null;
    const vals = products.map(p => ({ id: p.id, n: row.rawNum!(p) })).filter(x => x.n !== null) as { id: string; n: number }[];
    if (vals.length === 0) return null;
    const sorted = [...vals].sort((a, b) => row.highlight === "max" ? b.n - a.n : a.n - b.n);
    if (sorted.length > 1 && sorted[0].n === sorted[1].n) return null;
    return sorted[0].id;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left p-2 sticky left-0 bg-white z-10 border-b border-[var(--ipk-border)]" style={{ fontSize: "12px", color: "var(--ipk-text)", fontWeight: 600, minWidth: "120px" }}>Critère</th>
            {products.map(p => (
              <th key={p.id} className="p-2 border-b border-[var(--ipk-border)] align-top" style={{ minWidth: "180px" }}>
                <div className="relative">
                  <button
                    onClick={() => onRemove(p.id)}
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white border border-[var(--ipk-border)] flex items-center justify-center text-[var(--ipk-text)] hover:text-red-500 z-10"
                    aria-label="Retirer du comparateur"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <Link to={`/boutique/${p.slug}`} className="block">
                    <div className="aspect-square w-full overflow-hidden rounded-lg bg-[var(--ipk-surface)] mb-2">
                      <LazyImage src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-[var(--ipk-ink)] truncate" style={{ fontSize: "13px", fontWeight: 600 }}>{p.name}</div>
                  </Link>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => {
            const diff = isDifferent(row);
            const best = bestId(row);
            return (
              <tr key={row.label} className={diff ? "bg-amber-50/40" : ""}>
                <td className="p-2 sticky left-0 bg-white z-10 border-b border-[var(--ipk-border)]/60 align-top" style={{ fontSize: "12px", color: "var(--ipk-text)", fontWeight: 600 }}>
                  <div className="flex items-center gap-1.5">
                    {row.label}
                    {diff && <span className="w-1.5 h-1.5 rounded-full bg-[var(--ipk-amber)]" title="Diffère selon les produits" />}
                  </div>
                </td>
                {products.map(p => (
                  <td key={p.id} className={`p-2 border-b border-[var(--ipk-border)]/60 align-top ${best === p.id ? "bg-[#0B6B3A]/8" : ""}`} style={{ fontSize: "13px", color: "var(--ipk-ink)" }}>
                    <div className="flex items-start gap-1.5">
                      <span className="flex-1 min-w-0">{row.get(p)}</span>
                      {best === p.id && <ShieldCheck className="w-3.5 h-3.5 text-[var(--ipk-green-dark)] shrink-0 mt-0.5" />}
                    </div>
                  </td>
                ))}
              </tr>
            );
          })}
          <tr>
            <td className="p-2 sticky left-0 bg-white z-10" />
            {products.map(p => (
              <td key={p.id} className="p-2">
                <Link to={`/boutique/${p.slug}`} className="inline-flex items-center justify-center w-full px-3 py-2 rounded-xl bg-[var(--ipk-green-dark)] text-white" style={{ fontSize: "12px", fontWeight: 500 }}>
                  Voir la fiche <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <p className="text-[var(--ipk-text)] mt-3" style={{ fontSize: "11px" }}>
        Les lignes en jaune indiquent une différence. Le surlignage vert et l'icône signalent la meilleure valeur.
      </p>
    </div>
  );
}
