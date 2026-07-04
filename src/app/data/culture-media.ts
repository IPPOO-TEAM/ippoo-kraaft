// Podcasts Griots, Éditoriaux, Médias et Transmission des Savoirs.
// Contenu repris intégralement (tel quel) depuis la source éditoriale IPPOO KRAAFT,
// enrichi de formulations captivantes et de CTA pour les visiteurs.
//
// RÈGLE STRICTE : chaque image est UNIQUE (aucune image utilisée deux fois, ni ici,
// ni ailleurs dans l'application).

export type MediaBlock = { heading?: string; text?: string; items?: string[] };

export type MediaRubrique = {
  slug: string;
  letter: string;
  title: string;
  tagline: string;
  intro: string[];
  blocks: MediaBlock[];
  closing?: string;
  heroImage: string;
  cardImage: string;
  ctaLabel: string;
  ctaTo: string;
};

// 20 images uniques - références africaines & univers média.
const IMG = {
  introHero: "https://images.unsplash.com/photo-1743540039538-2b2055db2868?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxBZnJpY2FuJTIwZ3Jpb3QlMjBzdG9yeXRlbGxlciUyMGVsZGVyJTIwb3JhbCUyMHRyYWRpdGlvbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc4MjgwMjYzMnww&ixlib=rb-4.1.0&q=80&w=1080",
  introSecondary: "https://images.unsplash.com/photo-1714229519448-bd6818424912?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxBZnJpY2FuJTIwcm95YWwlMjBoZXJpdGFnZSUyMHBhbGFjZSUyMGN1bHR1cmUlMjBjZXJlbW9ueSUyMG1hc3RlcnBpZWNlfGVufDF8fHx8MTc4MjgwMjY1MXww&ixlib=rb-4.1.0&q=80&w=1080",
  podcastsCard: "https://images.unsplash.com/photo-1531651008558-ed1740375b39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxwb2RjYXN0JTIwbWljcm9waG9uZSUyMHJlY29yZGluZyUyMHN0dWRpbyUyMGludGVydmlld3xlbnwxfHx8fDE3ODI4MDI2NDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  podcastsHero: "https://images.unsplash.com/photo-1603085356448-6857558a32b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxBZnJpY2FuJTIwZ3Jpb3QlMjBzdG9yeXRlbGxlciUyMGVsZGVyJTIwb3JhbCUyMHRyYWRpdGlvbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc4MjgwMjYzMnww&ixlib=rb-4.1.0&q=80&w=1080",
  parcoursCard: "https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxwb2RjYXN0JTIwbWljcm9waG9uZSUyMHJlY29yZGluZyUyMHN0dWRpbyUyMGludGVydmlld3xlbnwxfHx8fDE3ODI4MDI2NDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  parcoursHero: "https://images.unsplash.com/photo-1645213576807-9e659d072b5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxBZnJpY2FuJTIwZ3Jpb3QlMjBzdG9yeXRlbGxlciUyMGVsZGVyJTIwb3JhbCUyMHRyYWRpdGlvbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc4MjgwMjYzMnww&ixlib=rb-4.1.0&q=80&w=1080",
  seriesCard: "https://images.unsplash.com/photo-1505919188707-d808b7bd5785?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudGFyeSUyMGZpbG0lMjBjYW1lcmElMjBjcmV3JTIwZmlsbWluZyUyMEFmcmljYXxlbnwxfHx8fDE3ODI4MDI2NDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  seriesHero: "https://images.unsplash.com/photo-1735032726027-3e6c26f2ece8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxkb2N1bWVudGFyeSUyMGZpbG0lMjBjYW1lcmElMjBjcmV3JTIwZmlsbWluZyUyMEFmcmljYXxlbnwxfHx8fDE3ODI4MDI2NDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  editoCard: "https://images.unsplash.com/photo-1501618669935-18b6ecb13d6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3cml0aW5nJTIwbm90ZWJvb2slMjBkZXNrJTIwbWFudXNjcmlwdCUyMGVkaXRvcmlhbCUyMGpvdXJuYWxpc3R8ZW58MXx8fHwxNzgyODAyNjQxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  editoHero: "https://images.unsplash.com/photo-1637263492665-9dadcac6089f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHx3cml0aW5nJTIwbm90ZWJvb2slMjBkZXNrJTIwbWFudXNjcmlwdCUyMGVkaXRvcmlhbCUyMGpvdXJuYWxpc3R8ZW58MXx8fHwxNzgyODAyNjQxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  dossiersCard: "https://images.unsplash.com/photo-1531346644014-cde582069e71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHx3cml0aW5nJTIwbm90ZWJvb2slMjBkZXNrJTIwbWFudXNjcmlwdCUyMGVkaXRvcmlhbCUyMGpvdXJuYWxpc3R8ZW58MXx8fHwxNzgyODAyNjQxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  dossiersHero: "https://images.unsplash.com/photo-1603058817990-2b9a9abbce86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWJyYXJ5JTIwYm9va3NoZWxmJTIwYXJjaGl2ZSUyMGNvbGxlY3Rpb24lMjBib29rcyUyMHJlYWRpbmd8ZW58MXx8fHwxNzgyODAyNjUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  mediathequeCard: "https://images.unsplash.com/photo-1760404699858-e82e12a266cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWxtJTIwYXJjaGl2ZSUyMHJlZWxzJTIwdmlkZW8lMjBlZGl0aW5nJTIwbWVkaWElMjBsaWJyYXJ5JTIwc2NyZWVuc3xlbnwxfHx8fDE3ODI4MDI2NDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  mediathequeHero: "https://images.unsplash.com/photo-1776572116885-602508c52b4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxmaWxtJTIwYXJjaGl2ZSUyMHJlZWxzJTIwdmlkZW8lMjBlZGl0aW5nJTIwbWVkaWElMjBsaWJyYXJ5JTIwc2NyZWVuc3xlbnwxfHx8fDE3ODI4MDI2NDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  chroniquesCard: "https://images.unsplash.com/photo-1659645006849-97168e342f83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxBZnJpY2FuJTIwZ3Jpb3QlMjBzdG9yeXRlbGxlciUyMGVsZGVyJTIwb3JhbCUyMHRyYWRpdGlvbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc4MjgwMjYzMnww&ixlib=rb-4.1.0&q=80&w=1080",
  chroniquesHero: "https://images.unsplash.com/photo-1767929820565-1f82e8d7b66f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxBZnJpY2FuJTIwcm95YWwlMjBoZXJpdGFnZSUyMHBhbGFjZSUyMGN1bHR1cmUlMjBjZXJlbW9ueSUyMG1hc3RlcnBpZWNlfGVufDF8fHx8MTc4MjgwMjY1MXww&ixlib=rb-4.1.0&q=80&w=1080",
  temoignagesCard: "https://images.unsplash.com/photo-1495802515684-de80695df90e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwZ3Jpb3QlMjBzdG9yeXRlbGxlciUyMGVsZGVyJTIwb3JhbCUyMHRyYWRpdGlvbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc4MjgwMjYzMnww&ixlib=rb-4.1.0&q=80&w=1080",
  temoignagesHero: "https://images.unsplash.com/photo-1714229519446-fd7b491a3530?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxBZnJpY2FuJTIwcm95YWwlMjBoZXJpdGFnZSUyMHBhbGFjZSUyMGN1bHR1cmUlMjBjZXJlbW9ueSUyMG1hc3RlcnBpZWNlfGVufDF8fHx8MTc4MjgwMjY1MXww&ixlib=rb-4.1.0&q=80&w=1080",
  collectionsCard: "https://images.unsplash.com/photo-1625053376622-e462848c453f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxsaWJyYXJ5JTIwYm9va3NoZWxmJTIwYXJjaGl2ZSUyMGNvbGxlY3Rpb24lMjBib29rcyUyMHJlYWRpbmd8ZW58MXx8fHwxNzgyODAyNjUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  collectionsHero: "https://images.unsplash.com/photo-1722977735215-d28f2ac6efba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxsaWJyYXJ5JTIwYm9va3NoZWxmJTIwYXJjaGl2ZSUyMGNvbGxlY3Rpb24lMjBib29rcyUyMHJlYWRpbmd8ZW58MXx8fHwxNzgyODAyNjUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
} as const;

export const MEDIA_INTRO = {
  eyebrow: "Le grand média culturel",
  title: "Podcasts Griots, Éditoriaux, Médias et Transmission des Savoirs",
  tagline:
    "Une bibliothèque vivante où la voix des maîtres devient un héritage partagé.",
  image: IMG.introHero,
  secondaryImage: IMG.introSecondary,
  paragraphs: [
    "Cette rubrique constitue le grand média culturel d'IPPOO KRAAFT. Elle a pour vocation de documenter, préserver, diffuser et transmettre les savoirs des artisans, des artistes, des chercheurs, des historiens, des gardiens de traditions et des détenteurs de patrimoines vivants. Elle transforme chaque témoignage, chaque démonstration, chaque parcours professionnel et chaque création en une ressource pédagogique accessible au plus grand nombre.",
    "L'ensemble des contenus est organisé de manière thématique afin de constituer une bibliothèque vivante des métiers d'art, des cultures et des patrimoines.",
  ],
};

export const mediaRubriques: MediaRubrique[] = [
  {
    slug: "podcasts-griots",
    letter: "A",
    title: "Podcasts Griots",
    tagline: "La voix des maîtres, transmise comme au temps des griots.",
    intro: [
      "Conformément aux orientations du projet, les podcasts deviennent la signature éditoriale d'IPPOO KRAAFT.",
      "À l'image du rôle historique des griots dans la transmission de la mémoire, chaque émission met en lumière un artisan, un artiste, un chercheur, un maître d'art ou une personnalité culturelle.",
      "Chaque invité présente son univers, son parcours, ses inspirations, son métier, ses réalisations, les valeurs qui animent son travail ainsi que sa vision de l'évolution des métiers d'art.",
      "Les échanges permettent également d'établir des passerelles avec d'autres disciplines afin de montrer que chaque métier s'enrichit au contact des autres savoir-faire.",
    ],
    blocks: [
      {
        heading: "Rubriques des Podcasts Griots",
        items: [
          "Portraits de maîtres d'art",
          "Histoires de familles artisanales",
          "Les gardiens des traditions",
          "Les créateurs contemporains",
          "Les innovations inspirées des patrimoines",
          "Les métiers rares",
          "Les métiers en renaissance",
          "Les grandes œuvres artisanales",
          "Les patrimoines vivants",
          "Les femmes des métiers d'art",
          "Les jeunes talents",
          "Les chercheurs et historiens",
          "Les architectes",
          "Les designers",
          "Les collectionneurs",
          "Les restaurateurs du patrimoine",
          "Les conservateurs",
          "Les enseignants",
          "Les voyageurs culturels",
        ],
      },
    ],
    heroImage: IMG.podcastsHero,
    cardImage: IMG.podcastsCard,
    ctaLabel: "Devenir invité d'un épisode",
    ctaTo: "/contact",
  },
  {
    slug: "parcours-invite",
    letter: "B",
    title: "Le Parcours d'un Invité",
    tagline: "Un récit de vie, du tout premier geste à la vision d'avenir.",
    intro: [
      "Chaque épisode suit une structure commune permettant de documenter l'ensemble des dimensions du métier présenté.",
    ],
    blocks: [
      {
        heading: "Présentation personnelle",
        items: [
          "Parcours",
          "Origines",
          "Formation",
          "Premières expériences",
          "Rencontres marquantes",
          "Transmission familiale",
        ],
      },
      {
        heading: "Le métier",
        text: "L'invité présente :",
        items: [
          "son domaine d'activité ;",
          "ses spécialités ;",
          "ses techniques ;",
          "ses matériaux ;",
          "ses outils ;",
          "ses méthodes de travail ;",
          "ses réalisations.",
        ],
      },
      {
        heading: "Les sources d'inspiration",
        text: "Une rubrique entière est consacrée aux inspirations de chaque créateur. Elle développe :",
        items: [
          "les influences artistiques ;",
          "les influences culturelles ;",
          "les maîtres qui ont marqué son parcours ;",
          "les œuvres de référence ;",
          "les traditions qui nourrissent sa créativité ;",
          "les innovations qui stimulent son évolution.",
        ],
      },
      {
        text: "Cette partie répond directement à la volonté d'accorder une place importante aux muses, aux influences et aux écoles artistiques.",
      },
      {
        heading: "Regards sur les autres disciplines",
        text: "Chaque invité est amené à partager son regard sur les autres métiers d'art. Cette approche favorise le dialogue entre les différentes professions et encourage les collaborations interdisciplinaires.",
      },
      {
        heading: "Vision d'avenir",
        text: "L'invité présente :",
        items: [
          "les défis de son métier ;",
          "les évolutions souhaitées ;",
          "les opportunités ;",
          "les nouvelles technologies ;",
          "la transmission aux jeunes générations ;",
          "les coopérations internationales.",
        ],
      },
    ],
    heroImage: IMG.parcoursHero,
    cardImage: IMG.parcoursCard,
    ctaLabel: "Proposer un invité",
    ctaTo: "/contact",
  },
  {
    slug: "series-documentaires",
    letter: "C",
    title: "Les Grandes Séries Documentaires",
    tagline: "Des sagas filmées au cœur des patrimoines vivants.",
    intro: ["Des séries de longue durée sont consacrées à des thématiques majeures."],
    blocks: [
      {
        heading: "Les grandes familles artisanales d'Afrique",
        text: "Présentation des lignées ayant transmis leurs savoir-faire sur plusieurs générations.",
      },
      {
        heading: "Les royaumes bâtisseurs",
        text: "Découverte des ateliers royaux, des artisans des palais et des grandes traditions de cour.",
      },
      {
        heading: "Les patrimoines vivants",
        text: "Immersion dans les communautés qui perpétuent les métiers ancestraux.",
      },
      {
        heading: "Les matériaux du patrimoine",
        text: "Chaque épisode explore un matériau particulier.",
        items: [
          "bois ;",
          "bronze ;",
          "cuivre ;",
          "cuir ;",
          "pierre ;",
          "textile ;",
          "raphia ;",
          "argile ;",
          "pigments naturels ;",
          "fibres végétales.",
        ],
      },
      {
        heading: "Les chefs-d'œuvre de l'artisanat africain",
        text: "Analyse des œuvres les plus emblématiques produites à travers le continent.",
      },
    ],
    heroImage: IMG.seriesHero,
    cardImage: IMG.seriesCard,
    ctaLabel: "Explorer les galeries",
    ctaTo: "/galeries",
  },
  {
    slug: "editoriaux",
    letter: "D",
    title: "Les Éditoriaux",
    tagline: "Des analyses de référence pour comprendre en profondeur.",
    intro: [
      "Les éditoriaux approfondissent les grands sujets liés aux patrimoines culturels.",
      "Ils permettent de publier régulièrement des analyses développées sur :",
    ],
    blocks: [
      {
        items: [
          "les métiers ;",
          "les traditions ;",
          "les innovations ;",
          "les influences internationales ;",
          "les évolutions technologiques ;",
          "les échanges culturels ;",
          "les patrimoines immatériels ;",
          "les nouveaux usages.",
        ],
      },
      {
        text: "Contrairement aux articles d'actualité, les éditoriaux constituent des contenus de référence destinés à enrichir progressivement la bibliothèque documentaire du portail.",
      },
    ],
    heroImage: IMG.editoHero,
    cardImage: IMG.editoCard,
    ctaLabel: "Lire le blog",
    ctaTo: "/blog",
  },
  {
    slug: "dossiers-thematiques",
    letter: "E",
    title: "Les Dossiers Thématiques",
    tagline: "Un sujet, exploré sous toutes ses facettes.",
    intro: ["Chaque dossier rassemble plusieurs contenus autour d'une même problématique."],
    blocks: [
      {
        heading: "Exemples",
        items: [
          "L'histoire de la ferronnerie d'art africaine",
          "Les coiffures traditionnelles à travers les siècles",
          "Les coiffes royales",
          "Les tambours parlants",
          "Les griots",
          "Les routes du bronze",
          "Les arts textiles",
          "Les traditions des palais royaux",
          "Les familles artisanales",
          "Les métiers sacrés",
          "Les métiers des femmes",
          "Les métiers des cours royales",
          "Les patrimoines en renaissance",
        ],
      },
    ],
    heroImage: IMG.dossiersHero,
    cardImage: IMG.dossiersCard,
    ctaLabel: "Découvrir les métiers",
    ctaTo: "/metiers",
  },
  {
    slug: "bibliotheque-audiovisuelle",
    letter: "F",
    title: "La Bibliothèque Audiovisuelle",
    tagline: "Une médiathèque vivante, indexée et accessible à tous.",
    intro: ["Cette médiathèque rassemble tous les contenus produits par la plateforme.", "Elle comprend :"],
    blocks: [
      {
        items: [
          "Podcasts",
          "Documentaires",
          "Interviews",
          "Conférences",
          "Démonstrations",
          "Films pédagogiques",
          "Témoignages",
          "Captations d'événements",
          "Masterclass",
          "Ateliers filmés",
          "Archives sonores",
          "Archives vidéo",
        ],
      },
      {
        text: "Chaque contenu est indexé par métier, spécialité, matériau, pays, ethnie, famille artisanale et période historique.",
      },
    ],
    heroImage: IMG.mediathequeHero,
    cardImage: IMG.mediathequeCard,
    ctaLabel: "Voir les salons & rencontres",
    ctaTo: "/salons",
  },
  {
    slug: "chroniques-culturelles",
    letter: "G",
    title: "Les Chroniques Culturelles",
    tagline: "Le rendez-vous quotidien avec la culture artisanale.",
    intro: ["Cette rubrique propose des publications régulières consacrées à des sujets variés.", "Parmi les thématiques :"],
    blocks: [
      {
        items: [
          "une œuvre remarquable ;",
          "un artisan à découvrir ;",
          "une famille artisanale ;",
          "un matériau ;",
          "une technique ;",
          "une région ;",
          "une tradition ;",
          "une innovation ;",
          "une personnalité historique ;",
          "une exposition.",
        ],
      },
      { text: "Ces chroniques enrichissent quotidiennement la plateforme." },
    ],
    heroImage: IMG.chroniquesHero,
    cardImage: IMG.chroniquesCard,
    ctaLabel: "Explorer Arts & culture",
    ctaTo: "/arts-culture",
  },
  {
    slug: "temoignages",
    letter: "H",
    title: "Les Témoignages",
    tagline: "La mémoire vivante, racontée par ceux qui la font.",
    intro: [
      "Les artisans, les anciens apprentis, les chercheurs, les visiteurs et les partenaires peuvent partager leurs expériences.",
      "Les témoignages sont classés selon :",
    ],
    blocks: [
      {
        items: [
          "le métier ;",
          "la région ;",
          "le pays ;",
          "la formation suivie ;",
          "le stage réalisé ;",
          "le concours ;",
          "l'exposition ;",
          "la résidence artistique ;",
          "la transmission familiale.",
        ],
      },
      { text: "Ils constituent une mémoire vivante des métiers d'art." },
    ],
    heroImage: IMG.temoignagesHero,
    cardImage: IMG.temoignagesCard,
    ctaLabel: "Partager mon témoignage",
    ctaTo: "/contact",
  },
  {
    slug: "collections-editoriales",
    letter: "I",
    title: "Les Collections Éditoriales",
    tagline: "De grandes collections pour un patrimoine éditorial durable.",
    intro: ["L'ensemble des contenus est regroupé dans de grandes collections permanentes."],
    blocks: [
      {
        heading: "Exemples",
        items: [
          "Les Maîtres d'Art",
          "Les Héritiers des Traditions",
          "Les Arts Royaux",
          "Les Routes des Patrimoines",
          "Les Femmes de Savoir-Faire",
          "Les Générations Créatives",
          "Les Arts Sacrés",
          "Les Matériaux d'Exception",
          "Les Grandes Civilisations Artisanales",
          "Les Dialogues des Cultures",
          "Les Innovations Patrimoniales",
          "Les Patrimoines Vivants d'Afrique",
        ],
      },
    ],
    closing:
      "Ces collections facilitent la navigation, renforcent la valeur documentaire de la plateforme et créent un patrimoine éditorial durable. Elles font d'IPPOO KRAAFT un véritable centre de référence où la parole des artisans, des artistes et des détenteurs de savoirs devient une ressource essentielle pour la transmission des connaissances aux générations présentes et futures.",
    heroImage: IMG.collectionsHero,
    cardImage: IMG.collectionsCard,
    ctaLabel: "Découvrir le répertoire",
    ctaTo: "/repertoire",
  },
];

export function getMediaRubrique(slug: string): MediaRubrique | undefined {
  return mediaRubriques.find((r) => r.slug === slug);
}
