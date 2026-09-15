/**
 * Contexte global pour la lecture audio Coran.
 * Permet d'afficher la mini barre de lecture depuis n'importe quel écran (ex. Explorer)
 * et de faire réagir la bottom bar.
 *
 * SDK 57+ : expo-av retiré d'Expo Go → expo-audio (createAudioPlayer).
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  createAudioPlayer,
  setAudioModeAsync,
  type AudioPlayer,
  type AudioStatus,
} from "expo-audio";
import { getAyahAudioUrl } from "./api";
import { resolveSuraAudioUri } from "./offline-downloads";
import { persistLastListen } from "./persistLastListen";
import { getLastListen } from "./storage";
import { DEFAULT_AUDIO_RECITER, AVAILABLE_RECITERS, type Reciter } from "./types";
import { useAppPreferences } from "@/lib/app-preferences";
import { useTranslation } from "@/lib/i18n";

export type PlaybackMode = "sura" | "ayah";

export interface QuranAudioState {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  progress: number;
  durationMs: number;
  currentSura: number | null;
  currentAyah: number | null;
  mode: PlaybackMode | null;
  currentReciter: string;
}

const initialState: QuranAudioState = {
  isPlaying: false,
  isLoading: false,
  error: null,
  progress: 0,
  durationMs: 0,
  currentSura: null,
  currentAyah: null,
  mode: null,
  currentReciter: DEFAULT_AUDIO_RECITER,
};

type QuranAudioContextValue = QuranAudioState & {
  playSura: (suraNumber: number) => Promise<void>;
  playAyah: (suraNumber: number, globalAyahNumber: number) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  unload: () => Promise<void>;
  setReciter: (reciterId: string) => Promise<void>;
  availableReciters: Reciter[];
  isPlayerVisible: boolean;
};

const QuranAudioContext = createContext<QuranAudioContextValue | null>(null);

async function setAudioMode() {
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: "duckOthers",
    });
  } catch {
    // ignore mode errors on unsupported platforms
  }
}

function durationMsFromPlayer(player: AudioPlayer): number {
  const seconds = player.duration;
  return Number.isFinite(seconds) && seconds > 0 ? Math.round(seconds * 1000) : 0;
}

function positionMsFromPlayer(player: AudioPlayer): number {
  const seconds = player.currentTime;
  return Number.isFinite(seconds) && seconds > 0 ? Math.round(seconds * 1000) : 0;
}

export function QuranAudioProvider({ children }: { children: React.ReactNode }) {
  const { quranReciter, setQuranReciter } = useAppPreferences();
  const { t } = useTranslation();
  const [state, setState] = useState<QuranAudioState>(initialState);
  const playerRef = useRef<AudioPlayer | null>(null);
  const statusSubRef = useRef<{ remove: () => void } | null>(null);
  const positionRef = useRef(0);
  const durationRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentSuraRef = useRef<number | null>(null);
  const playbackModeRef = useRef<PlaybackMode | null>(null);

  useEffect(() => {
    currentSuraRef.current = state.currentSura;
    playbackModeRef.current = state.mode;
  }, [state.currentSura, state.mode]);

  useEffect(() => {
    if (!AVAILABLE_RECITERS.some((r) => r.id === quranReciter)) return;
    setState((s) => ({ ...s, currentReciter: quranReciter }));
  }, [quranReciter]);

  const stopProgressUpdates = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const releasePlayer = useCallback(() => {
    statusSubRef.current?.remove();
    statusSubRef.current = null;
    if (playerRef.current) {
      try {
        playerRef.current.pause();
        playerRef.current.remove();
      } catch {
        // ignore
      }
      playerRef.current = null;
    }
  }, []);

  const unload = useCallback(async () => {
    stopProgressUpdates();
    releasePlayer();
    positionRef.current = 0;
    durationRef.current = 0;
    setState((s) => ({
      ...s,
      isPlaying: false,
      isLoading: false,
      progress: 0,
      durationMs: 0,
      currentSura: null,
      currentAyah: null,
      mode: null,
    }));
  }, [releasePlayer, stopProgressUpdates]);

  const startProgressUpdates = useCallback(() => {
    stopProgressUpdates();
    intervalRef.current = setInterval(() => {
      const player = playerRef.current;
      if (player) {
        if (player.duration > 0) {
          durationRef.current = durationMsFromPlayer(player);
        }
        positionRef.current = positionMsFromPlayer(player);
      }
      setState((s) => {
        const d = durationRef.current;
        const p = positionRef.current;
        const progress = d > 0 ? p / d : 0;
        const sura = currentSuraRef.current;
        if (sura != null && playbackModeRef.current === "sura") {
          persistLastListen(sura, progress);
        } else if (sura != null && playbackModeRef.current === "ayah") {
          persistLastListen(sura, progress);
        }
        return {
          ...s,
          progress,
          durationMs: d,
        };
      });
    }, 500);
  }, [stopProgressUpdates]);

  const attachPlayer = useCallback(
    (player: AudioPlayer) => {
      playerRef.current = player;
      let playRequested = false;

      const tryPlay = () => {
        if (playRequested) return;
        playRequested = true;
        try {
          player.play();
          setState((s) => ({
            ...s,
            isLoading: false,
            isPlaying: true,
            durationMs: durationRef.current,
          }));
        } catch {
          setState((s) => ({
            ...s,
            isLoading: false,
            error: t("audio.playbackStartError"),
          }));
        }
      };

      statusSubRef.current = player.addListener(
        "playbackStatusUpdate",
        (st: AudioStatus) => {
          if (st.duration > 0) {
            durationRef.current = Math.round(st.duration * 1000);
          }
          if (st.currentTime != null) {
            positionRef.current = Math.round(st.currentTime * 1000);
          }
          if (st.didJustFinish) {
            void unload();
            return;
          }
          if (st.isLoaded) {
            tryPlay();
          }
        }
      );

      if (player.isLoaded || player.duration > 0) {
        durationRef.current = durationMsFromPlayer(player);
        tryPlay();
      }

      startProgressUpdates();
    },
    [startProgressUpdates, t, unload]
  );

  const playSuraWithReciter = useCallback(
    async (suraNumber: number, reciter: string) => {
      await setAudioMode();
      await unload();
      setState((s) => ({
        ...s,
        isLoading: true,
        error: null,
        currentSura: suraNumber,
        currentAyah: null,
        mode: "sura",
      }));
      try {
        const url = await resolveSuraAudioUri(suraNumber, reciter);
        const player = createAudioPlayer({ uri: url });
        durationRef.current = durationMsFromPlayer(player);
        setState((s) => ({
          ...s,
          isLoading: false,
          isPlaying: false,
          durationMs: durationRef.current,
        }));
        attachPlayer(player);
        persistLastListen(suraNumber, 0, true);
      } catch {
        setState((s) => ({
          ...s,
          isLoading: false,
          error: t("audio.playbackError"),
        }));
      }
    },
    [attachPlayer, t, unload]
  );

  const setReciter = useCallback(
    async (reciterId: string) => {
      if (!AVAILABLE_RECITERS.some((r) => r.id === reciterId)) return;
      setQuranReciter(reciterId);
      const currentSura = state.currentSura;
      const currentMode = state.mode;
      setState((s) => ({ ...s, currentReciter: reciterId }));
      if (currentSura != null && currentMode === "sura") {
        await unload();
        setTimeout(() => {
          void playSuraWithReciter(currentSura, reciterId);
        }, 100);
      }
    },
    [setQuranReciter, state.currentSura, state.mode, unload, playSuraWithReciter]
  );

  const playSura = useCallback(
    async (suraNumber: number) => {
      await setAudioMode();
      await unload();
      setState((s) => ({
        ...s,
        isLoading: true,
        error: null,
        currentSura: suraNumber,
        currentAyah: null,
        mode: "sura",
      }));
      try {
        const lastListen = await getLastListen();
        const resumeProgress =
          lastListen?.suraNumber === suraNumber && lastListen.progress > 0.02
            ? lastListen.progress
            : 0;

        const url = await resolveSuraAudioUri(suraNumber, state.currentReciter);
        const player = createAudioPlayer({ uri: url });
        durationRef.current = durationMsFromPlayer(player);

        if (resumeProgress > 0 && durationRef.current > 0) {
          const seekSec = (resumeProgress * durationRef.current) / 1000;
          await player.seekTo(seekSec);
          positionRef.current = Math.floor(resumeProgress * durationRef.current);
        }

        setState((s) => ({
          ...s,
          isLoading: false,
          isPlaying: false,
          durationMs: durationRef.current,
          progress: resumeProgress,
        }));
        attachPlayer(player);
        persistLastListen(suraNumber, resumeProgress, true);
      } catch {
        setState((s) => ({
          ...s,
          isLoading: false,
          error: t("audio.playbackError"),
        }));
      }
    },
    [attachPlayer, t, unload, state.currentReciter]
  );

  const playAyah = useCallback(
    async (suraNumber: number, globalAyahNumber: number) => {
      await setAudioMode();
      await unload();
      setState((s) => ({
        ...s,
        isLoading: true,
        error: null,
        currentSura: suraNumber,
        currentAyah: globalAyahNumber,
        mode: "ayah",
      }));
      try {
        const url = getAyahAudioUrl(globalAyahNumber, state.currentReciter);
        const player = createAudioPlayer({ uri: url });
        durationRef.current = durationMsFromPlayer(player);
        setState((s) => ({
          ...s,
          isLoading: false,
          isPlaying: false,
          durationMs: durationRef.current,
        }));
        attachPlayer(player);
        persistLastListen(suraNumber, 0, true);
      } catch {
        setState((s) => ({
          ...s,
          isLoading: false,
          error: t("audio.playbackError"),
        }));
      }
    },
    [attachPlayer, t, unload, state.currentReciter]
  );

  const pause = useCallback(async () => {
    if (!playerRef.current) return;
    try {
      playerRef.current.pause();
      stopProgressUpdates();
      setState((s) => ({ ...s, isPlaying: false }));
    } catch {
      // ignore
    }
  }, [stopProgressUpdates]);

  const resume = useCallback(async () => {
    if (!playerRef.current) return;
    try {
      playerRef.current.play();
      startProgressUpdates();
      setState((s) => ({ ...s, isPlaying: true }));
    } catch {
      // ignore
    }
  }, [startProgressUpdates]);

  const togglePlayPause = useCallback(async () => {
    if (state.isPlaying) await pause();
    else if (playerRef.current) await resume();
  }, [state.isPlaying, pause, resume]);

  useEffect(() => {
    return () => {
      void unload();
    };
  }, [unload]);

  const isPlayerVisible = state.currentSura != null;

  const value: QuranAudioContextValue = {
    ...state,
    playSura,
    playAyah,
    togglePlayPause,
    unload,
    setReciter,
    availableReciters: AVAILABLE_RECITERS,
    isPlayerVisible,
  };

  return (
    <QuranAudioContext.Provider value={value}>
      {children}
    </QuranAudioContext.Provider>
  );
}

export function useQuranAudioContext(): QuranAudioContextValue {
  const ctx = useContext(QuranAudioContext);
  if (!ctx)
    throw new Error("useQuranAudioContext must be used within QuranAudioProvider");
  return ctx;
}

export function useQuranAudioContextOptional(): QuranAudioContextValue | null {
  return useContext(QuranAudioContext);
}
