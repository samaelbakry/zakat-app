import LogoutButton from "@/components/auth/LogoutButton";
import { zakatOptions } from "@/constants/home";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import tw from "twrnc";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { getSavedAssets, type SavedAsset } from "@/services/assets";

export default function HomeScreen() {
  const [assets, setAssets] = useState<SavedAsset[]>([]);
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [assetsError, setAssetsError] = useState(false);
  const { user } = useAuth();

  const fullName =
    typeof user?.user_metadata?.fullName === "string"
      ? user.user_metadata.fullName.trim()
      : "";

  const firstName = fullName ? fullName.split(/\s+/)[0] : "there";

  const loadAssets = useCallback(async () => {
    setAssetsLoading(true);
    setAssetsError(false);

    try {
      const savedAssets = await getSavedAssets();
      setAssets(savedAssets);
    } catch (error) {
      console.error("Failed to load home assets:", error);
      setAssetsError(true);
    } finally {
      setAssetsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadAssets();
    }, [loadAssets]),
  );

  const assetTotals = assets.reduce<Record<string, number>>((totals, asset) => {
    const value =
      asset.asset_type === "money"
        ? (asset.amount ?? 0)
        : (asset.weight_grams ?? 0) * (asset.price_per_gram ?? 0);

    totals[asset.currency] = (totals[asset.currency] ?? 0) + value;

    return totals;
  }, {});

  return (
    <View style={tw`flex-1 bg-[#FAF9F5]`}>
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`px-6 pt-12 pb-10`}
        showsVerticalScrollIndicator={false}
      >
        <View style={tw`flex-row items-center justify-between my-6`}>
          <View style={tw`flex-1 mr-4`}>
            <Text
              style={tw`text-[10px] font-bold uppercase tracking-[2px] text-[#9A7B45] mb-2`}
            >
              Your personal zakat space
            </Text>

            <Text
              style={tw`font-display text-[25px] leading-8 font-bold text-[#174C3C]`}
            >
              Assalamu Alaikum,
            </Text>

            <Text
              style={tw`font-display text-[25px] leading-8 italic text-[#174C3C]`}
            >
              {firstName}
            </Text>

            <Text style={tw`text-sm text-[#777D72] mt-2`}>
              Let's organize your giving.
            </Text>
          </View>
        </View>

        <View style={tw`bg-[#174C3C] rounded-[26px] p-5 mb-5 overflow-hidden`}>
          <View style={tw`flex-row items-center justify-between`}>
            <Text
              style={tw`text-[10px] font-bold uppercase tracking-[2px] text-[#DCE5D5]`}
            >
              Financial overview
            </Text>

            <View style={tw`w-2 h-2 rounded-full bg-[#D9BD83]`} />
          </View>

          {assetsLoading ? (
            <Text style={tw`text-white text-lg font-semibold mt-5`}>
              Loading assets...
            </Text>
          ) : assetsError ? (
            <>
              <Text style={tw`text-white text-lg font-semibold mt-5`}>
                Unable to load assets
              </Text>

              <Pressable onPress={() => void loadAssets()}>
                <Text style={tw`text-[#E4D0A5] text-xs mt-2 underline`}>
                  Try again
                </Text>
              </Pressable>
            </>
          ) : assets.length === 0 ? (
            <>
              <Text style={tw`font-display text-3xl text-white mt-5`}>
                Start with one.
              </Text>

              <Text style={tw`text-xs leading-5 text-[#DCE5D5] mt-2`}>
                Add your money or gold to begin organizing your assets.
              </Text>
            </>
          ) : (
            <>
              <View style={tw`flex-row items-baseline mt-5`}>
                <Text style={tw`font-display text-4xl text-white`}>
                  {assets.length.toString().padStart(2, "0")}
                </Text>

                <Text style={tw`text-sm text-[#DCE5D5] ml-3`}>
                  {assets.length === 1 ? "saved asset" : "saved assets"}
                </Text>
              </View>

              <Text style={tw`text-xs leading-5 text-[#DCE5D5] mt-2`}>
                Your saved financial assets, all in one place.
              </Text>
            </>
          )}

          <View style={tw`h-px bg-white/20 my-5`} />

          <Pressable
            onPress={() => router.push("/assets")}
            accessibilityRole="button"
            style={({ pressed }) => [
              tw`flex-row items-center justify-between bg-[#FAF9F5] rounded-xl px-4 py-3.5`,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={tw`text-sm font-bold text-[#174C3C]`}>
              Manage saved assets
            </Text>

            <Text style={tw`text-lg text-[#174C3C]`}>→</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => router.push("/quick-calculation")}
          accessibilityRole="button"
          style={({ pressed }) => [
            tw`flex-row items-center py-4 px-4 mb-8 rounded-2xl border border-[#DCE5D5] bg-[#F0F4ED]`,
            pressed && { opacity: 0.8 },
          ]}
        >
          <View
            style={tw`w-10 h-10 rounded-xl bg-white items-center justify-center mr-3`}
          >
            <Text style={tw`text-lg text-[#174C3C]`}>↗</Text>
          </View>

          <View style={tw`flex-1 mr-3`}>
            <Text style={tw`text-sm font-bold text-[#174C3C]`}>
              Quick calculation
            </Text>

            <Text style={tw`text-xs leading-5 text-[#6B7867] mt-1`}>
              Calculate without saving your assets.
            </Text>
          </View>

          <Text style={tw`text-lg text-[#174C3C]`}>→</Text>
        </Pressable>

        <View style={tw`mb-4`}>
          <Text style={tw`font-display text-[25px] text-[#174C3C]`}>
            Calculate zakat
          </Text>

          <Text style={tw`text-xs text-[#85897F] mt-2`}>
            Choose what you'd like to calculate.
          </Text>
        </View>

        <View>
          {zakatOptions?.map((item: any) => {
            const IconComponent = item.icon;

            return (
              <Pressable
                key={item.title}
                onPress={() => router.push(item.route as never)}
                accessibilityRole="button"
                accessibilityLabel={`Calculate ${item.title}`}
                style={({ pressed }) => [
                  tw`flex-row items-center py-4 border-b border-[#E9E6DC]`,
                  pressed && { opacity: 0.65 },
                ]}
              >
                <View
                  style={[
                    tw`w-11 h-11 rounded-xl items-center justify-center mr-4`,
                    { backgroundColor: item.bg },
                  ]}
                >
                  <IconComponent
                    size={21}
                    color={item.accent}
                    strokeWidth={1.8}
                  />
                </View>

                <View style={tw`flex-1 mr-3`}>
                  <Text style={tw`text-sm font-bold text-[#24382D]`}>
                    {item.title}
                  </Text>

                  <Text style={tw`text-xs leading-5 text-[#85897F] mt-1`}>
                    {item.subtitle}
                  </Text>
                </View>

                <Text style={tw`text-lg text-[#9A7B45]`}>→</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={tw`mt-8 mb-6`}>
          <View style={tw`flex-row items-center mb-3`}>
            <View style={tw`w-1 h-4 rounded-full bg-[#C59A55] mr-2`} />

            <Text
              style={tw`text-[10px] font-bold uppercase tracking-[2px] text-[#648064]`}
            >
              A gentle reminder
            </Text>
          </View>

          <Text style={tw`text-xs leading-6 text-[#777D72]`}>
            Your zakat calculation depends on the applicable rules, nisab
            threshold, and the information you provide. Review your
            circumstances before making a payment.
          </Text>
        </View>

        <LogoutButton />
      </ScrollView>
    </View>
  );
}
