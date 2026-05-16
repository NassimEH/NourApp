import { StyleSheet, View } from "react-native";

type Props = {
  accent: string;
};

/** Halos décoratifs pour la profondeur de fond. */
export function SignInDecorOrbs({ accent }: Props) {
  return (
    <View style={styles.layer} pointerEvents="none">
      <View style={[styles.orb, styles.orbTop, { backgroundColor: `${accent}28` }]} />
      <View style={[styles.orb, styles.orbRight, { backgroundColor: `${accent}18` }]} />
      <View style={[styles.orb, styles.orbBottom, { backgroundColor: "rgba(25, 29, 49, 0.06)" }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  orb: {
    position: "absolute",
    borderRadius: 999,
  },
  orbTop: {
    width: 280,
    height: 280,
    top: -80,
    right: -60,
  },
  orbRight: {
    width: 200,
    height: 200,
    top: "38%",
    left: -70,
  },
  orbBottom: {
    width: 320,
    height: 320,
    bottom: -120,
    alignSelf: "center",
    left: "15%",
  },
});
