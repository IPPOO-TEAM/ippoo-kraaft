// Ordre Africain des Artisans - Who's Who des métiers d'art & répertoire professionnel.
// Tout le contenu source est conservé ; les introductions sont enrichies de
// formulations captivantes et de CTA, sans rien retirer des informations.
//
// RÈGLE STRICTE : chaque image est UNIQUE dans toute l'application.

export type DirBlock =
  | { type: "p"; text: string }
  | { type: "list"; intro?: string; items: string[] }
  | { type: "group"; heading: string; text?: string; intro?: string; items?: string[] };

export type DirSection = {
  letter: string;
  slug: string;
  title: string;
  lead: string;
  image: string;
  blocks: DirBlock[];
  cta?: { label: string; to: string };
};

const IMG = {
  hero: "https://images.unsplash.com/photo-1733817941696-6345fadc5b92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxBZnJpY2FuJTIwbWFzdGVyJTIwYXJ0aXNhbiUyMHBvcnRyYWl0JTIwcHJvdWQlMjBjcmFmdHNtYW58ZW58MXx8fHwxNzgyNzU2Mjc3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  ordre: "https://images.unsplash.com/photo-1761666519794-ad6fbcef058b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxBZnJpY2FuJTIwYXJ0aXNhbnMlMjBjb21tdW5pdHklMjBnYXRoZXJpbmclMjBjb29wZXJhdGl2ZSUyMGdyb3VwfGVufDF8fHx8MTc4Mjc1NjI4Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  territoire: "https://images.unsplash.com/photo-1603980186326-c613ce08dcb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2ElMjBjb250aW5lbnQlMjBtYXAlMjBhZXJpYWwlMjBsYW5kc2NhcGUlMjBzYXZhbm5haHxlbnwxfHx8fDE3ODI3NTYzMDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  whoswho: "https://images.unsplash.com/photo-1696992320299-8824fbd546d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxBZnJpY2FuJTIwbWFzdGVyJTIwYXJ0aXNhbiUyMHBvcnRyYWl0JTIwcHJvdWQlMjBjcmFmdHNtYW58ZW58MXx8fHwxNzgyNzU2Mjc3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  secteur: "https://images.unsplash.com/photo-1688240817686-3c538438af32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxBZnJpY2FuJTIwbWFzdGVyJTIwYXJ0aXNhbiUyMHBvcnRyYWl0JTIwcHJvdWQlMjBjcmFmdHNtYW58ZW58MXx8fHwxNzgyNzU2Mjc3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  specialite: "https://images.unsplash.com/photo-1688544983944-ca22ab59e330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxBZnJpY2FuJTIwbWFzdGVyJTIwYXJ0aXNhbiUyMHBvcnRyYWl0JTIwcHJvdWQlMjBjcmFmdHNtYW58ZW58MXx8fHwxNzgyNzU2Mjc3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  materiaux: "https://images.unsplash.com/photo-1560696509-660210e603a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwY3JhZnQlMjByYXclMjBtYXRlcmlhbHMlMjBiZWFkcyUyMGJyYXNzJTIwY29wcGVyJTIwbmF0dXJhbHxlbnwxfHx8fDE3ODI3NTYzMTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  niveau: "https://images.unsplash.com/photo-1567618890573-0286c2dfc38a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHxBZnJpY2FuJTIwYXJ0aXNhbnMlMjBjb21tdW5pdHklMjBnYXRoZXJpbmclMjBjb29wZXJhdGl2ZSUyMGdyb3VwfGVufDF8fHx8MTc4Mjc1NjI4Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  ecoleInfluence: "https://images.unsplash.com/photo-1544476301-7fffab9aca39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxBZnJpY2FuJTIwYXJ0aXNhbnMlMjBjb21tdW5pdHklMjBnYXRoZXJpbmclMjBjb29wZXJhdGl2ZSUyMGdyb3VwfGVufDF8fHx8MTc4Mjc1NjI4Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  ateliers: "https://images.unsplash.com/photo-1688544983924-229e200d507b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxBZnJpY2FuJTIwbWFzdGVyJTIwYXJ0aXNhbiUyMHBvcnRyYWl0JTIwcHJvdWQlMjBjcmFmdHNtYW58ZW58MXx8fHwxNzgyNzU2Mjc3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  ecoles: "https://images.unsplash.com/photo-1744809495173-217ca4faa8bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxBZnJpY2FuJTIwYXJ0JTIwc2Nob29sJTIwc3R1ZGVudHMlMjBsZWFybmluZyUyMHdvcmtzaG9wJTIwdHJhaW5pbmclMjBjbGFzc3xlbnwxfHx8fDE3ODI3NTYyODl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  recherche: "https://images.unsplash.com/photo-1761666520005-3ffcf13e74c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxBZnJpY2FuJTIwYXJ0aXNhbnMlMjBjb21tdW5pdHklMjBnYXRoZXJpbmclMjBjb29wZXJhdGl2ZSUyMGdyb3VwfGVufDF8fHx8MTc4Mjc1NjI4Mnww&ixlib=rb-4.1.0&q=80&w=1080",
} as const;

export const DIRECTORY_INTRO = {
  image: IMG.hero,
  eyebrow: "Une grande innovation IPPOO KRAAFT",
  title:
    "Ordre Africain des Artisans, Who's Who des métiers d'art et répertoire professionnel",
  hook:
    "Le grand registre panafricain qui donne un nom, un visage et une voix à chaque artisan du continent.",
  paragraphs: [
    "Cette rubrique constitue l'une des grandes innovations d'IPPOO KRAAFT. Elle vise à créer un registre panafricain des artisans, artistes et maîtres d'art, organisé de manière rigoureuse afin de reconnaître les compétences, de faciliter les collaborations, de promouvoir les talents et de renforcer la visibilité des professionnels à l'échelle nationale, régionale et internationale.",
    "Inspirée du fonctionnement des ordres professionnels et des grands annuaires de référence, cette structure rassemble les artisans selon leur spécialité, leur niveau de maîtrise, leur expérience, leurs réalisations et leur appartenance aux différentes communautés professionnelles.",
  ],
};

export const directorySections: DirSection[] = [
  {
    letter: "A",
    slug: "ordre",
    title: "L'Ordre Africain des Artisans",
    lead: "Une institution panafricaine qui fédère, reconnaît et fait rayonner les métiers d'art.",
    image: IMG.ordre,
    blocks: [
      { type: "p", text: "L'Ordre Africain des Artisans représente une organisation professionnelle dédiée à la reconnaissance, à la valorisation et à la structuration des métiers d'art." },
      { type: "p", text: "Il rassemble progressivement les artisans de chaque pays africain afin de constituer une communauté de référence favorisant la coopération, la transmission des savoir-faire, l'excellence professionnelle et le rayonnement des patrimoines artisanaux." },
      { type: "p", text: "Chaque membre bénéficie d'un profil officiel, d'une reconnaissance professionnelle et d'un accès à un réseau d'opportunités, de formations, de concours, de partenariats et d'événements." },
    ],
    cta: { label: "Rejoindre l'Ordre", to: "/devenir-artisan" },
  },
  {
    letter: "B",
    slug: "organisation-territoriale",
    title: "Organisation territoriale",
    lead: "Du continent à la commune : une représentation équilibrée et ancrée dans chaque territoire.",
    image: IMG.territoire,
    blocks: [
      { type: "p", text: "L'organisation suit une progression géographique permettant une représentation équilibrée de tous les territoires." },
      { type: "group", heading: "Niveau continental", items: ["Ordre Africain des Artisans"] },
      {
        type: "group",
        heading: "Niveau régional",
        items: ["Afrique de l'Ouest", "Afrique Centrale", "Afrique de l'Est", "Afrique Australe", "Afrique du Nord"],
      },
      { type: "group", heading: "Niveau national", text: "Chaque pays dispose de son propre Ordre National des Artisans." },
      { type: "group", heading: "Niveau régional ou provincial", text: "Les représentations locales assurent le suivi des artisans au plus près des réalités du terrain." },
      { type: "group", heading: "Niveau communal", text: "Les artisans sont regroupés par commune afin de renforcer les échanges de proximité et la dynamique économique locale." },
      {
        type: "group",
        heading: "Niveau des associations professionnelles",
        intro: "Les membres peuvent également être regroupés selon :",
        items: ["leurs fédérations", "leurs coopératives", "leurs associations", "leurs chambres des métiers", "leurs syndicats professionnels", "leurs ateliers collectifs", "leurs réseaux de créateurs"],
      },
    ],
  },
  {
    letter: "C",
    slug: "whos-who",
    title: "Le Who's Who des métiers d'art",
    lead: "Une encyclopédie vivante où chaque artisan possède sa carte d'identité professionnelle.",
    image: IMG.whoswho,
    blocks: [
      { type: "p", text: "Cette rubrique constitue une véritable encyclopédie vivante des métiers artisanaux." },
      { type: "p", text: "Chaque artisan possède une fiche professionnelle détaillée." },
      {
        type: "list",
        intro: "Contenu de la fiche",
        items: [
          "Identité professionnelle", "Portrait", "Biographie", "Parcours", "Domaine d'activité",
          "Spécialités", "Sous-spécialités", "Techniques maîtrisées", "Matériaux utilisés", "Outils employés",
          "Nombre d'années d'expérience", "Formations suivies", "Distinctions obtenues", "Certifications",
          "Prix remportés", "Réalisations majeures", "Galerie photographique", "Vidéos de démonstration",
          "Podcasts", "Publications", "Expositions", "Références professionnelles", "Localisation de l'atelier",
          "Zones d'intervention", "Coordonnées professionnelles", "Langues parlées",
          "Disponibilités pour les formations", "Disponibilités pour le mentorat", "Disponibilités pour les collaborations",
        ],
      },
      { type: "p", text: "Cette fiche devient une véritable carte d'identité professionnelle permettant au public, aux entreprises, aux institutions et aux partenaires de découvrir les compétences de chaque artisan." },
    ],
    cta: { label: "Découvrir les artisans", to: "/groupements" },
  },
  {
    letter: "D",
    slug: "secteur-activite",
    title: "Classement par secteur d'activité",
    lead: "Toutes les grandes familles professionnelles, du bois à la restauration d'œuvres.",
    image: IMG.secteur,
    blocks: [
      { type: "p", text: "Le répertoire est organisé selon les grandes familles professionnelles." },
      { type: "p", text: "Chaque artisan apparaît dans toutes les catégories correspondant à ses compétences." },
      {
        type: "list",
        intro: "Exemples :",
        items: [
          "Bois", "Ferronnerie d'art", "Sculpture", "Pierre", "Textile", "Cuir", "Bijoux", "Céramique",
          "Architecture traditionnelle", "Instruments de musique", "Coiffure", "Coiffes", "Maquillage traditionnel",
          "Arts graphiques", "Danse", "Musique", "Poésie", "Arts numériques", "Design", "Patrimoine vivant",
          "Conservation", "Restauration d'œuvres",
        ],
      },
    ],
    cta: { label: "Explorer le classement des métiers", to: "/metiers" },
  },
  {
    letter: "E",
    slug: "specialite",
    title: "Classement par spécialité",
    lead: "Chaque secteur se décline en spécialités précises pour des recherches fines.",
    image: IMG.specialite,
    blocks: [
      { type: "p", text: "Chaque secteur est ensuite subdivisé en spécialités très précises." },
      {
        type: "group",
        heading: "Ferronnerie d'art",
        intro: "Par exemple :",
        items: ["Sculpture sur métal", "Bronze", "Cuivre", "Fonte", "Laiton", "Ornementation", "Armes traditionnelles", "Objets royaux", "Mobilier artistique"],
      },
      { type: "p", text: "Chaque métier suit cette même logique de subdivision afin de faciliter les recherches." },
    ],
  },
  {
    letter: "F",
    slug: "materiaux",
    title: "Classement par matériaux",
    lead: "Retrouvez en un instant les spécialistes d'un matériau, du bronze à la calebasse.",
    image: IMG.materiaux,
    blocks: [
      { type: "p", text: "Les artisans sont également référencés selon les matériaux qu'ils utilisent." },
      {
        type: "list",
        intro: "Exemples",
        items: [
          "Bois", "Fer", "Bronze", "Cuivre", "Laiton", "Argent", "Or", "Pierre", "Marbre", "Granit",
          "Terre", "Argile", "Cuir", "Textile", "Fibres végétales", "Bambou", "Raphia", "Calebasse",
          "Corne", "Os", "Coquillages", "Verre", "Perles", "Pigments naturels", "Plumes",
          "Ivoire ancien conservé dans le respect des réglementations patrimoniales",
          "Matières recyclées", "Matériaux composites", "Nouveaux matériaux",
        ],
      },
      { type: "p", text: "Cette organisation permet de retrouver rapidement les spécialistes d'un matériau donné." },
    ],
  },
  {
    letter: "G",
    slug: "niveau-maitrise",
    title: "Classement par niveau de maîtrise",
    lead: "De l'apprenant au Maître d'Art du Patrimoine Vivant : un parcours d'excellence reconnu.",
    image: IMG.niveau,
    blocks: [
      { type: "p", text: "Conformément aux orientations du projet, les artisans sont identifiés selon leur niveau d'expertise." },
      {
        type: "list",
        intro: "Catégories",
        items: [
          "Apprenant", "Artisan débutant", "Artisan confirmé", "Artisan expérimenté", "Artisan expert",
          "Maître Artisan", "Grand Maître Artisan", "Ambassadeur des Métiers d'Art", "Maître d'Art du Patrimoine Vivant",
        ],
      },
      { type: "p", text: "Chaque niveau repose sur des critères transparents portant sur l'expérience, les réalisations, les distinctions, la transmission des savoir-faire et l'engagement en faveur du patrimoine." },
    ],
  },
  {
    letter: "H",
    slug: "ecole-influence",
    title: "Classement par école et influence",
    lead: "Les filiations artistiques et les héritages culturels qui façonnent chaque main.",
    image: IMG.ecoleInfluence,
    blocks: [
      { type: "p", text: "Chaque artisan peut être associé à une école artistique, à une tradition technique ou à une lignée de transmission." },
      {
        type: "list",
        intro: "Exemples :",
        items: ["École d'Abomey", "École d'Oyo", "Tradition d'Agadez", "École Touarègue", "Tradition Sénoufo", "École Yoruba", "École Akan", "École Mandingue"],
      },
      { type: "p", text: "Cette approche met en évidence les filiations artistiques et les héritages culturels." },
    ],
  },
  {
    letter: "I",
    slug: "ateliers",
    title: "Répertoire des ateliers",
    lead: "Chaque atelier raconte son histoire, son équipe et ses créations.",
    image: IMG.ateliers,
    blocks: [
      { type: "p", text: "Le portail référence également les ateliers." },
      { type: "p", text: "Chaque atelier possède sa propre fiche." },
      {
        type: "list",
        intro: "Elle comprend :",
        items: ["Présentation", "Historique", "Spécialités", "Équipe", "Maîtres artisans", "Apprentis", "Services proposés", "Visites", "Formations", "Galerie", "Boutique", "Localisation", "Horaires", "Contacts"],
      },
    ],
  },
  {
    letter: "J",
    slug: "ecoles-formation",
    title: "Répertoire des écoles et centres de formation",
    lead: "Toutes les voies pour apprendre, se perfectionner et transmettre.",
    image: IMG.ecoles,
    blocks: [
      {
        type: "list",
        intro: "Une base de données regroupe :",
        items: ["Écoles artisanales", "Centres techniques", "Académies", "Instituts", "Universités", "Centres culturels", "Musées-écoles", "Ateliers de formation", "Centres d'apprentissage", "FabLabs patrimoniaux"],
      },
      { type: "p", text: "Chaque établissement présente ses formations, ses équipements, ses enseignants, ses conditions d'admission et ses partenariats." },
    ],
    cta: { label: "Découvrir l'Académie KRAAFT", to: "/academie" },
  },
  {
    letter: "K",
    slug: "recherche-avancee",
    title: "Mise en relation et recherche avancée",
    lead: "Un moteur de recherche puissant pour trouver l'artisan ou la structure qu'il vous faut.",
    image: IMG.recherche,
    blocks: [
      { type: "p", text: "Le moteur de recherche du portail permet de retrouver rapidement un artisan ou une structure grâce à de nombreux critères combinables." },
      {
        type: "list",
        intro: "Les utilisateurs peuvent effectuer leurs recherches selon :",
        items: [
          "le pays", "la région", "la commune", "l'ethnie", "le royaume d'origine", "le secteur d'activité",
          "la spécialité", "le matériau", "le niveau de maîtrise", "le type de réalisation", "la disponibilité",
          "les certifications", "les distinctions", "les formations proposées", "les langues parlées", "les collaborations souhaitées",
        ],
      },
    ],
    cta: { label: "Lancer une recherche", to: "/boutique" },
  },
];
