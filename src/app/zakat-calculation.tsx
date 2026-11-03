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
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
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

const breakdownKeys = [
  "cash",
  "goldValue",
  "silverValue",
  "stocks",
  "businessGoods",
  "otherInvestments",
  "grossWealth",
  "liabilities",
  "netZakatableWealth",
] as const;

export default function ZakatCalculatorScreen() {
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language.startsWith("ar");

  const [values, setValues] = useState(initialValues);
  const [currency, setCurrency] = useState("EGP");
  const [nisabStandard, setNisabStandard] = useState<NisabStandard>("gold");
  const [goldKarat, setGoldKarat] = useState<18 | 21 | 22 | 24>(21);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ZakatCalculationResult | null>(null);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const previousLanguage = useRef(i18n.language);

  useEffect(() => {
    if (previousLanguage.current === i18n.language) return;

    previousLanguage.current = i18n.language;

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, [i18n.language, fadeAnim]);

  const textDirection = {
    textAlign: isArabic ? ("right" as const) : ("left" as const),
    writingDirection: isArabic ? ("rtl" as const) : ("ltr" as const),
  };

  const rowDirection = isArabic ? "flex-row-reverse" : "flex-row";

  const updateField = (key: FieldKey, value: string) => {
    setValues((previous) => ({
      ...previous,
      [key]: value,
    }));
    setResult(null);
  };

  const getFieldTranslation = (
    key: FieldKey,
    property: "label" | "hint" | "placeholder",
  ) => {
    return t(`calculator.fields.${key}.${property}`);
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
        Alert.alert(
          t("calculator.errors.invalidFormat"),
          t("calculator.errors.invalidFormatDescription"),
        );
        return;
      }

      const parsedValue = Number(rawValue);

      if (!Number.isFinite(parsedValue) || parsedValue < 0) {
        Alert.alert(
          t("calculator.errors.invalidAmount"),
          t("calculator.errors.invalidAmountDescription", {
            field: getFieldTranslation(field.key, "label"),
          }),
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
        t("calculator.errors.calculationFailed"),
        error instanceof Error
          ? error.message
          : t("calculator.errors.genericError"),
      );
    } finally {
      setLoading(false);
    }
  };

  const translatedNote = result
    ? t(
        result.above_nisab
          ? "calculatorContent.resultNote.aboveNisab"
          : "calculatorContent.resultNote.belowNisab",
        {
          value: formatMoney(result.nisab_value, currency),
        },
      )
    : "";

  const breakdownItems = result
    ? [
        result.breakdown.cash,
        result.breakdown.gold_value,
        result.breakdown.silver_value,
        result.breakdown.stocks,
        result.breakdown.business_goods,
        result.breakdown.other_investments,
        result.breakdown.gross_wealth,
        result.breakdown.liabilities,
        result.breakdown.net_zakatable_wealth,
      ]
    : [];

  const { key: liabilitiesKey, ...liabilitiesFieldProps } = fields[6];

  return (
    <View style={tw`flex-1 bg-[#FAF9F5]`}>
      <ScrollView
        contentContainerStyle={tw`px-6 pt-8 pb-12`}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <Pressable
            onPress={() => router.replace("/home")}
            style={tw`${rowDirection} items-center mb-9`}
          >
            <Text
              style={[
                tw`text-base text-[#174C3C]`,
                isArabic ? tw`ml-2` : tw`mr-2`,
              ]}
            >
              {isArabic ? "→" : "←"}
            </Text>

            <Text
              style={[tw`text-sm font-semibold text-[#174C3C]`, textDirection]}
            >
              {t("calculator.back")}
            </Text>
          </Pressable>

          <View style={tw`${rowDirection} items-center mb-4`}>
            <View
              style={[
                tw`w-1.5 h-1.5 rounded-full bg-[#C59A55]`,
                isArabic ? tw`ml-2` : tw`mr-2`,
              ]}
            />

            <Text
              style={[
                tw`text-[11px] font-bold uppercase tracking-widest text-[#C59A55]`,
                textDirection,
              ]}
            >
              {t("calculator.eyebrow")}
            </Text>
          </View>

          <Text style={[tw`text-3xl font-bold text-[#174C3C]`, textDirection]}>
            {t("calculator.title")}
          </Text>

          <Text
            style={[
              tw`text-sm leading-6 text-[#777D72] mt-3 mb-8`,
              textDirection,
            ]}
          >
            {t("calculator.subtitle")}
          </Text>

          <View style={tw`${rowDirection} items-center mb-4`}>
            <Text
              style={[
                tw`text-xs font-bold uppercase tracking-widest text-[#C59A55]`,
                isArabic ? tw`ml-3` : tw`mr-3`,
              ]}
            >
              01
            </Text>

            <Text
              style={[tw`text-base font-bold text-[#174C3C]`, textDirection]}
            >
              {t("calculator.sections.currency")}
            </Text>
          </View>

          <View
            style={tw`bg-white rounded-3xl p-5 border border-[#EAE8DF] mb-5`}
          >
            <View style={tw`flex-row bg-[#F7F5EF] rounded-xl p-1`}>
              {["EGP", "USD"].map((item) => (
                <Pressable
                  key={item}
                  onPress={() => {
                    setCurrency(item);
                    setResult(null);
                  }}
                  style={[
                    tw`flex-1 py-3 rounded-lg items-center`,
                    currency === item && tw`bg-[#174C3C]`,
                  ]}
                >
                  <Text
                    style={[
                      tw`text-sm font-bold`,
                      {
                        color: currency === item ? "#FFFFFF" : "#85897F",
                      },
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={tw`${rowDirection} items-center mb-4`}>
            <Text
              style={[
                tw`text-xs font-bold uppercase tracking-widest text-[#C59A55]`,
                isArabic ? tw`ml-3` : tw`mr-3`,
              ]}
            >
              02
            </Text>

            <Text
              style={[tw`text-base font-bold text-[#174C3C]`, textDirection]}
            >
              {t("calculator.sections.goldKarat")}
            </Text>
          </View>

          <View
            style={tw`bg-white rounded-3xl p-5 border border-[#EAE8DF] mb-5`}
          >
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
                      : tw`bg-[#FAF9F5] border-[#E9E6DC]`,
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

            <View style={tw`${rowDirection} mt-4`}>
              <View
                style={[
                  tw`w-1 rounded-full bg-[#C59A55]`,
                  isArabic ? tw`ml-3` : tw`mr-3`,
                ]}
              />

              <Text
                style={[
                  tw`flex-1 text-xs leading-5 text-[#85897F]`,
                  textDirection,
                ]}
              >
                {t("calculator.goldNote")}
              </Text>
            </View>
          </View>

          <View style={tw`${rowDirection} items-center mb-4`}>
            <Text
              style={[
                tw`text-xs font-bold uppercase tracking-widest text-[#C59A55]`,
                isArabic ? tw`ml-3` : tw`mr-3`,
              ]}
            >
              03
            </Text>

            <Text style={[tw`text-xl font-bold text-[#174C3C]`, textDirection]}>
              {t("calculator.sections.wealth")}
            </Text>
          </View>

          <View style={tw`mb-5`}>
            <View style={tw`bg-white rounded-3xl p-5 border border-[#EAE8DF]`}>
              {fields.slice(0, 6).map((field) => {
                const { key, ...fieldProps } = field;

                return (
                  <FormField
                    key={key}
                    {...fieldProps}
                    label={getFieldTranslation(key, "label")}
                    hint={getFieldTranslation(key, "hint")}
                    placeholder={getFieldTranslation(key, "placeholder")}
                    currency={currency}
                    value={values[key]}
                    onChangeText={(value) => updateField(key, value)}
                    isArabic={isArabic}
                  />
                );
              })}
            </View>
          </View>

          <View style={tw`mb-5`}>
            <View style={tw`${rowDirection} items-center mb-4`}>
              <Text
                style={[
                  tw`text-xs font-bold uppercase tracking-widest text-[#C59A55]`,
                  isArabic ? tw`ml-3` : tw`mr-3`,
                ]}
              >
                04
              </Text>

              <Text
                style={[tw`text-xl font-bold text-[#174C3C]`, textDirection]}
              >
                {t("calculator.sections.liabilities")}
              </Text>
            </View>

            <View style={tw`bg-white rounded-3xl p-5 border border-[#EAE8DF]`}>
              <FormField
                {...liabilitiesFieldProps}
                label={getFieldTranslation("liabilities", "label")}
                hint={getFieldTranslation("liabilities", "hint")}
                placeholder={getFieldTranslation("liabilities", "placeholder")}
                currency={currency}
                value={values.liabilities}
                onChangeText={(value) => updateField("liabilities", value)}
                isArabic={isArabic}
              />
            </View>
          </View>

          <View style={tw`${rowDirection} items-center mb-2`}>
            <Text
              style={[
                tw`text-xs font-bold uppercase tracking-widest text-[#C59A55]`,
                isArabic ? tw`ml-3` : tw`mr-3`,
              ]}
            >
              05
            </Text>

            <Text style={[tw`text-xl font-bold text-[#174C3C]`, textDirection]}>
              {t("calculator.sections.nisab")}
            </Text>
          </View>

          <View
            style={tw`bg-white rounded-3xl p-5 border border-[#EAE8DF] mb-7`}
          >
            <Text
              style={[tw`text-xs leading-5 text-[#85897F] mb-5`, textDirection]}
            >
              {t("calculator.nisabDescription")}
            </Text>

            <View style={tw`flex-row gap-3`}>
              {(["gold", "silver"] as const).map((standard) => {
                const selected = nisabStandard === standard;

                return (
                  <Pressable
                    key={standard}
                    onPress={() => {
                      setNisabStandard(standard);
                      setResult(null);
                    }}
                    style={[
                      tw`flex-1 rounded-xl py-3.5 items-center border`,
                      selected
                        ? tw`bg-[#174C3C] border-[#174C3C]`
                        : tw`bg-[#FAF9F5] border-[#E9E6DC]`,
                    ]}
                  >
                    <Text
                      style={[
                        tw`text-sm font-bold capitalize`,
                        {
                          color: selected ? "#FFFFFF" : "#174C3C",
                        },
                      ]}
                    >
                      {t(`calculator.nisabOptions.${standard}`)}
                    </Text>
                  </Pressable>
                );
              })}
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
              <View style={tw`flex-row items-center gap-2`}>
                <ActivityIndicator color="#FFFFFF" />
                <Text style={tw`text-white font-semibold`}>
                  {t("calculator.calculating")}
                </Text>
              </View>
            ) : (
              <Text style={tw`text-white font-bold text-base`}>
                {t("calculator.calculate")} →
              </Text>
            )}
          </Pressable>

          {result && (
            <View style={tw`bg-white rounded-3xl p-5 border border-[#EAE8DF]`}>
              <View style={tw`${rowDirection} items-center mb-5`}>
                <View
                  style={[
                    tw`w-1.5 h-1.5 rounded-full bg-[#C59A55]`,
                    isArabic ? tw`ml-2` : tw`mr-2`,
                  ]}
                />

                <Text
                  style={[
                    tw`text-[11px] font-bold uppercase tracking-widest text-[#C59A55]`,
                    textDirection,
                  ]}
                >
                  {t("calculator.result.eyebrow")}
                </Text>
              </View>

              <Text style={[tw`text-sm text-[#85897F]`, textDirection]}>
                {t("calculator.result.zakatDue")}
              </Text>

              <Text
                style={[
                  tw`text-3xl font-bold text-[#174C3C] mt-2`,
                  {
                    writingDirection: "ltr",
                    textAlign: isArabic ? "right" : "left",
                  },
                ]}
              >
                {formatMoney(result.zakat_due, currency)}
              </Text>

              <View
                style={[
                  tw`rounded-2xl p-4 mt-5`,
                  result.above_nisab ? tw`bg-[#E8EEE5]` : tw`bg-[#F4E9D3]`,
                ]}
              >
                <Text
                  style={[tw`text-sm font-bold text-[#174C3C]`, textDirection]}
                >
                  {t(
                    result.above_nisab
                      ? "calculator.result.aboveNisab"
                      : "calculator.result.belowNisab",
                  )}
                </Text>

                <Text
                  style={[
                    tw`text-xs leading-5 text-[#52744D] mt-2`,
                    textDirection,
                  ]}
                >
                  {translatedNote}
                </Text>
              </View>

              <View style={tw`h-px bg-[#EAE8DF] my-6`} />

              <Text
                style={[
                  tw`text-lg font-bold text-[#174C3C] mb-5`,
                  textDirection,
                ]}
              >
                {t("calculator.result.breakdown")}
              </Text>

              {breakdownKeys.map((key, index) => (
                <View
                  key={key}
                  style={tw`${rowDirection} justify-between items-center py-3 border-b border-[#F0EEE7]`}
                >
                  <Text
                    style={[
                      tw`text-xs flex-1`,
                      isArabic ? tw`ml-3` : tw`mr-3`,
                      {
                        textAlign: isArabic ? "right" : "left",
                        color: index === 8 ? "#174C3C" : "#777D72",
                        fontWeight: index === 8 ? "700" : "400",
                      },
                    ]}
                  >
                    {t(`calculator.result.breakdownItems.${key}`)}
                  </Text>

                  <Text
                    style={[
                      tw`text-xs`,
                      {
                        color: "#174C3C",
                        fontWeight: index === 8 ? "700" : "600",
                        writingDirection: "ltr",
                      },
                    ]}
                  >
                    {formatMoney(Number(breakdownItems[index]), currency)}
                  </Text>
                </View>
              ))}

              <View style={tw`mt-6`}>
                <Text
                  style={[
                    tw`text-base font-bold text-[#174C3C] mb-3`,
                    textDirection,
                  ]}
                >
                  {t("calculator.result.pricesUsed")}
                </Text>

                <View style={tw`bg-[#FAF9F5] rounded-2xl p-4`}>
                  <Text
                    style={[
                      tw`text-xs leading-6 text-[#777D72]`,
                      textDirection,
                    ]}
                  >
                    {t("calculator.result.gold")}:{" "}
                    {formatMoney(
                      result.prices_used.gold_price_per_gram,
                      currency,
                    )}{" "}
                    / {t("calculator.result.perGram")}
                    {"\n"}
                    {t("calculator.result.silver")}:{" "}
                    {formatMoney(
                      result.prices_used.silver_price_per_gram,
                      currency,
                    )}{" "}
                    / {t("calculator.result.perGram")}
                    {"\n"}
                    {t("calculator.result.updated")}:{" "}
                    {formatDate(result.prices_used.as_of, i18n.language)}
                  </Text>

                  {result.prices_used.is_fallback && (
                    <View style={tw`mt-3 bg-[#F4E9D3] rounded-xl p-3`}>
                      <Text
                        style={[
                          tw`text-xs font-semibold text-[#8C682F]`,
                          textDirection,
                        ]}
                      >
                        {t("calculator.result.fallbackWarning")}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}

          <Text style={tw`text-xs text-center text-[#85897F] mt-8`}>
            {t("calculator.result.footer")}
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
