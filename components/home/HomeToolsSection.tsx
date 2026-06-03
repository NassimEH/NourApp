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

import { SectionHeader } from "@/components/SectionHeader";
import { ToolCard } from "@/components/ToolCard";
import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";
import { useAppTheme } from "@/lib/app-theme";
import { createHomeStyles } from "@/lib/home-screen-styles";
import { useTranslation } from "@/lib/i18n";
import { TOOLS_REGISTRY, type ToolDefinition } from "@/lib/tools/tools-registry";
import { SECTION_GAP } from "@/lib/ui/spacing";

const TOOLS_PER_PAGE = 3;
const TOOL_GAP = 14;

function chunkTools(items: ToolDefinition[], size: number): ToolDefinition[][] {
  const pages: ToolDefinition[][] = [];
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size));
  }
  return pages;
}

export function HomeToolsSection() {
  const { t, rtlViewStyle } = useTranslation();
  const colors = useAppTheme();
  const themed = useMemo(() => createHomeStyles(colors), [colors]);
  const { width: screenWidth } = useWindowDimensions();
  const [activePage, setActivePage] = useState(0);

  const pageWidth = screenWidth - SCREEN_EDGE_PADDING * 2;
  const cardWidth =
    (pageWidth - TOOL_GAP * (TOOLS_PER_PAGE - 1)) / TOOLS_PER_PAGE;
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
    <View style={styles.section}>
      <SectionHeader title={t("home.tools")} />

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
      >
        {pages.map((pageTools, pageIndex) => (
          <View
            key={`page-${pageIndex}`}
            style={[
              styles.page,
              rtlViewStyle,
              { width: pageWidth, gap: TOOL_GAP },
            ]}
          >
            {pageTools.map((tool) => (
              <View key={tool.id} style={{ width: cardWidth }}>
                <ToolCard
                  variant="compact"
                  icon={tool.icon}
                  title={t(tool.titleKey)}
                  onPress={() => router.push(tool.route as never)}
                  accessibilityLabel={`${t(tool.titleKey)}. ${t(tool.subtitleKey)}`}
                />
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <View style={styles.dots} accessibilityRole="tablist">
        {pages.map((_, i) => (
          <View
            key={`dot-${i}`}
            accessibilityRole="tab"
            accessibilityState={{ selected: i === activePage }}
            style={[
              themed.carouselDot,
              i === activePage && themed.carouselDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: SECTION_GAP,
  },
  page: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
    paddingBottom: 2,
  },
});
