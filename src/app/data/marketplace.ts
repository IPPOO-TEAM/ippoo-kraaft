// Place de Marché KRAAFT - Commerce, Commandes, Collections et Économie des métiers d'art.
// Contenu repris intégralement (verbatim) depuis la source éditoriale IPPOO KRAAFT,
// enrichi de formulations captivantes et de CTA orientés visiteurs/artisans.
//
// RÈGLE STRICTE : chaque image est UNIQUE (aucune image utilisée deux fois, ni ici,
// ni ailleurs dans l'application).

export type MarketplaceBlock = { heading?: string; text?: string; items?: string[] };

export type MarketplaceSection = {
  slug: string;
  letter: string;
  title: string;
  tagline: string;
  intro: string[];
  blocks: MarketplaceBlock[];
  closing?: string;
  heroImage: string;
  cardImage: string;
  ctaLabel: string;
  ctaTo: string;
};

// 22 images uniques - références africaines (ateliers, marchés, créations) + univers
// professionnel pour les services numériques. Aucune n'apparaît ailleurs dans l'app.
const IMG = {
  introHero: "https://images.unsplash.com/photo-1641582163466-e4d573078f98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxhcnQlMjBnYWxsZXJ5JTIwc2hvd2Nhc2UlMjBBZnJpY2FuJTIwY3JhZnQlMjBkaXNwbGF5JTIwbHV4dXJ5fGVufDF8fHx8MTc4MjgxNzc2OHww&ixlib=rb-4.1.0&q=80&w=1080",
  introSecondary: "https://images.unsplash.com/photo-1771344166583-9054619f5e6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxhcnQlMjBnYWxsZXJ5JTIwc2hvd2Nhc2UlMjBBZnJpY2FuJTIwY3JhZnQlMjBkaXNwbGF5JTIwbHV4dXJ5fGVufDF8fHx8MTc4MjgxNzc2OHww&ixlib=rb-4.1.0&q=80&w=1080",
  galerieHero: "https://images.unsplash.com/photo-1664196755299-528b959481b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxhcnQlMjBnYWxsZXJ5JTIwc2hvd2Nhc2UlMjBBZnJpY2FuJTIwY3JhZnQlMjBkaXNwbGF5JTIwbHV4dXJ5fGVufDF8fHx8MTc4MjgxNzc2OHww&ixlib=rb-4.1.0&q=80&w=1080",
  galerieCard: "https://images.unsplash.com/photo-1717913491210-f742a34f7d9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxhcnQlMjBnYWxsZXJ5JTIwc2hvd2Nhc2UlMjBBZnJpY2FuJTIwY3JhZnQlMjBkaXNwbGF5JTIwbHV4dXJ5fGVufDF8fHx8MTc4MjgxNzc2OHww&ixlib=rb-4.1.0&q=80&w=1080",
  boutiqueHero: "https://images.unsplash.com/photo-1709211077981-fa0cf1ec61ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxoYW5kY3JhZnQlMjBidXNpbmVzcyUyMHdvcmtzaG9wJTIwQWZyaWNhbiUyMHdvbWFuJTIwZW50cmVwcmVuZXVyfGVufDF8fHx8MTc4MjgxNzc3Nnww&ixlib=rb-4.1.0&q=80&w=1080",
  boutiqueCard: "https://images.unsplash.com/photo-1773146916231-e6aeae932080?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxoYW5kY3JhZnQlMjBidXNpbmVzcyUyMHdvcmtzaG9wJTIwQWZyaWNhbiUyMHdvbWFuJTIwZW50cmVwcmVuZXVyfGVufDF8fHx8MTc4MjgxNzc3Nnww&ixlib=rb-4.1.0&q=80&w=1080",
  commandesHero: "https://images.unsplash.com/photo-1605302596032-15e67c3cf66a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBnYWxsZXJ5JTIwc2hvd2Nhc2UlMjBBZnJpY2FuJTIwY3JhZnQlMjBkaXNwbGF5JTIwbHV4dXJ5fGVufDF8fHx8MTc4MjgxNzc2OHww&ixlib=rb-4.1.0&q=80&w=1080",
  commandesCard: "https://images.unsplash.com/photo-1706980954708-80fe255183c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxhcnQlMjBnYWxsZXJ5JTIwc2hvd2Nhc2UlMjBBZnJpY2FuJTIwY3JhZnQlMjBkaXNwbGF5JTIwbHV4dXJ5fGVufDF8fHx8MTc4MjgxNzc2OHww&ixlib=rb-4.1.0&q=80&w=1080",
  appelsHero: "https://images.unsplash.com/photo-1552683578-311bbc6fd40b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxoYW5kY3JhZnQlMjBidXNpbmVzcyUyMHdvcmtzaG9wJTIwQWZyaWNhbiUyMHdvbWFuJTIwZW50cmVwcmVuZXVyfGVufDF8fHx8MTc4MjgxNzc3Nnww&ixlib=rb-4.1.0&q=80&w=1080",
  appelsCard: "https://images.unsplash.com/photo-1709567484031-87bc70607500?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxkb2N1bWVudGFyeSUyMGZpbG0lMjBjYW1lcmElMjBjcmV3JTIwZmlsbWluZyUyMEFmcmljYXxlbnwxfHx8fDE3ODI4MDI2NDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  encheresHero: "https://images.unsplash.com/photo-1765127959746-3f5925d9a2c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxhdWN0aW9uJTIwaGFtbWVyJTIwbHV4dXJ5JTIwY29sbGVjdG9yJTIwZXhoaWJpdGlvbnxlbnwxfHx8fDE3ODI4MTc3NzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  encheresCard: "https://images.unsplash.com/photo-1763038338275-2034c7e687f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdWN0aW9uJTIwaGFtbWVyJTIwbHV4dXJ5JTIwY29sbGVjdG9yJTIwZXhoaWJpdGlvbnxlbnwxfHx8fDE3ODI4MTc3NzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  collectionneursHero: "https://images.unsplash.com/photo-1668783073339-be1071dcb318?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxtdXNldW0lMjBleGhpYml0aW9uJTIwcmVzdG9yYXRpb24lMjBjb25zZXJ2YXRpb24lMjBsYWJvcmF0b3J5JTIwYXJ0aWZhY3R8ZW58MXx8fHwxNzgyODA1MDg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  collectionneursCard: "https://images.unsplash.com/photo-1756906312884-48b2e9cafb2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxtdXNldW0lMjBleGhpYml0aW9uJTIwcmVzdG9yYXRpb24lMjBjb25zZXJ2YXRpb24lMjBsYWJvcmF0b3J5JTIwYXJ0aWZhY3R8ZW58MXx8fHwxNzgyODA1MDg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  galeriesMuseesHero: "https://images.unsplash.com/photo-1695920553870-63ef260dddc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxtdXNldW0lMjBleGhpYml0aW9uJTIwcmVzdG9yYXRpb24lMjBjb25zZXJ2YXRpb24lMjBsYWJvcmF0b3J5JTIwYXJ0aWZhY3R8ZW58MXx8fHwxNzgyODA1MDg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  galeriesMuseesCard: "https://images.unsplash.com/photo-1660631228116-b3643559f611?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxwb2RjYXN0JTIwbWljcm9waG9uZSUyMHJlY29yZGluZyUyMHN0dWRpbyUyMGludGVydmlld3xlbnwxfHx8fDE3ODI4MDI2NDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  labelsHero: "https://images.unsplash.com/photo-1774891937648-68c7bfd6d035?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxjZXJ0aWZpY2F0ZSUyMHNpZ25hdHVyZSUyMHN0YW1wJTIwYXV0aGVudGljaXR5JTIwc2VhbCUyMGNhbGxpZ3JhcGh5fGVufDF8fHx8MTc4MjgxNzc3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
  labelsCard: "https://images.unsplash.com/photo-1774891937497-96df6a794bd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxjZXJ0aWZpY2F0ZSUyMHNpZ25hdHVyZSUyMHN0YW1wJTIwYXV0aGVudGljaXR5JTIwc2VhbCUyMGNhbGxpZ3JhcGh5fGVufDF8fHx8MTc4MjgxNzc3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
  kraaftCollHero: "https://images.unsplash.com/photo-1587716283570-f71969a1f854?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZXJ0aWZpY2F0ZSUyMHNpZ25hdHVyZSUyMHN0YW1wJTIwYXV0aGVudGljaXR5JTIwc2VhbCUyMGNhbGxpZ3JhcGh5fGVufDF8fHx8MTc4MjgxNzc3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
  kraaftCollCard: "https://images.unsplash.com/photo-1668148230835-c5925ac31dfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxjZXJ0aWZpY2F0ZSUyMHNpZ25hdHVyZSUyMHN0YW1wJTIwYXV0aGVudGljaXR5JTIwc2VhbCUyMGNhbGxpZ3JhcGh5fGVufDF8fHx8MTc4MjgxNzc3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
  servicesHero: "https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxkYXNoYm9hcmQlMjBhbmFseXRpY3MlMjBsYXB0b3AlMjBjb21wdXRlciUyMGUtY29tbWVyY2UlMjBzbWFsbCUyMGJ1c2luZXNzfGVufDF8fHx8MTc4MjgxNzc3Nnww&ixlib=rb-4.1.0&q=80&w=1080",
  servicesCard: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxkYXNoYm9hcmQlMjBhbmFseXRpY3MlMjBsYXB0b3AlMjBjb21wdXRlciUyMGUtY29tbWVyY2UlMjBzbWFsbCUyMGJ1c2luZXNzfGVufDF8fHx8MTc4MjgxNzc3Nnww&ixlib=rb-4.1.0&q=80&w=1080",
} as const;

export const MARKETPLACE_INTRO = {
  eyebrow: "Place de Marché KRAAFT",
  title:
    "Place de Marché KRAAFT - Commerce, Commandes, Collections et Économie des métiers d'art",
  tagline:
    "Une véritable plateforme économique au service des artisans et des créateurs d'Afrique.",
  image: IMG.introHero,
  secondaryImage: IMG.introSecondary,
  paragraphs: [
    "Cette rubrique transforme IPPOO KRAAFT en une véritable plateforme économique dédiée aux métiers d'art, aux créations artisanales et aux patrimoines culturels. Elle permet aux artisans, aux artistes, aux ateliers, aux coopératives, aux manufactures, aux galeries et aux collectionneurs de présenter leurs créations, de développer leur activité et de rencontrer une clientèle nationale et internationale.",
    "La Place de Marché favorise également les collaborations professionnelles, les commandes personnalisées, les appels à création et les projets sur mesure tout en valorisant l'authenticité, la qualité et l'identité culturelle des œuvres proposées.",
  ],
};

export const marketplaceSections: MarketplaceSection[] = [
  {
    slug: "galerie-creations",
    letter: "A",
    title: "Galerie des Créations",
    tagline: "Chaque artisan, sa galerie permanente - chaque œuvre, son histoire.",
    intro: [
      "Chaque artisan dispose d'une galerie permanente présentant ses réalisations.",
      "Les créations sont organisées sous forme de collections.",
      "Chaque œuvre comprend :",
    ],
    blocks: [
      {
        items: [
          "Photographies haute définition",
          "Présentation détaillée",
          "Histoire de la création",
          "Inspiration artistique",
          "Techniques employées",
          "Matériaux utilisés",
          "Temps de réalisation",
          "Dimensions",
          "Finitions",
          "Signature de l'artisan",
          "Série ou pièce unique",
          "Disponibilité",
          "Certificat d'authenticité",
          "Localisation de l'œuvre",
          "Conditions d'acquisition",
        ],
      },
      {
        text: "Les visiteurs peuvent constituer leurs propres collections favorites afin de retrouver facilement les œuvres qui les intéressent.",
      },
    ],
    heroImage: IMG.galerieHero,
    cardImage: IMG.galerieCard,
    ctaLabel: "Explorer la boutique",
    ctaTo: "/boutique",
  },
  {
    slug: "boutique-artisans",
    letter: "B",
    title: "Boutique des Artisans",
    tagline: "Une vitrine numérique sur-mesure pour chaque maître d'art.",
    intro: [
      "Chaque artisan bénéficie de sa propre boutique numérique.",
      "Cette boutique rassemble :",
    ],
    blocks: [
      {
        items: [
          "Les créations disponibles",
          "Les nouveautés",
          "Les collections permanentes",
          "Les éditions limitées",
          "Les créations sur commande",
          "Les œuvres emblématiques",
          "Les meilleures ventes",
          "Les distinctions obtenues",
          "Les recommandations",
        ],
      },
      {
        text: "La boutique présente également l'atelier, l'équipe, les méthodes de fabrication et les engagements de l'artisan.",
      },
    ],
    heroImage: IMG.boutiqueHero,
    cardImage: IMG.boutiqueCard,
    ctaLabel: "Ouvrir ma boutique d'artisan",
    ctaTo: "/devenir-artisan",
  },
  {
    slug: "commandes-personnalisees",
    letter: "C",
    title: "Commandes Personnalisées",
    tagline: "Une création unique, conçue pour vous.",
    intro: [
      "Cette rubrique permet aux particuliers, aux entreprises, aux institutions et aux collectivités de commander des créations spécifiques.",
      "Les demandes peuvent concerner :",
    ],
    blocks: [
      {
        items: [
          "Mobilier",
          "Sculpture",
          "Ferronnerie d'art",
          "Architecture décorative",
          "Objets de prestige",
          "Bijoux",
          "Costumes",
          "Coiffes",
          "Accessoires",
          "Instruments de musique",
          "Décoration intérieure",
          "Décoration événementielle",
          "Œuvres commémoratives",
          "Cadeaux protocolaires",
          "Trophées",
          "Distinctions honorifiques",
        ],
      },
      {
        text: "Chaque commande est accompagnée d'un espace de suivi favorisant les échanges entre le client et le créateur.",
      },
    ],
    heroImage: IMG.commandesHero,
    cardImage: IMG.commandesCard,
    ctaLabel: "Lancer une commande personnalisée",
    ctaTo: "/contact",
  },
  {
    slug: "appels-creation",
    letter: "D",
    title: "Appels à Création",
    tagline: "Donner forme aux grands projets, du monument à l'œuvre publique.",
    intro: [
      "Les institutions, entreprises, architectes, designers et collectivités peuvent publier des appels à création.",
      "Les projets peuvent porter sur :",
    ],
    blocks: [
      {
        items: [
          "Monuments",
          "Œuvres publiques",
          "Décoration",
          "Aménagement intérieur",
          "Collections",
          "Mobilier",
          "Signalétique",
          "Expositions",
          "Installations artistiques",
          "Commandes royales ou protocolaires",
          "Créations commémoratives",
        ],
      },
      {
        text: "Les artisans intéressés déposent leur proposition directement sur la plateforme.",
      },
    ],
    heroImage: IMG.appelsHero,
    cardImage: IMG.appelsCard,
    ctaLabel: "Publier un appel à création",
    ctaTo: "/contact",
  },
  {
    slug: "ventes-encheres",
    letter: "E",
    title: "Ventes aux Enchères",
    tagline: "Des pièces d'exception, racontées et documentées.",
    intro: ["Une rubrique est consacrée aux œuvres d'exception.", "Elle accueille :"],
    blocks: [
      {
        items: [
          "Pièces uniques",
          "Collections historiques",
          "Créations contemporaines",
          "Œuvres de maîtres",
          "Collections privées",
          "Collections patrimoniales",
        ],
      },
      {
        text: "Chaque enchère comprend une documentation complète retraçant l'histoire de l'œuvre, son auteur, sa provenance, ses matériaux, ses techniques et son contexte de création.",
      },
    ],
    heroImage: IMG.encheresHero,
    cardImage: IMG.encheresCard,
    ctaLabel: "Découvrir les enchères en cours",
    ctaTo: "/boutique",
  },
  {
    slug: "galerie-collectionneurs",
    letter: "F",
    title: "Galerie des Collectionneurs",
    tagline: "Les passions privées au service de la valorisation publique.",
    intro: [
      "Les collectionneurs peuvent présenter leurs collections afin de contribuer à la valorisation des métiers d'art.",
      "Les collections peuvent être organisées selon :",
    ],
    blocks: [
      {
        items: [
          "Les matériaux",
          "Les pays",
          "Les royaumes",
          "Les familles artisanales",
          "Les périodes historiques",
          "Les styles",
          "Les techniques",
          "Les artistes",
          "Les objets royaux",
          "Les objets cérémoniels",
        ],
      },
      { text: "Cette rubrique favorise les échanges entre collectionneurs, chercheurs et artisans." },
    ],
    heroImage: IMG.collectionneursHero,
    cardImage: IMG.collectionneursCard,
    ctaLabel: "Rejoindre la communauté des collectionneurs",
    ctaTo: "/inscription",
  },
  {
    slug: "espace-galeries-musees",
    letter: "G",
    title: "Espace des Galeries et des Musées",
    tagline: "Les institutions culturelles au cœur du portail.",
    intro: [
      "Les galeries d'art, les musées, les fondations et les centres culturels disposent d'un espace dédié.",
      "Ils peuvent y présenter :",
    ],
    blocks: [
      {
        items: [
          "Leurs expositions",
          "Leurs collections",
          "Leurs acquisitions",
          "Leurs publications",
          "Leurs conférences",
          "Leurs programmes pédagogiques",
          "Leurs partenariats",
          "Leurs appels à projets",
        ],
      },
    ],
    heroImage: IMG.galeriesMuseesHero,
    cardImage: IMG.galeriesMuseesCard,
    ctaLabel: "Proposer un partenariat institutionnel",
    ctaTo: "/contact",
  },
  {
    slug: "labels-certificats",
    letter: "H",
    title: "Labels et Certificats d'Authenticité",
    tagline: "Une traçabilité numérique au service de la confiance.",
    intro: ["Chaque création peut être accompagnée d'un certificat numérique comprenant :"],
    blocks: [
      {
        items: [
          "L'identité de l'artisan",
          "La description de l'œuvre",
          "Les matériaux",
          "Les techniques",
          "La date de création",
          "Le numéro d'enregistrement",
          "La signature numérique",
          "Les recommandations de conservation",
          "L'historique de propriété, lorsque celui-ci est documenté",
        ],
      },
      { text: "Cette démarche renforce la traçabilité des œuvres et valorise le travail des créateurs." },
    ],
    heroImage: IMG.labelsHero,
    cardImage: IMG.labelsCard,
    ctaLabel: "En savoir plus sur les normes IPPOO KRAAFT",
    ctaTo: "/a-propos",
  },
  {
    slug: "collections-kraaft",
    letter: "I",
    title: "Les Collections KRAAFT",
    tagline: "Des thématiques fortes pour explorer le patrimoine vivant.",
    intro: [
      "Le portail propose également des collections éditoriales et commerciales regroupant des œuvres selon différents thèmes.",
    ],
    blocks: [
      {
        heading: "Exemples",
        items: [
          "Héritages Royaux",
          "Arts du Bronze",
          "Les Maîtres du Bois",
          "Les Routes du Textile",
          "Les Arts du Cuir",
          "Les Bijoux d'Afrique",
          "Les Tambours du Patrimoine",
          "Les Arts des Palais",
          "Les Créations Contemporaines",
          "Les Jeunes Talents",
          "Les Femmes Créatrices",
          "Les Trésors des Communautés",
        ],
      },
      {
        text: "Chaque collection met en avant les œuvres, les artisans, les techniques et les histoires qui les relient.",
      },
    ],
    heroImage: IMG.kraaftCollHero,
    cardImage: IMG.kraaftCollCard,
    ctaLabel: "Voir les collections en boutique",
    ctaTo: "/boutique",
  },
  {
    slug: "services-numeriques-artisans",
    letter: "J",
    title: "Les Services Numériques pour les Artisans",
    tagline: "Tous les outils pour développer son activité artisanale.",
    intro: [
      "Cette rubrique fournit aux artisans un ensemble d'outils destinés à développer leur activité.",
      "Chaque espace professionnel comprend :",
    ],
    blocks: [
      {
        heading: "Gestion de l'atelier",
        items: [
          "Présentation de l'atelier",
          "Organisation de l'équipe",
          "Gestion des apprentis",
          "Planification des réalisations",
          "Suivi des commandes",
          "Gestion des stocks de matériaux",
          "Gestion des outils",
          "Calendrier des activités",
        ],
      },
      {
        heading: "Portfolio professionnel",
        text: "Chaque artisan construit un portfolio numérique comprenant :",
        items: [
          "Biographie",
          "Réalisations",
          "Expositions",
          "Distinctions",
          "Publications",
          "Podcasts",
          "Vidéos",
          "Témoignages",
          "Galerie photographique",
          "Collaborations",
          "Références professionnelles",
        ],
      },
      {
        heading: "Gestion de la clientèle",
        text: "Les artisans disposent d'un espace permettant de gérer :",
        items: [
          "Les demandes de renseignements",
          "Les devis",
          "Les commandes",
          "Les rendez-vous",
          "Les livraisons",
          "Les relations avec les collectionneurs",
          "Les partenariats professionnels",
        ],
      },
      {
        heading: "Tableau de bord",
        text: "Chaque membre visualise :",
        items: [
          "Ses créations publiées",
          "Ses ventes",
          "Ses commandes",
          "Ses candidatures aux concours",
          "Ses certifications",
          "Ses formations",
          "Ses événements",
          "Ses statistiques de visibilité",
          "Les recommandations personnalisées",
        ],
      },
    ],
    heroImage: IMG.servicesHero,
    cardImage: IMG.servicesCard,
    ctaLabel: "Accéder à mon espace artisan",
    ctaTo: "/espace-artisan",
  },
];

export function getMarketplaceSection(slug: string): MarketplaceSection | undefined {
  return marketplaceSections.find((s) => s.slug === slug);
}
