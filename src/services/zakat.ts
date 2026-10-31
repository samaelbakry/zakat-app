import {
  ZakatCalculateInput,
  ZakatCalculateResponse,
  ZakatCalculationResult,
  ZakatInfo,
  ZakatPrices,
} from "@/types/zakatTypes";

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
    `prices?currency=${encodeURIComponent(currency)}`,
  );
}

export async function calculateZakat(
  input: ZakatCalculateInput,
): Promise<ZakatCalculationResult> {
  const response = await fetch(`${BASE_URL}/calculate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(input),
  });

  const result = (await response.json()) as ZakatCalculateResponse;

  if (!response.ok || !result.success) {
    throw new Error(
      (result as any).message || `Zakat calculation failed: ${response.status}`,
    );
  }

  return result.data;
}
