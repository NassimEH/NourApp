import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppIcon } from "@/components/AppIcon";
import { HomeSection } from "@/components/home/HomeSection";
import { useAppTheme } from "@/lib/app-theme";
import { useAppTypography } from "@/lib/app-typography";
import { useTranslation } from "@/lib/i18n";
import {
  PRAYER_ORDER,
  type PrayerKey,
  type PrayerTimes,
} from "@/lib/usePrayerTimes";

const mosqueImage = require("@/assets/images/mosquee.png");

const MOSQUE_IMAGE_WIDTH = 168;
const MOSQUE_IMAGE_WIDTH_COMPACT = 96;
const MOSQUE_IMAGE_HEIGHT = Math.round((556 / 440) * MOSQUE_IMAGE_WIDTH);
const MOSQUE_IMAGE_HEIGHT_COMPACT = Math.round(
  (556 / 440) * MOSQUE_IMAGE_WIDTH_COMPACT
);

const PRAYER_KEYS = PRAYER_ORDER.filter((k) => k !== "Sunrise") as PrayerKey[];

export interface HomeMosqueBlockProps {
  prayerLoading: boolean;
  prayerTimes: PrayerTimes | null;
  mosqueDisplayName: string;
  onEditMosque: () => void;
  gregorian: string;
  hijri: string;
  cityName: string | null;
  remainingCount: number;
  currentPrayerName: string | null;
  nextPrayerLabel: string | null;
  nextPrayerCountdown: string | null;
  isPrayerChecked: (key: PrayerKey) => boolean;
  onTogglePrayer: (key: PrayerKey) => void;
  /** Sans titre de section (ex. page d’un carrousel accueil). */
  embedded?: boolean;
  /** Même structure que Mes prières, densifiée pour le carrousel. */
  compact?: boolean;
}

/** Section unique Mes prières : mosquée + horaires cochables. */
export function HomeMosqueBlock({
  prayerLoading,
  prayerTimes,
  mosqueDisplayName,
  onEditMosque,
  gregorian,
  hijri,
  cityName,
  remainingCount,
  currentPrayerName,
  nextPrayerLabel,
  nextPrayerCountdown,
  isPrayerChecked,
  onTogglePrayer,
  embedded = false,
  compact = false,
}: HomeMosqueBlockProps) {
  const colors = useAppTheme();
  const typography = useAppTypography();
  const { t, rtlTextStyle, rtlViewStyle } = useTranslation();

  const imageW = compact ? MOSQUE_IMAGE_WIDTH_COMPACT : MOSQUE_IMAGE_WIDTH;
  const imageH = compact
    ? MOSQUE_IMAGE_HEIGHT_COMPACT
    : MOSQUE_IMAGE_HEIGHT;

  const themed = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.usesBackgroundImage
            ? "transparent"
            : colors.card,
          borderRadius: compact ? 16 : 20,
          paddingVertical: compact ? 8 : 16,
          paddingHorizontal: compact ? 10 : 18,
          borderLeftWidth: 3,
          borderLeftColor: colors.accentBorder,
          alignSelf: "stretch",
        },
        hijri: {
          fontSize: compact ? typography.caption : typography.body,
          lineHeight: (compact ? typography.caption : typography.body) * 1.3,
          fontFamily: "PlusJakartaSans-SemiBold",
          color: colors.text,
          marginBottom: 1,
        },
        gregorian: {
          fontSize: compact ? 11 : typography.caption,
          lineHeight: (compact ? 11 : typography.caption) * 1.3,
          fontFamily: "PlusJakartaSans-Regular",
          color: colors.textMuted,
          marginBottom: compact ? 2 : 4,
        },
        coordsText: {
          fontSize: compact ? 11 : typography.caption,
          lineHeight: (compact ? 11 : typography.caption) * 1.3,
          fontFamily: "PlusJakartaSans-Regular",
          color: colors.textMuted,
        },
        remaining: {
          fontSize: compact ? 11 : typography.caption,
          lineHeight: (compact ? 11 : typography.caption) * 1.3,
          fontFamily: "PlusJakartaSans-Medium",
          color: colors.textMuted,
          marginTop: compact ? 3 : 6,
        },
        mosqueName: {
          fontSize: compact ? 10 : typography.caption,
          lineHeight: (compact ? 10 : typography.caption) * 1.3,
          fontFamily: "PlusJakartaSans-SemiBold",
          color: colors.text,
          textAlign: "center",
          marginTop: compact ? 4 : 8,
        },
        prayerLabel: {
          fontSize: compact ? typography.caption : typography.body,
          lineHeight: (compact ? typography.caption : typography.body) * 1.25,
          fontFamily: "PlusJakartaSans-Medium",
          color: colors.text,
        },
        prayerLabelDone: {
          textDecorationLine: "line-through",
          color: colors.textMuted,
        },
        prayerTime: {
          fontSize: compact ? typography.caption : typography.body,
          lineHeight: (compact ? typography.caption : typography.body) * 1.25,
          fontFamily: "PlusJakartaSans-Regular",
          color: colors.textMuted,
        },
        nextLabel: {
          fontSize: compact ? 10 : typography.caption,
          lineHeight: (compact ? 10 : typography.caption) * 1.3,
          fontFamily: "PlusJakartaSans-Medium",
          color: colors.textMuted,
          letterSpacing: 0.3,
          marginBottom: 1,
        },
        nextText: {
          fontSize: compact ? typography.caption : typography.body,
          lineHeight: (compact ? typography.caption : typography.body) * 1.25,
          fontFamily: "PlusJakartaSans-SemiBold",
          color: colors.text,
          marginLeft: 6,
        },
        countdown: {
          fontSize: compact ? typography.caption : typography.bodyMedium,
          lineHeight:
            (compact ? typography.caption : typography.bodyMedium) * 1.25,
          fontFamily: "PlusJakartaSans-Bold",
          color: colors.text,
          letterSpacing: 0.5,
        },
        unavailable: {
          fontSize: compact ? typography.caption : typography.body,
          lineHeight: (compact ? typography.caption : typography.body) * 1.3,
          fontFamily: "PlusJakartaSans-Regular",
          color: colors.textMuted,
          paddingVertical: compact ? 6 : 12,
        },
        divider: {
          height: StyleSheet.hairlineWidth,
          marginVertical: compact ? 6 : 14,
          backgroundColor: colors.divider,
        },
        prayerRowCurrent: {
          backgroundColor: colors.accentSurface,
          borderRadius: compact ? 8 : 12,
          paddingHorizontal: compact ? 8 : 14,
        },
        prayerRowBorder: {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.divider,
        },
        checkbox: {
          width: compact ? 18 : 24,
          height: compact ? 18 : 24,
          borderRadius: compact ? 9 : 12,
          borderWidth: compact ? 1.5 : 2,
          borderColor: colors.accent,
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          alignSelf: "center",
        },
        checkboxChecked: {
          backgroundColor: colors.accent,
          borderColor: colors.accent,
        },
        currentDot: {
          width: compact ? 5 : 6,
          height: compact ? 5 : 6,
          borderRadius: compact ? 2.5 : 3,
          backgroundColor: colors.accent,
          flexShrink: 0,
        },
      }),
    [colors, typography, compact]
  );

  const body = (
    <View style={themed.card}>
      <View style={[styles.headerRow, rtlViewStyle]}>
        <View style={styles.headerInfo}>
          {hijri ? (
            <Text style={[themed.hijri, rtlTextStyle]}>{hijri}</Text>
          ) : null}
          <Text style={[themed.gregorian, rtlTextStyle]}>{gregorian}</Text>
          {cityName ? (
            <View style={[styles.coordsRow, rtlViewStyle]}>
              <AppIcon
                name="map-pin"
                size={compact ? 11 : 12}
                color={colors.iconMuted}
              />
              <Text style={[themed.coordsText, rtlTextStyle]}>{cityName}</Text>
            </View>
          ) : null}
          <Text style={[themed.remaining, rtlTextStyle]}>
            {t(
              remainingCount === 1
                ? "qibla.remainingPrayer"
                : "qibla.remainingPrayers",
              { count: remainingCount }
            )}
          </Text>
        </View>

        <View style={[styles.mosqueCol, { width: imageW + 6 }]}>
          <Image
            source={mosqueImage}
            style={{ width: imageW, height: imageH, flexShrink: 0 }}
            resizeMode="contain"
            fadeDuration={0}
          />
          <Pressable onPress={onEditMosque} hitSlop={8}>
            <Text
              style={[themed.mosqueName, rtlTextStyle]}
              numberOfLines={2}
            >
              {mosqueDisplayName}
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={themed.divider} />

      {prayerLoading ? (
        <ActivityIndicator
          size="small"
          color={colors.accent}
          style={compact ? styles.loaderCompact : styles.loader}
        />
      ) : prayerTimes ? (
        <View style={styles.prayerList}>
          {PRAYER_KEYS.map((key, index) => {
            const checked = isPrayerChecked(key);
            const isCurrent = currentPrayerName === key;
            const isLast = index === PRAYER_KEYS.length - 1;
            return (
              <Pressable
                key={key}
                style={({ pressed }) => [
                  compact ? styles.prayerRowCompact : styles.prayerRow,
                  isCurrent && themed.prayerRowCurrent,
                  !isLast && themed.prayerRowBorder,
                  pressed && styles.pressed,
                ]}
                onPress={() => onTogglePrayer(key)}
              >
                <View
                  style={
                    compact
                      ? styles.prayerRowLeftCompact
                      : styles.prayerRowLeft
                  }
                >
                  <Text
                    style={[
                      themed.prayerLabel,
                      rtlTextStyle,
                      checked && themed.prayerLabelDone,
                    ]}
                    numberOfLines={1}
                  >
                    {t(`qibla.prayerNames.${key}`)}
                  </Text>
                  <View
                    style={
                      compact
                        ? styles.prayerTimeRowCompact
                        : styles.prayerTimeRow
                    }
                  >
                    {isCurrent ? <View style={themed.currentDot} /> : null}
                    <Text style={[themed.prayerTime, rtlTextStyle]}>
                      {prayerTimes[key]}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    themed.checkbox,
                    checked && themed.checkboxChecked,
                  ]}
                >
                  {checked ? (
                    <AppIcon
                      name="check"
                      size={compact ? 10 : 14}
                      color={colors.onAccent}
                    />
                  ) : null}
                </View>
              </Pressable>
            );
          })}

          {nextPrayerLabel ? (
            <>
              <View style={themed.divider} />
              <View style={[styles.nextRow, rtlViewStyle]}>
                <View style={styles.nextLeft}>
                  <Text style={[themed.nextLabel, rtlTextStyle]}>
                    {t("qibla.nextPrayer")}
                  </Text>
                  <View style={[styles.nextTextRow, rtlViewStyle]}>
                    <AppIcon
                      name="sunset"
                      size={compact ? 12 : 14}
                      color={colors.accent}
                    />
                    <Text style={[themed.nextText, rtlTextStyle]}>
                      {nextPrayerLabel}
                    </Text>
                  </View>
                </View>
                {nextPrayerCountdown ? (
                  <Text style={[themed.countdown, rtlTextStyle]}>
                    {nextPrayerCountdown}
                  </Text>
                ) : null}
              </View>
            </>
          ) : null}
        </View>
      ) : (
        <Text style={[themed.unavailable, rtlTextStyle]}>
          {t("qibla.prayerUnavailable")}
        </Text>
      )}
    </View>
  );

  if (embedded) return body;

  return (
    <HomeSection title={t("home.myMosque")} isFirst>
      {body}
    </HomeSection>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
    paddingTop: 2,
  },
  coordsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  mosqueCol: {
    alignItems: "center",
    flexShrink: 0,
  },
  loader: {
    paddingVertical: 24,
  },
  loaderCompact: {
    paddingVertical: 12,
  },
  prayerList: {
    alignSelf: "stretch",
    flexGrow: 0,
    flexShrink: 0,
  },
  prayerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 4,
    minHeight: 56,
  },
  prayerRowCompact: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 2,
    minHeight: 34,
  },
  prayerRowLeft: {
    flex: 1,
    marginRight: 16,
    minWidth: 0,
    justifyContent: "center",
  },
  prayerRowLeftCompact: {
    flex: 1,
    marginRight: 10,
    minWidth: 0,
    justifyContent: "center",
  },
  prayerTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  prayerTimeRowCompact: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 1,
  },
  nextRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  nextLeft: { flex: 1, minWidth: 0 },
  nextTextRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  pressed: { opacity: 0.7 },
});
