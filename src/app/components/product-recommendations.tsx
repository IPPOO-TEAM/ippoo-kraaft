import React from "react";
import { Link } from "react-router";
import { Star, ArrowRight } from "lucide-react";
import { Badge } from "./ui/badge";
import { LazyImage } from "./lazy-image";
import { formatPrice } from "../data/mock-data";
import { useCurrency } from "../hooks/use-currency";

interface Props {
  title: string;
  subtitle?: string;
  products: any[];
  emptyHint?: string;
  icon?: React.ReactNode;
  accent?: "green" | "blue" | "amber";
  ctaLabel?: string;
  ctaHref?: string;
}

const ACCENT: Record<NonNullable<Props["accent"]>, { bg: string; text: string }> = {
  green: { bg: "bg-[#0B6B3A]/10", text: "text-[var(--ipk-green-dark)]" },
  blue: { bg: "bg-[#0057FF]/10", text: "text-[var(--ipk-blue)]" },
  amber: { bg: "bg-amber-100", text: "text-amber-700" },
};

export function ProductRecommendations({ title, subtitle, products, emptyHint, icon, accent = "green", ctaLabel, ctaHref }: Props) {
  const { format: formatCurrency, active: activeCurrency } = useCurrency();
  const showPrice = (xof: number) => activeCurrency === "XOF" ? formatPrice(xof) : formatCurrency(xof);
  const tone = ACCENT[accent];

  if (!products || products.length === 0) {
    if (!emptyHint) return null;
    return (
      <section className="mt-8 sm:mt-10">
        <div className="flex items-center gap-2 mb-2">
          {icon && <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${tone.bg} ${tone.text}`}>{icon}</span>}
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 600, color: "var(--ipk-ink)" }}>{title}</h2>
        </div>
        <p className="text-[var(--ipk-text)]" style={{ fontSize: "13px" }}>{emptyHint}</p>
      </section>
    );
  }

  return (
    <section className="mt-8 sm:mt-10">
      <div className="flex items-end justify-between gap-3 mb-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            {icon && <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${tone.bg} ${tone.text}`}>{icon}</span>}
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 600, color: "var(--ipk-ink)" }}>{title}</h2>
          </div>
          {subtitle && <p className="text-[var(--ipk-text)] mt-1" style={{ fontSize: "13px" }}>{subtitle}</p>}
        </div>
        {ctaLabel && ctaHref && (
          <Link to={ctaHref} className={`inline-flex items-center gap-1 ${tone.text}`} style={{ fontSize: "13px", fontWeight: 500 }}>
            {ctaLabel} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 snap-x" style={{ WebkitOverflowScrolling: "touch" }}>
        {products.map(p => {
          const promo = (p as any).promo as { percent: number } | undefined;
          const original = (p as any).originalPrice as number | undefined;
          return (
            <Link
              key={p.id}
              to={`/boutique/${p.slug}`}
              className="w-40 sm:w-44 shrink-0 snap-start bg-white rounded-xl overflow-hidden border border-[var(--ipk-border)] hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-square overflow-hidden">
                <LazyImage src={p.images[0]} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                {promo?.percent ? (
                  <div className="absolute top-1.5 left-1.5">
                    <Badge className="bg-[var(--ipk-green-dark)] text-white border-0" style={{ fontSize: "10px" }}>-{promo.percent}%</Badge>
                  </div>
                ) : null}
              </div>
              <div className="p-2">
                <h4 className="truncate" style={{ fontSize: "12px", fontWeight: 600, color: "var(--ipk-ink)" }}>{p.name}</h4>
                <p className="text-[var(--ipk-text)] truncate mt-0.5" style={{ fontSize: "10px" }}>{p.category}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 fill-[var(--ipk-amber)] text-[var(--ipk-amber)]" />
                  <span className="text-[var(--ipk-text)]" style={{ fontSize: "10px" }}>{p.rating}</span>
                </div>
                <div className="flex items-baseline gap-1 mt-1 flex-wrap">
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--ipk-green)" }}>{showPrice(p.price)}</span>
                  {original && original > p.price && (
                    <span className="line-through text-[var(--ipk-text)]" style={{ fontSize: "10px" }}>{showPrice(original)}</span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
