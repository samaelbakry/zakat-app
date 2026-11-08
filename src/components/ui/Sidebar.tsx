import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  Text,
  View,
  Dimensions,
} from "react-native";
import {
  X,
  Languages,
  Moon,
  Sun,
  LogOut,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import tw from "twrnc";

import { useTheme } from "@/context/ThemeContext";
import { signOut } from "@/services/auth";

const SIDEBAR_WIDTH = Dimensions.get("window").width * 0.82;

type SidebarProps = {
  visible: boolean;
  onClose: () => void;
};

export default function Sidebar({ visible, onClose }: SidebarProps) {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const { i18n } = useTranslation();

  const isArabic = i18n.language.startsWith("ar");
  const translateX = useRef(new Animated.Value(SIDEBAR_WIDTH)).current;
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: visible ? 0 : SIDEBAR_WIDTH,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [visible, translateX]);

  const changeLanguage = async (language: "ar" | "en") => {
    await i18n.changeLanguage(language);
  };

  const handleLogout = async () => {
    if (signingOut) return;

    setSigningOut(true);

    try {
      await signOut();
      onClose();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setSigningOut(false);
    }
  };

  if (!visible) return null;

  return (
    <View style={tw`absolute inset-0 z-50`}>
      <Pressable
        onPress={onClose}
        style={[
          tw`absolute inset-0`,
          { backgroundColor: "rgba(0,0,0,0.45)" },
        ]}
      />

      <Animated.View
        style={[
          tw`absolute top-0 bottom-0 right-0`,
          {
            width: SIDEBAR_WIDTH,
            backgroundColor: colors.background,
            transform: [{ translateX }],
            borderTopLeftRadius: 28,
            borderBottomLeftRadius: 28,
            elevation: 20,
          },
        ]}
      >
        <View style={tw`flex-1 px-6 pt-16 pb-8`}>
          <View
            style={[
              tw`flex-row items-center justify-between mb-8`,
              isArabic && tw`flex-row-reverse`,
            ]}
          >
            <View>
              <Text
                style={[
                  tw`text-2xl font-bold`,
                  { color: colors.primary },
                ]}
              >
                Zakat
              </Text>

              <Text
                style={[
                  tw`text-xs mt-1`,
                  { color: colors.secondaryText },
                ]}
              >
                {isArabic
                  ? "إدارة تفضيلاتك"
                  : "Manage your preferences"}
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              style={[
                tw`w-10 h-10 rounded-full items-center justify-center`,
                { backgroundColor: colors.surface },
              ]}
            >
              <X size={21} color={colors.text} />
            </Pressable>
          </View>

          <Text
            style={[
              tw`text-xs font-bold mb-3`,
              { color: colors.muted },
              isArabic && tw`text-right`,
            ]}
          >
            {isArabic ? "التفضيلات" : "PREFERENCES"}
          </Text>

          <View
            style={[
              tw`rounded-2xl p-4 mb-3`,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: 1,
              },
            ]}
          >
            <View
              style={[
                tw`flex-row items-center mb-4`,
                isArabic && tw`flex-row-reverse`,
              ]}
            >
              <View
                style={[
                  tw`w-10 h-10 rounded-xl items-center justify-center`,
                  { backgroundColor: colors.surface },
                ]}
              >
                <Languages size={20} color={colors.primary} />
              </View>

              <Text
                style={[
                  tw`font-bold mx-3`,
                  { color: colors.text },
                ]}
              >
                {isArabic ? "اللغة" : "Language"}
              </Text>
            </View>

            <View
              style={[
                tw`flex-row rounded-xl p-1`,
                { backgroundColor: colors.surface },
              ]}
            >
              {(["en", "ar"] as const).map((language) => {
                const selected = i18n.language.startsWith(language);

                return (
                  <Pressable
                    key={language}
                    onPress={() => changeLanguage(language)}
                    style={[
                      tw`flex-1 py-3 rounded-lg items-center`,
                      selected && { backgroundColor: colors.primary },
                    ]}
                  >
                    <Text
                      style={[
                        tw`text-sm font-bold`,
                        {
                          color: selected
                            ? "#FFFFFF"
                            : colors.secondaryText,
                        },
                      ]}
                    >
                      {language === "en" ? "English" : "العربية"}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Pressable
            onPress={toggleTheme}
            style={[
              tw`rounded-2xl p-4 mb-3 flex-row items-center justify-between`,
              isArabic && tw`flex-row-reverse`,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: 1,
              },
            ]}
          >
            <View
              style={[
                tw`flex-row items-center`,
                isArabic && tw`flex-row-reverse`,
              ]}
            >
              <View
                style={[
                  tw`w-10 h-10 rounded-xl items-center justify-center`,
                  { backgroundColor: colors.surface },
                ]}
              >
                {isDarkMode ? (
                  <Moon size={20} color={colors.accent} />
                ) : (
                  <Sun size={20} color={colors.accent} />
                )}
              </View>

              <View style={tw`mx-3`}>
                <Text
                  style={[tw`font-bold`, { color: colors.text }]}
                >
                  {isArabic ? "الوضع الداكن" : "Dark Mode"}
                </Text>

                <Text
                  style={[
                    tw`text-xs mt-1`,
                    { color: colors.secondaryText },
                  ]}
                >
                  {isDarkMode
                    ? isArabic
                      ? "مفعّل"
                      : "Enabled"
                    : isArabic
                      ? "غير مفعّل"
                      : "Disabled"}
                </Text>
              </View>
            </View>

            <View
              style={[
                tw`w-12 h-7 rounded-full justify-center px-1`,
                {
                  backgroundColor: isDarkMode
                    ? colors.primary
                    : colors.border,
                },
              ]}
            >
              <View
                style={[
                  tw`w-5 h-5 rounded-full bg-white`,
                  {
                    alignSelf: isDarkMode
                      ? "flex-end"
                      : "flex-start",
                  },
                ]}
              />
            </View>
          </Pressable>

          <View style={tw`flex-1`} />

          <Pressable
            onPress={handleLogout}
            disabled={signingOut}
            style={({ pressed }) => [
              tw`rounded-2xl p-4 flex-row items-center justify-center`,
              isArabic && tw`flex-row-reverse`,
              {
                backgroundColor: isDarkMode
                  ? "#3A2424"
                  : "#FBEAEA",
                opacity: pressed || signingOut ? 0.7 : 1,
              },
            ]}
          >
            {signingOut ? (
              <ActivityIndicator color="#D9534F" />
            ) : (
              <>
                <LogOut size={19} color="#D9534F" />

                <Text style={tw`text-[#D9534F] font-bold mx-2`}>
                  {isArabic ? "تسجيل الخروج" : "Sign Out"}
                </Text>
              </>
            )}
          </Pressable>

          <Text
            style={[
              tw`text-center text-xs mt-5`,
              { color: colors.muted },
            ]}
          >
            Zakat • {isArabic ? "صدقة ونماء" : "Give with purpose"}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}