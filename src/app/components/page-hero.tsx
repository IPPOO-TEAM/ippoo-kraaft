import { Link } from "react-router";
import { ChevronRight, type LucideIcon } from "lucide-react";

export type PageHeroTheme = {
  gradient: string;
  orb1Color: string;
  orb2Color: string;
  accentColor: string; // couleur de l'eyebrow badge et du tagline
};

// Palette de thèmes - chaque section a ses propres couleurs
export const PAGE_HERO_THEMES: Record<string, PageHeroTheme> = {
  // Métiers du Bois
  bois: {
    gradient: "linear-gradient(135deg, #1a1208 0%, #2d1e0a 50%, #3d2a10 150%)",
    orb1Color: "#B45309/30",
    orb2Color: "#0D8A3E/15",
    accentColor: "var(--ipk-amber)",
  },
  // Ferronnerie d'Art
  "ferronnerie-art": {
    gradient: "linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 50%, #2d1515 150%)",
    orb1Color: "#C2410C/30",
    orb2Color: "#6D28D9/12",
    accentColor: "#f97316",
  },
  // Pierre
  pierre: {
    gradient: "linear-gradient(135deg, #111418 0%, #1e2028 50%, #2a2d38 150%)",
    orb1Color: "#64748b/30",
    orb2Color: "#0D8A3E/12",
    accentColor: "#94a3b8",
  },
  // Argile & Terre
  "argile-terre": {
    gradient: "linear-gradient(135deg, #1c1005 0%, #2e1c0b 50%, #3d2810 150%)",
    orb1Color: "#92400e/35",
    orb2Color: "#0D8A3E/12",
    accentColor: "#d97706",
  },
  // Textile & Tissage
  textile: {
    gradient: "linear-gradient(135deg, #0f0a1e 0%, #1e1040 55%, #4c1d95 150%)",
    orb1Color: "#7C3AED/28",
    orb2Color: "#0D8A3E/12",
    accentColor: "#a78bfa",
  },
  // Cuir
  cuir: {
    gradient: "linear-gradient(135deg, #1a0f08 0%, #2e1c0e 50%, #4a2e1a 150%)",
    orb1Color: "#92400e/30",
    orb2Color: "#BE185D/12",
    accentColor: "#c4a07a",
  },
  // Médias & Podcasts
  "podcasts-griots": {
    gradient: "linear-gradient(135deg, #0f0a1e 0%, #1e0a2e 55%, #6D28D9 150%)",
    orb1Color: "#BE185D/25",
    orb2Color: "#0057FF/15",
    accentColor: "#e879f9",
  },
  "series-documentaires": {
    gradient: "linear-gradient(135deg, #0a0f1e 0%, #0e1635 55%, #1D4ED8 150%)",
    orb1Color: "#1D4ED8/30",
    orb2Color: "#7C3AED/15",
    accentColor: "#60a5fa",
  },
  "bibliotheque-audiovisuelle": {
    gradient: "linear-gradient(135deg, #111418 0%, #1a1f2e 55%, #1e3a5f 150%)",
    orb1Color: "#0057FF/25",
    orb2Color: "#0D8A3E/12",
    accentColor: "#7dd3fc",
  },
  // Patrimoines
  "centre-documentation": {
    gradient: "linear-gradient(135deg, #0a1612 0%, #0f2318 55%, #0D8A3E 150%)",
    orb1Color: "#0D8A3E/30",
    orb2Color: "#B45309/15",
    accentColor: "#34d399",
  },
  "inventaire-patrimoines-vivants": {
    gradient: "linear-gradient(135deg, #0a1a10 0%, #0f2618 55%, #15803d 150%)",
    orb1Color: "#0F766E/30",
    orb2Color: "#B45309/15",
    accentColor: "#4ade80",
  },
  "grands-maitres": {
    gradient: "linear-gradient(135deg, #1a1408 0%, #2a200e 55%, #78350f 150%)",
    orb1Color: "#B45309/35",
    orb2Color: "#0D8A3E/12",
    accentColor: "#fbbf24",
  },
  // Marketplace
  "galerie-creations": {
    gradient: "linear-gradient(135deg, #0a1a10 0%, #0f2018 55%, #0D8A3E 150%)",
    orb1Color: "#0D8A3E/30",
    orb2Color: "#B45309/15",
    accentColor: "#6ee7b7",
  },
  "ventes-encheres": {
    gradient: "linear-gradient(135deg, #1a0a1e 0%, #2a1040 55%, #6D28D9 150%)",
    orb1Color: "#7C3AED/30",
    orb2Color: "#B45309/20",
    accentColor: "#c4b5fd",
  },
  // Salons & Événements
  "grand-salon-kraaft": {
    gradient: "linear-gradient(135deg, #0d1018 0%, #0f1a28 55%, #1e3a5f 150%)",
    orb1Color: "#0057FF/30",
    orb2Color: "#BE185D/15",
    accentColor: "#93c5fd",
  },
  "musees-vivants": {
    gradient: "linear-gradient(135deg, #0a1612 0%, #122010 55%, #0D8A3E 150%)",
    orb1Color: "#0D8A3E/30",
    orb2Color: "#0057FF/15",
    accentColor: "#34d399",
  },
  // Dialogues & Innovation
  "dialogues-civilisations": {
    gradient: "linear-gradient(135deg, #0a0f1e 0%, #0e1635 55%, #0046CC 150%)",
    orb1Color: "#0057FF/30",
    orb2Color: "#0D8A3E/15",
    accentColor: "#60a5fa",
  },
  "industries-creatives": {
    gradient: "linear-gradient(135deg, #0a0a1e 0%, #151030 55%, #4C1D95 150%)",
    orb1Color: "#7C3AED/30",
    orb2Color: "#BE185D/15",
    accentColor: "#a78bfa",
  },
  // Arts & Culture
  coiffure: {
    gradient: "linear-gradient(135deg, #1a0a10 0%, #2a1020 55%, #BE185D 150%)",
    orb1Color: "#BE185D/30",
    orb2Color: "#B45309/15",
    accentColor: "#f9a8d4",
  },
  tambours: {
    gradient: "linear-gradient(135deg, #1a0808 0%, #2a1010 55%, #C2410C 150%)",
    orb1Color: "#C2410C/35",
    orb2Color: "#78350f/20",
    accentColor: "#fdba74",
  },
  // Défaut - toutes les sections non mappées
  default: {
    gradient: "linear-gradient(135deg, #111418 0%, #1a2028 55%, #0B6B3A 150%)",
    orb1Color: "#0D8A3E/25",
    orb2Color: "#0057FF/12",
    accentColor: "var(--ipk-amber)",
  },
};

function getTheme(slug: string): PageHeroTheme {
  return PAGE_HERO_THEMES[slug] ?? PAGE_HERO_THEMES.default;
}

export type Breadcrumb = { label: string; to: string };
export type HeroCta = { label: string; to: string; variant?: "primary" | "outline" };

type PageHeroProps = {
  slug: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  tagline?: string;
  breadcrumbs: Breadcrumb[];
  ctas?: HeroCta[];
  /** Lettre A/B/C pour les sections numérotées */
  letter?: string;
};

export function PageHero({ slug, icon: Icon, eyebrow, title, tagline, breadcrumbs, ctas, letter }: PageHeroProps) {
  const theme = getTheme(slug);

  return (
    <section className="relative overflow-hidden" style={{ background: theme.gradient }}>
      {/* Orbes décoratifs - même pattern que l'Académie */}
      <div aria-hidden className={`absolute -top-24 -right-16 w-72 h-72 sm:w-[28rem] sm:h-[28rem] rounded-full blur-3xl bg-[${theme.orb1Color}]`} />
      <div aria-hidden className={`absolute -bottom-28 -left-20 w-72 h-72 sm:w-[28rem] sm:h-[28rem] rounded-full blur-3xl bg-[${theme.orb2Color}]`} />

      {/* Icône filigrane (décorative) */}
      <Icon
        aria-hidden
        className="absolute -right-8 sm:right-10 top-1/2 -translate-y-1/2 w-48 h-48 sm:w-72 sm:h-72 text-white/[0.05] pointer-events-none"
        strokeWidth={0.75}
      />

      {/* Contenu */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-18">
        {/* Fil d'Ariane */}
        <nav className="flex items-center gap-1.5 text-white/60 mb-5 flex-wrap" style={{ fontSize: "13px" }} aria-label="Fil d'Ariane">
          {breadcrumbs.map((b, i) => (
            <span key={b.to} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-white/40" />}
              <Link to={b.to} className="hover:text-white transition-colors">{b.label}</Link>
            </span>
          ))}
          <ChevronRight className="w-3.5 h-3.5 text-white/40" />
          <span className="text-white/90">{title}</span>
        </nav>

        {/* Eyebrow badge */}
        <span
          className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm"
          style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: theme.accentColor }}
        >
          <Icon className="w-3.5 h-3.5" />
          {letter ? `${letter}. ` : ""}{eyebrow}
        </span>

        {/* Titre principal */}
        <h1
          className="text-white max-w-3xl"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 700, lineHeight: 1.1 }}
        >
          {title}
        </h1>

        {/* Tagline */}
        {tagline && (
          <p className="text-white/75 italic mt-3 max-w-3xl" style={{ fontSize: "clamp(15px, 2vw, 18px)" }}>
            {tagline}
          </p>
        )}

        {/* CTAs */}
        {ctas && ctas.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-7">
            {ctas.map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className={
                  c.variant === "outline"
                    ? "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/30 text-white hover:bg-white/10 transition-colors"
                    : "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[var(--ipk-ink)] hover:bg-white/90 transition-colors"
                }
                style={{ fontSize: "14px", fontWeight: 600 }}
              >
                {c.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
