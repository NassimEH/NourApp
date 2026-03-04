import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";

const ACCENT = "#3d6b47";
const ICON_COLOR = "#191D31";
const TEXT_MUTED = "rgba(255,255,255,0.8)";

interface QuranMiniPlayerProps {
  suraNumber: number;
  suraName?: string;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  progress: number;
  onPlayPause: () => void;
  onClose?: () => void;
}

export function QuranMiniPlayer({
  suraNumber,
  suraName,
  isPlaying,
  isLoading,
  error,
  progress,
  onPlayPause,
  onClose,
}: QuranMiniPlayerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.title}>Sourate {suraNumber}</Text>
          {suraName ? (
            <Text style={styles.subtitle} numberOfLines={1}>{suraName}</Text>
          ) : null}
          {error ? (
            <Text style={styles.error} numberOfLines={1}>{error}</Text>
          ) : null}
        </View>
        <TouchableOpacity
          style={styles.playButton}
          onPress={onPlayPause}
          disabled={isLoading}
        >
          {isLoading ? (
            <Feather name="loader" size={24} color="#fff" />
          ) : (
            <Feather name={isPlaying ? "pause" : "play"} size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(61, 107, 71, 0.95)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 6,
    paddingHorizontal: 20,
    paddingBottom: 28,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "rgba(0,0,0,0.08)",
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginBottom: 12,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  info: { flex: 1, marginRight: 16 },
  title: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Regular",
    color: TEXT_MUTED,
    marginTop: 2,
  },
  error: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Regular",
    color: "rgba(255,200,200,0.95)",
    marginTop: 2,
  },
  playButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
});
