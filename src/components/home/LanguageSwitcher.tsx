
import { useTranslation } from "react-i18next";
import { Pressable, Text } from "react-native";
import tw from "twrnc";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const isArabic = i18n.language.startsWith("ar");

  const toggleLanguage = () => {
    i18n.changeLanguage(isArabic ? "en" : "ar");
  };

  return (
    <Pressable
      onPress={toggleLanguage}
      style={[
        tw`absolute top-14 z-50 px-4 py-3 rounded-full bg-white border border-[#EAE8DF]`,
        {
          right: isArabic ? undefined : 20,
          left: isArabic ? 20 : undefined,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.12,
          shadowRadius: 6,
        },
      ]}
    >
      <Text style={tw`text-xs font-bold text-[#174C3C]`}>
        {isArabic ? "EN" : "عربي"}
      </Text>
    </Pressable>
  );
}
