import { useCallback, useEffect, useState } from "react";

import { getRecentSuras } from "../storage";

export function useRecentSuras(): {
  recentSuraNumbers: number[];
  refetch: () => void;
} {
  const [recentSuraNumbers, setRecentSuraNumbers] = useState<number[]>([]);

  const refetch = useCallback(() => {
    getRecentSuras().then(setRecentSuraNumbers);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { recentSuraNumbers, refetch };
}
