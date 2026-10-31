export type ZakatInfo = {
  definition: string;
  nisab: {
    gold: {
      grams: number;
      description: string;
    };
    silver: {
      grams: number;
      description: string;
    };
    note: string;
  };
  rate: {
    general: string;
    agriculture_rain: string;
    agriculture_irrigated: string;
  };
  conditions: string[];
  eligible_recipients: string[];
  zakatable_assets: string[];
  non_zakatable_assets: string[];
  hawl: string;
  disclaimer: string;
  source: string;
};

export type ZakatPrices = {
  as_of: string;
  currency: string;
  currency_supported: boolean;
  fx_source: string;
  gold_price_per_gram: number;
  is_fallback: boolean;
  nisab_gold_grams: number;
  nisab_gold_value: number;
  nisab_silver_grams: number;
  nisab_silver_value: number;
  note: string;
  requested_currency: string;
  silver_price_per_gram: number;
  source: string;
};

export type NisabStandard = "gold" | "silver";

export type ZakatCalculateInput = {
  currency: string;
  cash?: number;
  gold_grams?: number;
  silver_grams?: number;
  stocks?: number;
  business_goods?: number;
  other_investments?: number;
  liabilities?: number;
  nisab_standard?: NisabStandard;
};

export type ZakatCalculationResult = {
  zakat_due: number;
  zakat_due_formatted: string;
  above_nisab: boolean;
  nisab_standard: NisabStandard;
  nisab_value: number;
  nisab_gold_grams: number;
  nisab_silver_grams: number;
  rate: string;
  breakdown: {
    cash: number;
    gold_value: number;
    silver_value: number;
    stocks: number;
    business_goods: number;
    other_investments: number;
    gross_wealth: number;
    liabilities: number;
    net_zakatable_wealth: number;
  };
  note: string;
  prices_used: {
    auto_filled: boolean;
    currency: string;
    gold_price_per_gram: number;
    gold_price_source: string;
    silver_price_per_gram: number;
    silver_price_source: string;
    source: string;
    as_of: string;
    is_fallback: boolean;
  };
};

export type ZakatCalculateResponse = {
  success: boolean;
  service: string;
  data: ZakatCalculationResult;
  timestamp: string;
  api_info?: {
    sadaqah_jariah?: string;
  };
  warnings?: string[];
};