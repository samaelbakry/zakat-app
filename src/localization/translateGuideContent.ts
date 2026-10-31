import i18n from "./i18n";

export function translateGuideContent() {
  const t = i18n.getFixedT(i18n.language, "translation", "guideContent");

  return {
    definition: t("definition"),
    nisab: {
      gold: t("nisab.gold"),
      silver: t("nisab.silver"),
      note: t("nisab.note"),
    },
    rate: {
      general: t("rate.general"),
      agriculture_rain: t("rate.agricultureRain"),
      agriculture_irrigated: t("rate.agricultureIrrigated"),
    },
    conditions: t("conditions", { returnObjects: true }) as string[],
    eligible_recipients: t("recipients", { returnObjects: true }) as string[],
    zakatable_assets: t("zakatableAssets", { returnObjects: true }) as string[],
    non_zakatable_assets: t("nonZakatableAssets", { returnObjects: true }) as string[],
    hawl: t("hawl"),
    disclaimer: t("disclaimer"),
    source: t("source"),
  };
}