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

export default function Money
() {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<"EGP" | "USD">("EGP");
  const [showResult, setShowResult] = useState(false);

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

  return (
  <KeyboardAvoidingView
      style={tw`flex-1 bg-[#FAF9F5]`}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={tw`absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#174C3C]/5 blur-3xl`} />
      <View style={tw`absolute top-1/3 -left-20 w-60 h-60 rounded-full bg-[#DCE8D8]/20 blur-2xl`} />

      <ScrollView
        contentContainerStyle={tw`px-6 pt-16 pb-12`}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            tw`self-start mb-6 px-4 py-2.5 rounded-2xl bg-white border border-[#E5E2D8] shadow-sm flex-row items-center`,
            pressed && tw`opacity-80 transform scale-95`,
          ]}
        >
          <Text style={tw`text-[#174C3C] font-bold text-sm`}>← Back</Text>
        </Pressable>

        <View style={tw`mb-7`}>
          <View style={tw`flex-row items-center mb-2.5`}>
            <View style={tw`w-2 h-2 rounded-full bg-[#C59A55] mr-2`} />
            <Text style={tw`text-[11px] font-bold uppercase tracking-widest text-[#648064]`}>
              Zakat Calculator
            </Text>
          </View>

          <Text style={tw`text-3xl font-bold text-[#1A2E26] tracking-tight`}>
            Money & savings
          </Text>

          <Text style={tw`text-sm leading-6 text-[#6B7265] mt-2`}>
            Enter the cash and savings you want to assess. You can calculate
            without saving your financial information.
          </Text>
        </View>

        <View style={tw`bg-white/90 rounded-[32px] p-6 border border-[#EAE8DF] shadow-xl shadow-black/5`}>
          <Text style={tw`text-xs font-bold uppercase tracking-wide text-[#5C6356] mb-3`}>
            Currency
          </Text>

          <View style={tw`flex-row gap-3 mb-6 bg-[#F5F3EC] p-1.5 rounded-2xl border border-[#EBE8DF]`}>
            {(["EGP", "USD"] as const).map((item) => {
              const isSelected = currency === item;
              return (
                <Pressable
                  key={item}
                  onPress={() => {
                    setCurrency(item);
                    setShowResult(false);
                  }}
                  style={[
                    tw`flex-1 py-3.5 rounded-xl items-center justify-center transition-all`,
                    isSelected
                      ? tw`bg-[#174C3C] shadow-md shadow-[#174C3C]/20`
                      : tw`bg-transparent`,
                  ]}
                >
                  <Text
                    style={[
                      tw`font-bold text-sm tracking-wide`,
                      { color: isSelected ? "#FFFFFF" : "#5C6356" },
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
            placeholder="e.g. 100,000"
            placeholderTextColor="#A2A497"
            keyboardType="decimal-pad"
            style={tw`border border-[#E5E2D8] bg-[#FAF9F5] rounded-2xl px-5 py-4 text-lg font-bold text-[#1A2E26] shadow-inner`}
          />

          <Text style={tw`text-xs leading-5 text-[#85897F] mt-3 mb-6`}>
            Include relevant cash and savings. Consider debts due and other
            applicable rules when assessing your zakatable wealth.
          </Text>

          <Pressable
            onPress={calculateZakat}
            style={({ pressed }) => [
              tw`rounded-2xl bg-[#174C3C] py-4 items-center shadow-lg shadow-[#174C3C]/20`,
              pressed && tw`opacity-90 transform scale-[0.98]`,
            ]}
          >
            <Text style={tw`text-white font-bold text-base tracking-wide`}>
              Calculate estimate
            </Text>
          </Pressable>
        </View>

        {showResult && (
          <View style={tw`mt-6 bg-[#E8EDE2] rounded-[28px] p-6 border border-[#DCE5D5] shadow-sm`}>
            <View style={tw`flex-row items-center mb-1`}>
              <View style={tw`w-2 h-2 rounded-full bg-[#174C3C] mr-2`} />
              <Text style={tw`text-xs font-bold tracking-wide text-[#3F5A3B] uppercase`}>
                Preliminary 2.5% estimate
              </Text>
            </View>

            <Text style={tw`text-3xl font-bold text-[#174C3C] mt-2 tracking-tight`}>
              {zakatAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              <Text style={tw`text-lg font-semibold text-[#52744D]`}>{currency}</Text>
            </Text>

            <View style={tw`h-px bg-[#D0DCc8] my-4`} />

            <Text style={tw`text-xs leading-5 text-[#52684F]`}>
              This is only a mathematical estimate. It does not confirm that
              zakat is due. Nisab, the applicable lunar-year requirement, and
              your financial circumstances must be assessed separately.
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
