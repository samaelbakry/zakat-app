
import { router } from "expo-router";
import {
  ScrollView,
  Text,
  View,
  Pressable,
} from "react-native";
import tw from "twrnc";

const zakatOptions = [
  {
    title: "Money",
    subtitle: "Cash & savings",
    icon: "↗",
    route: "/money",
    bg: "#E2EDE0",
    accent: "#174C3C",
  },
  {
    title: "Gold",
    subtitle: "Weight & purity",
    icon: "◇",
    route: "/gold",
    bg: "#F4E9D3",
    accent: "#A77A35",
  },
  {
    title: "Zakat Al-Fitr",
    subtitle: "People & amount",
    icon: "✳",
    route: "/fitr",
    bg: "#E8EDE2",
    accent: "#52744D",
  },
  {
    title: "History",
    subtitle: "Past calculations",
    icon: "◷",
    route: "/history",
    bg: "#E9E8DF",
    accent: "#6D725F",
  },
];

export default function HomeScreen() {
  return (
    <ScrollView
      style={tw`flex-1 bg-[#F7F5EF]`}
      contentContainerStyle={tw`px-5 pt-14 pb-10`}
      showsVerticalScrollIndicator={false}
    >
      <View style={tw`flex-row items-center justify-between mb-7`}>
        <View style={tw`flex-1 mr-3`}>
          <View style={tw`flex-row items-center mb-2`}>
            <View
              style={tw`w-2 h-2 rounded-full bg-[#C59A55] mr-2`}
            />
            <Text
              style={tw`text-xs font-bold tracking-wide text-[#648064]`}
            >
              YOUR PERSONAL ZAKAT SPACE
            </Text>
          </View>

          <Text style={tw`text-sm text-[#777D72] mt-1`}>
            Let's organize your giving.
          </Text>
        </View>

        <Pressable
        //   onPress={() => router.push("/profile")}
          style={({ pressed }) => [
            tw`w-14 h-14 rounded-full bg-[#DCE8D8] items-center justify-center border border-[#CBDCC6]`,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Text style={tw`text-2xl text-[#174C3C]`}>
            ♙
          </Text>
        </Pressable>
      </View>

      <View
        style={tw`bg-[#174C3C] rounded-[28px] p-6 mb-8 overflow-hidden`}
      >
        <View style={tw`flex-row items-start justify-between`}>
          <View style={tw`flex-1`}>
            <Text style={tw`text-[#C8D9C4] text-sm`}>
              Estimated zakat overview
            </Text>

            <Text style={tw`text-white text-3xl font-bold mt-4`}>
              EGP 0.00
            </Text>

            <Text style={tw`text-[#C8D9C4] text-xs mt-2`}>
              Your assets haven't been added yet
            </Text>
          </View>

          <View
            style={tw`w-12 h-12 rounded-2xl bg-[#FFFFFF18] items-center justify-center border border-[#FFFFFF30]`}
          >
            <Text style={tw`text-[#E4D0A5] text-2xl`}>
              ز
            </Text>
          </View>
        </View>

        <View style={tw`h-px bg-[#FFFFFF30] my-5`} />

        <Pressable
        //   onPress={() => router.push("/money")}
          style={({ pressed }) => [
            tw`flex-row items-center justify-between bg-[#F7F5EF] rounded-2xl px-4 py-4`,
            pressed && { opacity: 0.85 },
          ]}
        >
          <Text style={tw`text-[#174C3C] font-bold text-sm`}>
            Start your first calculation
          </Text>

          <Text style={tw`text-[#174C3C] text-lg`}>
            →
          </Text>
        </Pressable>
      </View>

      <View style={tw`flex-row items-end justify-between mb-4`}>
        <View>
          <Text style={tw`text-xl font-bold text-[#24382D]`}>
            Calculate your zakat
          </Text>

          <Text style={tw`text-sm text-[#85897F] mt-1`}>
            Choose what you'd like to calculate
          </Text>
        </View>

        <View
          style={tw`w-9 h-9 rounded-xl bg-[#E6EBDD] items-center justify-center`}
        >
          <Text style={tw`text-[#174C3C] text-lg`}>
            ✳
          </Text>
        </View>
      </View>

      <View style={tw`flex-row flex-wrap justify-between`}>
        {zakatOptions.map((item) => (
          <Pressable
            key={item.title}
            onPress={() => router.push(item.route as any)}
            style={({ pressed }) => [
              tw`w-[48%] bg-white border border-[#EAE8DF] rounded-[24px] p-4 mb-4`,
              pressed && { opacity: 0.8 },
            ]}
          >
            <View
              style={[
                tw`w-12 h-12 rounded-2xl items-center justify-center mb-5`,
                { backgroundColor: item.bg },
              ]}
            >
              <Text
                style={[
                  tw`text-2xl font-bold`,
                  { color: item.accent },
                ]}
              >
                {item.icon}
              </Text>
            </View>

            <Text
              style={tw`text-base font-bold text-[#24382D]`}
            >
              {item.title}
            </Text>

            <Text
              style={tw`text-xs text-[#85897F] mt-2 leading-5`}
            >
              {item.subtitle}
            </Text>

            <View style={tw`flex-row items-center mt-5`}>
              <Text
                style={[
                  tw`text-xs font-bold`,
                  { color: item.accent },
                ]}
              >
                Explore
              </Text>

              <Text
                style={[
                  tw`text-sm ml-2`,
                  { color: item.accent },
                ]}
              >
                →
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      <View
        style={tw`bg-[#E8EDE2] rounded-[24px] p-5 mt-1 border border-[#DCE5D5]`}
      >
        <View style={tw`flex-row items-center mb-3`}>
          <View
            style={tw`w-9 h-9 rounded-xl bg-[#D5E2D0] items-center justify-center mr-3`}
          >
            <Text style={tw`text-[#174C3C] text-lg`}>
              i
            </Text>
          </View>

          <Text style={tw`text-base font-bold text-[#174C3C]`}>
            A note on your zakat
          </Text>
        </View>

        <Text style={tw`text-sm text-[#61725D] leading-6`}>
          Your zakat calculation depends on the applicable
          rules, nisab threshold, and the information you provide.
          Review your circumstances before making a payment.
        </Text>
      </View>

      <Pressable
        onPress={() => router.replace("/login")}
        style={({ pressed }) => [
          tw`mt-6 py-4 items-center`,
          pressed && { opacity: 0.7 },
        ]}
      >
        <Text style={tw`text-[#85897F] font-semibold text-sm`}>
          Sign out (demo)
        </Text>
      </Pressable>
    </ScrollView>
  );
}
