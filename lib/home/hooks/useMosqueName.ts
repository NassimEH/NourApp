import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";

import { getMosqueName } from "../mosque-preference";

export function useMosqueName(): {
  mosqueName: string | null;
  refresh: () => Promise<void>;
} {
  const [mosqueName, setMosqueName] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setMosqueName(await getMosqueName());
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  return { mosqueName, refresh };
}
