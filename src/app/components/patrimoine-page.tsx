import { Link, useParams, Navigate } from "react-router";
import { ArrowRight, ArrowLeft, ChevronRight, Landmark, BookOpen } from "lucide-react";
import { LazyImage } from "./lazy-image";
import { PageHero } from "./page-hero";
import { useSeo } from "../hooks/use-seo";
import {
  PATRIMOINE_INTRO,
  patrimoineSections,
  getPatrimoineSection,
  type PatrimoineBlock,
} from "../data/patrimoine";
import { CrossLinksBlock, patrimoineCrossLinks } from "./cross-links";

// ============= INDEX : CENTRE DE RECHERCHE & PATRIMOINES =============
export function PatrimoinePage() {
  useSeo({
    title: "Centre de Recherche & Patrimoines - IPPOO KRAAFT",
    description:
      "Étude, documentation, conservation et valorisation des patrimoines africains : documentation, inventaire, collections, maîtres, langues, savoirs oraux, laboratoire, cartes, sauvegarde et Fonds KRAAFT.",
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-20 lg:pb-10">
      {/* Fil d'Ariane */}
      <nav className="flex items-center gap-1.5 text-[var(--ipk-text)] mb-5" style={{ fontSize: "13px" }} aria-label="Fil d'Ariane">
        <Link to="/accueil" className="hover:text-[var(--ipk-green)] transition-colors">Accueil</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[var(--ipk-ink)]">Patrimoines</span>
      </nav>

      {/* Intro générale - hero décoratif sans image */}
      <section className="relative overflow-hidden rounded-3xl mb-10" style={{ background: "linear-gradient(135deg, #0F766E 0%, #0B6B3A 55%, #111418 130%)" }}>
        <div aria-hidden className="absolute -top-24 -right-16 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#14b8a6]/25 blur-3xl" />
        <div aria-hidden className="absolute -bottom-28 -left-20 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[var(--ipk-amber)]/15 blur-3xl" />
        <Landmark aria-hidden className="absolute -right-6 sm:right-8 top-1/2 -translate-y-1/2 w-40 h-40 sm:w-64 sm:h-64 text-white/5 pointer-events-none" strokeWidth={1} />
        <div className="relative p-6 sm:p-10 lg:p-14 max-w-3xl">
          <span className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-white" style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            <Landmark className="w-3.5 h-3.5" /> {PATRIMOINE_INTRO.eyebrow}
          </span>
          <h1 className="text-white mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 5vw, 46px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
            {PATRIMOINE_INTRO.title}
          </h1>
          <p className="text-[var(--ipk-amber)] mb-6" style={{ fontSize: "clamp(15px, 2.2vw, 19px)", fontWeight: 500, lineHeight: 1.5 }}>
            {PATRIMOINE_INTRO.tagline}
          </p>
          <div className="space-y-3 mb-8">
            {PATRIMOINE_INTRO.paragraphs.map((p, i) => (
              <p key={i} className="text-white/75" style={{ fontSize: "15px", lineHeight: 1.8 }}>
                {p}
              </p>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/patrimoines/centre-documentation" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white text-[var(--ipk-green-darker)] shadow-lg shadow-black/10 hover:bg-white/90 hover:-translate-y-0.5 transition-all" style={{ fontSize: "14px", fontWeight: 600 }}>
              <BookOpen className="w-4 h-4" /> Accéder à la documentation
            </Link>
            <Link to="/patrimoines/fonds-kraaft" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-white/25 bg-white/5 backdrop-blur-sm text-white hover:bg-white/15 hover:-translate-y-0.5 transition-all" style={{ fontSize: "14px", fontWeight: 600 }}>
              Le Fonds KRAAFT
            </Link>
          </div>
        </div>
      </section>

      {/* Grille des sections */}
      <h2 className="text-[var(--ipk-ink)] mb-5" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 700 }}>
        Les dix piliers de la sauvegarde
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {patrimoineSections.map((s) => (
          <Link
            key={s.slug}
            to={`/patrimoines/${s.slug}`}
            className="group bg-white rounded-2xl overflow-hidden border border-[var(--ipk-border)] hover:shadow-md transition-all flex flex-col"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <LazyImage src={s.cardImage} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-[var(--ipk-ink)] mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700 }}>
                {s.title}
              </h3>
              <p className="text-[var(--ipk-text)] mb-4 flex-1" style={{ fontSize: "14px", lineHeight: 1.6 }}>
                {s.tagline}
              </p>
              <span className="inline-flex items-center gap-1.5 text-[var(--ipk-green)]" style={{ fontSize: "14px", fontWeight: 600 }}>
                Explorer <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ============= DÉTAIL : UNE SECTION =============
function BlockView({ block }: { block: PatrimoineBlock }) {
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

export function PatrimoineSectionPage() {
  const { slug } = useParams<{ slug: string }>();
  const section = slug ? getPatrimoineSection(slug) : undefined;

  useSeo({
    title: section ? section.title : "Patrimoines IPPOO KRAAFT",
    description: section?.tagline,
  });

  if (!section) return <Navigate to="/patrimoines" replace />;

  const currentIndex = patrimoineSections.findIndex((s) => s.slug === section.slug);
  const next = patrimoineSections[(currentIndex + 1) % patrimoineSections.length];

  return (
    <div className="pb-20 lg:pb-10">
      {/* Hero */}
      <PageHero
        slug={section.slug}
        icon={Landmark}
        eyebrow={section.title}
        title={section.title}
        tagline={section.tagline}
        breadcrumbs={[{ label: "Accueil", to: "/accueil" }, { label: "Patrimoines", to: "/patrimoines" }]}
        ctas={[]}
        letter={section.letter}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="mt-8 mb-8">
          {section.intro.map((p, i) => (
            <p key={i} className="text-[var(--ipk-text)] mb-3" style={{ fontSize: "16px", lineHeight: 1.85 }}>
              {p}
            </p>
          ))}
        </div>

        {/* Blocs */}
        <div className="bg-white rounded-2xl border border-[var(--ipk-border)] p-6 sm:p-8">
          {section.blocks.map((b, i) => (
            <BlockView key={i} block={b} />
          ))}
        </div>

        {section.closing && (
          <p className="text-[var(--ipk-text)] mt-8" style={{ fontSize: "15px", lineHeight: 1.85 }}>
            {section.closing}
          </p>
        )}

        {/* CTA */}
        <div className="mt-10 rounded-2xl bg-[var(--ipk-surface)] p-6 sm:p-8 text-center">
          <h3 className="text-[var(--ipk-ink)] mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700 }}>
            Devenez gardien d'un patrimoine
          </h3>
          <p className="text-[var(--ipk-text)] mb-5 max-w-xl mx-auto" style={{ fontSize: "14px", lineHeight: 1.7 }}>
            Chercheur, institution, artisan ou visiteur passionné : votre engagement enrichit la mémoire vivante des métiers d'art africains.
          </p>
          <Link to={section.ctaTo} className="inline-flex items-center justify-center gap-2 bg-[var(--ipk-green-dark)] text-white rounded-xl h-11 px-6 hover:bg-[var(--ipk-green-darker)] transition-colors" style={{ fontSize: "14px", fontWeight: 600 }}>
            {section.ctaLabel} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Liens croisés vers les rubriques sœurs */}
        <CrossLinksBlock links={patrimoineCrossLinks[section.slug] ?? []} />

        {/* Navigation */}
        <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-[var(--ipk-border)] pt-8">
          <Link to="/patrimoines" className="inline-flex items-center gap-2 text-[var(--ipk-text)] hover:text-[var(--ipk-green)] transition-colors" style={{ fontSize: "14px", fontWeight: 600 }}>
            <ArrowLeft className="w-4 h-4" /> Toutes les rubriques
          </Link>
          <Link to={`/patrimoines/${next.slug}`} className="inline-flex items-center justify-center gap-2 bg-[var(--ipk-green-darker)] text-white rounded-xl h-11 px-6 hover:opacity-90 transition-opacity" style={{ fontSize: "14px", fontWeight: 600 }}>
            Suivant : {next.title} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
