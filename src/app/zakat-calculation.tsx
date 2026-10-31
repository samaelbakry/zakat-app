import FormField from "@/components/ui/FormField";
import { FieldKey, fields } from "@/constants/zakatConstants";
import { formatDate, formatMoney } from "@/lib/helpers";
import { calculateZakat } from "@/services/zakat";
import {
  NisabStandard,
  ZakatCalculateInput,
  ZakatCalculationResult,
} from "@/types/zakatTypes";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import tw from "twrnc";

const initialValues: Record<FieldKey, string> = {
  cash: "",
  gold_grams: "",
  silver_grams: "",
  stocks: "",
  business_goods: "",
  other_investments: "",
  liabilities: "",
};

export default function ZakatCalculatorScreen() {
  const [values, setValues] = useState(initialValues);
  const [currency, setCurrency] = useState("EGP");
  const [nisabStandard, setNisabStandard] = useState<NisabStandard>("gold");
  const [goldKarat, setGoldKarat] = useState<18 | 21 | 22 | 24>(21);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ZakatCalculationResult | null>(null);

  const updateField = (key: FieldKey, value: string) => {
    setValues((previous) => ({
      ...previous,
      [key]: value,
    }));
    setResult(null);
  };

  const handleCalculate = async () => {
    const input: ZakatCalculateInput = {
      currency,
      nisab_standard: nisabStandard,
    };

    for (const field of fields) {
      const rawValue = values[field.key].trim();

      if (!rawValue) continue;

      if (rawValue.includes(",")) {
        Alert.alert("Invalid format", "Please enter numbers without commas.");
        return;
      }

      const parsedValue = Number(rawValue);

      if (!Number.isFinite(parsedValue) || parsedValue < 0) {
        Alert.alert(
          "Invalid amount",
          `Please enter a valid non-negative number for ${field.label}.`,
        );
        return;
      }

      input[field.key] = parsedValue;
    }

    if (values.gold_grams.trim()) {
      const goldWeight = Number(values.gold_grams);

      input.gold_grams = goldWeight * (goldKarat / 24);
    }

    setLoading(true);
    setResult(null);

    try {
      const calculation = await calculateZakat(input);
      setResult(calculation);
    } catch (error) {
      console.error("Zakat calculation error:", error);

      Alert.alert(
        "Calculation failed",
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-[#FAF9F5]`}>
      <ScrollView
        contentContainerStyle={tw`px-6 pt-12 pb-12`}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => router.back()}
          style={tw`flex-row items-center mb-7`}
        >
          <Text style={tw`text-lg text-[#174C3C] mr-2`}>←</Text>
          <Text style={tw`text-sm font-semibold text-[#174C3C]`}>Back</Text>
        </Pressable>

        <Text
          style={tw`text-[10px] font-bold uppercase tracking-[2px] text-[#A77A35] mb-2`}
        >
          Personal calculation
        </Text>

        <Text style={tw`font-display text-3xl text-[#174C3C]`}>
          Zakat Calculator
        </Text>

        <Text style={tw`text-sm leading-6 text-[#777D72] mt-2 mb-7`}>
          Enter your zakatable wealth and liabilities to calculate your zakat.
        </Text>

        <Text style={tw`text-sm font-bold text-[#174C3C] mb-3`}>Currency</Text>

        <View style={tw`flex-row gap-3 mb-7`}>
          {["EGP", "USD"].map((item) => (
            <Pressable
              key={item}
              onPress={() => {
                setCurrency(item);
                setResult(null);
              }}
              style={[
                tw`flex-1 py-3 rounded-xl items-center border`,
                currency === item
                  ? tw`bg-[#174C3C] border-[#174C3C]`
                  : tw`bg-white border-[#E9E6DC]`,
              ]}
            >
              <Text
                style={[
                  tw`text-sm font-bold`,
                  currency === item ? tw`text-white` : tw`text-[#174C3C]`,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={tw`mb-5`}>
          <Text style={tw`text-sm font-bold text-[#174C3C] mb-3`}>
            Gold Karat
          </Text>

          <View style={tw`flex-row gap-2`}>
            {([18, 21, 22, 24] as const).map((karat) => (
              <Pressable
                key={karat}
                onPress={() => {
                  setGoldKarat(karat);
                  setResult(null);
                }}
                style={[
                  tw`flex-1 py-3 rounded-xl items-center border`,
                  goldKarat === karat
                    ? tw`bg-[#174C3C] border-[#174C3C]`
                    : tw`bg-white border-[#E9E6DC]`,
                ]}
              >
                <Text
                  style={[
                    tw`text-sm font-bold`,
                    goldKarat === karat ? tw`text-white` : tw`text-[#174C3C]`,
                  ]}
                >
                  {karat}K
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={tw`text-[11px] leading-5 text-[#A77A35] mt-2`}>
            Gold weight will be converted to its 24K equivalent before
            calculation.
          </Text>
        </View>

        <Text style={tw`font-display text-xl text-[#174C3C] mb-5`}>
          Your Wealth
        </Text>

        {fields.slice(0, 6).map((field) => (
          <FormField
            {...field}
            currency={currency}
            value={values[field.key]}
            onChangeText={(value) => updateField(field.key, value)}
          />
        ))}

        <View style={tw`h-px bg-[#E9E6DC] my-5`} />

        <Text style={tw`font-display text-xl text-[#174C3C] mb-2`}>
          Liabilities
        </Text>

        <FormField
          {...fields[6]}
          currency={currency}
          value={values.liabilities}
          onChangeText={(value) => updateField("liabilities", value)}
        />

        <View style={tw`mb-7`}>
          <Text style={tw`font-display text-xl text-[#174C3C] mb-2`}>
            Nisab Standard
          </Text>

          <Text style={tw`text-xs leading-5 text-[#85897F] mb-3`}>
            Choose the standard used to determine the nisab threshold.
          </Text>

          <View style={tw`flex-row gap-3`}>
            {(["gold", "silver"] as const).map((standard) => (
              <Pressable
                key={standard}
                onPress={() => {
                  setNisabStandard(standard);
                  setResult(null);
                }}
                style={[
                  tw`flex-1 rounded-xl py-3 items-center border`,
                  nisabStandard === standard
                    ? tw`bg-[#174C3C] border-[#174C3C]`
                    : tw`bg-white border-[#E9E6DC]`,
                ]}
              >
                <Text
                  style={[
                    tw`text-sm font-bold capitalize`,
                    nisabStandard === standard
                      ? tw`text-white`
                      : tw`text-[#174C3C]`,
                  ]}
                >
                  {standard}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable
          disabled={loading}
          onPress={() => void handleCalculate()}
          style={({ pressed }) => [
            tw`bg-[#174C3C] rounded-2xl py-4 items-center mb-7`,
            pressed && { opacity: 0.85 },
            loading && { opacity: 0.7 },
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={tw`text-white font-bold text-base`}>
              Calculate Zakat
            </Text>
          )}
        </Pressable>

        {result && (
          <View style={tw`bg-white rounded-[24px] p-5 border border-[#E9E6DC]`}>
            <Text
              style={tw`text-[10px] font-bold uppercase tracking-[2px] text-[#A77A35] mb-3`}
            >
              Calculation Result
            </Text>

            <Text style={tw`text-xs text-[#85897F]`}>Zakat Due (2.5%)</Text>

            <Text style={tw`font-display text-3xl text-[#174C3C] mt-2`}>
              {formatMoney(result.zakat_due, currency)}
            </Text>

            <View style={tw`mt-4 bg-[#F0F4ED] rounded-xl p-3`}>
              <Text style={tw`text-sm font-bold text-[#174C3C]`}>
                {result.above_nisab
                  ? "Your wealth is above Nisab"
                  : "Your wealth is below Nisab"}
              </Text>

              <Text style={tw`text-xs leading-5 text-[#6B7867] mt-1`}>
                {result.note}
              </Text>
            </View>

            <View style={tw`h-px bg-[#E9E6DC] my-5`} />

            <Text style={tw`font-display text-xl text-[#174C3C] mb-4`}>
              Breakdown
            </Text>

            {[
              ["Cash", result.breakdown.cash],
              ["Gold value", result.breakdown.gold_value],
              ["Silver value", result.breakdown.silver_value],
              ["Stocks", result.breakdown.stocks],
              ["Business goods", result.breakdown.business_goods],
              ["Other investments", result.breakdown.other_investments],
              ["Gross wealth", result.breakdown.gross_wealth],
              ["Liabilities", result.breakdown.liabilities],
              ["Net zakatable wealth", result.breakdown.net_zakatable_wealth],
            ].map(([label, amount]) => (
              <View
                key={String(label)}
                style={tw`flex-row justify-between mb-3`}
              >
                <Text style={tw`text-xs text-[#777D72] flex-1 mr-2`}>
                  {label}
                </Text>

                <Text style={tw`text-xs font-semibold text-[#174C3C]`}>
                  {formatMoney(Number(amount), currency)}
                </Text>
              </View>
            ))}

            <View style={tw`h-px bg-[#E9E6DC] my-4`} />

            <Text style={tw`text-sm font-bold text-[#174C3C] mb-2`}>
              Prices Used
            </Text>

            <Text style={tw`text-xs text-[#777D72] leading-6`}>
              Gold:{" "}
              {formatMoney(result.prices_used.gold_price_per_gram, currency)} /
              gram
              {"\n"}
              Silver:{" "}
              {formatMoney(
                result.prices_used.silver_price_per_gram,
                currency,
              )}{" "}
              / gram
              {"\n"}
              Updated: {formatDate(result.prices_used.as_of)}
            </Text>

            {result.prices_used.is_fallback && (
              <Text style={tw`text-xs text-[#A77A35] mt-3`}>
                Warning: fallback prices were used.
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
