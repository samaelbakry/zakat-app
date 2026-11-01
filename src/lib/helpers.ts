export const formatCurrency = (value: number, currency = "EGP") =>
  new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);

export const formatDate = (date: string, language = "en") => {
  return new Intl.DateTimeFormat(
    language.startsWith("ar") ? "ar-EG" : "en-US",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(new Date(date));
};

export const formatMoney = (value: number, currency: string) =>
  new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
