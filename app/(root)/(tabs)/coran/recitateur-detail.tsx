import { Redirect, useLocalSearchParams } from "expo-router";

/** Ancien chemin dans la stack Bibliothèque — redirige hors onglets. */
export default function RecitateurDetailLegacyRedirect() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return (
    <Redirect
      href={{
        pathname: "/(root)/recitateur-detail",
        params: id ? { id } : undefined,
      }}
    />
  );
}
