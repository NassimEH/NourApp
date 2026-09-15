import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { HomeSectionRule } from "@/components/home/HomeSectionRule";
import { SectionHeader } from "@/components/SectionHeader";
import { SECTION_GAP, SECTION_TITLE_GAP } from "@/lib/ui/spacing";

export interface HomeSectionProps {
  title: string;
  onSeeAll?: () => void;
  seeAllLabel?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Première section sous le hero : pas de règle au-dessus */
  isFirst?: boolean;
}

/**
 * Cadre d’une section d’accueil : séparateur fin + titre (+ Voir tout) puis contenu.
 */
export function HomeSection({
  title,
  onSeeAll,
  seeAllLabel,
  children,
  style,
  isFirst = false,
}: HomeSectionProps) {
  return (
    <View style={[styles.section, isFirst && styles.sectionFirst, style]}>
      {!isFirst ? <HomeSectionRule style={styles.rule} /> : null}
      <SectionHeader
        title={title}
        onSeeAll={onSeeAll}
        seeAllLabel={seeAllLabel}
        style={styles.header}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: SECTION_GAP,
  },
  sectionFirst: {
    marginTop: SECTION_GAP - 4,
  },
  rule: {
    marginBottom: SECTION_GAP - 4,
  },
  header: {
    marginBottom: SECTION_TITLE_GAP + 2,
  },
});
