import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { X, ChevronLeft, ChevronRight, Download, Share2, ZoomIn } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { galleryCollections } from "../data/mock-data";
import { LazyImage } from "./lazy-image";
import { useSeo } from "../hooks/use-seo";
import { NotFoundDetail } from "./not-found-detail";
import { toast } from "sonner";
import { EmptyState } from "./empty-state";

export function GalleriesPage() {
  useSeo({ title: "Galeries photo", description: "Découvrez 95+ photos d'oeuvres et d'artisans africains, organisées par thèmes culturels." });
  const [filter, setFilter] = useState("");
  const themes = [...new Set(galleryCollections.map(g => g.theme))];
  const filtered = filter ? galleryCollections.filter(g => g.theme === filter) : galleryCollections;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-20 lg:pb-6">
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 600, color: "var(--ipk-ink)" }}>
        Galeries
      </h1>
      <p className="text-[var(--ipk-text)] mt-1 mb-6" style={{ fontSize: "15px" }}>
        Explorez nos collections d'oeuvres artisanales par thème
      </p>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
        <button
          onClick={() => setFilter("")}
          className={`px-4 py-2 rounded-full transition-colors shrink-0 ${!filter ? "bg-[var(--ipk-green-dark)] text-white" : "bg-[var(--ipk-surface)] text-[var(--ipk-text)] border border-[var(--ipk-border)]"}`}
          style={{ fontSize: "13px", fontWeight: 500 }}
        >
          Toutes
        </button>
        {themes.map(theme => (
          <button
            key={theme}
            onClick={() => setFilter(filter === theme ? "" : theme)}
            className={`px-4 py-2 rounded-full transition-colors shrink-0 whitespace-nowrap ${filter === theme ? "bg-[var(--ipk-blue)] text-white" : "bg-[var(--ipk-surface)] text-[var(--ipk-text)] border border-[var(--ipk-border)]"}`}
            style={{ fontSize: "13px", fontWeight: 500 }}
          >
            {theme}
          </button>
        ))}
      </div>

      {/* Collections grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 && (
          <EmptyState title="Aucune collection" message="Aucune galerie pour ce thème." actionLabel="Voir toutes" onAction={() => setFilter("")} />
        )}
        {filtered.map((collection) => (
          <Link key={collection.id} to={`/galeries/${collection.slug}`} className="group rounded-2xl overflow-hidden border border-[var(--ipk-border)]">
            <div className="relative aspect-[4/3] overflow-hidden">
              <LazyImage src={collection.coverImage} alt={collection.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white/90 rounded-full px-4 py-2 flex items-center gap-2">
                  <ZoomIn className="w-4 h-4 text-[var(--ipk-ink)]" />
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--ipk-ink)" }}>Voir la collection</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-4 py-3">
                <Badge className="bg-[var(--ipk-blue)] text-white border-0 mb-1" style={{ fontSize: "10px" }}>{collection.theme}</Badge>
                <h3 className="text-white" style={{ fontSize: "16px", fontWeight: 600 }}>{collection.name}</h3>
                <span className="text-white/70" style={{ fontSize: "12px" }}>{collection.imageCount} photos</span>
              </div>
            </div>
            <div className="p-3">
              <p className="text-[var(--ipk-text)] line-clamp-2" style={{ fontSize: "13px", lineHeight: 1.6 }}>{collection.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function GalleryDetailPage() {
  const { slug } = useParams();
  const collection = galleryCollections.find(c => c.slug === slug);

  useSeo({
    title: collection ? collection.name : "Collection introuvable",
    description: collection?.description,
    ogImage: collection?.coverImage,
    noIndex: !collection,
  });

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!collection) {
    return <NotFoundDetail title="Collection introuvable" message="Cette galerie n'existe pas ou a été retirée." backTo="/galeries" backLabel="Retour aux galeries" />;
  }

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  useEffect(() => {
    if (!lightboxOpen || !collection) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      else if (e.key === "ArrowLeft") setCurrentImageIndex(i => Math.max(0, i - 1));
      else if (e.key === "ArrowRight") setCurrentImageIndex(i => Math.min(collection.images.length - 1, i + 1));
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxOpen, collection]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 pb-20 lg:pb-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4" style={{ fontSize: "13px", color: "var(--ipk-text)" }}>
        <Link to="/galeries" className="flex items-center gap-1 hover:text-[var(--ipk-green-dark)]">
          <ChevronLeft className="w-4 h-4" /> Galeries
        </Link>
        <span>/</span>
        <span className="text-[var(--ipk-ink)]">{collection.name}</span>
      </div>

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] mb-6">
        <LazyImage src={collection.coverImage} alt={collection.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4 sm:p-6">
          <Badge className="bg-[var(--ipk-blue)] text-white border-0 w-fit mb-2" style={{ fontSize: "11px" }}>{collection.theme}</Badge>
          <h1 className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 600 }}>
            {collection.name}
          </h1>
          <p className="text-white/80 max-w-lg mt-2" style={{ fontSize: "15px" }}>{collection.description}</p>
        </div>
      </div>

      {/* Gallery Grid - Mosaic */}
      <div className="columns-2 md:columns-3 gap-3 space-y-3">
        {collection.images.map((img, i) => (
          <div key={i} className="break-inside-avoid cursor-pointer group" onClick={() => openLightbox(i)}>
            <div className="relative rounded-xl overflow-hidden">
              <LazyImage src={img} alt={`${collection.name} - ${i + 1}`} className="w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link to="/boutique">
          <Button className="bg-[var(--ipk-green-dark)] text-white rounded-xl h-11 px-6">
            Voir les pièces de cette collection
          </Button>
        </Link>
        <Link to="/contact">
          <Button variant="outline" className="border-2 border-[var(--ipk-blue)] text-[var(--ipk-blue)] rounded-xl h-11 px-6">
            Demander une pièce similaire
          </Button>
        </Link>
        <Button
          variant="outline"
          onClick={async () => {
            if (typeof window === "undefined") return;
            const url = window.location.href;
            try {
              if (typeof navigator.share === "function") {
                await navigator.share({ title: collection.name, url });
              } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(url);
                toast.success("Lien copié");
              }
            } catch {}
          }}
          className="border border-[var(--ipk-border)] rounded-xl h-11 px-6"
        >
          <Share2 className="w-4 h-4 mr-2" /> Partager
        </Button>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div role="dialog" aria-modal="true" aria-label={`Visionneuse ${collection.name}`} className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
          <button className="absolute top-4 right-4 text-white z-10" onClick={() => setLightboxOpen(false)} aria-label="Fermer la visionneuse">
            <X className="w-6 h-6" />
          </button>
          <button
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white z-10 bg-black/30 rounded-full p-1"
            aria-label="Image précédente"
            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(Math.max(0, currentImageIndex - 1)); }}
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          <button
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white z-10 bg-black/30 rounded-full p-1"
            aria-label="Image suivante"
            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(Math.min(collection.images.length - 1, currentImageIndex + 1)); }}
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          <div className="max-w-4xl max-h-[80vh] px-10 sm:px-12" onClick={(e) => e.stopPropagation()}>
            <LazyImage src={collection.images[currentImageIndex]} alt={`${collection.name} — image ${currentImageIndex + 1} sur ${collection.images.length}`} className="max-w-full max-h-[80vh] object-contain rounded-lg" />
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white" style={{ fontSize: "14px" }}>
            {currentImageIndex + 1} / {collection.images.length}
          </div>
        </div>
      )}
    </div>
  );
}
