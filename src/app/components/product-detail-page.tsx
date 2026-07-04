import React, { useState } from "react";
import { useParams, Link } from "react-router";
import { Star, Shield, Award, MapPin, ChevronLeft, Heart, Share2, ShoppingCart, Truck, RotateCcw, QrCode, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { groupements, formatPrice } from "../data/mock-data";
import { effectiveNiches, nicheLabel } from "../data/craft-taxonomy";
import { useProducts, useArtisans } from "../hooks/use-products";
import { LazyImage } from "./lazy-image";
import { useSeo } from "../hooks/use-seo";
import { useStore } from "../hooks/use-store";
import { toast } from "sonner";
import { ReviewForm } from "./review-form";
import { LeadModal } from "./lead-modal";
import { useCurrency } from "../hooks/use-currency";
import { ProductRecommendations } from "./product-recommendations";
import { recommendSimilar, recordView, useRecentlyViewed, recommendForUser } from "../hooks/use-recommendations";
import { Sparkles, Eye } from "lucide-react";
import { copyToClipboard } from "../utils/clipboard";

export function ProductDetailPage() {
  const { slug } = useParams();
  const products = useProducts();
  const artisans = useArtisans();
  const product = products.find((p) => p.slug === slug);
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isFavorite, toggleFavorite, favorites } = useStore();
  const { format: formatCurrency, active: activeCurrency } = useCurrency();
  const showPrice = (xof: number) => activeCurrency === "XOF" ? formatPrice(xof) : formatCurrency(xof);
  const [quoteOpen, setQuoteOpen] = useState(false);

  const jsonLd = React.useMemo(() => {
    if (!product) return undefined;
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: `${product.name} - ${product.origin.region}, ${product.origin.country}. Oeuvre artisanale certifiée IPPOO KRAAFT.`,
      image: product.images,
      sku: product.id,
      brand: { "@type": "Brand", name: "IPPOO KRAAFT" },
      aggregateRating: product.reviewCount > 0 ? {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviewCount,
      } : undefined,
      offers: {
        "@type": "Offer",
        priceCurrency: product.currency || "XOF",
        price: product.price,
        availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
        url: typeof window !== "undefined" ? window.location.href : undefined,
      },
    };
  }, [product]);

  const seoOverride = (product as any)?.seo as { title?: string; description?: string; ogImage?: string; keywords?: string } | undefined;
  useSeo({
    title: seoOverride?.title || (product ? product.name : "Produit introuvable"),
    description: seoOverride?.description || (product ? `${product.name} - ${product.origin.region}, ${product.origin.country}. ${formatPrice(product.price)}. Oeuvre certifiée IPPOO KRAAFT.` : undefined),
    ogImage: seoOverride?.ogImage || product?.images?.[0],
    keywords: seoOverride?.keywords,
    noIndex: !product,
    jsonLd,
  });

  const recentlyViewed = useRecentlyViewed();
  const relatedProducts = React.useMemo(() => recommendSimilar(product, products, 8), [product, products]);
  const fromHistory = React.useMemo(
    () => product ? recommendForUser(favorites, recentlyViewed.filter(id => id !== product.id), products, 8) : [],
    [favorites, recentlyViewed, products, product],
  );

  React.useEffect(() => { if (product?.id) recordView(product.id); }, [product?.id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-[var(--ipk-ink)]" style={{ fontSize: "24px", fontWeight: 600 }}>Produit non trouvé</h1>
        <Link to="/boutique">
          <Button className="mt-4 bg-[var(--ipk-green-dark)] text-white rounded-xl">Retour à la boutique</Button>
        </Link>
      </div>
    );
  }

  const artisan = artisans.find((a) => a.id === product.artisanId);
  const groupement = groupements.find((g) => g.id === product.groupementId);

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    toast.success(`${product.name} ajouté au panier`);
  };

  const fav = isFavorite(product.id);
  const handleFavorite = () => {
    toggleFavorite(product.id);
    toast.success(fav ? "Retiré des favoris" : "Ajouté aux favoris");
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try { await navigator.share({ title: product.name, url }); return; } catch { /* cancelled */ }
    }
    const success = await copyToClipboard(url);
    if (success) {
      toast.success("Lien copié");
    } else {
      toast.error("Impossible de copier le lien");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 pb-20 lg:pb-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-[var(--ipk-text)] overflow-x-auto" style={{ fontSize: "12px" }}>
        <Link to="/boutique" className="flex items-center gap-1 hover:text-[var(--ipk-green-dark)] shrink-0">
          <ChevronLeft className="w-4 h-4" /> Boutique
        </Link>
        <span>/</span>
        <span className="text-[var(--ipk-ink)] truncate">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Images */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-[var(--ipk-surface)] mb-3">
            <LazyImage src={product.images[currentImage]} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {product.badges.map((badge, i) => (
                <Badge key={i} className={`border-0 text-white ${badge.includes("unique") ? "bg-[var(--ipk-green-dark)]" : badge.includes("Exclus") ? "bg-[var(--ipk-blue)]" : "bg-[var(--ipk-text)]"}`} style={{ fontSize: "11px" }}>
                  {badge}
                </Badge>
              ))}
            </div>
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <button
                onClick={handleFavorite}
                className="w-11 h-11 bg-white/90 rounded-full flex items-center justify-center shadow-sm"
                aria-label={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
                aria-pressed={fav}
              >
                <Heart className={`w-4 h-4 ${fav ? "fill-red-500 text-red-500" : "text-[var(--ipk-text)]"}`} aria-hidden="true" />
              </button>
              <button onClick={handleShare} className="w-11 h-11 bg-white/90 rounded-full flex items-center justify-center shadow-sm" aria-label="Partager le produit">
                <Share2 className="w-4 h-4 text-[var(--ipk-text)]" aria-hidden="true" />
              </button>
            </div>
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ WebkitOverflowScrolling: "touch" }}>
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-colors ${currentImage === i ? "border-[var(--ipk-green-dark)]" : "border-transparent"}`}
                >
                  <LazyImage src={img} alt={`Vue ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-[var(--ipk-surface)] text-[var(--ipk-text)] border-[var(--ipk-border)]" style={{ fontSize: "12px" }}>{product.category}</Badge>
            <Badge className="bg-[var(--ipk-surface)] text-[var(--ipk-text)] border-[var(--ipk-border)]" style={{ fontSize: "12px" }}>{product.technique}</Badge>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 600, color: "var(--ipk-ink)", lineHeight: 1.3 }}>
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-[var(--ipk-amber)] text-[var(--ipk-amber)]" : "text-[var(--ipk-border)]"}`} />
              ))}
            </div>
            <span style={{ fontSize: "14px", color: "var(--ipk-text)" }}>{product.rating} ({product.reviewCount} avis)</span>
          </div>

          {/* Price */}
          <div className="mt-4">
            <span style={{ fontSize: "28px", fontWeight: 700, color: "var(--ipk-green)" }}>{showPrice(product.price)}</span>
            {activeCurrency !== "XOF" && <span className="ml-2 text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>({formatPrice(product.price)})</span>}
            {(() => {
              const op = (product as any).originalPrice as number | undefined;
              const promo = (product as any).promo as { percent: number } | undefined;
              if (!op || op <= product.price) return null;
              return (
                <>
                  <span className="ml-2 line-through text-[var(--ipk-text)]" style={{ fontSize: "16px" }}>{showPrice(op)}</span>
                  {promo?.percent ? <span className="ml-2 px-2 py-0.5 rounded-lg bg-[var(--ipk-green-dark)] text-white" style={{ fontSize: "12px", fontWeight: 700 }}>-{promo.percent}%</span> : null}
                </>
              );
            })()}
            {product.stock > 0 ? (
              <span className="ml-3 text-[var(--ipk-green-dark)]" style={{ fontSize: "13px" }}>
                {product.stock === 1 ? "Dernière pièce !" : `${product.stock} en stock`}
              </span>
            ) : (
              <span className="ml-3 text-[var(--ipk-amber)]" style={{ fontSize: "13px" }}>Sur commande</span>
            )}
          </div>

          {/* CTA */}
          <div className="flex gap-2 sm:gap-3 mt-5">
            <div className="flex items-center border border-[var(--ipk-border)] rounded-xl shrink-0">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Diminuer la quantité" className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--ipk-text)]" style={{ fontSize: "18px" }}>-</button>
              <span className="px-2 sm:px-3" style={{ fontSize: "15px", fontWeight: 600 }} aria-live="polite" aria-label={`Quantité ${quantity}`}>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} aria-label="Augmenter la quantité" className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--ipk-text)]" style={{ fontSize: "18px" }}>+</button>
            </div>
            <Button onClick={handleAddToCart} className="flex-1 bg-[var(--ipk-green-dark)] hover:bg-[var(--ipk-green-darker)] text-white rounded-xl h-11 sm:h-12 min-w-0">
              <ShoppingCart className="w-4 h-4 mr-1 sm:mr-2 shrink-0" /> <span className="truncate">Ajouter au panier</span>
            </Button>
          </div>
          <Button onClick={() => setQuoteOpen(true)} variant="outline" className="w-full mt-2 border-2 border-[var(--ipk-blue)] text-[var(--ipk-blue)] hover:bg-[var(--ipk-blue)] hover:text-white rounded-xl h-10 sm:h-11">
            Demander un devis
          </Button>
          {product && (
            <LeadModal
              open={quoteOpen}
              onOpenChange={setQuoteOpen}
              type="quote"
              title={`Devis - ${product.name}`}
              description={`Recevez une offre personnalisée (volumes, délais, conditions) pour ${product.name}.`}
              refId={product.id}
              refLabel={product.name}
              successToast="Devis demandé - notre équipe revient vers vous sous 48h."
            />
          )}

          {/* Quick info */}
          <div className="mt-5 space-y-3">
            {artisan && (
              <Link to={`/artisan/${artisan.slug}`} className="flex items-center gap-3 p-3 bg-[var(--ipk-surface)] rounded-xl hover:bg-[var(--ipk-border)] transition-colors">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <LazyImage src={artisan.image} alt={artisan.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--ipk-ink)" }}>{artisan.name}</div>
                  <div style={{ fontSize: "12px", color: "var(--ipk-text)" }}>{artisan.specialty} - {groupement?.name}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--ipk-text)]" />
              </Link>
            )}
            {(() => {
              const ns = effectiveNiches(product);
              if (ns.length === 0) return null;
              return (
                <div className="flex flex-wrap gap-1.5 px-1">
                  {ns.map(s => (
                    <Link key={s} to={`/niche/${s}`} className="px-2 py-0.5 rounded-full bg-[#0B6B3A]/10 text-[var(--ipk-green-dark)] hover:bg-[#0B6B3A]/20" style={{ fontSize: "10px" }}>
                      {nicheLabel(s)}
                    </Link>
                  ))}
                </div>
              );
            })()}
            <div className="flex items-center gap-3 p-3 bg-[var(--ipk-surface)] rounded-xl">
              <MapPin className="w-5 h-5 text-[var(--ipk-blue)]" />
              <div>
                <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--ipk-ink)" }}>Origine</div>
                <div style={{ fontSize: "12px", color: "var(--ipk-text)" }}>{product.origin.village}, {product.origin.region}, {product.origin.country}</div>
              </div>
            </div>
          </div>

          {/* Norms */}
          <div className="mt-4 p-4 bg-[#0057FF]/5 border border-[#0057FF]/20 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-[var(--ipk-blue)]" />
              <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--ipk-ink)" }}>Certifié & Traçable</span>
            </div>
            {product.norms.map((norm, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[#0057FF]/10 last:border-0">
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--ipk-ink)" }}>{norm.code}</div>
                  <div style={{ fontSize: "11px", color: "var(--ipk-text)" }}>{norm.name}</div>
                </div>
                <Badge className={`border-0 ${norm.status === "Validé" ? "bg-[var(--ipk-green-dark)] text-white" : "bg-[var(--ipk-amber)] text-white"}`} style={{ fontSize: "10px" }}>
                  {norm.status}
                </Badge>
              </div>
            ))}
            <div className="flex items-center gap-2 mt-3">
              <QrCode className="w-4 h-4 text-[var(--ipk-blue)]" />
              <span style={{ fontSize: "12px", color: "var(--ipk-blue)", fontWeight: 500 }}>Voir le certificat d'authenticité</span>
            </div>
          </div>

          {/* Delivery */}
          <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[var(--ipk-green-dark)]" />
              <span style={{ fontSize: "12px", color: "var(--ipk-text)" }}>{product.delivery.delay} | {product.delivery.cost}</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[var(--ipk-green-dark)]" />
              <span style={{ fontSize: "12px", color: "var(--ipk-text)" }}>Retour 14 jours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accordions */}
      <div className="mt-8">
        <Accordion type="single" collapsible defaultValue="story" className="border rounded-2xl overflow-hidden">
          <AccordionItem value="story">
            <AccordionTrigger className="px-4">Histoire & Symbolique</AccordionTrigger>
            <AccordionContent className="px-4">
              <p style={{ fontSize: "14px", color: "var(--ipk-text)", lineHeight: 1.7 }}>{product.story}</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="ancestrality">
            <AccordionTrigger className="px-4">Ancestralité</AccordionTrigger>
            <AccordionContent className="px-4">
              <p style={{ fontSize: "14px", color: "var(--ipk-text)", lineHeight: 1.7 }}>{product.ancestrality}</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="materials">
            <AccordionTrigger className="px-4">Matériaux, Dimensions & Entretien</AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 style={{ fontSize: "13px", fontWeight: 600, color: "var(--ipk-ink)" }}>Matériaux</h5>
                  <ul className="mt-1 space-y-1">
                    {product.materials.map((m, i) => (
                      <li key={i} style={{ fontSize: "13px", color: "var(--ipk-text)" }}>• {m}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 style={{ fontSize: "13px", fontWeight: 600, color: "var(--ipk-ink)" }}>Dimensions</h5>
                  <p style={{ fontSize: "13px", color: "var(--ipk-text)" }}>{product.dimensions}</p>
                  <h5 className="mt-3" style={{ fontSize: "13px", fontWeight: 600, color: "var(--ipk-ink)" }}>Poids</h5>
                  <p style={{ fontSize: "13px", color: "var(--ipk-text)" }}>{product.weight}</p>
                </div>
              </div>
              <div className="mt-3">
                <h5 style={{ fontSize: "13px", fontWeight: 600, color: "var(--ipk-ink)" }}>Entretien</h5>
                <p style={{ fontSize: "13px", color: "var(--ipk-text)" }}>{product.care}</p>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="delivery">
            <AccordionTrigger className="px-4">Livraison & Retours</AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-[var(--ipk-green-dark)] mt-0.5" />
                  <div>
                    <h5 style={{ fontSize: "13px", fontWeight: 600, color: "var(--ipk-ink)" }}>Livraison</h5>
                    <p style={{ fontSize: "13px", color: "var(--ipk-text)" }}>Zones : {product.delivery.zones}</p>
                    <p style={{ fontSize: "13px", color: "var(--ipk-text)" }}>Délai : {product.delivery.delay}</p>
                    <p style={{ fontSize: "13px", color: "var(--ipk-text)" }}>Coût : {product.delivery.cost}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RotateCcw className="w-5 h-5 text-[var(--ipk-green-dark)] mt-0.5" />
                  <div>
                    <h5 style={{ fontSize: "13px", fontWeight: 600, color: "var(--ipk-ink)" }}>Retours</h5>
                    <p style={{ fontSize: "13px", color: "var(--ipk-text)" }}>14 jours pour retourner votre article dans son état d'origine.</p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <ReviewForm productId={product.id} />

      <ProductRecommendations
        title="Vous aimerez aussi"
        subtitle="Sélectionnés selon la catégorie, la technique et les matériaux"
        products={relatedProducts}
        icon={<Sparkles className="w-3.5 h-3.5" />}
        accent="green"
      />

      {fromHistory.length > 0 && (
        <ProductRecommendations
          title="Inspirés par votre historique"
          subtitle="Basé sur vos favoris et les œuvres récemment consultées"
          products={fromHistory}
          icon={<Eye className="w-3.5 h-3.5" />}
          accent="blue"
          ctaLabel="Voir mes favoris"
          ctaHref="/favoris"
        />
      )}
    </div>
  );
}