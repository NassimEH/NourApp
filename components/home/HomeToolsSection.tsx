import { StyleSheet, View } from "react-native";
import { router } from "expo-router";

import { SectionHeader } from "@/components/SectionHeader";
import { ToolCard } from "@/components/ToolCard";
import { useTranslation } from "@/lib/i18n";
import { TOOLS_REGISTRY } from "@/lib/tools/tools-registry";
import { LIST_GAP, SECTION_GAP } from "@/lib/ui/spacing";

export function HomeToolsSection() {
  const { t } = useTranslation();

  return (
    <View style={styles.section}>
      <SectionHeader title={t("home.tools")} />
      <View style={styles.list}>
        {TOOLS_REGISTRY.map((tool) => (
          <ToolCard
            key={tool.id}
            icon={tool.icon}
            title={t(tool.titleKey)}
            subtitle={t(tool.subtitleKey)}
            onPress={() => router.push(tool.route as never)}
            accessibilityLabel={t(tool.titleKey)}
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
  list: {
    gap: LIST_GAP,
  },
});
