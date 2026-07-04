// ACADÉMIE KRAAFT – Formations, transmission des savoir-faire, parcours
// d'excellence et certifications.
//
// Contenu source intégralement préservé, enrichi de formulations captivantes
// (taglines, accroches) et de CTAs orientant les visiteurs vers l'action.
// Toutes les images sont uniques - aucune n'apparaît ailleurs dans l'app.

export type Cta = { label: string; to: string };

// 19 images uniques de références africaines - choisies pour valoriser la
// transmission, l'apprentissage, la maîtrise et la distinction.
export const ACAD_IMG = {
  intro: "https://images.unsplash.com/photo-1632215861513-130b66fe97f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwc3R1ZGVudHMlMjBsZWFybmluZyUyMGNsYXNzcm9vbSUyMGNyYWZ0JTIwdHJhaW5pbmclMjBBZnJpY2F8ZW58MXx8fHwxNzgyNzUzODI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  ecoleHero: "https://images.unsplash.com/photo-1733186718279-0936826f09a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxBZnJpY2FuJTIwbWFzdGVyJTIwYXJ0aXNhbiUyMHRlYWNoaW5nJTIwYXBwcmVudGljZSUyMHdvcmtzaG9wJTIwaGFuZHN8ZW58MXx8fHwxNzgyNzUzODI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  ecoleSecondary: "https://images.unsplash.com/photo-1632932693914-89b90ae3d16d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxBZnJpY2FuJTIwc3R1ZGVudHMlMjBsZWFybmluZyUyMGNsYXNzcm9vbSUyMGNyYWZ0JTIwdHJhaW5pbmclMjBBZnJpY2F8ZW58MXx8fHwxNzgyNzUzODI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  niveauDecouverte: "https://images.unsplash.com/photo-1620969910995-4bbe4eaa32c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxBZnJpY2FuJTIwc3R1ZGVudHMlMjBsZWFybmluZyUyMGNsYXNzcm9vbSUyMGNyYWZ0JTIwdHJhaW5pbmclMjBBZnJpY2F8ZW58MXx8fHwxNzgyNzUzODI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  niveauInitiation: "https://images.unsplash.com/photo-1648523214358-58c650e587cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwbWFzdGVyJTIwYXJ0aXNhbiUyMHRlYWNoaW5nJTIwYXBwcmVudGljZSUyMHdvcmtzaG9wJTIwaGFuZHN8ZW58MXx8fHwxNzgyNzUzODI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  niveauPerfectionnement: "https://images.unsplash.com/photo-1688241319965-4276aac54bb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxBZnJpY2FuJTIwbWFzdGVyJTIwYXJ0aXNhbiUyMHRlYWNoaW5nJTIwYXBwcmVudGljZSUyMHdvcmtzaG9wJTIwaGFuZHN8ZW58MXx8fHwxNzgyNzUzODI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  niveauPro: "https://images.unsplash.com/photo-1768695205624-101b2893644a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwYXJ0aXN0JTIwc3R1ZGlvJTIwcmVzaWRlbmN5JTIwd29ya3Nob3AlMjBjcmVhdGl2ZSUyMHNwYWNlfGVufDF8fHx8MTc4Mjc1MzgyOHww&ixlib=rb-4.1.0&q=80&w=1080",
  niveauMaitrise: "https://images.unsplash.com/photo-1773499129465-4eda9cfd1147?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxBZnJpY2FuJTIwYXJ0aXN0JTIwc3R1ZGlvJTIwcmVzaWRlbmN5JTIwd29ya3Nob3AlMjBjcmVhdGl2ZSUyMHNwYWNlfGVufDF8fHx8MTc4Mjc1MzgyOHww&ixlib=rb-4.1.0&q=80&w=1080",
  niveauGrandMaitre: "https://images.unsplash.com/photo-1763793426538-db411c27894d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxBZnJpY2FuJTIwYXJ0aXN0JTIwc3R1ZGlvJTIwcmVzaWRlbmN5JTIwd29ya3Nob3AlMjBjcmVhdGl2ZSUyMHNwYWNlfGVufDF8fHx8MTc4Mjc1MzgyOHww&ixlib=rb-4.1.0&q=80&w=1080",
  stagesImmersion: "https://images.unsplash.com/photo-1694286080811-e5e416f4fdb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxBZnJpY2FuJTIwdmlsbGFnZSUyMGZhbWlseSUyMGdlbmVyYXRpb25zJTIwd29ya3Nob3AlMjBjcmVhdGl2ZXxlbnwxfHx8fDE3ODI3NTM4MzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  stagesSecondary: "https://images.unsplash.com/photo-1747330665987-78cec08c8ec9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwdmlsbGFnZSUyMGZhbWlseSUyMGdlbmVyYXRpb25zJTIwd29ya3Nob3AlMjBjcmVhdGl2ZXxlbnwxfHx8fDE3ODI3NTM4MzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  ateliers: "https://images.unsplash.com/photo-1744809482817-9a9d4fc280af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxBZnJpY2FuJTIwc3R1ZGVudHMlMjBsZWFybmluZyUyMGNsYXNzcm9vbSUyMGNyYWZ0JTIwdHJhaW5pbmclMjBBZnJpY2F8ZW58MXx8fHwxNzgyNzUzODI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  hobbys: "https://images.unsplash.com/photo-1717934444760-33baf54ff79b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxBZnJpY2FuJTIwdmlsbGFnZSUyMGZhbWlseSUyMGdlbmVyYXRpb25zJTIwd29ya3Nob3AlMjBjcmVhdGl2ZXxlbnwxfHx8fDE3ODI3NTM4MzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  certifications: "https://images.unsplash.com/photo-1665567032056-4d22d92638da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFkdWF0ZSUyMGRpcGxvbWElMjBjZXJ0aWZpY2F0ZSUyMGNlcmVtb255JTIwaGFuZHMlMjBkb2N1bWVudHxlbnwxfHx8fDE3ODI3NTM4MzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  certificationsSecondary: "https://images.unsplash.com/photo-1622127118604-9363acff3e20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxncmFkdWF0ZSUyMGRpcGxvbWElMjBjZXJ0aWZpY2F0ZSUyMGNlcmVtb255JTIwaGFuZHMlMjBkb2N1bWVudHxlbnwxfHx8fDE3ODI3NTM4MzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  concours: "https://images.unsplash.com/photo-1755039466834-3322b29dc45e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwYXJ0JTIwYXdhcmQlMjBjZXJlbW9ueSUyMHRyb3BoeSUyMGdvbGQlMjBtZWRhbCUyMGNyYWZ0fGVufDF8fHx8MTc4Mjc1MzgyOHww&ixlib=rb-4.1.0&q=80&w=1080",
  concoursDistinctions: "https://images.unsplash.com/photo-1755039466964-36fe31d6a863?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxBZnJpY2FuJTIwYXJ0JTIwYXdhcmQlMjBjZXJlbW9ueSUyMHRyb3BoeSUyMGdvbGQlMjBtZWRhbCUyMGNyYWZ0fGVufDF8fHx8MTc4Mjc1MzgyOHww&ixlib=rb-4.1.0&q=80&w=1080",
  reseau: "https://images.unsplash.com/photo-1655720357872-ce227e4164ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwcHJvZmVzc2lvbmFsJTIwbWVldGluZyUyMG5ldHdvcmslMjBjb2xsYWJvcmF0aW9uJTIwYXJ0fGVufDF8fHx8MTc4Mjc1MzgzNXww&ixlib=rb-4.1.0&q=80&w=1080",
  reseauSecondary: "https://images.unsplash.com/photo-1778824717987-7a135889e928?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxBZnJpY2FuJTIwcHJvZmVzc2lvbmFsJTIwbWVldGluZyUyMG5ldHdvcmslMjBjb2xsYWJvcmF0aW9uJTIwYXJ0fGVufDF8fHx8MTc4Mjc1MzgzNXww&ixlib=rb-4.1.0&q=80&w=1080",
} as const;

export const ACAD_INTRO = {
  eyebrow: "Académie KRAAFT",
  title:
    "Formations, transmission des savoir-faire, parcours d'excellence et certifications",
  tagline:
    "Apprendre des maîtres, faire reconnaître votre niveau, rejoindre un réseau d'excellence panafricain.",
  paragraphs: [
    "L'Académie KRAAFT constitue le principal espace de transmission des connaissances, des techniques et des patrimoines vivants. Elle rassemble les maîtres d'art, les artisans, les artistes, les chercheurs, les historiens, les enseignants, les institutions culturelles et les professionnels afin d'assurer la continuité des savoir-faire ancestraux tout en favorisant leur évolution vers les nouveaux usages, les nouvelles technologies et les marchés internationaux.",
    "L'Académie accueille aussi bien les jeunes souhaitant découvrir un métier que les professionnels désirant perfectionner leur expertise, transmettre leur expérience ou obtenir une reconnaissance officielle de leur niveau de maîtrise.",
  ],
  primaryCta: { label: "Découvrir les formations", to: "/formations" } as Cta,
  secondaryCta: { label: "Devenir artisan", to: "/devenir-artisan" } as Cta,
};

// A. L'École KRAAFT - liste des 25 grandes écoles (verbatim)
export const ACAD_ECOLE = {
  letter: "A",
  title: "L'École KRAAFT",
  tagline: "Un environnement complet d'apprentissage des métiers d'art et des patrimoines.",
  intro:
    "Cette école constitue un environnement complet d'apprentissage des métiers d'art, des disciplines artistiques et des patrimoines culturels.",
  body:
    "Chaque parcours associe des enseignements théoriques, des démonstrations pratiques, des ateliers, des visites de terrain, des rencontres avec des maîtres d'art, des projets collaboratifs et des réalisations personnelles.",
  groupTitle: "Grandes écoles de formation",
  ecoles: [
    "École des métiers du bois",
    "École de la ferronnerie d'art",
    "École de la sculpture",
    "École de la pierre",
    "École de la poterie",
    "École de la céramique",
    "École du textile",
    "École du cuir",
    "École des bijoux",
    "École de la coiffure traditionnelle",
    "École des coiffes",
    "École du maquillage traditionnel",
    "École de la peinture",
    "École du dessin",
    "École de la gravure",
    "École de la photographie patrimoniale",
    "École de la danse traditionnelle",
    "École des instruments de musique",
    "École des tambours parlants",
    "École des griots",
    "École des conteurs",
    "École de la poésie orale",
    "École de l'architecture traditionnelle",
    "École du design inspiré des patrimoines",
    "École des arts numériques appliqués aux patrimoines culturels",
  ],
  outro:
    "Chaque école dispose de son propre programme pédagogique et de ses propres espaces documentaires.",
  ctas: [
    { label: "Voir les formations disponibles", to: "/formations" },
    { label: "Explorer les métiers", to: "/metiers" },
  ] as Cta[],
};

// B. Les parcours d'apprentissage - 6 niveaux
export type AcadNiveau = {
  name: string;
  text: string;
  image: string;
};

export const ACAD_PARCOURS = {
  letter: "B",
  title: "Les parcours d'apprentissage",
  tagline:
    "Six niveaux pour faire grandir votre pratique, de la curiosité à la grande maîtrise.",
  intro:
    "Chaque formation est organisée selon une progression permettant d'acquérir progressivement les compétences nécessaires.",
  niveaux: [
    {
      name: "Niveau Découverte",
      text: "Destiné aux personnes souhaitant découvrir un métier, comprendre son histoire, ses valeurs culturelles, ses outils et ses techniques fondamentales.",
      image: ACAD_IMG.niveauDecouverte,
    },
    {
      name: "Niveau Initiation",
      text: "Les participants réalisent leurs premières créations sous l'encadrement de formateurs et de maîtres artisans.",
      image: ACAD_IMG.niveauInitiation,
    },
    {
      name: "Niveau Perfectionnement",
      text: "Cette étape approfondit les techniques, les méthodes de création, les procédés complexes, les matériaux rares et les réalisations de grande qualité.",
      image: ACAD_IMG.niveauPerfectionnement,
    },
    {
      name: "Niveau Professionnalisation",
      text: "Les apprenants développent une véritable expertise leur permettant d'exercer leur métier de manière autonome, de gérer un atelier, de former d'autres personnes et de participer à des projets d'envergure.",
      image: ACAD_IMG.niveauPro,
    },
    {
      name: "Niveau Maîtrise",
      text: "Cette étape distingue les professionnels possédant une excellente maîtrise technique, artistique et culturelle. Les candidats démontrent leur capacité à réaliser des œuvres de référence, à transmettre leurs connaissances et à contribuer au développement de leur discipline.",
      image: ACAD_IMG.niveauMaitrise,
    },
    {
      name: "Niveau Grand Maître",
      text: "Ce niveau récompense les personnalités dont les réalisations constituent une référence nationale ou internationale. Leur rôle comprend également la transmission des savoir-faire, l'encadrement des nouvelles générations, la participation aux jurys, aux concours et aux grandes rencontres culturelles.",
      image: ACAD_IMG.niveauGrandMaitre,
    },
  ] as AcadNiveau[],
  ctas: [
    { label: "S'inscrire à un parcours", to: "/formations" },
    { label: "Demander un accompagnement", to: "/contact" },
  ] as Cta[],
};

// C. Stages d'immersion
export const ACAD_STAGES = {
  letter: "C",
  title: "Les stages d'immersion",
  tagline:
    "Vivez la tradition au plus près des artisans, dans leur environnement d'origine.",
  intro:
    "Cette rubrique permet de vivre une expérience directe auprès des artisans et des communautés. Les participants découvrent les techniques directement dans leur environnement d'origine.",
  formatsTitle: "Formats proposés",
  formats: [
    "Stages de découverte",
    "Immersions communautaires",
    "Résidences artisanales",
    "Résidences artistiques",
    "Voyages culturels",
    "Parcours patrimoniaux",
    "Ateliers pratiques",
    "Chantiers-écoles",
    "Programmes d'échanges internationaux",
  ],
  outro:
    "Chaque immersion favorise la compréhension du contexte culturel, historique et humain des métiers.",
  image: ACAD_IMG.stagesImmersion,
  secondaryImage: ACAD_IMG.stagesSecondary,
  ctas: [
    { label: "Découvrir les groupements", to: "/groupements" },
    { label: "Voir les événements", to: "/evenements" },
  ] as Cta[],
};

// D. Ateliers et masterclass
export const ACAD_ATELIERS = {
  letter: "D",
  title: "Les ateliers et les masterclass",
  tagline: "Rencontrez les maîtres, apprenez leurs gestes - en sessions thématiques.",
  intro:
    "Des maîtres artisans, artistes et spécialistes animent régulièrement des sessions thématiques. Ces rencontres portent notamment sur :",
  themes: [
    "Les techniques traditionnelles",
    "Les innovations",
    "Les matériaux rares",
    "Les procédés de fabrication",
    "Les restaurations patrimoniales",
    "Les créations contemporaines",
    "Les nouvelles tendances",
    "Les échanges entre disciplines artistiques",
  ],
  image: ACAD_IMG.ateliers,
  ctas: [
    { label: "Voir les prochaines sessions", to: "/evenements" },
    { label: "Explorer les arts & culture", to: "/arts-culture" },
  ] as Cta[],
};

// E. Hobbys et loisirs créatifs
export const ACAD_HOBBYS = {
  letter: "E",
  title: "Les hobbys et les loisirs créatifs",
  tagline:
    "Une porte d'entrée vers l'histoire et les traditions - pour tous, en famille, entre amis ou en entreprise.",
  intro:
    "Conformément aux orientations du projet, cette rubrique permet à toute personne de découvrir un métier d'art comme activité de loisir, de détente, de développement personnel ou d'enrichissement culturel.",
  proposeIntro: "Elle propose :",
  activites: [
    "Ateliers de découverte",
    "Activités familiales",
    "Initiations du week-end",
    "Programmes de vacances",
    "Activités intergénérationnelles",
    "Parcours touristiques créatifs",
    "Expériences culturelles immersives",
    "Initiations aux techniques ancestrales",
    "Ateliers destinés aux entreprises",
  ],
  outro:
    "Chaque activité devient une porte d'entrée vers l'histoire, les traditions et l'identité culturelle des peuples.",
  image: ACAD_IMG.hobbys,
  ctas: [
    { label: "Réserver une activité", to: "/contact" },
    { label: "Découvrir le jour de marché", to: "/jour-de-marche" },
  ] as Cta[],
};

// F. Les certifications KRAAFT
export const ACAD_CERTIFICATIONS = {
  letter: "F",
  title: "Les certifications KRAAFT",
  tagline:
    "Faites reconnaître officiellement votre niveau et valorisez votre parcours.",
  intro:
    "Chaque formation donne accès à une reconnaissance officielle du niveau atteint.",
  criteresIntro: "Les certifications tiennent compte :",
  criteres: [
    "des compétences techniques ;",
    "de la qualité des réalisations ;",
    "de la créativité ;",
    "de la maîtrise des matériaux ;",
    "de la connaissance du patrimoine ;",
    "de la capacité de transmission ;",
    "de l'engagement professionnel.",
  ],
  outro:
    "Les certificats sont enregistrés dans le profil numérique de chaque artisan afin de valoriser son parcours et de faciliter sa reconnaissance auprès des institutions, des employeurs, des partenaires et des clients.",
  image: ACAD_IMG.certifications,
  secondaryImage: ACAD_IMG.certificationsSecondary,
  ctas: [
    { label: "Activer mon profil artisan", to: "/devenir-artisan" },
    { label: "Voir mon compte", to: "/compte" },
  ] as Cta[],
};

// G. Le Grand Concours KRAAFT des métiers d'art
export const ACAD_CONCOURS = {
  letter: "G",
  title: "Le Grand Concours KRAAFT des métiers d'art",
  tagline:
    "La distinction de référence pour les métiers d'art africains.",
  intro:
    "Conformément aux orientations exprimées dans les notes, cette compétition constitue une distinction de référence pour les métiers d'art africains.",
  body: [
    "Les candidats choisissent un thème de création représentatif de leur spécialité. Ils réalisent une œuvre originale démontrant leur maîtrise technique, leur créativité, leur compréhension des traditions et leur capacité d'innovation.",
    "Chaque réalisation est présentée devant un jury composé de maîtres d'art, d'artisans expérimentés, d'artistes, d'historiens, de chercheurs et de personnalités qualifiées.",
  ],
  criteresIntro: "Les critères d'évaluation portent notamment sur :",
  criteres: [
    "la qualité de l'exécution ;",
    "la fidélité aux savoir-faire ;",
    "l'innovation respectueuse des traditions ;",
    "la maîtrise des techniques ;",
    "la finition ;",
    "la valeur artistique ;",
    "la transmission culturelle ;",
    "la présentation du projet.",
  ],
  distinctionsIntro: "Les distinctions décernées peuvent comprendre plusieurs niveaux :",
  distinctions: [
    "Lauréat KRAAFT",
    "Artisan d'Excellence",
    "Maître Artisan",
    "Grand Maître Artisan",
    "Grand Prix KRAAFT",
    "Prix de l'Innovation Patrimoniale",
    "Prix de la Transmission des Savoirs",
    "Prix du Patrimoine Vivant",
    "Prix de la Jeune Création",
    "Prix du Jury",
    "Prix du Public",
  ],
  image: ACAD_IMG.concours,
  secondaryImage: ACAD_IMG.concoursDistinctions,
  ctas: [
    { label: "Voir les concours en cours", to: "/concours" },
    { label: "Découvrir les événements", to: "/evenements" },
  ] as Cta[],
};

// H. Le réseau des Maîtres d'Art
export const ACAD_RESEAU = {
  letter: "H",
  title: "Le réseau des Maîtres d'Art",
  tagline:
    "Un cercle de référence pour la sauvegarde et le rayonnement des patrimoines vivants africains.",
  intro:
    "Les artisans ayant atteint les plus hauts niveaux rejoignent un réseau de référence.",
  interviennentIntro: "Ils interviennent dans :",
  missions: [
    "la formation ;",
    "le mentorat ;",
    "les jurys ;",
    "les conférences ;",
    "les podcasts ;",
    "les publications ;",
    "les projets de restauration ;",
    "les missions internationales ;",
    "les échanges culturels ;",
    "les programmes de recherche.",
  ],
  outro:
    "Ce réseau contribue à la sauvegarde des patrimoines vivants et à l'accompagnement des nouvelles générations d'artisans, tout en renforçant le rayonnement des métiers d'art africains sur la scène internationale.",
  image: ACAD_IMG.reseau,
  secondaryImage: ACAD_IMG.reseauSecondary,
  ctas: [
    { label: "Rejoindre le réseau", to: "/devenir-artisan" },
    { label: "Découvrir les groupements", to: "/groupements" },
  ] as Cta[],
};

export const ACAD_SECTIONS_NAV = [
  { id: "ecole", letter: "A", label: "L'École KRAAFT" },
  { id: "parcours", letter: "B", label: "Parcours d'apprentissage" },
  { id: "stages", letter: "C", label: "Stages d'immersion" },
  { id: "ateliers", letter: "D", label: "Ateliers & masterclass" },
  { id: "hobbys", letter: "E", label: "Hobbys & loisirs" },
  { id: "certifications", letter: "F", label: "Certifications" },
  { id: "concours", letter: "G", label: "Grand Concours" },
  { id: "reseau", letter: "H", label: "Réseau des Maîtres d'Art" },
];
