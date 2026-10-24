import { router } from "expo-router";
import { Text, View, Pressable, Platform, ScrollView } from "react-native";
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
export default function WelcomeScreenContent() {
  return (
    <View style={tw`flex-1 bg-[#FAF9F5]`}>
      <View
        style={tw`absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#174C3C]/5 blur-3xl`}
      />
      <View
        style={tw`absolute top-1/2 -left-20 w-60 h-60 rounded-full bg-[#DCE8D8]/30 blur-2xl`}
      />

      <ScrollView
        contentContainerStyle={tw`flex-grow justify-center px-6 py-12`}
        showsVerticalScrollIndicator={false}
      >
        <View style={tw`items-center mb-8`}>
          <View
            style={tw`px-3.5 py-1.5 rounded-full bg-[#174C3C]/10 border border-[#174C3C]/15 mb-4`}
          >
            <Text
              style={tw`font-body text-xs font-semibold text-[#174C3C] tracking-wide uppercase`}
            >
              Pure & Purposeful Giving
            </Text>
          </View>

          <Text
            style={tw`font-display font-bold text-[42px] leading-[48px] tracking-tight text-[#174C3C]`}
          >
            Zakat
          </Text>

          <Text
            style={tw`font-body text-[15px] leading-6 text-[#5C6356] mt-2.5 text-center max-w-[280px]`}
          >
            A thoughtful way to manage your zakat and give with total
            confidence.
          </Text>
        </View>

        <View
          style={tw`bg-white/90 rounded-[32px] p-7 mb-8 border border-[#EBE8DF] shadow-xl shadow-black/5`}
        >
          <View
            style={tw`w-14 h-14 rounded-2xl bg-[#F0F4ED] items-center justify-center mb-5 border border-[#174C3C]/10 shadow-inner`}
          >
            <Text style={tw`text-2xl text-[#174C3C]`}>✦</Text>
          </View>

          <Text
            style={tw`font-display font-bold text-[28px] leading-9 tracking-tight text-[#1A2E26] mb-2`}
          >
            Give with purpose.
          </Text>

          <Text style={tw`font-body text-[14.5px] leading-6 text-[#6B7265]`}>
            Calculate your zakat, organize your assets, and understand your
            giving journey—all in one simple place.
          </Text>

          <View
            style={tw`mt-6 pt-5 border-t border-[#EDEBE3] flex-col items-end`}
          >
            <View
              style={tw`w-full bg-[#F7F9F5] p-4 rounded-2xl border-r-4 border-[#174C3C]`}
            >
              <Text
                style={tw.style(
                  `font-arabic text-[20px] leading-9 text-right text-[#174C3C] font-semibold`,
                  { writingDirection: "rtl" },
                )}
              >
                أَنَّ اللَّهَ افْتَرَضَ عَلَيْهِمْ صَدَقَةً فِي أَمْوَالِهِمْ
                تُؤْخَذُ مِنْ أَغْنِيَائِهِمْ وَتُرَدُّ عَلَى فُقَرَائِهِمْ
              </Text>
            </View>
          </View>

          <View style={tw`mt-4 pl-4 border-l-2 border-[#174C3C]/30`}>
            <Text
              style={tw`font-display italic text-[15px] leading-[24px] text-[#24382D]`}
            >
              “Allah has made zakat obligatory upon their wealth, taken from the
              rich among them and given back to their poor.”
            </Text>
            <Text
              style={tw`font-body font-semibold text-[12px] tracking-wide text-[#8C9285] uppercase mt-2`}
            >
              Prophet Muhammad ﷺ • Sahih al-Bukhari 1395
            </Text>
          </View>

          <View
            style={tw`flex-row items-center mt-7 pt-4 border-t border-[#F2F0E8]`}
          >
            <View style={tw`flex-row items-center`}>
              <View style={tw`h-1.5 w-7 rounded-full bg-[#174C3C]`} />
              <View style={tw`h-1.5 w-2 rounded-full bg-[#E0E6DC] mx-1`} />
              <View style={tw`h-1.5 w-2 rounded-full bg-[#E0E6DC]`} />
            </View>
            <Text
              style={tw`font-body font-medium text-[12px] text-[#8C9285] ml-auto`}
            >
              Your journey starts here
            </Text>
          </View>
        </View>

        <View style={tw`gap-y-3`}>
          <Pressable
            onPress={() => router.push("/(auth)/register")}
            style={({ pressed }) => [
              tw`bg-[#174C3C] rounded-2xl py-4 items-center shadow-lg shadow-[#174C3C]/20`,
              pressed && tw`opacity-90 transform scale-[0.98]`,
            ]}
          >
            <Text
              style={tw`font-body font-bold text-[16px] text-white tracking-wide`}
            >
              Get started
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/(auth)/login")}
            style={({ pressed }) => [
              tw`bg-white/80 border border-[#E5E2D8] rounded-2xl py-4 items-center`,
              pressed && tw`bg-[#F2EFF5] opacity-90 transform scale-[0.98]`,
            ]}
          >
            <Text style={tw`font-body font-bold text-[16px] text-[#174C3C]`}>
              I already have an account
            </Text>
          </Pressable>
        </View>

        <Text
          style={tw`font-body font-medium text-center text-[12px] text-[#A0A599] mt-8 tracking-wider uppercase`}
        >
          Clarity in calculation • Confidence in giving
        </Text>
      </ScrollView>
    </View>
  );
}
