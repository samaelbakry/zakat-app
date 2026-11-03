import { router } from "expo-router";
import {
  Text,
  View,
  Pressable,
  Platform,
  ScrollView,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Wallet,
} from "lucide-react-native";
import { create } from "twrnc";
import { useTranslation } from "react-i18next";

const tw = create({
  theme: {
    extend: {
      fontFamily: {
        display: Platform.select({
          ios: "Georgia",
          default: "serif",
        }),
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

const COLORS = {
  background: "#FAF9F5",
  primary: "#174C3C",
  primaryDeep: "#0F3A2D",
  text: "#24382D",
  muted: "#6B7268",
  gold: "#9A7B45",
  goldSoft: "#D9BD83",
  border: "#E7E5DB",
  lightGreen: "#E3ECE3",
  lightGold: "#F2EBDD",
  white: "#FFFFFF",
};

function StarMark({
  size,
  color,
  opacity,
  style,
}: {
  size: number;
  color: string;
  opacity: number;
  style?: ViewStyle;
}) {
  const square: ViewStyle = {
    position: "absolute",
    width: size,
    height: size,
    borderWidth: 1.5,
    borderColor: color,
    borderRadius: size * 0.06,
  };
  return (
    <View
      pointerEvents="none"
      style={[{ width: size, height: size, opacity }, style]}
    >
      <View style={square} />
      <View style={[square, { transform: [{ rotate: "45deg" }] }]} />
      <View
        style={[
          square,
          {
            width: size * 0.62,
            height: size * 0.62,
            top: size * 0.19,
            left: size * 0.19,
            transform: [{ rotate: "22.5deg" }],
          },
        ]}
      />
    </View>
  );
}

export default function WelcomeScreenContent() {
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language.startsWith("ar");

  const rowStyle: ViewStyle = {
    flexDirection: isArabic ? "row-reverse" : "row",
  };

  const textDirection: TextStyle = {
    writingDirection: isArabic ? "rtl" : "ltr",
    textAlign: isArabic ? "right" : "left",
    letterSpacing: isArabic ? 0 : undefined,
  };

  const displayStyle: TextStyle = {
    ...textDirection,
    fontFamily: isArabic
      ? Platform.select({ ios: "Geeza Pro", default: "serif" })
      : Platform.select({ ios: "Georgia", default: "serif" }),
  };

  const featureItems = [
    {
      Icon: Calculator,
      title: t("welcome.features.calculate.title"),
      description: t("welcome.features.calculate.description"),
      background: COLORS.lightGreen,
      iconColor: COLORS.primary,
    },
    {
      Icon: Wallet,
      title: t("welcome.features.assets.title"),
      description: t("welcome.features.assets.description"),
      background: COLORS.lightGold,
      iconColor: COLORS.gold,
    },
  ];

  const sideMargin = (n: number): ViewStyle =>
    isArabic ? { marginLeft: n } : { marginRight: n };
  const sideMarginEnd = (n: number): ViewStyle =>
    isArabic ? { marginRight: n } : { marginLeft: n };

  return (
    <View style={tw`flex-1 bg-[#FAF9F5]`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          tw`flex-grow px-6 pt-6 pb-8`,
          { paddingBottom: 36 },
        ]}
      >
        <View
          style={[
            tw`mt-6 mb-7`,
            { alignItems: isArabic ? "flex-end" : "flex-start" },
          ]}
        >
          <View
            style={[
              tw`items-center rounded-full px-3 py-[6px]`,
              rowStyle,
              {
                backgroundColor: COLORS.lightGold,
                borderWidth: 1,
                borderColor: "#E6D9BC",
              },
            ]}
          >
            <View
              style={[
                tw`w-[6px] h-[6px] rounded-full`,
                { backgroundColor: COLORS.gold },
                sideMargin(8),
              ]}
            />
            <Text
              style={[
                tw`font-body text-[11px] font-semibold text-[#7D6334]`,
                textDirection,
                !isArabic && { letterSpacing: 0.6 },
              ]}
            >
              {t("welcome.eyebrow")}
            </Text>
          </View>
        </View>

        <View style={tw`mb-9`}>
          <Text
            style={[
              tw`text-[46px] leading-[54px] text-[#174C3C]`,
              displayStyle,
              !isArabic && { letterSpacing: -0.8 },
            ]}
          >
            {t("welcome.titleLine1")}
          </Text>

          <Text
            style={[
              tw`text-[46px] leading-[54px] italic text-[#9A7B45]`,
              displayStyle,
              !isArabic && { letterSpacing: -0.8 },
            ]}
          >
            {t("welcome.titleLine2")}
          </Text>

          <Text
            style={[
              tw`font-body text-[15px] leading-6 text-[#6B7268] mt-5`,
              textDirection,
              { maxWidth: 330 },
            ]}
          >
            {t("welcome.description")}
          </Text>
        </View>

        <View
          style={[
            tw`mb-7 rounded-[22px] bg-white px-4`,
            { borderWidth: 1, borderColor: COLORS.border },
          ]}
        >
          {featureItems.map((item, index) => (
            <View
              key={item.title}
              style={[
                tw`items-center py-4`,
                rowStyle,
                index !== featureItems.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.border,
                },
              ]}
            >
              <View
                style={[
                  tw`w-12 h-12 rounded-[16px] items-center justify-center`,
                  { backgroundColor: item.background },
                  sideMargin(14),
                ]}
              >
                <item.Icon size={22} color={item.iconColor} strokeWidth={1.75} />
              </View>

              <View style={tw`flex-1`}>
                <Text
                  style={[
                    tw`font-body text-[15px] font-bold text-[#24382D]`,
                    textDirection,
                  ]}
                >
                  {item.title}
                </Text>

                <Text
                  style={[
                    tw`font-body text-[13px] leading-5 text-[#6B7268] mt-[2px]`,
                    textDirection,
                  ]}
                >
                  {item.description}
                </Text>
              </View>

              {isArabic ? (
                <ChevronLeft
                  size={18}
                  color="#B9B49F"
                  strokeWidth={2}
                  style={sideMarginEnd(8)}
                />
              ) : (
                <ChevronRight
                  size={18}
                  color="#B9B49F"
                  strokeWidth={2}
                  style={sideMarginEnd(8)}
                />
              )}
            </View>
          ))}
        </View>

        <View
          style={[
            tw`rounded-[28px] p-6 mb-8`,
            {
              backgroundColor: COLORS.primary,
              overflow: "hidden",
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.18,
              shadowRadius: 20,
              elevation: 6,
            },
          ]}
        >
          <StarMark
            size={190}
            color={COLORS.goldSoft}
            opacity={0.16}
            style={{
              position: "absolute",
              top: -60,
              ...(isArabic ? { left: -60 } : { right: -60 }),
            }}
          />
          <StarMark
            size={96}
            color={COLORS.goldSoft}
            opacity={0.1}
            style={{
              position: "absolute",
              bottom: -34,
              ...(isArabic ? { right: -24 } : { left: -24 }),
            }}
          />

          <View style={[tw`items-center mb-6`, rowStyle]}>
            <View
              style={[
                tw`w-[3px] h-4 rounded-full`,
                { backgroundColor: COLORS.goldSoft },
                sideMargin(10),
              ]}
            />
            <Text
              style={[
                tw`font-body text-[11px] font-semibold text-[#DCE5D5]`,
                textDirection,
                !isArabic && { letterSpacing: 0.6 },
              ]}
            >
              {t("welcome.reminder.title")}
            </Text>
          </View>

          <Text
            style={[
              tw`text-[28px] leading-[52px] text-white`,
              {
                fontFamily: Platform.select({
                  ios: "Geeza Pro",
                  default: "serif",
                }),
                textAlign: "center",
                writingDirection: "rtl",
              },
            ]}
          >
            وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ
          </Text>

          <View
            style={[
              tw`mt-6 pt-4 items-center`,
              rowStyle,
              { borderTopWidth: 1, borderTopColor: "#3D6858" },
            ]}
          >
            <Text
              style={[
                tw`font-body text-[13px] leading-5 text-[#DCE5D5] flex-1`,
                textDirection,
              ]}
            >
              {t("welcome.reminder.translation")}
            </Text>

            <View
              style={[
                tw`rounded-full px-3 py-[5px]`,
                {
                  backgroundColor: "rgba(217,189,131,0.14)",
                },
                sideMarginEnd(12),
              ]}
            >
              <Text
                style={tw`font-body text-[11px] font-semibold text-[#D9BD83]`}
              >
                {t("welcome.reminder.surah")}
              </Text>
            </View>
          </View>
        </View>

        <View style={tw`gap-y-3`}>
          <Pressable
            onPress={() => router.push("/(auth)/register")}
            accessibilityRole="button"
            style={({ pressed }) => [
              tw`rounded-2xl py-[18px] px-5 items-center justify-center`,
              rowStyle,
              {
                backgroundColor: COLORS.primary,
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.22,
                shadowRadius: 12,
                elevation: 4,
              },
              pressed && {
                backgroundColor: COLORS.primaryDeep,
                transform: [{ scale: 0.98 }],
              },
            ]}
          >
            <Text style={tw`font-body text-[15px] font-bold text-white`}>
              {t("welcome.getStarted")}
            </Text>

            {isArabic ? (
              <ArrowLeft
                size={18}
                color="#E4D0A5"
                strokeWidth={2}
                style={sideMarginEnd(10)}
              />
            ) : (
              <ArrowRight
                size={18}
                color="#E4D0A5"
                strokeWidth={2}
                style={sideMarginEnd(10)}
              />
            )}
          </Pressable>

          <Pressable
            onPress={() => router.push("/(auth)/login")}
            accessibilityRole="button"
            style={({ pressed }) => [
              tw`rounded-2xl py-[17px] px-5 items-center justify-center`,
              {
                backgroundColor: "transparent",
                borderWidth: 1.5,
                borderColor: "#CFD3C6",
              },
              pressed && { backgroundColor: COLORS.lightGreen },
            ]}
          >
            <Text
              style={[
                tw`font-body text-[15px] font-semibold text-[#174C3C]`,
                textDirection,
                { textAlign: "center" },
              ]}
            >
              {t("welcome.alreadyHaveAccount")}
            </Text>
          </Pressable>
        </View>

        <Text
          style={[
            tw`font-body text-[11px] leading-5 text-center text-[#8D9086] mt-7`,
            { writingDirection: isArabic ? "rtl" : "ltr" },
          ]}
        >
          {t("welcome.footer")}
        </Text>
      </ScrollView>
    </View>
  );
}