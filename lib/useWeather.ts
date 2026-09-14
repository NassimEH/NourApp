import { useCallback, useEffect, useState } from "react";

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
  conditionKey: string;
}

const WMO_CONDITION_KEYS: Record<number, string> = {
  0: "weather.conditions.clear",
  1: "weather.conditions.mostlyClear",
  2: "weather.conditions.partlyCloudy",
  3: "weather.conditions.overcast",
  45: "weather.conditions.fog",
  48: "weather.conditions.rimeFog",
  51: "weather.conditions.lightDrizzle",
  53: "weather.conditions.moderateDrizzle",
  55: "weather.conditions.denseDrizzle",
  56: "weather.conditions.lightFreezingDrizzle",
  57: "weather.conditions.denseFreezingDrizzle",
  61: "weather.conditions.lightRain",
  63: "weather.conditions.moderateRain",
  65: "weather.conditions.heavyRain",
  66: "weather.conditions.lightFreezingRain",
  67: "weather.conditions.heavyFreezingRain",
  71: "weather.conditions.lightSnowfall",
  73: "weather.conditions.moderateSnowfall",
  75: "weather.conditions.heavySnowfall",
  77: "weather.conditions.snowGrains",
  80: "weather.conditions.lightShowers",
  81: "weather.conditions.moderateShowers",
  82: "weather.conditions.violentShowers",
  85: "weather.conditions.lightSnowShowers",
  86: "weather.conditions.heavySnowShowers",
  95: "weather.conditions.thunderstorm",
  96: "weather.conditions.thunderstormLightHail",
  99: "weather.conditions.thunderstormHeavyHail",
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
  const [refreshToken, setRefreshToken] = useState(0);
  const refetch = useCallback(() => setRefreshToken((token) => token + 1), []);

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
          setError("weather.dataUnavailable");
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
          conditionKey:
            WMO_CONDITION_KEYS[weatherCode] ?? "weather.conditions.unknown",
        });
      })
      .catch(() => {
        if (!cancelled) setError("weather.loadError");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [latitude, longitude, refreshToken]);

  return { data, loading, error, refetch };
}
