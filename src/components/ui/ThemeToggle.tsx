import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import tw from "twrnc";

import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const { i18n } = useTranslation();

  const isArabic = i18n.language.startsWith("ar");

  return (
    <Pressable
      onPress={toggleTheme}
      accessibilityRole="switch"
      accessibilityState={{ checked: isDarkMode }}
      style={({ pressed }) => [
        tw`rounded-2xl p-4 border`,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <View
        style={[
          tw`flex-row items-center justify-between`,
          isArabic && { flexDirection: "row-reverse" },
        ]}
      >
        <View>
          <Text
            style={[
              tw`text-sm font-bold`,
              { color: colors.text },
              isArabic && { textAlign: "right" },
            ]}
          >
            {isArabic ? "المظهر" : "Appearance"}
          </Text>

          <Text
            style={[
              tw`text-xs mt-1`,
              { color: colors.secondaryText },
              isArabic && { textAlign: "right" },
            ]}
          >
            {isDarkMode
              ? isArabic
                ? "الوضع الداكن"
                : "Dark Mode"
              : isArabic
                ? "الوضع الفاتح"
                : "Light Mode"}
          </Text>
        </View>

        <View
          style={[
            tw`rounded-full px-4 py-2`,
            {
              backgroundColor: colors.surface,
            },
          ]}
        >
          <Text
            style={[
              tw`text-xs font-bold`,
              { color: colors.primary },
            ]}
          >
            {isDarkMode
              ? isArabic
                ? "داكن"
                : "DARK"
              : isArabic
                ? "فاتح"
                : "LIGHT"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}