import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music2 } from "lucide-react";
import { useBackgroundMusic, BG_TRACKS, BG_VOLUME } from "../hooks/use-background-music";

declare global {
  interface Window {
    YT?: {
      Player: new (el: HTMLElement, opts: object) => {
        playVideo: () => void;
        pauseVideo: () => void;
        setVolume: (v: number) => void;
        getPlayerState: () => number;
      };
      PlayerState: { PLAYING: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

function useYTPlayer(containerId: string, youtubeId: string, shouldPlay: boolean, volume: number) {
  const playerRef = useRef<ReturnType<NonNullable<typeof window.YT>["Player"]> | null>(null);
  const readyRef = useRef(false);

  useEffect(() => {
    const initPlayer = () => {
      const el = document.getElementById(containerId);
      if (!el || !window.YT?.Player) return;
      playerRef.current = new window.YT.Player(el, {
        videoId: youtubeId,
        playerVars: { autoplay: 0, controls: 0, disablekb: 1, fs: 0, rel: 0, modestbranding: 1, iv_load_policy: 3, playsinline: 1 },
        events: {
          onReady: () => {
            readyRef.current = true;
            playerRef.current?.setVolume(volume);
            if (shouldPlay) playerRef.current?.playVideo();
          },
        },
      });
    };
    if (window.YT?.Player) {
      initPlayer();
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { prev?.(); initPlayer(); };
      if (!document.getElementById("yt-api-script")) {
        const s = document.createElement("script");
        s.id = "yt-api-script";
        s.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(s);
      }
    }
    return () => { playerRef.current = null; readyRef.current = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeId, containerId]);

  useEffect(() => {
    if (!readyRef.current || !playerRef.current) return;
    if (shouldPlay) { playerRef.current.playVideo(); playerRef.current.setVolume(volume); }
    else playerRef.current.pauseVideo();
  }, [shouldPlay, volume]);
}

export function BackgroundMusicPlayer() {
  const { playing, muted, trackIndex, toggle, mute, next, prev } = useBackgroundMusic();
  const [expanded, setExpanded] = useState(false);
  const volume = muted ? 0 : BG_VOLUME;
  const track = BG_TRACKS[trackIndex];

  // Charge les 5 players YT (toujours cachés)
  useYTPlayer("bg-yt-0", BG_TRACKS[0].youtubeId, playing && trackIndex === 0, volume);
  useYTPlayer("bg-yt-1", BG_TRACKS[1].youtubeId, playing && trackIndex === 1, volume);
  useYTPlayer("bg-yt-2", BG_TRACKS[2].youtubeId, playing && trackIndex === 2, volume);
  useYTPlayer("bg-yt-3", BG_TRACKS[3].youtubeId, playing && trackIndex === 3, volume);
  useYTPlayer("bg-yt-4", BG_TRACKS[4].youtubeId, playing && trackIndex === 4, volume);

  return (
    <>
      {/* Iframes cachées */}
      <div aria-hidden style={{ position: "fixed", width: 1, height: 1, overflow: "hidden", opacity: 0, pointerEvents: "none", left: -9999, top: -9999 }}>
        <div id="bg-yt-0" /><div id="bg-yt-1" /><div id="bg-yt-2" /><div id="bg-yt-3" /><div id="bg-yt-4" />
      </div>

      {/* Widget flottant - coin bas droit */}
      <div
        className="fixed bottom-24 lg:bottom-6 right-4 z-50 select-none"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Pill principal */}
        <div
          className={`
            flex items-center gap-2 rounded-2xl shadow-2xl border border-white/20 px-3 py-2
            transition-all duration-300
            ${expanded ? "w-64 sm:w-72" : "w-auto"}
          `}
          style={{
            background: "linear-gradient(135deg, rgba(17,20,24,0.92) 0%, rgba(13,138,62,0.80) 100%)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          {/* Icone / animation pulse */}
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
            aria-label={expanded ? "Réduire le lecteur" : "Ouvrir le lecteur"}
          >
            <span className="relative flex items-center justify-center">
              <Music2 className="w-4 h-4 text-[#C8F74A]" />
              {playing && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#C8F74A] animate-ping opacity-75" />
              )}
            </span>
          </button>

          {/* Info piste + contrôles (visible si expanded) */}
          {expanded && (
            <>
              <div className="flex-1 min-w-0">
                <div className="text-white truncate" style={{ fontSize: "12px", fontWeight: 600 }}>
                  {track.title}
                </div>
                <div className="text-white/60 truncate" style={{ fontSize: "10px" }}>
                  {track.artist}
                </div>
                {/* Barre de progression simulée */}
                <div className="mt-1.5 h-0.5 rounded-full bg-white/20 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#C8F74A] transition-all"
                    style={{
                      width: playing ? "60%" : "0%",
                      animation: playing ? "ipk-music-progress 30s linear infinite" : "none",
                    }}
                  />
                </div>
              </div>

              {/* Contrôles */}
              <div className="flex items-center gap-0.5 shrink-0">
                <button type="button" onClick={prev} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 text-white/70 hover:text-white transition-colors" aria-label="Piste précédente">
                  <SkipBack className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={toggle} className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#C8F74A] hover:brightness-110 transition-all" aria-label={playing ? "Pause" : "Lecture"}>
                  {playing ? <Pause className="w-4 h-4 text-[var(--ipk-ink)]" /> : <Play className="w-4 h-4 text-[var(--ipk-ink)]" />}
                </button>
                <button type="button" onClick={next} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 text-white/70 hover:text-white transition-colors" aria-label="Piste suivante">
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={mute} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 text-white/70 hover:text-white transition-colors" aria-label={muted ? "Activer le son" : "Couper le son"}>
                  {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </>
          )}

          {/* Si réduit : bouton play/pause seul */}
          {!expanded && (
            <button type="button" onClick={toggle} className="w-7 h-7 rounded-xl flex items-center justify-center hover:bg-white/10 text-white/70 hover:text-white transition-colors" aria-label={playing ? "Pause" : "Lecture"}>
              {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* Indicateurs de pistes (dots) */}
        {expanded && (
          <div className="flex justify-center gap-1.5 mt-2">
            {BG_TRACKS.map((_, i) => (
              <span
                key={i}
                className={`rounded-full transition-all ${i === trackIndex ? "w-4 h-1.5 bg-[#C8F74A]" : "w-1.5 h-1.5 bg-white/30"}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Keyframe pour la barre de progression */}
      <style>{`
        @keyframes ipk-music-progress {
          from { width: 0% }
          to { width: 100% }
        }
      `}</style>
    </>
  );
}
