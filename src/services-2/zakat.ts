import { ZakatInfo, ZakatPrices } from "@/types/zakatTypes";

const BASE_URL = "https://ummahapi.com/api/zakat";

async function zakatRequest<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}/${endpoint}`);

  if (!response.ok) {
    throw new Error(`Zakat API Error: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Something went wrong");
  }

  return result.data as T;
}


export function getZakatInfo() {
  return zakatRequest<ZakatInfo>("info");
}

export function getZakatPrices(currency = "EGP") {
  return zakatRequest<ZakatPrices>(
    `prices?currency=${encodeURIComponent(currency)}`
  );
}