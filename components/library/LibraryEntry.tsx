import { useCallback, useMemo, useRef, useState } from "react";
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { AppIcon } from "@/components/AppIcon";
import { HomeSectionRule } from "@/components/home/HomeSectionRule";
import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";
import { useAppTheme } from "@/lib/app-theme";
import { useAppTypography } from "@/lib/app-typography";
import { useTranslation } from "@/lib/i18n";
import { createLibraryScreenStyles } from "@/lib/library-screen-styles";
import {
  getLibraryCardWidth,
  LIBRARY_CARD_GAP,
  type LibraryCatalogItem,
} from "@/lib/library/catalog";
import { SPACE } from "@/lib/ui/spacing";

export type LibraryNavHandlers = {
  onPressItem: (
    id: string,
    invocationSlug?: string,
    hadithCollectionName?: string
  ) => void;
};

function pressItem(
  item: LibraryCatalogItem,
  onPressItem: LibraryNavHandlers["onPressItem"]
) {
  onPressItem(item.id, item.invocationSlug, item.hadithCollectionName);
}

/** Separateur leger (ex. ecran Apprendre). */
export function LibrarySectionDivider({
  variant = "section",
}: {
  variant?: "header" | "section";
}) {
  return (
    <HomeSectionRule
      style={{
        marginTop: variant === "header" ? SPACE.sm : SPACE.md,
        marginBottom: SPACE.md,
      }}
    />
  );
}

/** Carte média : cadre carré + titre / sous-titre (sans icône sur le cadre). */
export function LibraryMediaCard({
  item,
  width,
  onPressItem,
}: {
  item: LibraryCatalogItem;
  width: number;
  onPressItem: LibraryNavHandlers["onPressItem"];
}) {
  const colors = useAppTheme();
  const typography = useAppTypography();
  const styles = useMemo(
    () => createLibraryScreenStyles(colors, typography),
    [colors, typography]
  );
  const { t, rtlTextStyle } = useTranslation();
  const hasImage = Boolean(item.image);

  return (
    <Pressable
      onPress={() => pressItem(item, onPressItem)}
      accessibilityRole="button"
      accessibilityLabel={`${t(item.titleKey)}. ${t(item.shortKey)}`}
      style={({ pressed }) => [
        styles.mediaCard,
        { width },
        pressed && styles.mediaCardPressed,
      ]}
    >
      <View style={[styles.mediaFrame, { width, height: width }]}>
        {hasImage ? (
          <Image
            source={item.image}
            style={styles.mediaImage}
            resizeMode="cover"
          />
        ) : (
          <LinearGradient
            colors={[colors.accentSurface, colors.cardElevated]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.mediaImage}
          />
        )}
      </View>
      <View style={styles.mediaText}>
        <Text style={[styles.mediaTitle, rtlTextStyle]} numberOfLines={1}>
          {t(item.titleKey)}
        </Text>
        <Text style={[styles.mediaSubtitle, rtlTextStyle]} numberOfLines={2}>
          {t(item.shortKey)}
        </Text>
      </View>
    </Pressable>
  );
}

/** Rangée horizontale avec flèches + dégradés latéraux. */
export function LibraryHorizontalRow({
  items,
  onPressItem,
}: {
  items: LibraryCatalogItem[];
  onPressItem: LibraryNavHandlers["onPressItem"];
}) {
  const colors = useAppTheme();
  const typography = useAppTypography();
  const styles = useMemo(
    () => createLibraryScreenStyles(colors, typography),
    [colors, typography]
  );
  const { isRTL } = useTranslation();
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = getLibraryCardWidth(screenWidth, SCREEN_EDGE_PADDING);
  /** Slot = cadre + écart fixe (identique pour toutes les sections). */
  const slotWidth = cardWidth + LIBRARY_CARD_GAP;
  const scrollRef = useRef<ScrollView>(null);
  const [offsetX, setOffsetX] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);

  const maxOffset = Math.max(0, contentWidth - viewportWidth);
  const canScrollLeft = offsetX > 8;
  const canScrollRight = offsetX < maxOffset - 8;
  const showLeft = isRTL ? canScrollRight : canScrollLeft;
  const showRight = isRTL ? canScrollLeft : canScrollRight;

  const fadeColor = colors.isDark
    ? "rgba(20,20,20,0.85)"
    : colors.usesBackgroundImage
      ? "rgba(255,248,240,0.92)"
      : "rgba(255,255,255,0.92)";
  const fadeClear = colors.isDark
    ? "rgba(20,20,20,0)"
    : colors.usesBackgroundImage
      ? "rgba(255,248,240,0)"
      : "rgba(255,255,255,0)";

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      setOffsetX(e.nativeEvent.contentOffset.x);
    },
    []
  );

  const scrollBy = useCallback(
    (direction: 1 | -1) => {
      const next = Math.max(
        0,
        Math.min(maxOffset, offsetX + direction * slotWidth)
      );
      scrollRef.current?.scrollTo({ x: next, animated: true });
      setOffsetX(next);
    },
    [maxOffset, offsetX, slotWidth]
  );

  return (
    <View
      style={styles.rowWrap}
      onLayout={(e) => setViewportWidth(e.nativeEvent.layout.width)}
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={slotWidth}
        snapToAlignment="start"
        disableIntervalMomentum
        onScroll={onScroll}
        scrollEventThrottle={16}
        onContentSizeChange={(w) => setContentWidth(w)}
        contentContainerStyle={styles.horizontalRow}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <View
              key={item.id}
              style={{ width: isLast ? cardWidth : slotWidth }}
            >
              <LibraryMediaCard
                item={item}
                width={cardWidth}
                onPressItem={onPressItem}
              />
            </View>
          );
        })}
      </ScrollView>

      {showLeft ? (
        <View style={[StyleSheet.absoluteFill, styles.overlayBoxNone]}>
          <LinearGradient
            colors={[fadeColor, fadeClear]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={[styles.edgeFade, styles.edgeFadeLeft]}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Previous"
            onPress={() => scrollBy(isRTL ? 1 : -1)}
            style={[styles.arrowHit, styles.arrowHitLeft]}
            hitSlop={6}
          >
            <View style={styles.arrowDisc}>
              <AppIcon
                name={isRTL ? "chevron-right" : "chevron-left"}
                size={16}
                color={colors.textMuted}
              />
            </View>
          </Pressable>
        </View>
      ) : null}

      {showRight ? (
        <View style={[StyleSheet.absoluteFill, styles.overlayBoxNone]}>
          <LinearGradient
            colors={[fadeClear, fadeColor]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={[styles.edgeFade, styles.edgeFadeRight]}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Next"
            onPress={() => scrollBy(isRTL ? -1 : 1)}
            style={[styles.arrowHit, styles.arrowHitRight]}
            hitSlop={6}
          >
            <View style={styles.arrowDisc}>
              <AppIcon
                name={isRTL ? "chevron-left" : "chevron-right"}
                size={16}
                color={colors.textMuted}
              />
            </View>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
