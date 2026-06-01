export interface ZakatCountryPreset {
  id: string;
  labelKey: string;
  amountPerPerson: number;
  currency: string;
}

/** Montants indicatifs — à confirmer chaque année auprès des autorités locales. */
export const ZAKAT_COUNTRY_PRESETS: ZakatCountryPreset[] = [
  { id: "fr", labelKey: "zakatFitr.countryFr", amountPerPerson: 7, currency: "EUR" },
  { id: "be", labelKey: "zakatFitr.countryBe", amountPerPerson: 7, currency: "EUR" },
  { id: "ma", labelKey: "zakatFitr.countryMa", amountPerPerson: 30, currency: "MAD" },
  { id: "dz", labelKey: "zakatFitr.countryDz", amountPerPerson: 800, currency: "DZD" },
  { id: "tn", labelKey: "zakatFitr.countryTn", amountPerPerson: 7, currency: "TND" },
  { id: "sa", labelKey: "zakatFitr.countrySa", amountPerPerson: 25, currency: "SAR" },
  { id: "ae", labelKey: "zakatFitr.countryAe", amountPerPerson: 25, currency: "AED" },
  { id: "gb", labelKey: "zakatFitr.countryGb", amountPerPerson: 6, currency: "GBP" },
  { id: "us", labelKey: "zakatFitr.countryUs", amountPerPerson: 12, currency: "USD" },
];
