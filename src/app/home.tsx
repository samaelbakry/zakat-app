
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

  const textAlign = isArabic ? "right" : "left";
  const writingDirection = isArabic ? "rtl" : "ltr";

  const rowStyle = {
    flexDirection: isArabic ? "row-reverse" : "row",
  } as const;

  const textDirection = {
    writingDirection,
    textAlign,
  } as const;

  const primaryText = { color: colors.primary };
  const secondaryText = { color: colors.secondaryText };
  const accentText = { color: colors.accent };

  const card = {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
  };

  const firstName =
    user?.user_metadata?.first_name ||
    user?.email?.split("@")[0] ||
    "there";

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
    <Text
      style={[
        tw`text-sm`,
        secondaryText,
        textDirection,
      ]}
    >
      {children}
    </Text>
  );

  const PriceCard = ({
    title,
    value,
  }: {
    title: string;
    value: number;
  }) => (
    <View
      style={[
        tw`flex-1 rounded-2xl p-4`,
        { backgroundColor: colors.background },
      ]}
    >
      <Label>{title}</Label>

      <Text
        style={[
          tw`text-base font-bold mt-2`,
          primaryText,
          { textAlign: "left", writingDirection: "ltr" },
        ]}
      >
        {formatCurrency(value, prices!.currency)}
      </Text>

      <Text
        style={[
          tw`text-xs mt-2`,
          accentText,
          textDirection,
        ]}
      >
        {t("home.market.perGram")}
      </Text>
    </View>
  );

  return (
    <View style={[tw`flex-1`, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={tw`px-5 pt-8 pb-10`}
        showsVerticalScrollIndicator={false}
      >
        <View style={tw`my-6`}>
          <Text
            style={[
              tw`text-xs font-bold mb-3`,
              accentText,
              textDirection,
            ]}
          >
            {t("home.personalSpace")}
          </Text>

          <Text
            style={[
              tw`text-2xl font-bold`,
              primaryText,
              textDirection,
            ]}
          >
            {t("home.greeting")} {firstName}
          </Text>

          <Text
            style={[
              tw`text-sm mt-2`,
              secondaryText,
              textDirection,
            ]}
          >
            {t("home.welcome")}
          </Text>
        </View>

        {loading ? (
          <View style={tw`py-16 items-center`}>
            <ActivityIndicator color={colors.primary} />

            <Text style={[tw`mt-3`, secondaryText]}>
              {t("home.loading")}
            </Text>
          </View>
        ) : error || !prices ? (
          <View style={[tw`rounded-3xl p-5 border`, card]}>
            <Text
              style={[
                tw`font-bold text-base`,
                primaryText,
                textDirection,
              ]}
            >
              {t("home.error.title")}
            </Text>

            <Text
              style={[
                tw`mt-2`,
                secondaryText,
                textDirection,
              ]}
            >
              {t("home.error.description")}
            </Text>

            <Pressable
              onPress={() => void loadHomeData()}
              style={rowStyle}
            >
              <Text
                style={[
                  tw`mt-4 font-bold`,
                  accentText,
                  textDirection,
                ]}
              >
                {t("home.error.retry")}
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View
              style={[
                tw`rounded-3xl p-5 mb-6`,
                card,
              ]}
            >
              <View
                style={[
                  tw`justify-between items-center mb-4`,
                  rowStyle,
                ]}
              >
                <View style={tw`flex-1`}>
                  <Text
                    style={[
                      tw`text-xs font-bold`,
                      {
                        color: isDarkMode
                          ? colors.accent
                          : "#C59A55",
                      },
                      textDirection,
                    ]}
                  >
                    {t("home.market.title")}
                  </Text>

                  <Text
                    style={[
                      tw`text-xs mt-1`,
                      {
                        color: isDarkMode
                          ? colors.primary
                          : "#999B90",
                      },
                      textDirection,
                    ]}
                  >
                    {t("home.market.subtitle")}
                  </Text>
                </View>

                <Text
                  style={[
                    tw`font-bold`,
                    accentText,
                  ]}
                >
                  {prices.currency}
                </Text>
              </View>

              <View style={[tw`gap-3`, rowStyle]}>
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
                  {
                    color: isDarkMode
                      ? colors.primary
                      : "#999B90",
                  },
                  textDirection,
                ]}
              >
                {t("home.market.updated")}{" "}
                {formatDate(prices.as_of, i18n.language)}
              </Text>

              <Text
                style={[
                  tw`text-xs leading-5 mt-2`,
                  {
                    color: isDarkMode
                      ? colors.primary
                      : "#999B90",
                  },
                  textDirection,
                ]}
              >
                {t("home.market.disclaimer")}
              </Text>
            </View>

            <SmartInsights
              currency={prices.currency === "USD" ? "USD" : "EGP"}
            />

            <Text
              style={[
                tw`text-xs font-bold mb-3`,
                accentText,
                textDirection,
              ]}
            >
              {t("home.essentials")}
            </Text>

            <View
              style={[
                tw`rounded-3xl p-5 mb-6`,
                card,
              ]}
            >
              <Text
                style={[
                  tw`text-xl font-bold mb-2`,
                  primaryText,
                  textDirection,
                ]}
              >
                {t("home.nisab.title")}
              </Text>

              <Text
                style={[
                  tw`text-sm mb-4`,
                  secondaryText,
                  textDirection,
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
                  <Text
                    style={[
                      tw`text-xs`,
                      secondaryText,
                      textDirection,
                    ]}
                  >
                    {item.title} ({item.grams}g)
                  </Text>

                  <Text
                    style={[
                      tw`text-lg font-bold mt-2`,
                      primaryText,
                      {
                        textAlign: "left",
                        writingDirection: "ltr",
                      },
                    ]}
                  >
                    {formatCurrency(item.value, prices.currency)}
                  </Text>
                </View>
              ))}

              <Text
                style={[
                  tw`text-xs leading-5`,
                  secondaryText,
                  textDirection,
                ]}
              >
                {t("home.nisab.note")}
              </Text>
            </View>

            <Pressable
              onPress={() => router.push("/zakat-guide")}
              style={({ pressed }) => [
                tw`rounded-2xl p-5 mb-4 items-center`,
                rowStyle,
                { backgroundColor: colors.surface },
                pressed && { opacity: 0.8 },
              ]}
            >
              <View style={tw`flex-1`}>
                <Text
                  style={[
                    tw`font-bold`,
                    primaryText,
                    textDirection,
                  ]}
                >
                  {t("home.guide.title")}
                </Text>

                <Text
                  style={[
                    tw`text-sm mt-1`,
                    secondaryText,
                    textDirection,
                  ]}
                >
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
