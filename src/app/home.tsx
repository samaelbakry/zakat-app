import SmartInsights from "@/components/home/SmartInsights";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { formatCurrency, formatDate } from "@/lib/helpers";
import { getZakatPrices } from "@/services/zakat";

import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import tw from "twrnc";

type ZakatPrices = Awaited<ReturnType<typeof getZakatPrices>>;

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { colors, isDarkMode } = useTheme();

  const [prices, setPrices] = useState<ZakatPrices | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const isArabic = i18n.language.startsWith("ar");
  const direction = isArabic ? "rtl" : "ltr";
  const textAlign = isArabic ? "text-right" : "text-left";
  const row = isArabic ? "flex-row-reverse" : "flex-row";

  const textStyle = { writingDirection: direction } as const;
  const primaryText = { color: colors.primary };
  const secondaryText = { color: colors.secondaryText };
  const accentText = { color: colors.accent };
  const card = {
    backgroundColor: colors.card,
    borderColor: colors.border,
  };

  const firstName =
    user?.user_metadata?.first_name || user?.email?.split("@")[0] || "there";

  const loadHomeData = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      setPrices(await getZakatPrices());
    } catch (err) {
      console.error("Failed to load home data:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadHomeData();
    }, [loadHomeData]),
  );

  const Label = ({ children }: { children: React.ReactNode }) => (
    <Text style={[tw`text-sm`, secondaryText, tw`${textAlign}`, textStyle]}>
      {children}
    </Text>
  );

  const PriceCard = ({ title, value }: { title: string; value: number }) => (
    <View
      style={[
        tw`flex-1 rounded-2xl p-4`,
        { backgroundColor: colors.background },
      ]}
    >
      <Label>{title}</Label>

      <Text style={[tw`text-base font-bold mt-2`, primaryText]}>
        {formatCurrency(value, prices!.currency)}
      </Text>

      <Text style={[tw`text-xs mt-2`, accentText]}>
        {t("home.market.perGram")}
      </Text>
    </View>
  );

  return (
    <View style={[tw`flex-1`, { backgroundColor: colors.background}]}>
      <ScrollView
        contentContainerStyle={tw`px-5 pt-8 pb-10`}
        showsVerticalScrollIndicator={false}
      >
        <View style={tw`mt-6 mb-6`}>
          <Text style={[tw`text-xs font-bold mb-3`, accentText]}>
            {t("home.personalSpace")}
          </Text>

          <Text
            style={[
              tw`text-2xl font-bold`,
              primaryText,
              tw`${textAlign}`,
              textStyle,
            ]}
          >
            {t("home.greeting")} {firstName}
          </Text>

          <Text
            style={[
              tw`text-sm mt-2`,
              secondaryText,
              tw`${textAlign}`,
              textStyle,
            ]}
          >
            {t("home.welcome")}
          </Text>
        </View>

        {loading ? (
          <View style={tw`py-16 items-center`}>
            <ActivityIndicator color={colors.primary} />

            <Text style={[tw`mt-3`, secondaryText]}>{t("home.loading")}</Text>
          </View>
        ) : error || !prices ? (
          <View style={[tw`rounded-3xl p-5 border`, card]}>
            <Text style={[tw`font-bold text-base`, primaryText]}>
              {t("home.error.title")}
            </Text>

            <Text style={[tw`mt-2`, secondaryText]}>
              {t("home.error.description")}
            </Text>

            <Pressable onPress={() => void loadHomeData()}>
              <Text style={[tw`mt-4 font-bold`, accentText]}>
                {t("home.error.retry")}
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View
              style={[
                tw`rounded-3xl p-5 mb-6`,
                { backgroundColor: colors.card, borderColor: colors.border , borderWidth: 1},
              ]}
            >
              <View style={[tw`${row} justify-between items-center mb-4`]}>
                <View style={tw`flex-1`}>
                  <Text
                    style={[
                      tw`text-xs font-bold`,
                      { color: isDarkMode ? colors.accent : "#C59A55" },
                    ]}
                  >
                    {t("home.market.title")}
                  </Text>

                  <Text
                    style={[
                      tw`text-xs mt-1`,
                      { color: isDarkMode ? colors.primary : "#999B90" },
                    ]}
                  >
                    {t("home.market.subtitle")}
                  </Text>
                </View>

                <Text style={[tw`font-bold`, accentText]}>
                  {prices.currency}
                </Text>
              </View>

              <View style={tw`${row} gap-3`}>
                <PriceCard
                  title={t("home.market.gold")}
                  value={prices.gold_price_per_gram}
                />

                <PriceCard
                  title={t("home.market.silver")}
                  value={prices.silver_price_per_gram}
                />
              </View>

              <Text
                style={[
                  tw`text-xs mt-4`,
                  { color: isDarkMode ? colors.primary : "#999B90" },
                  textStyle,
                ]}
              >
                {t("home.market.updated")}{" "}
                {formatDate(prices.as_of, i18n.language)}
              </Text>

              <Text
                style={[
                  tw`text-xs leading-5 mt-2`,
                  { color: isDarkMode ? colors.primary : "#999B90" },
                  tw`${textAlign}`,
                  textStyle,
                ]}
              >
                {t("home.market.disclaimer")}
              </Text>
            </View>
            <SmartInsights
              currency={prices.currency === "USD" ? "USD" : "EGP"}
            />

            <Text style={[tw`text-xs font-bold mb-3`, accentText]}>
              {t("home.essentials")}
            </Text>

            <View style={[tw`rounded-3xl p-5 mb-6 border`, card]}>
              <Text
                style={[
                  tw`text-xl font-bold mb-2`,
                  primaryText,
                  tw`${textAlign}`,
                  textStyle,
                ]}
              >
                {t("home.nisab.title")}
              </Text>

              <Text
                style={[
                  tw`text-sm mb-4`,
                  secondaryText,
                  tw`${textAlign}`,
                  textStyle,
                ]}
              >
                {t("home.nisab.description")}
              </Text>

              {[
                {
                  title: t("home.nisab.gold"),
                  grams: prices.nisab_gold_grams,
                  value: prices.nisab_gold_value,
                },
                {
                  title: t("home.nisab.silver"),
                  grams: prices.nisab_silver_grams,
                  value: prices.nisab_silver_value,
                },
              ].map((item) => (
                <View
                  key={item.title}
                  style={[
                    tw`rounded-2xl p-4 mb-3`,
                    { backgroundColor: colors.surface },
                  ]}
                >
                  <Text style={[tw`text-xs`, secondaryText]}>
                    {item.title} ({item.grams}g)
                  </Text>

                  <Text style={[tw`text-lg font-bold mt-2`, primaryText]}>
                    {formatCurrency(item.value, prices.currency)}
                  </Text>
                </View>
              ))}

              <Text
                style={[
                  tw`text-xs leading-5`,
                  secondaryText,
                  tw`${textAlign}`,
                  textStyle,
                ]}
              >
                {t("home.nisab.note")}
              </Text>
            </View>

            <Pressable
              onPress={() => router.push("/zakat-guide")}
              style={({ pressed }) => [
                tw`rounded-2xl p-5 mb-4 ${row} items-center`,
                { backgroundColor: colors.surface },
                pressed && { opacity: 0.8 },
              ]}
            >
              <View style={tw`flex-1`}>
                <Text style={[tw`font-bold`, primaryText]}>
                  {t("home.guide.title")}
                </Text>

                <Text style={[tw`text-sm mt-1`, secondaryText]}>
                  {t("home.guide.description")}
                </Text>
              </View>

              <Text style={[tw`text-lg`, primaryText]}>
                {isArabic ? "←" : "→"}
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}
