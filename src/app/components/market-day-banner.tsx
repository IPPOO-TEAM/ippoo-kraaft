import { Link } from "react-router";
import { Calendar, ChevronRight, Sparkles } from "lucide-react";
import { marketDays } from "../data/marketing-data";

// Bandeau "Jour de marché" affiché en home si la date du jour correspond
// à un MarketDay programmé. Mise en avant du thème + offre du jour.
export function MarketDayBanner() {
  const today = new Date();
  const md = marketDays.find(d => new Date(d.date).toDateString() === today.toDateString());
  if (!md) return null;

  return (
    <Link to="/jour-de-marche" className="block">
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(90deg, #0B6B3A 0%, #B45309 55%, #C026D3 100%)",
          color: "#fffbeb",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(255,255,255,0.18) 0 6px, transparent 6px 14px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.1) 0 4px, transparent 4px 12px)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 text-[11px] uppercase tracking-widest">
            <Sparkles className="w-3 h-3" /> En direct
          </span>
          <Calendar className="w-4 h-4 shrink-0 hidden sm:inline" />
          <span className="text-sm flex-1 min-w-0 truncate">
            <strong className="font-medium">Jour de marché - {md.theme}</strong>
            <span className="opacity-90"> · {md.highlight}</span>
          </span>
          <span className="inline-flex items-center gap-1 text-xs hover:underline">
            Découvrir <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
