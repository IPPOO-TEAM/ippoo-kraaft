// Foires, salons, expositions, musées vivants et rencontres internationales.
// Contenu source intégralement préservé, enrichi d'accroches captivantes et de
// CTAs pour les visiteurs. RÈGLE STRICTE : chaque image est unique (aucune
// réutilisation, ni ici ni ailleurs dans l'application).

export type EventSection = { title: string; text: string; image: string };
export type EventCta = { label: string; to: string };

export type EventCategory = {
  slug: string;
  letter: string;
  title: string;
  tagline: string;
  intro: string;
  heroImage: string;
  cardImage: string;
  sections?: EventSection[];
  itemsTitle?: string;
  items?: string[];
  extra?: string[];
  ctas: EventCta[];
};

// 31 images uniques de références (Afrique & rencontres) - aucune n'apparaît
// ailleurs dans l'app.
const IMG = {
  intro: "https://images.unsplash.com/photo-1637578035851-c5b169722de1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw5fHxhcnQlMjBleGhpYml0aW9uJTIwZ2FsbGVyeSUyMGNyb3dkJTIwb3BlbmluZ3xlbnwxfHx8fDE3ODI4MDE1NTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  introSecondary: "https://images.unsplash.com/photo-1560286399-277c82e2e53a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw5fHxBZnJpY2FuJTIwZmVzdGl2YWwlMjBkYW5jZSUyMGNlcmVtb255JTIwY2VsZWJyYXRpb24lMjBjcm93ZHxlbnwxfHx8fDE3ODI4MDE1NTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  salonHero: "https://images.unsplash.com/photo-1743119844808-fefd446de533?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxhcnQlMjBleGhpYml0aW9uJTIwZ2FsbGVyeSUyMGNyb3dkJTIwb3BlbmluZ3xlbnwxfHx8fDE3ODI4MDE1NTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  salonCard: "https://images.unsplash.com/photo-1545518514-ce8448f542b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxhcnQlMjBleGhpYml0aW9uJTIwZ2FsbGVyeSUyMGNyb3dkJTIwb3BlbmluZ3xlbnwxfHx8fDE3ODI4MDE1NTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  salonS1: "https://images.unsplash.com/photo-1569783721854-33a99b4c0bae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBleGhpYml0aW9uJTIwZ2FsbGVyeSUyMGNyb3dkJTIwb3BlbmluZ3xlbnwxfHx8fDE3ODI4MDE1NTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  salonS2: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxjb25mZXJlbmNlJTIwZm9ydW0lMjBzcGVha2VycyUyMGF1ZGllbmNlJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzgyODAxNTYwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  foiresCard: "https://images.unsplash.com/photo-1561490497-43bc900ac2d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxhcnQlMjBleGhpYml0aW9uJTIwZ2FsbGVyeSUyMGNyb3dkJTIwb3BlbmluZ3xlbnwxfHx8fDE3ODI4MDE1NTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  foiresHero: "https://images.unsplash.com/photo-1743119755097-38a61eb33a2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHxhcnQlMjBleGhpYml0aW9uJTIwZ2FsbGVyeSUyMGNyb3dkJTIwb3BlbmluZ3xlbnwxfHx8fDE3ODI4MDE1NTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  foireFer: "https://images.unsplash.com/photo-1758557839522-7d6150265d39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXRhbCUyMHNjdWxwdHVyZSUyMHdlbGRlZCUyMGFydCUyMG1vZGVybnxlbnwxfHx8fDE3ODI4MDE1OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  foireBois: "https://images.unsplash.com/photo-1759523146335-0069847ceb16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHxhcnRpc2FuJTIwd29ya3Nob3AlMjBkZW1vbnN0cmF0aW9uJTIwdGVhY2hpbmclMjBoYW5kcyUyMGNyYWZ0fGVufDF8fHx8MTc4MjgwMTU1OXww&ixlib=rb-4.1.0&q=80&w=1080",
  foireTextile: "https://images.unsplash.com/photo-1709809081557-78f803ce93a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwZmFzaGlvbiUyMG1vZGVsJTIwcnVud2F5JTIwY29sb3JmdWwlMjBkcmVzc3xlbnwxfHx8fDE3ODI4MDE1OTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  foireCuir: "https://images.unsplash.com/photo-1570032686516-2fe01ea09f5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxoYW5kbWFkZSUyMGxlYXRoZXIlMjBiYWdzJTIwc2hvcCUyMGRpc3BsYXl8ZW58MXx8fHwxNzgyODAxNTkzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  foireBijoux: "https://images.unsplash.com/photo-1650389236412-e7413cbcf2fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwamV3ZWxyeSUyMGx1eHVyeSUyMHNob3djYXNlJTIwZGlzcGxheXxlbnwxfHx8fDE3ODI4MDE1OTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  foireArtsVisuels: "https://images.unsplash.com/photo-1579281377071-7a589cc8c3e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxhcnQlMjBleGhpYml0aW9uJTIwZ2FsbGVyeSUyMGNyb3dkJTIwb3BlbmluZ3xlbnwxfHx8fDE3ODI4MDE1NTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  foirePatrimoines: "https://images.unsplash.com/photo-1537706388178-55c10865b82e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxBZnJpY2FuJTIwZmVzdGl2YWwlMjBkYW5jZSUyMGNlcmVtb255JTIwY2VsZWJyYXRpb24lMjBjcm93ZHxlbnwxfHx8fDE3ODI4MDE1NTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  museesHero: "https://images.unsplash.com/photo-1722963295936-03ea25f1d4d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxhcnRpc2FuJTIwd29ya3Nob3AlMjBkZW1vbnN0cmF0aW9uJTIwdGVhY2hpbmclMjBoYW5kcyUyMGNyYWZ0fGVufDF8fHx8MTc4MjgwMTU1OXww&ixlib=rb-4.1.0&q=80&w=1080",
  museesCard: "https://images.unsplash.com/photo-1781389004999-d1a7e41639c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxhcnRpc2FuJTIwd29ya3Nob3AlMjBkZW1vbnN0cmF0aW9uJTIwdGVhY2hpbmclMjBoYW5kcyUyMGNyYWZ0fGVufDF8fHx8MTc4MjgwMTU1OXww&ixlib=rb-4.1.0&q=80&w=1080",
  villagesHero: "https://images.unsplash.com/photo-1759217801409-f95619d6c1e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxBZnJpY2FuJTIwdmlsbGFnZSUyMHRyYWRpdGlvbmFsJTIwbXVkJTIwaG91c2VzJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc4MjgwMTYwMXww&ixlib=rb-4.1.0&q=80&w=1080",
  villagesCard: "https://images.unsplash.com/photo-1772289935132-88dece86597f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwdmlsbGFnZSUyMHRyYWRpdGlvbmFsJTIwbXVkJTIwaG91c2VzJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc4MjgwMTYwMXww&ixlib=rb-4.1.0&q=80&w=1080",
  circuitsHero: "https://images.unsplash.com/photo-1771236471377-ad159416c225?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxBZnJpY2ElMjBoZXJpdGFnZSUyMGhpc3RvcmljJTIwc2l0ZSUyMHRyYXZlbCUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3ODI4MDE2MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  circuitsCard: "https://images.unsplash.com/photo-1770847764989-725a2a4b4797?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2ElMjBoZXJpdGFnZSUyMGhpc3RvcmljJTIwc2l0ZSUyMHRyYXZlbCUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3ODI4MDE2MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  rencontresHero: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwZm9ydW0lMjBzcGVha2VycyUyMGF1ZGllbmNlJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzgyODAxNTYwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  rencontresCard: "https://images.unsplash.com/photo-1531058020387-3be344556be6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxjb25mZXJlbmNlJTIwZm9ydW0lMjBzcGVha2VycyUyMGF1ZGllbmNlJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzgyODAxNTYwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  semainesHero: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2RjYXN0JTIwbWljcm9waG9uZSUyMHJlY29yZGluZyUyMHN0dWRpbyUyMGludGVydmlld3xlbnwxfHx8fDE3ODI4MDE2MDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  semainesCard: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxwb2RjYXN0JTIwbWljcm9waG9uZSUyMHJlY29yZGluZyUyMHN0dWRpbyUyMGludGVydmlld3xlbnwxfHx8fDE3ODI4MDE2MDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  saisonsHero: "https://images.unsplash.com/photo-1544476613-a6ad8bb6862c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxMHx8QWZyaWNhbiUyMGZlc3RpdmFsJTIwZGFuY2UlMjBjZXJlbW9ueSUyMGNlbGVicmF0aW9uJTIwY3Jvd2R8ZW58MXx8fHwxNzgyODAxNTU4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  saisonsCard: "https://images.unsplash.com/photo-1515657241610-a6b33f0f6c5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxBZnJpY2FuJTIwZmVzdGl2YWwlMjBkYW5jZSUyMGNlcmVtb255JTIwY2VsZWJyYXRpb24lMjBjcm93ZHxlbnwxfHx8fDE3ODI4MDE1NTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  interHero: "https://images.unsplash.com/photo-1594122230689-45899d9e6f69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxjb25mZXJlbmNlJTIwZm9ydW0lMjBzcGVha2VycyUyMGF1ZGllbmNlJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzgyODAxNTYwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  interCard: "https://images.unsplash.com/photo-1722481744477-d0b0bb2bbba2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxBZnJpY2FuJTIwZmVzdGl2YWwlMjBkYW5jZSUyMGNlcmVtb255JTIwY2VsZWJyYXRpb24lMjBjcm93ZHxlbnwxfHx8fDE3ODI4MDE1NTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  virtHero: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXJ0dWFsJTIwcmVhbGl0eSUyMGhlYWRzZXQlMjBkaWdpdGFsJTIwaW1tZXJzaXZlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3ODI4MDE2MDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  virtCard: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHx2aXJ0dWFsJTIwcmVhbGl0eSUyMGhlYWRzZXQlMjBkaWdpdGFsJTIwaW1tZXJzaXZlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3ODI4MDE2MDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
} as const;

export const EVENTS_INTRO = {
  title:
    "Foires, salons, expositions, musées vivants et rencontres internationales",
  tagline:
    "Le grand carrefour vivant des métiers d'art africains : se rencontrer, exposer, transmettre et rayonner dans le monde.",
  image: IMG.intro,
  secondaryImage: IMG.introSecondary,
  paragraphs: [
    "Cette rubrique fait d'IPPOO KRAAFT une plateforme de rencontre permanente entre les artisans, les artistes, les chercheurs, les collectionneurs, les institutions, les entreprises, les écoles, les investisseurs et le grand public. Elle met en valeur les créations, encourage les échanges professionnels, stimule l'innovation et favorise la découverte des patrimoines culturels dans un cadre ouvert, participatif et international.",
    "Les manifestations organisées permettent également de créer des passerelles entre les générations, les territoires, les cultures et les disciplines artistiques afin de renforcer la visibilité des métiers d'art africains et de leurs influences dans le monde.",
  ],
};

export const eventCategories: EventCategory[] = [
  {
    slug: "grand-salon-kraaft",
    letter: "A",
    title: "Le Grand Salon KRAAFT des Métiers d'Art",
    tagline:
      "Le rendez-vous majeur de l'année - là où l'excellence des métiers d'art rencontre le monde.",
    intro:
      "Le Grand Salon KRAAFT constitue le principal rendez-vous annuel du portail.",
    heroImage: IMG.salonHero,
    cardImage: IMG.salonCard,
    sections: [
      {
        title: "Le grand rassemblement des talents",
        text: "Il rassemble les meilleurs artisans, artistes, créateurs, designers, architectes, chercheurs, conservateurs, restaurateurs, institutions culturelles, écoles, musées et entreprises autour d'une programmation consacrée aux métiers d'art, aux patrimoines vivants et aux innovations.",
        image: IMG.salonS1,
      },
      {
        title: "Une programmation foisonnante",
        text: "Le salon accueille des expositions, des démonstrations, des conférences, des ateliers, des concours, des rencontres professionnelles, des lancements de collections, des présentations de technologies, des forums de recrutement et des espaces de coopération.",
        image: IMG.salonS2,
      },
    ],
    ctas: [
      { label: "Découvrir l'agenda des événements", to: "/evenements" },
      { label: "Explorer les métiers d'art", to: "/metiers" },
    ],
  },
  {
    slug: "foires-thematiques",
    letter: "B",
    title: "Les Foires Thématiques",
    tagline:
      "Sept grands rendez-vous spécialisés : à chaque foire, une matière et un savoir-faire à l'honneur.",
    intro:
      "Chaque grande famille de métiers dispose de sa propre foire spécialisée.",
    heroImage: IMG.foiresHero,
    cardImage: IMG.foiresCard,
    sections: [
      {
        title: "Foire de la Ferronnerie d'Art",
        text: "Présentation des œuvres monumentales, sculptures métalliques, objets royaux, mobilier artistique, créations contemporaines et démonstrations de forge.",
        image: IMG.foireFer,
      },
      {
        title: "Foire du Bois",
        text: "Présentation des sculptures, mobiliers, instruments de musique, objets décoratifs, architectures traditionnelles et innovations.",
        image: IMG.foireBois,
      },
      {
        title: "Foire du Textile",
        text: "Valorisation des tissages, broderies, teintures naturelles, estampes, vêtements, accessoires et créations contemporaines.",
        image: IMG.foireTextile,
      },
      {
        title: "Foire du Cuir",
        text: "Présentation du cuir repoussé, de la maroquinerie, de la sellerie, des chaussures, des sacs, des objets décoratifs et des techniques traditionnelles.",
        image: IMG.foireCuir,
      },
      {
        title: "Foire des Bijoux",
        text: "Exposition des créations en or, argent, bronze, cuivre, perles, pierres naturelles, coquillages et matériaux nobles.",
        image: IMG.foireBijoux,
      },
      {
        title: "Foire des Arts Visuels",
        text: "Peinture, dessin, illustration, photographie, gravure, arts numériques, installations artistiques et créations contemporaines.",
        image: IMG.foireArtsVisuels,
      },
      {
        title: "Foire des Patrimoines Vivants",
        text: "Présentation des traditions, cérémonies, danses, musiques, costumes, coiffures, maquillages, savoir-faire et expressions culturelles.",
        image: IMG.foirePatrimoines,
      },
    ],
    ctas: [
      { label: "Voir la boutique par familles", to: "/boutique" },
      { label: "Découvrir les arts & culture", to: "/arts-culture" },
    ],
  },
  {
    slug: "musees-vivants",
    letter: "C",
    title: "Les Musées Vivants",
    tagline:
      "Le patrimoine en mouvement : ici, on n'observe pas seulement - on participe.",
    intro:
      "Cette rubrique propose une approche immersive des patrimoines. Contrairement aux musées classiques, les Musées Vivants permettent d'observer directement les artisans au travail et de participer aux activités proposées.",
    heroImage: IMG.museesHero,
    cardImage: IMG.museesCard,
    itemsTitle: "Chaque musée vivant comprend :",
    items: [
      "des ateliers en activité",
      "des démonstrations permanentes",
      "des espaces d'initiation",
      "des expositions interactives",
      "des parcours pédagogiques",
      "des conférences",
      "des projections documentaires",
      "des espaces numériques",
      "des boutiques d'artisanat",
      "des rencontres avec les maîtres d'art",
    ],
    extra: [
      "Les visiteurs découvrent les différentes étapes de création d'une œuvre, depuis la sélection des matériaux jusqu'aux finitions.",
    ],
    ctas: [
      { label: "Explorer les galeries", to: "/galeries" },
      { label: "Suivre une formation", to: "/formations" },
    ],
  },
  {
    slug: "villages-artisanaux",
    letter: "D",
    title: "Les Villages Artisanaux",
    tagline:
      "Partez à la rencontre des terroirs créatifs et des familles qui font vivre les métiers d'art.",
    intro:
      "Cette rubrique référence les villages spécialisés dans les métiers d'art.",
    heroImage: IMG.villagesHero,
    cardImage: IMG.villagesCard,
    itemsTitle: "Chaque village possède une fiche détaillée comprenant :",
    items: [
      "son histoire",
      "ses spécialités",
      "ses ateliers",
      "ses familles artisanales",
      "ses maîtres d'art",
      "ses parcours de visite",
      "ses hébergements",
      "sa restauration",
      "ses boutiques",
      "ses formations",
      "son agenda culturel",
    ],
    extra: [
      "Les visiteurs peuvent préparer leur séjour, réserver des visites, participer à des ateliers et rencontrer directement les artisans.",
    ],
    ctas: [
      { label: "Voir le répertoire des artisans", to: "/repertoire" },
      { label: "Découvrir les groupements", to: "/groupements" },
    ],
  },
  {
    slug: "circuits-touristiques",
    letter: "E",
    title: "Les Circuits Touristiques Culturels",
    tagline:
      "Des itinéraires où patrimoine, artisanat, gastronomie et rencontres ne font qu'un.",
    intro:
      "Cette section rassemble des itinéraires consacrés aux patrimoines artisanaux.",
    heroImage: IMG.circuitsHero,
    cardImage: IMG.circuitsCard,
    itemsTitle: "Les parcours permettent de découvrir :",
    items: [
      "les ateliers historiques",
      "les palais",
      "les villages artisanaux",
      "les musées",
      "les centres de formation",
      "les marchés traditionnels",
      "les lieux de fabrication",
      "les centres d'interprétation",
      "les sites classés",
      "les festivals",
    ],
    extra: [
      "Chaque circuit associe patrimoine, tourisme, artisanat, gastronomie, musique, danse et rencontres avec les communautés.",
    ],
    ctas: [
      { label: "Voir les événements à venir", to: "/evenements" },
      { label: "Nous contacter pour un circuit", to: "/contact" },
    ],
  },
  {
    slug: "rencontres-internationales",
    letter: "F",
    title: "Les Rencontres Internationales des Métiers d'Art",
    tagline:
      "Un sommet annuel où se nouent partenariats, savoirs et coopérations à l'échelle du monde.",
    intro:
      "Ces rencontres réunissent chaque année des représentants de différents pays.",
    heroImage: IMG.rencontresHero,
    cardImage: IMG.rencontresCard,
    itemsTitle: "La programmation comprend :",
    items: [
      "conférences internationales",
      "colloques scientifiques",
      "tables rondes",
      "ateliers collaboratifs",
      "démonstrations techniques",
      "présentations de projets",
      "forums économiques",
      "rencontres B2B",
      "échanges universitaires",
      "coopérations institutionnelles",
    ],
    extra: [
      "Ces événements favorisent les partenariats entre les écoles, les entreprises, les collectivités territoriales, les organisations professionnelles et les institutions culturelles.",
    ],
    ctas: [
      { label: "Devenir partenaire", to: "/contact" },
      { label: "Rejoindre la communauté artisan", to: "/devenir-artisan" },
    ],
  },
  {
    slug: "semaines-culturelles",
    letter: "G",
    title: "Les Semaines Culturelles",
    tagline:
      "Chaque semaine, un peuple, une région ou une famille artisanale à l'honneur.",
    intro:
      "Chaque semaine culturelle met à l'honneur un pays, une région, un peuple, une communauté ou une famille artisanale.",
    heroImage: IMG.semainesHero,
    cardImage: IMG.semainesCard,
    itemsTitle: "Pendant cette période, le portail diffuse :",
    items: [
      "des reportages",
      "des interviews",
      "des podcasts",
      "des expositions virtuelles",
      "des visites guidées",
      "des conférences",
      "des ateliers en ligne",
      "des démonstrations",
      "des publications scientifiques",
      "des portraits de maîtres d'art",
    ],
    ctas: [
      { label: "Lire le blog & les éditoriaux", to: "/blog" },
      { label: "Explorer les arts & culture", to: "/arts-culture" },
    ],
  },
  {
    slug: "saisons-kraaft",
    letter: "H",
    title: "Les Saisons KRAAFT",
    tagline:
      "Une année rythmée par des saisons thématiques dédiées à chaque grand art.",
    intro:
      "Le calendrier annuel est organisé en saisons thématiques.",
    heroImage: IMG.saisonsHero,
    cardImage: IMG.saisonsCard,
    itemsTitle: "Exemples :",
    items: [
      "Saison de la Ferronnerie d'Art",
      "Saison des Textiles Africains",
      "Saison des Arts Royaux",
      "Saison des Tambours",
      "Saison des Coiffures Traditionnelles",
      "Saison des Coiffes",
      "Saison de la Sculpture",
      "Saison des Bijoux",
      "Saison des Arts du Bois",
      "Saison des Arts Sacrés",
      "Saison des Arts Contemporains inspirés des Patrimoines",
    ],
    extra: [
      "Chaque saison donne lieu à des contenus éditoriaux, des concours, des formations, des expositions et des événements spécifiques.",
    ],
    ctas: [
      { label: "Voir les concours en cours", to: "/concours" },
      { label: "Découvrir les formations", to: "/formations" },
    ],
  },
  {
    slug: "rencontres-interculturelles",
    letter: "I",
    title: "Les Rencontres Interculturelles",
    tagline:
      "Un dialogue vivant entre les patrimoines africains et ceux du monde entier.",
    intro:
      "Cette rubrique répond directement à la volonté de faire d'IPPOO KRAAFT un espace de dialogue entre les cultures. Des rencontres sont organisées autour des influences réciproques entre les patrimoines africains et ceux des autres régions du monde.",
    heroImage: IMG.interHero,
    cardImage: IMG.interCard,
    itemsTitle: "Les thématiques peuvent porter sur :",
    items: [
      "les arts vestimentaires",
      "les coiffures",
      "les coiffes",
      "les bijoux",
      "les instruments de musique",
      "les danses",
      "les arts martiaux traditionnels",
      "les architectures",
      "les arts décoratifs",
      "les techniques artisanales",
      "les matériaux",
      "les savoir-faire",
    ],
    extra: [
      "Des dossiers éditoriaux mettent également en évidence les liens historiques entre les traditions africaines et celles des Caraïbes, du Brésil, de l'Inde, du Japon, de l'Amérique du Nord, de l'Europe, du Maghreb et du Moyen-Orient, conformément à la vision exprimée dans les notes de travail. Cette approche privilégie l'étude des influences culturelles, des échanges historiques, des évolutions artistiques et des héritages patrimoniaux dans une perspective comparative et documentée.",
    ],
    ctas: [
      { label: "Lire les dossiers éditoriaux", to: "/blog" },
      { label: "Explorer les arts & culture", to: "/arts-culture" },
    ],
  },
  {
    slug: "expositions-virtuelles",
    letter: "J",
    title: "Les Expositions Virtuelles",
    tagline:
      "Le musée sans frontières : l'art africain accessible partout, en haute définition.",
    intro:
      "Le portail propose des expositions accessibles en ligne.",
    heroImage: IMG.virtHero,
    cardImage: IMG.virtCard,
    itemsTitle: "Chaque exposition rassemble :",
    items: [
      "des œuvres en haute définition",
      "des modèles 3D",
      "des commentaires audio",
      "des vidéos de fabrication",
      "des interviews",
      "des cartes interactives",
      "des chronologies",
      "des fiches pédagogiques",
      "des parcours thématiques",
    ],
    ctas: [
      { label: "Visiter les galeries en ligne", to: "/galeries" },
      { label: "Découvrir la boutique", to: "/boutique" },
    ],
  },
];

export function getEventCategory(slug: string): EventCategory | undefined {
  return eventCategories.find((e) => e.slug === slug);
}
