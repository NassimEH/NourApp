// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*", "node_modules/*", ".expo/*"],
  },
  {
    rules: {
      // Texte FR/AR fréquent dans <Text> — évite les faux positifs en CI
      "react/no-unescaped-entities": "off",
      // Fichiers UTF-8 avec BOM (éditeurs Windows) — bruit sans impact runtime
      "unicode-bom": "off",
    },
  },
]);
