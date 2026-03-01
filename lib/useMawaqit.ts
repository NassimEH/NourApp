import { useEffect, useState } from "react";

/**
 * API Mawaqit (mrsofiane/mawaqit-api)
 * @see https://github.com/mrsofiane/mawaqit-api
 * @see https://mrsofiane.me/mawaqit-api
 *
 * Base URL : EXPO_PUBLIC_MAWAQIT_API_URL ou déploiement public.
 * Optionnel : EXPO_PUBLIC_MAWAQIT_API_TOKEN si l'API exige un Bearer token.
 *
 * Autres endpoints disponibles (GET /api/v1/{masjid_id}/...) :
 *
 * - /prayer-times     → Horaires du jour (fajr, sunrise, dohr, asr, maghreb, icha)
 * - /announcements    → Annonces de la mosquée (title, content, image, video, dates…)
 * - /services        → Services : womenSpace, janazaPrayer, aidPrayer, childrenCourses,
 *                      adultCourses, ramadanMeal, handicapAccessibility, ablutions, parking
 * - /calendar        → Calendrier annuel des horaires
 * - /calendar/{month} → Horaires du mois (liste de PrayerTimes)
 * - /calendar-iqama/{month} → Horaires d’iqama du mois (fajr, dohr, asr, maghreb, icha)
 * - /                → Données brutes du site Mawaqit
 */
const MAWAQIT_API_BASE =
  (typeof process !== "undefined" &&
    process.env?.EXPO_PUBLIC_MAWAQIT_API_URL) ||
  "https://mawaqit-api.onrender.com";

export interface MawaqitPrayerTimes {
  fajr: string;
  sunrise: string;
  dohr: string;
  asr: string;
  maghreb: string;
  icha: string;
}

/** Horaires du jour pour une mosquée (GET /api/v1/{masjid_id}/prayer-times) */
export function useMawaqitPrayerTimes(masjidId: string | null) {
  const [data, setData] = useState<MawaqitPrayerTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!masjidId || masjidId.trim() === "") {
      setLoading(false);
      setData(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const url = `${MAWAQIT_API_BASE}/api/v1/${encodeURIComponent(masjidId)}/prayer-times`;
    const headers: HeadersInit = {};
    const token =
      typeof process !== "undefined" && process.env?.EXPO_PUBLIC_MAWAQIT_API_TOKEN;
    if (token) headers["Authorization"] = `Bearer ${token}`;

    fetch(url, { headers })
      .then((res) => {
        if (!res.ok) throw new Error(`Mawaqit: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        if (
          json &&
          typeof json.fajr === "string" &&
          typeof json.dohr === "string"
        ) {
          setData({
            fajr: json.fajr ?? "",
            sunrise: json.sunrise ?? "",
            dohr: json.dohr ?? "",
            asr: json.asr ?? "",
            maghreb: json.maghreb ?? "",
            icha: json.icha ?? "",
          });
        } else {
          setError("Format invalide");
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? "Horaires indisponibles");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [masjidId]);

  return { data, loading, error };
}

/** ID Mawaqit de la Grande Mosquée d'Évry (slug sur mawaqit.net) */
export const MAWAQIT_MOSQUEE_EVRY = "mosquee-evry";
