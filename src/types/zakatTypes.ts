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