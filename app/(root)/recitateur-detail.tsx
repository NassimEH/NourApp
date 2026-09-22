import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { AppIcon } from "@/components/AppIcon";
import { AppImage } from "@/components/AppImage";
import { ScreenStackLayout } from "@/components/ScreenStackLayout";
import { useAppPreferences } from "@/lib/app-preferences";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import { useQuranAudioContext } from "@/lib/quran/QuranAudioContext";
import {
  getReciterImageSource,
  getReciterProfile,
} from "@/lib/quran/reciter-profiles";
import { AVAILABLE_RECITERS } from "@/lib/quran/types";
import {
  CARD_RADIUS,
  MIN_TOUCH_TARGET,
  SECTION_GAP,
  SPACE,
} from "@/lib/ui/spacing";
import { bodyLineHeight } from "@/lib/ui/typography";

const PORTRAIT = 152;

function reciterInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

export default function RecitateurDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { t, rtlTextStyle, rtlViewStyle } = useTranslation();
  const colors = useAppTheme();
  const audio = useQuranAudioContext();
  const { setQuranReciter } = useAppPreferences();
  const [imageFailed, setImageFailed] = useState(false);

  const reciter =
    AVAILABLE_RECITERS.find((r) => r.id === id) ?? AVAILABLE_RECITERS[0];
  const profile = getReciterProfile(reciter.id);
  const imageSource = getReciterImageSource(reciter.id);
  const isCurrent = audio.currentReciter === reciter.id;
  const surface = colors.usesBackgroundImage ? colors.card : colors.cardElevated;

  const onChoose = () => {
    setQuranReciter(reciter.id);
    void audio.setReciter(reciter.id);
  };

  const onPlaySample = () => {
    void audio.setReciter(reciter.id);
    setQuranReciter(reciter.id);
    audio.playSura(1);
    router.replace("/(root)/(tabs)/explore");
  };

  const metaLine = profile
    ? [t(profile.countryKey), profile.yearsLabel].filter(Boolean).join("  ·  ")
    : null;

  return (
    <ScreenStackLayout
      title={t("screens.reciterDetailTitle")}
      subtitle={t("screens.reciterDetailSubtitle")}
    >
      <View style={styles.identity}>
        <View
          style={[
            styles.portraitRing,
            { borderColor: colors.accentBorder, backgroundColor: surface },
          ]}
        >
          {imageSource && !imageFailed ? (
            <AppImage
              source={imageSource}
              style={styles.portrait}
              contentFit="cover"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <View
              style={[
                styles.portrait,
                styles.portraitFallback,
                { backgroundColor: colors.accentSurface },
              ]}
            >
              <Text style={[styles.initials, { color: colors.accent }]}>
                {reciterInitials(reciter.name)}
              </Text>
            </View>
          )}
        </View>

        <Text style={[styles.name, { color: colors.text }, rtlTextStyle]}>
          {reciter.name}
        </Text>
        <Text
          style={[styles.styleLabel, { color: colors.accent }, rtlTextStyle]}
        >
          {t(reciter.styleKey)}
        </Text>
        {metaLine ? (
          <Text
            style={[styles.metaLine, { color: colors.textMuted }, rtlTextStyle]}
          >
            {metaLine}
          </Text>
        ) : null}
      </View>

      {profile ? (
        <View
          style={[
            styles.infoCard,
            { backgroundColor: surface, borderColor: colors.border },
          ]}
        >
          <InfoLine
            label={t("screens.reciterInfoStyle")}
            value={t(reciter.styleKey)}
            muted={colors.textMuted}
            text={colors.text}
            rtl={rtlViewStyle}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <InfoLine
            label={t("screens.reciterInfoCountry")}
            value={t(profile.countryKey)}
            muted={colors.textMuted}
            text={colors.text}
            rtl={rtlViewStyle}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <InfoLine
            label={t("screens.reciterInfoYears")}
            value={profile.yearsLabel}
            muted={colors.textMuted}
            text={colors.text}
            rtl={rtlViewStyle}
          />
        </View>
      ) : null}

      {profile ? (
        <View style={styles.about}>
          <Text
            style={[styles.aboutTitle, { color: colors.text }, rtlTextStyle]}
          >
            {t("screens.reciterAbout")}
          </Text>
          <Text
            style={[
              styles.aboutBody,
              { color: colors.textMuted },
              rtlTextStyle,
            ]}
          >
            {t(profile.bioKey)}
          </Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        <Pressable
          onPress={onChoose}
          disabled={isCurrent}
          accessibilityRole="button"
          accessibilityState={{ selected: isCurrent }}
          style={({ pressed }) => [
            styles.cta,
            {
              backgroundColor: isCurrent ? colors.accentSurface : colors.accent,
              borderColor: isCurrent ? colors.accentBorder : colors.accent,
            },
            pressed && !isCurrent && styles.ctaPressed,
          ]}
        >
          <AppIcon
            name={isCurrent ? "check" : "mic"}
            size={18}
            color={isCurrent ? colors.accent : colors.onAccent}
          />
          <Text
            style={[
              styles.ctaLabel,
              { color: isCurrent ? colors.accent : colors.onAccent },
            ]}
          >
            {isCurrent
              ? t("screens.reciterChosen")
              : t("screens.reciterChoose")}
          </Text>
        </Pressable>

        <Pressable
          onPress={onPlaySample}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.cta,
            {
              backgroundColor: colors.accentSurface,
              borderColor: colors.accentBorder,
            },
            pressed && styles.ctaPressed,
          ]}
        >
          <AppIcon name="play" size={18} color={colors.accent} />
          <Text style={[styles.ctaLabel, { color: colors.text }]}>
            {t("screens.reciterPlaySample")}
          </Text>
        </Pressable>
      </View>
    </ScreenStackLayout>
  );
}

function InfoLine({
  label,
  value,
  muted,
  text,
  rtl,
}: {
  label: string;
  value: string;
  muted: string;
  text: string;
  rtl: object;
}) {
  return (
    <View style={[styles.infoLine, rtl]}>
      <Text style={[styles.infoLabel, { color: muted }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: text }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  identity: {
    alignItems: "center",
    marginBottom: SECTION_GAP,
    gap: 6,
  },
  portraitRing: {
    width: PORTRAIT + 10,
    height: PORTRAIT + 10,
    borderRadius: (PORTRAIT + 10) / 2,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACE.sm,
    overflow: "hidden",
  },
  portrait: {
    width: PORTRAIT,
    height: PORTRAIT,
    borderRadius: PORTRAIT / 2,
  },
  portraitFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 44,
    letterSpacing: 1,
  },
  name: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 24,
    lineHeight: 30,
    textAlign: "center",
    paddingHorizontal: SPACE.md,
  },
  styleLabel: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    textAlign: "center",
  },
  metaLine: {
    fontFamily: "PlusJakartaSans-Medium",
    fontSize: 13,
    textAlign: "center",
    marginTop: 2,
  },

  infoCard: {
    borderRadius: CARD_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: SPACE.md,
    marginBottom: SECTION_GAP,
  },
  infoLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SPACE.md,
    minHeight: MIN_TOUCH_TARGET,
    paddingVertical: 12,
  },
  infoLabel: {
    fontFamily: "PlusJakartaSans-Medium",
    fontSize: 13,
  },
  infoValue: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    flexShrink: 1,
    textAlign: "right",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },

  about: {
    marginBottom: SECTION_GAP,
    gap: SPACE.xs,
  },
  aboutTitle: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 16,
  },
  aboutBody: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 15,
    lineHeight: bodyLineHeight(15),
  },

  actions: {
    gap: 10,
  },
  cta: {
    minHeight: MIN_TOUCH_TARGET + 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
  },
  ctaLabel: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 15,
  },
  ctaPressed: {
    opacity: 0.88,
  },
});
