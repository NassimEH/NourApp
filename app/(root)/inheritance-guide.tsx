import { useMemo } from "react";
import { Text } from "react-native";

import { ToolScreenLayout } from "@/components/ToolScreenLayout";
import { useAppTheme } from "@/lib/app-theme";
import { useAppTypography } from "@/lib/app-typography";
import { bodyLineHeight } from "@/lib/ui/typography";
import { useTranslation } from "@/lib/i18n";
import { createToolScreenStyles } from "@/lib/tool-screen-styles";

const SECTION_KEYS = [
  "inheritance.intro",
  "inheritance.disclaimer",
  "inheritance.heirs",
  "inheritance.will",
  "inheritance.seekScholar",
] as const;

export default function InheritanceGuideScreen() {
  const colors = useAppTheme();
  const styles = useMemo(() => createToolScreenStyles(colors), [colors]);
  const typography = useAppTypography();
  const { t } = useTranslation();
  const lh = bodyLineHeight(typography.body);

  return (
    <ToolScreenLayout
      title={t("inheritance.title")}
      subtitle={t("inheritance.subtitle")}
    >
      {SECTION_KEYS.map((key) => (
        <Text
          key={key}
          style={[styles.body, { fontSize: typography.body, lineHeight: lh }]}
        >
          {t(key)}
        </Text>
      ))}
    </ToolScreenLayout>
  );
}
