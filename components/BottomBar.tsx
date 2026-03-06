import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Pressable,
  Platform,
  StyleSheet,
  Animated,
  Dimensions,
  Modal,
  TouchableOpacity,
  Text,
  Image,
  PanResponder,
} from "react-native";
import { BlurView } from "expo-blur";
import { GlassView, isGlassEffectAPIAvailable } from "expo-glass-effect";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

import { QuranMiniPlayer } from "@/components/quran/QuranMiniPlayer";
import { useQuranAudioContextOptional } from "@/lib/quran/QuranAudioContext";
import { useSuraList } from "@/lib/quran/hooks/useSuraList";
import { ScrollView } from "react-native";
import type { Reciter } from "@/lib/quran/types";

const quranArtwork = require("@/assets/images/islamic-new-year-quran-book-with-dates-photo.jpg");

const TAB_ROUTES = [
  { name: "index" as const, label: "Accueil", icon: "home" as const, href: "/(root)/(tabs)" as const },
  { name: "qibla" as const, label: "Mes prières", icon: "sunrise" as const, href: "/(root)/(tabs)/qibla" as const },
  { name: "coran" as const, label: "Bibliothèque", icon: "book-open" as const, href: "/(root)/(tabs)/coran" as const },
  { name: "apprendre" as const, label: "Apprendre", icon: "award" as const, href: "/(root)/(tabs)/apprendre" as const },
  { name: "explore" as const, label: "Explore", icon: "search" as const, href: "/(root)/(tabs)/explore" as const },
  { name: "profile" as const, label: "Profil", icon: "user" as const, href: "/(root)/(tabs)/profile" as const },
];

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const ACCENT = "#3d6b47";
const ICON_COLOR = "#191D31";
const TEXT_SECONDARY = "#5b5d5e";

const useGlassAvailable = () => {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    if (Platform.OS !== "ios") return;
    try {
      setAvailable(typeof isGlassEffectAPIAvailable === "function" && isGlassEffectAPIAvailable());
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

function TabIconButton({
  route,
  isActive,
  onPress,
}: {
  route: (typeof TAB_ROUTES)[number];
  isActive: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const prevActive = useRef(isActive);

  useEffect(() => {
    if (isActive && !prevActive.current) {
      prevActive.current = true;
      Animated.sequence([
        Animated.spring(scale, {
          toValue: 1.25,
          useNativeDriver: true,
          speed: 18,
          bounciness: 10,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 14,
          bounciness: 6,
        }),
      ]).start();
    } else if (!isActive) {
      prevActive.current = false;
    }
  }, [isActive, scale]);

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.86,
      useNativeDriver: true,
      speed: 80,
      bounciness: 8,
    }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 12,
    }).start();
  };

  return (
    <Pressable
      onPress={() => {
        if (Platform.OS === "ios") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[styles.tabIconButton, isActive && styles.tabIconButtonActive]}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Feather name={route.icon} size={22} color={isActive ? "#fff" : ICON_COLOR} />
      </Animated.View>
    </Pressable>
  );
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
  const insets = useSafeAreaInsets();
  const glassAvailable = useGlassAvailable();
  const isIOS = Platform.OS === "ios";

  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7475/ingest/33850d28-f7a1-46b3-b658-a07cfbabfea4',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2f0651'},body:JSON.stringify({sessionId:'2f0651',location:'ReciterSelector.tsx:visibleProp',message:'ReciterSelector visible prop',data:{visible,recitersCount:reciters?.length},timestamp:Date.now(),hypothesisId:'A2'})}).catch(()=>{});
  }, [visible, reciters]);
  // #endregion

  if (!visible) return null;

  const renderContent = () => (
    <View style={[reciterStyles.content, { paddingBottom: insets.bottom + 20 }]}>
      <View style={reciterStyles.header}>
        <Text style={reciterStyles.title}>Choisir un récitateur</Text>
        <TouchableOpacity onPress={onClose} style={reciterStyles.closeBtn}>
          <Feather name="x" size={24} color={ICON_COLOR} />
        </TouchableOpacity>
      </View>
      <ScrollView style={reciterStyles.list} showsVerticalScrollIndicator={false}>
        {reciters.map((reciter) => {
          const isSelected = reciter.id === currentReciter;
          return (
            <TouchableOpacity
              key={reciter.id}
              style={[reciterStyles.item, isSelected && reciterStyles.itemSelected]}
              onPress={() => {
                onSelect(reciter.id);
                onClose();
              }}
              activeOpacity={0.7}
            >
              <View style={reciterStyles.itemIcon}>
                <Feather
                  name="mic"
                  size={22}
                  color={isSelected ? "#fff" : ACCENT}
                />
              </View>
              <View style={reciterStyles.itemInfo}>
                <Text
                  style={[
                    reciterStyles.itemName,
                    isSelected && reciterStyles.itemNameSelected,
                  ]}
                >
                  {reciter.name}
                </Text>
                <Text style={reciterStyles.itemStyle}>{reciter.style}</Text>
              </View>
              {isSelected && (
                <Feather name="check" size={20} color="#fff" />
              )}
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
        {glassAvailable ? (
          <GlassView style={reciterStyles.glass} glassEffectStyle="regular">
            {renderContent()}
          </GlassView>
        ) : (
          <View style={reciterStyles.glass}>
            <BlurView
              intensity={isIOS ? 100 : 120}
              tint="light"
              style={StyleSheet.absoluteFill}
            />
            <View style={reciterStyles.overlay} pointerEvents="none" />
            {renderContent()}
          </View>
        )}
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
    backgroundColor: Platform.OS === "android" ? "rgba(255,255,255,0.95)" : undefined,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.85)",
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
    color: ICON_COLOR,
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
    backgroundColor: "rgba(61, 107, 71, 0.08)",
  },
  itemSelected: {
    backgroundColor: ACCENT,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.9)",
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
    color: ICON_COLOR,
  },
  itemNameSelected: {
    color: "#fff",
  },
  itemStyle: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Regular",
    color: TEXT_SECONDARY,
    marginTop: 2,
  },
});

function FullScreenPlayer({
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
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const glassAvailable = useGlassAvailable();
  const isIOS = Platform.OS === "ios";
  const [reciterModalVisible, setReciterModalVisible] = useState(false);

  const currentReciterName = availableReciters.find((r) => r.id === currentReciter)?.name ?? "Récitateur";

  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7475/ingest/33850d28-f7a1-46b3-b658-a07cfbabfea4',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2f0651'},body:JSON.stringify({sessionId:'2f0651',location:'BottomBar.tsx:reciterModalEffect',message:'Modal visibility changed',data:{reciterModalVisible},timestamp:Date.now(),hypothesisId:'A2'})}).catch(()=>{});
  }, [reciterModalVisible]);
  // #endregion

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
      <View style={styles.fullPlayerHandle} {...panResponder.panHandlers} />

      <View style={styles.fullPlayerHeader}>
        <TouchableOpacity style={styles.fullPlayerCloseBtn} onPress={onClose}>
          <Feather name="chevron-down" size={28} color={ICON_COLOR} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.fullPlayerMenuBtn}
          onPress={() => {
            // #region agent log
            fetch('http://127.0.0.1:7475/ingest/33850d28-f7a1-46b3-b658-a07cfbabfea4',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2f0651'},body:JSON.stringify({sessionId:'2f0651',location:'BottomBar.tsx:menuBtn',message:'Menu button pressed',data:{currentModalState:reciterModalVisible},timestamp:Date.now(),hypothesisId:'A1'})}).catch(()=>{});
            // #endregion
            setReciterModalVisible(true);
          }}
        >
          <Feather name="more-vertical" size={24} color={ICON_COLOR} />
        </TouchableOpacity>
      </View>

      <View style={styles.fullPlayerArtworkWrap}>
        <Image source={quranArtwork} style={styles.fullPlayerArtwork} />
      </View>

      <View style={styles.fullPlayerInfo}>
        <Text style={styles.fullPlayerTitle}>
          Sourate {suraNumber}
        </Text>
        {suraName && (
          <Text style={styles.fullPlayerSubtitle}>{suraName}</Text>
        )}
        <TouchableOpacity
          style={styles.fullPlayerReciterBtn}
          onPress={() => setReciterModalVisible(true)}
        >
          <Feather name="mic" size={14} color={ACCENT} />
          <Text style={styles.fullPlayerReciterText}>{currentReciterName}</Text>
          <Feather name="chevron-right" size={14} color={TEXT_SECONDARY} />
        </TouchableOpacity>
      </View>

      <View style={styles.fullPlayerProgressWrap}>
        <View style={styles.fullPlayerProgressBar}>
          <View
            style={[styles.fullPlayerProgressFill, { width: `${progress * 100}%` }]}
          />
        </View>
        <View style={styles.fullPlayerTimeRow}>
          <Text style={styles.fullPlayerTimeText}>{currentTime}</Text>
          <Text style={styles.fullPlayerTimeText}>{totalTime}</Text>
        </View>
      </View>

      <View style={styles.fullPlayerControls}>
        <TouchableOpacity style={styles.fullPlayerSecondaryBtn}>
          <Feather name="skip-back" size={28} color={ICON_COLOR} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.fullPlayerPlayBtn}
          onPress={onPlayPause}
          disabled={isLoading}
        >
          {isLoading ? (
            <Feather name="loader" size={32} color="#fff" />
          ) : (
            <Feather name={isPlaying ? "pause" : "play"} size={32} color="#fff" />
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.fullPlayerSecondaryBtn}>
          <Feather name="skip-forward" size={28} color={ICON_COLOR} />
        </TouchableOpacity>
      </View>

      <View style={styles.fullPlayerActions}>
        <TouchableOpacity style={styles.fullPlayerActionBtn}>
          <Feather name="repeat" size={22} color={TEXT_SECONDARY} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.fullPlayerActionBtn}>
          <Feather name="heart" size={22} color={TEXT_SECONDARY} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.fullPlayerActionBtn} onPress={onUnload}>
          <Feather name="x-circle" size={22} color={TEXT_SECONDARY} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!visible) return null;

  return (
    <>
      <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
        <Animated.View style={[styles.fullPlayerContainer, { transform: [{ translateY }] }]}>
          {glassAvailable ? (
            <GlassView style={styles.fullPlayerGlass} glassEffectStyle="regular">
              {renderContent()}
            </GlassView>
          ) : (
            <View style={styles.fullPlayerGlass}>
              <BlurView
                intensity={isIOS ? 100 : 120}
                tint="light"
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.fullPlayerOverlay} pointerEvents="none" />
              {renderContent()}
            </View>
          )}
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

export default function BottomBar({ state }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const glassAvailable = useGlassAvailable();
  const audio = useQuranAudioContextOptional();
  const { list: suraList } = useSuraList();
  const currentRoute = state.routes[state.index]?.name;
  const [fullPlayerVisible, setFullPlayerVisible] = useState(false);

  const paddingBottom = Math.max(insets.bottom, 12);
  const isIOS = Platform.OS === "ios";
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

  const renderGlassPill = () => (
    <View style={styles.glassPill}>
      <View style={styles.pillInner}>
        {TAB_ROUTES.map((route) => (
          <TabIconButton
            key={route.name}
            route={route}
            isActive={currentRoute === route.name}
            onPress={() => router.push(route.href)}
          />
        ))}
      </View>
    </View>
  );

  const renderPillContent = () =>
    glassAvailable ? (
      <GlassView style={styles.glassPillOuter} glassEffectStyle="regular" isInteractive>
        {renderGlassPill()}
      </GlassView>
    ) : (
      <View style={styles.glassPillOuter}>
        <BlurView intensity={isIOS ? 120 : 140} tint="light" style={StyleSheet.absoluteFill}>
          <View style={StyleSheet.absoluteFill} collapsable />
        </BlurView>
        <View style={styles.glassPillOverlay} pointerEvents="none" />
        {renderGlassPill()}
      </View>
    );

  return (
    <>
      <View
        style={[styles.container, { paddingBottom: paddingBottom + (isIOS ? 22 : 12) }]}
        pointerEvents="box-none"
      >
        {isPlayerVisible && audio && audio.currentSura != null && (
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
              onClose={audio.unload}
              onPress={openFullPlayer}
            />
          </View>
        )}

        <View style={styles.pillWrap}>{renderPillContent()}</View>
      </View>

      {audio && audio.currentSura != null && (
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
      )}
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
    borderTopWidth: 0,
  },
  pillWrap: {
    width: "100%",
    alignItems: "center",
  },
  miniPlayerWrap: {
    width: "100%",
    marginBottom: 10,
  },
  glassPillOuter: {
    borderRadius: 32,
    overflow: "hidden",
    minHeight: 64,
    maxWidth: 360,
    width: "100%",
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
  glassPillOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 32,
  },
  glassPill: {
    flex: 1,
    ...(Platform.OS === "android" && {
      backgroundColor: "rgba(255,255,255,0.2)",
    }),
  },
  pillInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
  },
  tabIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  tabIconButtonActive: {
    backgroundColor: "rgba(61, 107, 71, 0.9)",
  },
  fullPlayerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  fullPlayerGlass: {
    flex: 1,
    backgroundColor: Platform.OS === "android" ? "rgba(255,255,255,0.95)" : undefined,
  },
  fullPlayerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  fullPlayerContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  fullPlayerHandle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "rgba(0,0,0,0.15)",
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
    color: ICON_COLOR,
    textAlign: "center",
  },
  fullPlayerSubtitle: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Medium",
    color: TEXT_SECONDARY,
    marginTop: 6,
    textAlign: "center",
  },
  fullPlayerReciterBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "rgba(61, 107, 71, 0.1)",
    borderRadius: 20,
    gap: 6,
  },
  fullPlayerReciterText: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Medium",
    color: ACCENT,
  },
  fullPlayerProgressWrap: {
    marginBottom: 24,
  },
  fullPlayerProgressBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(61, 107, 71, 0.2)",
    overflow: "hidden",
  },
  fullPlayerProgressFill: {
    height: "100%",
    backgroundColor: ACCENT,
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
    color: TEXT_SECONDARY,
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
    backgroundColor: "rgba(61, 107, 71, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  fullPlayerPlayBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: ACCENT,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: ACCENT,
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
