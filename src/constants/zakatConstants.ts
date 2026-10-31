export type FieldKey =
  | "cash"
  | "gold_grams"
  | "silver_grams"
  | "stocks"
  | "business_goods"
  | "other_investments"
  | "liabilities";

export const fields: {
  key: FieldKey;
  label: string;
  hint: string;
  placeholder: string;
  unit: string;
}[] = [
  {
    key: "cash",
    label: "Cash & Savings",
    hint: "Money in cash and bank accounts",
    placeholder: "Enter amount",
    unit: "EGP",
  },
  {
    key: "gold_grams",
    label: "Gold",
    hint: "Enter the weight of your gold in grams",
    placeholder: "Weight in grams",
    unit: "g",
  },
  {
    key: "silver_grams",
    label: "Silver",
    hint: "Enter the weight of your silver in grams",
    placeholder: "Weight in grams",
    unit: "g",
  },
  {
    key: "stocks",
    label: "Stocks & Shares",
    hint: "Current monetary value",
    placeholder: "Enter amount",
    unit: "EGP",
  },
  {
    key: "business_goods",
    label: "Business Goods",
    hint: "Value of your trade inventory",
    placeholder: "Enter amount",
    unit: "EGP",
  },
  {
    key: "other_investments",
    label: "Other Investments",
    hint: "Other zakatable investments",
    placeholder: "Enter amount",
    unit: "EGP",
  },
  {
    key: "liabilities",
    label: "Liabilities",
    hint: "Debts and liabilities to deduct",
    placeholder: "Enter amount",
    unit: "EGP",
  },
];