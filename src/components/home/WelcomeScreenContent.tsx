
import { router } from "expo-router";
import {
  Text,
  View,
  Pressable,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { create } from "twrnc";

const tw = create({
  theme: {
    extend: {
      fontFamily: {
        display: Platform.select({ ios: "Georgia", default: "serif" }),
        body: Platform.select({
          ios: "Avenir Next",
          default: "sans-serif",
        }),
        arabic: Platform.select({
          ios: "Geeza Pro",
          default: "serif",
        }),
      },
    },
  },
});

export default function WelcomeScreenContent() {
  return (
    <View style={tw`flex-1 bg-[#FAF9F5]`}>

      <ScrollView
        contentContainerStyle={tw`flex-grow px-6 pt-8 pb-7`}
        showsVerticalScrollIndicator={false}
      >
        <View style={tw`mt-10`}>
          <Text
            style={tw`font-body text-xs font-semibold uppercase tracking-[2px] text-[#9A7B45] mb-4`}
          >
            Your giving journey
          </Text>

          <Text
            style={tw`font-display text-[46px] leading-[53px] text-[#174C3C]`}
          >
            Give with
          </Text>

          <Text
            style={tw`font-display text-[46px] leading-[53px] italic text-[#174C3C]`}
          >
            confidence.
          </Text>

          <Text
            style={tw`font-body text-sm leading-6 text-[#777D72] mt-4 max-w-[300px]`}
          >
            Calculate your zakat, organize your assets, and make room for what
            matters.
          </Text>
        </View>

        <View style={tw`mb-8`}>
          <View style={tw`flex-row items-center py-4 border-b border-[#E9E6DC]`}>
            <View
              style={tw`w-9 h-9 rounded-full bg-[#E8EEE5] items-center justify-center mr-4`}
            >
              <Text style={tw`text-base text-[#174C3C]`}>01</Text>
            </View>

            <View style={tw`flex-1`}>
              <Text style={tw`font-body text-sm font-semibold text-[#24382D]`}>
                Calculate your zakat
              </Text>
              <Text style={tw`font-body text-xs text-[#85897F] mt-1`}>
                Know where you stand.
              </Text>
            </View>

            <Text style={tw`text-lg text-[#A17D3D]`}>↗</Text>
          </View>

          <View style={tw`flex-row items-center py-4 border-b border-[#E9E6DC]`}>
            <View
              style={tw`w-9 h-9 rounded-full bg-[#F2EBDD] items-center justify-center mr-4`}
            >
              <Text style={tw`text-base text-[#9A7B45]`}>02</Text>
            </View>

            <View style={tw`flex-1`}>
              <Text style={tw`font-body text-sm font-semibold text-[#24382D]`}>
                Organize your assets
              </Text>
              <Text style={tw`font-body text-xs text-[#85897F] mt-1`}>
                Keep money and gold together.
              </Text>
            </View>

            <Text style={tw`text-lg text-[#A17D3D]`}>↗</Text>
          </View>
        </View>

        <View
          style={tw`bg-[#174C3C] rounded-[24px] p-5 mb-8`}
        >
          <View style={tw`flex-row items-center mb-4`}>
            <View style={tw`w-1 h-4 rounded-full bg-[#D9BD83] mr-2`} />
            <Text
              style={tw`font-body text-[10px] font-semibold uppercase tracking-[2px] text-[#DCE5D5]`}
            >
              A gentle reminder
            </Text>
          </View>

          <Text
            style={tw`font-arabic text-[23px] leading-10 text-right text-white`}
          >
           وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ
          </Text>

          <View style={tw`flex-row items-center justify-between mt-3`}>
            <Text style={tw`font-body text-xs text-[#DCE5D5]`}>
             And perform As-Salat , and give Zakat and 
            </Text>
            <Text style={tw`font-body text-[10px] text-[#D9BD83]`}>
              سورة : النور 
            </Text>
          </View>
        </View>

        <View style={tw`gap-y-3`}>
          <Pressable
            onPress={() => router.push("/(auth)/register")}
            accessibilityRole="button"
            style={({ pressed }) => [
              tw`flex-row items-center justify-center bg-[#174C3C] rounded-2xl py-4`,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={tw`font-body text-sm font-bold text-white`}>
              Get started
            </Text>
            <Text style={tw`text-lg text-[#E4D0A5] ml-3`}>→</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/(auth)/login")}
            accessibilityRole="button"
            style={({ pressed }) => [
              tw`rounded-2xl border border-[#DCDDD2] py-4 items-center`,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text style={tw`font-body text-sm font-semibold text-[#174C3C]`}>
              I already have an account
            </Text>
          </Pressable>
        </View>

        <Text
          style={tw`font-body text-[10px] text-center text-[#999B90] mt-6`}
        >
          Clarity in calculation · Confidence in giving
        </Text>
      </ScrollView>
    </View>
  );
}
