import { toHijri } from "hijri-converter";

/** Mois hijri du Ramadan (9). */
export function isRamadanSeason(date: Date = new Date()): boolean {
  const { hm } = toHijri(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
  return hm === 9;
}
