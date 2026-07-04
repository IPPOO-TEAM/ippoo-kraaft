// Centre de Recherche, Conservation, Sauvegarde et Valorisation des Patrimoines.
// Contenu repris intégralement (verbatim) depuis la source éditoriale IPPOO KRAAFT,
// enrichi de formulations captivantes et de CTA orientés visiteurs/lecteurs.
//
// RÈGLE STRICTE : chaque image est UNIQUE (aucune image utilisée deux fois, ni ici,
// ni ailleurs dans l'application).

export type PatrimoineBlock = { heading?: string; text?: string; items?: string[] };

export type PatrimoineSection = {
  slug: string;
  letter: string;
  title: string;
  tagline: string;
  intro: string[];
  blocks: PatrimoineBlock[];
  closing?: string;
  heroImage: string;
  cardImage: string;
  ctaLabel: string;
  ctaTo: string;
};

// 22 images uniques (manuscrits africains, ateliers, musées, cartes, royautés).
const IMG = {
  introHero: "https://images.unsplash.com/photo-1613937855439-20cecc75d91a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxBZnJpY2FuJTIwbWFudXNjcmlwdCUyMGFyY2hpdmUlMjBhbmNpZW50JTIwZG9jdW1lbnQlMjBzY2hvbGFyJTIwcmVzZWFyY2h8ZW58MXx8fHwxNzgyODA1MDg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  introSecondary: "https://images.unsplash.com/photo-1759134335060-9ae159bc3e12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHxBZnJpY2FuJTIwbWFudXNjcmlwdCUyMGFyY2hpdmUlMjBhbmNpZW50JTIwZG9jdW1lbnQlMjBzY2hvbGFyJTIwcmVzZWFyY2h8ZW58MXx8fHwxNzgyODA1MDg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  docHero: "https://images.unsplash.com/photo-1467688695332-6b486449d78f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwbWFudXNjcmlwdCUyMGFyY2hpdmUlMjBhbmNpZW50JTIwZG9jdW1lbnQlMjBzY2hvbGFyJTIwcmVzZWFyY2h8ZW58MXx8fHwxNzgyODA1MDg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  docCard: "https://images.unsplash.com/photo-1702753390015-d4abffb87306?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxBZnJpY2FuJTIwbWFudXNjcmlwdCUyMGFyY2hpdmUlMjBhbmNpZW50JTIwZG9jdW1lbnQlMjBzY2hvbGFyJTIwcmVzZWFyY2h8ZW58MXx8fHwxNzgyODA1MDg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  vivantsHero: "https://images.unsplash.com/photo-1638437288045-b39cd19e0e3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHxBZnJpY2FuJTIwYXJ0aXNhbiUyMGVsZGVyJTIwaGFuZHMlMjB0cmFkaXRpb24lMjBoZXJpdGFnZSUyMHRyYW5zbWlzc2lvbnxlbnwxfHx8fDE3ODI4MDUwODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  vivantsCard: "https://images.unsplash.com/photo-1717700299773-1accc14b67f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxBZnJpY2ElMjBtYXAlMjBjYXJ0b2dyYXBoeSUyMGdlb2dyYXBoeSUyMHRlcnJpdG9yeSUyMHNhdGVsbGl0ZXxlbnwxfHx8fDE3ODI4MDUwOTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  collectionsHero: "https://images.unsplash.com/photo-1699537966932-56a36a45c704?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNldW0lMjBleGhpYml0aW9uJTIwcmVzdG9yYXRpb24lMjBjb25zZXJ2YXRpb24lMjBsYWJvcmF0b3J5JTIwYXJ0aWZhY3R8ZW58MXx8fHwxNzgyODA1MDg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  collectionsCard: "https://images.unsplash.com/photo-1646731187231-6211a0021a3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxtdXNldW0lMjBleGhpYml0aW9uJTIwcmVzdG9yYXRpb24lMjBjb25zZXJ2YXRpb24lMjBsYWJvcmF0b3J5JTIwYXJ0aWZhY3R8ZW58MXx8fHwxNzgyODA1MDg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  maitresHero: "https://images.unsplash.com/photo-1626695436755-3e288720849c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxBZnJpY2ElMjBtYXAlMjBjYXJ0b2dyYXBoeSUyMGdlb2dyYXBoeSUyMHRlcnJpdG9yeSUyMHNhdGVsbGl0ZXxlbnwxfHx8fDE3ODI4MDUwOTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  maitresCard: "https://images.unsplash.com/photo-1553891918-d0c05703a290?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxBZnJpY2FuJTIwYXJ0aXNhbiUyMGVsZGVyJTIwaGFuZHMlMjB0cmFkaXRpb24lMjBoZXJpdGFnZSUyMHRyYW5zbWlzc2lvbnxlbnwxfHx8fDE3ODI4MDUwODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  languesHero: "https://images.unsplash.com/photo-1655923478826-ef7c2d40820e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxBZnJpY2FuJTIwbWFudXNjcmlwdCUyMGFyY2hpdmUlMjBhbmNpZW50JTIwZG9jdW1lbnQlMjBzY2hvbGFyJTIwcmVzZWFyY2h8ZW58MXx8fHwxNzgyODA1MDg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  languesCard: "https://images.unsplash.com/photo-1734357288506-5271d99f306c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxBZnJpY2FuJTIwbWFudXNjcmlwdCUyMGFyY2hpdmUlMjBhbmNpZW50JTIwZG9jdW1lbnQlMjBzY2hvbGFyJTIwcmVzZWFyY2h8ZW58MXx8fHwxNzgyODA1MDg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  orauxHero: "https://images.unsplash.com/photo-1548781403-3b50cd4ba437?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwYXJ0aXNhbiUyMGVsZGVyJTIwaGFuZHMlMjB0cmFkaXRpb24lMjBoZXJpdGFnZSUyMHRyYW5zbWlzc2lvbnxlbnwxfHx8fDE3ODI4MDUwODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  orauxCard: "https://images.unsplash.com/photo-1588359550122-dbda13f6c451?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxBZnJpY2FuJTIwYXJ0aXNhbiUyMGVsZGVyJTIwaGFuZHMlMjB0cmFkaXRpb24lMjBoZXJpdGFnZSUyMHRyYW5zbWlzc2lvbnxlbnwxfHx8fDE3ODI4MDUwODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  laboHero: "https://images.unsplash.com/photo-1569943702614-5885fb9d55a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxtdXNldW0lMjBleGhpYml0aW9uJTIwcmVzdG9yYXRpb24lMjBjb25zZXJ2YXRpb24lMjBsYWJvcmF0b3J5JTIwYXJ0aWZhY3R8ZW58MXx8fHwxNzgyODA1MDg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  laboCard: "https://images.unsplash.com/photo-1759148414923-5206d1affd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxtdXNldW0lMjBleGhpYml0aW9uJTIwcmVzdG9yYXRpb24lMjBjb25zZXJ2YXRpb24lMjBsYWJvcmF0b3J5JTIwYXJ0aWZhY3R8ZW58MXx8fHwxNzgyODA1MDg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  cartesHero: "https://images.unsplash.com/photo-1649299313612-48cc3493f62e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2ElMjBtYXAlMjBjYXJ0b2dyYXBoeSUyMGdlb2dyYXBoeSUyMHRlcnJpdG9yeSUyMHNhdGVsbGl0ZXxlbnwxfHx8fDE3ODI4MDUwOTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  cartesCard: "https://images.unsplash.com/photo-1717700299939-a639b381024b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxBZnJpY2ElMjBtYXAlMjBjYXJ0b2dyYXBoeSUyMGdlb2dyYXBoeSUyMHRlcnJpdG9yeSUyMHNhdGVsbGl0ZXxlbnwxfHx8fDE3ODI4MDUwOTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  sauvegardeHero: "https://images.unsplash.com/photo-1664090019571-1f14aa812404?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxBZnJpY2FuJTIwYXJ0aXNhbiUyMGVsZGVyJTIwaGFuZHMlMjB0cmFkaXRpb24lMjBoZXJpdGFnZSUyMHRyYW5zbWlzc2lvbnxlbnwxfHx8fDE3ODI4MDUwODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  sauvegardeCard: "https://images.unsplash.com/photo-1752038048551-c8bb46d7a87b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxBZnJpY2FuJTIwbWFudXNjcmlwdCUyMGFyY2hpdmUlMjBhbmNpZW50JTIwZG9jdW1lbnQlMjBzY2hvbGFyJTIwcmVzZWFyY2h8ZW58MXx8fHwxNzgyODA1MDg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  fondsHero: "https://images.unsplash.com/photo-1547468083-87557f2ca915?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxBZnJpY2FuJTIwbWFudXNjcmlwdCUyMGFyY2hpdmUlMjBhbmNpZW50JTIwZG9jdW1lbnQlMjBzY2hvbGFyJTIwcmVzZWFyY2h8ZW58MXx8fHwxNzgyODA1MDg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  fondsCard: "https://images.unsplash.com/photo-1755449476065-c53e957cb097?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHxtdXNldW0lMjBleGhpYml0aW9uJTIwcmVzdG9yYXRpb24lMjBjb25zZXJ2YXRpb24lMjBsYWJvcmF0b3J5JTIwYXJ0aWZhY3R8ZW58MXx8fHwxNzgyODA1MDg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
} as const;

export const PATRIMOINE_INTRO = {
  eyebrow: "Centre de Recherche & Conservation",
  title:
    "Centre de Recherche, Conservation, Sauvegarde et Valorisation des Patrimoines",
  tagline:
    "Une plateforme de référence pour étudier, conserver et transmettre les héritages d'Afrique.",
  image: IMG.introHero,
  secondaryImage: IMG.introSecondary,
  paragraphs: [
    "Cette rubrique fait d'IPPOO KRAAFT une plateforme de référence consacrée à l'étude, à la documentation, à la conservation, à la transmission et à la valorisation des patrimoines matériels et immatériels. Elle rassemble les connaissances issues des communautés, des maîtres d'art, des chercheurs, des universités, des institutions culturelles et des détenteurs des traditions afin de constituer une mémoire durable des savoir-faire africains.",
    "Le Centre de Recherche accompagne également les artisans dans la compréhension de leurs héritages, dans la documentation de leurs pratiques et dans la création de nouvelles connaissances accessibles aux générations futures.",
  ],
};

export const patrimoineSections: PatrimoineSection[] = [
  {
    slug: "centre-documentation",
    letter: "A",
    title: "Le Centre de Documentation Patrimoniale",
    tagline: "Une mémoire écrite, indexée et accessible à toutes les recherches.",
    intro: [
      "Cette section rassemble toutes les ressources documentaires relatives aux métiers d'art, aux patrimoines culturels et aux expressions artistiques.",
      "Elle comprend notamment :",
    ],
    blocks: [
      {
        items: [
          "Archives historiques",
          "Manuscrits",
          "Livres",
          "Publications scientifiques",
          "Revues spécialisées",
          "Thèses",
          "Mémoires universitaires",
          "Rapports de recherche",
          "Inventaires patrimoniaux",
          "Catalogues d'exposition",
          "Monographies",
          "Cartes historiques",
          "Chronologies",
          "Généalogies",
          "Bibliographies",
          "Glossaires spécialisés",
          "Dictionnaires des métiers d'art",
        ],
      },
      {
        text: "Chaque ressource est indexée par pays, région, ethnie, métier, matériau, période historique et thématique.",
      },
    ],
    heroImage: IMG.docHero,
    cardImage: IMG.docCard,
    ctaLabel: "Consulter le blog & les éditoriaux",
    ctaTo: "/blog",
  },
  {
    slug: "inventaire-patrimoines-vivants",
    letter: "B",
    title: "L'Inventaire des Patrimoines Vivants",
    tagline: "Un inventaire évolutif, alimenté par les communautés elles-mêmes.",
    intro: [
      "Cette rubrique établit un inventaire permanent des savoir-faire encore pratiqués dans les communautés.",
      "Chaque patrimoine vivant fait l'objet d'une fiche détaillée présentant :",
    ],
    blocks: [
      {
        items: [
          "Son origine",
          "Son histoire",
          "Les communautés qui le pratiquent",
          "Les conditions de transmission",
          "Les matériaux utilisés",
          "Les techniques de fabrication",
          "Les outils traditionnels",
          "Les usages",
          "Les cérémonies associées",
          "Les évolutions contemporaines",
          "Les initiatives de sauvegarde",
          "Les possibilités de formation",
          "Les démonstrations disponibles",
          "Les ressources documentaires",
        ],
      },
      {
        text: "Cet inventaire constitue une base évolutive alimentée par les communautés elles-mêmes et par les partenaires scientifiques.",
      },
    ],
    heroImage: IMG.vivantsHero,
    cardImage: IMG.vivantsCard,
    ctaLabel: "Découvrir les groupements",
    ctaTo: "/groupements",
  },
  {
    slug: "collections-patrimoniales",
    letter: "C",
    title: "Les Collections Patrimoniales",
    tagline: "Royales, sacrées, communautaires ou artistiques : un patrimoine documenté.",
    intro: [
      "Cette rubrique rassemble les œuvres et les objets documentés sur la plateforme.",
      "Les collections sont organisées selon plusieurs catégories :",
    ],
    blocks: [
      {
        heading: "Collections royales",
        text: "Objets de pouvoir, insignes, sceptres, trônes, couronnes, sièges cérémoniels, armes de prestige, tambours royaux et objets protocolaires.",
      },
      {
        heading: "Collections religieuses et cultuelles",
        text: "Objets cérémoniels, sculptures sacrées, autels, masques, instruments rituels, objets de procession et éléments symboliques liés aux pratiques spirituelles.",
      },
      {
        heading: "Collections communautaires",
        text: "Objets de la vie quotidienne, artisanat domestique, mobilier, ustensiles, vêtements, bijoux, outils agricoles, objets de pêche et créations utilitaires.",
      },
      {
        heading: "Collections artistiques",
        text: "Sculptures, peintures, gravures, dessins, œuvres contemporaines inspirées des traditions et créations innovantes.",
      },
    ],
    heroImage: IMG.collectionsHero,
    cardImage: IMG.collectionsCard,
    ctaLabel: "Parcourir les galeries",
    ctaTo: "/galeries",
  },
  {
    slug: "grands-maitres",
    letter: "D",
    title: "Les Grands Maîtres du Patrimoine",
    tagline: "Hommage aux personnalités qui ont marqué l'histoire des métiers d'art.",
    intro: [
      "Cette rubrique rend hommage aux personnalités qui ont marqué l'histoire des métiers d'art.",
      "Chaque personnalité dispose d'une biographie complète comprenant :",
    ],
    blocks: [
      {
        items: [
          "Son parcours",
          "Son domaine d'excellence",
          "Ses œuvres majeures",
          "Ses innovations",
          "Ses élèves",
          "Son influence",
          "Les distinctions reçues",
          "Les témoignages",
          "Les archives disponibles",
          "Les publications consacrées à son travail",
        ],
      },
      {
        text: "Une attention particulière est accordée aux grandes familles artisanales dont les savoir-faire se transmettent depuis plusieurs générations.",
      },
    ],
    heroImage: IMG.maitresHero,
    cardImage: IMG.maitresCard,
    ctaLabel: "Voir le répertoire des artisans",
    ctaTo: "/repertoire",
  },
  {
    slug: "langues-metiers",
    letter: "E",
    title: "Les Langues des Métiers d'Art",
    tagline: "Préserver les mots, c'est préserver les gestes.",
    intro: [
      "Les patrimoines artisanaux sont intimement liés aux langues locales.",
      "Cette rubrique documente :",
    ],
    blocks: [
      {
        items: [
          "Les terminologies traditionnelles",
          "Les noms des outils",
          "Les noms des matériaux",
          "Les noms des techniques",
          "Les expressions professionnelles",
          "Les proverbes",
          "Les chants de travail",
          "Les récits initiatiques",
          "Les vocabulaires spécialisés",
          "Les traductions multilingues",
        ],
      },
      {
        text: "Chaque terme est replacé dans son contexte culturel afin de préserver toute sa richesse sémantique.",
      },
    ],
    heroImage: IMG.languesHero,
    cardImage: IMG.languesCard,
    ctaLabel: "Explorer les métiers",
    ctaTo: "/metiers",
  },
  {
    slug: "savoirs-oraux",
    letter: "F",
    title: "Les Savoirs Oraux",
    tagline: "La parole vivante, gardienne des connaissances.",
    intro: ["Cette section valorise les connaissances transmises oralement.", "Elle comprend :"],
    blocks: [
      {
        items: [
          "Témoignages",
          "Contes",
          "Épopées",
          "Chants",
          "Proverbes",
          "Devinettes",
          "Histoires familiales",
          "Généalogies",
          "Récits de fondation",
          "Chroniques communautaires",
          "Enseignements initiatiques",
        ],
      },
      {
        text: "Les contenus peuvent être proposés sous forme de texte, d'enregistrements audio ou de vidéos afin de respecter les modes traditionnels de transmission.",
      },
    ],
    heroImage: IMG.orauxHero,
    cardImage: IMG.orauxCard,
    ctaLabel: "Écouter les Podcasts Griots",
    ctaTo: "/medias/podcasts-griots",
  },
  {
    slug: "laboratoire-conservation",
    letter: "G",
    title: "Le Laboratoire de Conservation et de Restauration",
    tagline: "La science au service de la pérennité des œuvres.",
    intro: [
      "Cette rubrique présente les techniques permettant de préserver les œuvres et les objets patrimoniaux.",
      "Elle développe les domaines suivants :",
    ],
    blocks: [
      {
        items: [
          "Diagnostic des œuvres",
          "Conservation préventive",
          "Conservation curative",
          "Nettoyage",
          "Stabilisation",
          "Documentation scientifique",
          "Analyse des matériaux",
          "Étude des pigments",
          "Étude des essences de bois",
          "Étude des alliages métalliques",
          "Techniques de restauration",
          "Reconstitution documentaire",
          "Numérisation des collections",
        ],
      },
      {
        text: "Les laboratoires collaborent avec les musées, les universités, les centres de recherche et les artisans spécialisés.",
      },
    ],
    heroImage: IMG.laboHero,
    cardImage: IMG.laboCard,
    ctaLabel: "Nous contacter pour un partenariat",
    ctaTo: "/contact",
  },
  {
    slug: "cartes-interactives",
    letter: "H",
    title: "Les Cartes Interactives du Patrimoine",
    tagline: "Une géographie vivante des savoir-faire africains.",
    intro: ["Le portail propose des cartes dynamiques permettant de localiser :"],
    blocks: [
      {
        items: [
          "Les villages artisanaux",
          "Les ateliers",
          "Les palais",
          "Les musées",
          "Les centres de formation",
          "Les sites historiques",
          "Les lieux de production",
          "Les marchés spécialisés",
          "Les itinéraires culturels",
          "Les festivals",
          "Les familles artisanales",
          "Les matériaux disponibles selon les territoires",
        ],
      },
      { text: "Les cartes facilitent la découverte des patrimoines et soutiennent le tourisme culturel." },
    ],
    heroImage: IMG.cartesHero,
    cardImage: IMG.cartesCard,
    ctaLabel: "Voir les circuits & villages",
    ctaTo: "/salons/villages-artisanaux",
  },
  {
    slug: "programmes-sauvegarde",
    letter: "I",
    title: "Les Programmes de Sauvegarde",
    tagline: "Agir aujourd'hui pour transmettre demain.",
    intro: [
      "Cette rubrique recense les initiatives destinées à préserver les métiers et les savoir-faire.",
      "Les programmes portent notamment sur :",
    ],
    blocks: [
      {
        items: [
          "La transmission intergénérationnelle",
          "La documentation des métiers rares",
          "L'accompagnement des derniers détenteurs de savoir-faire",
          "La création d'archives audiovisuelles",
          "La formation des jeunes générations",
          "La valorisation des métiers en renaissance",
          "La revitalisation des ateliers traditionnels",
          "La promotion des matériaux locaux",
          "La sensibilisation des communautés",
          "Les actions éducatives auprès des établissements scolaires",
        ],
      },
    ],
    heroImage: IMG.sauvegardeHero,
    cardImage: IMG.sauvegardeCard,
    ctaLabel: "Rejoindre les formations",
    ctaTo: "/formations",
  },
  {
    slug: "fonds-kraaft",
    letter: "J",
    title: "Le Fonds KRAAFT pour les Patrimoines",
    tagline: "Un mécanisme de soutien pour les projets qui font vivre les patrimoines.",
    intro: [
      "Afin d'assurer la pérennité des actions, cette rubrique présente un mécanisme de soutien destiné aux projets liés aux métiers d'art et aux patrimoines.",
      "Les interventions peuvent concerner :",
    ],
    blocks: [
      {
        items: [
          "Les projets de recherche",
          "Les publications",
          "Les expositions",
          "Les restaurations",
          "Les formations",
          "Les résidences artistiques",
          "Les équipements d'ateliers",
          "Les programmes éducatifs",
          "Les archives numériques",
          "Les actions communautaires",
          "Les innovations patrimoniales",
        ],
      },
    ],
    closing:
      "Le Fonds KRAAFT accompagne les initiatives qui contribuent à la transmission, à la valorisation et au développement durable des patrimoines culturels, tout en renforçant la coopération entre les artisans, les institutions, les communautés et les partenaires internationaux.",
    heroImage: IMG.fondsHero,
    cardImage: IMG.fondsCard,
    ctaLabel: "Déposer un projet auprès du Fonds",
    ctaTo: "/contact",
  },
];

export function getPatrimoineSection(slug: string): PatrimoineSection | undefined {
  return patrimoineSections.find((s) => s.slug === slug);
}
