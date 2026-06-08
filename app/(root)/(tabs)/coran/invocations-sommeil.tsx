import { Redirect } from "expo-router";

const SLEEP_SLUG = "doua-avant-dormir";

/** Redirige vers la catégorie invocations avant le sommeil. */
export default function InvocationsSommeilScreen() {
  return (
    <Redirect
      href={{
        pathname: "/(root)/(tabs)/coran/invocations/category/[slug]",
        params: { slug: SLEEP_SLUG },
      }}
    />
  );
}
