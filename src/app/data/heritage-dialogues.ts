// Influence mondiale des patrimoines africains, dialogue entre les civilisations
// et laboratoires d'innovation. Contenu repris intégralement (verbatim) depuis
// la source éditoriale IPPOO KRAAFT, enrichi de formulations captivantes,
// d'accroches et de CTA.
//
// RÈGLE STRICTE : chaque image est UNIQUE (aucune image utilisée deux fois,
// ni ici, ni ailleurs dans l'application).

export type DialogueBlock = { heading?: string; text?: string; items?: string[] };

export type DialogueSection = {
  slug: string;
  letter: string;
  title: string;
  tagline: string;
  intro: string[];
  blocks: DialogueBlock[];
  closing?: string;
  heroImage: string;
  cardImage: string;
  ctaLabel: string;
  ctaTo: string;
};

// 22 images uniques - civilisations, diasporas, créations contemporaines,
// laboratoires, matériaux, numérique, recherche, coopérations, prospective.
const IMG = {
  introHero: "https://images.unsplash.com/photo-1723306744533-bed5a4f696dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWxrJTIwcm9hZCUyMHRyYWRlJTIwY2FyYXZhbiUyMGN1bHR1cmFsJTIwZXhjaGFuZ2UlMjBoaXN0b3JpYyUyMG1hcHxlbnwxfHx8fDE3ODI4MDM2NTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  introSecondary: "https://images.unsplash.com/photo-1742415105376-43d3a5fd03fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxzaWxrJTIwcm9hZCUyMHRyYWRlJTIwY2FyYXZhbiUyMGN1bHR1cmFsJTIwZXhjaGFuZ2UlMjBoaXN0b3JpYyUyMG1hcHxlbnwxfHx8fDE3ODI4MDM2NTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  dialoguesCard: "https://images.unsplash.com/photo-1553290322-0440fe3b1ddd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxzaWxrJTIwcm9hZCUyMHRyYWRlJTIwY2FyYXZhbiUyMGN1bHR1cmFsJTIwZXhjaGFuZ2UlMjBoaXN0b3JpYyUyMG1hcHxlbnwxfHx8fDE3ODI4MDM2NTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  dialoguesHero: "https://images.unsplash.com/photo-1723306008428-34d0a5c92d91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxzaWxrJTIwcm9hZCUyMHRyYWRlJTIwY2FyYXZhbiUyMGN1bHR1cmFsJTIwZXhjaGFuZ2UlMjBoaXN0b3JpYyUyMG1hcHxlbnwxfHx8fDE3ODI4MDM2NTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  diasporasCard: "https://images.unsplash.com/photo-1639002549231-a895a33c4888?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJuaXZhbCUyMHBhcmFkZSUyMGNvbG9yZnVsJTIwY29zdHVtZSUyMGRpYXNwb3JhJTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzgyODAzNjY5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  diasporasHero: "https://images.unsplash.com/photo-1742541922679-95cc82ba6c7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxjYXJuaXZhbCUyMHBhcmFkZSUyMGNvbG9yZnVsJTIwY29zdHVtZSUyMGRpYXNwb3JhJTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzgyODAzNjY5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  industriesCard: "https://images.unsplash.com/photo-1617690032354-34273b431955?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBib2xkJTIwcGF0dGVybiUyMGNvbG9yJTIwcG9ydHJhaXQlMjBzdHVkaW98ZW58MXx8fHwxNzgyODAzNjY5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  industriesHero: "https://images.unsplash.com/photo-1674156395389-2574986a9c50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxmYXNoaW9uJTIwbW9kZWwlMjBib2xkJTIwcGF0dGVybiUyMGNvbG9yJTIwcG9ydHJhaXQlMjBzdHVkaW98ZW58MXx8fHwxNzgyODAzNjY5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  laboCard: "https://images.unsplash.com/photo-1737387844704-4969421d716e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjBsYWIlMjBtYWtlciUyMHNwYWNlJTIwcHJvdG90eXBlJTIwd29ya3Nob3AlMjBjcmVhdGl2ZXxlbnwxfHx8fDE3ODI4MDM2NjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  laboHero: "https://images.unsplash.com/photo-1760446410218-b57926360c17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxkZXNpZ24lMjBsYWIlMjBtYWtlciUyMHNwYWNlJTIwcHJvdG90eXBlJTIwd29ya3Nob3AlMjBjcmVhdGl2ZXxlbnwxfHx8fDE3ODI4MDM2NjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  materiauxCard: "https://images.unsplash.com/photo-1643139880204-61fc328ca4aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMG1hdGVyaWFscyUyMG5hdHVyYWwlMjBmaWJlcnMlMjBsYWJvcmF0b3J5JTIwYmlvbWF0ZXJpYWxzfGVufDF8fHx8MTc4MjgwMzY2Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  materiauxHero: "https://images.unsplash.com/photo-1752321532314-90800e0e8c2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxzdXN0YWluYWJsZSUyMG1hdGVyaWFscyUyMG5hdHVyYWwlMjBmaWJlcnMlMjBsYWJvcmF0b3J5JTIwYmlvbWF0ZXJpYWxzfGVufDF8fHx8MTc4MjgwMzY2Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  numCard: "https://images.unsplash.com/photo-1664485033982-3028301da501?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzRCUyMHNjYW5uaW5nJTIwbXVzZXVtJTIwZGlnaXRhbCUyMGhlcml0YWdlJTIwdGVjaG5vbG9neSUyMGhvbG9ncmFtfGVufDF8fHx8MTc4MjgwMzY2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
  numHero: "https://images.unsplash.com/photo-1664485032599-b96c84f70f8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHwzRCUyMHNjYW5uaW5nJTIwbXVzZXVtJTIwZGlnaXRhbCUyMGhlcml0YWdlJTIwdGVjaG5vbG9neSUyMGhvbG9ncmFtfGVufDF8fHx8MTc4MjgwMzY2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
  etudesCard: "https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNlYXJjaCUyMGRhdGElMjBhbmFseXNpcyUyMGNoYXJ0cyUyMGNvbXBhcmF0aXZlJTIwc3R1ZHklMjBhY2FkZW1pY3xlbnwxfHx8fDE3ODI4MDM2NjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  etudesHero: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxyZXNlYXJjaCUyMGRhdGElMjBhbmFseXNpcyUyMGNoYXJ0cyUyMGNvbXBhcmF0aXZlJTIwc3R1ZHklMjBhY2FkZW1pY3xlbnwxfHx8fDE3ODI4MDM2NjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  observatoiresCard: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxyZXNlYXJjaCUyMGRhdGElMjBhbmFseXNpcyUyMGNoYXJ0cyUyMGNvbXBhcmF0aXZlJTIwc3R1ZHklMjBhY2FkZW1pY3xlbnwxfHx8fDE3ODI4MDM2NjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  observatoiresHero: "https://images.unsplash.com/photo-1611773688988-3aa5271fcd2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxzdXN0YWluYWJsZSUyMG1hdGVyaWFscyUyMG5hdHVyYWwlMjBmaWJlcnMlMjBsYWJvcmF0b3J5JTIwYmlvbWF0ZXJpYWxzfGVufDF8fHx8MTc4MjgwMzY2Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  partenariatsCard: "https://images.unsplash.com/photo-1772299399227-8840776aa3c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbG9iYWwlMjBoYW5kc2hha2UlMjBpbnRlcm5hdGlvbmFsJTIwY29vcGVyYXRpb24lMjBmbGFncyUyMG1hcCUyMHdvcmxkfGVufDF8fHx8MTc4MjgwMzY2NHww&ixlib=rb-4.1.0&q=80&w=1080",
  partenariatsHero: "https://images.unsplash.com/photo-1772303142584-c6897b8fa57c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxnbG9iYWwlMjBoYW5kc2hha2UlMjBpbnRlcm5hdGlvbmFsJTIwY29vcGVyYXRpb24lMjBmbGFncyUyMG1hcCUyMHdvcmxkfGVufDF8fHx8MTc4MjgwMzY2NHww&ixlib=rb-4.1.0&q=80&w=1080",
  prospectiveCard: "https://images.unsplash.com/photo-1529119368496-2dfda6ec2804?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJhdGVneSUyMHRlYW0lMjBtZWV0aW5nJTIwd2hpdGVib2FyZCUyMHBsYW5uaW5nJTIwdmlzaW9uJTIwZnV0dXJlfGVufDF8fHx8MTc4MjgwMzY3MHww&ixlib=rb-4.1.0&q=80&w=1080",
  prospectiveHero: "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxzdHJhdGVneSUyMHRlYW0lMjBtZWV0aW5nJTIwd2hpdGVib2FyZCUyMHBsYW5uaW5nJTIwdmlzaW9uJTIwZnV0dXJlfGVufDF8fHx8MTc4MjgwMzY3MHww&ixlib=rb-4.1.0&q=80&w=1080",
} as const;

export const DIALOGUES_INTRO = {
  eyebrow: "Patrimoines vivants & innovation",
  title:
    "Influence mondiale des patrimoines africains, dialogue entre les civilisations et laboratoires d'innovation",
  tagline:
    "Comment les héritages africains ont façonné le monde - et continuent d'inventer celui de demain.",
  image: IMG.introHero,
  secondaryImage: IMG.introSecondary,
  paragraphs: [
    "Cette rubrique illustre la manière dont les patrimoines artisanaux, artistiques et culturels africains ont participé à la construction des expressions culturelles dans différentes régions du monde. Son objectif consiste à documenter les échanges, les influences, les adaptations, les innovations et les dialogues qui se sont développés au fil des siècles entre les peuples.",
    "Cette rubrique ne cherche pas uniquement à retracer une histoire des influences. Elle crée également un espace de réflexion, de recherche et de création permettant aux artisans, artistes, chercheurs, designers, architectes et créateurs contemporains de construire les patrimoines de demain à partir des héritages culturels existants.",
  ],
};

export const dialogueSections: DialogueSection[] = [
  {
    slug: "dialogues-civilisations",
    letter: "A",
    title: "Les Dialogues entre les Civilisations",
    tagline:
      "Des routes commerciales aux ateliers contemporains : l'Afrique au cœur des échanges du monde.",
    intro: [
      "Cette section met en lumière les échanges culturels qui ont favorisé l'évolution des métiers d'art.",
      "Chaque dossier présente les influences réciproques observées entre les différentes civilisations dans les domaines de l'artisanat, de l'architecture, du textile, de la musique, de la danse, des objets de prestige, des techniques de fabrication et des expressions artistiques.",
    ],
    blocks: [
      {
        heading: "Grandes rubriques",
        items: [
          "Afrique et Afrique du Nord",
          "Afrique et Méditerranée",
          "Afrique et Europe",
          "Afrique et Moyen-Orient",
          "Afrique et Inde",
          "Afrique et Chine",
          "Afrique et Japon",
          "Afrique et Asie du Sud-Est",
          "Afrique et Amériques",
          "Afrique et Caraïbes",
          "Afrique et Océanie",
        ],
      },
      {
        text: "Chaque dossier présente les échanges commerciaux, culturels, artistiques, techniques et humains ayant contribué à l'enrichissement mutuel des sociétés.",
      },
    ],
    heroImage: IMG.dialoguesHero,
    cardImage: IMG.dialoguesCard,
    ctaLabel: "Explorer Arts & culture",
    ctaTo: "/arts-culture",
  },
  {
    slug: "diasporas",
    letter: "B",
    title: "Les Diasporas et la Continuité des Patrimoines",
    tagline:
      "De Kingston à Salvador, de Harlem à Paris : la mémoire africaine vit aux quatre coins du monde.",
    intro: [
      "Une rubrique spécifique est consacrée aux communautés issues des diasporas africaines.",
      "Elle montre comment certaines traditions ont été préservées, adaptées et réinterprétées dans différents contextes culturels.",
    ],
    blocks: [
      {
        heading: "Domaines étudiés",
        items: [
          "Les coiffures",
          "Les coiffes",
          "Les tissus",
          "Les rythmes musicaux",
          "Les tambours",
          "Les chants",
          "Les danses",
          "Les bijoux",
          "Les cérémonies",
          "Les pratiques culinaires",
          "Les objets artisanaux",
          "Les savoir-faire familiaux",
          "Les symboles identitaires",
        ],
      },
      {
        text: "Des études de cas présentent les continuités culturelles observées dans les Caraïbes, au Brésil, en Amérique du Nord et dans d'autres régions du monde.",
      },
    ],
    heroImage: IMG.diasporasHero,
    cardImage: IMG.diasporasCard,
    ctaLabel: "Lire les dossiers culturels",
    ctaTo: "/medias",
  },
  {
    slug: "industries-creatives",
    letter: "C",
    title: "Les Influences sur les Industries Créatives",
    tagline:
      "De la haute couture aux jeux vidéo : l'artisanat africain inspire toutes les industries du XXIᵉ siècle.",
    intro: [
      "Cette rubrique met en évidence la contribution des patrimoines artisanaux aux secteurs créatifs contemporains.",
    ],
    blocks: [
      {
        heading: "Domaines concernés",
        items: [
          "Mode",
          "Haute couture",
          "Design",
          "Architecture",
          "Décoration intérieure",
          "Joaillerie",
          "Arts graphiques",
          "Cinéma",
          "Théâtre",
          "Publicité",
          "Jeux vidéo",
          "Réalité virtuelle",
          "Réalité augmentée",
          "Animation",
          "Arts numériques",
        ],
      },
      {
        text: "Chaque domaine présente les collaborations possibles entre artisans traditionnels et créateurs contemporains.",
      },
    ],
    heroImage: IMG.industriesHero,
    cardImage: IMG.industriesCard,
    ctaLabel: "Proposer une collaboration",
    ctaTo: "/contact",
  },
  {
    slug: "laboratoires-innovation",
    letter: "D",
    title: "Les Laboratoires d'Innovation KRAAFT",
    tagline:
      "Quand maîtres d'art, ingénieurs et chercheurs inventent ensemble les patrimoines de demain.",
    intro: [
      "Cette rubrique accueille des espaces de recherche et d'expérimentation.",
      "Des équipes pluridisciplinaires réunissent :",
    ],
    blocks: [
      {
        items: [
          "artisans ;",
          "artistes ;",
          "designers ;",
          "architectes ;",
          "ingénieurs ;",
          "historiens ;",
          "chercheurs ;",
          "développeurs ;",
          "spécialistes des matériaux ;",
          "établissements d'enseignement.",
        ],
      },
      {
        text: "Les laboratoires développent de nouveaux produits, de nouveaux procédés, de nouvelles formes artistiques et de nouvelles applications inspirées des patrimoines culturels.",
      },
    ],
    heroImage: IMG.laboHero,
    cardImage: IMG.laboCard,
    ctaLabel: "Rejoindre un laboratoire",
    ctaTo: "/contact",
  },
  {
    slug: "materiaux-futur",
    letter: "E",
    title: "Les Matériaux du Futur",
    tagline:
      "Fibres ancestrales et biomatériaux : la matière comme terrain d'innovation responsable.",
    intro: [
      "Cette section explore les possibilités offertes par l'association entre matériaux traditionnels et innovations contemporaines.",
      "Elle documente les recherches portant sur :",
    ],
    blocks: [
      {
        items: [
          "les fibres naturelles ;",
          "les matériaux biosourcés ;",
          "les matériaux recyclés ;",
          "les composites ;",
          "les biomatériaux ;",
          "les alliages innovants ;",
          "les pigments écologiques ;",
          "les textiles intelligents ;",
          "les matériaux durables.",
        ],
      },
      {
        text: "Chaque projet présente les avantages techniques, les applications artisanales et les perspectives économiques.",
      },
    ],
    heroImage: IMG.materiauxHero,
    cardImage: IMG.materiauxCard,
    ctaLabel: "Découvrir les métiers",
    ctaTo: "/metiers",
  },
  {
    slug: "laboratoire-numerique",
    letter: "F",
    title: "Le Laboratoire Numérique",
    tagline:
      "Préserver, transmettre, diffuser : la technologie au service du patrimoine vivant.",
    intro: [
      "Cette plateforme accompagne la transformation numérique des métiers d'art.",
      "Les principaux axes de développement comprennent :",
    ],
    blocks: [
      {
        items: [
          "Modélisation 3D",
          "Numérisation des œuvres",
          "Photogrammétrie",
          "Réalité virtuelle",
          "Réalité augmentée",
          "Intelligence artificielle appliquée au patrimoine",
          "Impression 3D",
          "Découpe numérique",
          "Archivage numérique",
          "Musées virtuels",
          "Jumeaux numériques des œuvres",
          "Catalogues interactifs",
        ],
      },
      {
        text: "Cette rubrique montre comment les nouvelles technologies peuvent contribuer à la préservation, à la transmission et à la diffusion des patrimoines sans altérer leur identité.",
      },
    ],
    heroImage: IMG.numHero,
    cardImage: IMG.numCard,
    ctaLabel: "Visiter les galeries virtuelles",
    ctaTo: "/galeries",
  },
  {
    slug: "etudes-comparatives",
    letter: "G",
    title: "Les Grandes Études Comparatives",
    tagline:
      "Une bibliothèque scientifique qui éclaire la singularité africaine dans le concert des civilisations.",
    intro: [
      "Une bibliothèque scientifique rassemble des analyses comparant les différentes traditions artisanales du monde.",
      "Les comparaisons peuvent porter sur :",
    ],
    blocks: [
      {
        items: [
          "les techniques ;",
          "les matériaux ;",
          "les outils ;",
          "les motifs décoratifs ;",
          "les symboles ;",
          "les architectures ;",
          "les instruments de musique ;",
          "les vêtements ;",
          "les coiffures ;",
          "les objets royaux ;",
          "les bijoux ;",
          "les procédés de fabrication.",
        ],
      },
      {
        text: "Chaque étude met en évidence les singularités de chaque tradition ainsi que les points de convergence observés au fil de l'histoire.",
      },
    ],
    heroImage: IMG.etudesHero,
    cardImage: IMG.etudesCard,
    ctaLabel: "Consulter les éditoriaux",
    ctaTo: "/medias/editoriaux",
  },
  {
    slug: "observatoires-kraaft",
    letter: "H",
    title: "Les Observatoires KRAAFT",
    tagline:
      "Une veille permanente sur les métiers, les patrimoines, l'innovation, les marchés et les politiques.",
    intro: ["Afin d'assurer une veille permanente, plusieurs observatoires sont créés."],
    blocks: [
      {
        heading: "Observatoire des métiers d'art",
        text: "Suivi de l'évolution des professions, des formations, des besoins du secteur et des nouvelles compétences.",
      },
      {
        heading: "Observatoire des patrimoines vivants",
        text: "Documentation des pratiques culturelles, des savoir-faire en transmission et des initiatives de sauvegarde.",
      },
      {
        heading: "Observatoire de l'innovation artisanale",
        text: "Analyse des nouvelles techniques, des nouveaux matériaux et des nouveaux modèles économiques.",
      },
      {
        heading: "Observatoire des marchés",
        text: "Suivi des tendances, des opportunités commerciales, des exportations, des nouveaux débouchés et des besoins des consommateurs.",
      },
      {
        heading: "Observatoire des politiques culturelles",
        text: "Veille sur les programmes publics, les initiatives institutionnelles, les financements et les stratégies de développement des métiers d'art.",
      },
    ],
    heroImage: IMG.observatoiresHero,
    cardImage: IMG.observatoiresCard,
    ctaLabel: "Voir les statistiques",
    ctaTo: "/statistiques",
  },
  {
    slug: "partenariats-internationaux",
    letter: "I",
    title: "Les Partenariats Internationaux",
    tagline:
      "Musées, universités, fondations, entreprises : un réseau mondial au service des métiers d'art.",
    intro: ["Cette rubrique centralise l'ensemble des coopérations développées par IPPOO KRAAFT.", "Les partenariats peuvent être établis avec :"],
    blocks: [
      {
        items: [
          "musées ;",
          "universités ;",
          "écoles d'art ;",
          "académies ;",
          "instituts de recherche ;",
          "organisations professionnelles ;",
          "fondations ;",
          "organisations internationales ;",
          "collectivités territoriales ;",
          "centres culturels ;",
          "entreprises ;",
          "maisons de création ;",
          "associations patrimoniales.",
        ],
      },
      {
        text: "Chaque partenariat donne naissance à des projets communs, des résidences, des expositions, des publications, des formations, des concours et des programmes de mobilité.",
      },
    ],
    heroImage: IMG.partenariatsHero,
    cardImage: IMG.partenariatsCard,
    ctaLabel: "Devenir partenaire",
    ctaTo: "/contact",
  },
  {
    slug: "centre-prospective",
    letter: "J",
    title: "Le Centre de Prospective",
    tagline:
      "Anticiper, scénariser, recommander : préparer aujourd'hui les métiers d'art de demain.",
    intro: [
      "Cette dernière section prépare l'avenir des métiers d'art.",
      "Elle identifie les grandes transformations qui façonneront les prochaines générations d'artisans et de créateurs.",
      "Les travaux portent notamment sur :",
    ],
    blocks: [
      {
        items: [
          "les nouveaux métiers ;",
          "les compétences émergentes ;",
          "les technologies créatives ;",
          "les nouveaux matériaux ;",
          "les nouveaux usages ;",
          "les modèles économiques ;",
          "les nouvelles formes de transmission ;",
          "les attentes des jeunes générations ;",
          "les défis environnementaux ;",
          "les stratégies de valorisation internationale.",
        ],
      },
    ],
    closing:
      "Le Centre de Prospective constitue un espace permanent de réflexion stratégique. Il accompagne les décisions de développement de la plateforme et nourrit l'ensemble des autres rubriques grâce à des études, des scénarios, des recommandations et des expérimentations destinés à assurer l'évolution continue d'IPPOO KRAAFT tout en préservant la richesse et l'authenticité des patrimoines culturels.",
    heroImage: IMG.prospectiveHero,
    cardImage: IMG.prospectiveCard,
    ctaLabel: "Découvrir l'Académie KRAAFT",
    ctaTo: "/academie",
  },
];

export function getDialogueSection(slug: string): DialogueSection | undefined {
  return dialogueSections.find((s) => s.slug === slug);
}
