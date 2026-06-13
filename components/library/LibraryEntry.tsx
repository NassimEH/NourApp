import { useMemo } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import * as Haptics from "expo-haptics";

import { AppIcon } from "@/components/AppIcon";
import { SectionHeader } from "@/components/SectionHeader";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import {
  getLibraryCardWidth,
  LIBRARY_CARD_GAP,
  LIBRARY_SNAP_EXTRA,
  type LibraryCatalogItem,
  type LibraryCatalogSection,
} from "@/lib/library/catalog";
import { createLibraryScreenStyles } from "@/lib/library-screen-styles";
import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";

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

type CardProps = {
  item: LibraryEntryItem;
  width: number;
  onPress: () => void;
};

function LibraryCard({ item, width, onPress }: CardProps) {
  const colors = useAppTheme();
  const styles = useMemo(() => createLibraryScreenStyles(colors), [colors]);
  const { t, rtlTextStyle } = useTranslation();
  const disabled = item.disabled === true;

  const handlePress = () => {
    if (disabled) return;
    if (Platform.OS === "ios") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}. ${item.subtitle}`}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.card,
        { width },
        pressed && !disabled && styles.cardPressed,
        disabled && styles.cardDisabled,
      ]}
    >
      <View style={styles.iconWrap}>
        <AppIcon name={item.icon} size={26} color={colors.accent} />
      </View>

      <View style={styles.textBlock}>
        <Text
          style={[styles.title, rtlTextStyle]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.title}
        </Text>
        <Text
          style={[styles.subtitle, rtlTextStyle]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.subtitle}
        </Text>
      </View>

      <View style={styles.cardDivider} accessibilityElementsHidden />

      <View style={styles.footer}>
        {item.soon ? (
          <View style={styles.soonPill}>
            <Text style={styles.soonText}>{t("library.soon")}</Text>
          </View>
        ) : (
          <>
            <Text style={[styles.action, rtlTextStyle]}>
              {t("library.actionOpen")}
            </Text>
            <AppIcon name="chevron-right" size={14} color={colors.accent} />
          </>
        )}
      </View>
    </Pressable>
  );
}

type RowProps = {
  items: LibraryEntryItem[];
  cardWidth: number;
  onPressItem: (id: string, invocationSlug?: string, hadithCollectionName?: string) => void;
  contentStyle?: StyleProp<ViewStyle>;
};

export function LibraryCategoryRow({
  items,
  cardWidth,
  onPressItem,
  contentStyle,
}: RowProps) {
  const colors = useAppTheme();
  const styles = useMemo(() => createLibraryScreenStyles(colors), [colors]);
  const snap = cardWidth + LIBRARY_SNAP_EXTRA;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={snap}
      snapToAlignment="start"
      disableIntervalMomentum
      contentContainerStyle={[
        styles.rowContent,
        { gap: LIBRARY_CARD_GAP },
        contentStyle,
      ]}
    >
      {items.map((item) => (
        <LibraryCard
          key={item.id}
          item={item}
          width={cardWidth}
          onPress={() => onPressItem(item.id, item.invocationSlug, item.hadithCollectionName)}
        />
      ))}
    </ScrollView>
  );
}

/** Séparateur horizontal entre blocs de la bibliothèque */
export function LibrarySectionDivider({ variant = "section" }: { variant?: "header" | "section" }) {
  const colors = useAppTheme();
  const styles = useMemo(() => createLibraryScreenStyles(colors), [colors]);
  return (
    <View
      style={variant === "header" ? styles.headerDivider : styles.sectionDivider}
      accessibilityElementsHidden
    />
  );
}

type SectionProps = {
  section: LibraryCatalogSection;
  cardWidth: number;
  items: LibraryEntryItem[];
  onPressItem: (id: string, invocationSlug?: string, hadithCollectionName?: string) => void;
  rowPaddingStyle?: StyleProp<ViewStyle>;
  isFirst?: boolean;
};

export function LibrarySection({
  section,
  cardWidth,
  items,
  onPressItem,
  rowPaddingStyle,
  isFirst,
}: SectionProps) {
  const colors = useAppTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => createLibraryScreenStyles(colors), [colors]);

  return (
    <View style={[styles.section, isFirst && styles.sectionFirst]}>
      <SectionHeader
        title={t(section.titleKey)}
        seeAllLabel={t("library.seeAll")}
        style={styles.sectionHeader}
      />
      <LibraryCategoryRow
        items={items}
        cardWidth={cardWidth}
        onPressItem={onPressItem}
        contentStyle={rowPaddingStyle}
      />
    </View>
  );
}

export function useLibraryCardWidth(screenWidth: number) {
  return useMemo(
    () => getLibraryCardWidth(screenWidth, SCREEN_EDGE_PADDING),
    [screenWidth]
  );
}
