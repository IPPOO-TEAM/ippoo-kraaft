import { Link } from "react-router";
import {
  ArrowRight, Trees, Mic, Hammer, Flame, Crown, Package, Landmark, Map, Palette,
  GraduationCap, Users, Newspaper, BookOpen, Film, Library, Gem, Shield, Building2,
  FileText, Globe, Scissors, Sparkles, Archive, FolderOpen, MessageSquare, Handshake,
  HeartHandshake, Send, PenTool, type LucideIcon,
} from "lucide-react";

export type CrossLink = {
  /** Icône lucide (plate) - plus d'emoji ni de pictogramme 3D */
  icon: LucideIcon;
  label: string;
  desc: string;
  to: string;
};

/**
 * Bandeau de liens croisés affiché en bas des pages détaillées (Métiers, Médias,
 * Patrimoines, Marketplace). Permet de naviguer entre rubriques sœurs.
 */
export function CrossLinksBlock({
  title = "Continuer dans l'univers IPPOO KRAAFT",
  subtitle = "Chaque savoir s'enrichit au contact des autres. Explorez les rubriques liées.",
  links,
}: {
  title?: string;
  subtitle?: string;
  links: CrossLink[];
}) {
  if (!links.length) return null;
  return (
    <section className="mt-12">
      <h2 className="text-[var(--ipk-ink)] mb-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700 }}>
        {title}
      </h2>
      <p className="text-[var(--ipk-text)] mb-5" style={{ fontSize: "14px" }}>
        {subtitle}
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {links.map((l) => {
          const Icon = l.icon;
          return (
            <Link
              key={l.to + l.label}
              to={l.to}
              className="group bg-white rounded-2xl border border-[var(--ipk-border)] hover:border-[var(--ipk-green)] hover:shadow-sm transition-all p-4 flex items-start gap-3"
            >
              <span className="w-10 h-10 rounded-xl bg-[var(--ipk-surface)] flex items-center justify-center shrink-0 text-[var(--ipk-green-dark)]">
                <Icon className="w-5 h-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-[var(--ipk-ink)]" style={{ fontSize: "14px", fontWeight: 600 }}>
                  {l.label}
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[var(--ipk-green)]" />
                </div>
                <p className="text-[var(--ipk-text)] mt-0.5" style={{ fontSize: "12.5px", lineHeight: 1.5 }}>
                  {l.desc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// ============ Tables de correspondance par slug ============

export const metierCrossLinks: Record<string, CrossLink[]> = {
  bois: [
    { icon: Trees, label: "Matériau patrimonial : le bois", desc: "Série documentaire dédiée au bois dans Les Matériaux du Patrimoine.", to: "/medias/series-documentaires" },
    { icon: Mic, label: "Écouter les sculpteurs sur bois", desc: "Portraits de maîtres d'art dans les Podcasts Griots.", to: "/medias/podcasts-griots" },
    { icon: Landmark, label: "Foire du Bois", desc: "Présentation des sculptures, mobiliers et innovations.", to: "/salons" },
  ],
  "ferronnerie-art": [
    { icon: Hammer, label: "Dossier : routes du bronze", desc: "Dans Les Dossiers Thématiques - l'histoire de la ferronnerie d'art africaine.", to: "/medias/dossiers-thematiques" },
    { icon: Crown, label: "Familles Hountondji & Cie", desc: "Grands Maîtres du Patrimoine : lignées royales et forgerons d'Oyo.", to: "/patrimoines/grands-maitres" },
    { icon: Flame, label: "Foire de la Ferronnerie d'Art", desc: "Œuvres monumentales et démonstrations de forge.", to: "/salons" },
  ],
  pierre: [
    { icon: Shield, label: "Conservation des œuvres", desc: "Laboratoire de Conservation et de Restauration.", to: "/patrimoines/laboratoire-conservation" },
    { icon: Map, label: "Cartes du patrimoine", desc: "Localiser les sites historiques et lieux de production.", to: "/patrimoines/cartes-interactives" },
    { icon: Palette, label: "Arts & culture", desc: "L'art de la pierre dans les expressions visuelles africaines.", to: "/arts-culture" },
  ],
  "argile-terre": [
    { icon: Archive, label: "Patrimoines vivants", desc: "L'inventaire des savoir-faire encore pratiqués.", to: "/patrimoines/inventaire-patrimoines-vivants" },
    { icon: Mic, label: "Femmes des métiers d'art", desc: "Podcasts Griots - les potières et leurs lignées.", to: "/medias/podcasts-griots" },
    { icon: Building2, label: "Villages artisanaux", desc: "Foires et circuits autour des centres céramiques.", to: "/salons" },
  ],
  textile: [
    { icon: Scissors, label: "Routes textiles", desc: "Dossiers thématiques sur les arts textiles d'Afrique.", to: "/medias/dossiers-thematiques" },
    { icon: Sparkles, label: "Saisons des Textiles Africains", desc: "Programmation dédiée dans les Salons & Saisons KRAAFT.", to: "/salons" },
    { icon: BookOpen, label: "Documentation patrimoniale", desc: "Catalogues, monographies et inventaires textiles.", to: "/patrimoines/centre-documentation" },
  ],
  cuir: [
    { icon: Map, label: "Traditions sahéliennes & touarègues", desc: "Patrimoines vivants et cartes des territoires.", to: "/patrimoines/cartes-interactives" },
    { icon: Mic, label: "Maîtres du cuir repoussé", desc: "Podcasts Griots - gardiens des traditions berbères.", to: "/medias/podcasts-griots" },
    { icon: Package, label: "Foire du Cuir", desc: "Maroquinerie, sellerie, chaussures et objets décoratifs.", to: "/salons" },
  ],
};

export const mediaCrossLinks: Record<string, CrossLink[]> = {
  "podcasts-griots": [
    { icon: Crown, label: "Les Grands Maîtres", desc: "Découvrir les biographies des personnalités citées dans les podcasts.", to: "/patrimoines/grands-maitres" },
    { icon: Hammer, label: "Les métiers d'art", desc: "Explorer les disciplines évoquées par nos invités.", to: "/metiers" },
    { icon: FileText, label: "Témoignages", desc: "Compléter l'écoute par la lecture des récits de praticiens.", to: "/medias/temoignages" },
  ],
  "parcours-invite": [
    { icon: Mic, label: "Tous les Podcasts Griots", desc: "Retrouver l'ensemble des épisodes par rubrique.", to: "/medias/podcasts-griots" },
    { icon: GraduationCap, label: "Académie KRAAFT", desc: "Formations associées aux univers de nos invités.", to: "/academie" },
    { icon: Globe, label: "Cartes du patrimoine", desc: "Situer les origines et lieux d'exercice.", to: "/patrimoines/cartes-interactives" },
  ],
  "series-documentaires": [
    { icon: Film, label: "Bibliothèque audiovisuelle", desc: "Tous les films, documentaires et archives indexés.", to: "/medias/bibliotheque-audiovisuelle" },
    { icon: Trees, label: "Familles & matériaux", desc: "Approfondir avec les fiches Métiers correspondantes.", to: "/metiers" },
    { icon: Landmark, label: "Musées Vivants", desc: "Voir les artisans au travail en immersion.", to: "/salons" },
  ],
  editoriaux: [
    { icon: Newspaper, label: "Blog & Actualités", desc: "Lire les dernières publications culturelles.", to: "/blog" },
    { icon: BookOpen, label: "Centre de documentation", desc: "Les ressources scientifiques de référence.", to: "/patrimoines/centre-documentation" },
    { icon: FolderOpen, label: "Dossiers thématiques", desc: "Plonger plus loin par grand sujet.", to: "/medias/dossiers-thematiques" },
  ],
  "dossiers-thematiques": [
    { icon: Crown, label: "Arts Royaux", desc: "Patrimoines des cours et des palais.", to: "/patrimoines/collections-patrimoniales" },
    { icon: Hammer, label: "Métiers d'art", desc: "Les disciplines liées aux dossiers.", to: "/metiers" },
    { icon: Mic, label: "Podcasts associés", desc: "Écouter les voix qui racontent ces histoires.", to: "/medias/podcasts-griots" },
  ],
  "bibliotheque-audiovisuelle": [
    { icon: Mic, label: "Podcasts Griots", desc: "Écouter les épisodes par rubrique.", to: "/medias/podcasts-griots" },
    { icon: Film, label: "Séries documentaires", desc: "Voir les grandes sagas filmées.", to: "/medias/series-documentaires" },
    { icon: Landmark, label: "Captations d'événements", desc: "Conférences et salons enregistrés.", to: "/salons" },
  ],
  "chroniques-culturelles": [
    { icon: Newspaper, label: "Actualités quotidiennes", desc: "Suivre le rythme du blog IPPOO KRAAFT.", to: "/blog" },
    { icon: Palette, label: "Arts & culture", desc: "Approfondir les œuvres et personnalités évoquées.", to: "/arts-culture" },
    { icon: Archive, label: "Patrimoines vivants", desc: "Les pratiques contemporaines documentées.", to: "/patrimoines/inventaire-patrimoines-vivants" },
  ],
  temoignages: [
    { icon: PenTool, label: "Partager votre récit", desc: "Devenir contributeur de la mémoire vivante.", to: "/contact" },
    { icon: GraduationCap, label: "Académie KRAAFT", desc: "Découvrir les formations et résidences.", to: "/academie" },
    { icon: HeartHandshake, label: "Groupements", desc: "Rencontrer les communautés artisanales.", to: "/groupements" },
  ],
  "collections-editoriales": [
    { icon: BookOpen, label: "Centre de documentation", desc: "Toutes les ressources textuelles.", to: "/patrimoines/centre-documentation" },
    { icon: Library, label: "Collections patrimoniales", desc: "Voir les objets et œuvres documentés.", to: "/patrimoines/collections-patrimoniales" },
    { icon: Palette, label: "Arts & culture", desc: "Le grand récit visuel des arts africains.", to: "/arts-culture" },
  ],
};

export const patrimoineCrossLinks: Record<string, CrossLink[]> = {
  "centre-documentation": [
    { icon: Newspaper, label: "Éditoriaux", desc: "Les contenus de référence du portail.", to: "/medias/editoriaux" },
    { icon: FolderOpen, label: "Dossiers thématiques", desc: "Approfondir par grand sujet.", to: "/medias/dossiers-thematiques" },
    { icon: Library, label: "Collections éditoriales", desc: "La bibliothèque vivante des savoirs.", to: "/medias/collections-editoriales" },
  ],
  "inventaire-patrimoines-vivants": [
    { icon: Hammer, label: "Familles de métiers", desc: "Explorer les disciplines associées.", to: "/metiers" },
    { icon: HeartHandshake, label: "Groupements", desc: "Rencontrer les communautés détentrices.", to: "/groupements" },
    { icon: Mic, label: "Podcasts Griots", desc: "Écouter les voix des gardiens des traditions.", to: "/medias/podcasts-griots" },
  ],
  "collections-patrimoniales": [
    { icon: Library, label: "Galeries photographiques", desc: "Voir les œuvres en haute résolution.", to: "/galeries" },
    { icon: Landmark, label: "Musées Vivants", desc: "Découvrir les objets en contexte.", to: "/salons" },
    { icon: Palette, label: "Arts & culture", desc: "Le grand récit visuel des arts africains.", to: "/arts-culture" },
  ],
  "grands-maitres": [
    { icon: Mic, label: "Portraits en podcast", desc: "Les voix des maîtres d'art.", to: "/medias/podcasts-griots" },
    { icon: Users, label: "Répertoire des artisans", desc: "Découvrir les héritiers contemporains.", to: "/repertoire" },
    { icon: BookOpen, label: "Centre de documentation", desc: "Archives, biographies et publications.", to: "/patrimoines/centre-documentation" },
  ],
  "langues-metiers": [
    { icon: Hammer, label: "Vocabulaires métiers", desc: "Replacer les termes dans leur discipline.", to: "/metiers" },
    { icon: MessageSquare, label: "Savoirs oraux", desc: "Proverbes, chants de travail et récits.", to: "/patrimoines/savoirs-oraux" },
    { icon: Mic, label: "Podcasts Griots", desc: "Entendre les langues dans leur contexte.", to: "/medias/podcasts-griots" },
  ],
  "savoirs-oraux": [
    { icon: Mic, label: "Podcasts Griots", desc: "La parole vivante au cœur du portail.", to: "/medias/podcasts-griots" },
    { icon: FileText, label: "Témoignages", desc: "Les récits écrits des praticiens et apprentis.", to: "/medias/temoignages" },
    { icon: FolderOpen, label: "Dossier : les griots", desc: "Le rôle historique des griots dans les sociétés africaines.", to: "/medias/dossiers-thematiques" },
  ],
  "laboratoire-conservation": [
    { icon: Landmark, label: "Musées Vivants", desc: "Voir la restauration en démonstration.", to: "/salons" },
    { icon: BookOpen, label: "Centre de documentation", desc: "Études scientifiques sur les matériaux.", to: "/patrimoines/centre-documentation" },
    { icon: Film, label: "Séries documentaires", desc: "Les matériaux du patrimoine en immersion.", to: "/medias/series-documentaires" },
  ],
  "cartes-interactives": [
    { icon: Building2, label: "Villages artisanaux", desc: "Préparer une visite immersive.", to: "/salons" },
    { icon: HeartHandshake, label: "Groupements", desc: "Localiser les coopératives d'artisans.", to: "/groupements" },
    { icon: Users, label: "Répertoire", desc: "Trouver un artisan près de chez soi.", to: "/repertoire" },
  ],
  "programmes-sauvegarde": [
    { icon: GraduationCap, label: "Académie KRAAFT", desc: "Formations et transmission aux jeunes générations.", to: "/academie" },
    { icon: Handshake, label: "Devenir artisan partenaire", desc: "Rejoindre le réseau IPPOO KRAAFT.", to: "/devenir-artisan" },
    { icon: Gem, label: "Fonds KRAAFT", desc: "Soutenir les initiatives de sauvegarde.", to: "/patrimoines/fonds-kraaft" },
  ],
  "fonds-kraaft": [
    { icon: Send, label: "Déposer un projet", desc: "Soumettre une initiative au Fonds.", to: "/contact" },
    { icon: HeartHandshake, label: "Groupements & coopératives", desc: "Découvrir les bénéficiaires potentiels.", to: "/groupements" },
    { icon: Landmark, label: "Salons & rencontres", desc: "Présenter votre projet lors des grands rendez-vous.", to: "/salons" },
  ],
};
