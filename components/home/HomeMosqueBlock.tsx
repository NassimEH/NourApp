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

const MOSQUE_IMAGE_WIDTH = 92;
const MOSQUE_IMAGE_WIDTH_COMPACT = 64;
const MOSQUE_IMAGE_HEIGHT = Math.round((556 / 440) * MOSQUE_IMAGE_WIDTH);
const MOSQUE_IMAGE_HEIGHT_COMPACT = Math.round(
  (556 / 440) * MOSQUE_IMAGE_WIDTH_COMPACT
);

const PRAYER_KEYS = PRAYER_ORDER.filter((k) => k !== "Sunrise") as PrayerKey[];
const COMPACT_ROW_H = 34;

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
  /** Remplit la hauteur du carrousel (aligné sur la météo). */
  fillHeight?: boolean;
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
  fillHeight = false,
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
          borderRadius: compact ? 14 : 20,
          paddingVertical: compact ? (fillHeight ? 10 : 6) : 16,
          paddingHorizontal: compact ? 10 : 18,
          borderLeftWidth: 3,
          borderLeftColor: colors.accentBorder,
          alignSelf: "stretch",
          width: "100%",
          ...(compact && fillHeight
            ? { flex: 1, justifyContent: "space-between" as const }
            : {}),
        },
        hijri: {
          fontSize: compact ? 11 : typography.body,
          lineHeight: compact ? 14 : typography.body * 1.35,
          fontFamily: "PlusJakartaSans-SemiBold",
          color: colors.text,
          flexShrink: 1,
        },
        gregorian: {
          fontSize: compact ? 10 : typography.caption,
          lineHeight: compact ? 13 : typography.caption * 1.35,
          fontFamily: "PlusJakartaSans-Regular",
          color: colors.textMuted,
          marginTop: 2,
        },
        coordsText: {
          fontSize: compact ? 10 : typography.caption,
          lineHeight: compact ? 13 : typography.caption * 1.35,
          fontFamily: "PlusJakartaSans-Regular",
          color: colors.textMuted,
        },
        remaining: {
          fontSize: compact ? 10 : typography.caption,
          lineHeight: compact ? 13 : typography.caption * 1.35,
          fontFamily: "PlusJakartaSans-Medium",
          color: colors.textMuted,
          marginTop: compact ? 2 : 8,
        },
        mosqueName: {
          fontSize: compact ? 9 : 11,
          lineHeight: compact ? 12 : 14,
          fontFamily: "PlusJakartaSans-SemiBold",
          color: colors.text,
          textAlign: "center",
          marginTop: compact ? 2 : 4,
        },
        prayerLabel: {
          fontSize: compact ? 13 : typography.body,
          lineHeight: compact ? 16 : typography.body * 1.25,
          fontFamily: "PlusJakartaSans-SemiBold",
          color: colors.text,
        },
        prayerLabelDone: {
          textDecorationLine: "line-through",
          color: colors.textMuted,
        },
        prayerTime: {
          fontSize: compact ? 12 : typography.caption,
          lineHeight: compact ? 15 : typography.caption * 1.25,
          fontFamily: "PlusJakartaSans-Light",
          color: colors.textMuted,
          fontVariant: ["tabular-nums"],
        },
        nextLabel: {
          fontSize: compact ? 9 : typography.caption,
          lineHeight: compact ? 12 : typography.caption * 1.35,
          fontFamily: "PlusJakartaSans-Medium",
          color: colors.textMuted,
          letterSpacing: 0.3,
          marginBottom: 1,
        },
        nextText: {
          fontSize: compact ? 12 : typography.body,
          lineHeight: compact ? 15 : typography.body * 1.35,
          fontFamily: "PlusJakartaSans-SemiBold",
          color: colors.text,
          marginLeft: 5,
        },
        countdown: {
          fontSize: compact ? 12 : typography.bodyMedium,
          lineHeight: compact ? 15 : typography.bodyMedium * 1.3,
          fontFamily: "PlusJakartaSans-Bold",
          color: colors.text,
          letterSpacing: 0.5,
        },
        unavailable: {
          fontSize: compact ? typography.caption : typography.body,
          fontFamily: "PlusJakartaSans-Regular",
          color: colors.textMuted,
          paddingVertical: compact ? 6 : 12,
        },
        divider: {
          height: StyleSheet.hairlineWidth,
          marginVertical: compact ? (fillHeight ? 8 : 3) : 10,
          backgroundColor: colors.divider,
        },
        prayerRowCurrent: {
          backgroundColor: colors.accentSurface,
          borderRadius: compact ? 6 : 10,
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
        },
        checkboxChecked: {
          backgroundColor: colors.accent,
          borderColor: colors.accent,
        },
        currentDot: {
          backgroundColor: colors.accent,
        },
      }),
    [colors, typography, compact, fillHeight]
  );

  const nextBlock = nextPrayerLabel ? (
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
              size={compact ? 11 : 14}
              color={colors.accent}
            />
            <Text style={[themed.nextText, rtlTextStyle]} numberOfLines={1}>
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
  ) : null;

  /** Carrousel accueil : noms à gauche, mosquée en haut à droite, coches dessous. */
  if (compact) {
    const compactBody = (
      <View style={themed.card}>
        <View style={[styles.compactTop, rtlViewStyle]}>
          <View style={styles.compactHeaderInfo}>
            {hijri ? (
              <Text style={[themed.hijri, rtlTextStyle]} numberOfLines={2}>
                {hijri}
              </Text>
            ) : null}
            <Text style={[themed.gregorian, rtlTextStyle]} numberOfLines={1}>
              {gregorian}
            </Text>
            {cityName ? (
              <View style={[styles.coordsRow, rtlViewStyle]}>
                <AppIcon name="map-pin" size={10} color={colors.iconMuted} />
                <Text
                  style={[themed.coordsText, rtlTextStyle]}
                  numberOfLines={1}
                >
                  {cityName}
                </Text>
              </View>
            ) : null}
            <Text style={[themed.remaining, rtlTextStyle]} numberOfLines={2}>
              {t(
                remainingCount === 1
                  ? "qibla.remainingPrayer"
                  : "qibla.remainingPrayers",
                { count: remainingCount }
              )}
            </Text>
          </View>

          <View style={[styles.compactMosqueCol, { width: imageW + 8 }]}>
            <Image
              source={mosqueImage}
              style={{ width: imageW, height: imageH }}
              resizeMode="contain"
              fadeDuration={0}
            />
            <Pressable onPress={onEditMosque} hitSlop={8}>
              <Text style={[themed.mosqueName, rtlTextStyle]} numberOfLines={2}>
                {mosqueDisplayName}
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={themed.divider} />

        {prayerLoading && !prayerTimes ? (
          <ActivityIndicator
            size="small"
            color={colors.accent}
            style={styles.loaderCompact}
          />
        ) : prayerTimes ? (
          <View
            style={[
              styles.compactPrayerBlock,
              fillHeight && styles.compactPrayerBlockFill,
            ]}
          >
            {PRAYER_KEYS.map((key) => {
              const checked = isPrayerChecked(key);
              const isCurrent = currentPrayerName === key;
              return (
                <View
                  key={key}
                  style={[
                    styles.compactPrayerRow,
                    fillHeight && styles.compactPrayerRowFill,
                    isCurrent && themed.prayerRowCurrent,
                  ]}
                >
                  <Pressable
                    onPress={() => onTogglePrayer(key)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked }}
                    style={({ pressed }) => [
                      StyleSheet.absoluteFill,
                      pressed && styles.pressed,
                    ]}
                  />
                  <View style={[styles.compactNameSide, styles.noPointer]}>
                    <View
                      style={[
                        styles.compactDotSlot,
                        isCurrent && themed.currentDot,
                      ]}
                    />
                    <Text
                      style={[
                        themed.prayerLabel,
                        styles.compactPrayerName,
                        rtlTextStyle,
                        checked && themed.prayerLabelDone,
                      ]}
                      numberOfLines={1}
                    >
                      {t(`qibla.prayerNames.${key}`)}
                    </Text>
                    <Text
                      style={[themed.prayerTime, rtlTextStyle]}
                      numberOfLines={1}
                    >
                      {prayerTimes[key]}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.compactCheckSide,
                      styles.noPointer,
                      { width: imageW + 8 },
                    ]}
                  >
                    <View
                      style={[
                        themed.checkbox,
                        checked && themed.checkboxChecked,
                      ]}
                    >
                      {checked ? (
                        <AppIcon
                          name="check"
                          size={10}
                          color={colors.onAccent}
                        />
                      ) : null}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <Text style={[themed.unavailable, rtlTextStyle]}>
            {t("qibla.prayerUnavailable")}
          </Text>
        )}

        {prayerTimes ? nextBlock : null}
      </View>
    );

    if (embedded) return compactBody;
    return (
      <HomeSection title={t("home.myMosque")} isFirst>
        {compactBody}
      </HomeSection>
    );
  }

  const body = (
    <View style={themed.card}>
      <View style={[styles.headerRow, rtlViewStyle]}>
        <View style={styles.headerInfo}>
          {hijri ? (
            <Text style={[themed.hijri, rtlTextStyle]}>
              {hijri}
            </Text>
          ) : null}
          <Text style={[themed.gregorian, rtlTextStyle]} numberOfLines={1}>
            {gregorian}
          </Text>
          {cityName ? (
            <View style={[styles.coordsRow, rtlViewStyle]}>
              <AppIcon name="map-pin" size={12} color={colors.iconMuted} />
              <Text style={[themed.coordsText, rtlTextStyle]} numberOfLines={1}>
                {cityName}
              </Text>
            </View>
          ) : null}
          <Text style={[themed.remaining, rtlTextStyle]} numberOfLines={1}>
            {t(
              remainingCount === 1
                ? "qibla.remainingPrayer"
                : "qibla.remainingPrayers",
              { count: remainingCount }
            )}
          </Text>
        </View>

        <View style={[styles.mosqueCol, { width: imageW + 4 }]}>
          <Image
            source={mosqueImage}
            style={{ width: imageW, height: imageH }}
            resizeMode="contain"
            fadeDuration={0}
          />
          <Pressable onPress={onEditMosque} hitSlop={8}>
            <Text style={[themed.mosqueName, rtlTextStyle]} numberOfLines={2}>
              {mosqueDisplayName}
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={themed.divider} />

      {prayerLoading && !prayerTimes ? (
        <ActivityIndicator
          size="small"
          color={colors.accent}
          style={styles.loader}
        />
      ) : prayerTimes ? (
        <>
          <View style={styles.prayerList}>
            {PRAYER_KEYS.map((key, index) => {
              const checked = isPrayerChecked(key);
              const isCurrent = currentPrayerName === key;
              const isLast = index === PRAYER_KEYS.length - 1;
              return (
                <View
                  key={key}
                  style={[
                    styles.prayerRow,
                    isCurrent && themed.prayerRowCurrent,
                    !isLast && themed.prayerRowBorder,
                  ]}
                >
                  <Pressable
                    onPress={() => onTogglePrayer(key)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked }}
                    style={({ pressed }) => [
                      StyleSheet.absoluteFill,
                      pressed && styles.pressed,
                    ]}
                  />
                  <View
                    style={[styles.prayerRowLeft, styles.noPointer, rtlViewStyle]}
                  >
                    <View
                      style={[
                        styles.currentDotSlot,
                        isCurrent && themed.currentDot,
                      ]}
                    />
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
                    <Text
                      style={[
                        themed.prayerTime,
                        styles.prayerTimeInline,
                        rtlTextStyle,
                      ]}
                      numberOfLines={1}
                    >
                      {prayerTimes[key]}
                    </Text>
                  </View>
                  <View style={[styles.prayerRowCheckbox, styles.noPointer]}>
                    <View
                      style={[
                        themed.checkbox,
                        checked && themed.checkboxChecked,
                      ]}
                    >
                      {checked ? (
                        <AppIcon
                          name="check"
                          size={14}
                          color={colors.onAccent}
                        />
                      ) : null}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
          {nextBlock}
        </>
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
    gap: 12,
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
    paddingTop: 0,
    paddingRight: 8,
  },
  coordsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  mosqueCol: {
    alignItems: "center",
    flexShrink: 0,
    marginTop: 0,
  },
  loader: { paddingVertical: 24 },
  loaderCompact: { paddingVertical: 10 },
  prayerList: {
    width: "100%",
    alignSelf: "stretch",
  },
  prayerRow: {
    position: "relative",
    width: "100%",
    alignSelf: "stretch",
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 4,
    paddingRight: 40,
    justifyContent: "center",
  },
  prayerRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minWidth: 0,
    maxWidth: "100%",
  },
  currentDotSlot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    flexShrink: 0,
  },
  prayerTimeInline: {
    flexShrink: 0,
  },
  prayerRowCheckbox: {
    position: "absolute",
    right: 4,
    top: 0,
    bottom: 0,
    width: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  /** Compact carrousel : noms à gauche, coches sous la mosquée à droite. */
  compactTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  compactHeaderInfo: {
    flex: 1,
    minWidth: 0,
    justifyContent: "flex-start",
    paddingTop: 0,
    paddingRight: 4,
  },
  compactMosqueCol: {
    alignItems: "center",
    flexShrink: 0,
  },
  compactPrayerBlock: {
    alignSelf: "stretch",
  },
  compactPrayerBlockFill: {
    flex: 1,
    justifyContent: "space-evenly",
    paddingVertical: 4,
  },
  compactPrayerRow: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    height: COMPACT_ROW_H,
  },
  compactPrayerRowFill: {
    height: undefined,
    minHeight: COMPACT_ROW_H,
    flexGrow: 1,
  },
  compactNameSide: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minWidth: 0,
    paddingHorizontal: 2,
  },
  compactPrayerName: {
    flex: 1,
    minWidth: 0,
  },
  compactCheckSide: {
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  compactDotSlot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    flexShrink: 0,
  },
  nextRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    paddingTop: 1,
  },
  nextLeft: { flex: 1, minWidth: 0 },
  nextTextRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  noPointer: {
    pointerEvents: "none",
  },
  pressed: { opacity: 0.7 },
});
