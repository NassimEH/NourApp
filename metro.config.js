const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// `ws` is Node-only; never let Metro pull it into the RN bundle.
config.resolver = config.resolver ?? {};
const prevBlock =
  config.resolver.blockList == null
    ? []
    : Array.isArray(config.resolver.blockList)
      ? config.resolver.blockList
      : [config.resolver.blockList];
config.resolver.blockList = [
  ...prevBlock,
  /[\\/]node_modules[\\/]ws[\\/].*/,
];

module.exports = withNativeWind(config, { input: "./app/global.css" });
