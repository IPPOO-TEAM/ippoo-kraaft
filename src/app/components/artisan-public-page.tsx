import { useMemo } from "react";
import { Link, useParams } from "react-router";
import { ChevronRight, MapPin, Star, Users } from "lucide-react";
import { Badge } from "./ui/badge";
import { groupements, formatPrice } from "../data/mock-data";
import { useProducts, useArtisans } from "../hooks/use-products";
import { effectiveNiches, nicheLabel, findBySlug } from "../data/craft-taxonomy";
import { LazyImage } from "./lazy-image";
import { useSeo } from "../hooks/use-seo";
import { EmptyState } from "./empty-state";

export function ArtisanPublicPage() {
  const { slug = "" } = useParams();
  const artisans = useArtisans();
  const products = useProducts();
  const artisan = artisans.find(a => a.slug === slug);

  useSeo({
    title: artisan ? `${artisan.name} — Vitrine artisan` : "Artisan introuvable",
    description: artisan ? `${artisan.specialty} — ${artisan.region}, ${artisan.country}. ${artisan.bio}` : "",
  });

  const myProducts = useMemo(() => artisan ? products.filter(p => p.artisanId === artisan.id) : [], [products, artisan]);
  const groupement = artisan ? groupements.find(g => g.id === artisan.groupementId) : null;

  if (!artisan) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <EmptyState title="Artisan introuvable" message="Cet artisan n'existe pas ou plus." actionLabel="Voir tous les artisans" onAction={() => { window.location.href = "/groupements"; }} />
      </div>
    );
  }

  const niches = artisan.niches || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-20 lg:pb-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-[var(--ipk-text)] mb-3" style={{ fontSize: "12px" }}>
        <Link to="/groupements" className="hover:text-[var(--ipk-green-dark)]">Artisans & groupements</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[var(--ipk-ink)]">{artisan.name}</span>
      </nav>

      {/* Cover + identity */}
      <div className="bg-white rounded-2xl border border-[var(--ipk-border)] overflow-hidden mb-6">
        <div className="h-32 sm:h-44 bg-gradient-to-br from-[#0B6B3A]/15 to-[#0057FF]/10" />
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 -mt-12 sm:-mt-16">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-4 border-white shadow-md shrink-0">
              <LazyImage src={artisan.image} alt={artisan.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 sm:pt-12">
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 600, color: "var(--ipk-ink)" }}>{artisan.name}</h1>
              <p className="text-[var(--ipk-text)] mt-0.5" style={{ fontSize: "14px" }}>{artisan.specialty}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-[var(--ipk-text)]" style={{ fontSize: "13px" }}>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{artisan.region}, {artisan.country}</span>
                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-[var(--ipk-amber)] text-[var(--ipk-amber)]" />{artisan.rating}</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{artisan.productsCount} produits</span>
                {groupement && (
                  <Link to={`/groupements/${groupement.slug}`} className="text-[var(--ipk-blue)] underline">{groupement.name}</Link>
                )}
              </div>
            </div>
          </div>
          {artisan.bio && <p className="mt-4 text-[var(--ipk-text)]" style={{ fontSize: "14px", lineHeight: 1.6 }}>{artisan.bio}</p>}
          {niches.length > 0 && (
            <div className="mt-4">
              <p className="text-[var(--ipk-text)] mb-2" style={{ fontSize: "12px", fontWeight: 600 }}>Niches d'activité</p>
              <div className="flex flex-wrap gap-1.5">
                {niches.map(s => (
                  <Link key={s} to={`/niche/${s}`} className="px-2.5 py-1 rounded-full bg-[#0B6B3A]/10 text-[var(--ipk-green-dark)] hover:bg-[#0B6B3A]/20" style={{ fontSize: "11px" }}>
                    {findBySlug(s)?.label || nicheLabel(s)}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Products */}
      <div className="mb-3 flex items-end justify-between">
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 600, color: "var(--ipk-ink)" }}>
          Œuvres ({myProducts.length})
        </h2>
      </div>
      {myProducts.length === 0 ? (
        <EmptyState title="Aucune œuvre" message="Cet artisan n'a pas encore publié d'œuvre." />
      ) : (
        <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {myProducts.map(product => {
            const ns = effectiveNiches(product).slice(0, 2);
            return (
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
                  <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--ipk-green)" }} className="block mt-1">{formatPrice(product.price)}</span>
                  {ns.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {ns.map(s => (
                        <span key={s} className="px-1.5 py-0.5 rounded-full bg-[#0B6B3A]/8 text-[var(--ipk-green-dark)] truncate max-w-full" style={{ fontSize: "9px" }}>
                          {findBySlug(s)?.label || nicheLabel(s)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
