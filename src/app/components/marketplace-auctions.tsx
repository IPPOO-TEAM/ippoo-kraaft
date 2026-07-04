import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { Gavel, Clock, TrendingUp, Users, ArrowRight } from "lucide-react";
import { LazyImage } from "./lazy-image";
import { formatPrice } from "../data/mock-data";
import { useAuctions, formatCountdown, type LiveLot } from "../hooks/use-auctions";

function LotCard({ lot, now, onBid }: { lot: LiveLot; now: number; onBid: (lotId: string, amount: number, name: string) => { ok: boolean; error?: string } }) {
  const [amount, setAmount] = useState<string>(String(lot.minNextBid));
  const [name, setName] = useState("");
  const timeLeft = lot.endsAt - now;
  const urgent = timeLeft > 0 && timeLeft < 3600_000;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const value = parseInt(amount.replace(/\s/g, ""), 10);
    const res = onBid(lot.id, value, name);
    if (!res.ok) {
      toast.error(res.error || "Enchère refusée");
      return;
    }
    toast.success("Enchère enregistrée !", { description: `${formatPrice(value)} sur ${lot.product?.name ?? "ce lot"}` });
  };

  if (!lot.product) return null;

  return (
    <article className="bg-white rounded-2xl border border-[var(--ipk-border)] overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link to={`/boutique/${lot.product.slug}`}>
          <LazyImage src={lot.product.images[0]} alt={lot.product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        </Link>
        <div className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white ${lot.ended ? "bg-[var(--ipk-text)]" : urgent ? "bg-red-600" : "bg-[var(--ipk-green-dark)]"}`} style={{ fontSize: "12px", fontWeight: 600 }}>
          <Clock className="w-3.5 h-3.5" /> {formatCountdown(timeLeft)}
        </div>
        <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 text-[var(--ipk-ink)]" style={{ fontSize: "12px", fontWeight: 600 }}>
          <Users className="w-3.5 h-3.5" /> {lot.bidCount}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[var(--ipk-green)]" style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em" }}>{lot.id.toUpperCase()}</span>
          <span className="text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>· Pièce unique</span>
        </div>
        <h3 className="text-[var(--ipk-ink)] mb-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700 }}>
          {lot.product.name}
        </h3>
        <p className="text-[var(--ipk-text)] mb-3" style={{ fontSize: "12.5px", lineHeight: 1.5 }}>
          {lot.provenance}
        </p>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="rounded-xl bg-[var(--ipk-surface)] p-3">
            <div className="text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>Enchère actuelle</div>
            <div className="text-[var(--ipk-green-dark)] flex items-center gap-1" style={{ fontSize: "16px", fontWeight: 700 }}>
              <TrendingUp className="w-4 h-4" /> {formatPrice(lot.currentBid)}
            </div>
          </div>
          <div className="rounded-xl bg-[var(--ipk-surface)] p-3">
            <div className="text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>Estimation</div>
            <div className="text-[var(--ipk-ink)]" style={{ fontSize: "13px", fontWeight: 600 }}>
              {formatPrice(lot.estimateLow)} – {formatPrice(lot.estimateHigh)}
            </div>
          </div>
        </div>

        {lot.lastBidder && (
          <p className="text-[var(--ipk-text)] mb-3" style={{ fontSize: "12px" }}>
            Meilleure offre : <span className="text-[var(--ipk-ink)] font-medium">{lot.lastBidder}</span>
          </p>
        )}

        <div className="mt-auto">
          {lot.ended ? (
            <div className="rounded-xl bg-[var(--ipk-surface)] p-3 text-center text-[var(--ipk-text)]" style={{ fontSize: "13px", fontWeight: 600 }}>
              Vente clôturée {lot.lastBidder ? `- adjugé à ${lot.lastBidder}` : "- sans enchère"}
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom (optionnel)"
                className="w-full border border-[var(--ipk-border)] rounded-lg px-3 py-2 bg-[var(--ipk-surface)]"
                style={{ fontSize: "13px" }}
                aria-label="Votre nom"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  value={amount}
                  min={lot.minNextBid}
                  step={lot.minIncrement}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 min-w-0 border border-[var(--ipk-border)] rounded-lg px-3 py-2"
                  style={{ fontSize: "13px" }}
                  aria-label="Montant de votre enchère"
                />
                <button type="submit" className="inline-flex items-center gap-1.5 bg-[var(--ipk-green-dark)] text-white rounded-lg px-4 shrink-0 hover:bg-[var(--ipk-green-darker)] transition-colors" style={{ fontSize: "13px", fontWeight: 600 }}>
                  <Gavel className="w-4 h-4" /> Enchérir
                </button>
              </div>
              <p className="text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>
                Mise minimale : {formatPrice(lot.minNextBid)} (incrément {formatPrice(lot.minIncrement)})
              </p>
            </form>
          )}
        </div>
      </div>
    </article>
  );
}

export function AuctionHouse() {
  const { lots, now, placeBid } = useAuctions();
  const live = lots.filter((l) => !l.ended).length;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <h2 className="text-[var(--ipk-ink)] inline-flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 700 }}>
          <Gavel className="w-5 h-5 text-[var(--ipk-green)]" /> Salle des ventes en direct
        </h2>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--ipk-green)]/10 text-[var(--ipk-green-dark)]" style={{ fontSize: "12px", fontWeight: 600 }}>
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> {live} lot{live > 1 ? "s" : ""} en cours
        </span>
      </div>
      <p className="text-[var(--ipk-text)] mb-6" style={{ fontSize: "14px", lineHeight: 1.6 }}>
        Enchérissez sur des pièces d'exception documentées. Vos mises sont enregistrées sur cet appareil (démonstration). Chaque lot renvoie vers sa fiche complète.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {lots.map((lot) => (
          <LotCard key={lot.id} lot={lot} now={now} onBid={placeBid} />
        ))}
      </div>
      <div className="mt-6 text-center">
        <Link to="/boutique" className="inline-flex items-center gap-2 text-[var(--ipk-green)] hover:underline" style={{ fontSize: "14px", fontWeight: 600 }}>
          Voir toutes les pièces uniques en boutique <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
