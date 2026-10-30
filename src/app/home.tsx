
import LogoutButton from "@/components/auth/LogoutButton";
import PriceCard from "@/components/ui/PriceCard";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency, formatDate } from "@/lib/helpers";
import { getZakatInfo, getZakatPrices } from "@/services-2/zakat";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import tw from "twrnc";

type ZakatInfo = Awaited<ReturnType<typeof getZakatInfo>>;
type ZakatPrices = Awaited<ReturnType<typeof getZakatPrices>>;


export default function HomeScreen() {
  const { user } = useAuth();
  const [prices, setPrices] = useState<ZakatPrices | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fullName =
    typeof user?.user_metadata?.fullName === "string"
      ? user.user_metadata.fullName.trim()
      : "";

  const firstName = fullName ? fullName.split(/\s+/)[0] : "there";

  const loadHomeData = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
     const pricesData = await getZakatPrices();

      setPrices(pricesData);
    } catch (err) {
      console.error("Failed to load zakat home data:", err);
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
      <View style={tw`my-8`}>
        <Text style={tw`text-[11px] font-bold uppercase tracking-widest text-[#A77A35] mb-3`}>
          Your personal zakat space
        </Text>

        <Text style={tw`text-2xl font-bold text-[#174C3C]`}>
          Assalamu Alaikum,{firstName}
        </Text>

        <Text style={tw`text-sm text-[#777D72] mt-1`}>
          Stay updated with current market prices.
        </Text>
      </View>

      {loading ? (
        <View style={tw`py-20 items-center`}>
          <ActivityIndicator size="large" color="#174C3C" />
          <Text style={tw`text-sm text-[#777D72] mt-3`}>
            Loading market prices...
          </Text>
        </View>
      ) : error || !prices ? (
        <View style={tw`bg-white rounded-3xl p-5 border border-[#EAE8DF]`}>
          <Text style={tw`text-base font-bold text-[#174C3C]`}>
            Unable to load prices
          </Text>

          <Pressable onPress={() => void loadHomeData()}>
            <Text style={tw`text-sm font-bold text-[#A77A35] mt-3`}>
              Try again →
            </Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View style={tw`bg-[#174C3C] rounded-3xl p-5 mb-5`}>
            <View style={tw`flex-row justify-between items-center mb-5`}>
              <Text style={tw`text-[11px] font-bold uppercase tracking-widest text-[#DCE5D5]`}>
                Market Overview
              </Text>

              <View style={tw`bg-white/15 rounded-full px-3 py-1.5`}>
                <Text style={tw`text-xs font-bold text-white`}>
                  {prices.currency}
                </Text>
              </View>
            </View>

            <View style={tw`flex-row gap-3`}>
              <View style={tw`flex-1 bg-[#FAF9F5] rounded-2xl p-4`}>
                <Text style={tw`text-xs text-[#85897F] mb-2`}>
                  Gold / 24K
                </Text>

                <Text style={tw`text-base font-bold text-[#174C3C]`}>
                  {formatCurrency(prices.gold_price_per_gram, prices.currency)}
                </Text>
              </View>

              <View style={tw`flex-1 bg-[#FAF9F5] rounded-2xl p-4`}>
                <Text style={tw`text-xs text-[#85897F] mb-2`}>
                  Silver / gram
                </Text>

                <Text style={tw`text-base font-bold text-[#174C3C]`}>
                  {formatCurrency(prices.silver_price_per_gram, prices.currency)}
                </Text>
              </View>
            </View>

            <Text style={tw`text-[11px] text-[#DCE5D5] mt-4`}>
              Updated: {formatDate(prices.as_of)}
            </Text>

            {prices.is_fallback && (
              <Text style={tw`text-xs text-[#D9BD83] mt-2`}>
                Currently showing fallback prices.
              </Text>
            )}

            <Text style={tw`text-[11px] leading-5 text-[#DCE5D5] mt-2`}>
              {prices.note}
            </Text>
          </View>

          <View style={tw`bg-white rounded-3xl p-5 mb-5 border border-[#E9E6DC]`}>
            <Text style={tw`text-xl font-bold text-[#174C3C] mb-5`}>
              Nisab Threshold
            </Text>

            <View style={tw`mb-4`}>
              <Text style={tw`text-xs text-[#85897F]`}>
                Gold ({prices.nisab_gold_grams}g)
              </Text>

              <Text style={tw`text-lg font-bold text-[#174C3C] mt-2`}>
                {formatCurrency(prices.nisab_gold_value, prices.currency)}
              </Text>
            </View>

            <View style={tw`h-px bg-[#E9E6DC] mb-4`} />

            <View>
              <Text style={tw`text-xs text-[#85897F]`}>
                Silver ({prices.nisab_silver_grams}g)
              </Text>

              <Text style={tw`text-lg font-bold text-[#174C3C] mt-2`}>
                {formatCurrency(prices.nisab_silver_value, prices.currency)}
              </Text>
            </View>

            <Text style={tw`text-xs leading-5 text-[#85897F] mt-4`}>
              Nisab values are calculated using current market prices.
            </Text>
          </View>

          <Pressable
            onPress={() => router.push("/zakat-guide")}
            style={({ pressed }) => [
              tw`bg-[#E8EEE5] rounded-2xl p-5 mb-4 flex-row items-center justify-between`,
              pressed && { opacity: 0.8 },
            ]}
          >
            <View style={tw`flex-1 mr-3`}>
              <Text style={tw`text-base font-bold text-[#174C3C]`}>
                Zakat Guide
              </Text>

              <Text style={tw`text-sm leading-5 text-[#6B7867] mt-1`}>
                Understand zakat rules and conditions.
              </Text>
            </View>

            <Text style={tw`text-xl text-[#174C3C]`}>→</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/zakat-guide")}
            style={({ pressed }) => [
              tw`bg-[#174C3C] rounded-2xl p-5 mb-8 flex-row items-center justify-between`,
              pressed && { opacity: 0.85 },
            ]}
          >
            <View style={tw`flex-1 mr-3`}>
              <Text style={tw`text-base font-bold text-white`}>
                Calculate Your Zakat
              </Text>

              <Text style={tw`text-sm text-[#DCE5D5] mt-2`}>
                Start with the Zakat Guide.
              </Text>
            </View>

            <Text style={tw`text-2xl text-[#D9BD83]`}>→</Text>
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
