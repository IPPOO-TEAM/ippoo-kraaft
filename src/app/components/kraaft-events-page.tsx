import { Link, useParams, Navigate } from "react-router";
import { ArrowRight, ArrowLeft, ChevronRight, CalendarDays, CheckCircle2, Sparkles } from "lucide-react";
import { LazyImage } from "./lazy-image";
import { PageHero } from "./page-hero";
import { useSeo } from "../hooks/use-seo";
import {
  EVENTS_INTRO,
  eventCategories,
  getEventCategory,
} from "../data/kraaft-events";

// ============= INDEX : SALONS & RENCONTRES =============
export function SalonsPage() {
  useSeo({
    title: "Foires, salons & rencontres internationales",
    description:
      "Le grand carrefour vivant des métiers d'art africains : Grand Salon KRAAFT, foires thématiques, musées vivants, villages artisanaux, circuits culturels, rencontres internationales et expositions virtuelles.",
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-20 lg:pb-10">
      <nav className="flex items-center gap-1.5 text-[var(--ipk-text)] mb-5" style={{ fontSize: "13px" }} aria-label="Fil d'Ariane">
        <Link to="/accueil" className="hover:text-[var(--ipk-green)] transition-colors">Accueil</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[var(--ipk-ink)]">Salons & rencontres</span>
      </nav>

      {/* Intro - hero décoratif sans image */}
      <section className="relative overflow-hidden rounded-3xl mb-10 border border-[var(--ipk-border)]" style={{ background: "linear-gradient(135deg, #ffffff 0%, #eef7f0 55%, #dff0e6 130%)" }}>
        <div aria-hidden className="absolute -top-24 -right-16 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[var(--ipk-green)]/10 blur-3xl" />
        <div aria-hidden className="absolute -bottom-28 -left-20 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[var(--ipk-amber)]/10 blur-3xl" />
        <CalendarDays aria-hidden className="absolute -right-6 sm:right-8 top-1/2 -translate-y-1/2 w-40 h-40 sm:w-64 sm:h-64 text-[var(--ipk-green)]/10 pointer-events-none" strokeWidth={1} />
        <div className="relative p-6 sm:p-10 lg:p-14 max-w-3xl">
          <span className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full border border-[var(--ipk-green)]/25 bg-[var(--ipk-green)]/10 text-[var(--ipk-green-dark)]" style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            <CalendarDays className="w-3.5 h-3.5" /> La vie culturelle IPPOO KRAAFT
          </span>
          <h1 className="text-[var(--ipk-ink)] mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 5vw, 46px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
            {EVENTS_INTRO.title}
          </h1>
          <p className="text-[var(--ipk-green-dark)] mb-6" style={{ fontSize: "clamp(15px, 2.2vw, 19px)", fontWeight: 600, lineHeight: 1.5 }}>
            {EVENTS_INTRO.tagline}
          </p>
          <div className="space-y-3">
            {EVENTS_INTRO.paragraphs.map((p, i) => (
              <p key={i} className="text-[var(--ipk-text)]" style={{ fontSize: "15px", lineHeight: 1.8 }}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      <h2 className="text-[var(--ipk-ink)] mb-5" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 700 }}>
        Dix rendez-vous pour faire rayonner les métiers d'art
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventCategories.map((cat) => (
          <Link
            key={cat.slug}
            to={`/salons/${cat.slug}`}
            className="group bg-white rounded-2xl overflow-hidden border border-[var(--ipk-border)] hover:shadow-md transition-all flex flex-col"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <LazyImage src={cat.cardImage} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-[var(--ipk-ink)] mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700 }}>
                {cat.title}
              </h3>
              <p className="text-[var(--ipk-text)] mb-4 flex-1" style={{ fontSize: "14px", lineHeight: 1.6 }}>
                {cat.tagline}
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

// ============= DÉTAIL : UNE CATÉGORIE =============
export function SalonDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const cat = slug ? getEventCategory(slug) : undefined;

  useSeo({ title: cat ? cat.title : "Salons & rencontres", description: cat?.tagline });

  if (!cat) return <Navigate to="/salons" replace />;

  const idx = eventCategories.findIndex((c) => c.slug === cat.slug);
  const next = eventCategories[(idx + 1) % eventCategories.length];

  return (
    <div className="pb-20 lg:pb-10">
      {/* Hero */}
      <PageHero
        slug={cat.slug}
        icon={CalendarDays}
        eyebrow={cat.title}
        title={cat.title}
        tagline={cat.tagline}
        breadcrumbs={[{ label: "Accueil", to: "/accueil" }, { label: "Salons & Rencontres", to: "/salons" }]}
        ctas={[]}
        letter={cat.letter}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tagline + intro */}
        <p className="text-[var(--ipk-green-dark)] mt-8 mb-3 flex items-start gap-2" style={{ fontSize: "17px", fontWeight: 600, lineHeight: 1.5 }}>
          <Sparkles className="w-5 h-5 shrink-0 mt-0.5" /> {cat.tagline}
        </p>
        <p className="text-[var(--ipk-text)] mb-10" style={{ fontSize: "16px", lineHeight: 1.85 }}>
          {cat.intro}
        </p>

        {/* Sections en alternance image/texte */}
        {cat.sections && cat.sections.length > 0 && (
          <div className="space-y-10">
            {cat.sections.map((sec, i) => (
              <article key={sec.title} className="grid md:grid-cols-2 gap-6 items-center">
                <div className={`rounded-2xl overflow-hidden aspect-[4/3] ${i % 2 === 1 ? "md:order-2" : ""}`}>
                  <LazyImage src={sec.image} alt={sec.title} className="w-full h-full object-cover" />
                </div>
                <div className={i % 2 === 1 ? "md:order-1" : ""}>
                  <h2 className="text-[var(--ipk-ink)] mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(19px, 3vw, 24px)", fontWeight: 700 }}>
                    {sec.title}
                  </h2>
                  <p className="text-[var(--ipk-text)]" style={{ fontSize: "15px", lineHeight: 1.8 }}>
                    {sec.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Liste d'éléments */}
        {cat.items && cat.items.length > 0 && (
          <div className={cat.sections && cat.sections.length > 0 ? "mt-12" : ""}>
            {cat.itemsTitle && (
              <h2 className="text-[var(--ipk-ink)] mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(19px, 3vw, 24px)", fontWeight: 700 }}>
                {cat.itemsTitle}
              </h2>
            )}
            <ul className="grid sm:grid-cols-2 gap-3">
              {cat.items.map((it) => (
                <li key={it} className="flex items-start gap-2.5 bg-[var(--ipk-surface)] rounded-xl px-4 py-3">
                  <CheckCircle2 className="w-5 h-5 text-[var(--ipk-green)] shrink-0 mt-0.5" />
                  <span className="text-[var(--ipk-text)]" style={{ fontSize: "14px", lineHeight: 1.5 }}>{it}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Paragraphes complémentaires */}
        {cat.extra && cat.extra.length > 0 && (
          <div className="mt-10 space-y-4 border-l-4 border-[var(--ipk-green)] pl-5">
            {cat.extra.map((p, i) => (
              <p key={i} className="text-[var(--ipk-text)]" style={{ fontSize: "15px", lineHeight: 1.8 }}>
                {p}
              </p>
            ))}
          </div>
        )}

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap gap-3">
          {cat.ctas.map((c, i) => (
            <Link
              key={c.to + c.label}
              to={c.to}
              className={`inline-flex items-center justify-center gap-2 rounded-xl h-11 px-6 transition-colors ${
                i === 0
                  ? "bg-[var(--ipk-green-dark)] text-white hover:bg-[var(--ipk-green-darker)]"
                  : "border-2 border-[var(--ipk-blue)] text-[var(--ipk-blue)] hover:bg-[var(--ipk-blue)]/5"
              }`}
              style={{ fontSize: "14px", fontWeight: 600 }}
            >
              {c.label} <ArrowRight className="w-4 h-4" />
            </Link>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-12 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-[var(--ipk-border)] pt-8">
          <Link to="/salons" className="inline-flex items-center gap-2 text-[var(--ipk-text)] hover:text-[var(--ipk-green)] transition-colors" style={{ fontSize: "14px", fontWeight: 600 }}>
            <ArrowLeft className="w-4 h-4" /> Tous les rendez-vous
          </Link>
          <Link to={`/salons/${next.slug}`} className="inline-flex items-center justify-center gap-2 bg-[var(--ipk-green-dark)] text-white rounded-xl h-11 px-6 hover:bg-[var(--ipk-green-darker)] transition-colors" style={{ fontSize: "14px", fontWeight: 600 }}>
            Suivant : {next.title} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
