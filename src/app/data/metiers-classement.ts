// Classement général des métiers, spécialités, familles et branches d'activités.
// Contenu repris intégralement et tel quel depuis la source éditoriale IPPOO KRAAFT.
//
// RÈGLE STRICTE : chaque image ci-dessous est UNIQUE (aucune image n'est utilisée
// deux fois, ni dans ce fichier, ni ailleurs dans l'application).

export type MetierSpecialty = {
  title: string;
  text: string;
  image: string;
};

export type MetierFamily = {
  slug: string;
  letter: string;
  title: string;
  intro: string;
  heroImage: string;
  cardImage: string;
  specialties: MetierSpecialty[];
  /** Paragraphes complémentaires de la famille, sans titre dédié. */
  extra?: string[];
};

// Images uniques - références africaines valorisantes.
const IMG = {
  // Intro générale du classement
  intro: "https://images.unsplash.com/photo-1755781849220-8776d7a186c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxBZnJpY2FuJTIwd29vZCUyMGNhcnZpbmclMjBtYXNrJTIwc3RhdHVlJTIwYXJ0aXNhbiUyMHdvcmtzaG9wJTIwc2N1bHB0dXJlfGVufDF8fHx8MTc4Mjc1MjA4NHww&ixlib=rb-4.1.0&q=80&w=1080",
  // Bois
  boisHero: "https://images.unsplash.com/photo-1640532927678-a44dcff6127d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxBZnJpY2FuJTIwd29vZCUyMGNhcnZpbmclMjBtYXNrJTIwc3RhdHVlJTIwYXJ0aXNhbiUyMHdvcmtzaG9wJTIwc2N1bHB0dXJlfGVufDF8fHx8MTc4Mjc1MjA4NHww&ixlib=rb-4.1.0&q=80&w=1080",
  boisCard: "https://images.unsplash.com/photo-1698067747142-8f095bf8285d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHxBZnJpY2FuJTIwd29vZCUyMGNhcnZpbmclMjBtYXNrJTIwc3RhdHVlJTIwYXJ0aXNhbiUyMHdvcmtzaG9wJTIwc2N1bHB0dXJlfGVufDF8fHx8MTc4Mjc1MjA4NHww&ixlib=rb-4.1.0&q=80&w=1080",
  boisSculpture: "https://images.unsplash.com/photo-1621419203897-20b66b98d495?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwd29vZCUyMGNhcnZpbmclMjBtYXNrJTIwc3RhdHVlJTIwYXJ0aXNhbiUyMHdvcmtzaG9wJTIwc2N1bHB0dXJlfGVufDF8fHx8MTc4Mjc1MjA4NHww&ixlib=rb-4.1.0&q=80&w=1080",
  boisMenuiserie: "https://images.unsplash.com/photo-1634803094981-88e3db7fb491?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxBZnJpY2FuJTIwd29vZCUyMGNhcnZpbmclMjBtYXNrJTIwc3RhdHVlJTIwYXJ0aXNhbiUyMHdvcmtzaG9wJTIwc2N1bHB0dXJlfGVufDF8fHx8MTc4Mjc1MjA4NHww&ixlib=rb-4.1.0&q=80&w=1080",
  boisTournerie: "https://images.unsplash.com/photo-1600441504741-7a862f788a97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxBZnJpY2FuJTIwd29vZCUyMGNhcnZpbmclMjBtYXNrJTIwc3RhdHVlJTIwYXJ0aXNhbiUyMHdvcmtzaG9wJTIwc2N1bHB0dXJlfGVufDF8fHx8MTc4Mjc1MjA4NHww&ixlib=rb-4.1.0&q=80&w=1080",
  boisMarqueterie: "https://images.unsplash.com/photo-1562219790-10a31e75d2a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw5fHxBZnJpY2FuJTIwd29vZCUyMGNhcnZpbmclMjBtYXNrJTIwc3RhdHVlJTIwYXJ0aXNhbiUyMHdvcmtzaG9wJTIwc2N1bHB0dXJlfGVufDF8fHx8MTc4Mjc1MjA4NHww&ixlib=rb-4.1.0&q=80&w=1080",
  // Ferronnerie d'Art
  ferHero: "https://images.unsplash.com/photo-1751826391831-b04cb16024bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxibGFja3NtaXRoJTIwYnJvbnplJTIwbWV0YWx3b3JrJTIwZm9yZ2UlMjBpcm9uJTIwc2N1bHB0dXJlJTIwY3JhZnR8ZW58MXx8fHwxNzgyNzUyMDkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  ferCard: "https://images.unsplash.com/photo-1511306162219-1c5a469ab86c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFja3NtaXRoJTIwYnJvbnplJTIwbWV0YWx3b3JrJTIwZm9yZ2UlMjBpcm9uJTIwc2N1bHB0dXJlJTIwY3JhZnR8ZW58MXx8fHwxNzgyNzUyMDkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  ferTraditionnelle: "https://images.unsplash.com/photo-1528918832583-cd56bc35dbc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxibGFja3NtaXRoJTIwYnJvbnplJTIwbWV0YWx3b3JrJTIwZm9yZ2UlMjBpcm9uJTIwc2N1bHB0dXJlJTIwY3JhZnR8ZW58MXx8fHwxNzgyNzUyMDkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  ferArtistique: "https://images.unsplash.com/photo-1473621038790-b778b4750efe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxibGFja3NtaXRoJTIwYnJvbnplJTIwbWV0YWx3b3JrJTIwZm9yZ2UlMjBpcm9uJTIwc2N1bHB0dXJlJTIwY3JhZnR8ZW58MXx8fHwxNzgyNzUyMDkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  ferSculptureMetal: "https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxibGFja3NtaXRoJTIwYnJvbnplJTIwbWV0YWx3b3JrJTIwZm9yZ2UlMjBpcm9uJTIwc2N1bHB0dXJlJTIwY3JhZnR8ZW58MXx8fHwxNzgyNzUyMDkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  ferFamilles: "https://images.unsplash.com/photo-1624382497293-612793216d36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHxibGFja3NtaXRoJTIwYnJvbnplJTIwbWV0YWx3b3JrJTIwZm9yZ2UlMjBpcm9uJTIwc2N1bHB0dXJlJTIwY3JhZnR8ZW58MXx8fHwxNzgyNzUyMDkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  ferInfluences: "https://images.unsplash.com/photo-1624382497260-64421ae0afd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw5fHxibGFja3NtaXRoJTIwYnJvbnplJTIwbWV0YWx3b3JrJTIwZm9yZ2UlMjBpcm9uJTIwc2N1bHB0dXJlJTIwY3JhZnR8ZW58MXx8fHwxNzgyNzUyMDkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  // Pierre
  pierreHero: "https://images.unsplash.com/photo-1447758902204-48010b87c24d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9uZSUyMHNjdWxwdHVyZSUyMGNhcnZpbmclMjBhcnRpc2FufGVufDF8fHx8MTc4Mjc1MjEwNXww&ixlib=rb-4.1.0&q=80&w=1080",
  pierreCard: "https://images.unsplash.com/photo-1771573391561-ab2bfc7e27a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxzdG9uZSUyMHNjdWxwdHVyZSUyMGNhcnZpbmclMjBhcnRpc2FufGVufDF8fHx8MTc4Mjc1MjEwNXww&ixlib=rb-4.1.0&q=80&w=1080",
  pierreTaille: "https://images.unsplash.com/photo-1703258574645-060c9a9cf918?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxzdG9uZSUyMHNjdWxwdHVyZSUyMGNhcnZpbmclMjBhcnRpc2FufGVufDF8fHx8MTc4Mjc1MjEwNXww&ixlib=rb-4.1.0&q=80&w=1080",
  // Argile et Terre
  argileHero: "https://images.unsplash.com/photo-1524497440-4da55062cb4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxBZnJpY2FuJTIwcG90dGVyeSUyMGNsYXklMjBjZXJhbWljJTIwdGVycmFjb3R0YSUyMHZhc2VzJTIwaGFuZG1hZGV8ZW58MXx8fHwxNzgyNzUyMTE0fDA&ixlib=rb-4.1.0&q=80&w=1080",
  argileCard: "https://images.unsplash.com/photo-1699371830139-cb02e94878f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxBZnJpY2FuJTIwcG90dGVyeSUyMGNsYXklMjBjZXJhbWljJTIwdGVycmFjb3R0YSUyMHZhc2VzJTIwaGFuZG1hZGV8ZW58MXx8fHwxNzgyNzUyMTE0fDA&ixlib=rb-4.1.0&q=80&w=1080",
  argilePoterie: "https://images.unsplash.com/photo-1697410154169-b2bbf83758e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxBZnJpY2FuJTIwcG90dGVyeSUyMGNsYXklMjBjZXJhbWljJTIwdGVycmFjb3R0YSUyMHZhc2VzJTIwaGFuZG1hZGV8ZW58MXx8fHwxNzgyNzUyMTE0fDA&ixlib=rb-4.1.0&q=80&w=1080",
  argileCeramique: "https://images.unsplash.com/photo-1520408222757-6f9f95d87d5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwcG90dGVyeSUyMGNsYXklMjBjZXJhbWljJTIwdGVycmFjb3R0YSUyMHZhc2VzJTIwaGFuZG1hZGV8ZW58MXx8fHwxNzgyNzUyMTE0fDA&ixlib=rb-4.1.0&q=80&w=1080",
  argileTerreCuite: "https://images.unsplash.com/photo-1510828561531-05a3388f6d3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxBZnJpY2FuJTIwcG90dGVyeSUyMGNsYXklMjBjZXJhbWljJTIwdGVycmFjb3R0YSUyMHZhc2VzJTIwaGFuZG1hZGV8ZW58MXx8fHwxNzgyNzUyMTE0fDA&ixlib=rb-4.1.0&q=80&w=1080",
  // Textile
  textileHero: "https://images.unsplash.com/photo-1734868032501-448d1457dc38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxBZnJpY2FuJTIwdGV4dGlsZSUyMHdlYXZpbmclMjBsb29tJTIwaW5kaWdvJTIwZHllJTIwa2VudGUlMjBmYWJyaWN8ZW58MXx8fHwxNzgyNzUyMTIwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  textileCard: "https://images.unsplash.com/photo-1660695828403-b42e117e0b4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxBZnJpY2FuJTIwdGV4dGlsZSUyMHdlYXZpbmclMjBsb29tJTIwaW5kaWdvJTIwZHllJTIwa2VudGUlMjBmYWJyaWN8ZW58MXx8fHwxNzgyNzUyMTIwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  textileTissage: "https://images.unsplash.com/photo-1775471234428-791a8ff6008e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxBZnJpY2FuJTIwd29tYW4lMjB3ZWF2aW5nJTIwYmFza2V0JTIwY29sb3JmdWwlMjBjbG90aCUyMG1hcmtldCUyMHN0YWxsfGVufDF8fHx8MTc4Mjc1MjEyN3ww&ixlib=rb-4.1.0&q=80&w=1080",
  textileEstampage: "https://images.unsplash.com/photo-1765115070689-43485654f37b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxBZnJpY2FuJTIwd29tYW4lMjB3ZWF2aW5nJTIwYmFza2V0JTIwY29sb3JmdWwlMjBjbG90aCUyMG1hcmtldCUyMHN0YWxsfGVufDF8fHx8MTc4Mjc1MjEyN3ww&ixlib=rb-4.1.0&q=80&w=1080",
  textileBroderie: "https://images.unsplash.com/photo-1592169138776-7c9211066fc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwZW1icm9pZGVyeSUyMHRleHRpbGUlMjBoYW5kJTIwc3RpdGNoaW5nJTIwY29sb3JmdWx8ZW58MXx8fHwxNzgyNzQ5NjgzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  textileTeinture: "https://images.unsplash.com/photo-1602229235490-d2d76988115a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxBZnJpY2FuJTIwZW1icm9pZGVyeSUyMHRleHRpbGUlMjBoYW5kJTIwc3RpdGNoaW5nJTIwY29sb3JmdWx8ZW58MXx8fHwxNzgyNzQ5NjgzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  textileCouture: "https://images.unsplash.com/photo-1775688425905-a4539d6160da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxBZnJpY2FuJTIwdGV4dGlsZSUyMHdlYXZpbmclMjBsb29tJTIwaW5kaWdvJTIwZHllJTIwa2VudGUlMjBmYWJyaWN8ZW58MXx8fHwxNzgyNzUyMTIwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  // Cuir
  cuirHero: "https://images.unsplash.com/photo-1744808336885-c6b2425c3f1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxsZWF0aGVyJTIwY3JhZnRzbWFuJTIwd29ya3Nob3AlMjBiYWclMjBzYW5kYWxzJTIwaGFuZG1hZGUlMjBBZnJpY2F8ZW58MXx8fHwxNzgyNzUyMTUxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  cuirCard: "https://images.unsplash.com/photo-1739743419493-3673d82393d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxsZWF0aGVyJTIwY3JhZnRzbWFuJTIwd29ya3Nob3AlMjBiYWclMjBzYW5kYWxzJTIwaGFuZG1hZGUlMjBBZnJpY2F8ZW58MXx8fHwxNzgyNzUyMTUxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  cuirSavoirFaire: "https://images.unsplash.com/photo-1647502191516-68a4f8c74ed4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b29sZWQlMjBsZWF0aGVyJTIwY3JhZnQlMjBlbmdyYXZlZCUyMHBhdHRlcm4lMjBoYW5kbWFkZXxlbnwxfHx8fDE3ODI3NDk2ODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
} as const;

export const METIERS_INTRO = {
  image: IMG.intro,
  title:
    "Classement général des métiers, spécialités, familles et branches d'activités",
  paragraphs: [
    "La rubrique consacrée au classement général des métiers, spécialités, familles et branches d'activités constitue la plus vaste base de données du portail IPPOO KRAAFT. Elle a pour vocation de référencer, structurer, documenter et valoriser l'ensemble des métiers d'art, des savoir-faire artisanaux, des expressions artistiques et des métiers patrimoniaux au sein d'une classification homogène. Chaque métier bénéficie d'une fiche détaillée qui met en lumière son histoire, ses techniques, ses matériaux, ses outils, ses usages, ses influences culturelles, son implantation géographique, les communautés d'origine, les évolutions contemporaines, les formations associées, les maîtres d'art et les réalisations emblématiques.",
    "L'organisation générale repose sur une hiérarchie progressive favorisant une navigation fluide à travers les grandes familles professionnelles, les secteurs, les spécialités et les sous-spécialités, afin de guider naturellement les visiteurs dans la découverte des univers artisanaux.",
  ],
};

export const metierFamilies: MetierFamily[] = [
  {
    slug: "bois",
    letter: "A",
    title: "Métiers du Bois",
    intro:
      "La famille des métiers du bois réunit toutes les professions qui utilisent le bois comme matériau principal ou complémentaire. Elle illustre l'harmonie entre tradition, création et utilité à travers des disciplines d'une grande diversité.",
    heroImage: IMG.boisHero,
    cardImage: IMG.boisCard,
    specialties: [
      {
        title: "La sculpture sur bois",
        text: "La sculpture sur bois se consacre à la création d'œuvres artistiques, d'objets rituels, d'objets royaux, de masques, de statues, de mobiliers, de portes sculptées, de piliers, de totems, de cannes de commandement, d'emblèmes traditionnels et d'éléments architecturaux. Cette discipline se déploie en plusieurs sous-spécialités telles que la sculpture monumentale, la sculpture miniature, la sculpture religieuse, la sculpture cultuelle, la sculpture décorative, la sculpture architecturale, la sculpture funéraire, la sculpture royale, la sculpture symbolique ainsi que la sculpture contemporaine inspirée des traditions.",
        image: IMG.boisSculpture,
      },
      {
        title: "La menuiserie artisanale",
        text: "La menuiserie artisanale exprime la précision et la noblesse du travail manuel à travers la création de mobilier traditionnel et contemporain, de coffres, armoires, tabourets royaux, sièges cérémoniels, portes sculptées, fenêtres traditionnelles, charpentes, pirogues et instruments agricoles.",
        image: IMG.boisMenuiserie,
      },
      {
        title: "La tournerie sur bois",
        text: "La tournerie sur bois traduit la perfection du geste et la maîtrise du volume. Elle s'illustre dans la fabrication de bols, mortiers, pilons, calebasses en bois, plateaux, manches d'outils, jouets, objets décoratifs et accessoires domestiques.",
        image: IMG.boisTournerie,
      },
      {
        title: "La marqueterie",
        text: "La marqueterie incarne l'art de composer avec les essences de bois pour créer des décors raffinés destinés au mobilier, aux objets de prestige, aux instruments de musique et aux éléments architecturaux.",
        image: IMG.boisMarqueterie,
      },
    ],
  },
  {
    slug: "ferronnerie-art",
    letter: "B",
    title: "Métiers de la Ferronnerie d'Art",
    intro:
      "Le terme Ferronnerie d'Art remplace celui de métallurgie afin de valoriser toute la dimension artistique et patrimoniale de ce domaine. Cette famille englobe les techniques ancestrales aussi bien que les créations contemporaines. Elle met en avant les lignées historiques de forgerons africains, les familles artisanales emblématiques, les traditions royales et les influences régionales qui forment la richesse de cet héritage.",
    heroImage: IMG.ferHero,
    cardImage: IMG.ferCard,
    specialties: [
      {
        title: "La ferronnerie traditionnelle",
        text: "La ferronnerie traditionnelle rassemble la fabrication d'outils agricoles, d'armes traditionnelles, de couteaux, de machettes, de lances, de flèches, de pointes, de houes, de haches, de faucilles, de marteaux et d'enclumes. Ces réalisations incarnent la précision du geste, la durabilité et la fonctionnalité des objets issus du savoir-faire africain.",
        image: IMG.ferTraditionnelle,
      },
      {
        title: "La ferronnerie artistique",
        text: "La ferronnerie artistique ouvre la voie à la création plastique et à la sculpture contemporaine en métal. Elle comprend la réalisation de sculptures, œuvres monumentales, portails, balustrades, luminaires, objets décoratifs, mobilier, enseignes, trophées et œuvres contemporaines qui reflètent le dialogue entre tradition et modernité.",
        image: IMG.ferArtistique,
      },
      {
        title: "La sculpture sur métal",
        text: "La sculpture sur métal occupe une place spécifique au sein de cette famille et regroupe la fonte artistique, le moulage, le travail du bronze, du cuivre, du laiton, de l'aluminium, de l'acier, du fer forgé et des alliages. Chaque procédé révèle des techniques traditionnelles et modernes transmises par des maîtres artisans.",
        image: IMG.ferSculptureMetal,
      },
      {
        title: "Les grandes familles historiques de ferronniers",
        text: "Les grandes familles historiques de ferronniers bénéficient d'une présentation approfondie retraçant leur origine, leurs réalisations, leur rôle auprès des royaumes et leur influence culturelle. Les familles Hountondji d'Abomey, les grands forgerons d'Oyo, les traditions royales dahoméennes et les maîtres des royaumes africains illustrent la transmission intergénérationnelle de ces savoirs.",
        image: IMG.ferFamilles,
      },
      {
        title: "Les influences internationales",
        text: "Les influences internationales démontrent la portée universelle de la ferronnerie africaine en mettant en évidence les liens historiques entre artisans du continent et grandes maisons de luxe. Les savoir-faire du bronze, du cuivre, l'artisanat d'Agadez, la Croix d'Agadez et les collaborations artistiques internationales illustrent la dimension mondiale de ces traditions.",
        image: IMG.ferInfluences,
      },
    ],
  },
  {
    slug: "pierre",
    letter: "C",
    title: "Métiers de la Pierre",
    intro:
      "Les métiers de la pierre rassemblent des savoirs d'exception tels que la taille de pierre, la sculpture monumentale et décorative, la sculpture architecturale, la gravure, le bas-relief, le haut-relief, le polissage, la mosaïque et la marbrerie artisanale. Ces pratiques artisanales révèlent la force du matériau, la précision du geste, et la valeur symbolique qui relient l'art de la pierre à la fois au patrimoine architectural et à la sculpture d'expression.",
    heroImage: IMG.pierreHero,
    cardImage: IMG.pierreCard,
    specialties: [
      {
        title: "Taille, sculpture et gravure de la pierre",
        text: "Les métiers de la pierre rassemblent des savoirs d'exception tels que la taille de pierre, la sculpture monumentale et décorative, la sculpture architecturale, la gravure, le bas-relief, le haut-relief, le polissage, la mosaïque et la marbrerie artisanale. Ces pratiques artisanales révèlent la force du matériau, la précision du geste, et la valeur symbolique qui relient l'art de la pierre à la fois au patrimoine architectural et à la sculpture d'expression.",
        image: IMG.pierreTaille,
      },
    ],
  },
  {
    slug: "argile-terre",
    letter: "D",
    title: "Métiers de l'Argile et de la Terre",
    intro:
      "Les métiers de l'argile et de la terre valorisent la maîtrise des éléments naturels et l'inventivité des artisans.",
    heroImage: IMG.argileHero,
    cardImage: IMG.argileCard,
    specialties: [
      {
        title: "La poterie",
        text: "La poterie se distingue dans les domaines domestiques, rituels, culinaires, décoratifs et architecturaux, témoignant d'une harmonie entre utilité, spiritualité et esthétique.",
        image: IMG.argilePoterie,
      },
      {
        title: "La céramique",
        text: "La céramique s'affirme dans ses expressions traditionnelles, artistiques et contemporaines, intégrant les savoirs liés aux émaux, à la faïence et aux porcelaines artisanales. Chaque création célèbre la matière transformée par le feu et la poésie du geste artisanal.",
        image: IMG.argileCeramique,
      },
      {
        title: "La terre cuite",
        text: "La terre cuite réunit la fabrication de statuettes, objets décoratifs, tuiles, briques, revêtements et éléments architecturaux. Ces œuvres rappellent la continuité d'un art millénaire intégré à la vie quotidienne et aux traditions spirituelles.",
        image: IMG.argileTerreCuite,
      },
    ],
  },
  {
    slug: "textile",
    letter: "E",
    title: "Métiers du Textile",
    intro:
      "Les métiers du textile occupent une place essentielle dans l'univers du portail IPPOO KRAAFT. Cette grande famille met en lumière les tissus, les étoffes, les techniques de tissage, les procédés de décoration et les lignées artisanales qui perpétuent une tradition d'excellence et de beauté.",
    heroImage: IMG.textileHero,
    cardImage: IMG.textileCard,
    specialties: [
      {
        title: "Le tissage",
        text: "Le tissage illustre une grande variété de pratiques à travers les métiers à tisser traditionnels et modernes, les tissages royaux, cérémoniels, décoratifs et contemporains. Cette discipline révèle une science du fil et de la couleur propre à chaque région.",
        image: IMG.textileTissage,
      },
      {
        title: "L'estampage sur textile",
        text: "L'estampage sur textile met en valeur les familles historiques, les lignées artisanales, les techniques de fabrication, les procédés traditionnels, la symbolique des motifs et les significations culturelles associées. Ces savoir-faire racontent autant les histoires des communautés que celles des civilisations tisserandes.",
        image: IMG.textileEstampage,
      },
      {
        title: "La broderie",
        text: "La broderie unit la patience et l'art du détail dans ses formes traditionnelles, royales, religieuses et contemporaines. Elle incarne la maîtrise du fil, la précision du geste et la transmission du sens à travers l'ornement.",
        image: IMG.textileBroderie,
      },
      {
        title: "La teinture",
        text: "La teinture explore la richesse des pigments naturels, de l'indigo et des colorations végétales qui animent les tissus de nuances profondes. Les techniques régionales et les traditions ancestrales de coloration préservent l'identité des territoires et témoignent de la force symbolique de la couleur.",
        image: IMG.textileTeinture,
      },
      {
        title: "La couture artisanale",
        text: "La couture artisanale regroupe la création de vêtements traditionnels, royaux, cérémoniels et contemporains inspirés des traditions. Chaque pièce exprime la rencontre entre patrimoine et modernité, et célèbre l'élégance unique des formes vestimentaires africaines.",
        image: IMG.textileCouture,
      },
    ],
  },
  {
    slug: "cuir",
    letter: "F",
    title: "Métiers du Cuir",
    intro:
      "Les métiers du cuir se distinguent par la maîtrise des peaux et la richesse des savoir-faire transmis à travers les âges. Une attention particulière est accordée au cuir repoussé, qui constitue une spécialité majeure et reflète la profondeur symbolique des arts du cuir.",
    heroImage: IMG.cuirHero,
    cardImage: IMG.cuirCard,
    specialties: [
      {
        title: "Les savoir-faire du cuir",
        text: "Cette famille englobe la préparation des peaux, le tannage, le travail du cuir repoussé, la gravure sur cuir, la maroquinerie, la sellerie, la conception de chaussures, ceintures, sacs, objets décoratifs et accessoires royaux. Elle valorise les traditions des régions sahéliennes, berbères et touarègues ainsi que les influences historiques ayant soutenu la diffusion de ces techniques raffinées.",
        image: IMG.cuirSavoirFaire,
      },
    ],
    extra: [
      "Les artisans du cuir perpétuent un héritage ancien, façonné par la création d'objets utilitaires et symboliques, véritables témoins de l'identité culturelle et du génie manuel africain.",
    ],
  },
];

export function getMetierFamily(slug: string): MetierFamily | undefined {
  return metierFamilies.find((f) => f.slug === slug);
}
