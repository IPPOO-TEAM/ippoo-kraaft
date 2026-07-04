import { Link, useParams, Navigate } from "react-router";
import { ArrowRight, ArrowLeft, ChevronRight, Sparkles } from "lucide-react";
import { LazyImage } from "./lazy-image";
import { PageHero } from "./page-hero";
import { useSeo } from "../hooks/use-seo";
import {
  ARTS_INTRO,
  artFamilies,
  getArtFamily,
} from "../data/arts-culture";

// ============= INDEX : ARTS & CULTURE IDENTITAIRES =============
export function ArtsCulturePage() {
  useSeo({
    title: "Arts, culture & langages identitaires",
    description:
      "Coiffure, coiffes, maquillage, vêtement, bijoux, tambours, griots, peinture, poésie : la cartographie vivante des arts et identités africaines.",
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-20 lg:pb-10">
      {/* Fil d'Ariane */}
      <nav className="flex items-center gap-1.5 text-[var(--ipk-text)] mb-5" style={{ fontSize: "13px" }} aria-label="Fil d'Ariane">
        <Link to="/accueil" className="hover:text-[var(--ipk-green)] transition-colors">Accueil</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[var(--ipk-ink)]">Arts & culture</span>
      </nav>

      {/* Intro générale - hero décoratif sans image */}
      <section className="relative overflow-hidden rounded-3xl mb-10 border border-[var(--ipk-border)]" style={{ background: "linear-gradient(135deg, #ffffff 0%, #eef2ff 55%, #e0e8ff 130%)" }}>
        <div aria-hidden className="absolute -top-24 -right-16 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[var(--ipk-blue)]/10 blur-3xl" />
        <div aria-hidden className="absolute -bottom-28 -left-20 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[var(--ipk-green)]/10 blur-3xl" />
        <Sparkles aria-hidden className="absolute -right-6 sm:right-8 top-1/2 -translate-y-1/2 w-40 h-40 sm:w-64 sm:h-64 text-[var(--ipk-blue)]/10 pointer-events-none" strokeWidth={1} />
        <div className="relative p-6 sm:p-10 lg:p-14 max-w-3xl">
          <span className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full border border-[var(--ipk-blue)]/25 bg-[var(--ipk-blue)]/10 text-[var(--ipk-blue)]" style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            <Sparkles className="w-3.5 h-3.5" /> Arts, culture & identités
          </span>
          <h1 className="text-[var(--ipk-ink)] mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 5vw, 46px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
            {ARTS_INTRO.title}
          </h1>
          <p className="text-[var(--ipk-green-dark)] italic mb-6" style={{ fontSize: "clamp(15px, 2.2vw, 19px)", lineHeight: 1.5 }}>
            {ARTS_INTRO.tagline}
          </p>
          <div className="space-y-3 mb-8">
            {ARTS_INTRO.paragraphs.map((p, i) => (
              <p key={i} className="text-[var(--ipk-text)]" style={{ fontSize: "15px", lineHeight: 1.8 }}>
                {p}
              </p>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => document.getElementById("familles")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[var(--ipk-green-dark)] text-white shadow-lg shadow-black/10 hover:bg-[var(--ipk-green-darker)] hover:-translate-y-0.5 transition-all"
              style={{ fontSize: "14px", fontWeight: 600 }}
            >
              Explorer les univers <ArrowRight className="w-4 h-4" />
            </button>
            <Link to="/metiers" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-2xl border-2 border-[var(--ipk-blue)] text-[var(--ipk-blue)] hover:bg-[var(--ipk-blue)]/5 hover:-translate-y-0.5 transition-all" style={{ fontSize: "14px", fontWeight: 600 }}>
              Voir aussi les métiers
            </Link>
          </div>
        </div>
      </section>

      {/* Grille des 9 arts */}
      <h2 id="familles" className="text-[var(--ipk-ink)] mb-5 scroll-mt-24" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 700 }}>
        Les 9 univers de la culture vivante
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {artFamilies.map((art) => (
          <Link
            key={art.slug}
            to={`/arts-culture/${art.slug}`}
            className="group bg-white rounded-2xl overflow-hidden border border-[var(--ipk-border)] hover:shadow-md transition-all flex flex-col"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <LazyImage
                src={art.cardImage}
                alt={art.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-[var(--ipk-ink)] mb-1.5" style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700 }}>
                {art.title}
              </h3>
              <p className="text-[var(--ipk-green-dark)] italic mb-3" style={{ fontSize: "13px", lineHeight: 1.5 }}>
                {art.tagline}
              </p>
              <p className="text-[var(--ipk-text)] mb-4 flex-1" style={{ fontSize: "14px", lineHeight: 1.6 }}>
                {art.intro}
              </p>
              <span className="inline-flex items-center gap-1.5 text-[var(--ipk-blue)]" style={{ fontSize: "14px", fontWeight: 600 }}>
                Plonger dans cet univers <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Bandeau d'invitation finale */}
      <section className="mt-12 rounded-3xl overflow-hidden relative">
        <div className="absolute inset-0">
          <LazyImage
            src={ARTS_INTRO.secondaryImage}
            alt="Culture africaine vivante"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#111418]/70" />
        </div>
        <div className="relative p-8 sm:p-12 text-center">
          <h3 className="text-white mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 700 }}>
            Faites entrer cet héritage dans votre quotidien
          </h3>
          <p className="text-white/80 max-w-2xl mx-auto mb-6" style={{ fontSize: "15px", lineHeight: 1.7 }}>
            Boutique de pièces authentiques, formations transmises par les maîtres, galeries photo et événements en présentiel : prolongez la découverte au-delà de la lecture.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/boutique" className="px-6 py-3 rounded-xl bg-white text-[var(--ipk-green-dark)] hover:bg-white/90 transition-colors" style={{ fontSize: "14px", fontWeight: 600 }}>Visiter la boutique</Link>
            <Link to="/galeries" className="px-6 py-3 rounded-xl border-2 border-white/40 text-white hover:bg-white/10 transition-colors" style={{ fontSize: "14px", fontWeight: 600 }}>Explorer les galeries</Link>
            <Link to="/formations" className="px-6 py-3 rounded-xl border-2 border-white/40 text-white hover:bg-white/10 transition-colors" style={{ fontSize: "14px", fontWeight: 600 }}>Découvrir les formations</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============= DÉTAIL : UN ART =============
export function ArtDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const art = slug ? getArtFamily(slug) : undefined;

  useSeo({
    title: art ? art.title : "Arts & culture",
    description: art?.tagline,
  });

  if (!art) return <Navigate to="/arts-culture" replace />;

  const currentIndex = artFamilies.findIndex((a) => a.slug === art.slug);
  const next = artFamilies[(currentIndex + 1) % artFamilies.length];

  return (
    <div className="pb-20 lg:pb-10">
      {/* Hero art */}
      <PageHero
        slug={art.slug}
        icon={Sparkles}
        eyebrow={art.title}
        title={art.title}
        tagline={art.tagline}
        breadcrumbs={[{ label: "Accueil", to: "/accueil" }, { label: "Arts & culture", to: "/arts-culture" }]}
        ctas={[]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <p className="text-[var(--ipk-text)] mt-8 mb-10" style={{ fontSize: "16px", lineHeight: 1.85 }}>
          {art.intro}
        </p>

        {/* Sections en alternance image/texte */}
        <div className="space-y-10">
          {art.sections.map((sec, i) => (
            <article key={sec.title} className="grid md:grid-cols-2 gap-6 items-center">
              <div className={`rounded-2xl overflow-hidden aspect-[4/3] ${i % 2 === 1 ? "md:order-2" : ""}`}>
                <LazyImage
                  src={sec.image}
                  alt={sec.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className={i % 2 === 1 ? "md:order-1" : ""}>
                <h2 className="text-[var(--ipk-ink)] mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 700 }}>
                  {sec.title}
                </h2>
                <p className="text-[var(--ipk-text)]" style={{ fontSize: "15px", lineHeight: 1.8 }}>
                  {sec.text}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Paragraphes complémentaires */}
        {art.extra && art.extra.length > 0 && (
          <div className="mt-10 space-y-4 bg-[var(--ipk-surface)] rounded-2xl p-6">
            {art.extra.map((p, i) => (
              <p key={i} className="text-[var(--ipk-text)]" style={{ fontSize: "15px", lineHeight: 1.8 }}>
                {p}
              </p>
            ))}
          </div>
        )}

        {/* CTAs */}
        <div className="mt-10 bg-[var(--ipk-blue)]/5 border border-[var(--ipk-blue)]/15 rounded-2xl p-6">
          <h3 className="text-[var(--ipk-ink)] mb-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700 }}>
            Prolongez l'expérience
          </h3>
          <p className="text-[var(--ipk-text)] mb-4" style={{ fontSize: "14px" }}>
            Continuez votre parcours dans l'univers IPPOO KRAAFT.
          </p>
          <div className="flex flex-wrap gap-3">
            {art.ctas.map((cta) => (
              <Link
                key={cta.to + cta.label}
                to={cta.to}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[var(--ipk-border)] text-[var(--ipk-ink)] hover:border-[var(--ipk-blue)] hover:text-[var(--ipk-blue)] transition-colors"
                style={{ fontSize: "14px", fontWeight: 600 }}
              >
                {cta.label} <ArrowRight className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </div>

        {/* Navigation entre arts */}
        <div className="mt-12 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-[var(--ipk-border)] pt-8">
          <Link to="/arts-culture" className="inline-flex items-center gap-2 text-[var(--ipk-text)] hover:text-[var(--ipk-blue)] transition-colors" style={{ fontSize: "14px", fontWeight: 600 }}>
            <ArrowLeft className="w-4 h-4" /> Tous les arts
          </Link>
          <Link to={`/arts-culture/${next.slug}`} className="inline-flex items-center justify-center gap-2 bg-[var(--ipk-blue)] text-white rounded-xl h-11 px-6 hover:bg-[var(--ipk-blue-dark)] transition-colors" style={{ fontSize: "14px", fontWeight: 600 }}>
            Suivant : {next.title} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
