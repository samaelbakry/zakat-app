import { useCallback, useState } from "react";
import { useFocusEffect, router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import tw from "twrnc";
import {
  deleteSavedAsset,
  getSavedAssets,
  type SavedAsset,
} from "@/services/assets";
import { BanknoteIcon, Germ, HandCoins, Sparkle, SquareDashedPlus } from "lucide-react-native";

export default function AssetsScreen() {
  const [assets, setAssets] = useState<SavedAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadAssets = useCallback(async () => {
    try {
      setError("");
      setLoading(true);

      const result = await getSavedAssets();
      setAssets(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Couldn't load saved assets.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAssets();
    }, [loadAssets]),
  );

  function formatAmount(value: number | null, currency: string) {
    if (value === null) return "—";

    return `${value.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })} ${currency}`;
  }

  function confirmDelete(asset: SavedAsset) {
    Alert.alert(
      "Delete asset?",
      `Are you sure you want to delete "${asset.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeletingId(asset.id);

              await deleteSavedAsset(asset.id);

              setAssets((current) =>
                current.filter((item) => item.id !== asset.id),
              );
            } catch (err) {
              Alert.alert(
                "Couldn't delete asset",
                err instanceof Error ? err.message : "Please try again.",
              );
            } finally {
              setDeletingId(null);
            }
          },
        },
      ],
    );
  }

  return (
    <View style={tw`flex-1 bg-[#F7F5EF]`}>
      <View
        pointerEvents="none"
        style={tw`absolute -top-16 -right-20 w-56 h-56 rounded-full bg-[#DCE8D8]/30`}
      />

      <View
        pointerEvents="none"
        style={tw`absolute top-1/3 -left-24 w-52 h-52 rounded-full bg-[#E8EDE2]/40`}
      />

      <ScrollView
        contentContainerStyle={tw`px-5 pt-14 pb-10`}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={({ pressed }) => [
            tw`self-start flex-row items-center bg-white border border-[#E9E7DE] rounded-2xl px-4 py-3 mb-8`,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Text style={tw`text-[#174C3C] font-bold text-sm`}>← Back</Text>
        </Pressable>

        <View style={tw`mb-5`}>
          <View style={tw`flex-row items-center mb-2`}>
            <View style={tw`w-2 h-2 rounded-full bg-[#C59A55] mr-2`} />

            <Text
              style={tw`text-xs font-bold uppercase tracking-widest text-[#648064]`}
            >
              Your collection
            </Text>
          </View>
        </View>

        <View style={tw`bg-[#174C3C] rounded-[28px] p-5 mb-8 overflow-hidden`}>
          <View
            pointerEvents="none"
            style={tw`absolute -top-12 -right-10 w-36 h-36 rounded-full border border-white/10`}
          />
          <View
            pointerEvents="none"
            style={tw`absolute -top-5 -right-3 w-24 h-24 rounded-full border border-white/10`}
          />

          <View style={tw`flex-row items-center justify-between`}>
            <Text style={tw`text-xs font-medium text-[#C8D9C4]`}>
              Total saved
            </Text>

            <View
              style={tw`w-10 h-10 rounded-xl bg-white/10 border border-white/10 items-center justify-center`}
            >
                <HandCoins style={tw`text-white`}/>
            </View>
          </View>

          <View style={tw`mt-3`}>
            <View style={tw`flex-row items-baseline`}>
              <Text style={tw`text-4xl font-bold text-white`}>
                {assets.length <=0 ? 0 : assets.length.toString().padStart(2,"0") } 
              </Text>

              <Text style={tw`text-sm font-medium text-[#DCE8D8] ml-3`}>
                {assets.length === 1 ? "saved asset" : "saved assets"}
              </Text>
            </View>

            <Text style={tw`text-xs text-[#B7CBB5] mt-2 leading-5`}>
              Your money and gold, organized in one place.
            </Text>
          </View>

          <View style={tw`h-px bg-white/15 my-5`} />

          <Pressable
            onPress={() => router.push("/money")}
            accessibilityRole="button"
            accessibilityLabel="Add a money asset"
            style={({ pressed }) => [
              tw`flex-row items-center justify-between bg-[#F7F5EF] rounded-2xl px-4 py-3`,
              pressed && {
                opacity: 0.85,
                transform: [{ scale: 0.98 }],
              },
            ]}
          >
            <View style={tw`flex-1 mr-3`}>
              <Text style={tw`text-sm font-bold text-[#174C3C]`}>
                Add a new asset
              </Text>

              <Text style={tw`text-xs text-[#648064] mt-1`}>
                Start tracking your savings
              </Text>
            </View>

            <View
              style={tw`w-9 h-9 rounded-full bg-[#174C3C] items-center justify-center`}
            >
              <Text style={tw`text-lg font-bold text-white`}>→</Text>
            </View>
          </Pressable>
        </View>

        <View style={tw`flex-row items-center justify-between mb-4`}>
          <View>
            <Text style={tw`text-xl font-bold text-[#24382D]`}>
              Your assets
            </Text>

            <Text style={tw`text-xs text-[#85897F] mt-1`}>
              Manage your saved records
            </Text>
          </View>

          <Pressable
            onPress={loadAssets}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Refresh saved assets"
            style={({ pressed }) => [
              tw`w-11 h-11 rounded-2xl bg-white border border-[#E9E7DE] items-center justify-center`,
              pressed && { opacity: 0.7 },
              loading && { opacity: 0.5 },
            ]}
          >
            <Text style={tw`text-xl font-bold text-[#174C3C]`}>↻</Text>
          </Pressable>
        </View>

        {loading ? (
          <View
            style={tw`bg-white rounded-[28px] py-14 px-6 items-center border border-[#E9E7DE]`}
          >
            <ActivityIndicator size="large" color="#174C3C" />

            <Text style={tw`text-sm text-[#777D72] mt-4`}>
              Loading your assets...
            </Text>
          </View>
        ) : error ? (
          <View style={tw`bg-white rounded-[28px] p-6 border border-[#E9E7DE]`}>
            <View
              style={tw`w-12 h-12 rounded-2xl bg-[#FCF0ED] items-center justify-center mb-4`}
            >
              <Text style={tw`text-xl text-[#A34F46]`}>!</Text>
            </View>

            <Text style={tw`text-lg font-bold text-[#24382D] mb-2`}>
              Couldn't load your assets
            </Text>

            <Text style={tw`text-sm text-[#777D72] leading-6 mb-5`}>
              {error}
            </Text>

            <Pressable
              onPress={loadAssets}
              style={({ pressed }) => [
                tw`bg-[#174C3C] rounded-2xl py-4 items-center`,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={tw`text-white font-bold`}>Try again</Text>
            </Pressable>
          </View>
        ) : assets.length === 0 ? (
          <View
            style={tw`bg-white rounded-[28px] p-7 items-center border border-[#E9E7DE]`}
          >
            <View
              style={tw`w-16 h-16 rounded-3xl bg-[#E5EDE1] items-center justify-center mb-5`}
            >
             <SquareDashedPlus />
            </View>

            <Text style={tw`text-lg font-bold text-[#174C3C]`}>
              No saved assets yet
            </Text>

            <Text
              style={tw`text-sm text-[#777D72] text-center leading-6 mt-2 mb-5`}
            >
              Add your money or gold to keep your zakat records organized.
            </Text>

            <Pressable
              onPress={() => router.push("/money")}
              style={({ pressed }) => [
                tw`bg-[#174C3C] rounded-2xl px-6 py-3.5`,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={tw`text-white font-bold text-sm`}>
                Add your first asset →
              </Text>
            </Pressable>
          </View>
        ) : (
          assets.map((asset) => {
            const isGold = asset.asset_type === "gold";
            const isDeleting = deletingId === asset.id;

            return (
              <View
                key={asset.id}
                style={tw`bg-white rounded-[26px] p-5 mb-4 border border-[#E9E7DE]`}
              >
                <View style={tw`flex-row items-start justify-between`}>
                  <View style={tw`flex-row items-center flex-1 mr-3`}>
                    <View
                      style={[
                        tw`w-12 h-12 rounded-2xl items-center justify-center mr-3`,
                        {
                          backgroundColor: isGold ? "#F5EBD7" : "#E5EDE1",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          tw`text-2xl font-bold`,
                          {
                            color: isGold ? "#A77A35" : "#174C3C",
                          },
                        ]}
                      >
                        {isGold ? <Germ/> : <BanknoteIcon/>}
                      </Text>
                    </View>

                    <View style={tw`flex-1`}>
                      <Text style={tw`text-xs font-semibold text-[#648064]`}>
                        {isGold ? "GOLD ASSET" : "MONEY & SAVINGS"}
                      </Text>

                      <Text
                        style={tw`text-base font-bold text-[#1A2E26] mt-1`}
                        numberOfLines={2}
                      >
                        {asset.name}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      tw`px-3 py-1.5 rounded-full border`,
                      {
                        backgroundColor: isGold ? "#FBF4E6" : "#EDF3E9",
                        borderColor: isGold ? "#E5D2AB" : "#CFDCC9",
                      },
                    ]}
                  >
                    <Text style={tw`text-xs font-bold text-[#174C3C]`}>
                      {isGold ? `${asset.purity}K` : asset.currency}
                    </Text>
                  </View>
                </View>

                <View style={tw`bg-[#F8F8F3] rounded-2xl p-4 mt-5`}>
                  <Text style={tw`text-xs text-[#85897F] mb-2`}>
                    {isGold ? "Gold weight" : "Saved amount"}
                  </Text>

                  <Text style={tw`text-2xl font-bold text-[#174C3C]`}>
                    {isGold
                      ? `${asset.weight_grams ?? 0} g`
                      : formatAmount(asset.amount, asset.currency)}
                  </Text>

                  {isGold && (
                    <View style={tw`mt-3 pt-3 border-t border-[#E8E9DF]`}>
                      <Text style={tw`text-xs text-[#85897F] mb-1`}>
                        Estimated value
                      </Text>

                      <Text style={tw`text-base font-bold text-[#A77A35]`}>
                        {formatAmount(
                          asset.weight_grams !== null &&
                            asset.price_per_gram !== null
                            ? asset.weight_grams * asset.price_per_gram
                            : null,
                          asset.currency,
                        )}
                      </Text>
                    </View>
                  )}
                </View>

                <Pressable
                  disabled={isDeleting}
                  onPress={() => confirmDelete(asset)}
                  accessibilityRole="button"
                  accessibilityLabel={`Delete ${asset.name}`}
                  style={({ pressed }) => [
                    tw`mt-4 bg-[#FCF5F3] border border-[#F0DFDA] rounded-xl py-3.5 items-center`,
                    pressed && { opacity: 0.7 },
                    isDeleting && { opacity: 0.5 },
                  ]}
                >
                  <Text style={tw`text-[#A34F46] font-semibold text-sm`}>
                    {isDeleting ? "Deleting..." : "Delete asset"}
                  </Text>
                </Pressable>
              </View>
            );
          })
        )}

        {!loading && !error && assets.length > 0 && (
          <View
            style={tw`bg-[#E8EDE2] rounded-[22px] p-5 mt-1 border border-[#DCE5D5]`}
          >
            <View style={tw`flex-row items-center mb-2`}>
              <View
                style={tw`w-8 h-8 rounded-xl bg-[#D5E2D0] items-center justify-center mr-3`}
              >
                <Text style={tw`text-[#174C3C] font-bold`}>i</Text>
              </View>

              <Text style={tw`text-sm font-bold text-[#174C3C]`}>
                Keep your records up to date
              </Text>
            </View>

            <Text style={tw`text-xs text-[#61725D] leading-5`}>
              Review your saved amounts and gold prices before calculating your
              zakat.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
