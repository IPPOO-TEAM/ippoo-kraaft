import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import {
  ArrowRight, Shield, Award, Users, Globe, Leaf, Star,
  CheckCircle, ChevronRight, Play, Pause, MapPin,
  ShoppingBag, BookOpen, Camera, Calendar, Mail, Phone,
  Menu, X, ChevronDown, Sparkles, TrendingUp, Radio,
  TrendingDown, Timer, Package, UserPlus, Percent, Tag, Clock
} from "lucide-react";
import { IMAGES, formatPrice, groupBuyingOffers } from "../data/mock-data";
import { LazyImage } from "./lazy-image";
import { useSeo } from "../hooks/use-seo";
import logoImg from "../../imports/kraaft_fav.jpg";
import headerBgImg from "../../imports/Sintesi_Joy_PARADISE_60_119_Quick_sample_48h__Italy___1_.jpg";
import { AdCarousel, landingAdSlides } from "./ad-carousel";
import { BackgroundMusicPlayer } from "./background-music-player";

const LANDING_IMAGES = {
  hero: IMAGES.heroArtisan,
  sunset: "https://images.unsplash.com/photo-1581120035077-ca17ed7d635f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwdmlsbGFnZSUyMHN1bnNldCUyMGxhbmRzY2FwZSUyMHBhbm9yYW1pY3xlbnwxfHx8fDE3NzUxMjEwOTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  portrait: "https://images.unsplash.com/photo-1745572587190-962fe038f073?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwd29tYW4lMjBzbWlsaW5nJTIwcG9ydHJhaXQlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzUxMjEwOTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  coop: "https://images.unsplash.com/photo-1757085242652-f8cd4d3de889?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwY3JhZnQlMjBjb29wZXJhdGl2ZSUyMHdvcmtzaG9wJTIwZ3JvdXB8ZW58MXx8fHwxNzc1MTIxMDk1fDA&ixlib=rb-4.1.0&q=80&w=1080",
};

function useCountUp(end: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
}

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export function LandingPage() {
  useSeo({
    title: "IPPOO KRAAFT - Artisanat africain ancestral",
    description: "IPPOO KRAAFT révèle l'artisanat africain authentique : oeuvres certifiées, traçabilité QR, formations et impact direct pour les artisans.",
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const statsRef = useInView(0.3);

  const artisansCount = useCountUp(850, 2000, statsRef.inView);
  const productsCount = useCountUp(3200, 2000, statsRef.inView);
  const countriesCount = useCountUp(12, 1500, statsRef.inView);
  const satisfactionCount = useCountUp(98, 1800, statsRef.inView);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const rootRef = useRef<HTMLDivElement>(null);
  // Colore les titres noirs de la landing avec des couleurs variées en rotation.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const palette = ["#0B6B3A", "#0046CC", "#B45309", "#6D28D9", "#BE185D", "#0F766E", "#C2410C", "#1D4ED8"];
    let idx = 0;
    const colorize = () => {
      root.querySelectorAll<HTMLElement>("h1, h2, h3").forEach((h) => {
        if (h.dataset.ipkColored) return;
        const m = getComputedStyle(h).color.match(/\d+/g);
        if (!m) return;
        const [r, g, b] = m.map(Number);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        const grayish = Math.max(r, g, b) - Math.min(r, g, b) < 28;
        if (brightness < 90 && grayish) {
          h.style.setProperty("color", palette[idx % palette.length], "important");
          h.dataset.ipkColored = "1";
          idx += 1;
        }
      });
    };
    colorize();
    const obs = new MutationObserver(() => colorize());
    obs.observe(root, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, []);

  const navLinks = [
    { label: "Mission", to: "/a-propos" },
    { label: "Artisanat", to: "/metiers" },
    { label: "Normes", to: "/marketplace/labels-certificats" },
    { label: "Impact", to: "/statistiques" },
    { label: "Achats Groupés", to: "/achats-groupes" },
    { label: "Témoignages", to: "/medias/temoignages" },
  ];

  return (
    <div ref={rootRef} className="min-h-screen ipk-amb ipk-amb--green" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ── NAVBAR ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "shadow-sm" : "shadow-none"}`}
        style={{ backgroundColor: "#C8F74A", isolation: "isolate" }}
      >
        {/* Motif tropical en filigrane 4% d'opacité */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${headerBgImg})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            opacity: 0.04,
            pointerEvents: "none",
            zIndex: 0,
            mixBlendMode: "multiply",
          }}
        />
        {/* Espace vide + bande blanche pleine largeur en haut */}
        <div style={{ height: 5 }} />
        <div style={{ height: 6, backgroundColor: "#ffffff" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px] lg:h-[88px]">
            <div className="flex items-center min-w-0">
              <img
                src={logoImg}
                alt="IPPOO KRAAFT"
                className="h-[52px] sm:h-[64px] lg:h-[72px] w-auto max-w-[240px] sm:max-w-[340px] lg:max-w-none object-contain"
              />
            </div>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="text-[var(--ipk-text)] transition-colors hover:text-[var(--ipk-green)]"
                  style={{ fontSize: "14px", fontWeight: 500 }}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/accueil"
                className="px-5 py-2.5 rounded-xl bg-[var(--ipk-green)] text-white hover:bg-[#0a7434] transition-colors"
                style={{ fontSize: "14px", fontWeight: 600 }}
              >
                Accéder au site
              </Link>
            </div>

            <button
              className="lg:hidden text-[var(--ipk-ink)]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-[var(--ipk-border)] shadow-lg">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-[var(--ipk-ink)] hover:bg-[var(--ipk-surface)] transition-colors"
                  style={{ fontSize: "15px", fontWeight: 500 }}
                >
                  {l.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-[var(--ipk-border)]">
                <Link
                  to="/accueil"
                  className="block w-full text-center px-5 py-3 rounded-xl bg-[var(--ipk-green)] text-white"
                  style={{ fontSize: "15px", fontWeight: 600 }}
                >
                  Accéder au site
                </Link>
              </div>
            </div>
          </div>
        )}
        {/* Bande blanche pleine largeur + espace vide en bas */}
        <div style={{ height: 6, backgroundColor: "#ffffff" }} />
        <div style={{ height: 5 }} />
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] sm:min-h-[100vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <LazyImage
            src={LANDING_IMAGES.hero}
            alt="Artisan africain sculptant le bois"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111418]/80 via-[#111418]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111418]/60 via-transparent to-[#111418]/30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 md:py-40">
          <div className="max-w-2xl">
            

            <h1
              className="text-white mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(32px, 7vw, 64px)",
                fontWeight: 700,
                lineHeight: 1.08,
              }}
            >
              L'Art Ancestral
              <br />
              Africain, <span className="text-[var(--ipk-green)]">Vivant</span>
              <br />
              et <span className="italic">Traçable</span>
            </h1>

            <p
              className="text-white/80 mb-10 max-w-lg"
              style={{ fontSize: "clamp(16px, 2.5vw, 20px)", lineHeight: 1.7 }}
            >
              Explorez une collection unique de pièces artisanales fabriquées à la main
              par des maîtres-artisans africains. Chaque création est accompagnée de son
              certificat d'authenticité, d'un QR code de traçabilité et de l'histoire
              de l'artisan qui l'a façonnée, de l'atelier villageois jusqu'à chez vous.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                to="/boutique"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[var(--ipk-green)] text-white hover:bg-[#0a7434] transition-all"
                style={{ fontSize: "16px", fontWeight: 600 }}
              >
                <ShoppingBag className="w-5 h-5" />
                Explorer la Boutique
              </Link>
              <Link
                to="/a-propos"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 transition-all"
                style={{ fontSize: "16px", fontWeight: 500 }}
              >
                Découvrir notre mission
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-6 mt-12 pt-8 border-t border-white/15">
              {[
                { icon: Shield, text: "Normes N001KHAM" },
                { icon: Award, text: "Artisanat Certifié" },
                { icon: Globe, text: "12 Pays d'Afrique" },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2">
                  <b.icon className="w-4 h-4 text-[var(--ipk-green)]" />
                  <span className="text-white/70" style={{ fontSize: "13px", fontWeight: 500 }}>
                    {b.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-white/50" style={{ fontSize: "11px", fontWeight: 500 }}>Défiler</span>
          <ChevronDown className="w-5 h-5 text-white/50 animate-bounce" />
        </div>
      </section>

      {/* ── CARROUSEL PUBLICITAIRE & PARTENAIRES ── */}
      <section className="py-10 sm:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdCarousel slides={landingAdSlides} />
        </div>
      </section>

      {/* ── MISSION ── */}
      <section id="mission" className="py-14 sm:py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span
                className="inline-block px-3 py-1 rounded-full bg-[#0D8A3E]/10 text-[var(--ipk-green)] mb-6"
                style={{ fontSize: "13px", fontWeight: 600 }}
              >Notre Mission</span>
              <h2
                className="text-[var(--ipk-ink)] mb-6"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(28px, 4vw, 44px)",
                  fontWeight: 700,
                  lineHeight: 1.15,
                }}
              >
                Préserver le patrimoine artisanal africain pour les générations futures
              </h2>
              <p className="text-[var(--ipk-text)] mb-8" style={{ fontSize: "16px", lineHeight: 1.8 }}>
                IPPOO KRAAFT ART AND HANDMADE est né d'une conviction profonde : l'artisanat
                africain ancestral, notamment les sculptures, textiles, poteries et bijoux, représente un
                patrimoine culturel inestimable qui mérite d'être célébré, protégé et transmis.
                Notre plateforme crée un pont direct entre les artisans des villages et les
                amateurs d'art du monde entier. Nous garantissons à chaque acheteur une traçabilité
                complète et une certification qualité rigoureuse selon nos normes exclusives
                N001KHAM et N001PAAG.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  { icon: Shield, title: "Traçabilité totale", desc: "Chaque pièce est accompagnée d'un QR code unique. En le scannant, vous accédez à l'identité de l'artisan, l'origine géographique, les matériaux et les étapes de fabrication." },
                  { icon: Leaf, title: "Eco-responsable", desc: "Les artisans travaillent avec des matériaux naturels locaux tels que le bois, l'argile, les fibres végétales et les teintures à base de plantes, selon des techniques ancestrales à faible impact environnemental." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#0D8A3E]/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-[var(--ipk-green)]" />
                    </div>
                    <div>
                      <h4 className="text-[var(--ipk-ink)]" style={{ fontSize: "15px", fontWeight: 600 }}>
                        {item.title}
                      </h4>
                      <p className="text-[var(--ipk-text)] mt-0.5" style={{ fontSize: "14px", lineHeight: 1.6 }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/a-propos"
                className="inline-flex items-center gap-2 text-[var(--ipk-green)] hover:underline"
                style={{ fontSize: "15px", fontWeight: 600 }}
              >
                En savoir plus sur IPPOO KRAAFT
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden aspect-[4/5]">
                <LazyImage
                  src="https://images.unsplash.com/photo-1566659059394-519e944173ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwd29tYW4lMjBhcnRpc2FuJTIwY3JhZnRpbmclMjBoYW5kbWFkZXxlbnwxfHx8fDE3NzU1MDQxNzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Artisane africaine"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ARTISANAT SECTIONS ── */}
      <section id="artisanat" className="py-14 sm:py-20 md:py-28 bg-[var(--ipk-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            
            <h2
              className="text-[var(--ipk-ink)] mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 700,
              }}
            >
              Des disciplines ancestrales vivantes
            </h2>
            <p className="text-[var(--ipk-text)] max-w-2xl mx-auto" style={{ fontSize: "16px", lineHeight: 1.7 }}>
              Chaque discipline artisanale représente des siècles de transmission orale, de
              perfectionnement technique et de spiritualité. Ces savoir-faire, transmis de
              maître à apprenti au sein des familles et des confréries, constituent le socle
              vivant du patrimoine culturel africain.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Sculpture sur Bois", img: IMAGES.sculpture, desc: "Des masques rituels aux statues protectrices, chaque pièce est taillée dans des bois nobles comme l'ébène, l'iroko et le baobab, selon des codes symboliques transmis depuis des générations.", count: "240+ pièces" },
              { title: "Tissage & Textile", img: IMAGES.kente, desc: "Kente ghanéen, Bogolan malien, indigo Yoruba : ces textiles ne sont pas de simples étoffes. Chaque motif encode des proverbes, des lignages familiaux et des récits historiques.", count: "380+ pièces" },
              { title: "Poterie & Céramique", img: IMAGES.pottery, desc: "Façonnées sans tour par les femmes potières, jarres et vases sont modelés dans l'argile locale puis cuits au feu de bois. Chaque forme porte une signification dans la cosmogonie africaine.", count: "180+ pièces" },
              { title: "Vannerie", img: IMAGES.wovenBasket, desc: "Paniers Bolga du Ghana, nattes en raphia, corbeilles spiralées : la vannerie transforme les fibres végétales en objets d'une beauté géométrique remarquable, tressés brin par brin.", count: "150+ pièces" },
              { title: "Métallurgie", img: IMAGES.bronzeStatue, desc: "Du bronze du Bénin coulé à la cire perdue aux bijoux Touareg forgés dans le désert, la métallurgie africaine témoigne d'une maîtrise technique exceptionnelle et millénaire.", count: "120+ pièces" },
              { title: "Bijoux & Parures", img: IMAGES.beadwork, desc: "Perles de verre, cauris, or et cuivre ciselés : les bijoux africains racontent le statut social, l'appartenance ethnique et les étapes de la vie de celui qui les porte.", count: "290+ pièces" },
            ].map((item, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl overflow-hidden border border-[var(--ipk-border)] hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <LazyImage
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-[var(--ipk-green)]" style={{ fontSize: "12px", fontWeight: 600 }}>
                      {item.count}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-[var(--ipk-ink)] mb-2" style={{ fontSize: "18px", fontWeight: 600 }}>
                    {item.title}
                  </h3>
                  <p className="text-[var(--ipk-text)]" style={{ fontSize: "14px", lineHeight: 1.7 }}>
                    {item.desc}
                  </p>
                  <Link
                    to="/boutique"
                    className="inline-flex items-center gap-1 mt-4 text-[var(--ipk-blue)] hover:underline"
                    style={{ fontSize: "13px", fontWeight: 600 }}
                  >
                    Voir les pièces <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-12">
            <Link
              to="/metiers"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[var(--ipk-green)] text-white hover:bg-[#0a7434] transition-colors"
              style={{ fontSize: "15px", fontWeight: 600 }}
            >
              Explorer le classement complet des métiers
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/arts-culture"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl border-2 border-[var(--ipk-blue)] text-[var(--ipk-blue)] hover:bg-[var(--ipk-blue)]/5 transition-colors"
              style={{ fontSize: "15px", fontWeight: 600 }}
            >
              Découvrir les arts &amp; identités
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── PARALLAX QUOTE ── */}
      <section className="relative py-16 sm:py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <LazyImage
            src={LANDING_IMAGES.sunset}
            alt="Paysage africain"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#111418]/70" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <Sparkles className="w-8 h-8 text-[var(--ipk-green)] mx-auto mb-6" />
          <blockquote
            className="text-white italic mb-8"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(20px, 4vw, 36px)",
              lineHeight: 1.4,
            }}
          >
            « Chaque objet artisanal africain est un livre ouvert sur l'histoire,
            la spiritualité et le génie créatif d'un peuple. »
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30">
              <LazyImage src={LANDING_IMAGES.portrait} alt="Portrait du fondateur IPPOO KRAAFT" className="w-full h-full object-cover" />
            </div>
            <div className="text-left">
              <span className="text-white block" style={{ fontSize: "14px", fontWeight: 600 }}>
                Fondateur IPPOO KRAAFT
              </span>
              <span className="text-white/60 block" style={{ fontSize: "12px" }}>
                Art & Patrimoine Africain
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── NORMES & CERTIFICATION ── */}
      <section id="normes" className="py-14 sm:py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { img: IMAGES.woodCarvingDetail, span: false },
                  { img: IMAGES.artisanHands, span: false },
                  { img: IMAGES.blacksmithForge, span: true },
                  { img: IMAGES.decoratedPottery, span: false },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`rounded-2xl overflow-hidden ${item.span ? "col-span-2 aspect-[2/1]" : "aspect-square"}`}
                  >
                    <LazyImage src={item.img} alt="" role="presentation" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2">
              
              <h2
                className="text-[var(--ipk-ink)] mb-6"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(28px, 4vw, 40px)",
                  fontWeight: 700,
                  lineHeight: 1.15,
                }}
              >
                Des normes uniques pour un artisanat d'exception
              </h2>
              <p className="text-[var(--ipk-text)] mb-8" style={{ fontSize: "16px", lineHeight: 1.8 }}>
                Pour lutter contre la contrefaçon et valoriser le véritable artisanat africain,
                IPPOO KRAAFT a conçu deux référentiels normatifs exclusifs, uniques au monde.
                Ces normes permettent de certifier à la fois la qualité technique de fabrication
                et l'authenticité culturelle de chaque pièce mise en vente sur notre plateforme :
              </p>

              <div className="space-y-5 mb-8">
                {[
                  {
                    code: "N001KHAM",
                    name: "Norme Kraaft Handmade Art & Métiers",
                    desc: "Évalue et certifie trois piliers : la qualité des matériaux bruts (bois, argile, métal, fibres), la maîtrise des gestes techniques, et le strict respect des procédés de fabrication traditionnels transmis de génération en génération.",
                  },
                  {
                    code: "N001PAAG",
                    name: "Norme Patrimoine Artisanal & Ancestral Garanti",
                    desc: "Valide l'ancrage culturel et territorial de la pièce : son origine géographique exacte, l'histoire de la technique employée, la chaîne de transmission intergénérationnelle et la signification symbolique des motifs.",
                  },
                ].map((norm) => (
                  <div
                    key={norm.code}
                    className="bg-[var(--ipk-surface)] rounded-2xl p-5 border border-[var(--ipk-border)]"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="px-3 py-1 rounded-lg bg-[var(--ipk-green)] text-white" style={{ fontSize: "12px", fontWeight: 700 }}>
                        {norm.code}
                      </div>
                      <h4 className="text-[var(--ipk-ink)]" style={{ fontSize: "15px", fontWeight: 600 }}>
                        {norm.name}
                      </h4>
                    </div>
                    <p className="text-[var(--ipk-text)]" style={{ fontSize: "14px", lineHeight: 1.6 }}>
                      {norm.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[var(--ipk-green)]" />
                  <span className="text-[var(--ipk-text)]" style={{ fontSize: "14px" }}>QR Code traçabilité</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[var(--ipk-green)]" />
                  <span className="text-[var(--ipk-text)]" style={{ fontSize: "14px" }}>Certificat numérique</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS / IMPACT ── */}
      <section id="impact" className="py-14 sm:py-20 md:py-28 bg-[var(--ipk-ink)]" ref={statsRef.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            
            <h2
              className="text-white mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 700,
              }}
            >
              Des chiffres qui parlent
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto" style={{ fontSize: "16px", lineHeight: 1.7 }}>
              Depuis notre lancement, IPPOO KRAAFT a transformé concrètement le quotidien de
              centaines d'artisans à travers l'Afrique. Chaque commande contribue à préserver
              un patrimoine culturel inestimable, à financer la formation de jeunes apprentis
              et à renforcer l'autonomie économique des communautés rurales.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { value: artisansCount, suffix: "+", label: "Artisans partenaires", icon: Users },
              { value: productsCount, suffix: "+", label: "Pièces artisanales", icon: ShoppingBag },
              { value: countriesCount, suffix: "", label: "Pays d'Afrique", icon: Globe },
              { value: satisfactionCount, suffix: "%", label: "Satisfaction client", icon: Star },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors"
              >
                <stat.icon className="w-6 h-6 text-[var(--ipk-green)] mx-auto mb-3" />
                <div
                  className="text-white mb-1"
                  style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 700 }}
                >
                  {stat.value.toLocaleString("fr-FR")}
                  <span className="text-[var(--ipk-green)]">{stat.suffix}</span>
                </div>
                <span className="text-white/50" style={{ fontSize: "14px" }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Impact CTA */}
          <div className="bg-[var(--ipk-green)] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h3 className="text-white mb-3" style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 700 }}>
                Rejoignez le mouvement
              </h3>
              <p className="text-white/80" style={{ fontSize: "16px", lineHeight: 1.7 }}>
                Que vous soyez artisan souhaitant vendre vos créations au monde, acheteur en
                quête de pièces authentiques et certifiées, ou simplement passionné par la
                richesse culturelle africaine, il y a une place pour vous dans la communauté
                IPPOO KRAAFT. Ensemble, nous faisons vivre un héritage millénaire.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/devenir-artisan"
                className="px-6 py-3.5 rounded-xl bg-white text-[var(--ipk-green)] hover:bg-white/90 transition-colors text-center"
                style={{ fontSize: "15px", fontWeight: 600 }}
              >
                Devenir Artisan
              </Link>
              <Link
                to="/boutique"
                className="px-6 py-3.5 rounded-xl border-2 border-white/40 text-white hover:bg-white/10 transition-colors text-center"
                style={{ fontSize: "15px", fontWeight: 500 }}
              >
                Explorer la Boutique
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section id="temoignages" className="py-14 sm:py-20 md:py-28 bg-[var(--ipk-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            
            <h2
              className="text-[var(--ipk-ink)] mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 700,
              }}
            >
              Ce qu'ils disent de nous
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Aminata Diallo",
                role: "Tisserande, Sénégal",
                text: "IPPOO KRAAFT a transformé ma vie d'artisane. Grâce à la plateforme, mes tissages atteignent des clients du monde entier tout en préservant la tradition Bogolan.",
                rating: 5,
              },
              {
                name: "Pierre Durand",
                role: "Collectionneur, France",
                text: "La traçabilité QR code m'a convaincu. Je sais exactement qui a créé chaque pièce, dans quel village, avec quels matériaux. C'est unique et précieux.",
                rating: 5,
              },
              {
                name: "Kofi Mensah",
                role: "Maître sculpteur, Togo",
                text: "Avec la certification N001KHAM, notre savoir-faire est enfin reconnu à sa juste valeur. La norme protège notre art et garantit la qualité aux acheteurs.",
                rating: 5,
              },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-[var(--ipk-border)]">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-[var(--ipk-amber)] fill-[var(--ipk-amber)]" />
                  ))}
                </div>
                <p className="text-[var(--ipk-text)] mb-6 italic" style={{ fontSize: "15px", lineHeight: 1.7 }}>
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-[var(--ipk-border)]">
                  <div className="w-10 h-10 rounded-full bg-[#0D8A3E]/10 flex items-center justify-center">
                    <span className="text-[var(--ipk-green)]" style={{ fontSize: "15px", fontWeight: 700 }}>
                      {t.name[0]}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--ipk-ink)] block" style={{ fontSize: "14px", fontWeight: 600 }}>
                      {t.name}
                    </span>
                    <span className="text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>
                      {t.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACHATS GROUPÉS ── */}
      <section id="achats-groupes" className="py-14 sm:py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            
            <h2
              className="text-[var(--ipk-ink)] mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 700,
              }}
            >
              Achetez ensemble, économisez plus
            </h2>
            <p className="text-[var(--ipk-text)] max-w-2xl mx-auto" style={{ fontSize: "16px", lineHeight: 1.7 }}>
              Rejoignez un groupe d'acheteurs partageant les mêmes goûts et bénéficiez de
              remises progressives allant jusqu'à -35% sur l'artisanat certifié. Le principe
              est simple : plus le nombre de participants augmente, plus le prix unitaire
              baisse, tout en soutenant une commande groupée qui profite directement aux artisans.
            </p>
          </div>

          {/* How it works mini */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 mb-14">
            {[
              { icon: Tag, step: "1", title: "Choisissez", desc: "Une offre groupée certifiée" },
              { icon: UserPlus, step: "2", title: "Rejoignez", desc: "Le prix baisse avec chaque participant" },
              { icon: Timer, step: "3", title: "Attendez", desc: "Jusqu'à la clôture du groupe" },
              { icon: Package, step: "4", title: "Recevez", desc: "Au meilleur prix avec traçabilité" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="relative w-12 h-12 rounded-xl bg-[var(--ipk-surface)] border border-[var(--ipk-border)] flex items-center justify-center mx-auto mb-2">
                  <s.icon className="w-5 h-5 text-[var(--ipk-green)]" />
                </div>
                <h4 className="text-[var(--ipk-ink)]" style={{ fontSize: "14px", fontWeight: 600 }}>{s.title}</h4>
                <p className="text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Featured offers */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {groupBuyingOffers.filter(o => o.status !== "completed").slice(0, 3).map((offer) => {
              const bestDiscount = offer.tiers[offer.tiers.length - 1].discount;
              const daysLeft = Math.max(0, Math.ceil((new Date(offer.deadline).getTime() - Date.now()) / 86400000));
              const pct = Math.min((offer.currentParticipants / offer.maxParticipants) * 100, 100);
              return (
                <Link
                  key={offer.id}
                  to={`/achats-groupes/${offer.slug}`}
                  className="group bg-[var(--ipk-surface)] rounded-2xl border border-[var(--ipk-border)] overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <LazyImage
                      src={offer.image}
                      alt={offer.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-3 py-1 rounded-full text-white ${offer.status === "closing_soon" ? "bg-[var(--ipk-amber)]" : offer.status === "upcoming" ? "bg-[var(--ipk-blue)]" : "bg-[var(--ipk-green)]"}`}
                        style={{ fontSize: "11px", fontWeight: 600 }}
                      >
                        {offer.status === "closing_soon" ? "Clôture imminente" : offer.status === "upcoming" ? "Bientôt" : "En cours"}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5 text-[var(--ipk-green)]" />
                      <span className="text-[var(--ipk-green)]" style={{ fontSize: "13px", fontWeight: 700 }}>-{bestDiscount}%</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-[var(--ipk-ink)] mb-2 line-clamp-2" style={{ fontSize: "15px", fontWeight: 600, lineHeight: 1.4 }}>
                      {offer.title}
                    </h3>
                    <div className="flex items-baseline gap-3 mb-3">
                      <span className="text-[var(--ipk-text)] line-through" style={{ fontSize: "13px" }}>{formatPrice(offer.originalPrice)}</span>
                      <span className="text-[var(--ipk-green)]" style={{ fontSize: "16px", fontWeight: 700 }}>Dès {formatPrice(offer.tiers[0].price)}</span>
                    </div>
                    {/* Mini progress */}
                    <div className="mb-3">
                      <div className="h-2 rounded-full bg-[var(--ipk-border)] overflow-hidden">
                        <div className="h-full rounded-full bg-[var(--ipk-green)]" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>{offer.currentParticipants}/{offer.maxParticipants}</span>
                        <span className="text-[var(--ipk-text)] flex items-center gap-1" style={{ fontSize: "11px" }}>
                          <Clock className="w-3 h-3" />{daysLeft}j
                        </span>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-[var(--ipk-blue)] group-hover:gap-2 transition-all" style={{ fontSize: "13px", fontWeight: 600 }}>
                      Voir l'offre <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              to="/achats-groupes"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[var(--ipk-green)] text-white hover:bg-[#0a7434] transition-colors"
              style={{ fontSize: "15px", fontWeight: 600 }}
            >
              Voir toutes les offres groupées
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── ECOSYSTEM / WHAT WE OFFER ── */}
      <section className="py-14 sm:py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            
            <h2
              className="text-[var(--ipk-ink)] mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 700,
              }}
            >
              Un univers complet dédié à l'artisanat
            </h2>
            <p className="text-[var(--ipk-text)] max-w-2xl mx-auto" style={{ fontSize: "16px", lineHeight: 1.7 }}>
              IPPOO KRAAFT est bien plus qu'une boutique en ligne : c'est un écosystème culturel
              et économique complet, pensé pour connecter artisans, acheteurs, formateurs et
              passionnés autour de la valorisation de l'artisanat ancestral africain.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              { icon: ShoppingBag, title: "Boutique", desc: "Plus de 3 200 pièces artisanales avec fiches détaillées : histoire, matériaux, normes de certification et traçabilité QR code.", link: "/boutique", color: "var(--ipk-green)" },
              { icon: Camera, title: "Galeries", desc: "10 galeries photographiques thématiques pour découvrir visuellement la diversité des techniques et des régions d'Afrique.", link: "/galeries", color: "var(--ipk-blue)" },
              { icon: Users, title: "Groupements", desc: "Carte interactive de nos coopératives partenaires dans 12 pays, avec profils détaillés des artisans et spécialités.", link: "/groupements", color: "var(--ipk-amber)" },
              { icon: BookOpen, title: "Formations", desc: "Catalogue de formations en présentiel et e-learning : techniques artisanales, gestion de coopérative et commercialisation.", link: "/formations", color: "#8B5CF6" },
              { icon: Percent, title: "Achats Groupés", desc: "6 offres actives avec prix dégressifs par paliers, jusqu'à -35% sur l'artisanat certifié en achetant ensemble.", link: "/achats-groupes", color: "var(--ipk-green)" },
              { icon: Calendar, title: "Événements", desc: "Agenda des salons, séminaires, ateliers découverte et rencontres culturelles organisés à travers le continent.", link: "/evenements", color: "#EF4444" },
              { icon: TrendingUp, title: "Statistiques", desc: "Tableau de bord transparent : ventes, artisans soutenus, communautés bénéficiaires et impact économique réel.", link: "/statistiques", color: "var(--ipk-green)" },
              { icon: Sparkles, title: "Salons & rencontres", desc: "Grand Salon KRAAFT, foires thématiques, musées vivants, villages artisanaux, circuits culturels et rencontres internationales des métiers d'art.", link: "/salons", color: "#EC4899" },
              { icon: Mail, title: "Blog & Actus", desc: "12 articles de fond : reportages terroir, portraits d'artisans, guides d'achat et tendances de l'artisanat africain.", link: "/blog", color: "var(--ipk-amber)" },
              { icon: Radio, title: "Médias & Podcasts Griots", desc: "Le grand média culturel : podcasts griots, séries documentaires, éditoriaux, dossiers thématiques, médiathèque, chroniques, témoignages et collections.", link: "/medias", color: "var(--ipk-ink)" },
              { icon: Award, title: "Centre Patrimoines", desc: "Recherche, conservation et sauvegarde : documentation, inventaire des patrimoines vivants, collections, grands maîtres, langues, savoirs oraux, laboratoire, cartes interactives et Fonds KRAAFT.", link: "/patrimoines", color: "var(--ipk-green-darker)" },
              { icon: Package, title: "Place de Marché KRAAFT", desc: "Galeries d'œuvres, boutiques d'artisans, commandes personnalisées, appels à création, ventes aux enchères, labels d'authenticité, collections thématiques et services numériques.", link: "/marketplace", color: "var(--ipk-amber)" },
              { icon: Globe, title: "Dialogues & Innovation", desc: "Influence mondiale des patrimoines africains, diasporas, industries créatives, laboratoires KRAAFT, matériaux du futur, numérique, observatoires, partenariats et prospective.", link: "/dialogues", color: "var(--ipk-blue)" },
            ].map((item, i) => (
              <Link
                key={i}
                to={item.link}
                className="group bg-[var(--ipk-surface)] rounded-2xl p-5 border border-[var(--ipk-border)] hover:shadow-md hover:border-[#0D8A3E]/30 transition-all"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: item.color + "15" }}
                >
                  <item.icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <h4 className="text-[var(--ipk-ink)] mb-1" style={{ fontSize: "16px", fontWeight: 600 }}>
                  {item.title}
                </h4>
                <p className="text-[var(--ipk-text)]" style={{ fontSize: "13px", lineHeight: 1.6 }}>
                  {item.desc}
                </p>
                <span
                  className="inline-flex items-center gap-1 mt-3 text-[var(--ipk-blue)] group-hover:gap-2 transition-all"
                  style={{ fontSize: "13px", fontWeight: 600 }}
                >
                  Découvrir <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative py-16 sm:py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <LazyImage
            src={LANDING_IMAGES.coop}
            alt="Coopérative d'artisans"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0D8A3E]/80" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2
            className="text-white mb-6"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 700,
              lineHeight: 1.15,
            }}
          >
            Prêt à découvrir l'artisanat authentique africain ?
          </h2>
          <p
            className="text-white/80 mb-10 max-w-xl mx-auto"
            style={{ fontSize: "clamp(16px, 2.5vw, 18px)", lineHeight: 1.7 }}
          >
            Rejoignez des milliers d'amateurs d'art et de culture à travers le monde.
            Chaque achat sur IPPOO KRAAFT soutient directement un artisan, finance la
            transmission de son savoir-faire à la prochaine génération, et contribue
            à préserver un héritage culturel millénaire pour l'humanité entière.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/boutique"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-[var(--ipk-green)] hover:bg-white/90 transition-all"
              style={{ fontSize: "16px", fontWeight: 700 }}
            >
              <ShoppingBag className="w-5 h-5" />
              Visiter la Boutique
            </Link>
            <Link
              to="/accueil"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/40 text-white hover:bg-white/10 transition-all"
              style={{ fontSize: "16px", fontWeight: 500 }}
            >
              Accéder au site complet
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[var(--ipk-ink)]">
        {/* Bande blanche opaque pleine largeur avec le logo centré */}
        <div className="w-full bg-white" style={{ backgroundColor: "#ffffff" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-center">
            <img
              src={logoImg}
              alt="IPPOO KRAAFT"
              className="h-10 sm:h-12 w-auto max-w-[280px] object-contain"
            />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="text-white"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "16px" }}
                >
                  IPPOO KRAAFT
                </span>
              </div>
              <p className="text-white/50 mb-4" style={{ fontSize: "13px", lineHeight: 1.7 }}>
                Art & Handmade, plateforme de valorisation de l'artisanat ancestral africain.
              </p>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--ipk-green)]" />
                <span className="text-white/50" style={{ fontSize: "13px" }}>Lomé, Togo</span>
              </div>
            </div>

            <div>
              <h4 className="text-white mb-4" style={{ fontSize: "14px", fontWeight: 600 }}>Navigation</h4>
              <div className="space-y-2">
                {[
                  { label: "Boutique", to: "/boutique" },
                  { label: "Galeries", to: "/galeries" },
                  { label: "Formations", to: "/formations" },
                  { label: "Événements", to: "/evenements" },
                ].map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className="block text-white/50 hover:text-[var(--ipk-green)] transition-colors"
                    style={{ fontSize: "13px" }}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white mb-4" style={{ fontSize: "14px", fontWeight: 600 }}>Ressources</h4>
              <div className="space-y-2">
                {[
                  { label: "Blog", to: "/blog" },
                  { label: "Statistiques", to: "/statistiques" },
                  { label: "FAQ", to: "/faq" },
                ].map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className="block text-white/50 hover:text-[var(--ipk-green)] transition-colors"
                    style={{ fontSize: "13px" }}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white mb-4" style={{ fontSize: "14px", fontWeight: 600 }}>Contact</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[var(--ipk-green)]" />
                  <span className="text-white/50" style={{ fontSize: "13px" }}>contact@ippookraaft.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[var(--ipk-green)]" />
                  <span className="text-white/50" style={{ fontSize: "13px" }}>+228 90 00 00 00</span>
                </div>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-[var(--ipk-green)] text-white text-center hover:bg-[#0a7434] transition-colors"
                style={{ fontSize: "13px", fontWeight: 600 }}
              >
                Nous contacter
              </Link>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-white/30" style={{ fontSize: "12px" }}>
              © 2026 IPPOO KRAAFT ART AND HANDMADE. Tous droits réservés.
            </span>
            <div className="flex gap-6">
              <Link to="/legal/mentions" className="text-white/30 hover:text-white/60" style={{ fontSize: "12px" }}>Mentions légales</Link>
              <Link to="/legal/cgv" className="text-white/30 hover:text-white/60" style={{ fontSize: "12px" }}>CGV</Link>
              <Link to="/legal/confidentialite" className="text-white/30 hover:text-white/60" style={{ fontSize: "12px" }}>Confidentialité</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Lecteur de musique de fond - même widget que l'application */}
      <BackgroundMusicPlayer />
    </div>
  );
}