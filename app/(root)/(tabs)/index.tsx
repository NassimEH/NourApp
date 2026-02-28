import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useEffect, useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { toHijri } from "hijri-converter";

import icons from "@/constants/icons";

const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani",
  "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah",
];

const WEEK_DAYS = ["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"];

const DAY_PILL_ACTIVE = "#3d6b47";
const DAY_PILL_EMPTY_BORDER = "#c4c1c9";

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

const homeBackground = require("@/assets/images/home-background.png");

import Filters from "@/components/Filters";
import NoResults from "@/components/NoResults";
import { Card, FeaturedCard } from "@/components/Cards";
import QiblaCompass from "@/components/QiblaCompass";

import { useAppwrite } from "@/lib/useAppwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { getLatestProperties, getProperties } from "@/lib/appwrite";
import {
  usePrayerTimes,
  PRAYER_ORDER,
  getPrayerLabel,
  type PrayerKey,
} from "@/lib/usePrayerTimes";
import { usePrayersChecked } from "@/lib/usePrayersChecked";
import {
  getQiblaBearing,
  getNextPrayerInfo,
  getCurrentPrayer,
  getNextPrayerTimestamp,
  formatCountdown,
  formatCountdownHMS,
} from "@/lib/prayerUtils";
import type { PrayerTimes } from "@/lib/usePrayerTimes";

type HomeListHeaderProps = {
  user: { name?: string; avatar?: string } | null;
  gregorian: string;
  hijri: string;
  todayIndex: number;
  prayerLoading: boolean;
  prayerTimes: PrayerTimes | null;
  prayerCity: string | null;
  currentPrayer: { label: string } | null;
  nextPrayer: { label: string; inMinutes: number } | null;
  remainingCount: number;
  qiblaBearing: number | null;
  prayerCoords: { latitude: number; longitude: number } | null;
  showNextPrayerCountdown: boolean;
  nextPrayerCountdownHMS: string | null;
  onTogglePrayerDisplay: () => void;
  nextPrayerTimeStr: string | null;
  isPrayerChecked: (key: PrayerKey) => boolean;
  togglePrayerChecked: (key: PrayerKey) => void;
  latestProperties: unknown[] | undefined;
  latestPropertiesLoading: boolean;
  onCardPress: (id: string) => void;
};

function HomeListHeader({
  user,
  gregorian,
  hijri,
  todayIndex,
  prayerLoading,
  prayerTimes,
  prayerCity,
  currentPrayer,
  nextPrayer,
  remainingCount,
  qiblaBearing,
  prayerCoords,
  showNextPrayerCountdown,
  nextPrayerCountdownHMS,
  onTogglePrayerDisplay,
  nextPrayerTimeStr,
  isPrayerChecked,
  togglePrayerChecked,
  latestProperties,
  latestPropertiesLoading,
  onCardPress,
}: HomeListHeaderProps) {
  return (
    <View className="px-5">
      <View className="flex flex-row items-center justify-between mt-5">
        <View className="flex flex-col items-start flex-1">
          <Text className="text-2xl font-rubik-bold text-black-300">
            Bienvenue{user?.name ? ` ${user.name}` : " Utilisateur"}
          </Text>
          <Text className="text-xl font-rubik-medium text-black-300 mt-1.5">
            {gregorian}
          </Text>
          {hijri ? (
            <Text className="text-lg font-rubik text-black-200 mt-1">
              {hijri}
            </Text>
          ) : null}
        </View>
        <View className="flex flex-col items-end">
          {!prayerLoading && (currentPrayer || nextPrayer) && (
            <TouchableOpacity
              onPress={onTogglePrayerDisplay}
              activeOpacity={0.7}
              hitSlop={{ top: 16, bottom: 16, left: 24, right: 24 }}
              style={styles.prayerToggleTouchable}
              className="items-end"
            >
              {showNextPrayerCountdown && nextPrayer ? (
                <>
                  <Text className="text-xl font-rubik-bold text-black-300">
                    {nextPrayer.label}
                  </Text>
                  <Text className="text-xs font-rubik text-black-200 mt-0.5">
                    {nextPrayerCountdownHMS ?? "—"}
                  </Text>
                </>
              ) : (
                <>
                  {currentPrayer && (
                    <Text className="text-xl font-rubik-bold text-black-300">
                      {currentPrayer.label}
                    </Text>
                  )}
                  <Text className="text-xs font-rubik text-black-200 mt-0.5">
                    Prière actuelle
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
          <View className="flex flex-row items-center gap-4 mt-2">
            <Image
              source={{ uri: user?.avatar }}
              className="size-14 rounded-full"
            />
            <Image source={icons.bell} className="size-8" />
          </View>
        </View>
      </View>

      <View className="flex flex-row justify-between mt-6 mb-2">
        {WEEK_DAYS.map((day, index) => {
          const isToday = index === todayIndex;
          const isPassed = index <= todayIndex;
          return (
            <View key={day} className="flex-1 items-center">
              <Text
                className={
                  isToday
                    ? "text-xs font-rubik-bold text-black-300"
                    : "text-xs font-rubik text-black-200"
                }
              >
                {day}
              </Text>
              <View
                style={[
                  styles.dayPill,
                  isPassed
                    ? { backgroundColor: DAY_PILL_ACTIVE }
                    : {
                        backgroundColor: "transparent",
                        borderWidth: 2,
                        borderColor: DAY_PILL_EMPTY_BORDER,
                      },
                ]}
              />
            </View>
          );
        })}
      </View>

      <View className="mt-5 mb-1">
        <Text className="text-2xl font-rubik-bold text-black-300 mb-3">
          Prières{prayerCity ? ` — ${prayerCity}` : ""}
        </Text>
        <View style={styles.prayerCard}>
          {prayerLoading ? (
            <ActivityIndicator
              size="small"
              color="#3d6b47"
              style={{ paddingVertical: 24 }}
            />
          ) : prayerTimes ? (
            <>
              <View style={styles.prayerCardHeader}>
                <Text style={styles.prayerCardMethod}>Aladhan (MWL)</Text>
                {hijri ? (
                  <Text style={styles.prayerCardHijri}>{hijri}</Text>
                ) : null}
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
              </View>

              {PRAYER_ORDER.map((key, index) => {
                const prayerKey = key as PrayerKey;
                const checked = isPrayerChecked(prayerKey);
                const isCurrent = currentPrayer?.label === getPrayerLabel(prayerKey);
                return (
                  <Pressable
                    key={key}
                    style={({ pressed }) => [
                      styles.prayerRow,
                      isCurrent && styles.prayerRowCurrent,
                      index === PRAYER_ORDER.length - 1 && styles.prayerRowLast,
                      pressed && styles.prayerRowPressed,
                    ]}
                    onPress={() => togglePrayerChecked(prayerKey)}
                  >
                    <View style={styles.prayerRowLeft}>
                      <Text
                        className={`text-base font-rubik-medium ${
                          checked ? "text-black-200" : "text-black-300"
                        }`}
                        style={checked ? styles.prayerLabelDone : undefined}
                        numberOfLines={1}
                      >
                        {getPrayerLabel(prayerKey)}
                      </Text>
                      <View style={styles.prayerRowTimeRow}>
                        {isCurrent && (
                          <View style={styles.prayerRowCurrentDot} />
                        )}
                        <Text className="text-sm font-rubik text-black-200">
                          {prayerTimes[prayerKey]}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.prayerRowCheckboxWrap}>
                      <View
                        style={[
                          styles.prayerCheckbox,
                          checked && styles.prayerCheckboxChecked,
                        ]}
                      >
                        {checked ? (
                          <Feather name="check" size={14} color="#fff" />
                        ) : null}
                      </View>
                    </View>
                  </Pressable>
                );
              })}

              {nextPrayer && (
                <View style={styles.prayerNextWidget}>
                  <View style={styles.prayerNextWidgetLeft}>
                    <Text style={styles.prayerNextLabel}>PROCHAINE PRIÈRE</Text>
                    <View style={styles.prayerNextWidgetRow}>
                      <Feather name="sunset" size={14} color="rgba(61, 107, 71, 0.9)" />
                      <Text className="text-sm font-rubik-bold text-black-300 ml-1.5">
                        {nextPrayer.label}{nextPrayerTimeStr ? ` à ${nextPrayerTimeStr}` : ""}
                      </Text>
                    </View>
                  </View>
                  {nextPrayerCountdownHMS != null && (
                    <Text style={styles.prayerNextCountdown}>
                      {nextPrayerCountdownHMS}
                    </Text>
                  )}
                </View>
              )}

              <Text style={styles.prayerCardFooter}>
                {currentPrayer ? `${currentPrayer.label} : Standard` : "Calcul : MWL"}
              </Text>
            </>
          ) : (
            <Text className="text-sm font-rubik text-black-200 py-3">
              Horaires non disponibles
            </Text>
          )}
        </View>

        <View style={styles.prayerFooter}>
          {qiblaBearing !== null && (
            <View style={styles.prayerFooterItem}>
              <QiblaCompass bearing={qiblaBearing} size={56} />
            </View>
          )}
          <View style={styles.prayerFooterItem}>
            <Text className="text-sm font-rubik text-black-200">
              {remainingCount} prière{remainingCount !== 1 ? "s" : ""} restante{remainingCount !== 1 ? "s" : ""} à faire
            </Text>
          </View>
        </View>
      </View>

      <View className="my-5">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-xl font-rubik-bold text-black-300">
            Featured
          </Text>
          <TouchableOpacity>
            <Text className="text-base font-rubik-bold text-primary-300">
              See all
            </Text>
          </TouchableOpacity>
        </View>

        {latestPropertiesLoading ? (
          <ActivityIndicator size="large" className="text-primary-300" />
        ) : (
          <FlatList
            data={
              latestProperties && latestProperties.length > 0
                ? latestProperties
                : [{ $id: "_placeholder", name: "Exemple de bien", price: "250 000 €", image: null }]
            }
            renderItem={({ item }) => (
              <FeaturedCard
                item={item}
                onPress={() => (item as { $id: string }).$id !== "_placeholder" && onCardPress((item as { $id: string }).$id)}
              />
            )}
            keyExtractor={(item: { $id: string }) => item.$id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.featuredList}
            contentContainerStyle={styles.featuredListContent}
          />
        )}
      </View>

      <View className="mt-5">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-xl font-rubik-bold text-black-300">
            Our Recommendation
          </Text>
          <TouchableOpacity>
            <Text className="text-base font-rubik-bold text-primary-300">
              See all
            </Text>
          </TouchableOpacity>
        </View>

        <Filters />
      </View>
    </View>
  );
}

const Home = () => {
  const { user } = useGlobalContext();
  const { gregorian, hijri } = useTodayDates();
  const todayIndex = useMemo(() => (new Date().getDay() + 6) % 7, []);
  const { timings: prayerTimes, loading: prayerLoading, cityName: prayerCity, coords: prayerCoords } = usePrayerTimes();
  const { toggle: togglePrayerChecked, isChecked: isPrayerChecked } = usePrayersChecked();

  const [showNextPrayerCountdown, setShowNextPrayerCountdown] = useState(false);
  const [countdownNow, setCountdownNow] = useState(() => Date.now());

  const nextPrayer = prayerTimes ? getNextPrayerInfo(prayerTimes) : null;
  const currentPrayer = prayerTimes ? getCurrentPrayer(prayerTimes) : null;
  const SALAT_KEYS: PrayerKey[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const remainingCount = 5 - SALAT_KEYS.filter((k) => isPrayerChecked(k)).length;
  const qiblaBearing = prayerCoords ? getQiblaBearing(prayerCoords.latitude, prayerCoords.longitude) : null;

  const nextPrayerTimestamp = prayerTimes ? getNextPrayerTimestamp(prayerTimes) : null;
  const nextPrayerCountdownHMS = useMemo(() => {
    if (nextPrayerTimestamp == null) return null;
    const remainingSeconds = Math.max(0, Math.floor((nextPrayerTimestamp - countdownNow) / 1000));
    return formatCountdownHMS(remainingSeconds);
  }, [nextPrayerTimestamp, countdownNow]);

  useEffect(() => {
    if (!prayerTimes || !nextPrayer) return;
    const id = setInterval(() => setCountdownNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [prayerTimes, nextPrayer]);

  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  const { data: latestProperties, loading: latestPropertiesLoading } =
    useAppwrite({
      fn: getLatestProperties,
    });

  const {
    data: properties,
    refetch,
    loading,
  } = useAppwrite({
    fn: getProperties,
    params: {
      filter: params.filter!,
      query: params.query!,
      limit: 6,
    },
    skip: true,
  });

  useEffect(() => {
    refetch({
      filter: params.filter!,
      query: params.query!,
      limit: 6,
    });
  }, [params.filter, params.query]);

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  const header = (
    <HomeListHeader
      user={user}
      gregorian={gregorian}
      hijri={hijri}
      todayIndex={todayIndex}
      prayerLoading={prayerLoading}
      prayerTimes={prayerTimes}
      prayerCity={prayerCity}
      currentPrayer={currentPrayer}
      nextPrayer={nextPrayer}
      remainingCount={remainingCount}
      qiblaBearing={qiblaBearing}
      showNextPrayerCountdown={showNextPrayerCountdown}
      nextPrayerCountdownHMS={nextPrayerCountdownHMS}
      onTogglePrayerDisplay={() => setShowNextPrayerCountdown((v) => !v)}
      nextPrayerTimeStr={nextPrayer && prayerTimes ? prayerTimes[nextPrayer.name as PrayerKey] : null}
      isPrayerChecked={isPrayerChecked}
      togglePrayerChecked={togglePrayerChecked}
      latestProperties={latestProperties}
      latestPropertiesLoading={latestPropertiesLoading}
      onCardPress={handleCardPress}
    />
  );

  return (
    <ImageBackground
      source={homeBackground}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView className="h-full bg-transparent">
        <FlatList
        data={properties ?? []}
        extraData={{ showNextPrayerCountdown, nextPrayerCountdownHMS }}
        numColumns={2}
        renderItem={({ item }) => (
          <Card item={item} onPress={() => handleCardPress(item.$id)} />
        )}
        keyExtractor={(item) => item.$id}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" className="text-primary-300 mt-5" />
          ) : (
            <NoResults />
          )
        }
        ListHeaderComponent={() => header}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  prayerToggleTouchable: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    minHeight: 44,
    justifyContent: "center",
  },
  dayPill: {
    width: 24,
    height: 36,
    borderRadius: 12,
    marginTop: 6,
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
  prayerCardCoords: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  prayerCardCoordsText: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans-Regular",
    color: "rgba(0,0,0,0.5)",
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
  prayerRowLeft: {
    flex: 1,
    marginRight: 44,
  },
  prayerRowTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  prayerRowCheckboxWrap: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  prayerRowCurrentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(61, 107, 71, 0.9)",
  },
  prayerRowLast: {
    borderBottomWidth: 0,
  },
  prayerRowPressed: {
    opacity: 0.7,
  },
  prayerNextWidget: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  prayerNextWidgetLeft: {
    flex: 1,
  },
  prayerNextLabel: {
    fontSize: 9,
    fontFamily: "PlusJakartaSans-Medium",
    color: "rgba(0,0,0,0.55)",
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  prayerNextWidgetRow: {
    flexDirection: "row",
    alignItems: "center",
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
  prayerLabelDone: {
    textDecorationLine: "line-through",
  },
  prayerFooter: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 16,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.06)",
  },
  prayerFooterItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  featuredList: {
    height: 424,
    marginTop: 20,
  },
  featuredListContent: {
    paddingRight: 20,
  },
});

export default Home;
