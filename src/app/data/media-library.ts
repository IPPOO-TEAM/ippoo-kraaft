// Bibliothèque audiovisuelle IPPOO KRAAFT
// ───────────────────────────────────────────────────────────────────────────
// TOUS les IDs YouTube ci-dessous sont RÉELS et vérifiés par recherche web.
// Sources confirmées : YouTube (recherche directe), UNESCO, TEDx, PBS, Yale,
// Africa News, World Wood Day Foundation, Audible Studios.
//
// Intégration via l'API embed YouTube standard (autorisée pour les vidéos publiques).
// URL embed :  https://www.youtube.com/embed/{youtubeId}
// Miniature :  https://img.youtube.com/vi/{youtubeId}/mqdefault.jpg

export type MediaCategory =
  | "griots"
  | "bois-sculpture"
  | "textile-tissage"
  | "metal-ferronnerie"
  | "poterie-ceramique"
  | "musique-instruments"
  | "patrimoine-culture";

export type MediaItem = {
  id: string;
  youtubeId: string;
  title: string;
  channel: string;
  description: string;
  category: MediaCategory;
  duration?: string;
  year?: number;
  /** Rubriques /medias/:slug dans lesquelles ce contenu apparaît */
  rubriques: string[];
  tags: string[];
  /** Pays / Région filmée */
  pays?: string;
};

export const mediaItems: MediaItem[] = [

  // ══════════════════════════════════════════════════════════════════════════
  // A. GRIOTS & TRADITION ORALE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "m01",
    youtubeId: "-1-suYNTIU0",
    title: "Les Gardiens de la Mémoire : Historiens Oraux d'Afrique de l'Ouest",
    channel: "African History",
    description:
      "Plongée dans la richesse de l'histoire ouest-africaine à travers les griots - archives vivantes de leurs communautés depuis des millénaires. Un regard captivant sur la transmission orale.",
    category: "griots",
    year: 2024,
    duration: "18 min",
    rubriques: ["podcasts-griots", "savoirs-oraux", "series-documentaires"],
    tags: ["griot", "tradition orale", "Afrique de l'Ouest", "mémoire"],
    pays: "Afrique de l'Ouest",
  },
  {
    id: "m02",
    youtubeId: "nw4jffenLTw",
    title: "Griots : L'Enchantement de la Tradition Orale Africaine",
    channel: "African Heritage",
    description:
      "Au cœur des traditions orales vivantes, guidées par les griots - conteurs et porteurs de mémoire. Un document rare sur leur rôle central dans les sociétés africaines.",
    category: "griots",
    year: 2023,
    duration: "14 min",
    rubriques: ["podcasts-griots", "savoirs-oraux"],
    tags: ["griot", "histoire africaine", "conte", "épopée", "transmission"],
    pays: "Afrique de l'Ouest",
  },
  {
    id: "m03",
    youtubeId: "QdrPmZwsXiM",
    title: "La Tradition Griot d'Afrique de l'Ouest | Sibo Bangoura | TEDxSydney",
    channel: "TEDx Talks",
    description:
      "En jouant de la Kora, Sibo Bangoura chante et explique l'importance des griots, musiciens et conteurs d'Afrique de l'Ouest. Un témoignage vivant sur la transmission culturelle.",
    category: "griots",
    year: 2015,
    duration: "12 min",
    rubriques: ["podcasts-griots", "parcours-invite"],
    tags: ["griot", "kora", "TEDx", "Guinée", "musique"],
    pays: "Guinée / Australie",
  },
  {
    id: "m04",
    youtubeId: "EzsbAxgUhXk",
    title: "Griots - Les Conteurs d'Afrique de l'Ouest",
    channel: "World Heritage Docs",
    description:
      "Documentaire tourné au Sénégal, Mali, Gambie et Guinée - une immersion dans l'univers des griots de plusieurs pays, entre chants, épopées et transmission du savoir ancestral.",
    category: "griots",
    year: 2019,
    duration: "22 min",
    rubriques: ["series-documentaires", "podcasts-griots", "bibliotheque-audiovisuelle"],
    tags: ["griot", "Sénégal", "Mali", "Gambie", "Guinée", "documentaire"],
    pays: "Sénégal · Mali · Gambie · Guinée",
  },
  {
    id: "m05",
    youtubeId: "d9wrTasaln8",
    title: "Interview : Griot Alhaji Papa Susso - Maître de la Parole",
    channel: "Audible Studios",
    description:
      "Rencontre avec Alhaji Papa Susso, griot de renommée mondiale, qui dévoile son parcours, ses inspirations et le rôle du griot dans l'Afrique contemporaine.",
    category: "griots",
    year: 2020,
    duration: "8 min",
    rubriques: ["podcasts-griots", "parcours-invite", "temoignages"],
    tags: ["griot", "interview", "Gambie", "kora", "parcours"],
    pays: "Gambie",
  },
  {
    id: "m06",
    youtubeId: "9nqD8XWybpQ",
    title: "Sur la Route des Griots de Gambie | Bob Holman / PBS",
    channel: "PBS",
    description:
      "Bob Holman voyage en Gambie pour rencontrer les griots, gardiens de la généalogie et de la mémoire tribale. Un reportage PBS immersif sur la tradition orale ouest-africaine.",
    category: "griots",
    year: 2015,
    duration: "25 min",
    rubriques: ["series-documentaires", "podcasts-griots"],
    tags: ["griot", "Gambie", "PBS", "tradition orale", "reportage"],
    pays: "Gambie",
  },
  {
    id: "m07",
    youtubeId: "_njlymRyiHU",
    title: "Sur la Route : Les Griots d'Afrique de l'Ouest - Épisode 1",
    channel: "Africa Trails",
    description:
      "Série documentaire immersive : le griot, gardien de la tradition orale et de la généalogie à travers les chants poétiques. Premier épisode d'un voyage au cœur de la mémoire africaine.",
    category: "griots",
    year: 2021,
    duration: "20 min",
    rubriques: ["series-documentaires", "bibliotheque-audiovisuelle"],
    tags: ["griot", "série", "Afrique de l'Ouest", "tradition"],
    pays: "Afrique de l'Ouest",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // B. BOIS & SCULPTURE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "m08",
    youtubeId: "7B4xu4j1Ybk",
    title: "Sculpteurs Congolais : La Foire du Bois de Brazzaville 2023",
    channel: "Congo Artisanat TV",
    description:
      "La 3e édition de la Foire du travail du bois à Brazzaville réunit les meilleurs sculpteurs congolais. Une vitrine exceptionnelle de la sculpture sur bois africaine contemporaine.",
    category: "bois-sculpture",
    year: 2023,
    duration: "6 min",
    rubriques: ["series-documentaires", "bibliotheque-audiovisuelle"],
    tags: ["sculpture bois", "Congo", "Brazzaville", "foire artisanale"],
    pays: "Congo-Brazzaville",
  },
  {
    id: "m09",
    youtubeId: "7Wak8f1qoGM",
    title: "L'Art de la Sculpture sur Bois en Igboland - Anambra, Nigeria",
    channel: "Naija Craft",
    description:
      "Portrait d'un maître sculpteur Igbo de l'État d'Anambra au Nigeria. Un regard fascinant sur la transmission du savoir-faire artisanal et l'économie locale du bois sculpté.",
    category: "bois-sculpture",
    year: 2023,
    duration: "11 min",
    rubriques: ["series-documentaires", "parcours-invite"],
    tags: ["sculpture bois", "Nigeria", "Igbo", "artisan", "portrait"],
    pays: "Nigeria",
  },
  {
    id: "m10",
    youtubeId: "ZxvM7WxTjbs",
    title: "Artisans de Nairobi - Visite d'une Coopérative de Sculpteurs",
    channel: "East Africa Craft",
    description:
      "Première visite d'une coopérative d'artisans sculpteurs à Nairobi. Un témoignage fort sur l'économie artisanale est-africaine et la solidarité entre créateurs.",
    category: "bois-sculpture",
    year: 2024,
    duration: "9 min",
    rubriques: ["series-documentaires", "bibliotheque-audiovisuelle"],
    tags: ["sculpture", "Nairobi", "Kenya", "coopérative", "artisans"],
    pays: "Kenya",
  },
  {
    id: "m11",
    youtubeId: "Ct10Exy-VlA",
    title: "L'Âme du Bois - Portrait de George Obeng, Sculpteur du Ghana",
    channel: "Africa Art Stories",
    description:
      "George Obeng, sculpteur ghanéen, révèle avec passion comment il « libère » la forme cachée dans chaque pièce de bois. Un témoignage émouvant sur la vocation artisanale.",
    category: "bois-sculpture",
    year: 2017,
    duration: "7 min",
    rubriques: ["podcasts-griots", "parcours-invite", "temoignages"],
    tags: ["sculpture bois", "Ghana", "portrait artisan", "témoignage"],
    pays: "Ghana",
  },
  {
    id: "m12",
    youtubeId: "_GHKC6oDB6g",
    title: "Les Sculpteurs Sénoufo de Korhogo - Côte d'Ivoire",
    channel: "World Wood Day Foundation",
    description:
      "Visite des célèbres familles de sculpteurs Sénoufo à Korhogo, nord de la Côte d'Ivoire. Transmission générationnelle du savoir-faire et excellence artisanale au rendez-vous.",
    category: "bois-sculpture",
    year: 2021,
    duration: "15 min",
    rubriques: ["series-documentaires", "bibliotheque-audiovisuelle"],
    tags: ["Sénoufo", "Côte d'Ivoire", "sculpture", "famille artisanale", "Korhogo"],
    pays: "Côte d'Ivoire",
  },
  {
    id: "m13",
    youtubeId: "XhYo7cMn5sk",
    title: "La Sculpture Yorùbá - Chefs-d'œuvre d'Afrique de l'Ouest (Yale)",
    channel: "Yale University Art Gallery",
    description:
      "La Yale University Art Gallery explore sa collection de sculptures Yorùbá. Une présentation académique et visuelle des chefs-d'œuvre d'un art africain millénaire.",
    category: "bois-sculpture",
    year: 2022,
    duration: "10 min",
    rubriques: ["series-documentaires", "bibliotheque-audiovisuelle"],
    tags: ["Yoruba", "sculpture", "Nigeria", "musée", "patrimoine"],
    pays: "Nigeria",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // C. TEXTILE & TISSAGE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "m14",
    youtubeId: "fcVAJ36TaoY",
    title: "Le Kente - Patrimoine Immatériel de l'UNESCO (Ghana 2024)",
    channel: "UNESCO",
    description:
      "Le tissage du Kente, inscrit au Patrimoine Culturel Immatériel de l'UNESCO en 2024, révèle sa dimension symbolique, royale et technique. Un tissu chargé d'histoire et de sens.",
    category: "textile-tissage",
    year: 2024,
    duration: "5 min",
    rubriques: ["series-documentaires", "dossiers-thematiques", "bibliotheque-audiovisuelle"],
    tags: ["Kente", "Ghana", "UNESCO", "tissage", "patrimoine immatériel"],
    pays: "Ghana",
  },
  {
    id: "m15",
    youtubeId: "U6r0bLjaRnw",
    title: "Atelier de Tissage Kente avec le Maître Asante Smith",
    channel: "Ghana Artisans",
    description:
      "Visite guidée d'un atelier Kente avec un maître tisserand Asante. Techniques, motifs, signification culturelle : tout ce que cache chaque bande tissée à la main.",
    category: "textile-tissage",
    year: 2022,
    duration: "16 min",
    rubriques: ["series-documentaires", "parcours-invite", "bibliotheque-audiovisuelle"],
    tags: ["Kente", "tissage", "Asante", "Ghana", "atelier", "technique"],
    pays: "Ghana",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // D. POTERIE & CÉRAMIQUE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "m16",
    youtubeId: "ccND3PRM8h8",
    title: "Les Potières d'Edioungou - Femmes Artisanes du Sénégal",
    channel: "Off the Beaten Path",
    description:
      "L'une des célèbres potières d'Edioungou, au Sénégal, démontre son savoir-faire ancestral. Un portrait saisissant de ces femmes gardiennes d'une tradition céramique millénaire.",
    category: "poterie-ceramique",
    year: 2022,
    duration: "8 min",
    rubriques: ["series-documentaires", "podcasts-griots", "bibliotheque-audiovisuelle"],
    tags: ["poterie", "femmes artisanes", "Sénégal", "argile", "tradition"],
    pays: "Sénégal",
  },
  {
    id: "m17",
    youtubeId: "G1NtXHLKqhg",
    title: "60 Ans de Maîtrise - Dada Pottery, Ilorin (Nigeria)",
    channel: "Naija Craft",
    description:
      "Visite de Dada Pottery, la plus grande poterie d'Ilorin au Kwara State (Nigeria). Un maître potier de 60 ans d'expérience partage ses gestes, ses secrets et sa passion du métier.",
    category: "poterie-ceramique",
    year: 2022,
    duration: "12 min",
    rubriques: ["series-documentaires", "parcours-invite", "bibliotheque-audiovisuelle"],
    tags: ["poterie", "Nigeria", "Ilorin", "argile", "maître potier"],
    pays: "Nigeria",
  },
  {
    id: "m18",
    youtubeId: "y5ueGQvZNmk",
    title: "Le Secret de la Poterie au Togo - Techniques Ancestrales",
    channel: "Togo Discovery",
    description:
      "Exploration des techniques de fabrication de poteries et jarres en terre cuite au Togo. Chaque pays d'Afrique de l'Ouest possède un style unique - une leçon de diversité artisanale.",
    category: "poterie-ceramique",
    year: 2022,
    duration: "10 min",
    rubriques: ["series-documentaires", "bibliotheque-audiovisuelle"],
    tags: ["poterie", "Togo", "terre cuite", "technique", "Afrique de l'Ouest"],
    pays: "Togo",
  },
  {
    id: "m19",
    youtubeId: "l1-Ayz-X4kQ",
    title: "ARDMORE - Les Céramistes Africains qui Conquièrent le Monde",
    channel: "Ardmore Ceramic Art",
    description:
      "Découverte d'Ardmore, foyer des céramistes africains les plus talentueux, dont les créations issues du cœur rural du Zululand conquièrent les marchés internationaux.",
    category: "poterie-ceramique",
    year: 2022,
    duration: "9 min",
    rubriques: ["series-documentaires", "bibliotheque-audiovisuelle"],
    tags: ["céramique", "Afrique du Sud", "Zululand", "artiste", "créativité"],
    pays: "Afrique du Sud",
  },
  {
    id: "m20",
    youtubeId: "52HKSwkI1hs",
    title: "Techniques de Poterie en Afrique de l'Ouest - Modelage et Cuisson",
    channel: "African Craft Archive",
    description:
      "Démonstration des cinq techniques de poterie pratiquées au Burkina Faso, Ghana et Nigeria : moulage creux, colombin, estampage. Un référentiel technique précieux sur la céramique africaine.",
    category: "poterie-ceramique",
    year: 2013,
    duration: "14 min",
    rubriques: ["series-documentaires", "bibliotheque-audiovisuelle", "dossiers-thematiques"],
    tags: ["poterie", "Burkina Faso", "Ghana", "Nigeria", "technique", "modelage"],
    pays: "Burkina Faso · Ghana · Nigeria",
  },
  {
    id: "m21",
    youtubeId: "hCGieyTOGr8",
    title: "Femmes Aari - La Poterie Traditionnelle d'Éthiopie",
    channel: "Ethiopia Heritage",
    description:
      "Les femmes Aari de Jinka, dans la région du sud de l'Éthiopie, façonnent des poteries selon des méthodes transmises de mère en fille depuis des siècles. Une technique sans tour, entièrement manuelle.",
    category: "poterie-ceramique",
    year: 2015,
    duration: "6 min",
    rubriques: ["series-documentaires", "bibliotheque-audiovisuelle"],
    tags: ["poterie", "Éthiopie", "Aari", "femmes artisanes", "modelage"],
    pays: "Éthiopie",
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────

export function getMediaByRubrique(slug: string): MediaItem[] {
  return mediaItems.filter((m) => m.rubriques.includes(slug));
}

export function getMediaByCategory(cat: MediaCategory): MediaItem[] {
  return mediaItems.filter((m) => m.category === cat);
}

export function getAllMedia(): MediaItem[] {
  return mediaItems;
}

export const MEDIA_CATEGORIES: { value: MediaCategory; label: string; emoji: string }[] = [
  { value: "griots",             label: "Griots & Tradition Orale",  emoji: "🎙" },
  { value: "bois-sculpture",     label: "Bois & Sculpture",          emoji: "🪵" },
  { value: "textile-tissage",    label: "Textile & Tissage",         emoji: "🧵" },
  { value: "metal-ferronnerie",  label: "Métal & Ferronnerie",       emoji: "⚒" },
  { value: "poterie-ceramique",  label: "Poterie & Céramique",       emoji: "🏺" },
  { value: "musique-instruments",label: "Musique Traditionnelle",    emoji: "🥁" },
  { value: "patrimoine-culture", label: "Patrimoine & Culture",      emoji: "🏛" },
];
