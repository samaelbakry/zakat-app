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
        contentContainerStyle={tw`px-6 pt-8 pb-12`}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => router.back()}
          style={tw`self-start flex-row items-center mb-9`}
        >
          <Text style={tw`text-base text-[#174C3C] mr-2`}>←</Text>
          <Text style={tw`text-sm font-semibold text-[#174C3C]`}>Back</Text>
        </Pressable>

        <View style={tw`flex-row items-center mb-4`}>
          <View style={tw`w-1.5 h-1.5 rounded-full bg-[#C59A55] mr-2`} />
          <Text
            style={tw`text-xs font-bold uppercase tracking-widest text-[#648064]`}
          >
            Quick estimate
          </Text>
        </View>

        <Text
          style={[tw`text-4xl text-[#174C3C] mb-3`, { fontFamily: "Georgia" }]}
        >
          Calculate your zakat.
        </Text>

        <Text style={tw`text-sm leading-6 text-[#777D72] mb-8`}>
          A simple preliminary estimate, without saving your financial details
          to your account.
        </Text>

        <View style={tw`flex-row items-center mb-3`}>
          <Text
            style={tw`text-xs font-bold uppercase tracking-widest text-[#648064]`}
          >
            01
          </Text>
          <View style={tw`h-px flex-1 bg-[#E5E2D8] ml-3`} />
          <Text style={tw`text-xs text-[#85897F] ml-3`}>Calculation type</Text>
        </View>

        <View style={tw`flex-row gap-3 mb-8`}>
          {(
            [
              { value: "money", label: "Money", subtitle: "Cash & savings" },
              { value: "gold", label: "Gold", subtitle: "Weight & value" },
            ] as const
          ).map((option) => {
            const selected = type === option.value;

            return (
              <Pressable
                key={option.value}
                onPress={() => changeType(option.value)}
                style={[
                  tw`flex-1 rounded-2xl p-4 border`,
                  selected
                    ? tw`bg-[#174C3C] border-[#174C3C]`
                    : tw`bg-white border-[#E5E2D8]`,
                ]}
              >
                <View
                  style={[
                    tw`w-5 h-5 rounded-full border items-center justify-center mb-4`,
                    selected ? tw`border-[#E4D0A5]` : tw`border-[#C8C9BD]`,
                  ]}
                >
                  {selected && (
                    <View style={tw`w-2.5 h-2.5 rounded-full bg-[#E4D0A5]`} />
                  )}
                </View>

                <Text
                  style={[
                    tw`text-base font-bold`,
                    { color: selected ? "#FFFFFF" : "#174C3C" },
                  ]}
                >
                  {option.label}
                </Text>

                <Text
                  style={[
                    tw`text-xs mt-1`,
                    { color: selected ? "#D5DFD5" : "#85897F" },
                  ]}
                >
                  {option.subtitle}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={tw`flex-row items-center mb-3`}>
          <Text
            style={tw`text-xs font-bold uppercase tracking-widest text-[#648064]`}
          >
            02
          </Text>
          <View style={tw`h-px flex-1 bg-[#E5E2D8] ml-3`} />
          <Text style={tw`text-xs text-[#85897F] ml-3`}>Your details</Text>
        </View>

        <View style={tw`bg-white rounded-3xl p-5 border border-[#EAE8DF]`}>
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

          {type === "money" ? (
            <>
              <Text style={tw`text-sm font-bold text-[#24382D] mb-2`}>
                Total money and savings
              </Text>

              <Text style={tw`text-xs text-[#85897F] mb-3`}>
                Enter the total amount you want to assess.
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
                  style={tw`flex-1 py-4 text-base text-[#24382D]`}
                />
              </View>
            </>
          ) : (
            <>
              <Text style={tw`text-sm font-bold text-[#24382D] mb-2`}>
                Gold purity
              </Text>

              <Text style={tw`text-xs text-[#85897F] mb-3`}>
                Choose the purity matching your gold.
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
                        {item}K
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={tw`text-sm font-bold text-[#24382D] mb-2`}>
                Weight in grams
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
                <Text style={tw`text-sm text-[#85897F]`}>g</Text>
              </View>

              <Text style={tw`text-sm font-bold text-[#24382D] mb-2`}>
                Price per gram
              </Text>

              <Text style={tw`text-xs text-[#85897F] mb-3`}>
                For {purity}K gold, enter the current price in {currency}.
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
            </>
          )}

          <View style={tw`flex-row mt-4`}>
            <View style={tw`w-1 rounded-full bg-[#C59A55] mr-3`} />
            <Text style={tw`flex-1 text-xs leading-5 text-[#85897F]`}>
              {type === "gold"
                ? "Enter a price that matches the selected purity. Live gold prices are not fetched."
                : "Consider applicable debts and zakat rules when assessing your wealth."}
            </Text>
          </View>

          <Pressable
            onPress={calculate}
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
        </View>

        {showResult && (
          <View
            style={[
              tw`mt-6 rounded-3xl p-6 border`,
              type === "gold"
                ? tw`bg-[#F4E9D3] border-[#E4D2AD]`
                : tw`bg-[#E8EEE5] border-[#DCE5D5]`,
            ]}
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
              {type === "gold" ? "Estimated gold value" : "Entered amount"}
            </Text>

            <Text style={tw`text-2xl font-bold text-[#174C3C] mt-2`}>
              {formatAmount(assetValue)} {currency}
            </Text>

            <View style={tw`h-px bg-[#174C3C]/15 my-5`} />

            <Text style={tw`text-sm text-[#52744D]`}>
              Preliminary 2.5% estimate
            </Text>

            <Text
              style={[
                tw`text-3xl text-[#174C3C] mt-2`,
                { fontFamily: "Georgia", fontWeight: "bold" },
              ]}
            >
              {formatAmount(zakatEstimate)} {currency}
            </Text>

            <Text style={tw`text-xs leading-5 text-[#52684F] mt-4`}>
              This is a mathematical estimate only, not confirmation that zakat
              is due. Nisab, the applicable lunar-year requirement, and the
              relevant rules for gold must be assessed separately.
            </Text>

            <View
              style={tw`flex-row items-center mt-4 pt-4 border-t border-[#174C3C]/10`}
            >
              <Text style={tw`text-xs font-bold text-[#174C3C] mr-2`}>✓</Text>
              <Text style={tw`text-xs font-semibold text-[#174C3C]`}>
                This calculation has not been saved.
              </Text>
            </View>
          </View>
        )}

        <Text style={tw`text-xs text-center leading-5 text-[#85897F] mt-7`}>
          A mindful estimate is the first step toward confident giving.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
