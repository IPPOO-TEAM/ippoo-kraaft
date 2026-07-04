import { Link, useParams, Navigate } from "react-router";
import { ArrowRight, ArrowLeft, ChevronRight, Hammer } from "lucide-react";
import { LazyImage } from "./lazy-image";
import { PageHero } from "./page-hero";
import { useSeo } from "../hooks/use-seo";
import {
  METIERS_INTRO,
  metierFamilies,
  getMetierFamily,
} from "../data/metiers-classement";
import { CrossLinksBlock, metierCrossLinks } from "./cross-links";

// ============= INDEX : CLASSEMENT DES MÉTIERS =============
export function MetiersPage() {
  useSeo({
    title: "Classement des métiers & savoir-faire",
    description:
      "La plus vaste base de données du portail IPPOO KRAAFT : familles, spécialités et sous-spécialités des métiers d'art africains, du bois au cuir.",
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-20 lg:pb-10">
      {/* Fil d'Ariane */}
      <nav className="flex items-center gap-1.5 text-[var(--ipk-text)] mb-5" style={{ fontSize: "13px" }} aria-label="Fil d'Ariane">
        <Link to="/accueil" className="hover:text-[var(--ipk-green)] transition-colors">Accueil</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[var(--ipk-ink)]">Métiers & savoir-faire</span>
      </nav>

      {/* Intro générale - hero décoratif sans image */}
      <section className="relative overflow-hidden rounded-3xl mb-10 border border-[var(--ipk-border)]" style={{ background: "linear-gradient(135deg, #ffffff 0%, #eef7f0 55%, #dff0e6 130%)" }}>
        <div aria-hidden className="absolute -top-24 -right-16 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[var(--ipk-green)]/10 blur-3xl" />
        <div aria-hidden className="absolute -bottom-28 -left-20 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[var(--ipk-amber)]/10 blur-3xl" />
        <Hammer aria-hidden className="absolute -right-6 sm:right-8 top-1/2 -translate-y-1/2 w-40 h-40 sm:w-64 sm:h-64 text-[var(--ipk-green)]/10 pointer-events-none" strokeWidth={1} />
        <div className="relative p-6 sm:p-10 lg:p-14 max-w-3xl">
          <span className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full border border-[var(--ipk-green)]/25 bg-[var(--ipk-green)]/10 text-[var(--ipk-green-dark)]" style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            <Hammer className="w-3.5 h-3.5" /> Base de données IPPOO KRAAFT
          </span>
          <h1 className="text-[var(--ipk-ink)] mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 5vw, 46px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
            {METIERS_INTRO.title}
          </h1>
          <div className="space-y-3">
            {METIERS_INTRO.paragraphs.map((p, i) => (
              <p key={i} className="text-[var(--ipk-text)]" style={{ fontSize: "15px", lineHeight: 1.8 }}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Grille des familles */}
      <h2 className="text-[var(--ipk-ink)] mb-5" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 700 }}>
        Les grandes familles professionnelles
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {metierFamilies.map((fam) => (
          <Link
            key={fam.slug}
            to={`/metiers/${fam.slug}`}
            className="group bg-white rounded-2xl overflow-hidden border border-[var(--ipk-border)] hover:shadow-md transition-all flex flex-col"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <LazyImage
                src={fam.cardImage}
                alt={fam.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-[var(--ipk-ink)] mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700 }}>
                {fam.title}
              </h3>
              <p className="text-[var(--ipk-text)] mb-4 flex-1" style={{ fontSize: "14px", lineHeight: 1.6 }}>
                {fam.intro}
              </p>
              <span className="inline-flex items-center gap-1.5 text-[var(--ipk-green)]" style={{ fontSize: "14px", fontWeight: 600 }}>
                Découvrir la famille <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ============= DÉTAIL : UNE FAMILLE =============
export function MetierDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const family = slug ? getMetierFamily(slug) : undefined;

  useSeo({
    title: family ? family.title : "Famille de métiers",
    description: family?.intro,
  });

  if (!family) return <Navigate to="/metiers" replace />;

  const currentIndex = metierFamilies.findIndex((f) => f.slug === family.slug);
  const next = metierFamilies[(currentIndex + 1) % metierFamilies.length];

  return (
    <div className="pb-20 lg:pb-10">
      {/* Hero famille */}
      <PageHero
        slug={family.slug}
        icon={Hammer}
        eyebrow="Famille de métiers"
        title={family.title}
        tagline={family.intro}
        breadcrumbs={[{ label: "Accueil", to: "/accueil" }, { label: "Métiers", to: "/metiers" }]}
        ctas={[]}
        letter={family.letter}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro famille */}
        <p className="text-[var(--ipk-text)] mt-8 mb-10" style={{ fontSize: "16px", lineHeight: 1.85 }}>
          {family.intro}
        </p>

        {/* Spécialités, en alternance image/texte */}
        <div className="space-y-10">
          {family.specialties.map((spec, i) => (
            <article key={spec.title} className="grid md:grid-cols-2 gap-6 items-center">
              <div className={`rounded-2xl overflow-hidden aspect-[4/3] ${i % 2 === 1 ? "md:order-2" : ""}`}>
                <LazyImage
                  src={spec.image}
                  alt={spec.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className={i % 2 === 1 ? "md:order-1" : ""}>
                <h2 className="text-[var(--ipk-ink)] mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 700 }}>
                  {spec.title}
                </h2>
                <p className="text-[var(--ipk-text)]" style={{ fontSize: "15px", lineHeight: 1.8 }}>
                  {spec.text}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Paragraphes complémentaires */}
        {family.extra && family.extra.length > 0 && (
          <div className="mt-10 space-y-4 bg-[var(--ipk-surface)] rounded-2xl p-6">
            {family.extra.map((p, i) => (
              <p key={i} className="text-[var(--ipk-text)]" style={{ fontSize: "15px", lineHeight: 1.8 }}>
                {p}
              </p>
            ))}
          </div>
        )}

        {/* Liens croisés vers les rubriques sœurs */}
        <CrossLinksBlock links={metierCrossLinks[family.slug] ?? []} />

        {/* Navigation entre familles */}
        <div className="mt-12 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-[var(--ipk-border)] pt-8">
          <Link to="/metiers" className="inline-flex items-center gap-2 text-[var(--ipk-text)] hover:text-[var(--ipk-green)] transition-colors" style={{ fontSize: "14px", fontWeight: 600 }}>
            <ArrowLeft className="w-4 h-4" /> Toutes les familles
          </Link>
          <Link to={`/metiers/${next.slug}`} className="inline-flex items-center justify-center gap-2 bg-[var(--ipk-green-dark)] text-white rounded-xl h-11 px-6 hover:bg-[var(--ipk-green-darker)] transition-colors" style={{ fontSize: "14px", fontWeight: 600 }}>
            Famille suivante : {next.title} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
