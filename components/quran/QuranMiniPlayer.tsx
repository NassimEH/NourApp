import {
  Animated,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BlurView } from "expo-blur";
import { GlassView, isGlassEffectAPIAvailable } from "expo-glass-effect";
import Feather from "@expo/vector-icons/Feather";
import { useEffect, useRef, useState } from "react";

const quranArtwork = require("@/assets/images/islamic-new-year-quran-book-with-dates-photo.jpg");

const ACCENT = "#3d6b47";
const ICON_COLOR = "#191D31";
const TEXT_SECONDARY = "#5b5d5e";

interface QuranMiniPlayerProps {
  suraNumber: number;
  suraName?: string;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  progress: number;
  durationMs?: number;
  onPlayPause: () => void;
  onClose?: () => void;
  onPress?: () => void;
}

const useGlassAvailable = () => {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    if (Platform.OS !== "ios") return;
    try {
      setAvailable(
        typeof isGlassEffectAPIAvailable === "function" && isGlassEffectAPIAvailable()
      );
    } catch {
      setAvailable(false);
    }
  }, []);
  return available;
};

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
  onClose,
  onPress,
}: QuranMiniPlayerProps) {
  const glassAvailable = useGlassAvailable();
  const isIOS = Platform.OS === "ios";

  const scale = useRef(new Animated.Value(1)).current;

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

  const renderContent = () => (
    <View style={styles.contentWrapper}>
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
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
              <Feather name="loader" size={22} color={ICON_COLOR} />
            ) : (
              <Feather
                name={isPlaying ? "pause" : "play"}
                size={22}
                color={ICON_COLOR}
              />
            )}
          </TouchableOpacity>

          {onClose && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={8}
              activeOpacity={0.7}
            >
              <Feather name="x" size={20} color={TEXT_SECONDARY} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  const renderGlassPlayer = () => (
    <View style={styles.glassContainer}>
      {renderContent()}
    </View>
  );

  return (
    <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
      <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
        {glassAvailable ? (
          <GlassView
            style={styles.glassOuter}
            glassEffectStyle="regular"
            isInteractive
          >
            {renderGlassPlayer()}
          </GlassView>
        ) : (
          <View style={styles.glassOuter}>
            <BlurView
              intensity={isIOS ? 120 : 140}
              tint="light"
              style={StyleSheet.absoluteFill}
            >
              <View style={StyleSheet.absoluteFill} collapsable />
            </BlurView>
            <View style={styles.glassOverlay} pointerEvents="none" />
            {renderGlassPlayer()}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  glassOuter: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.25)",
    ...(Platform.OS === "android" && {
      elevation: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 20,
      backgroundColor: "rgba(255,255,255,0.25)",
    }),
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 20,
  },
  glassContainer: {
    ...(Platform.OS === "android" && {
      backgroundColor: "rgba(255,255,255,0.2)",
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
    backgroundColor: "rgba(61, 107, 71, 0.2)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: ACCENT,
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
    color: ICON_COLOR,
  },
  timeText: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Regular",
    color: TEXT_SECONDARY,
    marginTop: 2,
  },
  error: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans-Regular",
    color: "#c0392b",
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
    backgroundColor: "rgba(61, 107, 71, 0.15)",
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
});
