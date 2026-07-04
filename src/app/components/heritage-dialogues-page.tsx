import { Link, useParams, Navigate } from "react-router";
import { ArrowRight, ArrowLeft, ChevronRight, Globe2, Compass } from "lucide-react";
import { LazyImage } from "./lazy-image";
import { PageHero } from "./page-hero";
import { useSeo } from "../hooks/use-seo";
import {
  DIALOGUES_INTRO,
  dialogueSections,
  getDialogueSection,
  type DialogueBlock,
} from "../data/heritage-dialogues";

// ============= INDEX : DIALOGUES & INNOVATION =============
export function DialoguesPage() {
  useSeo({
    title: "Dialogues des civilisations & Laboratoires d'innovation",
    description:
      "Influence mondiale des patrimoines africains, diasporas, industries créatives, laboratoires KRAAFT, matériaux du futur, numérique, observatoires, partenariats et prospective.",
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-20 lg:pb-10">
      {/* Fil d'Ariane */}
      <nav className="flex items-center gap-1.5 text-[var(--ipk-text)] mb-5" style={{ fontSize: "13px" }} aria-label="Fil d'Ariane">
        <Link to="/accueil" className="hover:text-[var(--ipk-green)] transition-colors">Accueil</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[var(--ipk-ink)]">Dialogues & Innovation</span>
      </nav>

      {/* Intro générale - hero décoratif sans image */}
      <section className="relative overflow-hidden rounded-3xl mb-10" style={{ background: "linear-gradient(135deg, #111418 0%, #16223a 55%, #0057FF 150%)" }}>
        <div aria-hidden className="absolute -top-24 -right-16 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[var(--ipk-blue)]/25 blur-3xl" />
        <div aria-hidden className="absolute -bottom-28 -left-20 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#8B5CF6]/15 blur-3xl" />
        <Globe2 aria-hidden className="absolute -right-6 sm:right-8 top-1/2 -translate-y-1/2 w-40 h-40 sm:w-64 sm:h-64 text-white/5 pointer-events-none" strokeWidth={1} />
        <div className="relative p-6 sm:p-10 lg:p-14 max-w-3xl">
          <span className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-[var(--ipk-amber)]" style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            <Globe2 className="w-3.5 h-3.5" /> {DIALOGUES_INTRO.eyebrow}
          </span>
          <h1 className="text-white mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 5vw, 46px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
            {DIALOGUES_INTRO.title}
          </h1>
          <p className="text-[var(--ipk-amber)] mb-6" style={{ fontSize: "clamp(15px, 2.2vw, 19px)", fontWeight: 500, lineHeight: 1.5 }}>
            {DIALOGUES_INTRO.tagline}
          </p>
          <div className="space-y-3 mb-8">
            {DIALOGUES_INTRO.paragraphs.map((p, i) => (
              <p key={i} className="text-white/75" style={{ fontSize: "15px", lineHeight: 1.8 }}>
                {p}
              </p>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/dialogues/dialogues-civilisations" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white text-[var(--ipk-ink)] shadow-lg shadow-black/10 hover:bg-white/90 hover:-translate-y-0.5 transition-all" style={{ fontSize: "14px", fontWeight: 600 }}>
              <Compass className="w-4 h-4" /> Découvrir les dialogues
            </Link>
            <Link to="/dialogues/laboratoires-innovation" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-white/25 bg-white/5 backdrop-blur-sm text-white hover:bg-white/15 hover:-translate-y-0.5 transition-all" style={{ fontSize: "14px", fontWeight: 600 }}>
              Rejoindre un laboratoire
            </Link>
          </div>
        </div>
      </section>

      {/* Grille des sections */}
      <h2 className="text-[var(--ipk-ink)] mb-5" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 700 }}>
        Dix horizons pour penser les patrimoines de demain
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dialogueSections.map((s) => (
          <Link
            key={s.slug}
            to={`/dialogues/${s.slug}`}
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
                Découvrir <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ============= DÉTAIL : UNE SECTION =============
function BlockView({ block }: { block: DialogueBlock }) {
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

export function DialogueDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const section = slug ? getDialogueSection(slug) : undefined;

  useSeo({
    title: section ? section.title : "Dialogues & Innovation",
    description: section?.tagline,
  });

  if (!section) return <Navigate to="/dialogues" replace />;

  const currentIndex = dialogueSections.findIndex((s) => s.slug === section.slug);
  const next = dialogueSections[(currentIndex + 1) % dialogueSections.length];

  return (
    <div className="pb-20 lg:pb-10">
      {/* Hero section */}
      <PageHero
        slug={section.slug}
        icon={Globe2}
        eyebrow={section.title}
        title={section.title}
        tagline={section.tagline}
        breadcrumbs={[{ label: "Accueil", to: "/accueil" }, { label: "Dialogues & Innovation", to: "/dialogues" }]}
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

        {/* Blocs de contenu */}
        <div className="bg-white rounded-2xl border border-[var(--ipk-border)] p-6 sm:p-8">
          {section.blocks.map((b, i) => (
            <BlockView key={i} block={b} />
          ))}
        </div>

        {/* Closing */}
        {section.closing && (
          <p className="text-[var(--ipk-text)] mt-8" style={{ fontSize: "15px", lineHeight: 1.85 }}>
            {section.closing}
          </p>
        )}

        {/* CTA */}
        <div className="mt-10 rounded-2xl bg-[var(--ipk-surface)] p-6 sm:p-8 text-center">
          <h3 className="text-[var(--ipk-ink)] mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700 }}>
            Bâtissons ensemble les patrimoines de demain
          </h3>
          <p className="text-[var(--ipk-text)] mb-5 max-w-xl mx-auto" style={{ fontSize: "14px", lineHeight: 1.7 }}>
            Chercheurs, artisans, designers, institutions : prenez part au dialogue et aux laboratoires d'IPPOO KRAAFT.
          </p>
          <Link to={section.ctaTo} className="inline-flex items-center justify-center gap-2 bg-[var(--ipk-green-dark)] text-white rounded-xl h-11 px-6 hover:bg-[var(--ipk-green-darker)] transition-colors" style={{ fontSize: "14px", fontWeight: 600 }}>
            {section.ctaLabel} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Navigation entre sections */}
        <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-[var(--ipk-border)] pt-8">
          <Link to="/dialogues" className="inline-flex items-center gap-2 text-[var(--ipk-text)] hover:text-[var(--ipk-green)] transition-colors" style={{ fontSize: "14px", fontWeight: 600 }}>
            <ArrowLeft className="w-4 h-4" /> Toutes les sections
          </Link>
          <Link to={`/dialogues/${next.slug}`} className="inline-flex items-center justify-center gap-2 bg-[var(--ipk-ink)] text-white rounded-xl h-11 px-6 hover:opacity-90 transition-opacity" style={{ fontSize: "14px", fontWeight: 600 }}>
            Suivant : {next.title} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
