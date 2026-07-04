import React, { useState } from "react";
import { Link, useParams } from "react-router";
import { Clock, MapPin, Users, Star, Calendar, ChevronLeft, GraduationCap, BookOpen, CheckCircle2, ArrowRight } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { formations, formatPrice } from "../data/mock-data";
import { LazyImage } from "./lazy-image";
import { useSeo } from "../hooks/use-seo";
import { NotFoundDetail } from "./not-found-detail";
import { toast } from "sonner";
import { EmptyState } from "./empty-state";
import { LeadModal } from "./lead-modal";

export function FormationsPage() {
  useSeo({ title: "Formations artisanales", description: "Catalogue de formations en sculpture, textile, poterie, métallurgie et plus pour artisans et passionnés." });
  const [filter, setFilter] = useState("");
  const [modeFilter, setModeFilter] = useState("");
  const cats = [...new Set(formations.map(f => f.category))];
  const modes = [...new Set(formations.map(f => f.mode))];

  const filtered = formations.filter(f => {
    if (filter && f.category !== filter) return false;
    if (modeFilter && f.mode !== modeFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-20 lg:pb-6">
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 600, color: "var(--ipk-ink)" }}>
        Formations
      </h1>
      <p className="text-[var(--ipk-text)] mt-1 mb-6" style={{ fontSize: "15px" }}>
        Perfectionnez vos techniques et développez vos compétences avec nos formations certifiantes
      </p>

      {/* Filters */}
      <div className="space-y-3 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button onClick={() => setFilter("")} className={`px-4 py-2 rounded-full transition-colors shrink-0 ${!filter ? "bg-[var(--ipk-green-dark)] text-white" : "bg-[var(--ipk-surface)] text-[var(--ipk-text)] border border-[var(--ipk-border)]"}`} style={{ fontSize: "13px", fontWeight: 500 }}>
            Toutes
          </button>
          {cats.map(c => (
            <button key={c} onClick={() => setFilter(filter === c ? "" : c)} className={`px-4 py-2 rounded-full transition-colors shrink-0 whitespace-nowrap ${filter === c ? "bg-[var(--ipk-blue)] text-white" : "bg-[var(--ipk-surface)] text-[var(--ipk-text)] border border-[var(--ipk-border)]"}`} style={{ fontSize: "13px", fontWeight: 500 }}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {modes.map(m => (
            <button key={m} onClick={() => setModeFilter(modeFilter === m ? "" : m)} className={`px-3 py-1.5 rounded-full transition-colors shrink-0 whitespace-nowrap ${modeFilter === m ? "bg-[var(--ipk-green-dark)] text-white" : "bg-[var(--ipk-surface)] text-[var(--ipk-text)] border border-[var(--ipk-border)]"}`} style={{ fontSize: "12px", fontWeight: 500 }}>
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Formation cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 && (
          <EmptyState title="Aucune formation" message="Aucune formation ne correspond à ces filtres." actionLabel="Réinitialiser" onAction={() => { setFilter(""); setModeFilter(""); }} />
        )}
        {filtered.map((f) => (
          <Link key={f.id} to={`/formations/${f.slug}`} className="bg-white rounded-2xl overflow-hidden border border-[var(--ipk-border)] group hover:shadow-lg transition-shadow">
            <div className="relative h-40 overflow-hidden">
              <LazyImage src={f.image} alt={f.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute top-3 left-3 flex gap-1">
                <Badge className="bg-[var(--ipk-blue)] text-white border-0" style={{ fontSize: "10px" }}>{f.category}</Badge>
                <Badge className="bg-white text-[var(--ipk-ink)] border-0" style={{ fontSize: "10px" }}>{f.level}</Badge>
              </div>
            </div>
            <div className="p-4">
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--ipk-ink)" }}>{f.title}</h3>
              <p className="text-[var(--ipk-text)] mt-1 line-clamp-2" style={{ fontSize: "13px", lineHeight: 1.5 }}>{f.description}</p>
              <div className="flex flex-wrap gap-3 mt-3" style={{ fontSize: "12px", color: "var(--ipk-text)" }}>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {f.duration}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {f.mode}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {f.nextDate}
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--ipk-border)]">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-[var(--ipk-amber)] text-[var(--ipk-amber)]" />
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>{f.rating}</span>
                  <span style={{ fontSize: "12px", color: "var(--ipk-text)" }}>({f.reviewCount})</span>
                </div>
                <span style={{ fontSize: "18px", fontWeight: 700, color: "var(--ipk-green-dark)" }}>
                  {f.price === 0 ? "Gratuit" : formatPrice(f.price)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function FormationDetailPage() {
  const { slug } = useParams();
  const formation = formations.find(f => f.slug === slug);
  const [signupOpen, setSignupOpen] = useState(false);
  const [brochureOpen, setBrochureOpen] = useState(false);

  useSeo({
    title: formation ? formation.title : "Formation introuvable",
    description: formation?.description,
    ogImage: formation?.image,
    noIndex: !formation,
  });

  if (!formation) {
    return <NotFoundDetail title="Formation introuvable" message="Cette formation n'est plus disponible." backTo="/formations" backLabel="Voir toutes les formations" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 pb-20 lg:pb-6">
      <Link to="/formations" className="flex items-center gap-1 text-[var(--ipk-text)] hover:text-[var(--ipk-green-dark)] mb-4" style={{ fontSize: "13px" }}>
        <ChevronLeft className="w-4 h-4" /> Formations
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="relative rounded-2xl overflow-hidden aspect-[16/9] mb-6">
            <LazyImage src={formation.image} alt={formation.title} className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <Badge className="bg-[#0057FF]/10 text-[var(--ipk-blue)] border-0">{formation.category}</Badge>
            <Badge className="bg-[var(--ipk-surface)] text-[var(--ipk-text)] border-[var(--ipk-border)]">{formation.level}</Badge>
            <Badge className="bg-[var(--ipk-surface)] text-[var(--ipk-text)] border-[var(--ipk-border)]">{formation.mode}</Badge>
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 600, color: "var(--ipk-ink)" }}>
            {formation.title}
          </h1>

          <div className="flex items-center gap-2 mt-2 mb-4">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(formation.rating) ? "fill-[var(--ipk-amber)] text-[var(--ipk-amber)]" : "text-[var(--ipk-border)]"}`} />
              ))}
            </div>
            <span style={{ fontSize: "14px", color: "var(--ipk-text)" }}>{formation.rating} ({formation.reviewCount} avis)</span>
          </div>

          <p className="text-[var(--ipk-text)]" style={{ fontSize: "15px", lineHeight: 1.8 }}>{formation.description}</p>

          <h2 className="mt-8 mb-4" style={{ fontSize: "18px", fontWeight: 600, color: "var(--ipk-ink)" }}>Objectifs</h2>
          <ul className="space-y-2">
            {formation.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-[var(--ipk-green-dark)] mt-0.5 shrink-0" />
                <span style={{ fontSize: "14px", color: "var(--ipk-text)" }}>{obj}</span>
              </li>
            ))}
          </ul>

          <Accordion type="single" collapsible className="mt-8 border rounded-2xl overflow-hidden">
            <AccordionItem value="program">
              <AccordionTrigger className="px-4">Programme détaillé</AccordionTrigger>
              <AccordionContent className="px-4">
                <div className="space-y-3">
                  {["Introduction et fondamentaux", "Pratique guidée", "Exercices avancés", "Évaluation et certification"].map((step, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-[var(--ipk-surface)] rounded-xl">
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--ipk-green-dark)] shrink-0" aria-hidden="true" />
                      <span style={{ fontSize: "14px", color: "var(--ipk-ink)" }}>{step}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="prerequisites">
              <AccordionTrigger className="px-4">Prérequis</AccordionTrigger>
              <AccordionContent className="px-4">
                <p style={{ fontSize: "14px", color: "var(--ipk-text)" }}>
                  {formation.level === "Débutant" ? "Aucun prérequis. Cette formation est ouverte à tous." : 
                   formation.level === "Intermédiaire" ? "Expérience de base dans la discipline ou formation préalable équivalente." : 
                   "Expérience confirmée et maîtrise des fondamentaux."}
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[var(--ipk-border)] p-5 sticky top-20">
            <div className="text-center mb-4">
              <span style={{ fontSize: "32px", fontWeight: 700, color: "var(--ipk-green-dark)" }}>
                {formation.price === 0 ? "Gratuit" : formatPrice(formation.price)}
              </span>
            </div>

            <div className="space-y-3 mb-5">
              {[
                { icon: Clock, label: "Durée", value: formation.duration },
                { icon: MapPin, label: "Mode", value: formation.mode },
                { icon: Calendar, label: "Prochaine date", value: formation.nextDate },
                { icon: GraduationCap, label: "Niveau", value: formation.level },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-[var(--ipk-blue)]" />
                  <div>
                    <div style={{ fontSize: "11px", color: "var(--ipk-text)" }}>{item.label}</div>
                    <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--ipk-ink)" }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={() => setSignupOpen(true)}
              className="w-full bg-[var(--ipk-green-dark)] hover:bg-[var(--ipk-green-darker)] text-white rounded-xl h-12 mb-2"
            >
              S'inscrire maintenant
            </Button>
            <Button
              variant="outline"
              onClick={() => setBrochureOpen(true)}
              className="w-full border border-[var(--ipk-border)] rounded-xl h-10"
            >
              Télécharger la brochure
            </Button>
            <LeadModal open={signupOpen} onOpenChange={setSignupOpen} type="formation_signup" title={`Inscription - ${formation.title}`} description={`${formation.duration} · ${formation.mode} · prochaine session ${formation.nextDate}`} refId={formation.id} refLabel={formation.title} successToast="Inscription enregistrée - confirmation par email." />
            <LeadModal open={brochureOpen} onOpenChange={setBrochureOpen} type="brochure" title={`Brochure - ${formation.title}`} description="Indiquez votre email pour recevoir le PDF." refId={formation.id} refLabel={formation.title} fields={{ phone: false, message: false }} successToast="Brochure envoyée à votre email." />

            <div className="mt-4 p-3 bg-[var(--ipk-surface)] rounded-xl">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[var(--ipk-green-dark)]" />
                <span style={{ fontSize: "12px", color: "var(--ipk-text)" }}>Attestation de formation délivrée à l'issue du parcours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}