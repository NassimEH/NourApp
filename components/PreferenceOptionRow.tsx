import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";

interface PreferenceOptionRowProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function PreferenceOptionRow({ label, selected, onPress }: PreferenceOptionRowProps) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.label}>{label}</Text>
      {selected ? (
        <Feather name="check" size={22} color="#191D31" />
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 17,
    fontFamily: "PlusJakartaSans-Medium",
    color: "#191D31",
  },
});

export default PreferenceOptionRow;
