/**
 * Contexte global pour la lecture audio Coran.
 * Permet d'afficher la mini barre de lecture depuis n'importe quel écran (ex. Explorer)
 * et de faire réagir la bottom bar (passage en vertical à gauche).
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Audio } from "expo-av";
import { getSuraAudioUrl, getAyahAudioUrl } from "./api";
import type { AyahText } from "./types";

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
};

type QuranAudioContextValue = QuranAudioState & {
  playSura: (suraNumber: number) => Promise<void>;
  playAyah: (suraNumber: number, globalAyahNumber: number) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  unload: () => Promise<void>;
  isPlayerVisible: boolean;
};

const QuranAudioContext = createContext<QuranAudioContextValue | null>(null);

async function setAudioMode() {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  } catch {}
}

export function QuranAudioProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<QuranAudioState>(initialState);
  const soundRef = useRef<Audio.Sound | null>(null);
  const positionRef = useRef(0);
  const durationRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const unload = useCallback(async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (soundRef.current) {
      try {
        await soundRef.current.unloadAsync();
      } catch {}
      soundRef.current = null;
    }
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
  }, []);

  const stopProgressUpdates = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

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
      let playRequested = false;
      try {
        const url = getSuraAudioUrl(suraNumber);
        const { sound } = await Audio.Sound.createAsync(
          { uri: url },
          { shouldPlay: false }
        );
        soundRef.current = sound;
        if (durationRef.current === 0) {
          const status = await sound.getStatusAsync();
          if (status.isLoaded && status.durationMillis)
            durationRef.current = status.durationMillis;
        }
        setState((s) => ({
          ...s,
          isLoading: false,
          isPlaying: false,
          durationMs: durationRef.current,
        }));
        sound.setOnPlaybackStatusUpdate((st) => {
          if (!st.isLoaded) return;
          if (st.durationMillis) durationRef.current = st.durationMillis;
          if (st.positionMillis != null) positionRef.current = st.positionMillis;
          if (st.didJustFinish && !st.isLooping) unload();
          if (!playRequested) {
            playRequested = true;
            sound
              .playAsync()
              .then(() => {
                setState((s) => ({
                  ...s,
                  isPlaying: true,
                  durationMs: durationRef.current,
                }));
              })
              .catch(() => {
                setState((s) => ({
                  ...s,
                  error: "Impossible de lancer la lecture",
                }));
              });
          }
        });
        intervalRef.current = setInterval(() => {
          setState((s) => {
            const d = durationRef.current;
            const p = positionRef.current;
            return {
              ...s,
              progress: d > 0 ? p / d : 0,
              durationMs: d,
            };
          });
        }, 500);
        const status = await sound.getStatusAsync();
        if (status.isLoaded && !playRequested) {
          playRequested = true;
          await sound.playAsync();
          setState((s) => ({
            ...s,
            isPlaying: true,
            durationMs: status.durationMillis ?? durationRef.current,
          }));
        }
      } catch (e) {
        setState((s) => ({
          ...s,
          isLoading: false,
          error: e instanceof Error ? e.message : "Erreur lecture audio",
        }));
      }
    },
    [unload]
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
      let playRequested = false;
      try {
        const url = getAyahAudioUrl(globalAyahNumber);
        const { sound } = await Audio.Sound.createAsync(
          { uri: url },
          { shouldPlay: false }
        );
        soundRef.current = sound;
        if (durationRef.current === 0) {
          const status = await sound.getStatusAsync();
          if (status.isLoaded && status.durationMillis)
            durationRef.current = status.durationMillis;
        }
        setState((s) => ({
          ...s,
          isLoading: false,
          isPlaying: false,
          durationMs: durationRef.current,
        }));
        sound.setOnPlaybackStatusUpdate((st) => {
          if (!st.isLoaded) return;
          if (st.durationMillis) durationRef.current = st.durationMillis;
          if (st.positionMillis != null) positionRef.current = st.positionMillis;
          if (st.didJustFinish && !st.isLooping) unload();
          if (!playRequested) {
            playRequested = true;
            sound
              .playAsync()
              .then(() => {
                setState((s) => ({
                  ...s,
                  isPlaying: true,
                  durationMs: durationRef.current,
                }));
              })
              .catch(() => {
                setState((s) => ({
                  ...s,
                  error: "Impossible de lancer la lecture",
                }));
              });
          }
        });
        intervalRef.current = setInterval(() => {
          setState((s) => {
            const d = durationRef.current;
            const p = positionRef.current;
            return {
              ...s,
              progress: d > 0 ? p / d : 0,
              durationMs: d,
            };
          });
        }, 500);
        const status = await sound.getStatusAsync();
        if (status.isLoaded && !playRequested) {
          playRequested = true;
          await sound.playAsync();
          setState((s) => ({
            ...s,
            isPlaying: true,
            durationMs: status.durationMillis ?? durationRef.current,
          }));
        }
      } catch (e) {
        setState((s) => ({
          ...s,
          isLoading: false,
          error: e instanceof Error ? e.message : "Erreur lecture audio",
        }));
      }
    },
    [unload]
  );

  const pause = useCallback(async () => {
    if (!soundRef.current) return;
    try {
      await soundRef.current.pauseAsync();
      stopProgressUpdates();
      setState((s) => ({ ...s, isPlaying: false }));
    } catch {}
  }, [stopProgressUpdates]);

  const resume = useCallback(async () => {
    if (!soundRef.current) return;
    try {
      await soundRef.current.playAsync();
      setState((s) => ({ ...s, isPlaying: true }));
    } catch {}
  }, []);

  const togglePlayPause = useCallback(async () => {
    if (state.isPlaying) await pause();
    else if (soundRef.current) await resume();
  }, [state.isPlaying, pause, resume]);

  useEffect(() => {
    return () => {
      unload();
    };
  }, [unload]);

  const isPlayerVisible = state.currentSura != null;

  const value: QuranAudioContextValue = {
    ...state,
    playSura,
    playAyah,
    togglePlayPause,
    unload,
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
