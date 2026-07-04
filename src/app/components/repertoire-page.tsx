import { Link } from "react-router";
import { ArrowRight, ChevronRight, Network, CheckCircle2, UserPlus } from "lucide-react";
import { LazyImage } from "./lazy-image";
import { useSeo } from "../hooks/use-seo";
import {
  DIRECTORY_INTRO,
  directorySections,
  type DirBlock,
} from "../data/african-artisans-directory";

function BlockView({ block }: { block: DirBlock }) {
  if (block.type === "p") {
    return (
      <p className="text-[var(--ipk-text)]" style={{ fontSize: "15px", lineHeight: 1.8 }}>
        {block.text}
      </p>
    );
  }
  if (block.type === "list") {
    return (
      <div>
        {block.intro && (
          <p className="text-[var(--ipk-ink)] mb-3" style={{ fontSize: "15px", fontWeight: 600 }}>
            {block.intro}
          </p>
        )}
        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
          {block.items.map((it) => (
            <li key={it} className="flex items-start gap-2 text-[var(--ipk-text)]" style={{ fontSize: "14px", lineHeight: 1.6 }}>
              <CheckCircle2 className="w-4 h-4 text-[var(--ipk-green)] mt-0.5 shrink-0" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  // group
  return (
    <div className="bg-[var(--ipk-surface)] rounded-xl p-4">
      <h3 className="text-[var(--ipk-ink)] mb-2" style={{ fontSize: "15px", fontWeight: 700 }}>
        {block.heading}
      </h3>
      {block.text && (
        <p className="text-[var(--ipk-text)]" style={{ fontSize: "14px", lineHeight: 1.7 }}>
          {block.text}
        </p>
      )}
      {block.intro && (
        <p className="text-[var(--ipk-text)] mb-2" style={{ fontSize: "14px" }}>
          {block.intro}
        </p>
      )}
      {block.items && (
        <div className="flex flex-wrap gap-2 mt-1">
          {block.items.map((it) => (
            <span key={it} className="px-3 py-1 rounded-full bg-white border border-[var(--ipk-border)] text-[var(--ipk-ink)]" style={{ fontSize: "13px" }}>
              {it}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function RepertoirePage() {
  useSeo({
    title: "Ordre Africain des Artisans & Répertoire professionnel",
    description:
      "Le grand registre panafricain IPPOO KRAAFT : Who's Who des métiers d'art, classement par secteur, spécialité, matériaux, niveau de maîtrise, écoles et ateliers.",
  });

  return (
    <div className="pb-20 lg:pb-10">
      {/* HERO - décoratif sans image */}
      <section className="relative h-[300px] sm:h-[400px] overflow-hidden" style={{ background: "linear-gradient(135deg, #111418 0%, #16223a 55%, #0057FF 150%)" }}>
        <div aria-hidden className="absolute -top-24 -right-16 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[var(--ipk-blue)]/25 blur-3xl" />
        <div aria-hidden className="absolute -bottom-28 -left-20 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[var(--ipk-green)]/15 blur-3xl" />
        <Network aria-hidden className="absolute -right-8 sm:right-10 top-1/2 -translate-y-1/2 w-48 h-48 sm:w-72 sm:h-72 text-white/5 pointer-events-none" strokeWidth={1} />
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-8">
          <nav className="flex items-center gap-1.5 text-white/80 mb-3" style={{ fontSize: "13px" }} aria-label="Fil d'Ariane">
            <Link to="/accueil" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">Répertoire des artisans</span>
          </nav>
          <span className="inline-flex items-center gap-2 self-start mb-3 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-[var(--ipk-amber)]" style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            <Network className="w-3.5 h-3.5" /> {DIRECTORY_INTRO.eyebrow}
          </span>
          <h1 className="text-white max-w-3xl" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(30px, 5vw, 48px)", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.01em" }}>
            {DIRECTORY_INTRO.title}
          </h1>
          <p className="text-white/85 max-w-2xl mt-3" style={{ fontSize: "clamp(15px, 2vw, 18px)", lineHeight: 1.6 }}>
            {DIRECTORY_INTRO.hook}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="mt-8 space-y-4">
          {DIRECTORY_INTRO.paragraphs.map((p, i) => (
            <p key={i} className="text-[var(--ipk-text)]" style={{ fontSize: "16px", lineHeight: 1.85 }}>
              {p}
            </p>
          ))}
        </div>

        {/* Sommaire */}
        <div className="mt-8 bg-[var(--ipk-surface)] rounded-2xl p-5">
          <p className="text-[var(--ipk-ink)] mb-3" style={{ fontSize: "14px", fontWeight: 700 }}>Sommaire</p>
          <div className="flex flex-wrap gap-2">
            {directorySections.map((s) => (
              <a key={s.slug} href={`#${s.slug}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[var(--ipk-border)] hover:border-[var(--ipk-green)] transition-colors text-[var(--ipk-ink)]" style={{ fontSize: "13px", fontWeight: 500 }}>
                {s.title}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="mt-12 space-y-16">
          {directorySections.map((s, idx) => (
            <section key={s.slug} id={s.slug} className="scroll-mt-24">
              <div className={`grid lg:grid-cols-5 gap-6 lg:gap-8 items-start`}>
                {/* Image */}
                <div className={`lg:col-span-2 ${idx % 2 === 1 ? "lg:order-2" : ""}`}>
                  <div className="rounded-2xl overflow-hidden aspect-[4/3] sticky top-20">
                    <LazyImage src={s.image} alt={s.title} className="w-full h-full object-cover" />
                  </div>
                </div>
                {/* Contenu */}
                <div className={`lg:col-span-3 ${idx % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-[var(--ipk-ink)]" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 700 }}>
                      {s.title}
                    </h2>
                  </div>
                  <p className="text-[var(--ipk-green-dark)] mb-4" style={{ fontSize: "15px", fontWeight: 500, fontStyle: "italic" }}>
                    {s.lead}
                  </p>
                  <div className="space-y-4">
                    {s.blocks.map((b, i) => (
                      <BlockView key={i} block={b} />
                    ))}
                  </div>
                  {s.cta && (
                    <Link to={s.cta.to} className="inline-flex items-center gap-2 mt-5 bg-[var(--ipk-green-dark)] text-white rounded-xl h-11 px-5 hover:bg-[var(--ipk-green-darker)] transition-colors" style={{ fontSize: "14px", fontWeight: 600 }}>
                      {s.cta.label} <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* CTA final */}
        <div className="mt-16 bg-[var(--ipk-ink)] rounded-3xl p-8 sm:p-10 text-center">
          <h2 className="text-white mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 700 }}>
            Faites reconnaître votre talent
          </h2>
          <p className="text-white/75 max-w-2xl mx-auto mb-6" style={{ fontSize: "16px", lineHeight: 1.7 }}>
            Rejoignez l'Ordre Africain des Artisans, obtenez votre fiche officielle dans le Who's Who des métiers d'art et accédez à un réseau panafricain d'opportunités, de formations et de collaborations.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/devenir-artisan" className="inline-flex items-center justify-center gap-2 bg-white text-[var(--ipk-green-dark)] rounded-xl h-12 px-7 hover:bg-white/90 transition-colors" style={{ fontSize: "15px", fontWeight: 600 }}>
              <UserPlus className="w-5 h-5" /> Devenir membre
            </Link>
            <Link to="/groupements" className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white rounded-xl h-12 px-7 hover:bg-white/10 transition-colors" style={{ fontSize: "15px", fontWeight: 500 }}>
              Explorer les groupements <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
