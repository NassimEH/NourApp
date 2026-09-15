import { useCallback, useMemo, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { router } from "expo-router";

import { HomeSection } from "@/components/home/HomeSection";
import { ToolMiniCard } from "@/components/tools/ToolMiniCard";
import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import { TOOLS_REGISTRY } from "@/lib/tools/tools-registry";
import { LIST_GAP } from "@/lib/ui/spacing";

const TOOLS_PER_PAGE = 3;

function chunkTools<T>(items: T[], size: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size));
  }
  return pages;
}

/**
 * Accueil — carrousel outils paginé ; 3 cartes parfaitement égales par page.
 */
export function HomeToolsSection() {
  const { t } = useTranslation();
  const colors = useAppTheme();
  const { width: screenWidth } = useWindowDimensions();
  const [activePage, setActivePage] = useState(0);

  const pageWidth = Math.round(screenWidth - SCREEN_EDGE_PADDING * 2);

  const pages = useMemo(
    () => chunkTools(TOOLS_REGISTRY, TOOLS_PER_PAGE),
    []
  );

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const index = Math.round(x / pageWidth);
      const clamped = Math.max(0, Math.min(index, pages.length - 1));
      setActivePage((prev) => (prev === clamped ? prev : clamped));
    },
    [pageWidth, pages.length]
  );

  return (
    <HomeSection
      title={t("home.tools")}
      seeAllLabel={t("home.seeAll")}
      onSeeAll={() => router.push("/(root)/tools")}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={pageWidth}
        snapToAlignment="start"
        disableIntervalMomentum
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={onScroll}
        accessibilityLabel={t("home.tools")}
        accessibilityHint={`${activePage + 1} / ${pages.length}`}
      >
        {pages.map((pageTools, pageIndex) => (
          <View
            key={`tools-page-${pageIndex}`}
            style={[styles.page, { width: pageWidth }]}
          >
            {Array.from({ length: TOOLS_PER_PAGE }).map((_, slotIndex) => {
              const tool = pageTools[slotIndex];
              if (!tool) {
                return (
                  <View
                    key={`pad-${pageIndex}-${slotIndex}`}
                    style={styles.slot}
                    accessibilityElementsHidden
                    importantForAccessibility="no-hide-descendants"
                  />
                );
              }
              return (
                <View key={tool.id} style={styles.slot}>
                  <ToolMiniCard
                    icon={tool.icon}
                    title={t(tool.titleKey)}
                    fill
                    accessibilityLabel={`${t(tool.titleKey)}. ${t(tool.subtitleKey)}`}
                    onPress={() => router.push(tool.route as never)}
                  />
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>

      {pages.length > 1 ? (
        <View
          style={styles.dots}
          accessibilityRole="adjustable"
          accessibilityLabel={`${t("home.tools")} ${activePage + 1} / ${pages.length}`}
        >
          {pages.map((_, i) => {
            const active = i === activePage;
            return (
              <View
                key={`dot-${i}`}
                style={[
                  styles.dot,
                  {
                    backgroundColor: active
                      ? colors.accent
                      : colors.isDark
                        ? "rgba(255,255,255,0.22)"
                        : "rgba(0,0,0,0.14)",
                  },
                  active && styles.dotActive,
                ]}
              />
            );
          })}
        </View>
      ) : null}
    </HomeSection>
  );
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: LIST_GAP,
  },
  /** Chaque slot = 1/3 exact de la page (hors gaps). */
  slot: {
    flex: 1,
    minWidth: 0,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    minHeight: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 16,
    borderRadius: 3,
  },
});
