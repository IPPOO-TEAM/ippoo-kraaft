import { Link, useParams, Navigate } from "react-router";
import { ArrowRight, ArrowLeft, ChevronRight, Radio, Headphones } from "lucide-react";
import { LazyImage } from "./lazy-image";
import { PageHero } from "./page-hero";
import { useSeo } from "../hooks/use-seo";
import {
  MEDIA_INTRO,
  mediaRubriques,
  getMediaRubrique,
  type MediaBlock,
} from "../data/culture-media";
import { CrossLinksBlock, mediaCrossLinks } from "./cross-links";
import { MediaMiniPlayer, MediaLibrary } from "./media-player";

// ============= INDEX : MÉDIAS & PODCASTS GRIOTS =============
export function MediasPage() {
  useSeo({
    title: "Médias, Podcasts Griots & Transmission des savoirs",
    description:
      "Le grand média culturel d'IPPOO KRAAFT : podcasts griots, séries documentaires, éditoriaux, dossiers, médiathèque, chroniques, témoignages et collections.",
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-20 lg:pb-10">
      {/* Fil d'Ariane */}
      <nav className="flex items-center gap-1.5 text-[var(--ipk-text)] mb-5" style={{ fontSize: "13px" }} aria-label="Fil d'Ariane">
        <Link to="/accueil" className="hover:text-[var(--ipk-green)] transition-colors">Accueil</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[var(--ipk-ink)]">Médias & Podcasts</span>
      </nav>

      {/* Intro générale - hero décoratif sans image */}
      <section className="relative overflow-hidden rounded-3xl mb-10" style={{ background: "linear-gradient(135deg, #111418 0%, #14251a 55%, #0B6B3A 140%)" }}>
        <div aria-hidden className="absolute -top-24 -right-16 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[var(--ipk-green)]/25 blur-3xl" />
        <div aria-hidden className="absolute -bottom-28 -left-20 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[var(--ipk-amber)]/15 blur-3xl" />
        <Radio aria-hidden className="absolute -right-6 sm:right-8 top-1/2 -translate-y-1/2 w-40 h-40 sm:w-64 sm:h-64 text-white/5 pointer-events-none" strokeWidth={1} />
        <div className="relative p-6 sm:p-10 lg:p-14 max-w-3xl">
          <span className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-[var(--ipk-amber)]" style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            <Radio className="w-3.5 h-3.5" /> {MEDIA_INTRO.eyebrow}
          </span>
          <h1 className="text-white mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 5vw, 46px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
            {MEDIA_INTRO.title}
          </h1>
          <p className="text-[var(--ipk-amber)] mb-6" style={{ fontSize: "clamp(15px, 2.2vw, 19px)", fontWeight: 500, lineHeight: 1.5 }}>
            {MEDIA_INTRO.tagline}
          </p>
          <div className="space-y-3 mb-8">
            {MEDIA_INTRO.paragraphs.map((p, i) => (
              <p key={i} className="text-white/75" style={{ fontSize: "15px", lineHeight: 1.8 }}>
                {p}
              </p>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/medias/podcasts-griots" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white text-[var(--ipk-ink)] shadow-lg shadow-black/10 hover:bg-white/90 hover:-translate-y-0.5 transition-all" style={{ fontSize: "14px", fontWeight: 600 }}>
              <Headphones className="w-4 h-4" /> Écouter les Podcasts Griots
            </Link>
            <Link to="/blog" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-white/25 bg-white/5 backdrop-blur-sm text-white hover:bg-white/15 hover:-translate-y-0.5 transition-all" style={{ fontSize: "14px", fontWeight: 600 }}>
              Lire les actualités
            </Link>
          </div>
        </div>
      </section>

      {/* Grille des rubriques */}
      <h2 className="text-[var(--ipk-ink)] mb-5" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 700 }}>
        Une bibliothèque vivante des savoirs
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaRubriques.map((r) => (
          <Link
            key={r.slug}
            to={`/medias/${r.slug}`}
            className="group bg-white rounded-2xl overflow-hidden border border-[var(--ipk-border)] hover:shadow-md transition-all flex flex-col"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <LazyImage src={r.cardImage} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-[var(--ipk-ink)] mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700 }}>
                {r.title}
              </h3>
              <p className="text-[var(--ipk-text)] mb-4 flex-1" style={{ fontSize: "14px", lineHeight: 1.6 }}>
                {r.tagline}
              </p>
              <span className="inline-flex items-center gap-1.5 text-[var(--ipk-green)]" style={{ fontSize: "14px", fontWeight: 600 }}>
                Découvrir <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Aperçu de la bibliothèque audiovisuelle */}
      <div className="mt-12">
        <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
          <h2 className="text-[var(--ipk-ink)]" style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 700 }}>
            Bibliothèque audiovisuelle - à visionner maintenant
          </h2>
          <Link to="/medias/bibliotheque-audiovisuelle" className="text-[var(--ipk-green)] inline-flex items-center gap-1" style={{ fontSize: "14px", fontWeight: 600 }}>
            Tout voir <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <p className="text-[var(--ipk-text)] mb-5" style={{ fontSize: "14px" }}>
          Documentaires, portraits d'artisans et témoignages sur l'artisanat africain - 15 vidéos réelles jouables directement.
        </p>
        <MediaLibrary />
      </div>
    </div>
  );
}

// ============= DÉTAIL : UNE RUBRIQUE =============
function BlockView({ block }: { block: MediaBlock }) {
  return (
    <div className="mb-6">
      {block.heading && (
        <h3 className="text-[var(--ipk-ink)] mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700 }}>
          {block.heading}
        </h3>
      )}
      {block.text && (
        <p className="text-[var(--ipk-text)] mb-3" style={{ fontSize: "15px", lineHeight: 1.8 }}>
          {block.text}
        </p>
      )}
      {block.items && block.items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {block.items.map((it) => (
            <span key={it} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--ipk-surface)] border border-[var(--ipk-border)] text-[var(--ipk-ink)]" style={{ fontSize: "13px", fontWeight: 500 }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--ipk-green)]" /> {it}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function MediaRubriquePage() {
  const { slug } = useParams<{ slug: string }>();
  const rubrique = slug ? getMediaRubrique(slug) : undefined;

  useSeo({
    title: rubrique ? rubrique.title : "Médias IPPOO KRAAFT",
    description: rubrique?.tagline,
  });

  if (!rubrique) return <Navigate to="/medias" replace />;

  const currentIndex = mediaRubriques.findIndex((r) => r.slug === rubrique.slug);
  const next = mediaRubriques[(currentIndex + 1) % mediaRubriques.length];

  return (
    <div className="pb-20 lg:pb-10">
      {/* Hero rubrique */}
      <PageHero
        slug={rubrique.slug}
        icon={Radio}
        eyebrow={rubrique.title}
        title={rubrique.title}
        tagline={rubrique.tagline}
        breadcrumbs={[{ label: "Accueil", to: "/accueil" }, { label: "Médias", to: "/medias" }]}
        ctas={[]}
        letter={rubrique.letter}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="mt-8 mb-8">
          {rubrique.intro.map((p, i) => (
            <p key={i} className="text-[var(--ipk-text)] mb-3" style={{ fontSize: "16px", lineHeight: 1.85 }}>
              {p}
            </p>
          ))}
        </div>

        {/* Blocs de contenu */}
        <div className="bg-white rounded-2xl border border-[var(--ipk-border)] p-6 sm:p-8">
          {rubrique.blocks.map((b, i) => (
            <BlockView key={i} block={b} />
          ))}
        </div>

        {/* Closing */}
        {rubrique.closing && (
          <p className="text-[var(--ipk-text)] mt-8" style={{ fontSize: "15px", lineHeight: 1.85 }}>
            {rubrique.closing}
          </p>
        )}

        {/* CTA */}
        <div className="mt-10 rounded-2xl bg-[var(--ipk-surface)] p-6 sm:p-8 text-center">
          <h3 className="text-[var(--ipk-ink)] mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700 }}>
            Participez à la transmission
          </h3>
          <p className="text-[var(--ipk-text)] mb-5 max-w-xl mx-auto" style={{ fontSize: "14px", lineHeight: 1.7 }}>
            Chaque savoir partagé enrichit la mémoire vivante des métiers d'art africains.
          </p>
          <Link to={rubrique.ctaTo} className="inline-flex items-center justify-center gap-2 bg-[var(--ipk-green-dark)] text-white rounded-xl h-11 px-6 hover:bg-[var(--ipk-green-darker)] transition-colors" style={{ fontSize: "14px", fontWeight: 600 }}>
            {rubrique.ctaLabel} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Vidéos jouables liées à cette rubrique */}
        {rubrique.slug === "bibliotheque-audiovisuelle" ? (
          <MediaLibrary />
        ) : (
          <MediaMiniPlayer rubriquesSlug={rubrique.slug} />
        )}

        {/* Liens croisés vers les rubriques sœurs */}
        <CrossLinksBlock links={mediaCrossLinks[rubrique.slug] ?? []} />

        {/* Navigation entre rubriques */}
        <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-[var(--ipk-border)] pt-8">
          <Link to="/medias" className="inline-flex items-center gap-2 text-[var(--ipk-text)] hover:text-[var(--ipk-green)] transition-colors" style={{ fontSize: "14px", fontWeight: 600 }}>
            <ArrowLeft className="w-4 h-4" /> Toutes les rubriques
          </Link>
          <Link to={`/medias/${next.slug}`} className="inline-flex items-center justify-center gap-2 bg-[var(--ipk-ink)] text-white rounded-xl h-11 px-6 hover:opacity-90 transition-opacity" style={{ fontSize: "14px", fontWeight: 600 }}>
            Suivant : {next.title} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
