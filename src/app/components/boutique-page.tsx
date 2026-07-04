import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Search, SlidersHorizontal, Star, Grid3X3, LayoutGrid, X, ChevronDown, Hammer, Scissors, Coffee, ShoppingBasket, Gem, Wrench, Briefcase, Music, ShieldCheck, PackageCheck } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { formatPrice } from "../data/mock-data";
import { useProducts, useArtisans } from "../hooks/use-products";
import { useCategories } from "../hooks/use-categories";
import { useCurrency } from "../hooks/use-currency";
import { CRAFT_TAXONOMY, findBySlug, nicheLabel, effectiveNiches } from "../data/craft-taxonomy";
import { LazyImage } from "./lazy-image";
import { useSeo } from "../hooks/use-seo";
import { EmptyState } from "./empty-state";

const categoryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Hammer, Scissors, Coffee, ShoppingBasket, Gem, Wrench, Briefcase, Music,
};

function tokens(q: string): string[] {
  return q.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(/\s+/).filter(t => t.length >= 2);
}

function scoreProduct(p: any, toks: string[]): number {
  if (toks.length === 0) return 0;
  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const name = norm(p.name || "");
  const cat = norm(p.category || "");
  const tech = norm(p.technique || "");
  const mats = (p.materials || []).map((m: string) => norm(m)).join(" ");
  const story = norm(p.story || p.description || "");
  const region = norm(`${p.origin?.region || ""} ${p.origin?.country || ""}`);
  let score = 0;
  for (const t of toks) {
    if (name.startsWith(t)) score += 12;
    else if (name.includes(t)) score += 8;
    if (cat.includes(t)) score += 5;
    if (tech.includes(t)) score += 4;
    if (mats.includes(t)) score += 3;
    if (region.includes(t)) score += 2;
    if (story.includes(t)) score += 1;
  }
  return score;
}

export function BoutiquePage() {
  useSeo({
    title: "Boutique - Artisanat africain certifié",
    description: "Parcourez notre boutique : sculptures, textiles, poteries, vannerie, bijoux. Chaque oeuvre est tracée et certifiée IPPOO KRAAFT.",
  });
  const navigate = useNavigate();
  const { visibleCategories: categories } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();
  const { format: formatCurrency, convert, active: activeCurrency, def } = useCurrency();
  const showPrice = (xof: number) => activeCurrency === "XOF" ? formatPrice(xof) : formatCurrency(xof);

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("cat") || "");
  const [selectedBadge, setSelectedBadge] = useState(searchParams.get("badge") || "");
  const [selectedDomain, setSelectedDomain] = useState<string>(searchParams.get("dom") || "");
  const [selectedNiches, setSelectedNiches] = useState<string[]>(() => {
    const n = searchParams.get("niches");
    return n ? n.split(",").filter(Boolean) : [];
  });
  const [selectedTechnique, setSelectedTechnique] = useState<string>(searchParams.get("tech") || "");
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(() => {
    const m = searchParams.get("mat");
    return m ? m.split(",").filter(Boolean) : [];
  });
  const [certifiedOnly, setCertifiedOnly] = useState(searchParams.get("cert") === "1");
  const [inStockOnly, setInStockOnly] = useState(searchParams.get("stock") === "1");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || (searchParams.get("q") ? "relevance" : "newest"));
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid2" | "grid3">("grid2");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [showUnique, setShowUnique] = useState(false);
  const [showExclusive, setShowExclusive] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const products = useProducts();
  const artisans = useArtisans();

  // Derived option lists
  const allTechniques = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => { if (p.technique) set.add(p.technique); });
    return Array.from(set).sort();
  }, [products]);
  const allMaterials = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => (p.materials || []).forEach(m => set.add(m)));
    return Array.from(set).sort();
  }, [products]);

  const toks = useMemo(() => tokens(search), [search]);

  const scored = useMemo(() => {
    if (toks.length === 0) return products.map(p => ({ p, s: 0 }));
    return products
      .map(p => ({ p, s: scoreProduct(p, toks) }))
      .filter(x => x.s > 0);
  }, [products, toks]);

  const suggestions = useMemo(() => {
    if (toks.length === 0) return [];
    return [...scored].sort((a, b) => b.s - a.s).slice(0, 5).map(x => x.p);
  }, [scored, toks]);

  const filteredProducts = useMemo(() => {
    let result = scored.map(x => ({ ...x }));
    if (selectedCategory) result = result.filter(x => x.p.category === selectedCategory);
    if (selectedBadge) result = result.filter(x => (x.p.badges || []).includes(selectedBadge));
    if (selectedDomain) {
      const domain = CRAFT_TAXONOMY.find(d => d.slug === selectedDomain);
      const slugs = new Set<string>();
      domain?.niches.forEach(n => { slugs.add(n.slug); n.subNiches?.forEach(s => slugs.add(`${n.slug}/${s.slug}`)); });
      result = result.filter(x => effectiveNiches(x.p).some(s => slugs.has(s)));
    }
    if (selectedNiches.length > 0) result = result.filter(x => effectiveNiches(x.p).some(s => selectedNiches.includes(s)));
    if (selectedTechnique) result = result.filter(x => x.p.technique === selectedTechnique);
    if (selectedMaterials.length > 0) result = result.filter(x => (x.p.materials || []).some(m => selectedMaterials.includes(m)));
    if (certifiedOnly) result = result.filter(x => (x.p.norms || []).some((n: any) => n.status === "Validé"));
    if (inStockOnly) result = result.filter(x => x.p.stock > 0);
    if (showUnique) result = result.filter(x => x.p.isUnique);
    if (showExclusive) result = result.filter(x => x.p.isExclusive);
    result = result.filter(x => x.p.price >= priceRange[0] && x.p.price <= priceRange[1]);
    switch (sortBy) {
      case "price-asc": result.sort((a, b) => a.p.price - b.p.price); break;
      case "price-desc": result.sort((a, b) => b.p.price - a.p.price); break;
      case "rating": result.sort((a, b) => b.p.rating - a.p.rating); break;
      case "popular": result.sort((a, b) => (b.p.reviewCount || 0) - (a.p.reviewCount || 0)); break;
      case "relevance": result.sort((a, b) => b.s - a.s); break;
      default: break;
    }
    return result.map(x => x.p);
  }, [scored, selectedCategory, selectedBadge, selectedDomain, selectedNiches, selectedTechnique, selectedMaterials, certifiedOnly, inStockOnly, sortBy, priceRange, showUnique, showExclusive]);

  const allBadges = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => (p.badges || []).forEach(b => set.add(b)));
    return Array.from(set).sort();
  }, [products]);

  const activeFilterCount =
    [selectedCategory, selectedBadge, selectedDomain, selectedTechnique, certifiedOnly, inStockOnly, showUnique, showExclusive]
      .filter(Boolean).length + selectedNiches.length + selectedMaterials.length;

  const visibleNiches = useMemo(() => {
    const dom = selectedDomain ? CRAFT_TAXONOMY.find(d => d.slug === selectedDomain) : null;
    if (!dom) return [];
    return dom.niches.flatMap(n => [
      { slug: n.slug, label: n.label, isSub: false },
      ...(n.subNiches || []).map(s => ({ slug: `${n.slug}/${s.slug}`, label: s.label, isSub: true })),
    ]);
  }, [selectedDomain]);
  const toggleNiche = (slug: string) => setSelectedNiches(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);
  const toggleMaterial = (m: string) => setSelectedMaterials(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);

  // Sync URL
  useEffect(() => {
    const sp = new URLSearchParams();
    if (search) sp.set("q", search);
    if (selectedCategory) sp.set("cat", selectedCategory);
    if (selectedBadge) sp.set("badge", selectedBadge);
    if (selectedDomain) sp.set("dom", selectedDomain);
    if (selectedNiches.length) sp.set("niches", selectedNiches.join(","));
    if (selectedTechnique) sp.set("tech", selectedTechnique);
    if (selectedMaterials.length) sp.set("mat", selectedMaterials.join(","));
    if (certifiedOnly) sp.set("cert", "1");
    if (inStockOnly) sp.set("stock", "1");
    if (sortBy !== "newest" && !(sortBy === "relevance" && search)) sp.set("sort", sortBy);
    setSearchParams(sp, { replace: true });
  }, [search, selectedCategory, selectedBadge, selectedDomain, selectedNiches, selectedTechnique, selectedMaterials, certifiedOnly, inStockOnly, sortBy, setSearchParams]);

  // Switch to relevance when user types
  useEffect(() => {
    if (search && sortBy === "newest") setSortBy("relevance");
    if (!search && sortBy === "relevance") setSortBy("newest");
  }, [search]);

  // Close suggestions on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSuggestOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const resetAll = () => {
    setSearch(""); setSelectedCategory(""); setSelectedBadge(""); setSelectedDomain(""); setSelectedNiches([]);
    setSelectedTechnique(""); setSelectedMaterials([]); setCertifiedOnly(false); setInStockOnly(false);
    setShowUnique(false); setShowExclusive(false); setPriceRange([0, 500000]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="mb-6">
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 600, color: "var(--ipk-ink)" }}>
          Boutique
        </h1>
        <p className="text-[var(--ipk-text)] mt-1" style={{ fontSize: "15px" }}>
          {filteredProducts.length} oeuvre{filteredProducts.length > 1 ? "s" : ""} artisanale{filteredProducts.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Search & Filters bar */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ipk-text)]" />
          <input
            type="text"
            placeholder="Rechercher par nom, technique, matière, région…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setSuggestOpen(true); }}
            onFocus={() => setSuggestOpen(true)}
            className="w-full pl-10 pr-9 py-2.5 bg-[var(--ipk-surface)] border border-[var(--ipk-border)] rounded-xl"
            style={{ fontSize: "14px" }}
          />
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(""); setSuggestOpen(false); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[var(--ipk-text)] hover:text-[var(--ipk-ink)]"
              aria-label="Effacer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {suggestOpen && suggestions.length > 0 && (
            <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-[var(--ipk-border)] rounded-xl shadow-lg overflow-hidden">
              <div className="px-3 py-2 border-b border-[var(--ipk-border)] text-[var(--ipk-text)]" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em" }}>
                SUGGESTIONS
              </div>
              <ul>
                {suggestions.map(p => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); navigate(`/boutique/${p.slug}`); setSuggestOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[var(--ipk-surface)] text-left"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-[var(--ipk-surface)] shrink-0">
                        <LazyImage src={p.images[0]} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[var(--ipk-ink)] truncate" style={{ fontSize: "13px", fontWeight: 600 }}>{p.name}</div>
                        <div className="text-[var(--ipk-text)] truncate" style={{ fontSize: "11px" }}>{p.category} · {p.technique}</div>
                      </div>
                      <div className="text-[var(--ipk-green)] shrink-0" style={{ fontSize: "12px", fontWeight: 700 }}>{showPrice(p.price)}</div>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="px-3 py-2 border-t border-[var(--ipk-border)] text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>
                Appuyer sur Entrée pour voir les {filteredProducts.length} résultat{filteredProducts.length > 1 ? "s" : ""}
              </div>
            </div>
          )}
        </div>
        <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="rounded-xl border-[var(--ipk-border)] gap-2 relative">
              <SlidersHorizontal className="w-4 h-4" /> Filtres
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[var(--ipk-green-dark)] text-white w-4 h-4 rounded-full flex items-center justify-center" style={{ fontSize: "10px" }}>{activeFilterCount}</span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh]">
            <SheetHeader>
              <SheetTitle>Filtres</SheetTitle>
            </SheetHeader>
            <div className="p-4 space-y-6 overflow-y-auto">
              {/* Quick toggles */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCertifiedOnly(v => !v)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors ${certifiedOnly ? "bg-[var(--ipk-green-dark)] text-white border-[var(--ipk-green-dark)]" : "border-[var(--ipk-border)] text-[var(--ipk-text)]"}`}
                  style={{ fontSize: "13px" }}
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Certifié IPPOO
                </button>
                <button
                  onClick={() => setInStockOnly(v => !v)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors ${inStockOnly ? "bg-[var(--ipk-blue)] text-white border-[var(--ipk-blue)]" : "border-[var(--ipk-border)] text-[var(--ipk-text)]"}`}
                  style={{ fontSize: "13px" }}
                >
                  <PackageCheck className="w-3.5 h-3.5" /> Disponible immédiatement
                </button>
              </div>
              {/* Categories */}
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--ipk-ink)" }} className="mb-3">Catégorie</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`px-3 py-1.5 rounded-full border transition-colors ${!selectedCategory ? "bg-[var(--ipk-green-dark)] text-white border-[var(--ipk-green-dark)]" : "border-[var(--ipk-border)] text-[var(--ipk-text)]"}`}
                    style={{ fontSize: "13px" }}
                  >
                    Toutes
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(selectedCategory === cat.name ? "" : cat.name)}
                      className={`px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1 ${selectedCategory === cat.name ? "bg-[var(--ipk-blue)] text-white border-[var(--ipk-blue)]" : "border-[var(--ipk-border)] text-[var(--ipk-text)]"}`}
                      style={{ fontSize: "13px" }}
                    >
                      {(() => { const Icon = categoryIconMap[cat.icon]; return Icon ? <Icon className="w-3.5 h-3.5" /> : null; })()} {cat.name}
                    </button>
                  ))}
                </div>
              </div>
              {/* Technique */}
              {allTechniques.length > 0 && (
                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--ipk-ink)" }} className="mb-3">Technique</h4>
                  <select
                    value={selectedTechnique}
                    onChange={(e) => setSelectedTechnique(e.target.value)}
                    className="w-full bg-[var(--ipk-surface)] border border-[var(--ipk-border)] rounded-xl px-3 py-2"
                    style={{ fontSize: "13px" }}
                  >
                    <option value="">Toutes les techniques</option>
                    {allTechniques.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              )}
              {/* Matériaux */}
              {allMaterials.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--ipk-ink)" }}>Matériaux</h4>
                    {selectedMaterials.length > 0 && (
                      <button onClick={() => setSelectedMaterials([])} className="text-[var(--ipk-text)] hover:text-[var(--ipk-ink)]" style={{ fontSize: "12px" }}>
                        Effacer ({selectedMaterials.length})
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto">
                    {allMaterials.map(m => {
                      const sel = selectedMaterials.includes(m);
                      return (
                        <button
                          key={m}
                          onClick={() => toggleMaterial(m)}
                          className={`px-2 py-1 rounded-full border ${sel ? "bg-[var(--ipk-green-dark)] border-[var(--ipk-green-dark)] text-white" : "border-[var(--ipk-border)] text-[var(--ipk-text)]"}`}
                          style={{ fontSize: "11px" }}
                        >
                          {m}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* Badges éditoriaux */}
              {allBadges.length > 0 && (
                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--ipk-ink)" }} className="mb-3">Badge</h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedBadge("")}
                      className={`px-3 py-1.5 rounded-full border transition-colors ${!selectedBadge ? "bg-[var(--ipk-green-dark)] text-white border-[var(--ipk-green-dark)]" : "border-[var(--ipk-border)] text-[var(--ipk-text)]"}`}
                      style={{ fontSize: "13px" }}
                    >
                      Tous
                    </button>
                    {allBadges.map(b => (
                      <button
                        key={b}
                        onClick={() => setSelectedBadge(selectedBadge === b ? "" : b)}
                        className={`px-3 py-1.5 rounded-full border transition-colors ${selectedBadge === b ? "bg-[var(--ipk-blue)] text-white border-[var(--ipk-blue)]" : "border-[var(--ipk-border)] text-[var(--ipk-text)]"}`}
                        style={{ fontSize: "13px" }}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* Domaine d'artisanat */}
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--ipk-ink)" }} className="mb-3">Domaine d'artisanat</h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  <button
                    onClick={() => { setSelectedDomain(""); setSelectedNiches([]); }}
                    className={`px-3 py-1.5 rounded-full border transition-colors ${!selectedDomain ? "bg-[var(--ipk-green-dark)] text-white border-[var(--ipk-green-dark)]" : "border-[var(--ipk-border)] text-[var(--ipk-text)]"}`}
                    style={{ fontSize: "13px" }}
                  >
                    Tous domaines
                  </button>
                  {CRAFT_TAXONOMY.map(d => (
                    <button
                      key={d.slug}
                      onClick={() => { setSelectedDomain(selectedDomain === d.slug ? "" : d.slug); setSelectedNiches([]); }}
                      className={`px-3 py-1.5 rounded-full border transition-colors ${selectedDomain === d.slug ? "bg-[var(--ipk-blue)] text-white border-[var(--ipk-blue)]" : "border-[var(--ipk-border)] text-[var(--ipk-text)]"}`}
                      style={{ fontSize: "12px" }}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
                {visibleNiches.length > 0 && (
                  <div className="border-t border-[var(--ipk-border)] pt-3">
                    <p className="text-[var(--ipk-text)] mb-2" style={{ fontSize: "11px" }}>Niches du domaine ({selectedNiches.length} sélectionnée{selectedNiches.length > 1 ? "s" : ""})</p>
                    <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                      {visibleNiches.map(n => {
                        const sel = selectedNiches.includes(n.slug);
                        return (
                          <button
                            key={n.slug}
                            onClick={() => toggleNiche(n.slug)}
                            className={`px-2 py-1 rounded-full border ${sel ? (n.isSub ? "bg-[var(--ipk-blue)] border-[var(--ipk-blue)] text-white" : "bg-[var(--ipk-green-dark)] border-[var(--ipk-green-dark)] text-white") : "border-[var(--ipk-border)] text-[var(--ipk-text)]"} ${n.isSub ? "ml-2" : ""}`}
                            style={{ fontSize: n.isSub ? "10px" : "11px" }}
                          >
                            {n.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              {/* Unique/Exclusive */}
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--ipk-ink)" }} className="mb-3">Type</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowUnique(!showUnique)}
                    className={`px-3 py-1.5 rounded-full border transition-colors ${showUnique ? "bg-[var(--ipk-green-dark)] text-white border-[var(--ipk-green-dark)]" : "border-[var(--ipk-border)] text-[var(--ipk-text)]"}`}
                    style={{ fontSize: "13px" }}
                  >
                    Pièces uniques
                  </button>
                  <button
                    onClick={() => setShowExclusive(!showExclusive)}
                    className={`px-3 py-1.5 rounded-full border transition-colors ${showExclusive ? "bg-[var(--ipk-blue)] text-white border-[var(--ipk-blue)]" : "border-[var(--ipk-border)] text-[var(--ipk-text)]"}`}
                    style={{ fontSize: "13px" }}
                  >
                    Exclusivités
                  </button>
                </div>
              </div>
              {/* Price */}
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--ipk-ink)" }} className="mb-3">
                  Prix : {activeCurrency === "XOF" ? `${priceRange[0].toLocaleString('fr-FR')} - ${priceRange[1].toLocaleString('fr-FR')} ${def.symbol}` : `${formatCurrency(priceRange[0])} - ${formatCurrency(priceRange[1])}`}
                </h4>
                <input
                  type="range"
                  min={0}
                  max={500000}
                  step={5000}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-[var(--ipk-green-dark)]"
                />
                {activeCurrency !== "XOF" && (
                  <p className="text-[var(--ipk-text)] mt-1" style={{ fontSize: "11px" }}>Conversion à titre indicatif depuis {priceRange[0].toLocaleString('fr-FR')} - {priceRange[1].toLocaleString('fr-FR')} Fcfa</p>
                )}
              </div>
              <div className="flex gap-3">
                <Button onClick={resetAll} variant="outline" className="flex-1 rounded-xl">
                  Réinitialiser
                </Button>
                <Button onClick={() => setFiltersOpen(false)} className="flex-1 bg-[var(--ipk-green-dark)] text-white rounded-xl">
                  Appliquer
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active filters */}
      {(selectedCategory || selectedDomain || selectedNiches.length > 0 || selectedTechnique || selectedMaterials.length > 0 || certifiedOnly || inStockOnly || showUnique || showExclusive) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedCategory && (
            <Badge className="bg-[#0057FF]/10 text-[var(--ipk-blue)] border-0 gap-1 cursor-pointer" onClick={() => setSelectedCategory("")}>
              {selectedCategory} <X className="w-3 h-3" />
            </Badge>
          )}
          {selectedTechnique && (
            <Badge className="bg-[#0057FF]/10 text-[var(--ipk-blue)] border-0 gap-1 cursor-pointer" onClick={() => setSelectedTechnique("")}>
              {selectedTechnique} <X className="w-3 h-3" />
            </Badge>
          )}
          {selectedMaterials.map(m => (
            <Badge key={m} className="bg-[#0B6B3A]/10 text-[var(--ipk-green-dark)] border-0 gap-1 cursor-pointer" onClick={() => toggleMaterial(m)}>
              {m} <X className="w-3 h-3" />
            </Badge>
          ))}
          {certifiedOnly && (
            <Badge className="bg-[#0B6B3A]/10 text-[var(--ipk-green-dark)] border-0 gap-1 cursor-pointer" onClick={() => setCertifiedOnly(false)}>
              <ShieldCheck className="w-3 h-3" /> Certifié IPPOO <X className="w-3 h-3" />
            </Badge>
          )}
          {inStockOnly && (
            <Badge className="bg-[#0057FF]/10 text-[var(--ipk-blue)] border-0 gap-1 cursor-pointer" onClick={() => setInStockOnly(false)}>
              <PackageCheck className="w-3 h-3" /> En stock <X className="w-3 h-3" />
            </Badge>
          )}
          {selectedDomain && (
            <Badge className="bg-[#0B6B3A]/10 text-[var(--ipk-green-dark)] border-0 gap-1 cursor-pointer" onClick={() => { setSelectedDomain(""); setSelectedNiches([]); }}>
              {CRAFT_TAXONOMY.find(d => d.slug === selectedDomain)?.label} <X className="w-3 h-3" />
            </Badge>
          )}
          {selectedNiches.map(s => (
            <Badge key={s} className="bg-[#0057FF]/10 text-[var(--ipk-blue)] border-0 gap-1 cursor-pointer" onClick={() => toggleNiche(s)}>
              {findBySlug(s)?.label || nicheLabel(s)} <X className="w-3 h-3" />
            </Badge>
          ))}
          {showUnique && (
            <Badge className="bg-[#0B6B3A]/10 text-[var(--ipk-green-dark)] border-0 gap-1 cursor-pointer" onClick={() => setShowUnique(false)}>
              Pièces uniques <X className="w-3 h-3" />
            </Badge>
          )}
          {showExclusive && (
            <Badge className="bg-[#0057FF]/10 text-[var(--ipk-blue)] border-0 gap-1 cursor-pointer" onClick={() => setShowExclusive(false)}>
              Exclusivités <X className="w-3 h-3" />
            </Badge>
          )}
        </div>
      )}

      {/* Sort & View */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: "13px", color: "var(--ipk-text)" }}>Tri :</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[var(--ipk-surface)] border border-[var(--ipk-border)] rounded-lg px-2 py-1.5"
            style={{ fontSize: "13px" }}
          >
            {search && <option value="relevance">Pertinence</option>}
            <option value="newest">Nouveautés</option>
            <option value="popular">Populaires</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="rating">Mieux noté</option>
          </select>
        </div>
        <div className="hidden sm:flex items-center gap-1">
          <button
            onClick={() => setViewMode("grid2")}
            aria-label="Affichage 2 colonnes"
            aria-pressed={viewMode === "grid2"}
            className={`p-1.5 rounded ${viewMode === "grid2" ? "bg-[#0B6B3A]/10 text-[var(--ipk-green-dark)]" : "text-[var(--ipk-text)]"}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("grid3")}
            aria-label="Affichage 3 colonnes"
            aria-pressed={viewMode === "grid3"}
            className={`p-1.5 rounded ${viewMode === "grid3" ? "bg-[#0B6B3A]/10 text-[var(--ipk-green-dark)]" : "text-[var(--ipk-text)]"}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product grid */}
      <div className={`grid gap-3 sm:gap-4 ${viewMode === "grid3" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "grid-cols-2 lg:grid-cols-3"}`}>
        {filteredProducts.map((product) => {
          const artisan = artisans.find(a => a.id === product.artisanId);
          const promo = (product as any).promo as { percent: number } | undefined;
          const original = (product as any).originalPrice as number | undefined;
          return (
            <Link key={product.id} to={`/boutique/${product.slug}`} className="bg-white rounded-2xl overflow-hidden border border-[var(--ipk-border)] group hover:shadow-lg transition-shadow">
              <div className="relative aspect-square overflow-hidden">
                <LazyImage src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {promo?.percent ? <Badge className="bg-[var(--ipk-green-dark)] text-white border-0" style={{ fontSize: "10px" }}>-{promo.percent}%</Badge> : null}
                  {product.isUnique && <Badge className="bg-[var(--ipk-green-dark)] text-white border-0" style={{ fontSize: "10px" }}>Pièce unique</Badge>}
                  {product.isExclusive && <Badge className="bg-[var(--ipk-blue)] text-white border-0" style={{ fontSize: "10px" }}>Exclusivité</Badge>}
                  {product.stock < 3 && product.stock > 0 && <Badge className="bg-[var(--ipk-amber)] text-white border-0" style={{ fontSize: "10px" }}>Dernières pièces</Badge>}
                  {product.stock === 0 && <Badge className="bg-[var(--ipk-text)] text-white border-0" style={{ fontSize: "10px" }}>Épuisé</Badge>}
                </div>
              </div>
              <div className="p-2.5 sm:p-3">
                <h4 className="text-[var(--ipk-ink)] truncate" style={{ fontSize: "13px", fontWeight: 600 }}>{product.name}</h4>
                <p className="text-[var(--ipk-text)] truncate mt-0.5" style={{ fontSize: "11px" }}>{product.origin.region}, {product.origin.country}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 fill-[var(--ipk-amber)] text-[var(--ipk-amber)]" />
                  <span style={{ fontSize: "11px", color: "var(--ipk-text)" }}>{product.rating} ({product.reviewCount})</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {product.norms.slice(0, 1).map((n, i) => (
                    <Badge key={i} variant="outline" className="border-[var(--ipk-blue)] text-[var(--ipk-blue)]" style={{ fontSize: "9px", padding: "1px 5px" }}>{n.status === "Validé" ? "Certifié" : "En cours"}</Badge>
                  ))}
                </div>
                <div className="flex items-baseline gap-1.5 mt-1.5 flex-wrap">
                  <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--ipk-green)" }}>{showPrice(product.price)}</span>
                  {original && original > product.price && (
                    <span className="line-through text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>{showPrice(original)}</span>
                  )}
                </div>
                {(() => {
                  const ns = effectiveNiches(product).slice(0, 2);
                  if (ns.length === 0) return null;
                  return (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {ns.map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/niche/${s}`); }}
                          className="px-1.5 py-0.5 rounded-full bg-[#0B6B3A]/8 text-[var(--ipk-green-dark)] truncate max-w-full hover:bg-[#0B6B3A]/15"
                          style={{ fontSize: "9px" }}
                          title={nicheLabel(s)}
                        >
                          {findBySlug(s)?.label || nicheLabel(s)}
                        </button>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </Link>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <EmptyState
          title="Aucun produit"
          message="Aucune œuvre ne correspond à vos critères."
          actionLabel="Réinitialiser les filtres"
          onAction={resetAll}
        />
      )}
    </div>
  );
}
