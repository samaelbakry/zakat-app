
import GuideSection from "@/components/ui/GuideSections";
import { getZakatInfo } from "@/services/zakat";
import { translateGuideContent } from "@/localization/translateGuideContent";
import { router, useFocusEffect } from "expo-router";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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

  const isArabic = i18n.language.startsWith("ar");
  const content = translateGuideContent();

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
      const data = await getZakatInfo();
      setInfo(data);
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

  const rowDirection = isArabic ? "flex-row-reverse" : "flex-row";

  const textDirection: TextStyle = {
    writingDirection: isArabic ? "rtl" : "ltr",
    textAlign: isArabic ? "right" : "left",
    letterSpacing: isArabic ? 0 : undefined,
  };

  const titleStyle: TextStyle = {
    writingDirection: isArabic ? "rtl" : "ltr",
    textAlign: "right",
    width: "100%",
    letterSpacing: isArabic ? 0 : undefined,
  };

  const numberSections = ["01", "02", "03", "04", "05"];

  const sectionNumberStyle = [
    tw`text-xs font-bold text-[#C59A55]`,
    isArabic ? { marginLeft: 12 } : { marginRight: 12 },
  ];

  const eyebrowStyle = [
    tw`text-[10px] font-bold text-[#9B7842]`,
    isArabic ? {} : tw`tracking-[2px]`,
    textDirection,
  ];

  const labelStyle = [
    tw`text-[10px] font-bold text-[#6F806E]`,
    isArabic ? {} : tw`tracking-[1.5px]`,
    textDirection,
  ];

  const rates = [
    {
      label: t("guide.rates.general"),
      value: content.rate.general,
    },
    {
      label: t("guide.rates.rainIrrigated"),
      value: content.rate.agriculture_rain,
    },
    {
      label: t("guide.rates.artificiallyIrrigated"),
      value: content.rate.agriculture_irrigated,
    },
  ];

  return (
    <View style={tw`flex-1 bg-[#FAF9F5]`}>
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
                  tw`text-xl text-[#174C3C]`,
                  isArabic ? { marginLeft: 8 } : { marginRight: 8 },
                ]}
              >
                {isArabic ? "→" : "←"}
              </Text>

              <Text
                style={[
                  tw`text-sm font-semibold text-[#174C3C]`,
                  textDirection,
                ]}
              >
                {t("guide.backHome")}
              </Text>
            </Pressable>
          </View>

          <View style={tw`mb-8`}>
            <View
              style={tw.style(
                "flex-row items-center mb-3",
                rowDirection,
              )}
            >
              <View
                style={[
                  tw`w-2 h-2 rounded-full bg-[#C59A55]`,
                  isArabic ? { marginLeft: 8 } : { marginRight: 8 },
                ]}
              />

              <Text style={eyebrowStyle}>
                {t("guide.eyebrow")}
              </Text>
            </View>

            <Text
              style={[
                tw`text-3xl font-bold text-[#174C3C]`,
                titleStyle,
              ]}
            >
              {t("guide.title")}
            </Text>

            <Text
              style={[
                tw`text-sm leading-6 text-[#777D72] mt-3`,
                textDirection,
              ]}
            >
              {t("guide.subtitle")}
            </Text>
          </View>

          {loading ? (
            <View style={tw`py-24 items-center`}>
              <ActivityIndicator size="large" color="#174C3C" />

              <Text
                style={[
                  tw`text-sm text-[#777D72] mt-4`,
                  textDirection,
                ]}
              >
                {t("guide.loading")}
              </Text>
            </View>
          ) : error || !info ? (
            <View
              style={tw`bg-white rounded-2xl p-6 border border-[#EAE8DF]`}
            >
              <View
                style={tw`w-11 h-11 rounded-full bg-[#F4E9D3] items-center justify-center mb-4`}
              >
                <Text style={tw`text-xl text-[#9B7842]`}>!</Text>
              </View>

              <Text
                style={[
                  tw`text-lg font-bold text-[#174C3C]`,
                  titleStyle,
                ]}
              >
                {t("guide.error.title")}
              </Text>

              <Text
                style={[
                  tw`text-sm leading-6 text-[#777D72] mt-2`,
                  textDirection,
                ]}
              >
                {t("guide.error.description")}
              </Text>

              <Pressable
                onPress={() => void loadInfo()}
                style={tw`mt-5 self-start`}
              >
                <Text
                  style={[
                    tw`text-sm font-bold text-[#9B7842]`,
                    textDirection,
                  ]}
                >
                  {t("guide.error.retry")} {isArabic ? "←" : "→"}
                </Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View style={tw`bg-[#174C3C] rounded-[26px] p-6 mb-9`}>
                <Text
                  style={[
                    tw`text-[10px] font-bold text-[#D9BD83] mb-4`,
                    isArabic ? {} : tw`tracking-[2px]`,
                    textDirection,
                  ]}
                >
                  {t("guide.introduction")}
                </Text>

                <Text
                  style={[
                    tw`text-2xl font-bold text-white mb-4`,
                    titleStyle,
                  ]}
                >
                  {t("guide.whatIsZakat")}
                </Text>

                <Text
                  style={[
                    tw`text-sm leading-7 text-[#F0F4ED]`,
                    textDirection,
                  ]}
                >
                  {content.definition}
                </Text>

                <View
                  style={tw.style(
                    "flex-row items-center mt-6",
                    rowDirection,
                  )}
                >
                  <View style={tw`h-px flex-1 bg-[#527263]`} />
                  <View style={tw`w-2 h-2 rounded-full bg-[#C59A55] mx-3`} />
                  <View style={tw`h-px flex-1 bg-[#527263]`} />
                </View>
              </View>

              <View style={tw`mb-9`}>
                <View
                  style={tw.style(
                    "flex-row items-center mb-5",
                    rowDirection,
                  )}
                >
                  <Text style={sectionNumberStyle}>
                    {numberSections[0]}
                  </Text>

                  <View style={tw`flex-1 h-px bg-[#E5E2D8]`} />
                </View>

                <GuideSection
                  title={t("guide.conditions")}
                  items={content.conditions}
                  isArabic={isArabic}
                />
              </View>

              <View style={tw`bg-[#E8EEE5] rounded-2xl p-5 mb-9`}>
                <View
                  style={tw.style(
                    "flex-row items-center mb-3",
                    rowDirection,
                  )}
                >
                  <View
                    style={[
                      tw`w-2 h-2 rounded-full bg-[#C59A55]`,
                      isArabic ? { marginLeft: 8 } : { marginRight: 8 },
                    ]}
                  />

                  <Text style={labelStyle}>
                    {t("guide.importantConcept")}
                  </Text>
                </View>

                <Text
                  style={[
                    tw`text-xl font-bold text-[#174C3C] mb-3`,
                    titleStyle,
                  ]}
                >
                  {t("guide.hawl")}
                </Text>

                <Text
                  style={[
                    tw`text-sm leading-7 text-[#5F705F]`,
                    textDirection,
                  ]}
                >
                  {content.hawl}
                </Text>
              </View>

              <View style={tw`mb-9`}>
                <View
                  style={tw.style(
                    "flex-row items-center mb-5",
                    rowDirection,
                  )}
                >
                  <Text style={sectionNumberStyle}>
                    {numberSections[1]}
                  </Text>

                  <View style={tw`flex-1 h-px bg-[#E5E2D8]`} />
                </View>

                <GuideSection
                  title={t("guide.zakatableAssets")}
                  description={t("guide.zakatableDescription")}
                  items={content.zakatable_assets}
                  isArabic={isArabic}
                />
              </View>

              <View style={tw`mb-9`}>
                <View
                  style={tw.style(
                    "flex-row items-center mb-5",
                    rowDirection,
                  )}
                >
                  <Text style={sectionNumberStyle}>
                    {numberSections[2]}
                  </Text>

                  <View style={tw`flex-1 h-px bg-[#E5E2D8]`} />
                </View>

                <GuideSection
                  title={t("guide.nonZakatableAssets")}
                  description={t("guide.nonZakatableDescription")}
                  items={content.non_zakatable_assets}
                  isArabic={isArabic}
                />
              </View>

              <View style={tw`mb-9`}>
                <View
                  style={tw.style(
                    "flex-row items-center mb-5",
                    rowDirection,
                  )}
                >
                  <Text style={sectionNumberStyle}>
                    {numberSections[3]}
                  </Text>

                  <View style={tw`flex-1 h-px bg-[#E5E2D8]`} />
                </View>

                <Text
                  style={[
                    tw`text-xl font-bold text-[#174C3C] mb-5`,
                    titleStyle,
                  ]}
                >
                  {t("guide.rates.title")}
                </Text>

                {rates.map((rate, index) => (
                  <View
                    key={rate.label}
                    style={tw.style(
                      "py-4",
                      index !== rates.length - 1 &&
                        "border-b border-[#EAE8DF]",
                    )}
                  >
                    <Text
                      style={[
                        tw`text-sm font-bold text-[#174C3C] mb-2`,
                        titleStyle,
                      ]}
                    >
                      {rate.label}
                    </Text>

                    <Text
                      style={[
                        tw`text-sm leading-7 text-[#4F5F52]`,
                        textDirection,
                      ]}
                    >
                      {rate.value}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={tw`mb-9`}>
                <View
                  style={tw.style(
                    "flex-row items-center mb-5",
                    rowDirection,
                  )}
                >
                  <Text style={sectionNumberStyle}>
                    {numberSections[4]}
                  </Text>

                  <View style={tw`flex-1 h-px bg-[#E5E2D8]`} />
                </View>

                <GuideSection
                  title={t("guide.recipients")}
                  items={content.eligible_recipients}
                  isArabic={isArabic}
                />
              </View>

              <View
                style={tw`bg-white rounded-2xl p-5 mb-9 border border-[#EAE8DF]`}
              >
                <View
                  style={tw.style(
                    "flex-row items-center mb-5",
                    rowDirection,
                  )}
                >
                  <View
                    style={[
                      tw`w-9 h-9 rounded-xl bg-[#F4E9D3] items-center justify-center`,
                      isArabic ? { marginLeft: 12 } : { marginRight: 12 },
                    ]}
                  >
                    <Text style={tw`text-base font-bold text-[#9B7842]`}>
                      N
                    </Text>
                  </View>

                  <View style={tw`flex-1`}>
                    <Text
                      style={[
                        tw`text-xl font-bold text-[#174C3C]`,
                        titleStyle,
                      ]}
                    >
                      {t("guide.nisab.title")}
                    </Text>

                    <Text
                      style={[
                        tw`text-xs text-[#85897F] mt-1`,
                        textDirection,
                      ]}
                    >
                      {t("guide.nisab.description")}
                    </Text>
                  </View>
                </View>

                <View style={tw`bg-[#FAF9F5] rounded-xl p-4 mb-3`}>
                  <Text
                    style={[
                      tw`text-xs font-semibold text-[#85897F] mb-2`,
                      titleStyle,
                    ]}
                  >
                    {t("guide.nisab.goldStandard")}
                  </Text>

                  <Text
                    style={[
                      tw`text-2xl font-bold text-[#174C3C]`,
                      {
                        writingDirection: "ltr",
                        textAlign: isArabic ? "right" : "left",
                      },
                    ]}
                  >
                    {info.nisab.gold.grams}
                    <Text style={tw`text-sm font-medium text-[#777D72]`}>
                      {" "}{t("guide.nisab.grams")}
                    </Text>
                  </Text>

                  <Text
                    style={[
                      tw`text-xs leading-5 text-[#777D72] mt-2`,
                      textDirection,
                    ]}
                  >
                    {content.nisab.gold}
                  </Text>
                </View>

                <View style={tw`bg-[#FAF9F5] rounded-xl p-4`}>
                  <Text
                    style={[
                      tw`text-xs font-semibold text-[#85897F] mb-2`,
                      titleStyle,
                    ]}
                  >
                    {t("guide.nisab.silverStandard")}
                  </Text>

                  <Text
                    style={[
                      tw`text-2xl font-bold text-[#174C3C]`,
                      {
                        writingDirection: "ltr",
                        textAlign: isArabic ? "right" : "left",
                      },
                    ]}
                  >
                    {info.nisab.silver.grams}
                    <Text style={tw`text-sm font-medium text-[#777D72]`}>
                      {" "}{t("guide.nisab.grams")}
                    </Text>
                  </Text>

                  <Text
                    style={[
                      tw`text-xs leading-5 text-[#777D72] mt-2`,
                      textDirection,
                    ]}
                  >
                    {content.nisab.silver}
                  </Text>
                </View>

                <View style={tw`border-t border-[#EAE8DF] mt-4 pt-4`}>
                  <Text
                    style={[
                      tw`text-xs leading-6 text-[#777D72]`,
                      textDirection,
                    ]}
                  >
                    {content.nisab.note}
                  </Text>
                </View>
              </View>

              <View style={tw`bg-[#F4E9D3] rounded-2xl p-5 mb-9`}>
                <View
                  style={tw.style(
                    "flex-row items-center mb-3",
                    rowDirection,
                  )}
                >
                  <Text
                    style={[
                      tw`text-base text-[#9B7842]`,
                      isArabic ? { marginLeft: 8 } : { marginRight: 8 },
                    ]}
                  >
                    ⓘ
                  </Text>

                  <Text
                    style={[
                      tw`text-sm font-bold text-[#80602F]`,
                      titleStyle,
                    ]}
                  >
                    {t("guide.disclaimer.title")}
                  </Text>
                </View>

                <Text
                  style={[
                    tw`text-xs leading-6 text-[#6D5B3E]`,
                    textDirection,
                  ]}
                >
                  {content.disclaimer}
                </Text>

                <View style={tw`h-px bg-[#E4D0A5] my-4`} />

                <Text
                  style={[
                    tw`text-[10px] leading-5 text-[#80602F]`,
                    textDirection,
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
                  <Text
                    style={[
                      tw`text-base font-bold text-white`,
                      titleStyle,
                    ]}
                  >
                    {t("guide.calculator.title")}
                  </Text>

                  <Text
                    style={[
                      tw`text-xs text-[#DCE5D5] mt-2`,
                      textDirection,
                    ]}
                  >
                    {t("guide.calculator.description")}
                  </Text>
                </View>

                <View
                  style={tw`w-10 h-10 rounded-full bg-[#C59A55] items-center justify-center`}
                >
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
