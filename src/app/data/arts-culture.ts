// Les arts complémentaires, les expressions culturelles et les langages identitaires
//
// Contenu source intégralement préservé, enrichi de formulations captivantes
// pour les visiteurs et de CTAs orientant vers la suite du parcours. Toutes
// les images sont uniques, distinctes du reste de l'application.

export type ArtSection = {
  title: string;
  text: string;
  image: string;
};

export type ArtCta = {
  label: string;
  to: string;
};

export type ArtFamily = {
  slug: string;
  letter: string;
  title: string;
  tagline: string; // accroche éditoriale courte
  intro: string;   // texte source original
  heroImage: string;
  cardImage: string;
  sections: ArtSection[];
  /** Paragraphes complémentaires de la famille, sans titre dédié. */
  extra?: string[];
  ctas: ArtCta[];   // appels à l'action
};

// 41 images uniques de références africaines - aucune n'est utilisée
// ailleurs dans l'app (ni dans `IMAGES`, ni dans le classement des métiers).
const IMG = {
  intro: "https://images.unsplash.com/photo-1515658323406-25d61c141a6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwZGFuY2UlMjBjZWxlYnJhdGlvbiUyMGNvbG9yZnVsJTIwY3VsdHVyYWwlMjBmZXN0aXZhbCUyMGdyb3VwfGVufDF8fHx8MTc4Mjc1MzI4OHww&ixlib=rb-4.1.0&q=80&w=1080",
  introSecondary: "https://images.unsplash.com/photo-1660675133902-acd1b057f75d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxBZnJpY2FuJTIwZGFuY2UlMjBjZWxlYnJhdGlvbiUyMGNvbG9yZnVsJTIwY3VsdHVyYWwlMjBmZXN0aXZhbCUyMGdyb3VwfGVufDF8fHx8MTc4Mjc1MzI4OHww&ixlib=rb-4.1.0&q=80&w=1080",

  // A. Coiffure
  coifCard: "https://images.unsplash.com/photo-1572955304332-bf714bd49add?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxBZnJpY2FuJTIwaGFpcnN0eWxlJTIwYnJhaWRzJTIwdHJhZGl0aW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0JTIwYmVhdXR5fGVufDF8fHx8MTc4Mjc1MzI3MXww&ixlib=rb-4.1.0&q=80&w=1080",
  coifHero: "https://images.unsplash.com/photo-1527203561188-dae1bc1a417f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxBZnJpY2FuJTIwaGFpcnN0eWxlJTIwYnJhaWRzJTIwdHJhZGl0aW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0JTIwYmVhdXR5fGVufDF8fHx8MTc4Mjc1MzI3MXww&ixlib=rb-4.1.0&q=80&w=1080",
  coifS1: "https://images.unsplash.com/photo-1613876215075-276fd62c89a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwaGFpcnN0eWxlJTIwYnJhaWRzJTIwdHJhZGl0aW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0JTIwYmVhdXR5fGVufDF8fHx8MTc4Mjc1MzI3MXww&ixlib=rb-4.1.0&q=80&w=1080",
  coifS2: "https://images.unsplash.com/photo-1673470907547-1c0c6a996095?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxBZnJpY2FuJTIwaGFpcnN0eWxlJTIwYnJhaWRzJTIwdHJhZGl0aW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0JTIwYmVhdXR5fGVufDF8fHx8MTc4Mjc1MzI3MXww&ixlib=rb-4.1.0&q=80&w=1080",

  // B. Coiffes
  coiffeCard: "https://images.unsplash.com/photo-1618998584360-10a0c28eec0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwYmVhZGVkJTIwaGVhZGJhbmQlMjBmbG93ZXJzJTIwY3Jvd24lMjBxdWVlbiUyMHdvbWFufGVufDF8fHx8MTc4Mjc1MzI4OXww&ixlib=rb-4.1.0&q=80&w=1080",
  coiffeHero: "https://images.unsplash.com/photo-1776015036974-c1341585dde3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwaGVhZGRyZXNzJTIwaGVhZHBpZWNlJTIwcm95YWwlMjBjZXJlbW9uaWFsJTIwY3Jvd258ZW58MXx8fHwxNzgyNzUzMjcyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  coiffeS1: "https://images.unsplash.com/photo-1717454168479-adf5a642aee7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxBZnJpY2FuJTIwYmVhZGVkJTIwaGVhZGJhbmQlMjBmbG93ZXJzJTIwY3Jvd24lMjBxdWVlbiUyMHdvbWFufGVufDF8fHx8MTc4Mjc1MzI4OXww&ixlib=rb-4.1.0&q=80&w=1080",
  coiffeS2: "https://images.unsplash.com/photo-1749657726882-a4df541652a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxBZnJpY2FuJTIwYmVhZGVkJTIwaGVhZGJhbmQlMjBmbG93ZXJzJTIwY3Jvd24lMjBxdWVlbiUyMHdvbWFufGVufDF8fHx8MTc4Mjc1MzI4OXww&ixlib=rb-4.1.0&q=80&w=1080",
  coiffeS3: "https://images.unsplash.com/photo-1717454168655-6eac50175fc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxBZnJpY2FuJTIwYmVhZGVkJTIwaGVhZGJhbmQlMjBmbG93ZXJzJTIwY3Jvd24lMjBxdWVlbiUyMHdvbWFufGVufDF8fHx8MTc4Mjc1MzI4OXww&ixlib=rb-4.1.0&q=80&w=1080",

  // C. Maquillage
  maqCard: "https://images.unsplash.com/photo-1628682814595-a3f0816b25ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwdHJpYmFsJTIwZmFjZSUyMHBhaW50JTIwYm9keSUyMGFydCUyMGNlcmVtb255fGVufDF8fHx8MTc4Mjc1MzI3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  maqHero: "https://images.unsplash.com/photo-1657458205503-259dfd261f0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxBZnJpY2FuJTIwdHJpYmFsJTIwZmFjZSUyMHBhaW50JTIwYm9keSUyMGFydCUyMGNlcmVtb255fGVufDF8fHx8MTc4Mjc1MzI3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  maqS1: "https://images.unsplash.com/photo-1747079302185-e846ecf86c02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxBZnJpY2FuJTIwdHJpYmFsJTIwZmFjZSUyMHBhaW50JTIwYm9keSUyMGFydCUyMGNlcmVtb255fGVufDF8fHx8MTc4Mjc1MzI3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  maqS2: "https://images.unsplash.com/photo-1674469773458-6a2dd73e77e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxBZnJpY2FuJTIwdHJpYmFsJTIwZmFjZSUyMHBhaW50JTIwYm9keSUyMGFydCUyMGNlcmVtb255fGVufDF8fHx8MTc4Mjc1MzI3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  maqS3: "https://images.unsplash.com/photo-1674469772697-ee46e7eed9e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxBZnJpY2FuJTIwdHJpYmFsJTIwZmFjZSUyMHBhaW50JTIwYm9keSUyMGFydCUyMGNlcmVtb255fGVufDF8fHx8MTc4Mjc1MzI3Mnww&ixlib=rb-4.1.0&q=80&w=1080",

  // D. Vestimentaire
  vestCard: "https://images.unsplash.com/photo-1687052093309-7a14efa58ecb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwdHJhZGl0aW9uYWwlMjBjbG90aGluZyUyMGdhcm1lbnQlMjByb2JlJTIwY2VyZW1vbnklMjBwb3J0cmFpdHxlbnwxfHx8fDE3ODI3NTMyNzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  vestHero: "https://images.unsplash.com/photo-1750756872102-8e727501821d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHxBZnJpY2FuJTIwdHJhZGl0aW9uYWwlMjBjbG90aGluZyUyMGdhcm1lbnQlMjByb2JlJTIwY2VyZW1vbnklMjBwb3J0cmFpdHxlbnwxfHx8fDE3ODI3NTMyNzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  vestS1: "https://images.unsplash.com/photo-1729974737691-7642c3d98e88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxBZnJpY2FuJTIwdHJhZGl0aW9uYWwlMjBjbG90aGluZyUyMGdhcm1lbnQlMjByb2JlJTIwY2VyZW1vbnklMjBwb3J0cmFpdHxlbnwxfHx8fDE3ODI3NTMyNzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  vestS2: "https://images.unsplash.com/photo-1752343820427-8ba42af79b9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxBZnJpY2FuJTIwdHJhZGl0aW9uYWwlMjBjbG90aGluZyUyMGdhcm1lbnQlMjByb2JlJTIwY2VyZW1vbnklMjBwb3J0cmFpdHxlbnwxfHx8fDE3ODI3NTMyNzN8MA&ixlib=rb-4.1.0&q=80&w=1080",

  // E. Bijoux et parures
  bijCard: "https://images.unsplash.com/photo-1574362098421-38623a3466b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxBZnJpY2FuJTIwYmVhZGVkJTIwamV3ZWxyeSUyMG5lY2tsYWNlJTIwYnJhY2VsZXQlMjBoYW5kbWFkZSUyMG9ybmFtZW50fGVufDF8fHx8MTc4Mjc1MzI3OXww&ixlib=rb-4.1.0&q=80&w=1080",
  bijHero: "https://images.unsplash.com/photo-1601387603639-387c75bdcb0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwYmVhZGVkJTIwamV3ZWxyeSUyMG5lY2tsYWNlJTIwYnJhY2VsZXQlMjBoYW5kbWFkZSUyMG9ybmFtZW50fGVufDF8fHx8MTc4Mjc1MzI3OXww&ixlib=rb-4.1.0&q=80&w=1080",
  bijS1: "https://images.unsplash.com/photo-1757140448317-722fb8f439f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxBZnJpY2FuJTIwYmVhZGVkJTIwamV3ZWxyeSUyMG5lY2tsYWNlJTIwYnJhY2VsZXQlMjBoYW5kbWFkZSUyMG9ybmFtZW50fGVufDF8fHx8MTc4Mjc1MzI3OXww&ixlib=rb-4.1.0&q=80&w=1080",
  bijS2: "https://images.unsplash.com/photo-1558642905-4e2d983ce8d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxBZnJpY2FuJTIwYmVhZGVkJTIwamV3ZWxyeSUyMG5lY2tsYWNlJTIwYnJhY2VsZXQlMjBoYW5kbWFkZSUyMG9ybmFtZW50fGVufDF8fHx8MTc4Mjc1MzI3OXww&ixlib=rb-4.1.0&q=80&w=1080",

  // F. Tambours
  tamCard: "https://images.unsplash.com/photo-1530917203633-106d4a1a0967?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwZHJ1bSUyMGRqZW1iZSUyMHRhbGtpbmclMjBkcnVtJTIwbXVzaWNpYW4lMjBwZXJjdXNzaW9ufGVufDF8fHx8MTc4Mjc1MzI4MHww&ixlib=rb-4.1.0&q=80&w=1080",
  tamHero: "https://images.unsplash.com/photo-1708512935636-36a3dba7cfc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxBZnJpY2FuJTIwZHJ1bSUyMGRqZW1iZSUyMHRhbGtpbmclMjBkcnVtJTIwbXVzaWNpYW4lMjBwZXJjdXNzaW9ufGVufDF8fHx8MTc4Mjc1MzI4MHww&ixlib=rb-4.1.0&q=80&w=1080",
  tamS1: "https://images.unsplash.com/photo-1551752480-6ecf175fcd51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxBZnJpY2FuJTIwZHJ1bSUyMGRqZW1iZSUyMHRhbGtpbmclMjBkcnVtJTIwbXVzaWNpYW4lMjBwZXJjdXNzaW9ufGVufDF8fHx8MTc4Mjc1MzI4MHww&ixlib=rb-4.1.0&q=80&w=1080",
  tamS2: "https://images.unsplash.com/photo-1708512935680-50b14c0e703e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHxBZnJpY2FuJTIwZHJ1bSUyMGRqZW1iZSUyMHRhbGtpbmclMjBkcnVtJTIwbXVzaWNpYW4lMjBwZXJjdXNzaW9ufGVufDF8fHx8MTc4Mjc1MzI4MHww&ixlib=rb-4.1.0&q=80&w=1080",
  tamS3: "https://images.unsplash.com/photo-1646215096160-7fe20dfb7a32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxBZnJpY2FuJTIwZHJ1bSUyMGRqZW1iZSUyMHRhbGtpbmclMjBkcnVtJTIwbXVzaWNpYW4lMjBwZXJjdXNzaW9ufGVufDF8fHx8MTc4Mjc1MzI4MHww&ixlib=rb-4.1.0&q=80&w=1080",

  // G. Griots
  griCard: "https://images.unsplash.com/photo-1675117442237-6539181bab18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwZ3Jpb3QlMjBzdG9yeXRlbGxlciUyMGVsZGVyJTIwbXVzaWNpYW4lMjBrb3JhfGVufDF8fHx8MTc4Mjc1MzI4MXww&ixlib=rb-4.1.0&q=80&w=1080",
  griHero: "https://images.unsplash.com/photo-1761804885663-62e646ebf8e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxBZnJpY2FuJTIwZ3Jpb3QlMjBzdG9yeXRlbGxlciUyMGVsZGVyJTIwbXVzaWNpYW4lMjBrb3JhfGVufDF8fHx8MTc4Mjc1MzI4MXww&ixlib=rb-4.1.0&q=80&w=1080",
  griS1: "https://images.unsplash.com/photo-1601977418432-b7c67de26e42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxBZnJpY2FuJTIwZ3Jpb3QlMjBzdG9yeXRlbGxlciUyMGVsZGVyJTIwbXVzaWNpYW4lMjBrb3JhfGVufDF8fHx8MTc4Mjc1MzI4MXww&ixlib=rb-4.1.0&q=80&w=1080",
  griS2: "https://images.unsplash.com/photo-1778894926879-07308f00c4a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxBZnJpY2FuJTIwZ3Jpb3QlMjBzdG9yeXRlbGxlciUyMGVsZGVyJTIwbXVzaWNpYW4lMjBrb3JhfGVufDF8fHx8MTc4Mjc1MzI4MXww&ixlib=rb-4.1.0&q=80&w=1080",
  griS3: "https://images.unsplash.com/photo-1776918778579-cbb0f711d9bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxBZnJpY2FuJTIwZ3Jpb3QlMjBzdG9yeXRlbGxlciUyMGVsZGVyJTIwbXVzaWNpYW4lMjBrb3JhfGVufDF8fHx8MTc4Mjc1MzI4MXww&ixlib=rb-4.1.0&q=80&w=1080",

  // H. Peinture & arts visuels
  peintCard: "https://images.unsplash.com/photo-1540929819775-fcc7d4649250?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxBZnJpY2FuJTIwY29udGVtcG9yYXJ5JTIwcGFpbnRpbmclMjBtdXJhbCUyMHN0cmVldCUyMGFydCUyMGFydGlzdHxlbnwxfHx8fDE3ODI3NTMyODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  peintHero: "https://images.unsplash.com/photo-1612373931332-9fbb9b2290a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxBZnJpY2FuJTIwY29udGVtcG9yYXJ5JTIwcGFpbnRpbmclMjBtdXJhbCUyMHN0cmVldCUyMGFydCUyMGFydGlzdHxlbnwxfHx8fDE3ODI3NTMyODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  peintS1: "https://images.unsplash.com/photo-1581300741129-49680ba5ecc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxBZnJpY2FuJTIwY29udGVtcG9yYXJ5JTIwcGFpbnRpbmclMjBtdXJhbCUyMHN0cmVldCUyMGFydCUyMGFydGlzdHxlbnwxfHx8fDE3ODI3NTMyODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  peintS2: "https://images.unsplash.com/photo-1616532157866-dd0c68bf37e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxBZnJpY2FuJTIwY29udGVtcG9yYXJ5JTIwcGFpbnRpbmclMjBtdXJhbCUyMHN0cmVldCUyMGFydCUyMGFydGlzdHxlbnwxfHx8fDE3ODI3NTMyODF8MA&ixlib=rb-4.1.0&q=80&w=1080",

  // I. Poésie, contes & littératures orales
  poesCard: "https://images.unsplash.com/photo-1721468184185-214871ec4411?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxBZnJpY2FuJTIwc3Rvcnl0ZWxsZXIlMjBib29rJTIwcG9ldHJ5JTIwY2FsbGlncmFwaHklMjBtYW51c2NyaXB0JTIwd3JpdGluZ3xlbnwxfHx8fDE3ODI3NTMyODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  poesHero: "https://images.unsplash.com/photo-1597402173627-95df96e45536?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxBZnJpY2FuJTIwc3Rvcnl0ZWxsZXIlMjBib29rJTIwcG9ldHJ5JTIwY2FsbGlncmFwaHklMjBtYW51c2NyaXB0JTIwd3JpdGluZ3xlbnwxfHx8fDE3ODI3NTMyODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  poesS1: "https://images.unsplash.com/photo-1710447503692-8364152e431c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxBZnJpY2FuJTIwc3Rvcnl0ZWxsZXIlMjBib29rJTIwcG9ldHJ5JTIwY2FsbGlncmFwaHklMjBtYW51c2NyaXB0JTIwd3JpdGluZ3xlbnwxfHx8fDE3ODI3NTMyODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  poesS2: "https://images.unsplash.com/photo-1720701575003-51dafcf39cb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxBZnJpY2FuJTIwc3Rvcnl0ZWxsZXIlMjBib29rJTIwcG9ldHJ5JTIwY2FsbGlncmFwaHklMjBtYW51c2NyaXB0JTIwd3JpdGluZ3xlbnwxfHx8fDE3ODI3NTMyODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
} as const;

export const ARTS_INTRO = {
  title:
    "Les arts complémentaires, les expressions culturelles et les langages identitaires",
  tagline:
    "Là où l'artisanat rencontre la mémoire, le geste et la parole : une cartographie vivante des identités africaines.",
  image: IMG.intro,
  secondaryImage: IMG.introSecondary,
  paragraphs: [
    "La rubrique consacrée aux arts complémentaires, aux expressions culturelles et aux langages identitaires élargit le champ de l'artisanat afin d'intégrer l'ensemble des disciplines artistiques, culturelles, sociales et patrimoniales participant à la construction des identités des peuples. Chaque art trouve ici sa pleine reconnaissance en tant que moyen d'expression, de transmission, de communication, d'éducation et de valorisation du patrimoine collectif. Cette organisation permet d'éclairer les relations intimes qui unissent les métiers artisanaux, les traditions, les croyances, les coutumes, les structures sociales et les créations contemporaines, illustrant ainsi l'unité profonde entre art, mémoire et identité.",
  ],
};

export const artFamilies: ArtFamily[] = [
  {
    slug: "coiffure",
    letter: "A",
    title: "L'art de la coiffure",
    tagline:
      "Un patrimoine capillaire vivant - des tresses royales aux signatures contemporaines.",
    intro:
      "La coiffure traditionnelle est présentée comme une discipline artistique à part entière, porteuse d'une forte dimension esthétique, historique, sociale, culturelle et symbolique. Chaque création capillaire est étudiée selon son origine, son aire culturelle, le groupe auquel elle appartient, les techniques employées, les outils mobilisés, les matériaux utilisés, les circonstances de sa réalisation et les significations qu'elle véhicule.",
    heroImage: IMG.coifHero,
    cardImage: IMG.coifCard,
    sections: [
      {
        title: "Une discipline artistique à part entière",
        text: "La coiffure traditionnelle est présentée comme une discipline artistique à part entière, porteuse d'une forte dimension esthétique, historique, sociale, culturelle et symbolique. Chaque création capillaire est étudiée selon son origine, son aire culturelle, le groupe auquel elle appartient, les techniques employées, les outils mobilisés, les matériaux utilisés, les circonstances de sa réalisation et les significations qu'elle véhicule.",
        image: IMG.coifS1,
      },
      {
        title: "Écoles, cérémonies et maîtres coiffeurs",
        text: "Les différentes rubriques mettent en évidence l'histoire de la coiffure traditionnelle, les techniques ancestrales, les outils d'autrefois, la transmission des savoir-faire, les grandes écoles de coiffure traditionnelle, ainsi que les coiffures des royaumes, des communautés rurales, des cérémonies, des initiations, des noces, des funérailles ou des fêtes. S'ajoutent les coiffures royales, les formes contemporaines inspirées des traditions, les innovations techniques, une galerie photographique, des tutoriels, des démonstrations et des portraits de maîtres coiffeurs. Cette section célèbre toute la beauté et la diversité du patrimoine capillaire africain.",
        image: IMG.coifS2,
      },
    ],
    ctas: [
      { label: "Voir la galerie capillaire", to: "/galeries" },
      { label: "Suivre une formation associée", to: "/formations" },
    ],
  },
  {
    slug: "coiffes",
    letter: "B",
    title: "L'art des coiffes",
    tagline:
      "Plus qu'un ornement : un langage social, royal et sacré porté sur la tête.",
    intro:
      "La rubrique dédiée aux coiffes distingue clairement cet art de celui de la coiffure. La coiffe se présente comme un objet d'art, un élément vestimentaire, un symbole identitaire dont la fonction dépasse la simple esthétique.",
    heroImage: IMG.coiffeHero,
    cardImage: IMG.coiffeCard,
    sections: [
      {
        title: "Un objet d'art, un statut, une parole portée",
        text: "La rubrique dédiée aux coiffes distingue clairement cet art de celui de la coiffure. La coiffe se présente comme un objet d'art, un élément vestimentaire, un symbole identitaire dont la fonction dépasse la simple esthétique. Elle représente un support de communication sociale exprimant l'appartenance communautaire, le statut, la fonction sociale, la responsabilité ou une étape de vie.",
        image: IMG.coiffeS1,
      },
      {
        title: "Un classement complet, du royal au quotidien",
        text: "Le classement prend en compte les coiffes royales, sacerdotales, initiatiques, militaires, communautaires, cérémonielles, matrimoniales, de dignitaires, de chasseurs, de griots, ainsi que les coiffes féminines, masculines et enfantines. Pour chacune, la fiche correspondante met en valeur les matériaux, les techniques de fabrication, les éléments décoratifs, les couleurs, les symboles et les messages transmis.",
        image: IMG.coiffeS2,
      },
      {
        title: "Diasporas africaines, une continuité culturelle",
        text: "Une section particulière s'intéresse aux influences des diasporas africaines installées dans les Caraïbes, au Brésil, en Martinique, en Haïti, à Cuba et dans d'autres territoires qui perpétuent ces pratiques. L'ensemble met en évidence la continuité culturelle et la profondeur symbolique de cet art.",
        image: IMG.coiffeS3,
      },
    ],
    ctas: [
      { label: "Découvrir les œuvres en boutique", to: "/boutique" },
      { label: "Explorer les galeries", to: "/galeries" },
    ],
  },
  {
    slug: "maquillage",
    letter: "C",
    title: "Le maquillage traditionnel",
    tagline:
      "Pigments sacrés, couleurs identitaires : une peinture du corps qui raconte l'âme d'un peuple.",
    intro:
      "Le maquillage traditionnel s'inscrit comme une expression artistique et culturelle à part entière. Chaque pratique est replacée dans son contexte historique, social et communautaire afin d'en comprendre la portée identitaire.",
    heroImage: IMG.maqHero,
    cardImage: IMG.maqCard,
    sections: [
      {
        title: "Une expression artistique et culturelle",
        text: "Le maquillage traditionnel s'inscrit comme une expression artistique et culturelle à part entière. Chaque pratique est replacée dans son contexte historique, social et communautaire afin d'en comprendre la portée identitaire.",
        image: IMG.maqS1,
      },
      {
        title: "Rituels, cérémonies et symbolique des couleurs",
        text: "Les rubriques détaillent le maquillage cérémoniel, le maquillage initiatique, le maquillage religieux, guerrier, festif et royal, en insistant sur l'usage des pigments naturels, la symbolique des couleurs, les techniques traditionnelles et les évolutions contemporaines.",
        image: IMG.maqS2,
      },
      {
        title: "Du rituel au podium : influences mondiales",
        text: "Une partie met en lumière les influences exercées sur la mode internationale, le cinéma, la photographie et les industries créatives, révélant ainsi la vitalité et la modernité des traditions africaines du maquillage.",
        image: IMG.maqS3,
      },
    ],
    ctas: [
      { label: "Voir la galerie photo", to: "/galeries" },
      { label: "Lire le blog culturel", to: "/blog" },
    ],
  },
  {
    slug: "art-vestimentaire",
    letter: "D",
    title: "L'art vestimentaire",
    tagline:
      "Le vêtement comme langage : appartenance, pouvoir, célébration.",
    intro:
      "La rubrique consacrée à l'art vestimentaire développe l'étude des vêtements traditionnels comme reflets d'une histoire, d'une organisation sociale et d'une esthétique en constante évolution.",
    heroImage: IMG.vestHero,
    cardImage: IMG.vestCard,
    sections: [
      {
        title: "Le vêtement comme reflet d'une société",
        text: "La rubrique consacrée à l'art vestimentaire développe l'étude des vêtements traditionnels comme reflets d'une histoire, d'une organisation sociale et d'une esthétique en constante évolution. Chaque tenue est analysée à travers son origine, sa fonction sociale, ses techniques de fabrication, ses matériaux, ses décorations, ses usages et les contextes dans lesquels elle est portée.",
        image: IMG.vestS1,
      },
      {
        title: "Royaux, sacerdotaux, nuptiaux, professionnels…",
        text: "Le classement couvre les tenues royales, coutumières, religieuses, cérémonielles, nuptiales, de deuil, de danse, professionnelles, de chasse, militaires traditionnelles, ainsi que les costumes de griots, de prêtres, de reines et de chefs traditionnels. Cette section illustre la grande diversité des codes vestimentaires et l'importance symbolique de l'habit comme langage d'appartenance, de pouvoir et de célébration.",
        image: IMG.vestS2,
      },
    ],
    ctas: [
      { label: "Visiter la boutique textile", to: "/boutique" },
      { label: "Suivre une formation textile", to: "/formations" },
    ],
  },
  {
    slug: "bijoux-parures",
    letter: "E",
    title: "Les bijoux et les parures",
    tagline:
      "Des œuvres miniatures qui portent la mémoire d'un peuple.",
    intro:
      "Les bijoux sont présentés comme des œuvres artisanales à forte valeur identitaire, véritables marqueurs culturels et reflets du statut social.",
    heroImage: IMG.bijHero,
    cardImage: IMG.bijCard,
    sections: [
      {
        title: "Marqueurs culturels, reflets du statut social",
        text: "Les bijoux sont présentés comme des œuvres artisanales à forte valeur identitaire, véritables marqueurs culturels et reflets du statut social. Les familles de bijoux comprennent les colliers, bracelets, bagues, boucles d'oreilles, couronnes, ceintures, pectoraux, anneaux, amulettes, talismans, parures royales, matrimoniales, initiatiques et ornements de danse.",
        image: IMG.bijS1,
      },
      {
        title: "Esthétique, symbolique et mémoire",
        text: "Chaque création donne lieu à une analyse artistique, culturelle et historique mettant en lumière le symbolisme des matières et la diversité des écoles artisanales. Les bijoux apparaissent ici comme des formes d'expression esthétique mais aussi comme des objets de mémoire.",
        image: IMG.bijS2,
      },
    ],
    ctas: [
      { label: "Découvrir les bijoux", to: "/boutique?cat=Bijoux" },
      { label: "Voir les galeries", to: "/galeries" },
    ],
  },
  {
    slug: "tambours",
    letter: "F",
    title: "L'art des tambours et de la communication traditionnelle",
    tagline:
      "Avant l'écriture, le tambour. L'intelligence sonore des civilisations africaines.",
    intro:
      "Les tambours occupent une place centrale dans cet univers, considérés comme de véritables instruments de communication et vecteurs de cohésion sociale.",
    heroImage: IMG.tamHero,
    cardImage: IMG.tamCard,
    sections: [
      {
        title: "Instruments de communication et de cohésion sociale",
        text: "Les tambours occupent une place centrale dans cet univers, considérés comme de véritables instruments de communication et vecteurs de cohésion sociale. Chaque instrument est documenté selon sa fonction culturelle, sociale, politique, éducative et cérémonielle, rendant compte de son rôle dans l'organisation communautaire.",
        image: IMG.tamS1,
      },
      {
        title: "Tambours royaux, sacrés, de guerre, de fête",
        text: "Les différentes sous-rubriques détaillent les tambours royaux, sacrés, de guerre, de cérémonie, de danse, de réjouissance, d'annonce, d'initiation et communautaires.",
        image: IMG.tamS2,
      },
      {
        title: "Talking Drum - le tambour parlant",
        text: "Une section spécifique est consacrée au Talking Drum, ou tambour parlant, qui explique son fonctionnement, son langage codifié, ses techniques d'interprétation, les méthodes de transmission des messages et son importance dans les sociétés traditionnelles. Cet espace célèbre l'intelligence sonore et le raffinement linguistique des cultures africaines.",
        image: IMG.tamS3,
      },
    ],
    ctas: [
      { label: "Voir les tambours en boutique", to: "/boutique" },
      { label: "Découvrir les événements", to: "/evenements" },
    ],
  },
  {
    slug: "griots",
    letter: "G",
    title: "Les griots et les maîtres de la parole",
    tagline:
      "La mémoire vivante d'un continent - bientôt dans les Podcasts Griots.",
    intro:
      "La rubrique consacrée aux griots et maîtres de la parole valorise ceux qui incarnent la mémoire vivante des peuples.",
    heroImage: IMG.griHero,
    cardImage: IMG.griCard,
    sections: [
      {
        title: "Détenteurs de la tradition orale",
        text: "La rubrique consacrée aux griots et maîtres de la parole valorise ceux qui incarnent la mémoire vivante des peuples. Ces détenteurs de la tradition orale jouent un rôle essentiel dans la transmission des savoirs, de la mémoire collective, des généalogies, des récits historiques, des chants, des poèmes, des chroniques et des messages officiels.",
        image: IMG.griS1,
      },
      {
        title: "Fonctions sociales, politiques et diplomatiques",
        text: "Les thématiques explorent l'histoire des griots, leurs fonctions sociales, politiques et diplomatiques, la transmission orale, la poésie, les chants traditionnels, les généalogies, les chroniques royales, les contes, les légendes et la mémoire des peuples.",
        image: IMG.griS2,
      },
      {
        title: "Podcasts Griots - un espace vivant à venir",
        text: "Cette rubrique constitue également la base éditoriale des futurs Podcasts Griots, espace où artisans, artistes, chercheurs, maîtres d'art et personnalités culturelles partageront leurs parcours, leurs inspirations, leurs techniques, leurs influences et leurs visions du patrimoine vivant.",
        image: IMG.griS3,
      },
    ],
    ctas: [
      { label: "Découvrir le blog culturel", to: "/blog" },
      { label: "Voir les événements", to: "/evenements" },
    ],
  },
  {
    slug: "peinture-arts-visuels",
    letter: "H",
    title: "La peinture, le dessin et les arts visuels",
    tagline:
      "Des fresques anciennes aux arts numériques : l'image qui raconte l'Afrique.",
    intro:
      "Les arts visuels rassemblent l'ensemble des disciplines graphiques inspirées des patrimoines culturels africains.",
    heroImage: IMG.peintHero,
    cardImage: IMG.peintCard,
    sections: [
      {
        title: "De la peinture traditionnelle aux arts numériques",
        text: "Les arts visuels rassemblent l'ensemble des disciplines graphiques inspirées des patrimoines culturels africains. Sont représentées la peinture traditionnelle, la peinture contemporaine, les fresques, l'illustration, le dessin, la calligraphie, les arts numériques, les arts graphiques, la gravure, les estampes, les murales et les arts décoratifs.",
        image: IMG.peintS1,
      },
      {
        title: "Une continuité entre traditions et créations modernes",
        text: "Chaque œuvre est replacée dans son contexte historique, culturel et artistique afin de montrer la continuité entre les pratiques anciennes et les créations modernes. Cette section met en lumière la diversité des langages visuels et leur capacité à témoigner de l'évolution des sociétés africaines à travers l'image.",
        image: IMG.peintS2,
      },
    ],
    ctas: [
      { label: "Visiter les galeries", to: "/galeries" },
      { label: "Lire les éditoriaux", to: "/blog" },
    ],
  },
  {
    slug: "poesie-contes",
    letter: "I",
    title: "La poésie, les contes et les littératures orales",
    tagline:
      "La parole comme art majeur du patrimoine immatériel africain.",
    intro:
      "Les littératures orales occupent un espace dédié qui met à l'honneur les créations littéraires nourries de traditions, d'artisanat et de patrimoines.",
    heroImage: IMG.poesHero,
    cardImage: IMG.poesCard,
    sections: [
      {
        title: "Poèmes, contes, épopées et chroniques",
        text: "Les littératures orales occupent un espace dédié qui met à l'honneur les créations littéraires nourries de traditions, d'artisanat et de patrimoines. Cette rubrique accueille les poèmes, contes, épopées, proverbes, devinettes, maximes, chroniques, récits historiques, témoignages, récits de transmission et œuvres contemporaines inspirées des traditions.",
        image: IMG.poesS1,
      },
      {
        title: "Un espace numérique vivant pour la parole poétique",
        text: "Les auteurs et porteurs de parole y trouvent un lieu de publication, de rencontre littéraire, de concours et de lectures publiques, prolongeant la tradition orale dans un espace numérique vivant. Cette section consacre la parole poétique comme un art majeur du patrimoine immatériel africain.",
        image: IMG.poesS2,
      },
    ],
    ctas: [
      { label: "Découvrir le blog & éditoriaux", to: "/blog" },
      { label: "Voir les concours littéraires", to: "/concours" },
    ],
  },
];

export function getArtFamily(slug: string): ArtFamily | undefined {
  return artFamilies.find((a) => a.slug === slug);
}
