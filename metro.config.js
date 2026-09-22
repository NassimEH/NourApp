const path = require("path");
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

const withNw = withNativeWind(config, { input: "./app/global.css" });

// Metro + packageExports doesn't follow nested package.json "main" for
// react-native-css-interop/jsx-runtime (NativeWind JSX importSource).
const CSS_INTEROP_JSX = {
  "react-native-css-interop/jsx-runtime": path.resolve(
    __dirname,
    "node_modules/react-native-css-interop/dist/runtime/jsx-runtime.js"
  ),
  "react-native-css-interop/jsx-dev-runtime": path.resolve(
    __dirname,
    "node_modules/react-native-css-interop/dist/runtime/jsx-dev-runtime.js"
  ),
};

const previousResolveRequest = withNw.resolver?.resolveRequest;
withNw.resolver = withNw.resolver ?? {};
withNw.resolver.resolveRequest = (context, moduleName, platform) => {
  const aliased = CSS_INTEROP_JSX[moduleName];
  if (aliased) {
    return { type: "sourceFile", filePath: aliased };
  }
  if (previousResolveRequest) {
    return previousResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNw;
