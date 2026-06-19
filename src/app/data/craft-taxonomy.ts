// Taxonomie des métiers d'art / artisanat IPPOO KRAAFT.
// Trois niveaux : Domaine → Niche → (option) Sous-niche.
// Slugs stables (jamais renommer) pour persistance localStorage / URL filters.

export interface SubNiche { slug: string; label: string; }
export interface Niche { slug: string; label: string; subNiches?: SubNiche[]; }
export interface Domain { slug: string; label: string; description?: string; niches: Niche[]; }

export const CRAFT_TAXONOMY: Domain[] = [
  {
    slug: "art",
    label: "Artisanat d'art",
    description: "Œuvres et objets d'art créés à la main.",
    niches: [
      { slug: "sculpture", label: "Sculpture" },
      { slug: "gravure", label: "Gravure" },
      { slug: "peinture-decorative", label: "Peinture décorative" },
      { slug: "ceramique-poterie", label: "Céramique / poterie" },
      { slug: "vannerie-tressage", label: "Vannerie / tressage" },
      { slug: "maroquinerie-art", label: "Maroquinerie artisanale" },
      { slug: "bijouterie-art", label: "Bijouterie artisanale" },
      { slug: "broderie-art", label: "Broderie d'art" },
      { slug: "tapisserie", label: "Tapisserie" },
      { slug: "calligraphie", label: "Calligraphie" },
      { slug: "ferronnerie-art", label: "Ferronnerie d'art" },
      { slug: "litterature-bois-sculpte", label: "Littérature et objets en bois sculpté" },
    ],
  },
  {
    slug: "bois",
    label: "Travail du bois",
    niches: [
      { slug: "menuiserie-bois", label: "Menuiserie bois" },
      { slug: "ebenisterie", label: "Ébénisterie" },
      { slug: "fabrication-meubles", label: "Fabrication de meubles" },
      { slug: "charpenterie-art", label: "Charpenterie artisanale" },
      { slug: "sculpture-bois", label: "Sculptures en bois" },
      { slug: "ustensiles-traditionnels", label: "Fabrication d'ustensiles traditionnels" },
    ],
  },
  {
    slug: "textile",
    label: "Textile, couture et mode",
    niches: [
      { slug: "couture-confection", label: "Couture / confection" },
      { slug: "stylisme-modelisme", label: "Stylisme / modélisme" },
      { slug: "tricot-crochet", label: "Tricot / crochet" },
      { slug: "teinture-art", label: "Teinture artisanale (batik, indigo, bogolan…)" },
      { slug: "tissage-traditionnel", label: "Tissage traditionnel" },
      { slug: "fab-chaussures", label: "Fabrication de chaussures" },
      { slug: "fab-sacs-accessoires", label: "Fabrication de sacs et accessoires" },
      { slug: "mode-traditionnelle", label: "Mode traditionnelle (tenues africaines)" },
    ],
  },
  {
    slug: "metaux",
    label: "Métaux & joaillerie",
    niches: [
      { slug: "bijouterie-joaillerie", label: "Bijouterie et joaillerie" },
      { slug: "orfevrerie", label: "Orfèvrerie" },
      { slug: "ferronnerie-soudure", label: "Ferronnerie / soudure artisanale" },
      { slug: "armes-traditionnelles", label: "Fabrication d'armes traditionnelles (coutelas, machettes)" },
      { slug: "outils-agricoles", label: "Fabrication d'outils agricoles artisanaux" },
    ],
  },
  {
    slug: "batiment",
    label: "Bâtiment & construction",
    niches: [
      { slug: "maconnerie-art", label: "Maçonnerie artisanale" },
      { slug: "platrerie-trad", label: "Plâtrerie traditionnelle" },
      { slug: "carrelage", label: "Carrelage" },
      { slug: "peinture-batiment", label: "Peinture bâtiment" },
      { slug: "charpenterie", label: "Charpenterie" },
      { slug: "terre-battue", label: "Construction terre battue / banco" },
      { slug: "finition-decorative", label: "Finition décorative (stuc, tadelakt…)" },
    ],
  },
  {
    slug: "cosmetiques",
    label: "Cosmétiques & soins naturels",
    niches: [
      { slug: "savons-art", label: "Fabrication de savons artisanaux" },
      { slug: "pommades-beurres", label: "Fabrication de pommades / beurres (karité, coco…)" },
      { slug: "huiles-essentielles", label: "Fabrication d'huiles essentielles" },
      { slug: "produits-capillaires", label: "Produits capillaires naturels" },
      { slug: "parfums-art", label: "Parfums artisanaux" },
      { slug: "spa-bienetre", label: "Produits spa & bien-être traditionnels" },
    ],
  },
  {
    slug: "domestique",
    label: "Artisanat domestique",
    niches: [
      { slug: "meubles-maison", label: "Fabrication de meubles de maison" },
      { slug: "deco-interieure", label: "Décoration intérieure" },
      { slug: "luminaires-art", label: "Luminaires artisanaux" },
      { slug: "tapis-nattes", label: "Tapis / nattes" },
      { slug: "ustensiles-cuisine", label: "Ustensiles de cuisine traditionnels" },
    ],
  },
  {
    slug: "culturel",
    label: "Artisanat culturel & traditionnel",
    niches: [
      { slug: "instruments-musique", label: "Fabrication d'instruments de musique" },
      { slug: "masques-trad", label: "Masques traditionnels" },
      { slug: "costumes-culturels", label: "Costumes culturels" },
      { slug: "accessoires-danse", label: "Accessoires de danse" },
      { slug: "objets-rituels", label: "Objets rituels ou symboliques" },
    ],
  },
  {
    slug: "reparation",
    label: "Réparation & services techniques artisanaux",
    niches: [
      { slug: "rep-chaussures", label: "Réparation de chaussures" },
      { slug: "couture-retouche", label: "Couture / retouche" },
      { slug: "metallurgie-legere", label: "Métallurgie légère" },
      { slug: "mecanique-art", label: "Mécanique artisanale" },
      { slug: "menuiserie-rep", label: "Menuiserie-réparation" },
    ],
  },
  {
    slug: "recyclage",
    label: "Recyclage & artisanat écologique",
    niches: [
      { slug: "upcycling", label: "Upcycling (transformation créative)" },
      { slug: "sacs-recycles", label: "Sacs / accessoires en matériaux recyclés" },
      { slug: "sculpture-dechets-metalliques", label: "Sculpture à partir de déchets métalliques" },
      { slug: "deco-recyclee", label: "Objets décoratifs recyclés" },
      { slug: "compost-art", label: "Compost artisanal" },
    ],
  },
  {
    slug: "vannerie",
    label: "Vannerie (filière dédiée)",
    description: "Filière vannerie complète : matières, usages, design, mode, jouets, mobilier.",
    niches: [
      {
        slug: "vannerie-traditionnelle",
        label: "Vannerie traditionnelle (fibres naturelles)",
        subNiches: [
          { slug: "rotin", label: "Vannerie en rotin" },
          { slug: "raphia", label: "Vannerie en raphia" },
          { slug: "bambou", label: "Vannerie en bambou" },
          { slug: "roseaux", label: "Vannerie en roseaux" },
          { slug: "palmes", label: "Tressage de palmes" },
          { slug: "herbes-sechees", label: "Vannerie en herbes séchées" },
          { slug: "jacinthe-eau", label: "Tressage de jacinthe d'eau" },
          { slug: "papiers-recycles", label: "Tressage de papiers recyclés" },
        ],
      },
      {
        slug: "vannerie-utilitaire",
        label: "Vannerie utilitaire (objets du quotidien)",
        subNiches: [
          { slug: "paniers", label: "Paniers (petits, moyens, grands)" },
          { slug: "corbeilles-marche", label: "Corbeilles de marché" },
          { slug: "plateaux-tresses", label: "Plateaux tressés" },
          { slug: "paniers-linge", label: "Paniers à linge" },
          { slug: "paniers-pain", label: "Paniers à pain" },
          { slug: "sous-plats", label: "Sous-plats tressés" },
          { slug: "range-papiers", label: "Range-papiers / organiseurs" },
          { slug: "boites-rangement", label: "Boîtes de rangement" },
          { slug: "corbeilles-fruits", label: "Corbeilles de fruits" },
          { slug: "sacs-courses-tresses", label: "Sacs de courses tressés" },
          { slug: "paniers-pique-nique", label: "Paniers pique-nique" },
        ],
      },
      {
        slug: "vannerie-deco",
        label: "Vannerie décorative & design intérieur",
        subNiches: [
          { slug: "suspensions-luminaires", label: "Suspensions et luminaires tressés" },
          { slug: "abat-jour", label: "Abat-jour" },
          { slug: "tapis-tresses", label: "Tapis tressés" },
          { slug: "murales-deco", label: "Murales décoratives" },
          { slug: "deco-murale-ethnique", label: "Décorations murales ethniques" },
          { slug: "cache-pots", label: "Cache-pots" },
          { slug: "vases-tresses", label: "Vases tressés" },
          { slug: "objets-deco-abstraits", label: "Objets décoratifs (boules, formes abstraites)" },
        ],
      },
      {
        slug: "vannerie-mode",
        label: "Accessoires de mode en vannerie",
        subNiches: [
          { slug: "sacs-main-tresses", label: "Sacs à main tressés" },
          { slug: "pochettes-fibres", label: "Pochettes en fibres" },
          { slug: "chapeaux", label: "Chapeaux & couvre-chefs" },
          { slug: "sandales-tressees", label: "Sandales tressées" },
          { slug: "ceintures-fibres", label: "Ceintures en fibres naturelles" },
          { slug: "bijoux-fibres", label: "Bijoux (bracelets, colliers, boucles)" },
          { slug: "eventails", label: "Éventails artisanaux" },
          { slug: "lunettes-ethniques", label: "Lunettes tressées à motifs ethniques" },
        ],
      },
      {
        slug: "vannerie-jouets",
        label: "Jouets & objets pour enfants",
        subNiches: [
          { slug: "petits-paniers-enfants", label: "Petits paniers d'enfants" },
          { slug: "miniatures-meubles", label: "Miniatures de meubles" },
          { slug: "petites-voitures-tressees", label: "Petites voitures tressées" },
          { slug: "figurines-fibres", label: "Figurines en fibres" },
          { slug: "poupees-traditionnelles", label: "Poupées traditionnelles tressées" },
        ],
      },
      {
        slug: "vannerie-mobilier",
        label: "Mobilier en vannerie / rotin",
        subNiches: [
          { slug: "chaises-rotin", label: "Chaises en rotin" },
          { slug: "fauteuils-tresses", label: "Fauteuils tressés" },
          { slug: "tabourets", label: "Tabourets" },
          { slug: "canapes-rotin", label: "Canapés en rotin" },
          { slug: "tetes-lit", label: "Têtes de lit tressées" },
          { slug: "tables-fibres", label: "Tables en fibres naturelles" },
          { slug: "meubles-hybrides", label: "Meubles hybrides bois + vannerie" },
        ],
      },
    ],
  },
];

// ----- Helpers -----

export interface FlatNiche {
  slug: string;          // niche slug (or `${niche}/${sub}` for sub-niches)
  label: string;
  domainSlug: string;
  domainLabel: string;
  nicheSlug: string;     // parent niche slug (= slug if not a sub-niche)
  nicheLabel: string;
  isSubNiche: boolean;
}

let _flatCache: FlatNiche[] | null = null;
export function getAllFlat(): FlatNiche[] {
  if (_flatCache) return _flatCache;
  const out: FlatNiche[] = [];
  for (const d of CRAFT_TAXONOMY) {
    for (const n of d.niches) {
      out.push({ slug: n.slug, label: n.label, domainSlug: d.slug, domainLabel: d.label, nicheSlug: n.slug, nicheLabel: n.label, isSubNiche: false });
      if (n.subNiches) {
        for (const s of n.subNiches) {
          out.push({ slug: `${n.slug}/${s.slug}`, label: s.label, domainSlug: d.slug, domainLabel: d.label, nicheSlug: n.slug, nicheLabel: n.label, isSubNiche: true });
        }
      }
    }
  }
  _flatCache = out;
  return out;
}

export function findBySlug(slug: string): FlatNiche | undefined {
  return getAllFlat().find(n => n.slug === slug);
}

export function nicheLabel(slug: string): string {
  const f = findBySlug(slug);
  if (!f) return slug;
  return f.isSubNiche ? `${f.nicheLabel} → ${f.label}` : f.label;
}

export function searchTaxonomy(query: string, limit = 30): FlatNiche[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const nq = norm(q);
  return getAllFlat().filter(n => norm(n.label).includes(nq) || norm(n.nicheLabel).includes(nq) || norm(n.domainLabel).includes(nq)).slice(0, limit);
}

// Mapping de fallback : catégorie produit "legacy" → liste de niches taxonomie.
// Permet aux produits sans champ `niches` d'apparaître dans les filtres taxonomie.
export const LEGACY_CATEGORY_TO_NICHES: Record<string, string[]> = {
  Sculpture: ["sculpture", "sculpture-bois"],
  Textile: ["tissage-traditionnel", "couture-confection", "mode-traditionnelle"],
  Poterie: ["ceramique-poterie"],
  Vannerie: ["vannerie-tressage", "vannerie-utilitaire/paniers"],
  Bijoux: ["bijouterie-art", "bijouterie-joaillerie"],
  "Métal & Bronze": ["orfevrerie", "ferronnerie-art"],
  Métal: ["orfevrerie", "ferronnerie-art"],
  Cuir: ["maroquinerie-art", "fab-sacs-accessoires"],
  Peinture: ["peinture-decorative"],
  Musique: ["instruments-musique"],
};

export function effectiveNiches(item: { niches?: string[]; category?: string }): string[] {
  if (item.niches && item.niches.length > 0) return item.niches;
  if (item.category && LEGACY_CATEGORY_TO_NICHES[item.category]) return LEGACY_CATEGORY_TO_NICHES[item.category];
  return [];
}

export function domainOf(nicheSlug: string): Domain | undefined {
  const f = findBySlug(nicheSlug);
  return f ? CRAFT_TAXONOMY.find(d => d.slug === f.domainSlug) : undefined;
}
