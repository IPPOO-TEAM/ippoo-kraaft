import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LazyImage } from "./lazy-image";

// Bannières partenaires (format large, texte intégré → object-contain sur fond dédié)
import adMtn from "../../imports/SMS-PRO__2_.jpg";
import adMoov from "../../imports/images_-_2026-04-10T163945.322.jpeg";
import adCeltiis from "../../imports/SLIDER_ASSO_TCHE-03__2_.jpeg";
import adEcobank from "../../imports/ecobank_ci_0.jpg";
// Photos lifestyle (object-cover + habillage)
import photoPeppers from "../../imports/photo_10_2026-06-20_12-37-52.jpg";
import photoBoutique from "../../imports/african-woman-successful-small-business-600nw-2745247757.jpg";
import photoFood from "../../imports/images_-_2026-04-10T164300.056.jpeg";
import photoTractor from "../../imports/photo_9_2026-06-20_12-37-52.jpg";
import photoSeedling from "../../imports/photo_12_2026-06-20_12-37-52.jpg";
import photoWomen from "../../imports/trois-femmes-africaines-choisissent-vetements-lors-journee-magasinage_926199-2565282.jpg";

export type AdSlide = {
  image: string;
  alt: string;
  fit: "cover" | "contain";
  bg?: string;
  badge: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaTo: string;
  /** Ratio hauteur/largeur de l'image (ex: 0.5 = 2:1). Si absent → hauteur fixe. */
  aspectRatio?: number;
};

// ── Carrousel de la page d'accueil (app) - 5 images uniques ──
export const homeAdSlides: AdSlide[] = [
  {
    image: adMtn, alt: "MTN Business - SMS Pro", fit: "contain", bg: "#FFCB05",
    badge: "Partenaire", title: "MTN Business - SMS Pro",
    description: "Touchez tous vos clients d'un seul SMS, où que vous soyez.",
    ctaLabel: "Devenir partenaire", ctaTo: "/contact",
  },
  {
    image: adMoov, alt: "Moov Africa - Illimix", fit: "contain", bg: "#0A3D91",
    badge: "Partenaire", title: "Moov Africa - Illimix",
    description: "Appels et Internet illimités : restez connecté à la communauté KRAAFT.",
    ctaLabel: "Nos partenaires", ctaTo: "/contact",
  },
  {
    image: photoPeppers, alt: "Récolte maraîchère africaine", fit: "cover",
    badge: "Terroirs", title: "Terroirs & groupements agricoles",
    description: "Des récoltes d'exception, valorisées et mises en marché collectivement.",
    ctaLabel: "Voir les achats groupés", ctaTo: "/achats-groupes",
  },
  {
    image: photoBoutique, alt: "Mode africaine en boutique", fit: "cover",
    badge: "Boutique", title: "La mode africaine authentique",
    description: "Vêtements, tissus et parures façonnés par nos artisans certifiés.",
    ctaLabel: "Explorer la boutique", ctaTo: "/boutique",
  },
  {
    image: photoFood, alt: "Saveurs et cuisine africaine", fit: "cover",
    badge: "Jour de marché", title: "Saveurs du jour de marché",
    description: "Le meilleur des terroirs africains, à l'honneur chaque semaine.",
    ctaLabel: "Découvrir le jour de marché", ctaTo: "/jour-de-marche",
  },
];

// ── Carrousel de la landing page - 5 autres images uniques ──
export const landingAdSlides: AdSlide[] = [
  {
    image: adCeltiis, alt: "Celtiis - Illiminet boosté", fit: "contain", bg: "#e8f3fb",
    badge: "Partenaire", title: "Celtiis - Illiminet boosté",
    description: "Plus de data pour rester connecté à l'artisanat africain.",
    ctaLabel: "Rejoindre KRAAFT", ctaTo: "/inscription",
  },
  {
    image: adEcobank, alt: "Ecobank - The Pan African Bank", fit: "contain", bg: "#123a68",
    badge: "Partenaire", title: "Ecobank - The Pan African Bank",
    description: "Des paiements sécurisés, à l'échelle du continent africain.",
    ctaLabel: "Voir la Place de Marché", ctaTo: "/marketplace",
  },
  {
    image: photoTractor, alt: "Agriculture africaine", fit: "cover",
    badge: "Filières", title: "De la terre à l'atelier",
    description: "Les matières premières qui nourrissent les savoir-faire ancestraux.",
    ctaLabel: "Découvrir les formations", ctaTo: "/formations",
  },
  {
    image: photoSeedling, alt: "Transmission et culture", fit: "cover",
    badge: "Transmission", title: "Cultiver les savoir-faire",
    description: "Former et accompagner la nouvelle génération d'artisans.",
    ctaLabel: "Académie KRAAFT", ctaTo: "/academie",
  },
  {
    image: photoWomen, alt: "Expérience shopping KRAAFT", fit: "cover",
    badge: "Communauté", title: "Vivez l'expérience KRAAFT",
    description: "Rejoignez une communauté passionnée d'art et de culture africaine.",
    ctaLabel: "Créer un compte", ctaTo: "/inscription",
  },
];

export function AdCarousel({
  slides,
  interval = 5500,
  className = "",
}: {
  slides: AdSlide[];
  interval?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // Hauteurs mesurées pour chaque image chargée - permet l'adaptation automatique
  const [heights, setHeights] = useState<Record<number, number>>({});
  const count = slides.length;
  const touchX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const go = (i: number) => setIndex(((i % count) + count) % count);
  const next = () => go(index + 1);
  const prev = () => go(index - 1);

  useEffect(() => {
    if (paused || count <= 1) return;
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(() => setIndex((v) => (v + 1) % count), interval);
    return () => window.clearInterval(id);
  }, [paused, count, interval]);

  // Hauteur courante : celle de l'image active (si mesurée), sinon minimum 200px
  const currentHeight = heights[index];

  if (!count) return null;

  return (
    <section
      ref={containerRef}
      className={`relative overflow-hidden rounded-3xl border border-[var(--ipk-border)] shadow-sm ${className}`}
      style={{
        height: currentHeight ? currentHeight : undefined,
        minHeight: 160,
        transition: "height 0.5s cubic-bezier(0.4,0,0.2,1)",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carrousel"
      aria-label="Annonces & partenaires"
    >
      {/* Piste de slides - position absolute pour que la hauteur du conteneur soit pilotée par state */}
      <div
        className="absolute inset-0 flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchX.current == null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (dx > 40) prev(); else if (dx < -40) next();
          touchX.current = null;
        }}
      >
        {slides.map((s, i) => (
          <div
            key={i}
            className="relative w-full shrink-0 flex-shrink-0 overflow-hidden"
            style={{
              width: "100%",
              minWidth: "100%",
              backgroundColor: s.bg || "var(--ipk-ink)",
            }}
            aria-hidden={i !== index}
          >
            {/* Image mesurée avec onLoad pour récupérer la hauteur naturelle rendue */}
            <img
              src={s.image}
              alt={s.alt}
              loading="lazy"
              decoding="async"
              onLoad={(e) => {
                const img = e.currentTarget;
                // Largeur du conteneur au moment du chargement
                const containerWidth = containerRef.current?.offsetWidth ?? img.naturalWidth;
                let renderedH: number;
                if (s.fit === "contain") {
                  // object-contain : hauteur = largeur × (natural H / natural W), plafonnée
                  renderedH = Math.round((containerWidth * img.naturalHeight) / img.naturalWidth);
                  renderedH = Math.min(renderedH, 480);
                } else {
                  // object-cover : on fixe un ratio 16/7 (larges images paysage)
                  renderedH = Math.round(containerWidth * (7 / 16));
                }
                renderedH = Math.max(renderedH, 160);
                setHeights((h) => ({ ...h, [i]: renderedH }));
              }}
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: s.fit === "contain" ? "contain" : "cover",
              }}
            />
          </div>
        ))}
      </div>

      {/* Flèches */}
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Annonce précédente"
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-[var(--ipk-ink)] flex items-center justify-center shadow-md transition-colors z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Annonce suivante"
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-[var(--ipk-ink)] flex items-center justify-center shadow-md transition-colors z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Puces */}
      {count > 1 && (
        <div className="absolute bottom-3 right-4 flex items-center gap-1.5 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-label={`Aller à l'annonce ${i + 1}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
