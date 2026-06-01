import { StyleSheet, Text, View } from "react-native";

import { PreferenceScreenLayout } from "@/components/PreferenceScreenLayout";
import { ASMA_UL_HUSNA } from "@/lib/data/asma-ul-husna";
import { useAppTheme } from "@/lib/app-theme";
import { useAppTypography } from "@/lib/app-typography";
import { useTranslation } from "@/lib/i18n";
import { bodyLineHeight } from "@/lib/ui/typography";
import { CARD_RADIUS, LIST_GAP } from "@/lib/ui/spacing";

export default function AsmaNamesScreen() {
  const colors = useAppTheme();
  const typography = useAppTypography();
  const { t, rtlTextStyle, rtlViewStyle } = useTranslation();
  const bodyLh = bodyLineHeight(typography.body);

  return (
    <PreferenceScreenLayout
      title={t("tools.asmaNames.title")}
      subtitle={t("tools.asmaNames.subtitle")}
      contentStyle={styles.layoutContent}
    >
      <View style={styles.list}>
        {ASMA_UL_HUSNA.map((item) => (
          <View
            key={item.id}
            style={[
              styles.row,
              rtlViewStyle,
              {
                backgroundColor: colors.cardElevated,
                borderColor: colors.border,
                marginBottom: LIST_GAP,
              },
            ]}
          >
            <Text style={[styles.index, { color: colors.accent }]}>{item.id}</Text>
            <View style={styles.body}>
              <Text
                style={[
                  styles.arabic,
                  { color: colors.text, fontSize: typography.title },
                ]}
              >
                {item.arabic}
              </Text>
              <Text
                style={[
                  styles.translit,
                  {
                    color: colors.textMuted,
                    fontSize: typography.body,
                    lineHeight: bodyLh,
                  },
                  rtlTextStyle,
                ]}
              >
                {item.transliteration}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </PreferenceScreenLayout>
  );
}

const styles = StyleSheet.create({
  layoutContent: { paddingBottom: 40 },
  list: { paddingBottom: 24 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: CARD_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
  },
  index: {
    width: 28,
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Bold",
    textAlign: "center",
  },
  body: { flex: 1, gap: 4 },
  arabic: {
    fontFamily: "PlusJakartaSans-Bold",
    textAlign: "right",
  },
  translit: {
    fontFamily: "PlusJakartaSans-Medium",
  },
});
