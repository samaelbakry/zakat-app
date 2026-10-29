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
import {
  BanknoteIcon,
  Gem,
  Germ,
  HandCoins,
  Sparkle,
  SquareDashedPlus,
} from "lucide-react-native";

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
    <View style={tw`flex-1 bg-[#FAF9F5]`}>
      <ScrollView
        contentContainerStyle={tw`px-6 pt-8 pb-10`}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          style={({ pressed }) => [
            tw`self-start flex-row items-center mb-8`,
            pressed && { opacity: 0.65 },
          ]}
        >
          <Text style={tw`text-lg text-[#174C3C] mr-2`}>←</Text>
          <Text style={tw`text-sm font-semibold text-[#174C3C]`}>Back</Text>
        </Pressable>

        <View style={tw`mb-6`}>
          <View style={tw`flex-row items-center mb-3`}>
            <View style={tw`w-2 h-2 rounded-full bg-[#C59A55] mr-2`} />
            <Text
              style={tw`text-[10px] font-bold uppercase tracking-[2px] text-[#648064]`}
            >
              Your collection
            </Text>
          </View>

          <Text
            style={tw`font-display text-[34px] leading-[42px] text-[#174C3C]`}
          >
            Saved assets
          </Text>

          <Text style={tw`text-sm leading-6 text-[#777D72] mt-2`}>
            Everything you’ve saved, organized in one place.
          </Text>
        </View>

        <View style={tw`bg-[#174C3C] rounded-[26px] p-5 mb-8`}>
          <View style={tw`flex-row items-center justify-between`}>
            <Text style={tw`text-xs text-[#DCE5D5]`}>Total saved</Text>

            <HandCoins size={21} color="#E4D0A5" />
          </View>

          <View style={tw`flex-row items-baseline mt-4`}>
            <Text style={tw`font-display text-4xl text-white`}>
              {assets.length.toString().padStart(2, "0")}
            </Text>

            <Text style={tw`text-sm text-[#DCE5D5] ml-3`}>
              {assets.length === 1 ? "saved asset" : "saved assets"}
            </Text>
          </View>

          <Text style={tw`text-xs leading-5 text-[#C8D9C4] mt-2`}>
            Your money and gold, all in one place.
          </Text>

          <View style={tw`h-px bg-white/20 my-5`} />

          <Pressable
            onPress={() => router.push("/money")}
            accessibilityRole="button"
            style={({ pressed }) => [
              tw`flex-row items-center justify-between bg-[#FAF9F5] rounded-xl px-4 py-3.5`,
              pressed && { opacity: 0.8 },
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

            <Text style={tw`text-lg text-[#174C3C]`}>→</Text>
          </Pressable>
        </View>

        <View style={tw`flex-row items-center justify-between mb-4`}>
          <View>
            <Text style={tw`font-display text-[25px] text-[#174C3C]`}>
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
              tw`w-10 h-10 rounded-xl bg-white border border-[#E7E5DB] items-center justify-center`,
              pressed && { opacity: 0.7 },
              loading && { opacity: 0.5 },
            ]}
          >
            <Text style={tw`text-xl text-[#174C3C]`}>↻</Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={tw`py-14 items-center`}>
            <ActivityIndicator size="large" color="#174C3C" />
            <Text style={tw`text-sm text-[#777D72] mt-4`}>
              Loading your assets...
            </Text>
          </View>
        ) : error ? (
          <View style={tw`bg-white rounded-2xl p-5 border border-[#E9E6DC]`}>
            <Text style={tw`text-base font-bold text-[#24382D] mb-2`}>
              Couldn't load your assets
            </Text>
            <Text style={tw`text-sm text-[#777D72] leading-6 mb-5`}>
              {error}
            </Text>
            <Pressable
              onPress={loadAssets}
              style={tw`bg-[#174C3C] rounded-xl py-3.5 items-center`}
            >
              <Text style={tw`text-white font-bold text-sm`}>Try again</Text>
            </Pressable>
          </View>
        ) : assets.length === 0 ? (
          <View style={tw`bg-white rounded-2xl p-6 border border-[#E9E6DC]`}>
            <View
              style={tw`w-12 h-12 rounded-xl bg-[#E8EEE5] items-center justify-center mb-4`}
            >
              <SquareDashedPlus size={23} color="#174C3C" />
            </View>

            <Text style={tw`font-display text-xl text-[#174C3C]`}>
              Nothing saved yet
            </Text>
            <Text style={tw`text-sm text-[#777D72] leading-6 mt-2 mb-5`}>
              Add your money or gold to start organizing your zakat records.
            </Text>

            <Pressable
              onPress={() => router.push("/money")}
              style={tw`self-start bg-[#174C3C] rounded-xl px-5 py-3.5`}
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
                style={tw`bg-white rounded-2xl p-4 mb-4 border border-[#E9E6DC]`}
              >
                <View style={tw`flex-row items-center`}>
                  <View
                    style={[
                      tw`w-11 h-11 rounded-xl items-center justify-center mr-3`,
                      { backgroundColor: isGold ? "#F5EBD7" : "#E8EEE5" },
                    ]}
                  >
                    {isGold ? (
                      <Gem size={21} color="#A77A35" />
                    ) : (
                      <BanknoteIcon size={21} color="#174C3C" />
                    )}
                  </View>

                  <View style={tw`flex-1 mr-2`}>
                    <Text
                      style={tw`text-[10px] font-bold tracking-wider text-[#85897F]`}
                    >
                      {isGold ? "GOLD ASSET" : "MONEY & SAVINGS"}
                    </Text>
                    <Text
                      style={tw`text-sm font-bold text-[#24382D] mt-1`}
                      numberOfLines={2}
                    >
                      {asset.name}
                    </Text>
                  </View>

                  <View
                    style={[
                      tw`px-2.5 py-1.5 rounded-lg`,
                      { backgroundColor: isGold ? "#F8F0E0" : "#EDF3E9" },
                    ]}
                  >
                    <Text style={tw`text-xs font-bold text-[#174C3C]`}>
                      {isGold ? `${asset.purity}K` : asset.currency}
                    </Text>
                  </View>
                </View>

                <View style={tw`mt-4 pt-4 border-t border-[#F0EEE6]`}>
                  <Text style={tw`text-xs text-[#85897F] mb-1.5`}>
                    {isGold ? "Gold weight" : "Saved amount"}
                  </Text>

                  <Text style={tw`font-display text-[26px] text-[#174C3C]`}>
                    {isGold
                      ? `${asset.weight_grams ?? 0} g`
                      : formatAmount(asset.amount, asset.currency)}
                  </Text>

                  {isGold && (
                    <View style={tw`mt-3`}>
                      <Text style={tw`text-xs text-[#85897F] mb-1`}>
                        Estimated value
                      </Text>
                      <Text style={tw`text-sm font-bold text-[#A77A35]`}>
                        {formatAmount(
                          asset.weight_grams != null &&
                            asset.price_per_gram != null
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
                    tw`mt-4 pt-3 border-t border-[#F0EEE6]`,
                    pressed && { opacity: 0.65 },
                    isDeleting && { opacity: 0.5 },
                  ]}
                >
                  <Text style={tw`text-xs font-semibold text-[#A34F46]`}>
                    {isDeleting ? "Deleting..." : "Delete asset"}
                  </Text>
                </Pressable>
              </View>
            );
          })
        )}

        {!loading && !error && assets.length > 0 && (
          <View style={tw`mt-3 pt-5 border-t border-[#E7E4D9]`}>
            <View style={tw`flex-row items-center mb-2`}>
              <View style={tw`w-1 h-4 rounded-full bg-[#C59A55] mr-2`} />
              <Text style={tw`text-xs font-bold text-[#174C3C]`}>
                Keep your records up to date
              </Text>
            </View>

            <Text style={tw`text-xs leading-5 text-[#777D72]`}>
              Review your saved amounts and gold prices before calculating your
              zakat.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
