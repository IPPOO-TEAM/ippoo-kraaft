import { useMemo } from "react";
import { Link, useParams } from "react-router";
import { ChevronRight, Star } from "lucide-react";
import { Badge } from "./ui/badge";
import { useProducts } from "../hooks/use-products";
import { CRAFT_TAXONOMY, findBySlug, nicheLabel, effectiveNiches, domainOf } from "../data/craft-taxonomy";
import { LazyImage } from "./lazy-image";
import { useSeo } from "../hooks/use-seo";
import { EmptyState } from "./empty-state";
import { formatPrice } from "../data/mock-data";

export function NichePage() {
  const params = useParams();
  const rest = (params["*"] || "") as string;
  const slug = rest ? `${params.slug}/${rest}` : (params.slug || "");
  const flat = findBySlug(slug);
  const domain = domainOf(slug);
  const products = useProducts();

  useSeo({
    title: `${flat ? flat.label : slug} - Niche artisanale`,
    description: flat ? `Œuvres et produits de la niche ${flat.label} (${flat.domainLabel}).` : "Niche artisanale",
  });

  const filtered = useMemo(() => products.filter(p => effectiveNiches(p).includes(slug)), [products, slug]);

  const siblings = useMemo(() => {
    if (!flat) return [];
    const dom = CRAFT_TAXONOMY.find(d => d.slug === flat.domainSlug);
    if (!dom) return [];
    return dom.niches.flatMap(n => [
      { slug: n.slug, label: n.label, isSub: false },
      ...(n.subNiches || []).map(s => ({ slug: `${n.slug}/${s.slug}`, label: s.label, isSub: true })),
    ]);
  }, [flat]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-20 lg:pb-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-[var(--ipk-text)] mb-3" style={{ fontSize: "12px" }}>
        <Link to="/boutique" className="hover:text-[var(--ipk-green-dark)]">Boutique</Link>
        <ChevronRight className="w-3 h-3" />
        {domain && (
          <>
            <Link to={`/boutique?dom=${domain.slug}`} className="hover:text-[var(--ipk-green-dark)]">{domain.label}</Link>
            <ChevronRight className="w-3 h-3" />
          </>
        )}
        <span className="text-[var(--ipk-ink)]">{flat ? flat.label : slug}</span>
      </nav>

      <div className="mb-5">
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 4.5vw, 32px)", fontWeight: 600, color: "var(--ipk-ink)" }}>
          {flat ? flat.label : nicheLabel(slug)}
        </h1>
        <p className="text-[var(--ipk-text)] mt-1" style={{ fontSize: "14px" }}>
          {filtered.length} œuvre{filtered.length > 1 ? "s" : ""} dans cette niche
          {domain && <> · <Link to={`/boutique?dom=${domain.slug}`} className="text-[var(--ipk-green-dark)] underline">Voir tout le domaine</Link></>}
        </p>
      </div>

      {/* Sibling niches */}
      {siblings.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-1.5">
          {siblings.map(s => (
            <Link
              key={s.slug}
              to={`/niche/${s.slug}`}
              className={`px-2.5 py-1 rounded-full border ${s.slug === slug ? "bg-[var(--ipk-green-dark)] border-[var(--ipk-green-dark)] text-white" : "border-[var(--ipk-border)] text-[var(--ipk-text)] hover:border-[var(--ipk-green-dark)]"} ${s.isSub ? "ml-2" : ""}`}
              style={{ fontSize: s.isSub ? "10px" : "11px" }}
            >
              {s.label}
            </Link>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState title="Aucun produit" message="Aucune œuvre n'est encore référencée dans cette niche." actionLabel="Retour à la boutique" onAction={() => { window.location.href = "/boutique"; }} />
      ) : (
        <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map(product => (
            <Link key={product.id} to={`/boutique/${product.slug}`} className="bg-white rounded-2xl overflow-hidden border border-[var(--ipk-border)] group hover:shadow-lg transition-shadow">
              <div className="relative aspect-square overflow-hidden">
                <LazyImage src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.isUnique && <Badge className="bg-[var(--ipk-green-dark)] text-white border-0" style={{ fontSize: "10px" }}>Pièce unique</Badge>}
                  {product.isExclusive && <Badge className="bg-[var(--ipk-blue)] text-white border-0" style={{ fontSize: "10px" }}>Exclusivité</Badge>}
                </div>
              </div>
              <div className="p-2.5 sm:p-3">
                <h4 className="text-[var(--ipk-ink)] truncate" style={{ fontSize: "13px", fontWeight: 600 }}>{product.name}</h4>
                <p className="text-[var(--ipk-text)] truncate mt-0.5" style={{ fontSize: "11px" }}>{product.origin.region}, {product.origin.country}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 fill-[var(--ipk-amber)] text-[var(--ipk-amber)]" />
                  <span style={{ fontSize: "11px", color: "var(--ipk-text)" }}>{product.rating} ({product.reviewCount})</span>
                </div>
                <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--ipk-green)" }} className="block mt-1.5">{formatPrice(product.price)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
