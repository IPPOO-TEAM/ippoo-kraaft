import React, { useState } from "react";
import { Link, useParams } from "react-router";
import { MapPin, Users, Package, Shield, ChevronLeft, Star, ArrowRight } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { groupements, artisans, products, formatPrice } from "../data/mock-data";
import { LazyImage } from "./lazy-image";
import { useSeo } from "../hooks/use-seo";
import { NotFoundDetail } from "./not-found-detail";
import { toast } from "sonner";
import { EmptyState } from "./empty-state";
import { LeadModal } from "./lead-modal";

export function GroupementsPage() {
  useSeo({ title: "Groupements d'artisans", description: "Rencontrez les coopératives et groupements d'artisans certifiés IPPOO KRAAFT à travers l'Afrique." });
  const [filter, setFilter] = useState("");
  const countries = [...new Set(groupements.map(g => g.country))];
  const filtered = filter ? groupements.filter(g => g.country === filter) : groupements;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-20 lg:pb-6">
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 600, color: "var(--ipk-ink)" }}>
        Groupements d'Artisans
      </h1>
      <p className="text-[var(--ipk-text)] mt-1 mb-6" style={{ fontSize: "15px" }}>
        Des communautés organisées qui préservent les savoir-faire et mutualisent les ressources
      </p>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setFilter("")}
          className={`px-4 py-2 rounded-full transition-colors shrink-0 ${!filter ? "bg-[var(--ipk-green-dark)] text-white" : "bg-[var(--ipk-surface)] text-[var(--ipk-text)] border border-[var(--ipk-border)]"}`}
          style={{ fontSize: "13px", fontWeight: 500 }}
        >
          Tous les pays
        </button>
        {countries.map(c => (
          <button
            key={c}
            onClick={() => setFilter(filter === c ? "" : c)}
            className={`px-4 py-2 rounded-full flex items-center gap-1 transition-colors shrink-0 whitespace-nowrap ${filter === c ? "bg-[var(--ipk-blue)] text-white" : "bg-[var(--ipk-surface)] text-[var(--ipk-text)] border border-[var(--ipk-border)]"}`}
            style={{ fontSize: "13px", fontWeight: 500 }}
          >
            <MapPin className="w-3.5 h-3.5" /> {c}
          </button>
        ))}
      </div>

      {/* Groupements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filtered.length === 0 && (
          <EmptyState title="Aucun groupement" message="Aucun groupement ne correspond à ce pays." actionLabel="Voir tous les pays" onAction={() => setFilter("")} />
        )}
        {filtered.map((g) => (
          <Link key={g.id} to={`/groupements/${g.slug}`} className="bg-white rounded-2xl overflow-hidden border border-[var(--ipk-border)] group hover:shadow-lg transition-shadow">
            <div className="relative h-48 overflow-hidden">
              <LazyImage src={g.image} alt={g.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-4 py-2">
                <div className="flex items-center gap-1 text-white">
                  <MapPin className="w-3.5 h-3.5" />
                  <span style={{ fontSize: "12px" }}>{g.region}, {g.country}</span>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-5">
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--ipk-ink)" }}>{g.name}</h3>
              <p className="text-[var(--ipk-text)] mt-2 line-clamp-2" style={{ fontSize: "14px", lineHeight: 1.6 }}>
                {g.description}
              </p>
              <div className="flex flex-wrap gap-1 mt-3">
                {g.specialties.map((s, i) => (
                  <Badge key={i} className="bg-[#0057FF]/10 text-[var(--ipk-blue)] border-0" style={{ fontSize: "11px" }}>{s}</Badge>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="text-center p-2 bg-[var(--ipk-surface)] rounded-xl">
                  <Users className="w-4 h-4 mx-auto text-[var(--ipk-green-dark)] mb-1" />
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--ipk-ink)" }}>{g.artisanCount}</div>
                  <div style={{ fontSize: "10px", color: "var(--ipk-text)" }}>Artisans</div>
                </div>
                <div className="text-center p-2 bg-[var(--ipk-surface)] rounded-xl">
                  <Package className="w-4 h-4 mx-auto text-[var(--ipk-blue)] mb-1" />
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--ipk-ink)" }}>{g.productCount}</div>
                  <div style={{ fontSize: "10px", color: "var(--ipk-text)" }}>Oeuvres</div>
                </div>
                <div className="text-center p-2 bg-[var(--ipk-surface)] rounded-xl">
                  <Shield className="w-4 h-4 mx-auto text-[var(--ipk-green-dark)] mb-1" />
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--ipk-ink)" }}>{g.conformity}%</div>
                  <div style={{ fontSize: "10px", color: "var(--ipk-text)" }}>Conforme</div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-8 sm:mt-10 bg-[var(--ipk-green-dark)] rounded-2xl p-5 sm:p-8 text-center">
        <h2 className="text-white mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 600 }}>
          Vous êtes artisan ?
        </h2>
        <p className="text-white/80 mb-5" style={{ fontSize: "14px" }}>
          Rejoignez un groupement IPPOO KRAAFT pour bénéficier de formations, visibilité et commandes régulières.
        </p>
        <Link to="/devenir-artisan">
          <Button className="bg-white text-[var(--ipk-green-dark)] hover:bg-white/90 rounded-xl h-11 px-6">
            Devenir artisan IPPOO <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function GroupementDetailPage() {
  const { slug } = useParams();
  const groupement = groupements.find(g => g.slug === slug);
  const [orderOpen, setOrderOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(false);

  useSeo({
    title: groupement ? groupement.name : "Groupement introuvable",
    description: groupement?.description,
    ogImage: groupement?.image,
    noIndex: !groupement,
  });

  if (!groupement) {
    return <NotFoundDetail title="Groupement introuvable" message="Ce groupement n'existe pas ou n'est plus actif." backTo="/groupements" backLabel="Voir tous les groupements" />;
  }

  const groupArtisans = artisans.filter(a => a.groupementId === groupement.id);
  const groupProducts = products.filter(p => p.groupementId === groupement.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 pb-20 lg:pb-6">
      <Link to="/groupements" className="flex items-center gap-1 text-[var(--ipk-text)] hover:text-[var(--ipk-green-dark)] mb-4" style={{ fontSize: "13px" }}>
        <ChevronLeft className="w-4 h-4" /> Groupements
      </Link>

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] mb-6">
        <LazyImage src={groupement.image} alt={groupement.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4 sm:p-6">
          <div className="flex items-center gap-1 text-white/80 mb-2">
            <MapPin className="w-4 h-4" />
            <span style={{ fontSize: "13px" }}>{groupement.region}, {groupement.country}</span>
          </div>
          <h1 className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 600 }}>
            {groupement.name}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <p className="text-[var(--ipk-text)]" style={{ fontSize: "15px", lineHeight: 1.8 }}>{groupement.description}</p>

          <div className="flex flex-wrap gap-2 mt-4">
            {groupement.specialties.map((s, i) => (
              <Badge key={i} className="bg-[#0057FF]/10 text-[var(--ipk-blue)] border-0" style={{ fontSize: "12px" }}>{s}</Badge>
            ))}
          </div>

          {/* Artisans */}
          <h2 className="mt-8 mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 600, color: "var(--ipk-ink)" }}>
            Artisans du groupement
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {groupArtisans.map(a => (
              <div key={a.id} className="text-center">
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-2 border-2 border-[var(--ipk-green-dark)]">
                  <LazyImage src={a.image} alt={a.name} className="w-full h-full object-cover" />
                </div>
                <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--ipk-ink)" }}>{a.name}</h4>
                <p style={{ fontSize: "12px", color: "var(--ipk-text)" }}>{a.specialty}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Star className="w-3 h-3 fill-[var(--ipk-amber)] text-[var(--ipk-amber)]" />
                  <span style={{ fontSize: "12px", color: "var(--ipk-text)" }}>{a.rating}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Products */}
          <h2 className="mt-8 mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 600, color: "var(--ipk-ink)" }}>
            Oeuvres du groupement
          </h2>
          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {groupProducts.map(p => (
              <Link key={p.id} to={`/boutique/${p.slug}`} className="w-36 sm:w-44 shrink-0 rounded-xl overflow-hidden border border-[var(--ipk-border)]">
                <div className="aspect-square overflow-hidden">
                  <LazyImage src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-2">
                  <h4 className="truncate" style={{ fontSize: "13px", fontWeight: 600, color: "var(--ipk-ink)" }}>{p.name}</h4>
                  <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--ipk-green)" }}>{formatPrice(p.price)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-[var(--ipk-surface)] rounded-2xl p-5">
            <h3 className="mb-4" style={{ fontSize: "16px", fontWeight: 600, color: "var(--ipk-ink)" }}>Chiffres clés</h3>
            <div className="space-y-3">
              {[
                { label: "Artisans", value: groupement.artisanCount, icon: Users },
                { label: "Oeuvres produites", value: groupement.productCount, icon: Package },
                { label: "Conformité normes", value: `${groupement.conformity}%`, icon: Shield },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-[var(--ipk-green-dark)]" />
                  </div>
                  <div className="flex-1">
                    <div style={{ fontSize: "12px", color: "var(--ipk-text)" }}>{item.label}</div>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--ipk-ink)" }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={() => setOrderOpen(true)} className="w-full bg-[var(--ipk-green-dark)] text-white rounded-xl h-11">
            Commander au groupement
          </Button>
          <Button variant="outline" onClick={() => setInviteOpen(true)} className="w-full border-2 border-[var(--ipk-blue)] text-[var(--ipk-blue)] rounded-xl h-11">
            Inviter à un événement
          </Button>
          <Button variant="outline" onClick={() => setPartnerOpen(true)} className="w-full border border-[var(--ipk-border)] rounded-xl h-11">
            Devenir partenaire
          </Button>
        </div>
      </div>
      <LeadModal open={orderOpen} onOpenChange={setOrderOpen} type="order_groupement" title={`Commander - ${groupement.name}`} description="Précisez vos besoins (volumes, modèles, délais)." refId={groupement.id} refLabel={groupement.name} successToast="Commande transmise au groupement." />
      <LeadModal open={inviteOpen} onOpenChange={setInviteOpen} type="event_invite" title={`Inviter ${groupement.name} à un événement`} description="Date, lieu, type d'événement - nous transmettons." refId={groupement.id} refLabel={groupement.name} successToast="Invitation transmise." />
      <LeadModal open={partnerOpen} onOpenChange={setPartnerOpen} type="partner" title={`Devenir partenaire - ${groupement.name}`} description="Nature du partenariat envisagé." refId={groupement.id} refLabel={groupement.name} successToast="Demande partenariat reçue - réponse sous 48h." />
    </div>
  );
}