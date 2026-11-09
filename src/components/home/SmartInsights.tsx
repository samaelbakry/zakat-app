import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import tw from "twrnc";

import { useTheme } from "@/context/ThemeContext";
import { getZakatPrices } from "@/services/zakat";
import DonutChart from "./DonutChart";

type SmartInsightsProps = {
  currency?: "EGP" | "USD";
};

export default function SmartInsights({
  currency = "EGP",
}: SmartInsightsProps) {
  const { colors } = useTheme();

  const [moneyAmount, setMoneyAmount] = useState("");
  const [goldGrams, setGoldGrams] = useState("");
  const [goldPrice, setGoldPrice] = useState(0);
  const [loadingPrice, setLoadingPrice] = useState(true);
  const [nisabValue, setNisabValue] = useState(0);
  const [goldPurity, setGoldPurity] = useState<18 | 21 | 22 | 24>(24);

  useEffect(() => {
    async function loadGoldPrice() {
      try {
        const prices = await getZakatPrices(currency);
        setGoldPrice(Number(prices.gold_price_per_gram) || 0);
        setNisabValue(Number(prices.nisab_gold_value) || 0);
      } catch (error) {
        console.error("Failed to load gold price:", error);
      } finally {
        setLoadingPrice(false);
      }
    }

    loadGoldPrice();
  }, [currency]);

  const calculations = useMemo(() => {
    const money = Math.max(0, Number(moneyAmount) || 0);
    const grams = Math.max(0, Number(goldGrams) || 0);

    const gold24KGrams = grams * (goldPurity / 24);

    const goldValue = gold24KGrams * goldPrice;

    const totalAssets = money + goldValue;

    const moneyPercentage = totalAssets > 0 ? (money / totalAssets) * 100 : 0;

    const goldPercentage =
      totalAssets > 0 ? (goldValue / totalAssets) * 100 : 0;

    const eligibleForZakat = nisabValue > 0 && totalAssets >= nisabValue;

    return {
      gold24KGrams,
      goldValue,
      totalAssets,
      moneyPercentage,
      goldPercentage,
      eligibleForZakat,
      estimatedZakat: eligibleForZakat ? totalAssets * 0.025 : 0,
    };
  }, [moneyAmount, goldGrams, goldPurity, goldPrice, nisabValue]);

  const formatMoney = (value: number) =>
    new Intl.NumberFormat("en", {
      maximumFractionDigits: 2,
    }).format(value);

  const hasAssets = calculations.totalAssets > 0;

  return (
    <>
      <Text style={[tw`text-xs font-bold mb-3`, { color: colors.accent }]}>
        Quick calculation
      </Text>
      <View
        style={[
          tw`rounded-3xl p-5 mb-6 border`,
          { backgroundColor: colors.card, borderColor: colors.border , borderWidth: 1},
        ]}
      >
        <View style={tw`flex-row items-center justify-between mb-1`}>
          <Text style={[tw`text-lg font-bold`, { color: colors.primary }]}>
            Quick Zakat Estimate
          </Text>
        </View>

        <Text style={[tw`text-sm mb-4`, { color: colors.secondaryText }]}>
          Get a quick estimate of your zakat.
        </Text>

        <View style={tw`flex-row gap-3`}>
          <View style={tw`flex-1`}>
            <Text style={[tw`text-xs mb-2`, { color: colors.text }]}>
              Money ({currency})
            </Text>

            <TextInput
              value={moneyAmount}
              onChangeText={setMoneyAmount}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={colors.muted}
              style={[
                tw`rounded-xl px-3 py-3`,
                {
                  backgroundColor: colors.input,
                  color: colors.text,
                  borderWidth: 1,
                  borderColor: colors.border,
                },
              ]}
            />
          </View>

          <View style={tw`flex-1`}>
            <Text style={[tw`text-xs mb-2`, { color: colors.text }]}>
              Gold (grams)
            </Text>

            <TextInput
              value={goldGrams}
              onChangeText={setGoldGrams}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={colors.muted}
              style={[
                tw`rounded-xl px-3 py-3`,
                {
                  backgroundColor: colors.input,
                  color: colors.text,
                  borderWidth: 1,
                  borderColor: colors.border,
                },
              ]}
            />
          </View>
        </View>
        <Text style={[tw`text-xs my-3`, { color: colors.text }]}>
          Gold purity
        </Text>

        <View style={tw`flex-row gap-2 mb-4`}>
          {([18, 21, 22, 24] as const).map((purity) => (
            <Pressable
              key={purity}
              onPress={() => setGoldPurity(purity)}
              style={[
                tw`flex-1 py-2 rounded-lg items-center`,
                {
                  backgroundColor:
                    goldPurity === purity ? colors.primary : colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={{
                  color: goldPurity === purity ? "#FFFFFF" : colors.text,
                  fontWeight: "600",
                }}
              >
                {purity}K
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={tw`flex-row justify-between items-center mt-3`}>
          <Text style={[tw`text-xs`, { color: colors.secondaryText }]}>
            Current gold price
          </Text>

          {loadingPrice ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={[tw`text-xs font-semibold`, { color: colors.text }]}>
              {formatMoney(goldPrice)} {currency}/g
            </Text>
          )}
        </View>

        {hasAssets && (
          <View
            style={[
              tw`rounded-2xl p-3 mt-4`,
              { backgroundColor: colors.surface },
            ]}
          >
            <View style={tw`flex-row items-center`}>
              <View style={tw`flex-1`}>
                <Text
                  style={[tw`text-xs mb-1`, { color: colors.secondaryText }]}
                >
                  Estimated Zakat
                </Text>

                <Text
                  style={[tw`text-xl font-bold`, { color: colors.primary }]}
                >
                  {formatMoney(calculations.estimatedZakat)} {currency}
                </Text>

                <Text
                  style={[tw`text-xs mt-1`, { color: colors.secondaryText }]}
                >
                  Total assets: {formatMoney(calculations.totalAssets)}{" "}
                  {currency}
                </Text>
              </View>

              <DonutChart
                moneyPercentage={calculations.moneyPercentage}
                goldPercentage={calculations.goldPercentage}
                size={80}
                strokeWidth={12}
              />
            </View>

            <View style={tw`flex-row gap-4 mt-3`}>
              <Text style={[tw`text-xs`, { color: colors.text }]}>
                ● Money {calculations.moneyPercentage.toFixed(0)}%
              </Text>

              <Text style={[tw`text-xs`, { color: colors.text }]}>
                ● Gold {calculations.goldPercentage.toFixed(0)}%
              </Text>
            </View>
            {!loadingPrice && nisabValue > 0 && (
              <View style={tw`mt-3`}>
                <Text
                  style={[
                    tw`text-sm font-semibold`,
                    {
                      color: calculations.eligibleForZakat
                        ? colors.primary
                        : colors.secondaryText,
                    },
                  ]}
                >
                  {calculations.eligibleForZakat
                    ? "Assets reached Nisab"
                    : "Below Nisab"}
                </Text>

                <Text
                  style={[tw`text-xs mt-1`, { color: colors.secondaryText }]}
                >
                  Nisab: {formatMoney(nisabValue)} {currency}
                </Text>
                <Text
                  style={[tw`text-xs mt-1`, { color: colors.secondaryText }]}
                >
                  Gold equivalent: {calculations.gold24KGrams.toFixed(2)}g (24K)
                </Text>
              </View>
            )}
          </View>
        )}

        <Pressable
          onPress={() => router.push("/zakat-calculation")}
          style={[
            tw`rounded-xl py-3 mt-4 flex-row items-center justify-center`,
            { backgroundColor: colors.primary },
          ]}
        >
          <Text style={tw`text-white font-semibold`}>
            Calculate Zakat in Detail →
          </Text>
        </Pressable>

        <Text style={[tw`text-xs mt-3`, { color: colors.secondaryText }]}>
          This is a quick estimate. Zakat eligibility depends on nisab and other
          conditions.
        </Text>
      </View>
    </>
  );
}
