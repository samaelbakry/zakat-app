
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import tw from "twrnc";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: "en", label: "English" },
    { code: "ar", label: "العربية" },
  ] as const;

  return (
    <View style={tw`flex-row items-center gap-2`}>
      {languages.map((language) => {
        const isSelected = i18n.language === language.code;

        return (
          <Pressable
            key={language.code}
            onPress={() => i18n.changeLanguage(language.code)}
            style={tw.style(
              "px-4 py-2 rounded-xl border",
              isSelected
                ? "bg-[#174C3C] border-[#174C3C]"
                : "bg-white border-[#EAE8DF]"
            )}
          >
            <Text
              style={tw.style(
                "text-xs font-bold",
                isSelected ? "text-white" : "text-[#174C3C]"
              )}
            >
              {language.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
