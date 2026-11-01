import LogoutButton from "@/components/auth/LogoutButton";
import { useAuth } from "@/context/AuthContext";
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

  const [prices, setPrices] = useState<ZakatPrices | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const isArabic = i18n.language.startsWith("ar");

  const textDirection = isArabic ? "text-right" : "text-left";
  const rowDirection = isArabic ? "flex-row-reverse" : "flex-row";
  const writingDirection = isArabic ? "rtl" : "ltr";

  const textStyle = {
    writingDirection,
    letterSpacing: 0,
  } as const;

  const firstName =
    user?.user_metadata?.first_name || user?.email?.split("@")[0] || "there";

  const loadHomeData = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const data = await getZakatPrices();
      setPrices(data);
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

  return (
    <View style={tw`flex-1 bg-[#FAF9F5]`}>
      <ScrollView
        contentContainerStyle={tw`px-5 pt-8 pb-10`}
        showsVerticalScrollIndicator={false}
      >
        <View style={tw`mt-10 mb-8`}>
          <View style={tw`${rowDirection} items-center mb-4`}>
            <View
              style={[
                tw`w-1.5 h-1.5 rounded-full bg-[#C59A55]`,
                isArabic ? tw`ml-2` : tw`mr-2`,
              ]}
            />

            <Text
              style={[
                tw`text-[11px] font-bold text-[#A77A35]`,
                isArabic ? tw`text-right` : tw`tracking-widest`,
                textStyle,
              ]}
            >
              {t("home.personalSpace")}
            </Text>
          </View>

          <Text
            style={[
              tw`text-2xl font-bold text-[#174C3C]`,
              tw`${textDirection}`,
              textStyle,
            ]}
          >
            {t("home.greeting")} {firstName}
          </Text>

          <Text
            style={[
              tw`text-sm text-[#777D72] mt-3`,
              tw`${textDirection}`,
              textStyle,
            ]}
          >
            {t("home.welcome")}
          </Text>
        </View>

        {loading ? (
          <View style={tw`py-20 items-center`}>
            <ActivityIndicator size="large" color="#174C3C" />

            <Text style={[tw`text-sm text-[#777D72] mt-3`, textStyle]}>
              {t("home.loading")}
            </Text>
          </View>
        ) : error || !prices ? (
          <View style={tw`bg-white rounded-3xl p-6 border border-[#EAE8DF]`}>
            <View
              style={tw`w-10 h-10 rounded-xl bg-[#F4E9D3] items-center justify-center mb-4`}
            >
              <Text style={tw`text-lg font-bold text-[#A77A35]`}>!</Text>
            </View>

            <Text
              style={[
                tw`text-base font-bold text-[#174C3C]`,
                tw`${textDirection}`,
                textStyle,
              ]}
            >
              {t("home.error.title")}
            </Text>

            <Text
              style={[
                tw`text-sm leading-5 text-[#85897F] mt-2`,
                tw`${textDirection}`,
                textStyle,
              ]}
            >
              {t("home.error.description")}
            </Text>

            <Pressable
              onPress={() => void loadHomeData()}
              style={tw`self-start mt-5`}
            >
              <Text style={tw`text-sm font-bold text-[#A77A35]`}>
                {t("home.error.retry")} →
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={tw`bg-[#174C3C] rounded-3xl p-5 mb-6`}>
              <View
                style={tw`${rowDirection} justify-between items-center mb-5`}
              >
                <View style={tw`flex-1`}>
                  <Text
                    style={[
                      tw`text-[11px] font-bold text-[#E4D0A5]`,
                      isArabic ? tw`text-right` : tw`tracking-widest`,
                      textStyle,
                    ]}
                  >
                    {t("home.market.title")}
                  </Text>

                  <Text
                    style={[
                      tw`text-xs text-[#DCE5D5] mt-1`,
                      tw`${textDirection}`,
                      textStyle,
                    ]}
                  >
                    {t("home.market.subtitle")}
                  </Text>
                </View>

                <View style={tw`bg-[#C59A55]/20 rounded-xl px-3 py-2`}>
                  <Text style={tw`text-xs font-bold text-[#E4D0A5]`}>
                    {prices.currency}
                  </Text>
                </View>
              </View>

              <View style={tw`${rowDirection} gap-3`}>
                <View style={tw`flex-1 bg-[#FAF9F5] rounded-2xl p-4`}>
                  <Text
                    style={[
                      tw`text-xs text-[#85897F] mb-2`,
                      tw`${textDirection}`,
                      textStyle,
                    ]}
                  >
                    {t("home.market.gold")}
                  </Text>

                  <Text
                    style={[
                      tw`text-base font-bold text-[#174C3C]`,
                      tw`${textDirection}`,
                    ]}
                  >
                    {formatCurrency(
                      prices.gold_price_per_gram,
                      prices.currency,
                    )}
                  </Text>

                  <Text
                    style={[
                      tw`text-[10px] text-[#A77A35] mt-2`,
                      tw`${textDirection}`,
                      textStyle,
                    ]}
                  >
                    {t("home.market.perGram")}
                  </Text>
                </View>

                <View style={tw`flex-1 bg-[#FAF9F5] rounded-2xl p-4`}>
                  <Text
                    style={[
                      tw`text-xs text-[#85897F] mb-2`,
                      tw`${textDirection}`,
                      textStyle,
                    ]}
                  >
                    {t("home.market.silver")}
                  </Text>

                  <Text
                    style={[
                      tw`text-base font-bold text-[#174C3C]`,
                      tw`${textDirection}`,
                    ]}
                  >
                    {formatCurrency(
                      prices.silver_price_per_gram,
                      prices.currency,
                    )}
                  </Text>

                  <Text
                    style={[
                      tw`text-[10px] text-[#A77A35] mt-2`,
                      tw`${textDirection}`,
                      textStyle,
                    ]}
                  >
                    {t("home.market.perGram")}
                  </Text>
                </View>
              </View>

              <View style={tw`h-px bg-white/15 my-5`} />

              <View
                style={[
                  tw`flex-row items-center`,
                  isArabic ? tw`flex-row-reverse` : tw`flex-row`,
                ]}
              >
                <Text
                  style={[
                    tw`text-[11px] text-[#DCE5D5]`,
                    { writingDirection: isArabic ? "rtl" : "ltr" },
                  ]}
                >
                  {t("home.market.updated")}{" "}
                </Text>

                <Text
                  style={[
                    tw`text-[11px] text-[#DCE5D5]`,
                    { writingDirection: "ltr", textAlign: "left" },
                  ]}
                >
                  {formatDate(prices.as_of, i18n.language)}
                </Text>
              </View>

              <Text
                style={[
                  tw`text-[11px] leading-5 text-[#DCE5D5] mt-2`,
                  tw`${textDirection}`,
                  textStyle,
                ]}
              >
                {t("home.market.disclaimer")}
              </Text>
            </View>

            <View style={tw`${rowDirection} items-center mb-4`}>
              <View
                style={[
                  tw`w-1.5 h-1.5 rounded-full bg-[#C59A55]`,
                  isArabic ? tw`ml-2` : tw`mr-2`,
                ]}
              />

              <Text
                style={[
                  tw`text-[11px] font-bold text-[#A77A35]`,
                  isArabic ? tw`text-right` : tw`tracking-widest`,
                  textStyle,
                ]}
              >
                {t("home.essentials")}
              </Text>
            </View>

            <View
              style={tw`bg-white rounded-3xl p-5 mb-6 border border-[#EAE8DF]`}
            >
              <Text
                style={[
                  tw`text-xl font-bold text-[#174C3C] mb-2`,
                  tw`${textDirection}`,
                  textStyle,
                ]}
              >
                {t("home.nisab.title")}
              </Text>

              <Text
                style={[
                  tw`text-sm leading-5 text-[#85897F] mb-5`,
                  tw`${textDirection}`,
                  textStyle,
                ]}
              >
                {t("home.nisab.description")}
              </Text>

              <View style={tw`bg-[#F7F5EF] rounded-2xl p-4 mb-3`}>
                <View style={tw`${rowDirection} items-center justify-between`}>
                  <Text
                    style={[
                      tw`text-xs font-semibold text-[#777D72]`,
                      textStyle,
                    ]}
                  >
                    {t("home.nisab.gold")} ({prices.nisab_gold_grams}g)
                  </Text>

                  <View style={tw`bg-[#F4E9D3] px-2.5 py-1 rounded-lg`}>
                    <Text style={tw`text-[10px] font-bold text-[#A77A35]`}>
                      {isArabic
                        ? t("home.nisab.gold")
                        : t("home.nisab.gold").toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    tw`text-lg font-bold text-[#174C3C] mt-3`,
                    tw`${textDirection}`,
                  ]}
                >
                  {formatCurrency(prices.nisab_gold_value, prices.currency)}
                </Text>
              </View>

              <View style={tw`bg-[#F7F5EF] rounded-2xl p-4`}>
                <View style={tw`${rowDirection} items-center justify-between`}>
                  <Text
                    style={[
                      tw`text-xs font-semibold text-[#777D72]`,
                      textStyle,
                    ]}
                  >
                    {t("home.nisab.silver")} ({prices.nisab_silver_grams}g)
                  </Text>

                  <View style={tw`bg-[#E8EEE5] px-2.5 py-1 rounded-lg`}>
                    <Text style={tw`text-[10px] font-bold text-[#52744D]`}>
                      {isArabic
                        ? t("home.nisab.silver")
                        : t("home.nisab.silver").toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    tw`text-lg font-bold text-[#174C3C] mt-3`,
                    tw`${textDirection}`,
                  ]}
                >
                  {formatCurrency(prices.nisab_silver_value, prices.currency)}
                </Text>
              </View>

              <Text
                style={[
                  tw`text-xs leading-5 text-[#85897F] mt-4`,
                  tw`${textDirection}`,
                  textStyle,
                ]}
              >
                {t("home.nisab.note")}
              </Text>
            </View>

            <Pressable
              onPress={() => router.push("/zakat-guide")}
              style={({ pressed }) => [
                tw`bg-[#E8EEE5] rounded-2xl p-5 mb-4 flex-row items-center justify-between`,
                isArabic && { flexDirection: "row-reverse" },
                pressed && { opacity: 0.8 },
              ]}
            >
              <View style={tw`flex-1 mx-3`}>
                <Text
                  style={[
                    tw`text-base font-bold text-[#174C3C]`,
                    tw`${textDirection}`,
                    textStyle,
                  ]}
                >
                  {t("home.guide.title")}
                </Text>

                <Text
                  style={[
                    tw`text-sm leading-5 text-[#6B7867] mt-1`,
                    tw`${textDirection}`,
                    textStyle,
                  ]}
                >
                  {t("home.guide.description")}
                </Text>
              </View>

              <View
                style={tw`w-9 h-9 rounded-full bg-white items-center justify-center`}
              >
                <Text style={tw`text-lg text-[#174C3C]`}>
                  {isArabic ? "←" : "→"}
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => router.push("/zakat-calculation")}
              style={({ pressed }) => [
                tw`bg-[#174C3C] rounded-3xl p-5 mb-8 flex-row items-center justify-between`,
                isArabic && { flexDirection: "row-reverse" },
                pressed && { opacity: 0.85 },
              ]}
            >
              <View style={tw`flex-1 mx-3`}>
                <Text
                  style={[
                    tw`text-base font-bold text-white`,
                    tw`${textDirection}`,
                    textStyle,
                  ]}
                >
                  {t("home.calculator.title")}
                </Text>

                <Text
                  style={[
                    tw`text-sm leading-5 text-[#DCE5D5] mt-2`,
                    tw`${textDirection}`,
                    textStyle,
                  ]}
                >
                  {t("home.calculator.description")}
                </Text>
              </View>

              <View
                style={tw`w-10 h-10 rounded-full bg-[#C59A55]/20 items-center justify-center`}
              >
                <Text style={tw`text-xl text-[#E4D0A5]`}>
                  {isArabic ? "←" : "→"}
                </Text>
              </View>
            </Pressable>
          </>
        )}

        <View style={tw`pt-5 border-t border-[#E5E2D8]`}>
          <LogoutButton />
        </View>
      </ScrollView>
    </View>
  );
}
