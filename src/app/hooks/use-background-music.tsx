import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";

// 5 titres de musique africaine douce - ambiances variées, écoute de fond.
export const BG_TRACKS = [
  { youtubeId: "ryWGEFFjTKc", title: "Spirit of Manden", artist: "Kora & Balafon, Mali" },
  { youtubeId: "LoAIzebO9Pg", title: "Afrika Ambient", artist: "Djembe & Balafon" },
  { youtubeId: "oBSzhl_qhKA", title: "Instruments Traditionnels", artist: "Africa Sonus" },
  { youtubeId: "Xnl-sVjSH7M", title: "West Africa Guitar", artist: "Samba Touré" },
  { youtubeId: "c3QHaOAFpN4", title: "African Meditation", artist: "Healing Music" },
];

export const BG_VOLUME = 15; // volume de fond en % (faible, discret)

type BgMusicState = {
  playing: boolean;
  muted: boolean;
  trackIndex: number;
  externalMediaPlaying: boolean;
  hasInteracted: boolean;
  toggle: () => void;
  mute: () => void;
  next: () => void;
  prev: () => void;
  setExternalMediaPlaying: (v: boolean) => void;
};

const Ctx = createContext<BgMusicState | null>(null);

export function BackgroundMusicProvider({ children }: { children: React.ReactNode }) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [externalMediaPlaying, setExternalMediaPlayingRaw] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Première interaction utilisateur → activer la musique de fond
  useEffect(() => {
    const onFirstInteraction = () => {
      setHasInteracted(true);
      setPlaying(true);
      window.removeEventListener("click", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
    };
    window.addEventListener("click", onFirstInteraction);
    window.addEventListener("keydown", onFirstInteraction);
    window.addEventListener("touchstart", onFirstInteraction);
    return () => {
      window.removeEventListener("click", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
    };
  }, []);

  // Pause quand l'onglet/fenêtre est masqué·e, reprise quand il revient
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        setPlaying(false);
      } else if (hasInteracted && !externalMediaPlaying) {
        setPlaying(true);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [hasInteracted, externalMediaPlaying]);

  // Coordination avec les vidéos de contenu
  const setExternalMediaPlaying = useCallback((v: boolean) => {
    setExternalMediaPlayingRaw(v);
    if (v) {
      // Un média externe commence → couper la musique de fond immédiatement
      setPlaying(false);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    } else {
      // Un média externe s'arrête → reprendre 5 s après
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = setTimeout(() => {
        if (hasInteracted && !document.hidden) setPlaying(true);
      }, 5000);
    }
  }, [hasInteracted]);

  const toggle = useCallback(() => setPlaying((p) => !p), []);
  const mute = useCallback(() => setMuted((m) => !m), []);
  const next = useCallback(() => { setTrackIndex((i) => (i + 1) % BG_TRACKS.length); setPlaying(true); }, []);
  const prev = useCallback(() => { setTrackIndex((i) => (i - 1 + BG_TRACKS.length) % BG_TRACKS.length); setPlaying(true); }, []);

  return (
    <Ctx.Provider value={{ playing, muted, trackIndex, externalMediaPlaying, hasInteracted, toggle, mute, next, prev, setExternalMediaPlaying }}>
      {children}
    </Ctx.Provider>
  );
}

export function useBackgroundMusic() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBackgroundMusic must be used within BackgroundMusicProvider");
  return ctx;
}
