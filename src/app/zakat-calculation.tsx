import FormField from "@/components/ui/FormField";
import { useTheme } from "@/context/ThemeContext";
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
import SectionHeader from "@/components/ui/SectionHeader";

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
  const { colors, isDarkMode } = useTheme();
  const isArabic = i18n.language.startsWith("ar");
  const rowDirection = isArabic ? "flex-row-reverse" : "flex-row";
  const textDirection = {
    textAlign: isArabic ? ("right" as const) : ("left" as const),
    writingDirection: isArabic ? ("rtl" as const) : ("ltr" as const),
  };

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
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  }, [i18n.language, fadeAnim]);

  const updateField = (key: FieldKey, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setResult(null);
  };

  const fieldText = (key: FieldKey, property: "label" | "hint" | "placeholder") =>
    t(`calculator.fields.${key}.${property}`);

  const handleCalculate = async () => {
    const input: ZakatCalculateInput = {
      currency,
      nisab_standard: nisabStandard,
    };

    for (const field of fields) {
      const raw = values[field.key].trim();
      if (!raw) continue;

      if (raw.includes(",")) {
        Alert.alert(
          t("calculator.errors.invalidFormat"),
          t("calculator.errors.invalidFormatDescription"),
        );
        return;
      }

      const amount = Number(raw);
      if (!Number.isFinite(amount) || amount < 0) {
        Alert.alert(
          t("calculator.errors.invalidAmount"),
          t("calculator.errors.invalidAmountDescription", {
            field: fieldText(field.key, "label"),
          }),
        );
        return;
      }

      input[field.key] = amount;
    }

    if (values.gold_grams.trim()) {
      input.gold_grams = Number(values.gold_grams) * (goldKarat / 24);
    }

    setLoading(true);
    setResult(null);

    try {
      setResult(await calculateZakat(input));
    } catch (err) {
      console.error("Zakat calculation error:", err);
      Alert.alert(
        t("calculator.errors.calculationFailed"),
        err instanceof Error ? err.message : t("calculator.errors.genericError"),
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
        { value: formatMoney(result.nisab_value, currency) },
      )
    : "";

  const { key: liabilitiesKey, ...liabilitiesProps } = fields[6];
  const cardStyle = [
    tw`rounded-3xl p-5 border mb-5`,
    { backgroundColor: colors.card, borderColor: colors.border },
  ];
  const secondaryText = [tw`text-xs leading-6`, { color: colors.secondaryText }, textDirection];
  const selectedStyle = tw`bg-[#174C3C] border-[#174C3C]`;
  const unselectedStyle = [
    { backgroundColor: colors.surface, borderColor: colors.border },
  ];

  return (
    <View style={[tw`flex-1`, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={tw`px-6 pt-8 pb-12`}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <Pressable
            onPress={() => router.replace("/home")}
            style={tw.style("flex-row items-center mb-8", rowDirection)}
          >
            <Text style={[tw`text-base`, { color: colors.primary }, isArabic ? tw`ml-2` : tw`mr-2`]}>
              {isArabic ? "→" : "←"}
            </Text>
            <Text style={[tw`text-sm font-semibold`, { color: colors.primary }, textDirection]}>
              {t("calculator.back")}
            </Text>
          </Pressable>

          <View style={tw.style("flex-row items-center mb-3", rowDirection)}>
            <View style={tw`w-1.5 h-1.5 rounded-full bg-[#C59A55] mr-2`} />
            <Text style={[tw`text-[11px] font-bold uppercase tracking-widest text-[#C59A55]`, textDirection]}>
              {t("calculator.eyebrow")}
            </Text>
          </View>

          <Text style={[tw`text-3xl font-bold`, { color: colors.primary }, textDirection]}>
            {t("calculator.title")}
          </Text>
          <Text style={[tw`text-sm leading-6 mt-3 mb-8`, { color: colors.secondaryText }, textDirection]}>
            {t("calculator.subtitle")}
          </Text>

          <SectionHeader number="01" label={t("calculator.sections.currency")} isArabic={isArabic} color={colors.primary} />
          <View style={cardStyle}>
            <View style={[tw`flex-row rounded-xl p-1`, { backgroundColor: colors.surface }]}>
              {["EGP", "USD"].map((item) => {
                const selected = currency === item;
                return (
                  <Pressable
                    key={item}
                    onPress={() => {
                      setCurrency(item);
                      setResult(null);
                    }}
                    style={[
                      tw`flex-1 py-3 rounded-lg items-center`,
                      selected && selectedStyle,
                    ]}
                  >
                    <Text style={[tw`text-sm font-bold`, { color: selected ? "#FFFFFF" : colors.secondaryText }]}>
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <SectionHeader number="02" label={t("calculator.sections.goldKarat")} isArabic={isArabic} color={colors.primary} />
          <View style={cardStyle}>
            <View style={tw`flex-row gap-2`}>
              {([18, 21, 22, 24] as const).map((karat) => {
                const selected = goldKarat === karat;
                return (
                  <Pressable
                    key={karat}
                    onPress={() => {
                      setGoldKarat(karat);
                      setResult(null);
                    }}
                    style={[
                      tw`flex-1 py-3 rounded-xl items-center border`,
                      selected ? selectedStyle : unselectedStyle,
                    ]}
                  >
                    <Text style={[tw`text-sm font-bold`, { color: selected ? "#FFFFFF" : colors.primary }]}>
                      {karat}K
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={tw.style("flex-row mt-4", rowDirection)}>
              <View style={[tw`w-1 rounded-full bg-[#C59A55]`, isArabic ? tw`ml-3` : tw`mr-3`]} />
              <Text style={[tw`flex-1 text-xs leading-5`, { color: colors.secondaryText }, textDirection]}>
                {t("calculator.goldNote")}
              </Text>
            </View>
          </View>

          <SectionHeader number="03" label={t("calculator.sections.wealth")} isArabic={isArabic} color={colors.primary} />
          <View style={cardStyle}>
            {fields.slice(0, 6).map(({ key, ...props }) => (
              <FormField
                key={key}
                {...props}
                label={fieldText(key, "label")}
                hint={fieldText(key, "hint")}
                placeholder={fieldText(key, "placeholder")}
                currency={currency}
                value={values[key]}
                onChangeText={(value) => updateField(key, value)}
                isArabic={isArabic}
              />
            ))}
          </View>

          <SectionHeader number="04" label={t("calculator.sections.liabilities")} isArabic={isArabic} color={colors.primary} />
          <View style={cardStyle}>
            <FormField
              {...liabilitiesProps}
              label={fieldText("liabilities", "label")}
              hint={fieldText("liabilities", "hint")}
              placeholder={fieldText("liabilities", "placeholder")}
              currency={currency}
              value={values.liabilities}
              onChangeText={(value) => updateField("liabilities", value)}
              isArabic={isArabic}
            />
          </View>

          <SectionHeader number="05" label={t("calculator.sections.nisab")} isArabic={isArabic} color={colors.primary} />
          <View style={cardStyle}>
            <Text style={[tw`text-xs leading-5 mb-5`, { color: colors.secondaryText }, textDirection]}>
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
                      selected ? selectedStyle : unselectedStyle,
                    ]}
                  >
                    <Text style={[tw`text-sm font-bold capitalize`, { color: selected ? "#FFFFFF" : colors.primary }]}>
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
                <Text style={tw`text-white font-semibold`}>{t("calculator.calculating")}</Text>
              </View>
            ) : (
              <Text style={tw`text-white font-bold text-base`}>{t("calculator.calculate")} →</Text>
            )}
          </Pressable>

          {result && (
            <View style={[tw`rounded-3xl p-5 border`, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={tw.style("flex-row items-center mb-5", rowDirection)}>
                <View style={tw`w-1.5 h-1.5 rounded-full bg-[#C59A55] mr-2`} />
                <Text style={[tw`text-[11px] font-bold uppercase tracking-widest text-[#C59A55]`, textDirection]}>
                  {t("calculator.result.eyebrow")}
                </Text>
              </View>

              <Text style={[tw`text-sm`, { color: colors.secondaryText }, textDirection]}>
                {t("calculator.result.zakatDue")}
              </Text>
              <Text style={[tw`text-3xl font-bold mt-2`, { color: colors.primary, writingDirection: "ltr" }, { textAlign: isArabic ? "right" : "left" }]}>
                {formatMoney(result.zakat_due, currency)}
              </Text>

              <View
                style={[
                  tw`rounded-2xl p-4 mt-5`,
                  { backgroundColor: result.above_nisab ? (isDarkMode ? "#263C30" : "#E8EEE5") : (isDarkMode ? "#3B3224" : "#F4E9D3") },
                ]}
              >
                <Text style={[tw`text-sm font-bold`, { color: result.above_nisab ? colors.primary : (isDarkMode ? "#D9BD83" : "#80602F") }, textDirection]}>
                  {t(result.above_nisab ? "calculator.result.aboveNisab" : "calculator.result.belowNisab")}
                </Text>
                <Text style={[tw`text-xs leading-5 mt-2`, { color: colors.secondaryText }, textDirection]}>
                  {translatedNote}
                </Text>
              </View>

              <View style={[tw`my-6 h-px`, { backgroundColor: colors.border }]} />
              <Text style={[tw`text-lg font-bold mb-5`, { color: colors.primary }, textDirection]}>
                {t("calculator.result.breakdown")}
              </Text>

              {breakdownKeys.map((key, index) => {
                const amount = [
                  result.breakdown.cash,
                  result.breakdown.gold_value,
                  result.breakdown.silver_value,
                  result.breakdown.stocks,
                  result.breakdown.business_goods,
                  result.breakdown.other_investments,
                  result.breakdown.gross_wealth,
                  result.breakdown.liabilities,
                  result.breakdown.net_zakatable_wealth,
                ][index];

                return (
                  <View
                    key={key}
                    style={tw.style("flex-row justify-between items-center py-3 border-b", rowDirection, {
                      borderBottomColor: colors.border,
                    })}
                  >
                    <Text
                      style={[
                        tw`text-xs flex-1`,
                        isArabic ? tw`ml-3` : tw`mr-3`,
                        { textAlign: isArabic ? "right" : "left", color: index === 8 ? colors.primary : colors.secondaryText, fontWeight: index === 8 ? "700" : "400" },
                      ]}
                    >
                      {t(`calculator.result.breakdownItems.${key}`)}
                    </Text>
                    <Text style={[tw`text-xs`, { color: colors.primary, fontWeight: index === 8 ? "700" : "600", writingDirection: "ltr" }]}>
                      {formatMoney(Number(amount), currency)}
                    </Text>
                  </View>
                );
              })}

              <View style={tw`mt-6`}>
                <Text style={[tw`text-base font-bold mb-3`, { color: colors.primary }, textDirection]}>
                  {t("calculator.result.pricesUsed")}
                </Text>
                <View style={[tw`rounded-2xl p-4`, { backgroundColor: colors.surface }]}>
                  <Text style={secondaryText}>
                    {t("calculator.result.gold")}: {formatMoney(result.prices_used.gold_price_per_gram, currency)} / {t("calculator.result.perGram")}
                    {"\n"}
                    {t("calculator.result.silver")}: {formatMoney(result.prices_used.silver_price_per_gram, currency)} / {t("calculator.result.perGram")}
                    {"\n"}
                    {t("calculator.result.updated")}: {formatDate(result.prices_used.as_of, i18n.language)}
                  </Text>

                  {result.prices_used.is_fallback && (
                    <View style={[tw`mt-3 rounded-xl p-3`, { backgroundColor: isDarkMode ? "#3B3224" : "#F4E9D3" }]}>
                      <Text style={[tw`text-xs font-semibold`, { color: isDarkMode ? "#D9BD83" : "#8C682F" }, textDirection]}>
                        {t("calculator.result.fallbackWarning")}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}

          <Text style={[tw`text-xs text-center mt-8`, { color: colors.secondaryText }]}>
            {t("calculator.result.footer")}
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
