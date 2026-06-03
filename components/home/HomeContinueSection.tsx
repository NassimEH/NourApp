import {

  ActivityIndicator,

  Pressable,

  StyleSheet,

  Text,

  View,

} from "react-native";

import { router } from "expo-router";



import { AppIcon } from "@/components/AppIcon";

import { SectionHeader } from "@/components/SectionHeader";

import { useAppTheme } from "@/lib/app-theme";

import { useTranslation } from "@/lib/i18n";

import {

  useContinueActivities,

  type ContinueActivity,

} from "@/lib/home/useContinueActivities";

import { useQuranAudioContextOptional } from "@/lib/quran/QuranAudioContext";

import { CARD_RADIUS, LIST_GAP, SECTION_GAP } from "@/lib/ui/spacing";



function ContinueRow({

  item,

  onPress,

}: {

  item: ContinueActivity;

  onPress: () => void;

}) {

  const colors = useAppTheme();

  const { rtlTextStyle, rtlViewStyle } = useTranslation();

  const icon = item.kind === "listen" ? "headphones" : "book-open";



  return (

    <Pressable

      onPress={onPress}

      accessibilityRole="button"

      accessibilityLabel={`${item.suraName}, ${item.subtitle}`}

      style={({ pressed }) => [

        styles.row,

        {

          backgroundColor: colors.usesBackgroundImage

            ? colors.card

            : colors.cardElevated,

          borderColor: colors.border,

        },

        pressed && styles.pressed,

        rtlViewStyle,

      ]}

    >

      <View

        style={[styles.rowIcon, { backgroundColor: colors.accentSurface }]}

      >

        <AppIcon name={icon} size={20} color={colors.accent} />

      </View>

      <View style={styles.rowBody}>

        <Text

          style={[styles.rowTitle, { color: colors.text }, rtlTextStyle]}

          numberOfLines={1}

        >

          {item.suraName}

        </Text>

        {item.suraNameAr ? (

          <Text

            style={[styles.rowArabic, { color: colors.textMuted }]}

            numberOfLines={1}

          >

            {item.suraNameAr}

          </Text>

        ) : null}

        <Text style={[styles.rowSubtitle, { color: colors.textMuted }, rtlTextStyle]}>

          {item.subtitle}

        </Text>

        {item.progress != null && item.progress > 0 ? (

          <View

            style={[styles.progressTrack, { backgroundColor: colors.divider }]}

          >

            <View

              style={[

                styles.progressFill,

                {

                  backgroundColor: colors.accent,

                  width: `${Math.round(item.progress * 100)}%`,

                },

              ]}

            />

          </View>

        ) : null}

      </View>

      <AppIcon name="chevron-right" size={20} color={colors.iconMuted} />

    </Pressable>

  );

}



export function HomeContinueSection() {

  const colors = useAppTheme();

  const { t, rtlTextStyle } = useTranslation();

  const { items, loading } = useContinueActivities();

  const audio = useQuranAudioContextOptional();



  const handlePress = (item: ContinueActivity) => {

    if (item.kind === "listen") {

      void audio?.playSura(item.suraNumber);

      router.push("/(root)/(tabs)/explore");

      return;

    }

    router.push(`/(root)/(tabs)/coran/${item.suraNumber}` as const);

  };



  return (

    <View style={styles.section}>

      <SectionHeader title={t("home.continue")} />



      {loading ? (

        <ActivityIndicator color={colors.accent} style={styles.loader} />

      ) : items.length === 0 ? (
        <View style={styles.empty}>
          <AppIcon name="book-open" size={22} color={colors.textMuted} />
          <Text style={[styles.emptyText, { color: colors.textMuted }, rtlTextStyle]}>
            {t("home.continueEmpty")}
          </Text>
        </View>

      ) : (

        <View style={styles.list}>

          {items.map((item) => (

            <ContinueRow

              key={item.id}

              item={item}

              onPress={() => handlePress(item)}

            />

          ))}

        </View>

      )}

    </View>

  );

}



const styles = StyleSheet.create({

  section: {

    marginTop: SECTION_GAP,

    marginBottom: SECTION_GAP,

  },

  loader: {

    marginVertical: 24,

  },

  list: {

    gap: LIST_GAP,

  },

  row: {

    flexDirection: "row",

    alignItems: "center",

    gap: 12,

    padding: 14,

    borderRadius: CARD_RADIUS,

    borderWidth: StyleSheet.hairlineWidth,

  },

  pressed: {

    opacity: 0.88,

  },

  rowIcon: {

    width: 44,

    height: 44,

    borderRadius: 12,

    alignItems: "center",

    justifyContent: "center",

  },

  rowBody: {

    flex: 1,

    gap: 2,

  },

  rowTitle: {

    fontSize: 16,

    fontFamily: "PlusJakartaSans-SemiBold",

  },

  rowArabic: {

    fontSize: 14,

    fontFamily: "PlusJakartaSans-Regular",

    textAlign: "right",

  },

  rowSubtitle: {

    fontSize: 12,

    fontFamily: "PlusJakartaSans-Medium",

    marginTop: 2,

  },

  progressTrack: {

    height: 4,

    borderRadius: 2,

    marginTop: 8,

    overflow: "hidden",

  },

  progressFill: {

    height: "100%",

    borderRadius: 2,

  },

  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 12,
    gap: 10,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    textAlign: "center",
    lineHeight: 21,
    maxWidth: 300,
    opacity: 0.85,
  },

});

