import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
  Modal,
  TouchableOpacity,
  Text,
  Image,
  PanResponder,
  ScrollView,
} from "react-native";
import { ThemedGlassSurface } from "@/components/ThemedGlassSurface";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppIcon } from "@/components/AppIcon";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import type { Reciter } from "@/lib/quran/types";

const quranArtwork = require("@/assets/images/islamic-new-year-quran-book-with-dates-photo.jpg");
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function ReciterSelector({
  visible,
  onClose,
  reciters,
  currentReciter,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  reciters: Reciter[];
  currentReciter: string;
  onSelect: (id: string) => void;
}) {
  const { t } = useTranslation();
  const colors = useAppTheme();
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  const renderContent = () => (
    <View style={[reciterStyles.content, { paddingBottom: insets.bottom + 20 }]}>
      <View style={reciterStyles.header}>
        <Text style={[reciterStyles.title, { color: colors.text }]}>
          {t("profile.reciterModalTitle")}
        </Text>
        <TouchableOpacity onPress={onClose} style={reciterStyles.closeBtn}>
          <AppIcon name="x" size={24} color={colors.icon} />
        </TouchableOpacity>
      </View>
      <ScrollView style={reciterStyles.list} showsVerticalScrollIndicator={false}>
        {reciters.map((reciter) => {
          const isSelected = reciter.id === currentReciter;
          return (
            <TouchableOpacity
              key={reciter.id}
              style={[
                reciterStyles.item,
                isSelected && { backgroundColor: colors.accent },
                !isSelected && { backgroundColor: colors.accentSurface },
              ]}
              onPress={() => {
                onSelect(reciter.id);
                onClose();
              }}
              activeOpacity={0.7}
            >
              <View
                style={[
                  reciterStyles.itemIcon,
                  { backgroundColor: colors.cardElevated },
                ]}
              >
                <AppIcon
                  name="mic"
                  size={22}
                  color={isSelected ? colors.onAccent : colors.accent}
                />
              </View>
              <View style={reciterStyles.itemInfo}>
                <Text
                  style={[
                    reciterStyles.itemName,
                    { color: isSelected ? colors.onAccent : colors.text },
                  ]}
                >
                  {reciter.name}
                </Text>
                <Text style={[reciterStyles.itemStyle, { color: colors.textMuted }]}>
                  {t(reciter.styleKey)}
                </Text>
              </View>
              {isSelected ? (
                <AppIcon name="check" size={20} color={colors.onAccent} />
              ) : null}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <Modal transparent visible={visible} animationType="slide" statusBarTranslucent>
      <Pressable style={reciterStyles.backdrop} onPress={onClose}>
        <View />
      </Pressable>
      <View style={reciterStyles.container}>
        <ThemedGlassSurface style={reciterStyles.glass} borderRadius={24}>
          {renderContent()}
        </ThemedGlassSurface>
      </View>
    </Modal>
  );
}

const reciterStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: SCREEN_HEIGHT * 0.6,
  },
  glass: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  content: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans-Bold",
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    maxHeight: SCREEN_HEIGHT * 0.45,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  itemStyle: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Regular",
    marginTop: 2,
  },
});

export function FullScreenPlayer({
  visible,
  onClose,
  suraNumber,
  suraName,
  isPlaying,
  isLoading,
  progress,
  durationMs,
  onPlayPause,
  onUnload,
  currentReciter,
  availableReciters,
  onReciterChange,
}: {
  visible: boolean;
  onClose: () => void;
  suraNumber: number;
  suraName?: string;
  isPlaying: boolean;
  isLoading: boolean;
  progress: number;
  durationMs: number;
  onPlayPause: () => void;
  onUnload: () => void;
  currentReciter: string;
  availableReciters: Reciter[];
  onReciterChange: (id: string) => void;
}) {
  const colors = useAppTheme();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [reciterModalVisible, setReciterModalVisible] = useState(false);

  const currentReciterName =
    availableReciters.find((r) => r.id === currentReciter)?.name ?? "Récitateur";

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
        mass: 1,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateY]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150 || gestureState.vy > 0.5) {
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 250,
            useNativeDriver: true,
          }).start(() => onClose());
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 20,
            stiffness: 200,
            mass: 1,
          }).start();
        }
      },
    })
  ).current;

  const currentTime = formatTime(progress * durationMs);
  const totalTime = formatTime(durationMs);

  const renderContent = () => (
    <View style={[styles.fullPlayerContent, { paddingTop: insets.top + 20 }]}>
      <View
        style={[styles.fullPlayerHandle, { backgroundColor: colors.handle }]}
        {...panResponder.panHandlers}
      />

      <View style={styles.fullPlayerHeader}>
        <TouchableOpacity style={styles.fullPlayerCloseBtn} onPress={onClose}>
          <AppIcon name="chevron-down" size={28} color={colors.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.fullPlayerMenuBtn}
          onPress={() => setReciterModalVisible(true)}
        >
          <AppIcon name="more-vertical" size={24} color={colors.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.fullPlayerArtworkWrap}>
        <Image source={quranArtwork} style={styles.fullPlayerArtwork} />
      </View>

      <View style={styles.fullPlayerInfo}>
        <Text style={[styles.fullPlayerTitle, { color: colors.text }]}>
          Sourate {suraNumber}
        </Text>
        {suraName ? (
          <Text style={[styles.fullPlayerSubtitle, { color: colors.textMuted }]}>
            {suraName}
          </Text>
        ) : null}
        <TouchableOpacity
          style={[
            styles.fullPlayerReciterBtn,
            { backgroundColor: colors.accentSurface },
          ]}
          onPress={() => setReciterModalVisible(true)}
        >
          <AppIcon name="mic" size={14} color={colors.accent} />
          <Text style={[styles.fullPlayerReciterText, { color: colors.accent }]}>
            {currentReciterName}
          </Text>
          <AppIcon name="chevron-right" size={14} color={colors.iconMuted} />
        </TouchableOpacity>
      </View>

      <View style={styles.fullPlayerProgressWrap}>
        <View
          style={[
            styles.fullPlayerProgressBar,
            { backgroundColor: colors.progressTrack },
          ]}
        >
          <View
            style={[
              styles.fullPlayerProgressFill,
              { width: `${progress * 100}%`, backgroundColor: colors.accent },
            ]}
          />
        </View>
        <View style={styles.fullPlayerTimeRow}>
          <Text style={[styles.fullPlayerTimeText, { color: colors.textMuted }]}>
            {currentTime}
          </Text>
          <Text style={[styles.fullPlayerTimeText, { color: colors.textMuted }]}>
            {totalTime}
          </Text>
        </View>
      </View>

      <View style={styles.fullPlayerControls}>
        <TouchableOpacity
          style={[
            styles.fullPlayerSecondaryBtn,
            { backgroundColor: colors.accentSurface },
          ]}
        >
          <AppIcon name="skip-back" size={28} color={colors.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.fullPlayerPlayBtn, { backgroundColor: colors.accent }]}
          onPress={onPlayPause}
          disabled={isLoading}
        >
          {isLoading ? (
            <AppIcon name="loader" size={32} color={colors.onAccent} />
          ) : (
            <AppIcon
              name={isPlaying ? "pause" : "play"}
              size={32}
              color={colors.onAccent}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.fullPlayerSecondaryBtn,
            { backgroundColor: colors.accentSurface },
          ]}
        >
          <AppIcon name="skip-forward" size={28} color={colors.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.fullPlayerActions}>
        <TouchableOpacity style={styles.fullPlayerActionBtn}>
          <AppIcon name="repeat" size={22} color={colors.iconMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.fullPlayerActionBtn}>
          <AppIcon name="heart" size={22} color={colors.iconMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.fullPlayerActionBtn} onPress={onUnload}>
          <AppIcon name="x-circle" size={22} color={colors.iconMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!visible) return null;

  return (
    <>
      <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
        <Animated.View style={[styles.fullPlayerContainer, { transform: [{ translateY }] }]}>
          <ThemedGlassSurface style={styles.fullPlayerGlass} borderRadius={0}>
            {renderContent()}
          </ThemedGlassSurface>
        </Animated.View>
      </Modal>
      <ReciterSelector
        visible={reciterModalVisible}
        onClose={() => setReciterModalVisible(false)}
        reciters={availableReciters}
        currentReciter={currentReciter}
        onSelect={onReciterChange}
      />
    </>
  );
}



const styles = StyleSheet.create({
  fullPlayerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  fullPlayerGlass: {
    flex: 1,
  },
  fullPlayerContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  fullPlayerHandle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    alignSelf: "center",
    marginBottom: 20,
    paddingVertical: 15,
  },
  fullPlayerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  fullPlayerCloseBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  fullPlayerMenuBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  fullPlayerArtworkWrap: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 32,
  },
  fullPlayerArtwork: {
    width: SCREEN_WIDTH - 80,
    height: SCREEN_WIDTH - 80,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
  },
  fullPlayerInfo: {
    alignItems: "center",
    marginBottom: 32,
  },
  fullPlayerTitle: {
    fontSize: 24,
    fontFamily: "PlusJakartaSans-Bold",
    textAlign: "center",
  },
  fullPlayerSubtitle: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Medium",
    marginTop: 6,
    textAlign: "center",
  },
  fullPlayerReciterBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 6,
  },
  fullPlayerReciterText: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Medium",
  },
  fullPlayerProgressWrap: {
    marginBottom: 24,
  },
  fullPlayerProgressBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  fullPlayerProgressFill: {
    height: "100%",
    borderRadius: 2,
  },
  fullPlayerTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  fullPlayerTimeText: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Regular",
  },
  fullPlayerControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
    marginBottom: 32,
  },
  fullPlayerSecondaryBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  fullPlayerPlayBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  fullPlayerActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },
  fullPlayerActionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },

});
