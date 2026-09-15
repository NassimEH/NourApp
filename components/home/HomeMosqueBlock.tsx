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

const MOSQUE_IMAGE_WIDTH = 112;
const MOSQUE_IMAGE_HEIGHT = Math.round((203 / 260) * MOSQUE_IMAGE_WIDTH);

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
}: HomeMosqueBlockProps) {
  const colors = useAppTheme();
  const typography = useAppTypography();
  const { t, rtlTextStyle, rtlViewStyle } = useTranslation();

  const themed = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.usesBackgroundImage
            ? "transparent"
            : colors.card,
          borderRadius: 20,
          paddingVertical: 16,
          paddingHorizontal: 18,
          borderLeftWidth: 3,
          borderLeftColor: colors.accentBorder,
        },
        hijri: {
          fontSize: typography.body,
          fontFamily: "PlusJakartaSans-SemiBold",
          color: colors.text,
          marginBottom: 2,
        },
        gregorian: {
          fontSize: typography.caption,
          fontFamily: "PlusJakartaSans-Regular",
          color: colors.textMuted,
          marginBottom: 4,
        },
        coordsText: {
          fontSize: typography.caption,
          fontFamily: "PlusJakartaSans-Regular",
          color: colors.textMuted,
        },
        remaining: {
          fontSize: typography.caption,
          fontFamily: "PlusJakartaSans-Medium",
          color: colors.textMuted,
          marginTop: 6,
        },
        mosqueName: {
          fontSize: typography.caption,
          fontFamily: "PlusJakartaSans-SemiBold",
          color: colors.text,
          textAlign: "center",
          marginTop: 8,
        },
        prayerLabel: {
          fontSize: typography.body,
          fontFamily: "PlusJakartaSans-Medium",
          color: colors.text,
        },
        prayerLabelDone: {
          textDecorationLine: "line-through",
          color: colors.textMuted,
        },
        prayerTime: {
          fontSize: typography.body,
          fontFamily: "PlusJakartaSans-Regular",
          color: colors.textMuted,
        },
        nextLabel: {
          fontSize: typography.caption,
          fontFamily: "PlusJakartaSans-Medium",
          color: colors.textMuted,
          letterSpacing: 0.3,
          marginBottom: 2,
        },
        nextText: {
          fontSize: typography.body,
          fontFamily: "PlusJakartaSans-SemiBold",
          color: colors.text,
          marginLeft: 6,
        },
        countdown: {
          fontSize: typography.bodyMedium,
          fontFamily: "PlusJakartaSans-Bold",
          color: colors.text,
          letterSpacing: 0.5,
        },
        unavailable: {
          fontSize: typography.body,
          fontFamily: "PlusJakartaSans-Regular",
          color: colors.textMuted,
          paddingVertical: 12,
        },
      }),
    [colors, typography]
  );

  return (
    <HomeSection title={t("home.myMosque")} isFirst>
      <View style={themed.card}>
        <View style={[styles.headerRow, rtlViewStyle]}>
          <View style={styles.headerInfo}>
            {hijri ? (
              <Text style={[themed.hijri, rtlTextStyle]}>{hijri}</Text>
            ) : null}
            <Text style={[themed.gregorian, rtlTextStyle]}>{gregorian}</Text>
            {cityName ? (
              <View style={[styles.coordsRow, rtlViewStyle]}>
                <AppIcon name="map-pin" size={12} color={colors.iconMuted} />
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

          <View style={styles.mosqueCol}>
            <Image
              source={mosqueImage}
              style={styles.mosqueImage}
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

        <View style={[styles.divider, { backgroundColor: colors.divider }]} />

        {prayerLoading ? (
          <ActivityIndicator
            size="small"
            color={colors.accent}
            style={styles.loader}
          />
        ) : prayerTimes ? (
          <>
            {PRAYER_KEYS.map((key, index) => {
              const checked = isPrayerChecked(key);
              const isCurrent = currentPrayerName === key;
              const isLast = index === PRAYER_KEYS.length - 1;
              return (
                <Pressable
                  key={key}
                  style={({ pressed }) => [
                    styles.prayerRow,
                    isCurrent && {
                      backgroundColor: colors.accentSurface,
                      borderRadius: 12,
                      paddingHorizontal: 14,
                    },
                    !isLast && {
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: colors.divider,
                    },
                    pressed && styles.pressed,
                  ]}
                  onPress={() => onTogglePrayer(key)}
                >
                  <View style={styles.prayerRowLeft}>
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
                    <View style={styles.prayerTimeRow}>
                      {isCurrent ? (
                        <View
                          style={[
                            styles.currentDot,
                            { backgroundColor: colors.accent },
                          ]}
                        />
                      ) : null}
                      <Text style={[themed.prayerTime, rtlTextStyle]}>
                        {prayerTimes[key]}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.checkbox,
                      { borderColor: colors.accent },
                      checked && {
                        backgroundColor: colors.accent,
                        borderColor: colors.accent,
                      },
                    ]}
                  >
                    {checked ? (
                      <AppIcon name="check" size={14} color={colors.onAccent} />
                    ) : null}
                  </View>
                </Pressable>
              );
            })}

            {nextPrayerLabel ? (
              <>
                <View
                  style={[styles.divider, { backgroundColor: colors.divider }]}
                />
                <View style={[styles.nextRow, rtlViewStyle]}>
                  <View style={styles.nextLeft}>
                    <Text style={[themed.nextLabel, rtlTextStyle]}>
                      {t("qibla.nextPrayer")}
                    </Text>
                    <View style={[styles.nextTextRow, rtlViewStyle]}>
                      <AppIcon name="sunset" size={14} color={colors.accent} />
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
          </>
        ) : (
          <Text style={[themed.unavailable, rtlTextStyle]}>
            {t("qibla.prayerUnavailable")}
          </Text>
        )}
      </View>
    </HomeSection>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
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
    width: MOSQUE_IMAGE_WIDTH + 4,
    alignItems: "center",
    flexShrink: 0,
  },
  mosqueImage: {
    width: MOSQUE_IMAGE_WIDTH,
    height: MOSQUE_IMAGE_HEIGHT,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 14,
  },
  loader: {
    paddingVertical: 24,
  },
  prayerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  prayerRowLeft: {
    flex: 1,
    marginRight: 12,
    minWidth: 0,
  },
  prayerTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  currentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  nextRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  nextLeft: { flex: 1, minWidth: 0 },
  nextTextRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  pressed: { opacity: 0.7 },
});
