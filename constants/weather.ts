import type { WeatherImageKey } from "@/lib/useWeather";

export const weatherImages: Record<WeatherImageKey, number> = {
  orage: require("@/assets/images/villes/orage.png"),
  neige: require("@/assets/images/villes/neige.png"),
  pluie: require("@/assets/images/villes/pluie.png"),
  brouillard: require("@/assets/images/villes/brouillard.png"),
  crépuscule: require("@/assets/images/villes/crépuscule.png"),
  nuageux: require("@/assets/images/villes/nuageux.png"),
};

export const WEATHER_DOU3A: Record<
  WeatherImageKey,
  { dou3aKey: string; reasonKey: string }
> = {
  pluie: {
    dou3aKey: "weather.invocations.pluie.text",
    reasonKey: "weather.invocations.pluie.reason",
  },
  orage: {
    dou3aKey: "weather.invocations.orage.text",
    reasonKey: "weather.invocations.orage.reason",
  },
  neige: {
    dou3aKey: "weather.invocations.neige.text",
    reasonKey: "weather.invocations.neige.reason",
  },
  brouillard: {
    dou3aKey: "weather.invocations.brouillard.text",
    reasonKey: "weather.invocations.brouillard.reason",
  },
  crépuscule: {
    dou3aKey: "weather.invocations.crépuscule.text",
    reasonKey: "weather.invocations.crépuscule.reason",
  },
  nuageux: {
    dou3aKey: "weather.invocations.nuageux.text",
    reasonKey: "weather.invocations.nuageux.reason",
  },
};
