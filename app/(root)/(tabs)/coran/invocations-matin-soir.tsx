import { StyleSheet, Text } from "react-native";
import { router } from "expo-router";

import { ListRow } from "@/components/ListRow";
import { ScreenStackLayout } from "@/components/ScreenStackLayout";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";

const MORNING_SLUG = "invocations-du-matin";
const EVENING_SLUG = "invocations-du-soir";

export default function InvocationsMatinSoirScreen() {
  const { t } = useTranslation();
  const colors = useAppTheme();

  return (
    <ScreenStackLayout
      title={t("screens.invocationsMorningEveningTitle")}
      subtitle={t("screens.invocationsMorningEveningSubtitle")}
    >
      <Text style={[styles.intro, { color: colors.textMuted }]}>
        {t("screens.invocationsMorningEveningIntro")}
      </Text>
      <ListRow
        icon="sun"
        title={t("screens.invocationsMorningCategory")}
        onPress={() =>
          router.push({
            pathname: "/(root)/(tabs)/coran/invocations/category/[slug]",
            params: { slug: MORNING_SLUG },
          })
        }
      />
      <ListRow
        icon="moon"
        title={t("screens.invocationsEveningCategory")}
        onPress={() =>
          router.push({
            pathname: "/(root)/(tabs)/coran/invocations/category/[slug]",
            params: { slug: EVENING_SLUG },
          })
        }
      />
    </ScreenStackLayout>
  );
}

const styles = StyleSheet.create({
  intro: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 22,
    marginBottom: 8,
  },
});
