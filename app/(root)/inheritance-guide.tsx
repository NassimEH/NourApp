import { ScrollView, StyleSheet, Text } from "react-native";

import { PreferenceScreenLayout } from "@/components/PreferenceScreenLayout";
import { useAppTheme } from "@/lib/app-theme";
import { useAppTypography } from "@/lib/app-typography";
import { bodyLineHeight } from "@/lib/ui/typography";
import { useTranslation } from "@/lib/i18n";

const SECTION_KEYS = [
  "inheritance.intro",
  "inheritance.disclaimer",
  "inheritance.heirs",
  "inheritance.will",
  "inheritance.seekScholar",
] as const;

export default function InheritanceGuideScreen() {
  const colors = useAppTheme();
  const typography = useAppTypography();
  const { t } = useTranslation();
  const lh = bodyLineHeight(typography.body);

  return (
    <PreferenceScreenLayout
      title={t("inheritance.title")}
      subtitle={t("inheritance.subtitle")}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {SECTION_KEYS.map((key) => (
          <Text
            key={key}
            style={[
              styles.paragraph,
              {
                color: colors.text,
                fontSize: typography.body,
                lineHeight: lh,
              },
            ]}
          >
            {t(key)}
          </Text>
        ))}
      </ScrollView>
    </PreferenceScreenLayout>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    fontFamily: "PlusJakartaSans-Regular",
    marginBottom: 16,
  },
});
