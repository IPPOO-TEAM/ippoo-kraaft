import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { LazyImage } from "./lazy-image";

// Bloc éditorial réutilisable : une image de terroir + un texte cadré,
// ciblant précisément la niche de la page hôte. Une image = un seul bloc.
type NicheFeatureProps = {
  img: string;
  alt: string;
  kicker: string;
  title: string;
  text: string;
  cta?: string;
  to?: string;
  reverse?: boolean;
  tint?: string;
};

export function NicheFeature({
  img,
  alt,
  kicker,
  title,
  text,
  cta,
  to,
  reverse = false,
  tint = "ipk-card-peach",
}: NicheFeatureProps) {
  return (
    <article className={`group ${tint} rounded-3xl overflow-hidden border grid md:grid-cols-2 items-center mb-10`}>
      <div className={`relative overflow-hidden ${reverse ? "md:order-2" : ""}`}>
        <LazyImage
          src={img}
          alt={alt}
          className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className={`p-6 sm:p-10 flex flex-col justify-center ${reverse ? "md:order-1" : ""}`}>
        <span className="text-[var(--ipk-green-dark)] uppercase tracking-wider mb-3" style={{ fontSize: "12px", fontWeight: 700 }}>
          {kicker}
        </span>
        <h2 className="text-[var(--ipk-ink)] mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 3.2vw, 30px)", fontWeight: 700, lineHeight: 1.15 }}>
          {title}
        </h2>
        <p className="text-[var(--ipk-text)]" style={{ fontSize: "15px", lineHeight: 1.8 }}>
          {text}
        </p>
        {cta && to && (
          <Link
            to={to}
            className="inline-flex items-center gap-1.5 mt-5 text-[var(--ipk-blue)] hover:gap-2.5 transition-all"
            style={{ fontSize: "14px", fontWeight: 600 }}
          >
            {cta} <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </article>
  );
}
