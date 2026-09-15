import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";

import { AppIcon, type AppIconName } from "@/components/AppIcon";
import { HomeSectionRule } from "@/components/home/HomeSectionRule";
import { ToolMiniCard } from "@/components/tools/ToolMiniCard";
import { useAppTheme } from "@/lib/app-theme";
import { useAppTypography } from "@/lib/app-typography";
import { useTranslation } from "@/lib/i18n";
import { createLibraryScreenStyles } from "@/lib/library-screen-styles";
import type { LibraryCatalogItem } from "@/lib/library/catalog";
import { SPACE } from "@/lib/ui/spacing";

export type LibraryNavHandlers = {
  onPressItem: (
    id: string,
    invocationSlug?: string,
    hadithCollectionName?: string
  ) => void;
};

function pressItem(
  item: LibraryCatalogItem,
  onPressItem: LibraryNavHandlers["onPressItem"]
) {
  onPressItem(item.id, item.invocationSlug, item.hadithCollectionName);
}

/** Separateur leger (ex. ecran Apprendre). */
export function LibrarySectionDivider({
  variant = "section",
}: {
  variant?: "header" | "section";
}) {
  return (
    <HomeSectionRule
      style={{
        marginTop: variant === "header" ? SPACE.sm : SPACE.md,
        marginBottom: SPACE.md,
      }}
    />
  );
}

/** Hero mis en avant (ex. Sourates). */
export function LibraryHeroCard({
  item,
  onPressItem,
}: {
  item: LibraryCatalogItem;
  onPressItem: LibraryNavHandlers["onPressItem"];
}) {
  const colors = useAppTheme();
  const typography = useAppTypography();
  const styles = useMemo(
    () => createLibraryScreenStyles(colors, typography),
    [colors, typography]
  );
  const { t, rtlTextStyle, rtlViewStyle, isRTL } = useTranslation();

  return (
    <Pressable
      onPress={() => pressItem(item, onPressItem)}
      accessibilityRole="button"
      accessibilityLabel={`${t(item.titleKey)}. ${t(item.shortKey)}`}
      style={({ pressed }) => [
        styles.hero,
        rtlViewStyle,
        pressed && styles.heroPressed,
      ]}
    >
      <View style={styles.heroIconWrap}>
        <AppIcon name={item.icon} size={26} color={colors.accent} />
      </View>
      <View style={styles.heroText}>
        <Text style={[styles.heroTitle, rtlTextStyle]} numberOfLines={1}>
          {t(item.titleKey)}
        </Text>
        <Text style={[styles.heroSubtitle, rtlTextStyle]} numberOfLines={2}>
          {t(item.shortKey)}
        </Text>
      </View>
      <AppIcon
        name={isRTL ? "chevron-left" : "chevron-right"}
        size={20}
        color={colors.iconMuted}
      />
    </Pressable>
  );
}

/** Grille 2x2 de tuiles outils / categories. */
export function LibraryToolGrid({
  items,
  onPressItem,
}: {
  items: LibraryCatalogItem[];
  onPressItem: LibraryNavHandlers["onPressItem"];
}) {
  const colors = useAppTheme();
  const typography = useAppTypography();
  const styles = useMemo(
    () => createLibraryScreenStyles(colors, typography),
    [colors, typography]
  );
  const { t } = useTranslation();

  const rows: LibraryCatalogItem[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }

  return (
    <View style={styles.grid}>
      {rows.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.gridRow}>
          {row.map((item) => (
            <View key={item.id} style={styles.gridCell}>
              <ToolMiniCard
                icon={item.icon}
                title={t(item.titleKey)}
                fill
                accessibilityLabel={`${t(item.titleKey)}. ${t(item.shortKey)}`}
                onPress={() => pressItem(item, onPressItem)}
              />
            </View>
          ))}
          {row.length === 1 ? <View style={styles.gridCell} /> : null}
        </View>
      ))}
    </View>
  );
}

/** Raccourcis sous un teaser (themes / recueils). */
export function LibraryShortcutList({
  items,
  onPressItem,
}: {
  items: LibraryCatalogItem[];
  onPressItem: LibraryNavHandlers["onPressItem"];
}) {
  const colors = useAppTheme();
  const typography = useAppTypography();
  const styles = useMemo(
    () => createLibraryScreenStyles(colors, typography),
    [colors, typography]
  );
  const { t, rtlTextStyle, rtlViewStyle, isRTL } = useTranslation();

  return (
    <View style={styles.shortcuts}>
      {items.map((item) => (
        <Pressable
          key={item.id}
          onPress={() => pressItem(item, onPressItem)}
          accessibilityRole="button"
          accessibilityLabel={`${t(item.titleKey)}. ${t(item.shortKey)}`}
          style={({ pressed }) => [
            styles.shortcut,
            rtlViewStyle,
            pressed && styles.shortcutPressed,
          ]}
        >
          <View style={styles.shortcutIcon}>
            <AppIcon
              name={item.icon as AppIconName}
              size={18}
              color={colors.accent}
            />
          </View>
          <View style={styles.shortcutText}>
            <Text style={[styles.shortcutTitle, rtlTextStyle]} numberOfLines={1}>
              {t(item.titleKey)}
            </Text>
            <Text
              style={[styles.shortcutSubtitle, rtlTextStyle]}
              numberOfLines={1}
            >
              {t(item.shortKey)}
            </Text>
          </View>
          <AppIcon
            name={isRTL ? "chevron-left" : "chevron-right"}
            size={18}
            color={colors.iconMuted}
          />
        </Pressable>
      ))}
    </View>
  );
}

/** Teaser Hadith du jour — meme ton que l'accueil. */
export function LibraryHadithTeaser({
  title,
  badge,
  body,
  source,
  onPress,
}: {
  title: string;
  badge: string;
  body: string;
  source: string;
  onPress: () => void;
}) {
  const colors = useAppTheme();
  const typography = useAppTypography();
  const styles = useMemo(
    () => createLibraryScreenStyles(colors, typography),
    [colors, typography]
  );
  const { rtlTextStyle, rtlViewStyle } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [styles.teaser, pressed && styles.teaserPressed]}
    >
      <View style={[styles.teaserMeta, rtlViewStyle]}>
        <AppIcon name="message-circle" size={14} color={colors.accent} />
        <Text style={[styles.teaserBadge, rtlTextStyle]}>{badge}</Text>
      </View>
      <Text style={[styles.teaserBody, rtlTextStyle]} numberOfLines={3}>
        {body}
      </Text>
      <Text style={[styles.teaserSource, rtlTextStyle]} numberOfLines={1}>
        {source}
      </Text>
    </Pressable>
  );
}
