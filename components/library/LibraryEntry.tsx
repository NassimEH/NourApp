import { useMemo } from "react";
import { Text, View, type StyleProp, type ViewStyle } from "react-native";

import { ListRow } from "@/components/ListRow";
import { SectionHeader } from "@/components/SectionHeader";
import { useAppTheme } from "@/lib/app-theme";
import { useAppTypography } from "@/lib/app-typography";
import { useTranslation } from "@/lib/i18n";
import type {
  LibraryCatalogItem,
  LibraryCatalogSection,
} from "@/lib/library/catalog";
import { createLibraryScreenStyles } from "@/lib/library-screen-styles";

export type LibraryEntryItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: LibraryCatalogItem["icon"];
  soon?: boolean;
  disabled?: boolean;
  invocationSlug?: string;
  hadithCollectionName?: string;
};

type RowProps = {
  items: LibraryEntryItem[];
  onPressItem: (id: string, invocationSlug?: string, hadithCollectionName?: string) => void;
  contentStyle?: StyleProp<ViewStyle>;
};

export function LibraryCategoryRow({
  items,
  onPressItem,
  contentStyle,
}: RowProps) {
  const colors = useAppTheme();
  const typography = useAppTypography();
  const styles = useMemo(
    () => createLibraryScreenStyles(colors, typography),
    [colors, typography]
  );
  const { t } = useTranslation();

  return (
    <View style={[styles.rowContent, contentStyle]}>
      {items.map((item) => (
        <ListRow
          key={item.id}
          icon={item.icon}
          title={item.title}
          subtitle={item.subtitle}
          onPress={
            item.disabled || item.soon
              ? undefined
              : () =>
                  onPressItem(
                    item.id,
                    item.invocationSlug,
                    item.hadithCollectionName
                  )
          }
          rightElement={
            item.soon ? (
              <View style={styles.soonPill}>
                <Text style={styles.soonText}>{t("library.soon")}</Text>
              </View>
            ) : undefined
          }
          style={item.disabled ? styles.cardDisabled : undefined}
        />
      ))}
    </View>
  );
}
/** Séparateur horizontal entre blocs de la bibliothèque */
export function LibrarySectionDivider({ variant = "section" }: { variant?: "header" | "section" }) {
  const colors = useAppTheme();
  const typography = useAppTypography();
  const styles = useMemo(
    () => createLibraryScreenStyles(colors, typography),
    [colors, typography]
  );
  return (
    <View
      style={variant === "header" ? styles.headerDivider : styles.sectionDivider}
      accessibilityElementsHidden
    />
  );
}

type SectionProps = {
  section: LibraryCatalogSection;
  items: LibraryEntryItem[];
  onPressItem: (id: string, invocationSlug?: string, hadithCollectionName?: string) => void;
  rowPaddingStyle?: StyleProp<ViewStyle>;
  isFirst?: boolean;
};

export function LibrarySection({
  section,
  items,
  onPressItem,
  rowPaddingStyle,
  isFirst,
}: SectionProps) {
  const colors = useAppTheme();
  const typography = useAppTypography();
  const { t } = useTranslation();
  const styles = useMemo(
    () => createLibraryScreenStyles(colors, typography),
    [colors, typography]
  );

  return (
    <View style={[styles.section, isFirst && styles.sectionFirst]}>
      <SectionHeader
        title={t(section.titleKey)}
        seeAllLabel={t("library.seeAll")}
        style={styles.sectionHeader}
      />
      <LibraryCategoryRow
        items={items}
        onPressItem={onPressItem}
        contentStyle={rowPaddingStyle}
      />
    </View>
  );
}
