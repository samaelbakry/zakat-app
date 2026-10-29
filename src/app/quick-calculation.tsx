
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

type CalculationType = "money" | "gold";
type Currency = "EGP" | "USD";
type Purity = 18 | 21 | 22 | 24;

const purities: Purity[] = [24, 22, 21, 18];

export default function QuickCalculationScreen() {
  const [type, setType] = useState<CalculationType>("money");
  const [currency, setCurrency] = useState<Currency>("EGP");
  const [amount, setAmount] = useState("");
  const [weight, setWeight] = useState("");
  const [pricePerGram, setPricePerGram] = useState("");
  const [purity, setPurity] = useState<Purity>(21);
  const [showResult, setShowResult] = useState(false);

  const numericAmount = Number(amount);
  const numericWeight = Number(weight);
  const numericPrice = Number(pricePerGram);

  const isValid =
    type === "money"
      ? amount.trim() !== "" &&
        Number.isFinite(numericAmount) &&
        numericAmount > 0
      : weight.trim() !== "" &&
        pricePerGram.trim() !== "" &&
        Number.isFinite(numericWeight) &&
        Number.isFinite(numericPrice) &&
        numericWeight > 0 &&
        numericPrice > 0;

  const assetValue =
    type === "money" ? numericAmount : numericWeight * numericPrice;

  const zakatEstimate = assetValue * 0.025;

  function calculate() {
    if (!isValid) {
      Alert.alert(
        "Check your entries",
        type === "money"
          ? "Enter an amount greater than zero."
          : "Enter a valid weight and price per gram.",
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

  function changeType(nextType: CalculationType) {
    setType(nextType);
    setShowResult(false);
  }

  return (
    <KeyboardAvoidingView
      style={tw`flex-1 bg-[#FAF9F5]`}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={tw`px-6 pt-14 pb-12`}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => router.back()}
          style={tw`self-start mb-7 px-4 py-2.5 rounded-2xl bg-white border border-[#E5E2D8]`}
        >
          <Text style={tw`text-[#174C3C] font-bold`}>← Back</Text>
        </Pressable>

        <Text style={tw`text-xs font-bold uppercase tracking-widest text-[#648064]`}>
          No saving required
        </Text>

        <Text style={tw`text-3xl font-bold text-[#1A2E26] mt-3`}>
          Quick calculation
        </Text>

        <Text style={tw`text-sm leading-6 text-[#6B7265] mt-3 mb-7`}>
          Calculate a preliminary estimate without saving your financial
          details to your account.
        </Text>

        <View style={tw`bg-white rounded-3xl p-5 border border-[#EAE8DF]`}>
          <Text style={tw`text-sm font-bold text-[#1A2E26] mb-3`}>
            Choose calculation type
          </Text>

          <View style={tw`flex-row gap-3 mb-6`}>
            {([
              { value: "money", label: "Money" },
              { value: "gold", label: "Gold" },
            ] as const).map((option) => {
              const selected = type === option.value;

              return (
                <Pressable
                  key={option.value}
                  onPress={() => changeType(option.value)}
                  style={[
                    tw`flex-1 rounded-2xl py-4 items-center border`,
                    selected
                      ? tw`bg-[#174C3C] border-[#174C3C]`
                      : tw`bg-[#FAF9F5] border-[#E5E2D8]`,
                  ]}
                >
                  <Text
                    style={[
                      tw`font-bold`,
                      { color: selected ? "#FFFFFF" : "#174C3C" },
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={tw`text-sm font-bold text-[#1A2E26] mb-3`}>
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
                    tw`flex-1 rounded-xl py-3 items-center border`,
                    selected
                      ? tw`bg-[#F4E9D3] border-[#A77A35]`
                      : tw`bg-white border-[#E5E2D8]`,
                  ]}
                >
                  <Text style={tw`font-bold text-[#174C3C]`}>{item}</Text>
                </Pressable>
              );
            })}
          </View>

          {type === "money" ? (
            <>
              <Text style={tw`text-sm font-bold text-[#1A2E26] mb-3`}>
                Total money and savings
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
                style={tw`border border-[#E5E2D8] bg-[#FAF9F5] rounded-2xl px-4 py-4 text-base text-[#1A2E26]`}
              />
            </>
          ) : (
            <>
              <Text style={tw`text-sm font-bold text-[#1A2E26] mb-3`}>
                Gold purity
              </Text>

              <View style={tw`flex-row flex-wrap gap-2 mb-6`}>
                {purities.map((item) => {
                  const selected = purity === item;

                  return (
                    <Pressable
                      key={item}
                      onPress={() => {
                        setPurity(item);
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
                        style={{
                          color: selected ? "#FFFFFF" : "#765A2C",
                          fontWeight: "700",
                        }}
                      >
                        {item}K
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={tw`text-sm font-bold text-[#1A2E26] mb-3`}>
                Weight (grams)
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
                style={tw`border border-[#E5E2D8] bg-[#FAF9F5] rounded-2xl px-4 py-4 text-base text-[#1A2E26] mb-6`}
              />

              <Text style={tw`text-sm font-bold text-[#1A2E26] mb-3`}>
                Price per gram ({purity}K)
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
                style={tw`border border-[#E5E2D8] bg-[#FAF9F5] rounded-2xl px-4 py-4 text-base text-[#1A2E26]`}
              />
            </>
          )}

          <Text style={tw`text-xs leading-5 text-[#85897F] mt-3`}>
            {type === "gold"
              ? "Enter a price that matches the selected purity. Live gold prices are not fetched."
              : "Consider applicable debts and zakat rules when assessing your wealth."}
          </Text>

          <Pressable
            onPress={calculate}
            style={({ pressed }) => [
              tw`mt-6 rounded-2xl bg-[#174C3C] py-4 items-center`,
              pressed && tw`opacity-80`,
            ]}
          >
            <Text style={tw`text-white font-bold text-base`}>
              Calculate estimate
            </Text>
          </Pressable>
        </View>

        {showResult && (
          <View
            style={[
              tw`mt-6 rounded-3xl p-6 border`,
              type === "gold"
                ? tw`bg-[#F4E9D3] border-[#E4D2AD]`
                : tw`bg-[#E2EDE0] border-[#DCE5D5]`,
            ]}
          >
            <Text style={tw`text-sm font-semibold text-[#52744D]`}>
              {type === "gold" ? "Estimated gold value" : "Entered amount"}
            </Text>

            <Text style={tw`text-2xl font-bold text-[#174C3C] mt-2`}>
              {formatAmount(assetValue)} {currency}
            </Text>

            <View style={tw`h-px bg-[#174C3C]/15 my-5`} />

            <Text style={tw`text-sm font-semibold text-[#52744D]`}>
              Preliminary 2.5% estimate
            </Text>

            <Text style={tw`text-3xl font-bold text-[#174C3C] mt-2`}>
              {formatAmount(zakatEstimate)} {currency}
            </Text>

            <Text style={tw`text-xs leading-5 text-[#52684F] mt-4`}>
              This is a mathematical estimate only, not confirmation that
              zakat is due. Nisab, the applicable lunar-year requirement, and
              the relevant rules for gold must be assessed separately.
            </Text>

            <Text style={tw`text-xs font-bold text-[#174C3C] mt-3`}>
              This calculation has not been saved.
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
