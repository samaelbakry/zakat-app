
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
import { createSavedAsset } from "@/services/assets";

export default function Money() {
  const [name, setName] = useState("Cash & savings");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<"EGP" | "USD">("EGP");
  const [showResult, setShowResult] = useState(false);
  const [saving, setSaving] = useState(false);

  const numericAmount = Number(amount);

  const isValidAmount =
    amount.trim() !== "" &&
    Number.isFinite(numericAmount) &&
    numericAmount > 0;

  const zakatAmount = numericAmount * 0.025;

  function calculateZakat() {
    if (!isValidAmount) {
      Alert.alert("Invalid amount", "Enter an amount greater than zero.");
      return;
    }

    setShowResult(true);
  }

  async function saveAsset() {
    if (!name.trim()) {
      Alert.alert("Missing name", "Enter a name for this asset.");
      return;
    }

    if (!isValidAmount) {
      Alert.alert("Invalid amount", "Enter an amount greater than zero.");
      return;
    }

    try {
      setSaving(true);

      await createSavedAsset({
        asset_type: "money",
        name: name.trim(),
        currency,
        amount: numericAmount,
      });

      Alert.alert("Saved successfully", "Your asset has been saved.", [
        {
          text: "OK",
          onPress: () => router.replace("/"),
        },
      ]);
    } catch (error) {
      console.error("Save asset error:", error);

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
      <View
        style={tw`absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#174C3C]/5`}
      />

      <ScrollView
        contentContainerStyle={tw`px-6 pt-16 pb-12`}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            tw`self-start mb-6 px-4 py-2.5 rounded-2xl bg-white border border-[#E5E2D8]`,
            pressed && tw`opacity-80`,
          ]}
        >
          <Text style={tw`text-[#174C3C] font-bold text-sm`}>← Back</Text>
        </Pressable>

        <View style={tw`mb-7`}>
          <Text
            style={tw`text-[11px] font-bold uppercase tracking-widest text-[#648064] mb-2`}
          >
            Zakat Calculator
          </Text>

          <Text style={tw`text-3xl font-bold text-[#1A2E26]`}>
            Money & savings
          </Text>

          <Text style={tw`text-sm leading-6 text-[#6B7265] mt-2`}>
            Calculate your estimate or save your asset for later. Saving is
            optional.
          </Text>
        </View>

        <View
          style={tw`bg-white rounded-[32px] p-6 border border-[#EAE8DF]`}
        >
          <Text style={tw`text-xs font-bold uppercase tracking-wide text-[#5C6356] mb-2`}>
            Asset name
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Emergency savings"
            placeholderTextColor="#A2A497"
            style={tw`border border-[#E5E2D8] bg-[#FAF9F5] rounded-2xl px-5 py-4 text-base text-[#1A2E26] mb-6`}
          />

          <Text style={tw`text-xs font-bold uppercase tracking-wide text-[#5C6356] mb-3`}>
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

          <Text style={tw`text-xs font-bold uppercase tracking-wide text-[#5C6356] mb-2.5`}>
            Total amount ({currency})
          </Text>

          <TextInput
            value={amount}
            onChangeText={(value) => {
              setAmount(value);
              setShowResult(false);
            }}
            placeholder="e.g. 100000"
            placeholderTextColor="#A2A497"
            keyboardType="decimal-pad"
            style={tw`border border-[#E5E2D8] bg-[#FAF9F5] rounded-2xl px-5 py-4 text-lg font-bold text-[#1A2E26]`}
          />

          <Text style={tw`text-xs leading-5 text-[#85897F] mt-3 mb-6`}>
            Include relevant cash and savings. Consider debts due and other
            applicable rules when assessing your zakatable wealth.
          </Text>

          <Pressable
            onPress={calculateZakat}
            style={({ pressed }) => [
              tw`rounded-2xl bg-[#174C3C] py-4 items-center`,
              pressed && tw`opacity-90`,
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
          <View style={tw`mt-6 bg-[#E8EDE2] rounded-[28px] p-6 border border-[#DCE5D5]`}>
            <Text style={tw`text-xs font-bold text-[#3F5A3B] uppercase`}>
              Preliminary 2.5% estimate
            </Text>

            <Text style={tw`text-3xl font-bold text-[#174C3C] mt-3`}>
              {zakatAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              <Text style={tw`text-lg font-semibold text-[#52744D]`}>
                {currency}
              </Text>
            </Text>

            <Text style={tw`text-xs leading-5 text-[#52684F] mt-4`}>
              This is a mathematical estimate only. It does not confirm that
              zakat is due. Nisab, the applicable lunar-year requirement, and
              your circumstances must be assessed separately.
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
