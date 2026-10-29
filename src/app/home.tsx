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
      <View
        style={tw`absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#174C3C]/5`}
      />
      <View
        style={tw`absolute top-1/3 -left-20 w-60 h-60 rounded-full bg-[#DCE8D8]/20 `}
      />

      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`px-6 pt-16 pb-12`}
        showsVerticalScrollIndicator={false}
      >
        <View style={tw`flex-row items-center justify-between mb-8`}>
          <View style={tw`flex-1 mr-4`}>
            <View style={tw`flex-row items-center mb-2.5`}>
              <View style={tw`w-2 h-2 rounded-full bg-[#C59A55] mr-2`} />
              <Text
                style={tw`text-[11px] font-bold tracking-wider text-[#648064] uppercase`}
              >
                Your Personal Zakat Space
              </Text>
            </View>

            <Text style={tw`text-2xl font-bold text-[#1A2E26] tracking-tight`}>
              Assalamu Alaikum, {firstName}
            </Text>

            <Text style={tw`text-sm text-[#6B7265] mt-1.5`}>
              Let's organize your giving.
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open profile"
            style={({ pressed }) => [
              tw`w-13 h-13 rounded-2xl bg-white border border-[#E5E2D8] items-center justify-center shadow-sm shadow-black/5`,
              pressed && tw`opacity-80 transform scale-95`,
            ]}
          >
            <View
              style={tw`w-9 h-9 rounded-xl bg-[#F0F4ED] items-center justify-center`}
            >
              <Text style={tw`text-xl text-[#174C3C]`}>👤</Text>
            </View>
          </Pressable>
        </View>

        <View
          style={tw`bg-[#174C3C] rounded-[32px] p-7 mb-6 overflow-hidden shadow-xl shadow-[#174C3C]/20 relative`}
        >
          <View
            style={tw`absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/5`}
          />

          <View style={tw`flex-row items-start justify-between`}>
            <View style={tw`flex-1 mr-3`}>
              <Text
                style={tw`text-[#C8D9C4] text-xs font-semibold uppercase tracking-wider`}
              >
                Financial Overview
              </Text>

              {assetsLoading ? (
                <Text style={tw`text-white text-xl font-bold mt-3`}>
                  Loading assets...
                </Text>
              ) : assetsError ? (
                <>
                  <Text style={tw`text-white text-xl font-bold mt-3`}>
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
                  <Text
                    style={tw`text-white text-2xl font-bold mt-3 tracking-tight`}
                  >
                    No assets yet
                  </Text>

                  <Text
                    style={tw`text-[#C8D9C4] text-xs mt-2.5 leading-5 max-w-[220px]`}
                  >
                    Add your money or gold to keep track of your assets.
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    style={tw`text-white text-2xl font-bold mt-3 tracking-tight`}
                  >
                    {assets.length} {assets.length === 1 ? "Asset" : "Assets"}
                  </Text>

                  <Text style={tw`text-[#C8D9C4] text-xs mt-2.5 leading-5`}>
                    Your saved financial assets at a glance.
                  </Text>
                </>
              )}
            </View>
          </View>

          <View style={tw`h-px bg-white/15 my-6`} />

          <Pressable
            style={({ pressed }) => [
              tw`flex-row items-center justify-between bg-white rounded-2xl px-5 py-4 shadow-sm`,
              pressed && tw`opacity-90 transform scale-[0.98]`,
            ]}
            onPress={() => router.push("/assets")}
          >
            <View style={tw`flex-1 mr-2`}>
              <Text style={tw`text-[#174C3C] font-bold text-sm`}>
                Manage saved assets
              </Text>

              <Text style={tw`text-[#648064] text-xs mt-0.5`}>
                View, add and manage your assets
              </Text>
            </View>

            <View
              style={tw`w-8 h-8 rounded-full bg-[#F0F4ED] items-center justify-center`}
            >
              <Text style={tw`text-[#174C3C] text-sm font-bold`}>→</Text>
            </View>
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [
            tw`bg-[#F0F4ED] border border-[#DCE5D5] rounded-[28px] p-5 mb-8`,
            pressed && tw`opacity-85 transform scale-[0.98]`,
          ]}
          onPress={() => router.push("/quick-calculation")}
        >
          <View style={tw`flex-row items-center`}>
            <View
              style={tw`w-12 h-12 rounded-2xl bg-white items-center justify-center mr-4 border border-[#174C3C]/10 shadow-sm`}
            >
              <Text style={tw`text-[#174C3C] text-2xl`}>⚡</Text>
            </View>

            <View style={tw`flex-1`}>
              <Text style={tw`text-base font-bold text-[#174C3C]`}>
                Quick calculation
              </Text>
              <Text style={tw`text-xs text-[#5C6A5A] mt-1 leading-5`}>
                Calculate your zakat without saving your assets.
              </Text>
            </View>

            <View
              style={tw`w-8 h-8 rounded-full bg-[#174C3C] items-center justify-center ml-3`}
            >
              <Text style={tw`text-white text-xs font-bold`}>→</Text>
            </View>
          </View>
        </Pressable>

        <View style={tw`flex-row items-end justify-between mb-5`}>
          <View style={tw`flex-1 mr-3`}>
            <Text style={tw`text-xl font-bold text-[#1A2E26] tracking-tight`}>
              Calculate your zakat
            </Text>

            <Text style={tw`text-xs text-[#85897F] mt-1`}>
              Choose what you'd like to calculate.
            </Text>
          </View>

          <View
            style={tw`w-9 h-9 rounded-xl bg-[#E6EBDD] items-center justify-center border border-[#174C3C]/10`}
          >
            <Text style={tw`text-[#174C3C] text-sm`}>✦</Text>
          </View>
        </View>

        <View style={tw`flex-col`}>
          {zakatOptions?.map((item: any) => {
            const IconComponent = item.icon;

            return (
              <Pressable
                key={item.title}
                onPress={() => router.push(item.route as never)}
                accessibilityRole="button"
                accessibilityLabel={`Calculate ${item.title}`}
                style={({ pressed }) => [
                  tw`w-full flex-row items-center bg-white/90 border border-[#EAE8DF] rounded-[28px] p-5 mb-4 shadow-md shadow-black/5`,
                  pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
                ]}
              >
                <View
                  style={[
                    tw`w-14 h-14 rounded-2xl items-center justify-center border border-black/5 mr-4`,
                    { backgroundColor: item.bg },
                  ]}
                >
                  <IconComponent
                    size={24}
                    color={item.accent}
                    strokeWidth={2}
                  />
                </View>

                <View style={tw`flex-1`}>
                  <Text style={tw`text-base font-bold text-[#1A2E26]`}>
                    {item.title}
                  </Text>

                  <Text style={tw`text-xs text-[#85897F] mt-1.5 leading-5`}>
                    {item.subtitle}
                  </Text>

                  <View style={tw`flex-row items-center mt-3`}>
                    <Text
                      style={[
                        tw`text-xs font-bold tracking-wide`,
                        { color: item.accent },
                      ]}
                    >
                      Explore
                    </Text>

                    <Text
                      style={[
                        tw`text-sm ml-1.5 font-bold`,
                        { color: item.accent },
                      ]}
                    >
                      →
                    </Text>
                  </View>
                </View>

                <View
                  style={tw`w-9 h-9 rounded-full bg-[#F7F5EF] items-center justify-center ml-3`}
                >
                  <Text style={tw`text-[#174C3C] text-lg`}>›</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View
          style={tw`bg-white/80 rounded-[24px] p-5 mt-2 mb-6 border border-[#EAE8DF] shadow-sm shadow-black/5`}
        >
          <View style={tw`flex-row items-center mb-2.5`}>
            <View
              style={tw`w-8 h-8 rounded-xl bg-[#F0F4ED] items-center justify-center mr-3 border border-[#174C3C]/10`}
            >
              <Text style={tw`text-[#174C3C] text-xs font-bold`}>ℹ</Text>
            </View>

            <Text style={tw`text-sm font-bold text-[#174C3C]`}>
              A note on your zakat
            </Text>
          </View>

          <Text style={tw`text-xs text-[#61725D] leading-5`}>
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
