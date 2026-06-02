import { useCallback, useState, type ReactNode } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FullScreenPlayer } from "@/components/BottomBar";
import { QuranMiniPlayer } from "@/components/quran/QuranMiniPlayer";
import { useQuranAudioContextOptional } from "@/lib/quran/QuranAudioContext";
import { useSuraList } from "@/lib/quran/hooks/useSuraList";

/** Mini-lecteur Coran au-dessus de la barre d’onglets (custom / liquid). */
export function TabBarChrome({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const audio = useQuranAudioContextOptional();
  const { list: suraList } = useSuraList();
  const [fullPlayerVisible, setFullPlayerVisible] = useState(false);

  const paddingBottom = Math.max(insets.bottom, 12);
  const isPlayerVisible = audio?.isPlayerVisible ?? false;

  const suraName =
    audio?.currentSura != null
      ? suraList.find((s) => s.number === audio.currentSura)?.englishName
      : undefined;

  const openFullPlayer = useCallback(() => {
    setFullPlayerVisible(true);
  }, []);

  const closeFullPlayer = useCallback(() => {
    setFullPlayerVisible(false);
  }, []);

  return (
    <>
      <View
        style={[
          styles.container,
          {
            paddingBottom: paddingBottom + (Platform.OS === "ios" ? 22 : 12),
          },
        ]}
        pointerEvents="box-none"
      >
        {isPlayerVisible && audio && audio.currentSura != null ? (
          <View style={styles.miniPlayerWrap}>
            <QuranMiniPlayer
              suraNumber={audio.currentSura}
              suraName={suraName}
              isPlaying={audio.isPlaying}
              isLoading={audio.isLoading}
              error={audio.error}
              progress={audio.progress}
              durationMs={audio.durationMs}
              onPlayPause={audio.togglePlayPause}
              currentReciter={audio.currentReciter}
              availableReciters={audio.availableReciters}
              onReciterChange={(id) => {
                void audio.setReciter(id);
              }}
              onClose={audio.unload}
              onPress={openFullPlayer}
            />
          </View>
        ) : null}

        <View style={styles.barWrap}>{children}</View>
      </View>

      {audio && audio.currentSura != null ? (
        <FullScreenPlayer
          visible={fullPlayerVisible}
          onClose={closeFullPlayer}
          suraNumber={audio.currentSura}
          suraName={suraName}
          isPlaying={audio.isPlaying}
          isLoading={audio.isLoading}
          progress={audio.progress}
          durationMs={audio.durationMs}
          onPlayPause={audio.togglePlayPause}
          onUnload={audio.unload}
          currentReciter={audio.currentReciter}
          availableReciters={audio.availableReciters}
          onReciterChange={audio.setReciter}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  miniPlayerWrap: {
    width: "100%",
    marginBottom: 10,
  },
  barWrap: {
    width: "100%",
    alignItems: "center",
  },
});
