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
    amount.trim() !== "" && Number.isFinite(numericAmount) && numericAmount > 0;

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
      <ScrollView
        contentContainerStyle={tw`px-6 pt-8 pb-12`}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => router.back()}
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
            style={tw`text-xs font-bold uppercase tracking-widest text-[#648064]`}
          >
            Zakat calculator
          </Text>
        </View>

        <Text
          style={[tw`text-4xl text-[#174C3C] mb-3`, { fontFamily: "Georgia" }]}
        >
          Money & savings.
        </Text>

        <Text style={tw`text-sm leading-6 text-[#777D72] mb-8`}>
          Estimate your zakat or save this asset to keep your finances
          organized. Saving is always optional.
        </Text>

        <View style={tw`flex-row items-center mb-3`}>
          <Text
            style={tw`text-xs font-bold uppercase tracking-widest text-[#648064]`}
          >
            01
          </Text>
          <View style={tw`h-px flex-1 bg-[#E5E2D8] ml-3`} />
          <Text style={tw`text-xs text-[#85897F] ml-3`}>Asset details</Text>
        </View>

        <View style={tw`bg-white rounded-3xl p-5 border border-[#EAE8DF]`}>
          <Text style={tw`text-sm font-bold text-[#24382D] mb-3`}>
            Give your asset a name
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Emergency savings"
            placeholderTextColor="#A2A497"
            style={tw`border border-[#E5E2D8] bg-[#FAF9F5] rounded-2xl px-4 py-4 text-base text-[#24382D] mb-6`}
          />

          <Text style={tw`text-sm font-bold text-[#24382D] mb-3`}>
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
            Total amount
          </Text>

          <Text style={tw`text-xs text-[#85897F] mb-3`}>
            Enter your total money and savings in {currency}.
          </Text>

          <View
            style={tw`flex-row items-center border border-[#E5E2D8] bg-[#FAF9F5] rounded-2xl px-4`}
          >
            <Text style={tw`text-sm font-bold text-[#A77A35] mr-3`}>
              {currency}
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
              style={tw`flex-1 py-4 text-lg font-bold text-[#24382D]`}
            />
          </View>

          <View style={tw`flex-row mt-4 mb-7`}>
            <View style={tw`w-1 rounded-full bg-[#C59A55] mr-3`} />
            <Text style={tw`flex-1 text-xs leading-5 text-[#85897F]`}>
              Include relevant cash and savings. Consider debts due and other
              applicable rules when assessing your zakatable wealth.
            </Text>
          </View>

          <Pressable
            onPress={calculateZakat}
            style={({ pressed }) => [
              tw`rounded-2xl bg-[#174C3C] py-4 flex-row items-center justify-center`,
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
            style={tw`mt-6 bg-[#E8EEE5] rounded-3xl p-6 border border-[#DCE5D5]`}
          >
            <View style={tw`flex-row items-center mb-5`}>
              <View style={tw`w-1.5 h-1.5 rounded-full bg-[#C59A55] mr-2`} />
              <Text
                style={tw`text-xs font-bold uppercase tracking-widest text-[#52744D]`}
              >
                Your estimate
              </Text>
            </View>

            <Text style={tw`text-sm text-[#52744D]`}>
              Preliminary 2.5% estimate
            </Text>

            <Text
              style={[
                tw`text-3xl text-[#174C3C] mt-3`,
                { fontFamily: "Georgia", fontWeight: "bold" },
              ]}
            >
              {zakatAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              <Text style={tw`text-base font-semibold text-[#52744D]`}>
                {currency}
              </Text>
            </Text>

            <View style={tw`h-px bg-[#174C3C]/10 my-5`} />

            <Text style={tw`text-xs leading-5 text-[#52684F]`}>
              This is a mathematical estimate only. It does not confirm that
              zakat is due. Nisab, the applicable lunar-year requirement, and
              your circumstances must be assessed separately.
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
