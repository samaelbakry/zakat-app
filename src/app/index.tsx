import { router } from "expo-router";
import { Text, View, Pressable, Platform } from "react-native";
import { create } from "twrnc";

const tw = create({
  theme: {
    extend: {
      fontFamily: {
        display: Platform.select({ ios: "Georgia", default: "serif" }),
        body: Platform.select({ ios: "Avenir Next", default: "sans-serif" }),
        arabic: Platform.select({ ios: "Geeza Pro", default: "serif" }),
      },
    },
  },
});

export default function WelcomeScreen() {
  return (
    <View style={tw`flex-1 bg-[#F7F5EF] px-6 justify-center`}>
      <View style={tw`items-center mb-9`}>
        <Text
          style={tw`font-display font-bold text-[38px] leading-[44px] tracking-tight text-[#174C3C]`}
        >
          Zakat 
        </Text>

        <Text
          style={tw`font-body text-[15px] leading-6 text-[#777D72] mt-3 text-center`}
        >
          A thoughtful way to manage your zakat
          {"\n"}and give with confidence.
        </Text>
      </View>

      <View
        style={tw`bg-white rounded-[28px] p-6 mb-6 border border-[#EAE8DF]`}
      >
        <View
          style={tw`w-12 h-12 rounded-2xl bg-[#F1F4EC] items-center justify-center mb-5`}
        >
          <Text style={tw`text-2xl text-[#174C3C]`}>✳</Text>
        </View>

        <Text
          style={tw`font-display font-bold text-[26px] leading-8 tracking-tight text-[#24382D] mb-3`}
        >
          Give with purpose.
        </Text>

        <Text style={tw`font-body text-[15px] leading-6 text-[#777D72]`}>
          Calculate your zakat, organize your assets, and understand your
          giving journey, all in one simple place.
        </Text>

        <View style={tw`mt-6 pr-4 border-r-2 border-[#CFDCC9]`}>
          <Text
            style={tw.style(
              `font-arabic text-[22px] leading-10 text-right text-[#174C3C]`,
              { writingDirection: "rtl" }
            )}
          >
            أَنَّ اللَّهَ افْتَرَضَ عَلَيْهِمْ صَدَقَةً فِي أَمْوَالِهِمْ تُؤْخَذُ مِنْ أَغْنِيَائِهِمْ وَتُرَدُّ عَلَى فُقَرَائِهِمْ
          </Text>
        </View>

        <View style={tw`mt-4 pl-4 border-l-2 border-[#CFDCC9]`}>
          <Text
            style={tw`font-display italic text-base leading-[25px] text-[#24382D]`}
          >
            “Allah has made zakat obligatory upon their wealth, taken from
            the rich among them and given back to their poor.”
          </Text>
          <Text
            style={tw`font-body font-medium text-[12.5px] leading-[18px] text-[#92968C] mt-2`}
          >
            Prophet Muhammad ﷺ, Sahih al-Bukhari 1395 (also Sahih Muslim 19)
          </Text>
        </View>

        <View style={tw`flex-row items-center mt-6`}>
          <View style={tw`h-1.5 w-8 rounded-full bg-[#174C3C]`} />
          <View style={tw`h-1.5 w-2 rounded-full bg-[#DCE8D8] mx-1.5`} />
          <View style={tw`h-1.5 w-2 rounded-full bg-[#DCE8D8]`} />
          <Text
            style={tw`font-body font-medium text-[12.5px] text-[#92968C] ml-auto`}
          >
            Your journey starts here
          </Text>
        </View>
      </View>

      <Pressable
        onPress={() => router.push("/(auth)/register")}
        style={({ pressed }) =>
          tw.style(
            "bg-[#174C3C] rounded-2xl py-4 items-center",
            pressed && "opacity-80"
          )
        }
      >
        <Text style={tw`font-body font-bold text-base text-white`}>
          Get started
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/home")}
        style={({ pressed }) =>
          tw.style(
            "bg-[#E9EEE4] rounded-2xl py-4 items-center mt-3",
            pressed && "opacity-75"
          )
        }
      >
        <Text style={tw`font-body font-bold text-base text-[#174C3C]`}>
          I already have an account
        </Text>
      </Pressable>

      <Text
        style={tw`font-body font-medium text-center text-[12.5px] text-[#92968C] mt-7`}
      >
        Clarity in calculation. Confidence in giving.
      </Text>
    </View>
  );
}