import React, { useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";

import { categories } from "@/constants/data";
import { useAppTheme } from "@/lib/app-theme";

const Filters = () => {
  const colors = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const params = useLocalSearchParams<{ filter?: string }>();
  const [selectedCategory, setSelectedCategory] = useState(
    params.filter || "All"
  );

  const handleCategoryPress = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory("");
      router.setParams({ filter: "" });
      return;
    }

    setSelectedCategory(category);
    router.setParams({ filter: category });
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
    >
      {categories.map((item, index) => {
        const isSelected = selectedCategory === item.category;
        return (
          <TouchableOpacity
            onPress={() => handleCategoryPress(item.category)}
            key={index}
            style={[
              styles.pill,
              isSelected ? styles.pillSelected : styles.pillDefault,
            ]}
          >
            <Text
              style={[
                styles.pillText,
                isSelected ? styles.pillTextSelected : styles.pillTextDefault,
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

function createStyles(colors: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    scroll: { marginTop: 12, marginBottom: 8 },
    scrollContent: { paddingRight: 8 },
    pill: {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 9999,
    },
    pillSelected: {
      backgroundColor: colors.accent,
    },
    pillDefault: {
      backgroundColor: colors.accentSurface,
      borderWidth: 1,
      borderColor: colors.accentBorder,
    },
    pillText: {
      fontSize: 14,
    },
    pillTextSelected: {
      color: colors.onAccent,
      fontFamily: "PlusJakartaSans-SemiBold",
    },
    pillTextDefault: {
      color: colors.text,
      fontFamily: "PlusJakartaSans-Regular",
    },
  });
}

export default Filters;
