import { useAppPreferences } from "@/lib/app-preferences";
import { useTranslation } from "@/lib/i18n";
import { AccentColorPicker } from "@/components/AccentColorPicker";
import { PreferenceScreenLayout } from "@/components/PreferenceScreenLayout";

export default function AccentScreen() {
  const { accentColor, setAccentColor } = useAppPreferences();
  const { t } = useTranslation();

  return (
    <PreferenceScreenLayout
      title={t("preferences.accentTitle")}
      subtitle={t("preferences.accentSubtitle")}
    >
      <AccentColorPicker value={accentColor} onChange={setAccentColor} />
    </PreferenceScreenLayout>
  );
}
