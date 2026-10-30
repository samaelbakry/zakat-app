import GuideSection from "@/components/ui/GuideSections";
import { getZakatInfo } from "@/services-2/zakat";
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

export default function ZakatGuideScreen() {
  const [info, setInfo] = useState<ZakatInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadInfo = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const data = await getZakatInfo();
      setInfo(data);
    } catch (err) {
      console.error("Failed to load zakat guide:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadInfo();
    }, [loadInfo]),
  );

  return (
    <View style={tw`flex-1 bg-[#FAF9F5]`}>
      <ScrollView
        contentContainerStyle={tw`px-6 pt-12 pb-10`}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => router.replace("/home")}
          style={tw`flex-row items-center mb-7`}
        >
          <Text style={tw`text-lg text-[#174C3C] mr-2`}>←</Text>
          <Text style={tw`text-sm font-semibold text-[#174C3C]`}>Back</Text>
        </Pressable>

        <Text
          style={tw`text-[10px] font-bold uppercase tracking-[2px] text-[#A77A35] mb-2`}
        >
          Learn before you calculate
        </Text>

        <Text style={tw`font-display text-3xl text-[#174C3C]`}>
          Zakat Guide
        </Text>

        <Text style={tw`text-sm leading-6 text-[#777D72] mt-2 mb-7`}>
          Understand the basic rules, conditions, and eligible wealth before
          calculating your zakat.
        </Text>

        {loading ? (
          <View style={tw`py-20 items-center`}>
            <ActivityIndicator size="large" color="#174C3C" />
            <Text style={tw`text-sm text-[#777D72] mt-3`}>
              Loading guide...
            </Text>
          </View>
        ) : error || !info ? (
          <View style={tw`bg-white rounded-2xl p-5`}>
            <Text style={tw`font-bold text-[#174C3C]`}>
              Unable to load the guide
            </Text>

            <Pressable onPress={() => void loadInfo()}>
              <Text style={tw`text-[#A77A35] underline mt-3`}>Try again</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={tw`bg-[#174C3C] rounded-[26px] p-5 mb-7`}>
              <Text
                style={tw`text-[10px] font-bold uppercase tracking-[2px] text-[#D9BD83] mb-3`}
              >
                Introduction
              </Text>

              <Text style={tw`font-display text-2xl text-white mb-3`}>
                What is Zakat?
              </Text>

              <Text style={tw`text-sm leading-7 text-[#F0F4ED]`}>
                {info.definition}
              </Text>
            </View>

            <GuideSection title="Conditions of Zakat" items={info.conditions} />

            <View style={tw`bg-[#F0F4ED] rounded-2xl p-5 mb-7`}>
              <Text style={tw`font-display text-xl text-[#174C3C] mb-2`}>
                Hawl – Lunar Year
              </Text>

              <Text style={tw`text-sm leading-6 text-[#5F705F]`}>
                {info.hawl}
              </Text>
            </View>

            <GuideSection
              title="Zakatable Assets"
              description="Types of wealth mentioned by the API as subject to zakat:"
              items={info.zakatable_assets}
            />

            <GuideSection
              title="Non-Zakatable Assets"
              description="Assets listed by the API as generally not subject to zakat:"
              items={info.non_zakatable_assets}
            />

            <View style={tw`mb-7`}>
              <Text style={tw`font-display text-xl text-[#174C3C] mb-3`}>
                Zakat Rates
              </Text>

              {[
                { label: "General wealth", value: info.rate.general },
                {
                  label: "Rain-irrigated crops",
                  value: info.rate.agriculture_rain,
                },
                {
                  label: "Artificially irrigated crops",
                  value: info.rate.agriculture_irrigated,
                },
              ].map((rate) => (
                <View
                  key={rate.label}
                  style={tw`bg-white rounded-xl p-4 mb-3 border border-[#E9E6DC]`}
                >
                  <Text style={tw`text-xs text-[#85897F]`}>{rate.label}</Text>
                  <Text style={tw`text-base font-bold text-[#174C3C] mt-1`}>
                    {rate.value}
                  </Text>
                </View>
              ))}
            </View>

            <GuideSection
              title="Who Can Receive Zakat?"
              items={info.eligible_recipients}
            />

            <View
              style={tw`bg-white rounded-2xl p-5 mb-7 border border-[#E9E6DC]`}
            >
              <Text style={tw`font-display text-xl text-[#174C3C] mb-3`}>
                Nisab
              </Text>

              <Text style={tw`text-sm font-bold text-[#174C3C]`}>
                Gold: {info.nisab.gold.grams} grams
              </Text>

              <Text style={tw`text-xs leading-5 text-[#777D72] mt-1 mb-4`}>
                {info.nisab.gold.description}
              </Text>

              <Text style={tw`text-sm font-bold text-[#174C3C]`}>
                Silver: {info.nisab.silver.grams} grams
              </Text>

              <Text style={tw`text-xs leading-5 text-[#777D72] mt-1`}>
                {info.nisab.silver.description}
              </Text>

              <View style={tw`h-px bg-[#E9E6DC] my-4`} />

              <Text style={tw`text-xs leading-6 text-[#777D72]`}>
                {info.nisab.note}
              </Text>
            </View>

            <View style={tw`bg-[#F4E9D3] rounded-2xl p-4 mb-7`}>
              <Text style={tw`font-bold text-sm text-[#80602F] mb-2`}>
                Important Disclaimer
              </Text>

              <Text style={tw`text-xs leading-6 text-[#6D5B3E]`}>
                {info.disclaimer}
              </Text>

              <Text style={tw`text-[10px] leading-5 text-[#80602F] mt-3`}>
                Source: {info.source}
              </Text>
            </View>

            <Pressable
              onPress={() => router.push("/zakat-calculator" as never)}
              style={({ pressed }) => [
                tw`bg-[#174C3C] rounded-2xl p-5 flex-row items-center justify-between`,
                pressed && { opacity: 0.85 },
              ]}
            >
              <View style={tw`flex-1 mr-3`}>
                <Text style={tw`text-white font-bold text-base`}>
                  Continue to Calculator
                </Text>

                <Text style={tw`text-xs text-[#DCE5D5] mt-2`}>
                  Apply what you've learned.
                </Text>
              </View>

              <Text style={tw`text-2xl text-[#D9BD83]`}>→</Text>
            </Pressable>
           
          </>
        )}
      </ScrollView>
    </View>
  );
}
