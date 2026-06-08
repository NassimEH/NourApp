import { useMemo } from "react";
import { Text, View } from "react-native";

import { ToolScreenLayout } from "@/components/ToolScreenLayout";
import { ASMA_UL_HUSNA } from "@/lib/data/asma-ul-husna";
import { useAppTheme } from "@/lib/app-theme";
import { useAppTypography } from "@/lib/app-typography";
import { useTranslation } from "@/lib/i18n";
import { bodyLineHeight } from "@/lib/ui/typography";
import { createToolScreenStyles } from "@/lib/tool-screen-styles";

export default function AsmaNamesScreen() {
  const colors = useAppTheme();
  const styles = useMemo(() => createToolScreenStyles(colors), [colors]);
  const typography = useAppTypography();
  const { t, rtlTextStyle, rtlViewStyle } = useTranslation();
  const bodyLh = bodyLineHeight(typography.body);

  return (
    <ToolScreenLayout
      title={t("tools.asmaNames.title")}
      subtitle={t("tools.asmaNames.subtitle")}
      contentStyle={{ paddingBottom: 40 }}
    >
      {ASMA_UL_HUSNA.map((item) => (
        <View key={item.id} style={[styles.asmaRow, rtlViewStyle]}>
          <Text style={styles.asmaIndex}>{item.id}</Text>
          <View style={{ flex: 1, gap: 4 }}>
            <Text
              style={[
                {
                  color: colors.text,
                  fontSize: typography.title,
                  fontFamily: "PlusJakartaSans-Bold",
                  textAlign: "right",
                },
              ]}
            >
              {item.arabic}
            </Text>
            <Text
              style={[
                {
                  color: colors.textMuted,
                  fontSize: typography.body,
                  lineHeight: bodyLh,
                  fontFamily: "PlusJakartaSans-Medium",
                },
                rtlTextStyle,
              ]}
            >
              {item.transliteration}
            </Text>
          </View>
        </View>
      ))}
    </ToolScreenLayout>
  );
}
