import GuideSection from "@/components/ui/GuideSections";
import { useTheme } from "@/context/ThemeContext";
import { translateGuideContent } from "@/localization/translateGuideContent";
import { getZakatInfo } from "@/services/zakat";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  ScrollView,
  Text,
  View,
  type TextStyle,
} from "react-native";
import tw from "twrnc";

type ZakatInfo = Awaited<ReturnType<typeof getZakatInfo>>;

export default function ZakatGuideScreen() {
  const [info, setInfo] = useState<ZakatInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { t, i18n } = useTranslation();
  const { colors, isDarkMode } = useTheme();

  const isArabic = i18n.language.startsWith("ar");
  const content = translateGuideContent();
  const rowDirection = isArabic ? "flex-row-reverse" : "flex-row";

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const previousLanguage = useRef(i18n.language);

  useEffect(() => {
    if (previousLanguage.current === i18n.language) return;

    previousLanguage.current = i18n.language;

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, [i18n.language, fadeAnim]);

  const loadInfo = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      setInfo(await getZakatInfo());
    } catch (err) {
      console.error("Failed to load zakat guide:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadInfo();
    }, [loadInfo]),
  );

  const textDirection: TextStyle = {
    writingDirection: isArabic ? "rtl" : "ltr",
    textAlign: isArabic ? "right" : "left",
    letterSpacing: isArabic ? 0 : undefined,
  };

  const titleStyle: TextStyle = { ...textDirection, width: "100%" };

  const text = (color: string) => [textDirection, { color }];
  const title = (color: string) => [titleStyle, { color }];

  const sectionDivider = isDarkMode ? colors.border : "#E5E2D8";
  const gold = "#C59A55";
  const goldText = isDarkMode ? "#D9BD83" : "#9B7842";

  const sectionNumberStyle = [
    tw`text-xs font-bold`,
    { color: gold },
    isArabic ? { marginLeft: 12 } : { marginRight: 12 },
  ];

  const eyebrowStyle = [
    tw`text-[10px] font-bold`,
    { color: goldText },
    isArabic ? {} : tw`tracking-[2px]`,
    textDirection,
  ];

  const labelStyle = [
    tw`text-[10px] font-bold`,
    { color: colors.secondaryText },
    isArabic ? {} : tw`tracking-[1.5px]`,
    textDirection,
  ];

  const rates = [
    { label: t("guide.rates.general"), value: content.rate.general },
    { label: t("guide.rates.rainIrrigated"), value: content.rate.agriculture_rain },
    {
      label: t("guide.rates.artificiallyIrrigated"),
      value: content.rate.agriculture_irrigated,
    },
  ];

  const sections = [
    {
      title: t("guide.conditions"),
      items: content.conditions,
    },
    {
      title: t("guide.zakatableAssets"),
      description: t("guide.zakatableDescription"),
      items: content.zakatable_assets,
    },
    {
      title: t("guide.nonZakatableAssets"),
      description: t("guide.nonZakatableDescription"),
      items: content.non_zakatable_assets,
    },
    {
      title: t("guide.recipients"),
      items: content.eligible_recipients,
    },
  ];

  const renderSectionDivider = (number: string) => (
    <View style={tw.style("flex-row items-center mb-5", rowDirection)}>
      <Text style={sectionNumberStyle}>{number}</Text>
      <View style={[tw`flex-1 h-px`, { backgroundColor: sectionDivider }]} />
    </View>
  );

  const marginSide = isArabic ? "marginLeft" : "marginRight";

  return (
    <View style={[tw`flex-1`, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={tw`px-6 pt-12 pb-12`}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <View
            style={tw.style(
              "flex-row items-center justify-between mb-8",
              rowDirection,
            )}
          >
            <Pressable
              onPress={() => router.replace("/home")}
              style={tw.style("flex-row items-center", rowDirection)}
            >
              <Text
                style={[
                  tw`text-xl`,
                  { color: colors.primary },
                  isArabic ? { marginLeft: 8 } : { marginRight: 8 },
                ]}
              >
                {isArabic ? "→" : "←"}
              </Text>
              <Text
                style={[
                  tw`text-sm font-semibold`,
                  { color: colors.primary },
                  textDirection,
                ]}
              >
                {t("guide.backHome")}
              </Text>
            </Pressable>
          </View>

          <View style={tw`mb-8`}>
            <View style={tw.style("flex-row items-center mb-3", rowDirection)}>
              <View
                style={[
                  tw`w-2 h-2 rounded-full`,
                  { backgroundColor: gold },
                  isArabic ? { marginLeft: 8 } : { marginRight: 8 },
                ]}
              />
              <Text style={eyebrowStyle}>{t("guide.eyebrow")}</Text>
            </View>

            <Text style={[tw`text-3xl font-bold`, title(colors.primary)]}>
              {t("guide.title")}
            </Text>
            <Text style={[tw`text-sm leading-6 mt-3`, text(colors.secondaryText)]}>
              {t("guide.subtitle")}
            </Text>
          </View>

          {loading ? (
            <View style={tw`py-24 items-center`}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[tw`text-sm mt-4`, text(colors.secondaryText)]}>
                {t("guide.loading")}
              </Text>
            </View>
          ) : error || !info ? (
            <View
              style={[
                tw`rounded-2xl p-6 border`,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View
                style={[
                  tw`w-11 h-11 rounded-full items-center justify-center mb-4`,
                  { backgroundColor: isDarkMode ? "#453923" : "#F4E9D3" },
                ]}
              >
                <Text style={[tw`text-xl`, { color: goldText }]}>!</Text>
              </View>

              <Text style={[tw`text-lg font-bold`, title(colors.primary)]}>
                {t("guide.error.title")}
              </Text>
              <Text style={[tw`text-sm leading-6 mt-2`, text(colors.secondaryText)]}>
                {t("guide.error.description")}
              </Text>

              <Pressable onPress={() => void loadInfo()} style={tw`mt-5 self-start`}>
                <Text style={[tw`text-sm font-bold`, text(goldText)]}>
                  {t("guide.error.retry")} {isArabic ? "←" : "→"}
                </Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View style={tw`bg-[#174C3C] rounded-[26px] p-6 mb-9`}>
                <Text
                  style={[
                    tw`text-[10px] font-bold mb-4`,
                    { color: "#D9BD83" },
                    isArabic ? {} : tw`tracking-[2px]`,
                    textDirection,
                  ]}
                >
                  {t("guide.introduction")}
                </Text>
                <Text style={[tw`text-2xl font-bold text-white mb-4`, titleStyle]}>
                  {t("guide.whatIsZakat")}
                </Text>
                <Text style={[tw`text-sm leading-7 text-[#F0F4ED]`, textDirection]}>
                  {content.definition}
                </Text>

                <View style={tw.style("flex-row items-center mt-6", rowDirection)}>
                  <View style={tw`h-px flex-1 bg-[#527263]`} />
                  <View style={tw`w-2 h-2 rounded-full bg-[#C59A55] mx-3`} />
                  <View style={tw`h-px flex-1 bg-[#527263]`} />
                </View>
              </View>

              {sections.slice(0, 3).map((section, index) => (
                <View key={section.title} style={tw`mb-9`}>
                  {renderSectionDivider(`0${index + 1}`)}
                  <GuideSection
                    title={section.title}
                    description={section.description}
                    items={section.items}
                    isArabic={isArabic}
                  />
                </View>
              ))}

              <View
                style={[
                  tw`rounded-2xl p-5 mb-9`,
                  { backgroundColor: isDarkMode ? colors.surface : "#E8EEE5" },
                ]}
              >
                <View style={tw.style("flex-row items-center mb-3", rowDirection)}>
                  <View
                    style={[
                      tw`w-2 h-2 rounded-full bg-[#C59A55]`,
                      isArabic ? { marginLeft: 8 } : { marginRight: 8 },
                    ]}
                  />
                  <Text style={labelStyle}>{t("guide.importantConcept")}</Text>
                </View>
                <Text style={[tw`text-xl font-bold mb-3`, title(colors.primary)]}>
                  {t("guide.hawl")}
                </Text>
                <Text style={[tw`text-sm leading-7`, text(colors.secondaryText)]}>
                  {content.hawl}
                </Text>
              </View>

              <View style={tw`mb-9`}>
                {renderSectionDivider("04")}
                <Text style={[tw`text-xl font-bold mb-5`, title(colors.primary)]}>
                  {t("guide.rates.title")}
                </Text>

                {rates.map((rate, index) => (
                  <View
                    key={rate.label}
                    style={[
                      tw`py-4`,
                      index !== rates.length - 1 && {
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                      },
                    ]}
                  >
                    <Text style={[tw`text-sm font-bold mb-2`, title(colors.primary)]}>
                      {rate.label}
                    </Text>
                    <Text style={[tw`text-sm leading-7`, text(colors.secondaryText)]}>
                      {rate.value}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={tw`mb-9`}>
                {renderSectionDivider("05")}
                <GuideSection
                  title={sections[3].title}
                  items={sections[3].items}
                  isArabic={isArabic}
                />
              </View>

              <View
                style={[
                  tw`rounded-2xl p-5 mb-9 border`,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <View style={tw.style("flex-row items-center mb-5", rowDirection)}>
                  <View
                    style={[
                      tw`w-9 h-9 rounded-xl items-center justify-center`,
                      { backgroundColor: isDarkMode ? "#453923" : "#F4E9D3" },
                      { [marginSide]: 12 },
                    ]}
                  >
                    <Text style={[tw`text-base font-bold`, { color: goldText }]}>
                      N
                    </Text>
                  </View>

                  <View style={tw`flex-1`}>
                    <Text style={[tw`text-xl font-bold`, title(colors.primary)]}>
                      {t("guide.nisab.title")}
                    </Text>
                    <Text style={[tw`text-xs mt-1`, text(colors.secondaryText)]}>
                      {t("guide.nisab.description")}
                    </Text>
                  </View>
                </View>

                {(["gold", "silver"] as const).map((metal, index) => (
                  <View
                    key={metal}
                    style={[
                      tw`rounded-xl p-4`,
                      index === 0 && tw`mb-3`,
                      { backgroundColor: colors.surface },
                    ]}
                  >
                    <Text style={[tw`text-xs font-semibold mb-2`, title(colors.secondaryText)]}>
                      {t(`guide.nisab.${metal}Standard`)}
                    </Text>
                    <Text
                      style={[
                        tw`text-2xl font-bold`,
                        { color: colors.primary, writingDirection: "ltr" },
                        { textAlign: isArabic ? "right" : "left" },
                      ]}
                    >
                      {info.nisab[metal].grams}
                      <Text style={[tw`text-sm font-medium`, { color: colors.secondaryText }]}>
                        {" "}{t("guide.nisab.grams")}
                      </Text>
                    </Text>
                    <Text style={[tw`text-xs leading-5 mt-2`, text(colors.secondaryText)]}>
                      {content.nisab[metal]}
                    </Text>
                  </View>
                ))}

                <View
                  style={[
                    tw`mt-4 pt-4`,
                    { borderTopWidth: 1, borderTopColor: colors.border },
                  ]}
                >
                  <Text style={[tw`text-xs leading-6`, text(colors.secondaryText)]}>
                    {content.nisab.note}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  tw`rounded-2xl p-5 mb-9`,
                  { backgroundColor: isDarkMode ? "#3B3224" : "#F4E9D3" },
                ]}
              >
                <View style={tw.style("flex-row items-center mb-3", rowDirection)}>
                  <Text
                    style={[
                      tw`text-base`,
                      { color: goldText },
                      isArabic ? { marginLeft: 8 } : { marginRight: 8 },
                    ]}
                  >
                    ⓘ
                  </Text>
                  <Text style={[tw`text-sm font-bold`, title(goldText)]}>
                    {t("guide.disclaimer.title")}
                  </Text>
                </View>

                <Text
                  style={[
                    tw`text-xs leading-6`,
                    text(isDarkMode ? "#E4D6BC" : "#6D5B3E"),
                  ]}
                >
                  {content.disclaimer}
                </Text>
                <View
                  style={[
                    tw`h-px my-4`,
                    { backgroundColor: isDarkMode ? "#62513A" : "#E4D0A5" },
                  ]}
                />
                <Text
                  style={[
                    tw`text-[10px] leading-5`,
                    text(isDarkMode ? "#D9BD83" : "#80602F"),
                  ]}
                >
                  {t("guide.disclaimer.source")}: {content.source}
                </Text>
              </View>

              <Pressable
                onPress={() => router.push("/zakat-calculation")}
                style={({ pressed }) => [
                  tw.style(
                    "bg-[#174C3C] rounded-2xl p-5 flex-row items-center justify-between",
                    rowDirection,
                  ),
                  pressed && { opacity: 0.85 },
                ]}
              >
                <View
                  style={[
                    tw`flex-1`,
                    isArabic ? { marginLeft: 12 } : { marginRight: 12 },
                  ]}
                >
                  <Text style={[tw`text-base font-bold text-white`, titleStyle]}>
                    {t("guide.calculator.title")}
                  </Text>
                  <Text style={[tw`text-xs text-[#DCE5D5] mt-2`, textDirection]}>
                    {t("guide.calculator.description")}
                  </Text>
                </View>

                <View style={tw`w-10 h-10 rounded-full bg-[#C59A55] items-center justify-center`}>
                  <Text style={tw`text-xl text-white`}>
                    {isArabic ? "←" : "→"}
                  </Text>
                </View>
              </Pressable>
            </>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}
