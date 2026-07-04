import { useState } from "react";
import { Link } from "react-router";
import { Play, ExternalLink, Film, Filter, MapPin, X } from "lucide-react";
import { useBackgroundMusic } from "../hooks/use-background-music";
import {
  mediaItems,
  getMediaByRubrique,
  MEDIA_CATEGORIES,
  type MediaItem,
  type MediaCategory,
} from "../data/media-library";

// ── Lecteur inline (joue dans la card, pas ailleurs) ────────────────────────

function MediaCard({ item }: { item: MediaItem }) {
  const [playing, setPlaying] = useState(false);
  const { setExternalMediaPlaying } = useBackgroundMusic();
  const thumb = `https://img.youtube.com/vi/${item.youtubeId}/mqdefault.jpg`;
  const catLabel = MEDIA_CATEGORIES.find((c) => c.value === item.category);
  const ytUrl = `https://www.youtube.com/watch?v=${item.youtubeId}`;

  return (
    <article className="bg-white rounded-2xl overflow-hidden border border-[var(--ipk-border)] hover:shadow-md transition-shadow flex flex-col">
      {/* Zone de lecture - inline dans la card */}
      <div className="relative aspect-video bg-[var(--ipk-ink)]">
        {playing ? (
          <>
            <iframe
              src={`https://www.youtube.com/embed/${item.youtubeId}?rel=0&modestbranding=1&autoplay=1`}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full border-0"
            />
            {/* Bouton fermer la lecture */}
            <button
              onClick={() => { setPlaying(false); setExternalMediaPlaying(false); }}
              className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 flex items-center justify-center text-white transition-colors"
              aria-label="Fermer la lecture"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            {/* Vignette */}
            <img
              src={thumb}
              alt={item.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            {/* Overlay + bouton play */}
            <button
              onClick={() => { setPlaying(true); setExternalMediaPlaying(true); }}
              aria-label={`Lire : ${item.title}`}
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/45 transition-colors"
            >
              <span className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                <Play className="w-7 h-7 text-white ml-1" fill="white" />
              </span>
            </button>
            {/* Badges */}
            {catLabel && (
              <span className="absolute top-2 left-2 bg-[var(--ipk-green-dark)] text-white px-2.5 py-0.5 rounded-full" style={{ fontSize: "10px", fontWeight: 700 }}>
                {catLabel.emoji} {catLabel.label}
              </span>
            )}
            {item.duration && (
              <span className="absolute bottom-2 right-2 bg-black/75 text-white px-2 py-0.5 rounded" style={{ fontSize: "11px", fontWeight: 600 }}>
                {item.duration}
              </span>
            )}
          </>
        )}
      </div>

      {/* Infos sous la vidéo */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="text-[var(--ipk-ink)] line-clamp-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "15px", fontWeight: 700, lineHeight: 1.35 }}>
          {item.title}
        </h3>
        <p className="text-[var(--ipk-text)] line-clamp-2 flex-1" style={{ fontSize: "12.5px", lineHeight: 1.5 }}>
          {item.description}
        </p>

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--ipk-border)]">
          <div className="min-w-0">
            <div className="text-[var(--ipk-ink)] truncate" style={{ fontSize: "11px", fontWeight: 600 }}>
              {item.channel}
            </div>
            <div className="flex items-center gap-1.5 text-[var(--ipk-text)]" style={{ fontSize: "10.5px" }}>
              {item.pays && (
                <span className="inline-flex items-center gap-0.5">
                  <MapPin className="w-3 h-3" /> {item.pays}
                </span>
              )}
              {item.year && <span>· {item.year}</span>}
            </div>
          </div>
          <a
            href={ytUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1 text-[var(--ipk-blue)] hover:underline"
            style={{ fontSize: "10.5px", fontWeight: 600 }}
            aria-label="Ouvrir sur YouTube"
          >
            YouTube <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map((t) => (
            <span key={t} className="px-2 py-0.5 rounded-full bg-[var(--ipk-surface)] text-[var(--ipk-text)]" style={{ fontSize: "9.5px" }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

// ── Bibliothèque complète (/medias et /medias/bibliotheque-audiovisuelle) ────

export function MediaLibrary({ rubriquesFilter }: { rubriquesFilter?: string }) {
  const [activeCat, setActiveCat] = useState<MediaCategory | "all">("all");

  const base = rubriquesFilter ? getMediaByRubrique(rubriquesFilter) : mediaItems;
  const filtered = activeCat === "all" ? base : base.filter((m) => m.category === activeCat);
  const presentCats = Array.from(new Set(base.map((m) => m.category)));

  return (
    <div className="mt-8">
      {/* Compteur + filtres */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <Film className="w-5 h-5 text-[var(--ipk-green)]" />
        <span className="text-[var(--ipk-ink)]" style={{ fontSize: "15px", fontWeight: 700 }}>
          {filtered.length} vidéo{filtered.length > 1 ? "s" : ""} - cliquez ▶ pour lire dans la vignette
        </span>
        {presentCats.length > 1 && (
          <span className="ml-auto inline-flex items-center gap-1 text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>
            <Filter className="w-3.5 h-3.5" /> Thème :
          </span>
        )}
      </div>

      {presentCats.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCat("all")}
            className={`px-3 py-1.5 rounded-xl transition-colors ${activeCat === "all" ? "bg-[var(--ipk-green-dark)] text-white" : "bg-[var(--ipk-surface)] text-[var(--ipk-text)] hover:bg-[var(--ipk-green)]/10"}`}
            style={{ fontSize: "12px", fontWeight: 600 }}
          >
            Tous
          </button>
          {MEDIA_CATEGORIES.filter((c) => presentCats.includes(c.value)).map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCat(cat.value)}
              className={`px-3 py-1.5 rounded-xl transition-colors ${activeCat === cat.value ? "bg-[var(--ipk-green-dark)] text-white" : "bg-[var(--ipk-surface)] text-[var(--ipk-text)] hover:bg-[var(--ipk-green)]/10"}`}
              style={{ fontSize: "12px", fontWeight: 600 }}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-center text-[var(--ipk-text)] py-10" style={{ fontSize: "14px" }}>
          Aucun contenu pour ce thème.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Mini-lecteur (pages de rubrique /medias/:slug) ────────────────────────────

export function MediaMiniPlayer({ rubriquesSlug }: { rubriquesSlug: string }) {
  const all = getMediaByRubrique(rubriquesSlug);
  const shown = all.slice(0, 3);

  if (!shown.length) return null;

  return (
    <div className="mt-10">
      <h2
        className="text-[var(--ipk-ink)] mb-1 inline-flex items-center gap-2"
        style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 700 }}
      >
        <Film className="w-5 h-5 text-[var(--ipk-green)]" /> Regarder & Écouter
      </h2>
      <p className="text-[var(--ipk-text)] mb-5" style={{ fontSize: "14px" }}>
        Documentaires et témoignages liés à ce thème. Cliquez sur ▶ pour lire directement dans la vignette, sans quitter la page.
      </p>

      <div className="grid sm:grid-cols-3 gap-4">
        {shown.map((item) => (
          <MediaCard key={item.id} item={item} />
        ))}
      </div>

      {all.length > 3 && (
        <div className="mt-5 text-center">
          <Link
            to="/medias/bibliotheque-audiovisuelle"
            className="inline-flex items-center gap-2 text-[var(--ipk-green)] hover:underline"
            style={{ fontSize: "14px", fontWeight: 600 }}
          >
            <Film className="w-4 h-4" /> Voir toute la bibliothèque - {all.length} vidéos disponibles
          </Link>
        </div>
      )}
    </div>
  );
}
