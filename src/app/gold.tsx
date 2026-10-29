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
        contentContainerStyle={tw`px-6 pt-14 pb-10`}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => router.push("/home")}
          style={tw`self-start mb-7 px-4 py-2 rounded-full bg-white border border-[#E5E2D8]`}
        >
          <Text style={tw`text-[#174C3C] font-semibold`}>← Back</Text>
        </Pressable>

        <View style={tw`flex-row items-center mb-3`}>
          <View
            style={tw`w-11 h-11 rounded-2xl bg-[#F4E9D3] items-center justify-center mr-3`}
          >
            <Text style={tw`text-2xl text-[#A77A35]`}>◇</Text>
          </View>

          <Text
            style={tw`text-xs font-bold uppercase tracking-widest text-[#A77A35]`}
          >
            Gold calculator
          </Text>
        </View>

        <Text style={tw`text-3xl font-bold text-[#1A2E26]`}>
          Gold & jewelry
        </Text>

        <Text style={tw`text-sm leading-6 text-[#6B7265] mt-3 mb-8`}>
          Enter the weight and current price per gram for your gold purity to
          estimate its value.
        </Text>

        <View style={tw`bg-white rounded-3xl p-5 border border-[#EAE8DF]`}>
          <Text style={tw`text-sm font-bold text-[#1A2E26] mb-3`}>
            Gold purity
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Emergency savings"
            placeholderTextColor="#A2A497"
            style={tw`border border-[#E5E2D8] bg-[#FAF9F5] rounded-2xl px-5 py-4 text-base text-[#1A2E26] mb-6`}
          />

          <Text
            style={tw`text-xs font-bold uppercase tracking-wide text-[#5C6356] mb-3`}
          >
            Currency
          </Text>

          <View style={tw`flex-row gap-3 mb-6`}>
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
                    tw`flex-1 py-3.5 rounded-xl items-center border`,
                    selected
                      ? tw`bg-[#174C3C] border-[#174C3C]`
                      : tw`bg-[#FAF9F5] border-[#E5E2D8]`,
                  ]}
                >
                  <Text
                    style={[
                      tw`font-bold`,
                      { color: selected ? "#FFFFFF" : "#5C6356" },
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text
            style={tw`text-xs font-bold uppercase tracking-wide text-[#5C6356] mb-2.5`}
          >
            Total amount ({currency})
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
                      ? tw`bg-[#A77A35] border-[#A77A35]`
                      : tw`bg-white border-[#E5E2D8]`,
                  ]}
                >
                  <Text
                    style={[
                      tw`font-bold`,
                      { color: selected ? "#FFFFFF" : "#765A2C" },
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={tw`text-sm font-bold text-[#1A2E26] mb-3`}>
            Gold weight (grams)
          </Text>

          <TextInput
            value={weight}
            onChangeText={(value) => {
              setWeight(value);
              setShowResult(false);
            }}
            placeholder="e.g. 50"
            placeholderTextColor="#A2A497"
            keyboardType="decimal-pad"
            style={tw`border border-[#E5E2D8] rounded-2xl px-4 py-4 text-lg text-[#1A2E26] mb-6`}
          />

          <Text style={tw`text-sm font-bold text-[#1A2E26] mb-3`}>
            Price per gram (
            {goldPurities.find((item) => item.purity === purity)?.label})
          </Text>

          <TextInput
            value={pricePerGram}
            onChangeText={(value) => {
              setPricePerGram(value);
              setShowResult(false);
            }}
            placeholder="Enter current price per gram"
            placeholderTextColor="#A2A497"
            keyboardType="decimal-pad"
            style={tw`border border-[#E5E2D8] rounded-2xl px-4 py-4 text-lg text-[#1A2E26]`}
          />

          <Text style={tw`text-xs leading-5 text-[#85897F] mt-3`}>
            Enter the price in your chosen currency. Use a price that matches
            the selected purity. The app does not fetch live gold prices yet.
          </Text>

          <Pressable
            onPress={calculateZakat}
            style={({ pressed }) => [
              tw`mt-6 rounded-2xl bg-[#174C3C] py-4 items-center`,
              pressed && tw`opacity-80`,
            ]}
          >
            <Text style={tw`text-white font-bold text-base`}>
              Calculate estimate
            </Text>
          </Pressable>
          <Pressable
            onPress={saveAsset}
            disabled={saving}
            style={({ pressed }) => [
              tw`rounded-2xl border border-[#174C3C] py-4 items-center mt-3`,
              pressed && tw`opacity-80`,
              saving && tw`opacity-50`,
            ]}
          >
            <Text style={tw`text-[#174C3C] font-bold text-base`}>
              {saving ? "Saving..." : "Save asset"}
            </Text>
          </Pressable>
        </View>

        {showResult && (
          <View style={tw`mt-6 bg-[#F4E9D3] rounded-3xl p-6`}>
            <Text style={tw`text-sm font-semibold text-[#8C682F]`}>
              Estimated gold value
            </Text>

            <Text style={tw`text-2xl font-bold text-[#62491F] mt-2`}>
              {formatAmount(goldValue)}
            </Text>

            <View style={tw`h-px bg-[#D9C69F] my-5`} />

            <Text style={tw`text-sm font-semibold text-[#8C682F]`}>
              Preliminary 2.5% estimate
            </Text>

            <Text style={tw`text-3xl font-bold text-[#62491F] mt-2`}>
              {formatAmount(estimatedZakat)}
            </Text>

            <Text style={tw`text-xs leading-5 text-[#765F37] mt-3`}>
              This is a mathematical estimate, not confirmation that zakat is
              due. The nisab, applicable lunar-year requirement, type of gold,
              and scholarly guidance relevant to your circumstances should be
              considered separately.
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
