import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
const mosqueImage = require("../../../mosquée.png");

const weatherImages: Record<WeatherImageKey, number> = {
  orage: require("@/assets/images/villes/orage.png"),
  neige: require("@/assets/images/villes/neige.png"),
  pluie: require("@/assets/images/villes/pluie.png"),
  brouillard: require("@/assets/images/villes/brouillard.png"),
  crépuscule: require("@/assets/images/villes/crépuscule.png"),
  nuageux: require("@/assets/images/villes/nuageux.png"),
};

const WEATHER_DOU3A: Record<
  WeatherImageKey,
  { dou3a: string; reason: string }
> = {
  pluie: {
    dou3a: "اللَّهُمَّ صَيِّباً نَافِعاً — Allâhumma sayyiban nâfi'an. « Ô Allah, (fais qu'il tombe) une pluie bénéfique. »",
    reason: "La pluie est un moment privilégié où les invocations sont exaucées ; le Prophète (ﷺ) nous a enseigné cette invocation lorsqu'il pleut.",
  },
  orage: {
    dou3a: "سُبْحَانَ الَّذِي يُسَبِّحُ الرَّعْدُ بِحَمْدِهِ وَالْمَلَائِكَةُ مِنْ خِيفَتِهِ — Gloire à Celui que le tonnerre glorifie par Sa louange, ainsi que les anges par crainte de Lui.",
    reason: "L'orage rappelle la puissance d'Allah ; il est recommandé de glorifier Allah et de se rappeler de Lui quand on entend le tonnerre.",
  },
  neige: {
    dou3a: "اللَّهُمَّ احْفَظْنَا مِنْ شَرِّ الْبَرْدِ وَالثَلْجِ — Allâhumma hfaznâ min charri al-bardi wa at-thalj. « Ô Allah, préserve-nous du mal du froid et de la neige. »",
    reason: "Le froid et la neige nous invitent à demander la protection d'Allah et à être reconnaissants pour l'abri qu'Il nous accorde.",
  },
  brouillard: {
    dou3a: "بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ — Bismi Llâhi lladhî lâ yadurru ma'a smihi shay'. « Au nom d'Allah, avec le nom de qui rien ne peut nuire. »",
    reason: "Le brouillard réduit la visibilité ; invoquer Allah nous rappelle de nous en remettre à Lui pour la sécurité et la clarté du chemin.",
  },
  crépuscule: {
    dou3a: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ — Amsaynâ wa amsâ al-mulku li Llâh. « Nous avons atteint le soir, et la royauté appartient à Allah. »",
    reason: "Le crépuscule est le moment des adhkâr du soir ; il rappelle que le jour et la nuit appartiennent à Allah.",
  },
  nuageux: {
    dou3a: "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذَا الْيَوْمِ — Allâhumma innî as'aluka khayra hâdhâ al-yawm. « Ô Allah, je Te demande le bien de ce jour. »",
    reason: "Un temps nuageux ou doux nous invite à demander à Allah le bien du jour et à Lui être reconnaissants pour Ses bienfaits.",
  },
};

const MosqueImage = React.memo(function MosqueImage({ compact }: { compact?: boolean }) {
  const sizeStyle = compact ? styles.mosqueImageCompact : styles.mosqueImage;
  return (
    <View style={[styles.mosqueWrap, compact && styles.mosqueWrapCompact]}>
      <Image
        source={mosqueImage}
        style={sizeStyle}
        resizeMode="contain"
      />
    </View>
  );
});

const HeaderAvatarBell = React.memo(function HeaderAvatarBell({
  avatarUri,
}: {
  avatarUri: string | undefined;
}) {
  return (
    <View className="flex flex-row items-center gap-4 mt-2">
      <Image
        source={{ uri: avatarUri }}
        className="size-14 rounded-full"
      />
      <Image source={icons.bell} className="size-8" />
    </View>
  );
});

import Filters from "@/components/Filters";
import NoResults from "@/components/NoResults";
import { Card, FeaturedCard } from "@/components/Cards";
import { useAppwrite } from "@/lib/useAppwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { getLatestProperties, getProperties } from "@/lib/appwrite";
import { ITEM_WIDTH } from "@/constants";
import Spacing from "@/constants/Spacing";
import { usePrayerTimes, type PrayerTimes } from "@/lib/usePrayerTimes";
import { useWeather, type WeatherImageKey } from "@/lib/useWeather";
import { useMawaqitPrayerTimes, MAWAQIT_MOSQUEE_EVRY } from "@/lib/useMawaqit";

type HomeListHeaderProps = {
  user: { name?: string; avatar?: string } | null;
  gregorian: string;
  hijri: string;
  todayIndex: number;
  prayerLoading: boolean;
  prayerTimes: PrayerTimes | null;
  prayerCity: string | null;
  prayerCoords: { latitude: number; longitude: number } | null;
  onRequestLocation: () => void;
  latestProperties?: unknown[];
  latestPropertiesLoading?: boolean;
  onCardPress?: (id: string) => void;
};

const FEATURED_PLACEHOLDERS = [
  { $id: "_p1", name: "Sourate Al-Fatiha", price: "7 versets", image: null },
  { $id: "_p2", name: "Tafsir du jour", price: "~5 min", image: null },
  { $id: "_p3", name: "Invocations du matin", price: "Adhkâr", image: null },
  { $id: "_p4", name: "Vie du Prophète ﷺ", price: "Biographie", image: null },
  { $id: "_p5", name: "Hadith du jour", price: "Paroles du Prophète", image: null },
];

const HomeListHeader = React.memo(function HomeListHeader({
  user,
  gregorian,
  hijri,
  todayIndex,
  prayerLoading,
  prayerTimes,
  prayerCity,
  prayerCoords,
  onRequestLocation,
  latestProperties = [],
  latestPropertiesLoading = false,
  onCardPress,
}: HomeListHeaderProps) {
  const { data: weatherData, loading: weatherLoading, error: weatherError } =
    useWeather(prayerCoords?.latitude, prayerCoords?.longitude);
  const { data: mawaqitTimes, loading: mawaqitLoading } =
    useMawaqitPrayerTimes(MAWAQIT_MOSQUEE_EVRY);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [featuredCarouselIndex, setFeaturedCarouselIndex] = useState(0);
  const screenWidth = Dimensions.get("window").width;
  const slideWidth = screenWidth;

  const featuredData =
    latestProperties && latestProperties.length > 0
      ? latestProperties
      : FEATURED_PLACEHOLDERS;
  const featuredStep = ITEM_WIDTH + Spacing * 2;

  return (
    <View className="px-5">
      <View className="flex flex-row items-center justify-between mt-5">
        <Text style={styles.pageTitle}>Accueil</Text>
        <HeaderAvatarBell avatarUri={user?.avatar} />
      </View>
      <View className="flex flex-col items-start mt-1.5">
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
      <View style={[styles.carouselWrap, { width: screenWidth }]}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const i = Math.round(e.nativeEvent.contentOffset.x / slideWidth);
            setCarouselIndex(i);
          }}
          style={[styles.carouselScroll, { width: screenWidth }]}
          contentContainerStyle={styles.carouselContent}
          decelerationRate="fast"
        >
          <View style={[styles.carouselSlide, { width: slideWidth }]}>
            <View style={styles.carouselSlideInner}>
              <Text style={styles.carouselSlideTitle}>Ma mosquée</Text>
              {prayerLoading ? (
                <ActivityIndicator size="small" color="#3d6b47" style={{ paddingVertical: 20 }} />
              ) : prayerTimes ? (
                <View style={styles.mosqueSlideRow}>
                  <View style={styles.mosquePrayerColumnFull}>
                    {[
                      { key: "Fajr", icon: "sunrise" as const, time: prayerTimes.Fajr },
                      { key: "Dhuhr", icon: "sun" as const, time: prayerTimes.Dhuhr },
                      { key: "Asr", icon: "cloud" as const, time: prayerTimes.Asr },
                      { key: "Maghrib", icon: "sunset" as const, time: prayerTimes.Maghrib },
                      { key: "Isha", icon: "moon" as const, time: prayerTimes.Isha },
                    ].map(({ key, icon, time }) => (
                      <View key={key} style={styles.mosquePrayerRow}>
                        <Feather name={icon} size={14} color="#5b5d5e" />
                        <View style={styles.mosquePrayerCell}>
                          <Text style={styles.mosquePrayerLabel}>{key}</Text>
                          <Text style={styles.mosquePrayerTime}>{time}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                  <View style={styles.mosqueRightBlock}>
                    <MosqueImage />
                    <Text style={[styles.mosqueTitleText, { marginTop: 10 }]}>Mosquée de Crosne</Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.weatherError}>Horaires non disponibles</Text>
              )}
            </View>
          </View>
          <View style={[styles.carouselSlide, { width: slideWidth }]}>
            <View style={styles.carouselSlideInner}>
              <Text style={styles.carouselSlideTitle}>La météo chez moi</Text>
              {!prayerCoords && prayerLoading ? (
                <ActivityIndicator size="small" color="#3d6b47" style={{ paddingVertical: 20 }} />
              ) : weatherLoading ? (
                <ActivityIndicator size="small" color="#3d6b47" style={{ paddingVertical: 20 }} />
              ) : weatherError ? (
                <View style={styles.weatherEmpty}>
                  <Text style={styles.weatherError}>{weatherError}</Text>
                  <TouchableOpacity
                    style={styles.weatherLocationButton}
                    onPress={onRequestLocation}
                    activeOpacity={0.7}
                  >
                    <Feather name="refresh-cw" size={18} color="#fff" />
                    <Text style={styles.weatherLocationButtonText}>Réessayer</Text>
                  </TouchableOpacity>
                </View>
              ) : weatherData ? (
                <>
                  <View style={styles.weatherRow}>
                    <View style={styles.weatherInfoSide}>
                      <Text style={styles.weatherTemp}>{Math.round(weatherData.temperature)}°</Text>
                      <Text style={styles.weatherCondition}>{weatherData.conditionLabel}</Text>
                      <View style={styles.weatherDetailRow}>
                        <Feather name="droplet" size={14} color="#5b5d5e" />
                        <Text style={styles.weatherDetailText}>{weatherData.humidity} % humidité</Text>
                      </View>
                      <View style={styles.weatherDetailRow}>
                        <Feather name="thermometer" size={14} color="#5b5d5e" />
                        <Text style={styles.weatherDetailText}>Ressenti {Math.round(weatherData.apparentTemperature)}°</Text>
                      </View>
                    </View>
                    <View style={styles.weatherImageWrap}>
                      <Image
                        source={weatherImages[weatherData.imageKey]}
                        style={styles.weatherImageStandalone}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={styles.weatherInfoSide}>
                      <View style={styles.weatherDetailRow}>
                        <Feather name="wind" size={14} color="#5b5d5e" />
                        <Text style={styles.weatherDetailText}>{weatherData.windSpeed} km/h</Text>
                      </View>
                      <View style={styles.weatherDetailRow}>
                        <Feather name="activity" size={14} color="#5b5d5e" />
                        <Text style={styles.weatherDetailText}>{Math.round(weatherData.surfacePressure)} hPa</Text>
                      </View>
                      <Text style={styles.weatherDetailText}>
                        {weatherData.isDay === 1 ? "Jour" : "Nuit"}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.weatherDou3a}>
                    <Text style={styles.weatherDou3aLabel}>Invocation</Text>
                    <Text style={styles.weatherDou3aText}>{WEATHER_DOU3A[weatherData.imageKey].dou3a}</Text>
                    <Text style={styles.weatherDou3aReason}>{WEATHER_DOU3A[weatherData.imageKey].reason}</Text>
                  </View>
                </>
              ) : (
                <View style={styles.weatherEmpty}>
                  <Text style={styles.weatherError}>Active la localisation pour afficher la météo</Text>
                  <TouchableOpacity
                    style={styles.weatherLocationButton}
                    onPress={onRequestLocation}
                    activeOpacity={0.7}
                  >
                    <Feather name="map-pin" size={18} color="#fff" />
                    <Text style={styles.weatherLocationButtonText}>Autoriser la localisation</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
        <View style={styles.carouselDots}>
          <View style={[styles.carouselDot, carouselIndex === 0 && styles.carouselDotActive]} />
          <View style={[styles.carouselDot, carouselIndex === 1 && styles.carouselDotActive]} />
        </View>
      </View>

      <View className="my-5">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-xl font-rubik-bold text-black-300">
            Reprendre ma lecture
          </Text>
          <TouchableOpacity>
            <Text style={styles.seeAllLink}>Tout voir</Text>
          </TouchableOpacity>
        </View>

        {latestPropertiesLoading ? (
          <ActivityIndicator size="large" color="#3d6b47" style={{ marginTop: 20 }} />
        ) : (
          <>
            <FlatList
              data={featuredData}
              renderItem={({ item }) => (
                <FeaturedCard
                  item={item as Parameters<typeof FeaturedCard>[0]["item"]}
                  onPress={() =>
                    (item as { $id: string }).$id !== "_placeholder" &&
                    onCardPress?.((item as { $id: string }).$id)
                  }
                  actionLabel="Lire"
                />
              )}
              keyExtractor={(item: { $id: string }) => item.$id}
              horizontal
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(
                  e.nativeEvent.contentOffset.x / featuredStep
                );
                setFeaturedCarouselIndex(Math.min(index, featuredData.length - 1));
              }}
              style={styles.featuredList}
              contentContainerStyle={styles.featuredListContent}
            />
            <View style={styles.carouselDots}>
              {featuredData.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.carouselDot,
                    featuredCarouselIndex === i && styles.carouselDotActive,
                  ]}
                />
              ))}
            </View>
          </>
        )}
      </View>

      <View className="mt-5">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-xl font-rubik-bold text-black-300">
            Recommandations
          </Text>
          <TouchableOpacity>
            <Text style={styles.seeAllLink}>Tout voir</Text>
          </TouchableOpacity>
        </View>

        <Filters />
      </View>
    </View>
  );
});

const Home = () => {
  const { user } = useGlobalContext();
  const { gregorian, hijri } = useTodayDates();
  const todayIndex = useMemo(() => (new Date().getDay() + 6) % 7, []);
  const { timings: prayerTimes, loading: prayerLoading, cityName: prayerCity, coords: prayerCoords, refetch: refetchLocation } = usePrayerTimes();

  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  const { data: latestProperties, loading: latestPropertiesLoading } =
    useAppwrite({ fn: getLatestProperties });

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

  const handleCardPress = useCallback((id: string) => {
    router.push(`/properties/${id}`);
  }, []);

  const header = useMemo(
    () => (
      <HomeListHeader
        user={user}
        gregorian={gregorian}
        hijri={hijri}
        todayIndex={todayIndex}
        prayerLoading={prayerLoading}
        prayerTimes={prayerTimes}
        prayerCity={prayerCity}
        prayerCoords={prayerCoords}
        onRequestLocation={refetchLocation}
        latestProperties={latestProperties}
        latestPropertiesLoading={latestPropertiesLoading}
        onCardPress={handleCardPress}
      />
    ),
    [
      user,
      gregorian,
      hijri,
      todayIndex,
      prayerLoading,
      prayerTimes,
      prayerCity,
      prayerCoords,
      refetchLocation,
      latestProperties,
      latestPropertiesLoading,
      handleCardPress,
    ]
  );

  const listEmptyComponent = useMemo(
    () =>
      loading ? (
        <ActivityIndicator size="large" className="text-primary-300 mt-5" />
      ) : (
        <NoResults />
      ),
    [loading]
  );

  return (
    <ImageBackground
      source={homeBackground}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView className="h-full bg-transparent" edges={["top", "left", "right"]}>
        <FlatList
        data={properties ?? []}
        extraData={properties?.length ?? 0}
        numColumns={2}
        renderItem={({ item }) => (
          <Card item={item} onPress={() => handleCardPress(item.$id)} />
        )}
        keyExtractor={(item) => item.$id}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={listEmptyComponent}
        ListHeaderComponent={header}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 28,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#191D31",
    marginBottom: 0,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.06)",
    marginVertical: 12,
  },
  seeAllLink: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#3d6b47",
  },
  prayerCardRemaining: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Medium",
    color: "rgba(0,0,0,0.6)",
    marginTop: 6,
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
  mosqueWrap: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  mosqueWrapCompact: {
    marginTop: 0,
    marginBottom: 0,
  },
  mosqueImage: {
    width: 260,
    height: 203,
  },
  mosqueImageCompact: {
    width: 140,
    height: 109,
  },
  mosqueSlideRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 20,
  },
  mosquePrayerColumnFull: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  mosqueRightBlock: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  mosquePrayerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
  },
  mosquePrayerCell: {
    flex: 1,
  },
  mosquePrayerLabel: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Medium",
    color: "#5b5d5e",
  },
  mosquePrayerTime: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    color: "#191D31",
    marginTop: 1,
  },
  mosqueImageWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  carouselWrap: {
    marginTop: 28,
    marginBottom: 12,
    marginLeft: -20,
    marginRight: -20,
    overflow: "hidden",
  },
  carouselScroll: {
    flexGrow: 0,
  },
  carouselContent: {
    flexGrow: 1,
  },
  carouselSlide: {
    flex: 1,
  },
  carouselSlideInner: {
    paddingHorizontal: 24,
  },
  carouselSlideTitle: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#191D31",
    marginBottom: 16,
  },
  carouselDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
  },
  carouselDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  carouselDotActive: {
    backgroundColor: "rgba(61, 107, 71, 0.9)",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  mosqueTitleBlock: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
  mosqueTitleText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#191D31",
  },
  mosqueBlock: {
    alignItems: "center",
    marginTop: 4,
  },
  mawaqitCard: {
    marginTop: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: "rgba(61, 107, 71, 0.08)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(61, 107, 71, 0.2)",
    minWidth: 220,
  },
  mawaqitTitle: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#191D31",
    marginBottom: 2,
  },
  mawaqitSubtitle: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans-Regular",
    color: "#5b5d5e",
    marginBottom: 10,
  },
  mawaqitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  mawaqitLabel: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Medium",
    color: "#191D31",
  },
  mawaqitTime: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#3d6b47",
  },
  weatherSection: {
    marginTop: 20,
    marginBottom: 8,
  },
  weatherSectionTitle: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#191D31",
    marginBottom: 12,
  },
  weatherRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  weatherInfoSide: {
    flex: 1,
    justifyContent: "center",
    gap: 8,
    minWidth: 0,
  },
  weatherImageWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  weatherImageStandalone: {
    width: 200,
    height: 156,
  },
  weatherTemp: {
    fontSize: 26,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#191D31",
  },
  weatherCondition: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Medium",
    color: "#5b5d5e",
  },
  weatherDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  weatherDetailText: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Medium",
    color: "#5b5d5e",
  },
  weatherDou3a: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
    gap: 6,
  },
  weatherDou3aLabel: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "rgba(61, 107, 71, 0.9)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  weatherDou3aText: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Medium",
    color: "#191D31",
    lineHeight: 20,
  },
  weatherDou3aReason: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Regular",
    color: "#5b5d5e",
    lineHeight: 18,
    fontStyle: "italic",
  },
  weatherEmpty: {
    paddingVertical: 12,
    gap: 16,
  },
  weatherError: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    color: "#5b5d5e",
  },
  weatherLocationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(61, 107, 71, 0.9)",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  weatherLocationButtonText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#fff",
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
