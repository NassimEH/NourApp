import { StyleSheet, View } from "react-native";
import { router } from "expo-router";

import { ToolMiniCard } from "@/components/tools/ToolMiniCard";
import { ToolScreenLayout } from "@/components/ToolScreenLayout";
import { useTranslation } from "@/lib/i18n";
import { TOOLS_REGISTRY } from "@/lib/tools/tools-registry";
import { LIST_GAP } from "@/lib/ui/spacing";

function chunkPairs<T>(items: T[]): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }
  return rows;
}

/** Page complète des outils — grille 2 colonnes, même ordre que le carrousel. */
export default function ToolsIndexScreen() {
  const { t } = useTranslation();
  const rows = chunkPairs(TOOLS_REGISTRY);

  return (
    <ToolScreenLayout
      title={t("tools.catalogTitle")}
      subtitle={t("tools.catalogSubtitle")}
      contentStyle={styles.content}
    >
      <View style={styles.grid}>
        {rows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((tool) => (
              <ToolMiniCard
                key={tool.id}
                icon={tool.icon}
                title={t(tool.titleKey)}
                accessibilityLabel={`${t(tool.titleKey)}. ${t(tool.subtitleKey)}`}
                onPress={() => router.push(tool.route as never)}
              />
            ))}
            {row.length === 1 ? <View style={styles.spacer} /> : null}
          </View>
        ))}
      </View>
    </ToolScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 8,
  },
  grid: {
    gap: LIST_GAP,
  },
  row: {
    flexDirection: "row",
    gap: LIST_GAP,
  },
  spacer: {
    flex: 1,
  },
});
