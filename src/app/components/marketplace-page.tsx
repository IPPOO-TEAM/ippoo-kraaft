import { Link, useParams, Navigate } from "react-router";
import {
  ArrowRight, ArrowLeft, ChevronRight, ShoppingBag, Store, Star, MapPin,
  Image as ImageIcon, Hammer, Shield, Users, HeartHandshake, GraduationCap,
  PenTool, Gem, Send, Landmark, Crown, Handshake, BookOpen, Library, Microscope,
  Palette, FolderOpen,
} from "lucide-react";
import { LazyImage } from "./lazy-image";
import { PageHero } from "./page-hero";
import { useSeo } from "../hooks/use-seo";
import {
  MARKETPLACE_INTRO,
  marketplaceSections,
  getMarketplaceSection,
  type MarketplaceBlock,
} from "../data/marketplace";
import { CrossLinksBlock, type CrossLink } from "./cross-links";
import { products, artisans, formatPrice } from "../data/mock-data";
import { AuctionHouse } from "./marketplace-auctions";

// Mapping des Collections KRAAFT vers un filtre boutique réel.
const kraaftCollectionLinks: { label: string; to: string }[] = [
  { label: "Héritages Royaux", to: "/boutique?q=royal" },
  { label: "Arts du Bronze", to: "/boutique?cat=Métal" },
  { label: "Les Maîtres du Bois", to: "/boutique?cat=Sculpture" },
  { label: "Les Routes du Textile", to: "/boutique?cat=Textile" },
  { label: "Les Arts du Cuir", to: "/boutique?cat=Cuir" },
  { label: "Les Bijoux d'Afrique", to: "/boutique?cat=Bijoux" },
  { label: "Les Tambours du Patrimoine", to: "/boutique?cat=Musique" },
  { label: "Les Arts des Palais", to: "/boutique?q=cérémoniel" },
  { label: "Les Créations Contemporaines", to: "/boutique?q=contemporain" },
  { label: "Les Jeunes Talents", to: "/repertoire" },
  { label: "Les Femmes Créatrices", to: "/repertoire" },
  { label: "Les Trésors des Communautés", to: "/groupements" },
];

// Widget de données réelles affiché selon la rubrique.
function LiveWidget({ slug }: { slug: string }) {
  if (slug === "galerie-creations") {
    const featured = products.slice(0, 8);
    return (
      <div className="mt-8">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-[var(--ipk-ink)]" style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 700 }}>Créations à découvrir</h2>
          <Link to="/boutique" className="text-[var(--ipk-green)] inline-flex items-center gap-1" style={{ fontSize: "14px", fontWeight: 600 }}>Voir tout <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((p) => (
            <Link key={p.id} to={`/boutique/${p.slug}`} className="group bg-white rounded-2xl overflow-hidden border border-[var(--ipk-border)] hover:shadow-md transition-all">
              <div className="aspect-square overflow-hidden">
                <LazyImage src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-3">
                <h3 className="text-[var(--ipk-ink)] truncate" style={{ fontSize: "13px", fontWeight: 600 }}>{p.name}</h3>
                <div className="text-[var(--ipk-green-dark)] mt-1" style={{ fontSize: "14px", fontWeight: 700 }}>{formatPrice(p.price)}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (slug === "boutique-artisans") {
    return (
      <div className="mt-8">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-[var(--ipk-ink)]" style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 700 }}>Les boutiques de nos artisans</h2>
          <Link to="/repertoire" className="text-[var(--ipk-green)] inline-flex items-center gap-1" style={{ fontSize: "14px", fontWeight: 600 }}>Tout le répertoire <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {artisans.map((a) => (
            <Link key={a.id} to={`/artisan/${a.slug}`} className="group bg-white rounded-2xl overflow-hidden border border-[var(--ipk-border)] hover:shadow-md transition-all flex">
              <div className="w-24 shrink-0 overflow-hidden">
                <LazyImage src={a.image} alt={a.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-3 min-w-0 flex-1">
                <h3 className="text-[var(--ipk-ink)] truncate" style={{ fontSize: "14px", fontWeight: 700 }}>{a.name}</h3>
                <p className="text-[var(--ipk-text)] truncate" style={{ fontSize: "12px" }}>{a.specialty}</p>
                <div className="flex items-center gap-2 mt-1 text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>
                  <span className="inline-flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {a.country}</span>
                  <span className="inline-flex items-center gap-0.5"><Star className="w-3 h-3 text-[var(--ipk-amber)]" /> {a.rating}</span>
                  <span>· {a.productsCount} œuvres</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (slug === "collections-kraaft") {
    return (
      <div className="mt-8">
        <h2 className="text-[var(--ipk-ink)] mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 700 }}>Explorer ces collections en boutique</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {kraaftCollectionLinks.map((c) => (
            <Link key={c.label} to={c.to} className="group flex items-center justify-between gap-2 bg-white rounded-xl border border-[var(--ipk-border)] hover:border-[var(--ipk-green)] hover:shadow-sm transition-all px-4 py-3">
              <span className="text-[var(--ipk-ink)]" style={{ fontSize: "14px", fontWeight: 600 }}>{c.label}</span>
              <ArrowRight className="w-4 h-4 text-[var(--ipk-green)] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (slug === "ventes-encheres") {
    return <AuctionHouse />;
  }

  return null;
}

// Liens croisés par rubrique marketplace.
const marketplaceCrossLinks: Record<string, CrossLink[]> = {
  "galerie-creations": [
    { icon: ImageIcon, label: "Galeries photographiques", desc: "10 galeries thématiques pour découvrir les œuvres.", to: "/galeries" },
    { icon: Hammer, label: "Familles de métiers", desc: "Comprendre les techniques derrière les créations.", to: "/metiers" },
    { icon: Shield, label: "Labels & certificats", desc: "Garantir l'authenticité de chaque œuvre.", to: "/marketplace/labels-certificats" },
  ],
  "boutique-artisans": [
    { icon: Users, label: "Répertoire des artisans", desc: "Découvrir les créateurs IPPOO KRAAFT.", to: "/repertoire" },
    { icon: HeartHandshake, label: "Groupements & coopératives", desc: "Les communautés qui structurent l'activité.", to: "/groupements" },
    { icon: GraduationCap, label: "Académie KRAAFT", desc: "Former et professionnaliser les artisans.", to: "/academie" },
  ],
  "commandes-personnalisees": [
    { icon: PenTool, label: "Appels à création", desc: "Pour les projets institutionnels d'envergure.", to: "/marketplace/appels-creation" },
    { icon: Gem, label: "Œuvres d'exception", desc: "Ventes aux enchères des pièces uniques.", to: "/marketplace/ventes-encheres" },
    { icon: Send, label: "Contacter un artisan", desc: "Échanger directement avec le créateur.", to: "/contact" },
  ],
  "appels-creation": [
    { icon: Landmark, label: "Espace galeries & musées", desc: "Pour les institutions partenaires.", to: "/marketplace/espace-galeries-musees" },
    { icon: Crown, label: "Grands Maîtres", desc: "Identifier les artisans pour vos projets.", to: "/patrimoines/grands-maitres" },
    { icon: Handshake, label: "Devenir artisan partenaire", desc: "Rejoindre le réseau IPPOO KRAAFT.", to: "/devenir-artisan" },
  ],
  "ventes-encheres": [
    { icon: ImageIcon, label: "Collections patrimoniales", desc: "Œuvres royales, sacrées, artistiques.", to: "/patrimoines/collections-patrimoniales" },
    { icon: Shield, label: "Labels d'authenticité", desc: "Comprendre les certificats numériques.", to: "/marketplace/labels-certificats" },
    { icon: Users, label: "Galerie des collectionneurs", desc: "Échanger entre passionnés.", to: "/marketplace/galerie-collectionneurs" },
  ],
  "galerie-collectionneurs": [
    { icon: Library, label: "Collections KRAAFT", desc: "Thématiques éditoriales et commerciales.", to: "/marketplace/collections-kraaft" },
    { icon: BookOpen, label: "Centre de documentation", desc: "Ressources scientifiques de référence.", to: "/patrimoines/centre-documentation" },
    { icon: Send, label: "Devenir collectionneur partenaire", desc: "Nous contacter pour présenter sa collection.", to: "/contact" },
  ],
  "espace-galeries-musees": [
    { icon: Landmark, label: "Musées Vivants", desc: "Les expositions immersives du portail.", to: "/salons" },
    { icon: BookOpen, label: "Centre Patrimoines", desc: "Recherche, conservation et sauvegarde.", to: "/patrimoines" },
    { icon: Send, label: "Devenir institution partenaire", desc: "Proposer un programme commun.", to: "/contact" },
  ],
  "labels-certificats": [
    { icon: Shield, label: "Normes IPPOO KRAAFT", desc: "Les référentiels qualité du portail.", to: "/a-propos" },
    { icon: Microscope, label: "Laboratoire de conservation", desc: "Diagnostic, analyse, restauration.", to: "/patrimoines/laboratoire-conservation" },
    { icon: Users, label: "Répertoire certifié", desc: "Voir les artisans labellisés.", to: "/repertoire" },
  ],
  "collections-kraaft": [
    { icon: Palette, label: "Arts & culture", desc: "Le grand récit visuel des arts africains.", to: "/arts-culture" },
    { icon: FolderOpen, label: "Dossiers thématiques", desc: "Médias et éditoriaux liés aux collections.", to: "/medias/dossiers-thematiques" },
    { icon: Store, label: "Boutique", desc: "Acquérir les œuvres présentées.", to: "/boutique" },
  ],
  "services-numeriques-artisans": [
    { icon: GraduationCap, label: "Académie KRAAFT", desc: "Formations pour développer son activité.", to: "/academie" },
    { icon: HeartHandshake, label: "Groupements", desc: "Mutualiser ressources et commandes.", to: "/groupements" },
    { icon: Hammer, label: "Familles de métiers", desc: "Inscrire son atelier dans une discipline.", to: "/metiers" },
  ],
};

// ============= INDEX : PLACE DE MARCHÉ =============
export function MarketplacePage() {
  useSeo({
    title: "Place de Marché KRAAFT - Commerce & Économie des métiers d'art",
    description:
      "Galerie des créations, boutiques d'artisans, commandes personnalisées, appels à création, ventes aux enchères, labels d'authenticité, collections KRAAFT et services numériques.",
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-20 lg:pb-10">
      {/* Fil d'Ariane */}
      <nav className="flex items-center gap-1.5 text-[var(--ipk-text)] mb-5" style={{ fontSize: "13px" }} aria-label="Fil d'Ariane">
        <Link to="/accueil" className="hover:text-[var(--ipk-green)] transition-colors">Accueil</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[var(--ipk-ink)]">Place de Marché</span>
      </nav>

      {/* Intro - hero décoratif sans image */}
      <section className="relative overflow-hidden rounded-3xl mb-10" style={{ background: "linear-gradient(135deg, #0B6B3A 0%, #095A30 55%, #111418 130%)" }}>
        <div aria-hidden className="absolute -top-24 -right-16 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[var(--ipk-green)]/25 blur-3xl" />
        <div aria-hidden className="absolute -bottom-28 -left-20 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[var(--ipk-amber)]/20 blur-3xl" />
        <ShoppingBag aria-hidden className="absolute -right-6 sm:right-8 top-1/2 -translate-y-1/2 w-40 h-40 sm:w-64 sm:h-64 text-white/5 pointer-events-none" strokeWidth={1} />
        <div className="relative p-6 sm:p-10 lg:p-14 max-w-3xl">
          <span className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-[var(--ipk-amber)]" style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            <ShoppingBag className="w-3.5 h-3.5" /> {MARKETPLACE_INTRO.eyebrow}
          </span>
          <h1 className="text-white mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 5vw, 46px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
            {MARKETPLACE_INTRO.title}
          </h1>
          <p className="text-[var(--ipk-amber)] mb-6" style={{ fontSize: "clamp(15px, 2.2vw, 19px)", fontWeight: 500, lineHeight: 1.5 }}>
            {MARKETPLACE_INTRO.tagline}
          </p>
          <div className="space-y-3 mb-8">
            {MARKETPLACE_INTRO.paragraphs.map((p, i) => (
              <p key={i} className="text-white/80" style={{ fontSize: "15px", lineHeight: 1.8 }}>
                {p}
              </p>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/boutique" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white text-[var(--ipk-green-dark)] shadow-lg shadow-black/10 hover:bg-white/90 hover:-translate-y-0.5 transition-all" style={{ fontSize: "14px", fontWeight: 600 }}>
              <Store className="w-4 h-4" /> Explorer la boutique
            </Link>
            <Link to="/devenir-artisan" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-white/25 bg-white/5 backdrop-blur-sm text-white hover:bg-white/15 hover:-translate-y-0.5 transition-all" style={{ fontSize: "14px", fontWeight: 600 }}>
              Ouvrir ma boutique artisan
            </Link>
          </div>
        </div>
      </section>

      {/* Grille */}
      <h2 className="text-[var(--ipk-ink)] mb-5" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 700 }}>
        Dix piliers pour faire vivre l'économie des métiers d'art
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketplaceSections.map((s) => (
          <Link
            key={s.slug}
            to={`/marketplace/${s.slug}`}
            className="group bg-white rounded-2xl overflow-hidden border border-[var(--ipk-border)] hover:shadow-md transition-all flex flex-col"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <LazyImage src={s.cardImage} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-[var(--ipk-ink)] mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700 }}>
                {s.title}
              </h3>
              <p className="text-[var(--ipk-text)] mb-4 flex-1" style={{ fontSize: "14px", lineHeight: 1.6 }}>
                {s.tagline}
              </p>
              <span className="inline-flex items-center gap-1.5 text-[var(--ipk-green)]" style={{ fontSize: "14px", fontWeight: 600 }}>
                Découvrir <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ============= DÉTAIL =============
function BlockView({ block }: { block: MarketplaceBlock }) {
  return (
    <div className="mb-6">
      {block.heading && (
        <h3 className="text-[var(--ipk-ink)] mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700 }}>
          {block.heading}
        </h3>
      )}
      {block.text && (
        <p className="text-[var(--ipk-text)] mb-3" style={{ fontSize: "15px", lineHeight: 1.8 }}>
          {block.text}
        </p>
      )}
      {block.items && block.items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {block.items.map((it) => (
            <span key={it} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--ipk-surface)] border border-[var(--ipk-border)] text-[var(--ipk-ink)]" style={{ fontSize: "13px", fontWeight: 500 }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--ipk-green)]" /> {it}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function MarketplaceSectionPage() {
  const { slug } = useParams<{ slug: string }>();
  const section = slug ? getMarketplaceSection(slug) : undefined;

  useSeo({
    title: section ? section.title : "Place de Marché KRAAFT",
    description: section?.tagline,
  });

  if (!section) return <Navigate to="/marketplace" replace />;

  const currentIndex = marketplaceSections.findIndex((s) => s.slug === section.slug);
  const next = marketplaceSections[(currentIndex + 1) % marketplaceSections.length];

  return (
    <div className="pb-20 lg:pb-10">
      {/* Hero */}
      <PageHero
        slug={section.slug}
        icon={ShoppingBag}
        eyebrow={section.title}
        title={section.title}
        tagline={section.tagline}
        breadcrumbs={[{ label: "Accueil", to: "/accueil" }, { label: "Place de Marché", to: "/marketplace" }]}
        ctas={[]}
        letter={section.letter}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="mt-8 mb-8">
          {section.intro.map((p, i) => (
            <p key={i} className="text-[var(--ipk-text)] mb-3" style={{ fontSize: "16px", lineHeight: 1.85 }}>
              {p}
            </p>
          ))}
        </div>

        {/* Blocs */}
        <div className="bg-white rounded-2xl border border-[var(--ipk-border)] p-6 sm:p-8">
          {section.blocks.map((b, i) => (
            <BlockView key={i} block={b} />
          ))}
        </div>

        {/* Données réelles branchées selon la rubrique */}
        <LiveWidget slug={section.slug} />

        {section.closing && (
          <p className="text-[var(--ipk-text)] mt-8" style={{ fontSize: "15px", lineHeight: 1.85 }}>
            {section.closing}
          </p>
        )}

        {/* CTA */}
        <div className="mt-10 rounded-2xl bg-[var(--ipk-surface)] p-6 sm:p-8 text-center">
          <h3 className="text-[var(--ipk-ink)] mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700 }}>
            Passez à l'action
          </h3>
          <p className="text-[var(--ipk-text)] mb-5 max-w-xl mx-auto" style={{ fontSize: "14px", lineHeight: 1.7 }}>
            Que vous soyez artisan, client, collectionneur ou institution, votre projet a sa place sur la Place de Marché KRAAFT.
          </p>
          <Link to={section.ctaTo} className="inline-flex items-center justify-center gap-2 bg-[var(--ipk-green-dark)] text-white rounded-xl h-11 px-6 hover:bg-[var(--ipk-green-darker)] transition-colors" style={{ fontSize: "14px", fontWeight: 600 }}>
            {section.ctaLabel} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Liens croisés */}
        <CrossLinksBlock links={marketplaceCrossLinks[section.slug] ?? []} />

        {/* Navigation */}
        <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-[var(--ipk-border)] pt-8">
          <Link to="/marketplace" className="inline-flex items-center gap-2 text-[var(--ipk-text)] hover:text-[var(--ipk-green)] transition-colors" style={{ fontSize: "14px", fontWeight: 600 }}>
            <ArrowLeft className="w-4 h-4" /> Toutes les rubriques
          </Link>
          <Link to={`/marketplace/${next.slug}`} className="inline-flex items-center justify-center gap-2 bg-[var(--ipk-green-dark)] text-white rounded-xl h-11 px-6 hover:bg-[var(--ipk-green-darker)] transition-colors" style={{ fontSize: "14px", fontWeight: 600 }}>
            Suivant : {next.title} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
