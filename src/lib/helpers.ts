export const formatCurrency = (value: number, currency = "EGP") =>
  new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);

export const formatDate = (date: string) =>
  new Date(date).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })