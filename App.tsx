/**
 * Shim Expo Go / Metro : `expo/AppEntry` importe `../../App`.
 * L’entrée officielle reste `expo-router/entry` (package.json main).
 */
import "@expo/metro-runtime";

export { App as default } from "expo-router/build/qualified-entry";
