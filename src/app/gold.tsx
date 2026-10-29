import { createSavedAsset } from "@/services/assets";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import tw from "twrnc";

const goldPurities = [
  { label: "24K", purity: 24 },
  { label: "22K", purity: 22 },
  { label: "21K", purity: 21 },
  { label: "18K", purity: 18 },
];

export default function Gold() {
  const [name, setName] = useState("Gold amount");
  const [weight, setWeight] = useState("");
  const [pricePerGram, setPricePerGram] = useState("");
  const [currency, setCurrency] = useState<"EGP" | "USD">("EGP");
  const [purity, setPurity] = useState(21);
  const [showResult, setShowResult] = useState(false);
  const [saving, setSaving] = useState(false);

  const numericWeight = Number(weight);
  const numericPrice = Number(pricePerGram);

  const isValid =
    weight.trim() !== "" &&
    pricePerGram.trim() !== "" &&
    Number.isFinite(numericWeight) &&
    Number.isFinite(numericPrice) &&
    numericWeight > 0 &&
    numericPrice > 0;

  const goldValue = numericWeight * numericPrice;
  const estimatedZakat = goldValue * 0.025;

  function calculateZakat() {
    if (!isValid) {
      Alert.alert(
        "Check your entries",
        "Enter a valid weight and a price greater than zero.",
      );
      return;
    }

    setShowResult(true);
  }

  function formatAmount(value: number) {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  async function saveAsset() {
    if (!name.trim()) {
      Alert.alert("Missing name", "Enter a name for this asset.");
      return;
    }

    if (!isValid) {
      Alert.alert(
        "Invalid values",
        "Enter a valid weight and price greater than zero.",
      );
      return;
    }

    try {
      setSaving(true);

      await createSavedAsset({
        asset_type: "gold",
        name: name.trim(),
        currency,
        weight_grams: numericWeight,
        purity: purity as 18 | 21 | 22 | 24,
        price_per_gram: numericPrice,
      });

      Alert.alert("Saved successfully", "Your gold asset has been saved.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Save gold asset error:", error);

      Alert.alert(
        "Couldn't save asset",
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={tw`flex-1 bg-[#FAF9F5]`}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={tw`px-6 pt-8 pb-12`}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => router.replace("/home")}
          style={({ pressed }) => [
            tw`self-start flex-row items-center mb-9`,
            pressed && tw`opacity-60`,
          ]}
        >
          <Text style={tw`text-base text-[#174C3C] mr-2`}>←</Text>
          <Text style={tw`text-sm font-semibold text-[#174C3C]`}>Back</Text>
        </Pressable>

        <View style={tw`flex-row items-center mb-4`}>
          <View style={tw`w-1.5 h-1.5 rounded-full bg-[#C59A55] mr-2`} />
          <Text
            style={tw`text-xs font-bold uppercase tracking-widest text-[#A77A35]`}
          >
            Zakat calculator
          </Text>
        </View>

        <Text
          style={[tw`text-4xl text-[#174C3C] mb-3`, { fontFamily: "Georgia" }]}
        >
          Gold & jewelry.
        </Text>

        <Text style={tw`text-sm leading-6 text-[#777D72] mb-8`}>
          Enter your gold weight and its current price to estimate its value and
          a preliminary zakat amount.
        </Text>

        <View style={tw`flex-row items-center mb-3`}>
          <Text
            style={tw`text-xs font-bold uppercase tracking-widest text-[#648064]`}
          >
            01
          </Text>
          <View style={tw`h-px flex-1 bg-[#E5E2D8] ml-3`} />
          <Text style={tw`text-xs text-[#85897F] ml-3`}>Gold details</Text>
        </View>

        <View style={tw`bg-white rounded-3xl p-5 border border-[#EAE8DF]`}>
          <Text style={tw`text-sm font-bold text-[#24382D] mb-3`}>
            Gold purity
          </Text>

          <View style={tw`flex-row flex-wrap gap-2 mb-6`}>
            {goldPurities.map((item) => {
              const selected = purity === item.purity;

              return (
                <Pressable
                  key={item.purity}
                  onPress={() => {
                    setPurity(item.purity);
                    setShowResult(false);
                  }}
                  style={[
                    tw`px-4 py-3 rounded-xl border`,
                    selected
                      ? tw`bg-[#174C3C] border-[#174C3C]`
                      : tw`bg-[#FAF9F5] border-[#E5E2D8]`,
                  ]}
                >
                  <Text
                    style={{
                      color: selected ? "#FFFFFF" : "#765A2C",
                      fontWeight: "700",
                    }}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={tw`text-sm font-bold text-[#24382D] mb-2`}>
            Currency
          </Text>

          <View style={tw`flex-row bg-[#F7F5EF] rounded-xl p-1 mb-6`}>
            {(["EGP", "USD"] as const).map((item) => {
              const selected = currency === item;

              return (
                <Pressable
                  key={item}
                  onPress={() => {
                    setCurrency(item);
                    setShowResult(false);
                  }}
                  style={[
                    tw`flex-1 rounded-lg py-3 items-center`,
                    selected && tw`bg-white`,
                  ]}
                >
                  <Text
                    style={[
                      tw`text-sm font-bold`,
                      { color: selected ? "#174C3C" : "#85897F" },
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={tw`text-sm font-bold text-[#24382D] mb-2`}>
            Gold weight
          </Text>

          <Text style={tw`text-xs text-[#85897F] mb-3`}>
            Enter the total weight of your gold in grams.
          </Text>

          <View
            style={tw`flex-row items-center border border-[#E5E2D8] bg-[#FAF9F5] rounded-2xl px-4 mb-6`}
          >
            <TextInput
              value={weight}
              onChangeText={(value) => {
                setWeight(value);
                setShowResult(false);
              }}
              placeholder="e.g. 50"
              placeholderTextColor="#A2A497"
              keyboardType="decimal-pad"
              style={tw`flex-1 py-4 text-base text-[#24382D]`}
            />
            <Text style={tw`text-sm text-[#85897F]`}>grams</Text>
          </View>

          <Text style={tw`text-sm font-bold text-[#24382D] mb-2`}>
            Price per gram
          </Text>

          <Text style={tw`text-xs text-[#85897F] mb-3`}>
            Current price for{" "}
            {goldPurities.find((item) => item.purity === purity)?.label} gold,
            in {currency}.
          </Text>

          <View
            style={tw`flex-row items-center border border-[#E5E2D8] bg-[#FAF9F5] rounded-2xl px-4`}
          >
            <Text style={tw`text-sm font-bold text-[#A77A35] mr-3`}>
              {currency}
            </Text>
            <TextInput
              value={pricePerGram}
              onChangeText={(value) => {
                setPricePerGram(value);
                setShowResult(false);
              }}
              placeholder="Price per gram"
              placeholderTextColor="#A2A497"
              keyboardType="decimal-pad"
              style={tw`flex-1 py-4 text-base text-[#24382D]`}
            />
          </View>

          <View style={tw`flex-row mt-4`}>
            <View style={tw`w-1 rounded-full bg-[#C59A55] mr-3`} />
            <Text style={tw`flex-1 text-xs leading-5 text-[#85897F]`}>
              Use a price matching your selected purity. Live gold prices are
              not fetched by the app yet.
            </Text>
          </View>

          <Pressable
            onPress={calculateZakat}
            style={({ pressed }) => [
              tw`mt-7 rounded-2xl bg-[#174C3C] py-4 flex-row items-center justify-center`,
              pressed && tw`opacity-80`,
            ]}
          >
            <Text style={tw`text-white font-bold text-base mr-2`}>
              Calculate estimate
            </Text>
            <Text style={tw`text-[#E4D0A5] text-lg`}>→</Text>
          </Pressable>

          <Pressable
            onPress={saveAsset}
            disabled={saving}
            style={({ pressed }) => [
              tw`rounded-2xl border border-[#174C3C]/25 py-4 items-center mt-3`,
              pressed && tw`opacity-70`,
              saving && tw`opacity-50`,
            ]}
          >
            <Text style={tw`text-[#174C3C] font-bold text-base`}>
              {saving ? "Saving..." : "Save asset"}
            </Text>
          </Pressable>
        </View>

        {showResult && (
          <View
            style={tw`mt-6 bg-[#F4E9D3] rounded-3xl p-6 border border-[#E4D2AD]`}
          >
            <View style={tw`flex-row items-center mb-5`}>
              <View style={tw`w-1.5 h-1.5 rounded-full bg-[#A77A35] mr-2`} />
              <Text
                style={tw`text-xs font-bold uppercase tracking-widest text-[#8C682F]`}
              >
                Your estimate
              </Text>
            </View>

            <Text style={tw`text-sm text-[#765F37]`}>Estimated gold value</Text>

            <Text
              style={[
                tw`text-2xl text-[#62491F] mt-2`,
                { fontFamily: "Georgia", fontWeight: "bold" },
              ]}
            >
              {formatAmount(goldValue)}
            </Text>

            <View style={tw`h-px bg-[#D9C69F] my-5`} />

            <Text style={tw`text-sm text-[#765F37]`}>
              Preliminary 2.5% estimate
            </Text>

            <Text
              style={[
                tw`text-3xl text-[#62491F] mt-2`,
                { fontFamily: "Georgia", fontWeight: "bold" },
              ]}
            >
              {formatAmount(estimatedZakat)}
            </Text>

            <Text style={tw`text-xs leading-5 text-[#765F37] mt-4`}>
              This is a mathematical estimate, not confirmation that zakat is
              due. Nisab, the applicable lunar-year requirement, the type of
              gold, and guidance relevant to your circumstances should be
              considered separately.
            </Text>
          </View>
        )}

        <Text style={tw`text-xs text-center leading-5 text-[#85897F] mt-7`}>
          Mindful giving starts with clarity.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
