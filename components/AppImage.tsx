import { Image, type ImageProps } from "expo-image";

type ResizeMode = "cover" | "contain" | "stretch" | "center" | "repeat";

type AppImageProps = Omit<ImageProps, "contentFit"> & {
  contentFit?: ImageProps["contentFit"];
  /** Compat RN Image — mappé vers contentFit */
  resizeMode?: ResizeMode;
};

const RESIZE_TO_FIT: Record<ResizeMode, NonNullable<ImageProps["contentFit"]>> =
  {
    cover: "cover",
    contain: "contain",
    stretch: "fill",
    center: "none",
    repeat: "none",
  };

/**
 * Image app — cache mémoire + disque (URIs), decode rapide (assets locaux).
 * Préférer ce composant à react-native `Image` partout.
 */
export function AppImage({
  resizeMode,
  contentFit,
  cachePolicy = "memory-disk",
  transition = 0,
  ...rest
}: AppImageProps) {
  return (
    <Image
      {...rest}
      cachePolicy={cachePolicy}
      transition={transition}
      contentFit={
        contentFit ?? (resizeMode ? RESIZE_TO_FIT[resizeMode] : "cover")
      }
    />
  );
}
