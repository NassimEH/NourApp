import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";

import { categories } from "@/constants/data";

const FILTER_GREEN = "#3d6b47";

const Filters = () => {
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

const styles = StyleSheet.create({
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
    backgroundColor: FILTER_GREEN,
  },
  pillDefault: {
    backgroundColor: "rgba(61, 107, 71, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(61, 107, 71, 0.3)",
  },
  pillText: {
    fontSize: 14,
  },
  pillTextSelected: {
    color: "#fff",
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  pillTextDefault: {
    color: "#191D31",
    fontFamily: "PlusJakartaSans-Regular",
  },
});

export default Filters;
