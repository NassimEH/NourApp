import {
  Animated,
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppIcon } from "@/components/AppIcon";
import { useMemo, useRef, useState } from "react";
import type { Reciter } from "@/lib/quran/types";
import { useTranslation } from "@/lib/i18n";

import { ThemedGlassSurface } from "@/components/ThemedGlassSurface";
import { useAppTheme } from "@/lib/app-theme";

const quranArtwork = require("@/assets/images/islamic-new-year-quran-book-with-dates-photo.jpg");

interface QuranMiniPlayerProps {
  suraNumber: number;
  suraName?: string;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  progress: number;
  durationMs?: number;
  onPlayPause: () => void;
  currentReciter: string;
  availableReciters: Reciter[];
  onReciterChange: (reciterId: string) => void;
  onClose?: () => void;
  onPress?: () => void;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function QuranMiniPlayer({
  suraNumber,
  suraName,
  isPlaying,
  isLoading,
  error,
  progress,
  durationMs = 0,
  onPlayPause,
  currentReciter,
  availableReciters,
  onReciterChange,
  onClose,
  onPress,
}: QuranMiniPlayerProps) {
  const { t } = useTranslation();
  const colors = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const scale = useRef(new Animated.Value(1)).current;
  const [reciterModalVisible, setReciterModalVisible] = useState(false);

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const currentTime = formatTime(progress * durationMs);
  const totalTime = formatTime(durationMs);

  return (
    <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
      <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
        <ThemedGlassSurface style={styles.glassOuter} borderRadius={20} interactive>
          <View style={styles.contentWrapper}>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[styles.progressFill, { width: `${progress * 100}%` }]}
                />
              </View>
            </View>

            <View style={styles.row}>
              <Image source={quranArtwork} style={styles.artwork} />

              <Pressable style={styles.info} onPress={onPress}>
                <Text style={styles.title} numberOfLines={1}>
                  Sourate {suraNumber} {suraName ? `• ${suraName}` : ""}
                </Text>
                {error ? (
                  <Text style={styles.error} numberOfLines={1}>
                    {error}
                  </Text>
                ) : (
                  <Text style={styles.timeText}>
                    {currentTime} / {totalTime}
                  </Text>
                )}
              </Pressable>

              <View style={styles.controls}>
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={onPlayPause}
                  disabled={isLoading}
                  activeOpacity={0.7}
                >
                  {isLoading ? (
                    <AppIcon name="loader" size={22} color={colors.icon} />
                  ) : (
                    <AppIcon
                      name={isPlaying ? "pause" : "play"}
                      size={22}
                      color={colors.icon}
                    />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.moreButton}
                  onPress={() => setReciterModalVisible(true)}
                  activeOpacity={0.7}
                >
                  <AppIcon name="more-vertical" size={18} color={colors.iconMuted} />
                </TouchableOpacity>

                {onClose ? (
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClose}
                    hitSlop={8}
                    activeOpacity={0.7}
                  >
                    <AppIcon name="x" size={20} color={colors.iconMuted} />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </View>
        </ThemedGlassSurface>
      </Pressable>
      <Modal
        visible={reciterModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setReciterModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setReciterModalVisible(false)}
        >
          <Pressable
            style={[styles.modalCard, { backgroundColor: colors.cardElevated, borderColor: colors.border }]}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {t("profile.reciterModalTitle")}
            </Text>
            {availableReciters.map((reciter) => {
              const selected = reciter.id === currentReciter;
              return (
                <TouchableOpacity
                  key={reciter.id}
                  style={[
                    styles.reciterRow,
                    { borderColor: colors.border },
                    selected && { backgroundColor: colors.accentSurface, borderColor: colors.accentBorder },
                  ]}
                  onPress={() => {
                    onReciterChange(reciter.id);
                    setReciterModalVisible(false);
                  }}
                  activeOpacity={0.8}
                >
                  <View style={styles.reciterInfo}>
                    <Text style={[styles.reciterName, { color: colors.text }]}>{reciter.name}</Text>
                    <Text style={[styles.reciterStyle, { color: colors.textMuted }]}>
                      {reciter.style}
                    </Text>
                  </View>
                  {selected ? <AppIcon name="check" size={18} color={colors.accent} /> : null}
                </TouchableOpacity>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </Animated.View>
  );
}

function createStyles(colors: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    container: {
      width: "100%",
    },
    glassOuter: {
      width: "100%",
      ...(Platform.OS === "android" && {
        elevation: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: colors.isDark ? 0.35 : 0.08,
        shadowRadius: 20,
      }),
    },
    contentWrapper: {
      paddingHorizontal: 12,
      paddingTop: 10,
      paddingBottom: 14,
    },
    progressBarContainer: {
      marginBottom: 10,
    },
    progressBar: {
      height: 3,
      borderRadius: 1.5,
      backgroundColor: colors.progressTrack,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: colors.accent,
      borderRadius: 1.5,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
    },
    artwork: {
      width: 44,
      height: 44,
      borderRadius: 8,
      marginRight: 12,
    },
    info: {
      flex: 1,
      minWidth: 0,
      marginRight: 12,
    },
    title: {
      fontSize: 14,
      fontFamily: "PlusJakartaSans-SemiBold",
      color: colors.text,
    },
    timeText: {
      fontSize: 12,
      fontFamily: "PlusJakartaSans-Regular",
      color: colors.textMuted,
      marginTop: 2,
    },
    error: {
      fontSize: 11,
      fontFamily: "PlusJakartaSans-Regular",
      color: colors.danger,
      marginTop: 2,
    },
    controls: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    playButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.accentSurface,
      alignItems: "center",
      justifyContent: "center",
    },
    closeButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    moreButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    modalBackdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.35)",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 20,
    },
    modalCard: {
      width: "100%",
      borderRadius: 14,
      borderWidth: 1,
      padding: 14,
      gap: 8,
      maxWidth: 420,
    },
    modalTitle: {
      fontSize: 16,
      fontFamily: "PlusJakartaSans-SemiBold",
      marginBottom: 4,
    },
    reciterRow: {
      borderWidth: 1,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    reciterInfo: {
      flex: 1,
      minWidth: 0,
      marginRight: 8,
    },
    reciterName: {
      fontSize: 14,
      fontFamily: "PlusJakartaSans-SemiBold",
    },
    reciterStyle: {
      fontSize: 12,
      fontFamily: "PlusJakartaSans-Regular",
      marginTop: 2,
    },
  });
}
