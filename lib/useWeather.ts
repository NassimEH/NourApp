import { useEffect, useState } from "react";

const OPEN_METEO = "https://api.open-meteo.com/v1/forecast";

export type WeatherImageKey =
  | "orage"
  | "neige"
  | "pluie"
  | "brouillard"
  | "crépuscule"
  | "nuageux";

export interface WeatherData {
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  isDay: number;
  humidity: number;
  windSpeed: number;
  surfacePressure: number;
  imageKey: WeatherImageKey;
  conditionLabel: string;
}

const WMO_LABELS: Record<number, string> = {
  0: "Ciel dégagé",
  1: "Principalement dégagé",
  2: "Partiellement nuageux",
  3: "Couvert",
  45: "Brouillard",
  48: "Brouillard givrant",
  51: "Bruine légère",
  53: "Bruine modérée",
  55: "Bruine dense",
  56: "Bruine verglaçante légère",
  57: "Bruine verglaçante dense",
  61: "Pluie légère",
  63: "Pluie modérée",
  65: "Pluie forte",
  66: "Pluie verglaçante légère",
  67: "Pluie verglaçante forte",
  71: "Chute de neige légère",
  73: "Chute de neige modérée",
  75: "Chute de neige forte",
  77: "Grains de neige",
  80: "Averses légères",
  81: "Averses modérées",
  82: "Averses violentes",
  85: "Légères averses de neige",
  86: "Averses de neige fortes",
  95: "Orage",
  96: "Orage avec grêle légère",
  99: "Orage avec grêle forte",
};

function getImageKey(weatherCode: number, isDay: number): WeatherImageKey {
  if (weatherCode >= 95 && weatherCode <= 99) return "orage";
  if ([71, 72, 73, 75, 77, 85, 86].includes(weatherCode)) return "neige";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode))
    return "pluie";
  if ([45, 48].includes(weatherCode)) return "brouillard";
  if (isDay === 0) return "crépuscule";
  return "nuageux";
}

export function useWeather(
  latitude: number | undefined,
  longitude: number | undefined
) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (
      latitude == null ||
      longitude == null ||
      typeof latitude !== "number" ||
      typeof longitude !== "number"
    ) {
      setLoading(false);
      setData(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const url = `${OPEN_METEO}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,is_day,wind_speed_10m,surface_pressure&timezone=auto`;

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        const cur = json?.current;
        if (!cur) {
          setError("Données indisponibles");
          return;
        }
        const weatherCode = Number(cur.weather_code) || 0;
        const isDay = Number(cur.is_day) ?? 1;
        setData({
          temperature: Number(cur.temperature_2m) ?? 0,
          apparentTemperature: Number(cur.apparent_temperature) ?? Number(cur.temperature_2m) ?? 0,
          weatherCode,
          isDay,
          humidity: Number(cur.relative_humidity_2m) ?? 0,
          windSpeed: Number(cur.wind_speed_10m) ?? 0,
          surfacePressure: Number(cur.surface_pressure) ?? 0,
          imageKey: getImageKey(weatherCode, isDay),
          conditionLabel: WMO_LABELS[weatherCode] ?? "—",
        });
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? "Erreur météo");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [latitude, longitude]);

  return { data, loading, error };
}
