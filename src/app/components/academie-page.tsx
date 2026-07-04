import { Link } from "react-router";
import {
  ArrowRight,
  ChevronRight,
  GraduationCap,
  CheckCircle,
  Award,
  Trophy,
  Sparkles,
  School,
  Compass,
  Tent,
  Palette,
  Network,
} from "lucide-react";
import { LazyImage } from "./lazy-image";
import { useSeo } from "../hooks/use-seo";
import {
  ACAD_INTRO,
  ACAD_IMG,
  ACAD_ECOLE,
  ACAD_PARCOURS,
  ACAD_STAGES,
  ACAD_ATELIERS,
  ACAD_HOBBYS,
  ACAD_CERTIFICATIONS,
  ACAD_CONCOURS,
  ACAD_RESEAU,
  ACAD_SECTIONS_NAV,
  type Cta,
} from "../data/academie-kraaft";

function CtaRow({ ctas, tone = "ink" }: { ctas: Cta[]; tone?: "ink" | "light" }) {
  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mt-6">
      {ctas.map((c, i) => {
        const base = "inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-2xl transition-all hover:-translate-y-0.5";
        const primary = tone === "light"
          ? "bg-white text-[var(--ipk-green-dark)] shadow-lg shadow-black/10 hover:bg-white/90"
          : "bg-[var(--ipk-green-dark)] text-white shadow-lg shadow-black/10 hover:bg-[var(--ipk-green-darker)]";
        const secondary = tone === "light"
          ? "border border-white/25 bg-white/5 backdrop-blur-sm text-white hover:bg-white/15"
          : "border border-[var(--ipk-border)] bg-white text-[var(--ipk-ink)] hover:border-[var(--ipk-green)] hover:text-[var(--ipk-green-dark)]";
        return (
          <Link key={c.to + c.label} to={c.to} className={`${base} ${i === 0 ? primary : secondary}`} style={{ fontSize: "14px", fontWeight: 600 }}>
            {c.label} <ArrowRight className="w-4 h-4" />
          </Link>
        );
      })}
    </div>
  );
}

function SectionHeader({ title, tagline, icon: Icon }: { title: string; tagline: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex items-start gap-4 mb-5">
      <span className="w-11 h-11 shrink-0 rounded-xl bg-[var(--ipk-green)]/10 flex items-center justify-center text-[var(--ipk-green-dark)]">
        <Icon className="w-5 h-5" />
      </span>
      <div>
        <div className="inline-flex items-center gap-2 text-[var(--ipk-green-dark)]" style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Académie KRAAFT
        </div>
        <h2 className="text-[var(--ipk-ink)] mt-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 700, lineHeight: 1.2 }}>
          {title}
        </h2>
        <p className="text-[var(--ipk-green-dark)] italic mt-1" style={{ fontSize: "15px" }}>
          {tagline}
        </p>
      </div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mt-3">
      {items.map((it) => (
        <li key={it} className="flex items-start gap-2 text-[var(--ipk-text)]" style={{ fontSize: "14.5px", lineHeight: 1.6 }}>
          <CheckCircle className="w-4 h-4 mt-1 text-[var(--ipk-green)] shrink-0" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export function AcademiePage() {
  useSeo({
    title: "Académie KRAAFT - Formations, certifications, parcours d'excellence",
    description:
      "L'Académie KRAAFT : 25 grandes écoles, 6 niveaux d'apprentissage, immersions, ateliers, certifications officielles, Grand Concours et réseau des Maîtres d'Art africains.",
  });

  return (
    <div className="pb-20 lg:pb-10">
      {/* ── HERO - décoratif sans image ── */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #111418 0%, #201436 55%, #6D28D9 150%)" }}>
        <div aria-hidden className="absolute -top-24 -right-16 w-72 h-72 sm:w-[28rem] sm:h-[28rem] rounded-full bg-[#8B5CF6]/25 blur-3xl" />
        <div aria-hidden className="absolute -bottom-28 -left-20 w-72 h-72 sm:w-[28rem] sm:h-[28rem] rounded-full bg-[var(--ipk-amber)]/12 blur-3xl" />
        <GraduationCap aria-hidden className="absolute -right-8 sm:right-10 top-1/2 -translate-y-1/2 w-48 h-48 sm:w-72 sm:h-72 text-white/5 pointer-events-none" strokeWidth={1} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <nav className="flex items-center gap-1.5 text-white/70 mb-5" style={{ fontSize: "13px" }} aria-label="Fil d'Ariane">
            <Link to="/accueil" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">Académie KRAAFT</span>
          </nav>
          <span className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-[var(--ipk-amber)]" style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            <GraduationCap className="w-3.5 h-3.5" /> {ACAD_INTRO.eyebrow}
          </span>
          <h1 className="text-white max-w-3xl" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 700, lineHeight: 1.1 }}>
            {ACAD_INTRO.title}
          </h1>
          <p className="text-white/80 italic mt-3 max-w-3xl" style={{ fontSize: "clamp(15px, 2vw, 18px)" }}>
            {ACAD_INTRO.tagline}
          </p>
          <div className="space-y-3 mt-6 max-w-3xl">
            {ACAD_INTRO.paragraphs.map((p, i) => (
              <p key={i} className="text-white/85" style={{ fontSize: "15.5px", lineHeight: 1.75 }}>{p}</p>
            ))}
          </div>
          <CtaRow ctas={[ACAD_INTRO.primaryCta, ACAD_INTRO.secondaryCta]} tone="light" />
        </div>
      </section>

      {/* ── ANCRES DE NAVIGATION ── */}
      <nav className="sticky top-14 z-30 bg-white/95 backdrop-blur border-b border-[var(--ipk-border)]" aria-label="Sections de l'Académie">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 overflow-x-auto">
          <div className="flex items-center gap-1 py-2 min-w-max">
            {ACAD_SECTIONS_NAV.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[var(--ipk-text)] hover:text-[var(--ipk-green-dark)] hover:bg-[var(--ipk-surface)] transition-colors whitespace-nowrap"
                style={{ fontSize: "13px", fontWeight: 600 }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-16">
        {/* ── A. L'ÉCOLE KRAAFT ── */}
        <section id="ecole" className="scroll-mt-32">
          <SectionHeader title={ACAD_ECOLE.title} tagline={ACAD_ECOLE.tagline} icon={School} />
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <p className="text-[var(--ipk-text)]" style={{ fontSize: "16px", lineHeight: 1.85 }}>
                {ACAD_ECOLE.intro}
              </p>
              <p className="text-[var(--ipk-text)] mt-3" style={{ fontSize: "16px", lineHeight: 1.85 }}>
                {ACAD_ECOLE.body}
              </p>
              <p className="text-[var(--ipk-text)] mt-4 italic" style={{ fontSize: "14px" }}>
                {ACAD_ECOLE.outro}
              </p>
              <CtaRow ctas={ACAD_ECOLE.ctas} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl overflow-hidden aspect-[4/5]">
                <LazyImage src={ACAD_IMG.ecoleHero} alt="Atelier de transmission" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-[4/5] mt-8">
                <LazyImage src={ACAD_IMG.ecoleSecondary} alt="Élèves en formation" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <div className="mt-10 bg-[var(--ipk-surface)] rounded-2xl p-6 sm:p-8">
            <h3 className="text-[var(--ipk-ink)] mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700 }}>
              {ACAD_ECOLE.groupTitle}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ACAD_ECOLE.ecoles.map((name) => (
                <div key={name} className="flex items-start gap-3 bg-white rounded-xl border border-[var(--ipk-border)] p-3.5 hover:border-[var(--ipk-green)] transition-colors">
                  <span className="w-8 h-8 shrink-0 rounded-lg bg-[var(--ipk-green)]/10 text-[var(--ipk-green-dark)] flex items-center justify-center">
                    <School className="w-4 h-4" />
                  </span>
                  <span className="text-[var(--ipk-ink)]" style={{ fontSize: "14px", fontWeight: 500, lineHeight: 1.4 }}>{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── B. PARCOURS D'APPRENTISSAGE ── */}
        <section id="parcours" className="scroll-mt-32">
          <SectionHeader title={ACAD_PARCOURS.title} tagline={ACAD_PARCOURS.tagline} icon={Compass} />
          <p className="text-[var(--ipk-text)] mb-8" style={{ fontSize: "16px", lineHeight: 1.85 }}>
            {ACAD_PARCOURS.intro}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ACAD_PARCOURS.niveaux.map((n) => (
              <article key={n.name} className="group bg-white rounded-2xl overflow-hidden border border-[var(--ipk-border)] hover:shadow-md transition-all flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <LazyImage src={n.image} alt={n.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-[var(--ipk-ink)] mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700 }}>{n.name}</h3>
                  <p className="text-[var(--ipk-text)]" style={{ fontSize: "14px", lineHeight: 1.7 }}>{n.text}</p>
                </div>
              </article>
            ))}
          </div>
          <CtaRow ctas={ACAD_PARCOURS.ctas} />
        </section>

        {/* ── C. STAGES D'IMMERSION ── */}
        <section id="stages" className="scroll-mt-32">
          <SectionHeader title={ACAD_STAGES.title} tagline={ACAD_STAGES.tagline} icon={Tent} />
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <p className="text-[var(--ipk-text)]" style={{ fontSize: "16px", lineHeight: 1.85 }}>{ACAD_STAGES.intro}</p>
              <h3 className="text-[var(--ipk-ink)] mt-5 mb-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700 }}>
                {ACAD_STAGES.formatsTitle}
              </h3>
              <BulletList items={ACAD_STAGES.formats} />
              <p className="text-[var(--ipk-text)] italic mt-5" style={{ fontSize: "14px" }}>{ACAD_STAGES.outro}</p>
              <CtaRow ctas={ACAD_STAGES.ctas} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl overflow-hidden aspect-[4/5]">
                <LazyImage src={ACAD_STAGES.image} alt="Immersion communautaire" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-[4/5] mt-8">
                <LazyImage src={ACAD_STAGES.secondaryImage} alt="Vie de village" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* ── D. ATELIERS & MASTERCLASS ── */}
        <section id="ateliers" className="scroll-mt-32">
          <SectionHeader title={ACAD_ATELIERS.title} tagline={ACAD_ATELIERS.tagline} icon={Sparkles} />
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-3">
              <p className="text-[var(--ipk-text)]" style={{ fontSize: "16px", lineHeight: 1.85 }}>{ACAD_ATELIERS.intro}</p>
              <BulletList items={ACAD_ATELIERS.themes} />
              <CtaRow ctas={ACAD_ATELIERS.ctas} />
            </div>
            <div className="lg:col-span-2 rounded-2xl overflow-hidden aspect-[4/3]">
              <LazyImage src={ACAD_ATELIERS.image} alt="Masterclass" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        {/* ── E. HOBBYS & LOISIRS ── */}
        <section id="hobbys" className="scroll-mt-32">
          <SectionHeader title={ACAD_HOBBYS.title} tagline={ACAD_HOBBYS.tagline} icon={Palette} />
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-2 rounded-2xl overflow-hidden aspect-[4/3]">
              <LazyImage src={ACAD_HOBBYS.image} alt="Loisirs créatifs" className="w-full h-full object-cover" />
            </div>
            <div className="lg:col-span-3">
              <p className="text-[var(--ipk-text)]" style={{ fontSize: "16px", lineHeight: 1.85 }}>{ACAD_HOBBYS.intro}</p>
              <p className="text-[var(--ipk-text)] mt-2" style={{ fontSize: "15px", lineHeight: 1.7 }}>{ACAD_HOBBYS.proposeIntro}</p>
              <BulletList items={ACAD_HOBBYS.activites} />
              <p className="text-[var(--ipk-text)] italic mt-5" style={{ fontSize: "14px" }}>{ACAD_HOBBYS.outro}</p>
              <CtaRow ctas={ACAD_HOBBYS.ctas} />
            </div>
          </div>
        </section>

        {/* ── F. CERTIFICATIONS ── */}
        <section id="certifications" className="scroll-mt-32">
          <SectionHeader title={ACAD_CERTIFICATIONS.title} tagline={ACAD_CERTIFICATIONS.tagline} icon={Award} />
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <p className="text-[var(--ipk-text)]" style={{ fontSize: "16px", lineHeight: 1.85 }}>{ACAD_CERTIFICATIONS.intro}</p>
              <h3 className="text-[var(--ipk-ink)] mt-5 mb-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700 }}>
                {ACAD_CERTIFICATIONS.criteresIntro}
              </h3>
              <BulletList items={ACAD_CERTIFICATIONS.criteres} />
              <p className="text-[var(--ipk-text)] mt-5" style={{ fontSize: "15px", lineHeight: 1.8 }}>{ACAD_CERTIFICATIONS.outro}</p>
              <CtaRow ctas={ACAD_CERTIFICATIONS.ctas} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl overflow-hidden aspect-[4/5] mt-8">
                <LazyImage src={ACAD_CERTIFICATIONS.image} alt="Cérémonie de certification" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-[4/5]">
                <LazyImage src={ACAD_CERTIFICATIONS.secondaryImage} alt="Toge académique" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* ── G. GRAND CONCOURS ── */}
        <section id="concours" className="scroll-mt-32">
          <SectionHeader title={ACAD_CONCOURS.title} tagline={ACAD_CONCOURS.tagline} icon={Trophy} />
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="rounded-2xl overflow-hidden aspect-[4/3]">
              <LazyImage src={ACAD_CONCOURS.image} alt="Trophées du Grand Concours" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-[var(--ipk-text)]" style={{ fontSize: "16px", lineHeight: 1.85 }}>{ACAD_CONCOURS.intro}</p>
              {ACAD_CONCOURS.body.map((p, i) => (
                <p key={i} className="text-[var(--ipk-text)] mt-3" style={{ fontSize: "15.5px", lineHeight: 1.8 }}>{p}</p>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mt-8">
            <div className="bg-[var(--ipk-surface)] rounded-2xl p-6">
              <h3 className="text-[var(--ipk-ink)] mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700 }}>
                {ACAD_CONCOURS.criteresIntro}
              </h3>
              <BulletList items={ACAD_CONCOURS.criteres} />
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-[var(--ipk-border)]">
              <LazyImage src={ACAD_CONCOURS.secondaryImage} alt="Distinctions" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0B6B3A]/85 to-[#0B6B3A]/95" />
              <div className="relative p-6">
                <h3 className="text-white mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700 }}>
                  {ACAD_CONCOURS.distinctionsIntro}
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2">
                  {ACAD_CONCOURS.distinctions.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-white" style={{ fontSize: "14px", lineHeight: 1.5 }}>
                      <Trophy className="w-4 h-4 mt-1 text-[#FBBF24] shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <CtaRow ctas={ACAD_CONCOURS.ctas} />
        </section>

        {/* ── H. RÉSEAU DES MAÎTRES D'ART ── */}
        <section id="reseau" className="scroll-mt-32">
          <SectionHeader title={ACAD_RESEAU.title} tagline={ACAD_RESEAU.tagline} icon={Network} />
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <p className="text-[var(--ipk-text)]" style={{ fontSize: "16px", lineHeight: 1.85 }}>{ACAD_RESEAU.intro}</p>
              <h3 className="text-[var(--ipk-ink)] mt-5 mb-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700 }}>
                {ACAD_RESEAU.interviennentIntro}
              </h3>
              <BulletList items={ACAD_RESEAU.missions} />
              <p className="text-[var(--ipk-text)] mt-5" style={{ fontSize: "15px", lineHeight: 1.8 }}>{ACAD_RESEAU.outro}</p>
              <CtaRow ctas={ACAD_RESEAU.ctas} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl overflow-hidden aspect-[4/5]">
                <LazyImage src={ACAD_RESEAU.image} alt="Réseau des maîtres d'art" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-[4/5] mt-8">
                <LazyImage src={ACAD_RESEAU.secondaryImage} alt="Collaboration entre maîtres" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* ── BANDEAU FINAL ── */}
        <section className="rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--ipk-green-darker)] via-[var(--ipk-green-dark)] to-[var(--ipk-blue-dark)]" />
          <div className="relative p-8 sm:p-12 text-center text-white">
            <Sparkles className="w-8 h-8 mx-auto mb-4 text-white/80" />
            <h3 className="mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700 }}>
              Prêt·e à rejoindre l'Académie KRAAFT ?
            </h3>
            <p className="text-white/85 max-w-2xl mx-auto mb-6" style={{ fontSize: "16px", lineHeight: 1.7 }}>
              Que vous soyez débutant·e curieux·se, professionnel·le confirmé·e ou maître d'art reconnu·e, votre place est ici.
              Choisissez votre porte d'entrée et démarrez votre parcours.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/formations" className="px-6 py-3 rounded-xl bg-white text-[var(--ipk-green-dark)] hover:bg-white/90 transition-colors" style={{ fontSize: "14px", fontWeight: 700 }}>
                Voir toutes les formations
              </Link>
              <Link to="/devenir-artisan" className="px-6 py-3 rounded-xl border-2 border-white/40 text-white hover:bg-white/10 transition-colors" style={{ fontSize: "14px", fontWeight: 600 }}>
                Devenir artisan partenaire
              </Link>
              <Link to="/contact" className="px-6 py-3 rounded-xl border-2 border-white/40 text-white hover:bg-white/10 transition-colors" style={{ fontSize: "14px", fontWeight: 600 }}>
                Nous contacter
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
