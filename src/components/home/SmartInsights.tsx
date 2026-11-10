
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
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
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language.startsWith("ar");

  const textAlign = isRTL ? "right" : "left";
  const writingDirection = isRTL ? "rtl" : "ltr";

  const [moneyAmount, setMoneyAmount] = useState("");
  const [goldGrams, setGoldGrams] = useState("");
  const [goldPrice, setGoldPrice] = useState(0);
  const [loadingPrice, setLoadingPrice] = useState(true);
  const [nisabValue, setNisabValue] = useState(0);
  const [goldPurity, setGoldPurity] = useState<18 | 21 | 22 | 24>(24);

  useEffect(() => {
    let isMounted = true;

    async function loadGoldPrice() {
      setLoadingPrice(true);

      try {
        const prices = await getZakatPrices(currency);

        if (!isMounted) return;

        setGoldPrice(Number(prices.gold_price_per_gram) || 0);
        setNisabValue(Number(prices.nisab_gold_value) || 0);
      } catch (error) {
        console.error("Failed to load gold price:", error);
      } finally {
        if (isMounted) {
          setLoadingPrice(false);
        }
      }
    }

    loadGoldPrice();

    return () => {
      isMounted = false;
    };
  }, [currency]);

  const calculations = useMemo(() => {
    const money = Math.max(0, Number(moneyAmount) || 0);
    const grams = Math.max(0, Number(goldGrams) || 0);

    const gold24KGrams = grams * (goldPurity / 24);
    const goldValue = gold24KGrams * goldPrice;

    const totalAssets = money + goldValue;

    const moneyPercentage =
      totalAssets > 0 ? (money / totalAssets) * 100 : 0;

    const goldPercentage =
      totalAssets > 0 ? (goldValue / totalAssets) * 100 : 0;

    const eligibleForZakat =
      nisabValue > 0 && totalAssets >= nisabValue;

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
    new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
      useGrouping:true
    }).format(value);

  const hasAssets = calculations.totalAssets > 0;

 const inputStyle = [
  tw`rounded-xl px-3 py-3`,
  {
    backgroundColor: colors.input,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    textAlign: "left" as const,
    writingDirection: "ltr" as const,
    fontVariant: ["tabular-nums"] as const,
  },
];

  const labelStyle = [
    tw`text-xs mb-2`,
    {
      color: colors.text,
      textAlign,
    },
  ];

  return (
    <>
      <Text
        style={[
          tw`text-xs font-bold mb-3`,
          {
            color: colors.accent,
            textAlign,
          },
        ]}
      >
        {t("smartInsights.sectionTitle")}
      </Text>

      <View
        style={[
          tw`rounded-3xl p-5 mb-6 border`,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: 1,
          },
        ]}
      >
        <View
          style={[
            tw`flex-row items-center justify-between mb-1`,
            isRTL && tw`flex-row-reverse`,
          ]}
        >
          <Text
            style={[
              tw`text-lg font-bold`,
              {
                color: colors.primary,
                textAlign,
              },
            ]}
          >
            {t("smartInsights.title")}
          </Text>
        </View>

        <Text
          style={[
            tw`text-sm mb-4`,
            {
              color: colors.secondaryText,
              textAlign,
              writingDirection,
            },
          ]}
        >
          {t("smartInsights.description")}
        </Text>

        <View
          style={[
            tw`flex-row gap-3`,
            isRTL && tw`flex-row-reverse`,
          ]}
        >
          <View style={tw`flex-1`}>
            <Text style={labelStyle}>
              {t("smartInsights.money")} ({currency})
            </Text>

            <TextInput
              value={moneyAmount}
              onChangeText={setMoneyAmount}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={colors.muted}
              style={inputStyle}
            />
          </View>

          <View style={tw`flex-1`}>
            <Text style={labelStyle}>
              {t("smartInsights.gold")} ({t("smartInsights.grams")})
            </Text>

            <TextInput
              value={goldGrams}
              onChangeText={setGoldGrams}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={colors.muted}
              style={inputStyle}
            />
          </View>
        </View>

        <Text
          style={[
            tw`text-xs my-3`,
            {
              color: colors.text,
              textAlign,
            },
          ]}
        >
          {t("smartInsights.goldPurity")}
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
                    goldPurity === purity
                      ? colors.primary
                      : colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={{
                  color:
                    goldPurity === purity ? "#FFFFFF" : colors.text,
                  fontWeight: "600",
                }}
              >
                {purity}K
              </Text>
            </Pressable>
          ))}
        </View>

        <View
          style={[
            tw`flex-row justify-between items-center mt-3`,
            isRTL && tw`flex-row-reverse`,
          ]}
        >
          <Text
            style={[
              tw`text-xs`,
              {
                color: colors.secondaryText,
                textAlign,
              },
            ]}
          >
            {t("smartInsights.currentGoldPrice")}
          </Text>

          {loadingPrice ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text
              style={[
                tw`text-xs font-semibold`,
                {
                  color: colors.text,
                },
              ]}
            >
              {formatMoney(goldPrice)} {currency}
              {t("smartInsights.goldPriceUnit")}
            </Text>
          )}
        </View>

        {hasAssets && (
          <View
            style={[
              tw`rounded-2xl p-3 mt-4`,
              {
                backgroundColor: colors.surface,
              },
            ]}
          >
            <View
              style={[
                tw`flex-row items-center`,
                isRTL && tw`flex-row-reverse`,
              ]}
            >
              <View style={tw`flex-1`}>
                <Text
                  style={[
                    tw`text-xs mb-1`,
                    {
                      color: colors.secondaryText,
                      textAlign,
                    },
                  ]}
                >
                  {t("smartInsights.estimatedZakat")}
                </Text>

                <Text
                  style={[
                    tw`text-xl font-bold`,
                    {
                      color: colors.primary,
                      textAlign,
                    },
                  ]}
                >
                  {formatMoney(calculations.estimatedZakat)} {currency}
                </Text>

                <Text
                  style={[
                    tw`text-xs mt-1`,
                    {
                      color: colors.secondaryText,
                      textAlign,
                    },
                  ]}
                >
                  {t("smartInsights.totalAssets")}:{" "}
                  {formatMoney(calculations.totalAssets)} {currency}
                </Text>
              </View>

              <DonutChart
                moneyPercentage={calculations.moneyPercentage}
                goldPercentage={calculations.goldPercentage}
                size={80}
                strokeWidth={12}
              />
            </View>

            <View
              style={[
                tw`flex-row gap-4 mt-3`,
                isRTL && tw`flex-row-reverse`,
              ]}
            >
              <Text style={[tw`text-xs`, { color: colors.text }]}>
                ● {t("smartInsights.money")}{" "}
                {calculations.moneyPercentage.toFixed(0)}%
              </Text>

              <Text style={[tw`text-xs`, { color: colors.text }]}>
                ● {t("smartInsights.gold")}{" "}
                {calculations.goldPercentage.toFixed(0)}%
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
                      textAlign,
                    },
                  ]}
                >
                  {calculations.eligibleForZakat
                    ? t("smartInsights.nisabReached")
                    : t("smartInsights.belowNisab")}
                </Text>

                <Text
                  style={[
                    tw`text-xs mt-1`,
                    {
                      color: colors.secondaryText,
                      textAlign,
                    },
                  ]}
                >
                  {t("smartInsights.nisabValue")}:{" "}
                  {formatMoney(nisabValue)} {currency}
                </Text>

                <Text
                  style={[
                    tw`text-xs mt-1`,
                    {
                      color: colors.secondaryText,
                      textAlign,
                    },
                  ]}
                >
                  {t("smartInsights.goldEquivalent")}:{" "}
                  {calculations.gold24KGrams.toFixed(2)}g (24K)
                </Text>
              </View>
            )}
          </View>
        )}

        <Pressable
          onPress={() => router.push("/zakat-calculation")}
          style={[
            tw`rounded-xl py-3 mt-4 flex-row items-center justify-center`,
            {
              backgroundColor: colors.primary,
            },
          ]}
        >
          <Text style={tw`text-white font-semibold`}>
            {t("smartInsights.calculateDetails")}
            {isRTL ? " ←" : " →"}
          </Text>
        </Pressable>

        <Text
          style={[
            tw`text-xs mt-3`,
            {
              color: colors.secondaryText,
              textAlign,
              writingDirection,
            },
          ]}
        >
          {t("smartInsights.disclaimer")}
        </Text>
      </View>
    </>
  );
}
