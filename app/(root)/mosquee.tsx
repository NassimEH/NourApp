import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { useEffect, useMemo, useState } from "react";
import { toHijri } from "hijri-converter";

import { usePrayerTimes, PRAYER_ORDER, getPrayerLabel, type PrayerKey } from "@/lib/usePrayerTimes";
import { usePrayersChecked } from "@/lib/usePrayersChecked";
import {
  getNextPrayerInfo,
  getCurrentPrayer,
  getNextPrayerTimestamp,
  formatCountdownHM,
} from "@/lib/prayerUtils";

const homeBackground = require("@/assets/images/home-background.png");
const mosqueImage = require("@/mosquée.png");
const ICON_COLOR = "#191D31";
const { width: screenWidth } = Dimensions.get("window");
const H_PADDING = 24;

const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani",
  "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah",
];

function useTodayDates() {
  return useMemo(() => {
    const now = new Date();
    const gy = now.getFullYear();
    const gm = now.getMonth() + 1;
    const gd = now.getDate();
    const gregorian = now.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    try {
      const { hy, hm, hd } = toHijri(gy, gm, gd);
      const hijri = `${HIJRI_MONTHS[hm - 1]} ${hd}, ${hy}`;
      return { gregorian, hijri };
    } catch {
      return { gregorian, hijri: "" };
    }
  }, []);
}

export default function MosqueeScreen() {
  const { gregorian, hijri } = useTodayDates();
  const { timings: prayerTimes, loading: prayerLoading, cityName: prayerCity, coords: prayerCoords } = usePrayerTimes();
  const { toggle: togglePrayerChecked, isChecked: isPrayerChecked } = usePrayersChecked();
  const [countdownNow, setCountdownNow] = useState(() => Date.now());

  const nextPrayer = prayerTimes ? getNextPrayerInfo(prayerTimes) : null;
  const currentPrayer = prayerTimes ? getCurrentPrayer(prayerTimes) : null;
  const SALAT_KEYS: PrayerKey[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const remainingCount = 5 - SALAT_KEYS.filter((k) => isPrayerChecked(k)).length;
  const nextPrayerTimestamp = prayerTimes ? getNextPrayerTimestamp(prayerTimes) : null;
  const nextPrayerCountdownHM = useMemo(() => {
    if (nextPrayerTimestamp == null) return null;
    const remainingSeconds = Math.max(0, Math.floor((nextPrayerTimestamp - countdownNow) / 1000));
    return formatCountdownHM(remainingSeconds);
  }, [nextPrayerTimestamp, countdownNow]);
  const nextPrayerTimeStr = nextPrayer && prayerTimes ? prayerTimes[nextPrayer.name as PrayerKey] : null;

  useEffect(() => {
    if (!prayerTimes || !nextPrayer) return;
    const id = setInterval(() => setCountdownNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, [prayerTimes, nextPrayer]);

  return (
    <ImageBackground source={homeBackground} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Ma mosquée</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
            <Feather name="chevron-left" size={28} color={ICON_COLOR} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mosqueImageBlock}>
            <Image
              source={mosqueImage}
              style={styles.mosqueImageLarge}
              resizeMode="contain"
            />
            <Text style={styles.mosqueName}>Mosquée de Crosne</Text>
          </View>

          <View style={styles.prayerSection}>
            <Text style={styles.sectionLabel}>
              Prières{prayerCity ? ` — ${prayerCity}` : ""}
            </Text>
            <View style={styles.prayerCard}>
              {prayerLoading ? (
                <ActivityIndicator size="small" color="#3d6b47" style={{ paddingVertical: 24 }} />
              ) : prayerTimes ? (
                <>
                  <View style={styles.prayerCardHeader}>
                    <Text style={styles.prayerCardMethod}>Aladhan (MWL)</Text>
                    {hijri ? <Text style={styles.prayerCardHijri}>{hijri}</Text> : null}
                    <Text style={styles.prayerCardGregorian}>{gregorian}</Text>
                    {prayerCoords ? (
                      <View style={styles.prayerCardCoords}>
                        <Feather name="map-pin" size={12} color="rgba(0,0,0,0.5)" />
                        <Text style={styles.prayerCardCoordsText}>
                          Lat: {prayerCoords.latitude.toFixed(5)}, Lon: {prayerCoords.longitude.toFixed(5)}
                        </Text>
                      </View>
                    ) : prayerCity ? (
                      <View style={styles.prayerCardCoords}>
                        <Feather name="map-pin" size={12} color="rgba(0,0,0,0.5)" />
                        <Text style={styles.prayerCardCoordsText}>{prayerCity}</Text>
                      </View>
                    ) : null}
                    <Text style={styles.prayerCardRemaining}>
                      {remainingCount} prière{remainingCount !== 1 ? "s" : ""} restante{remainingCount !== 1 ? "s" : ""} à faire
                    </Text>
                  </View>
                  {PRAYER_ORDER.filter((k) => k !== "Sunrise").map((key, index) => {
                    const prayerKey = key as PrayerKey;
                    const checked = isPrayerChecked(prayerKey);
                    const isCurrent = currentPrayer?.label === getPrayerLabel(prayerKey);
                    return (
                      <Pressable
                        key={key}
                        style={({ pressed }) => [
                          styles.prayerRow,
                          isCurrent && styles.prayerRowCurrent,
                          index === PRAYER_ORDER.filter((k) => k !== "Sunrise").length - 1 && styles.prayerRowLast,
                          pressed && styles.prayerRowPressed,
                        ]}
                        onPress={() => togglePrayerChecked(prayerKey)}
                      >
                        <View style={styles.prayerRowLeft}>
                          <Text
                            style={[styles.prayerRowLabel, checked && styles.prayerLabelDone]}
                            numberOfLines={1}
                          >
                            {getPrayerLabel(prayerKey)}
                          </Text>
                          <View style={styles.prayerRowTimeRow}>
                            {isCurrent && <View style={styles.prayerRowCurrentDot} />}
                            <Text style={styles.prayerRowTime}>{prayerTimes[prayerKey]}</Text>
                          </View>
                        </View>
                        <View style={styles.prayerRowCheckboxWrap}>
                          <View style={[styles.prayerCheckbox, checked && styles.prayerCheckboxChecked]}>
                            {checked ? <Feather name="check" size={14} color="#fff" /> : null}
                          </View>
                        </View>
                      </Pressable>
                    );
                  })}
                  {nextPrayer && (
                    <>
                      <View style={styles.sectionDivider} />
                      <View style={styles.prayerNextWidget}>
                        <View style={styles.prayerNextWidgetLeft}>
                          <Text style={styles.prayerNextLabel}>PROCHAINE PRIÈRE</Text>
                          <View style={styles.prayerNextWidgetRow}>
                            <Feather name="sunset" size={14} color="rgba(61, 107, 71, 0.9)" />
                            <Text style={styles.prayerNextText}>
                              {nextPrayer.label}{nextPrayerTimeStr ? ` à ${nextPrayerTimeStr}` : ""}
                            </Text>
                          </View>
                        </View>
                        {nextPrayerCountdownHM != null && (
                          <Text style={styles.prayerNextCountdown}>{nextPrayerCountdownHM}</Text>
                        )}
                      </View>
                    </>
                  )}
                  <Text style={styles.prayerCardFooter}>
                    {currentPrayer ? `${currentPrayer.label} : Standard` : "Calcul : MWL"}
                  </Text>
                </>
              ) : (
                <Text style={styles.prayerUnavailable}>Horaires non disponibles. Active la localisation.</Text>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "transparent" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: H_PADDING,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "PlusJakartaSans-Bold",
    color: ICON_COLOR,
  },
  backBtn: { paddingVertical: 8, paddingLeft: 8 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: H_PADDING, paddingBottom: 120 },
  mosqueImageBlock: { alignItems: "center", marginBottom: 24 },
  mosqueImageLarge: {
    width: "100%",
    maxWidth: screenWidth - 2 * H_PADDING,
    height: 220,
  },
  mosqueName: {
    fontSize: 18,
    fontFamily: "PlusJakartaSans-Bold",
    color: ICON_COLOR,
    marginTop: 12,
  },
  prayerSection: { marginBottom: 24 },
  sectionLabel: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#191D31",
    marginBottom: 12,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.06)",
    marginVertical: 12,
  },
  prayerCard: {
    backgroundColor: "transparent",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingLeft: 22,
    borderLeftWidth: 3,
    borderLeftColor: "rgba(61, 107, 71, 0.35)",
  },
  prayerCardHeader: {
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.08)",
  },
  prayerCardMethod: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans-Medium",
    color: "rgba(0,0,0,0.5)",
    marginBottom: 4,
  },
  prayerCardHijri: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "rgba(0,0,0,0.85)",
    marginBottom: 2,
  },
  prayerCardGregorian: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Regular",
    color: "rgba(0,0,0,0.6)",
    marginBottom: 4,
  },
  prayerCardCoords: { flexDirection: "row", alignItems: "center", gap: 4 },
  prayerCardCoordsText: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans-Regular",
    color: "rgba(0,0,0,0.5)",
  },
  prayerCardRemaining: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Medium",
    color: "rgba(0,0,0,0.6)",
    marginTop: 6,
  },
  prayerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginHorizontal: -6,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.06)",
    position: "relative",
  },
  prayerRowCurrent: {
    backgroundColor: "rgba(61, 107, 71, 0.12)",
    borderRadius: 12,
    marginHorizontal: 0,
    paddingHorizontal: 14,
    paddingVertical: 18,
  },
  prayerRowLeft: { flex: 1, marginRight: 44 },
  prayerRowTimeRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
  prayerRowLabel: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Medium",
    color: "#191D31",
  },
  prayerLabelDone: { textDecorationLine: "line-through", color: "#5b5d5e" },
  prayerRowTime: { fontSize: 14, fontFamily: "PlusJakartaSans-Regular", color: "#5b5d5e" },
  prayerRowCurrentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(61, 107, 71, 0.9)",
  },
  prayerRowCheckboxWrap: { position: "absolute", right: 0, top: 16 },
  prayerRowLast: { borderBottomWidth: 0 },
  prayerRowPressed: { opacity: 0.7 },
  prayerCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(61, 107, 71, 0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
  prayerCheckboxChecked: {
    backgroundColor: "rgba(61, 107, 71, 0.9)",
    borderColor: "rgba(61, 107, 71, 0.9)",
  },
  prayerNextWidget: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  prayerNextWidgetLeft: { flex: 1 },
  prayerNextLabel: {
    fontSize: 9,
    fontFamily: "PlusJakartaSans-Medium",
    color: "rgba(0,0,0,0.55)",
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  prayerNextWidgetRow: { flexDirection: "row", alignItems: "center" },
  prayerNextText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#191D31",
    marginLeft: 6,
  },
  prayerNextCountdown: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Bold",
    color: "rgba(0,0,0,0.85)",
    letterSpacing: 0.5,
  },
  prayerCardFooter: {
    fontSize: 10,
    fontFamily: "PlusJakartaSans-Regular",
    color: "rgba(0,0,0,0.45)",
    marginTop: 10,
    textAlign: "center",
  },
  prayerUnavailable: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    color: "#5b5d5e",
    paddingVertical: 12,
  },
});
