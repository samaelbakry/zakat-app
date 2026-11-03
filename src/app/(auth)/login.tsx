
import { useState } from "react";
import { Link, router } from "expo-router";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  ViewStyle,
  type TextStyle,
} from "react-native";
import { useTranslation } from "react-i18next";
import tw from "twrnc";
import { signIn } from "@/services/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert(
        t("auth.login.errors.missingTitle"),
        t("auth.login.errors.missingDescription"),
      );
      return;
    }

    try {
      await signIn(email, password);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : t("auth.login.errors.generic");

      Alert.alert(t("auth.login.errors.failedTitle"), message);
    }
  };


  return (
    <KeyboardAvoidingView
      style={tw`flex-1 bg-[#FAF9F5]`}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`flex-grow px-6 pt-6 pb-8`}
      >
       <Pressable
          onPress={() => router.back()}
          style={[
            tw`items-center my-7`,
            rowStyle,
            { alignSelf: isArabic ? "flex-end" : "flex-start" },
          ]}
          hitSlop={10}
        >
          <Text
            style={[
              tw`text-lg text-[#174C3C]`,
              isArabic
                ? { marginLeft: 8 }
                : { marginRight: 8 },
            ]}
          >
            {isArabic ? "→" : "←"}
          </Text>

          <Text style={[tw`text-sm font-semibold text-[#174C3C]`, textDirection]}>
            {t("auth.login.back")}
          </Text>
        </Pressable>

        <View style={tw`mb-9`}>
          <Text
            style={[
              tw`text-[10px] font-bold uppercase text-[#9A7B45] mb-3`,
              isArabic ? {} : tw`tracking-[2px]`,
              textDirection,
            ]}
          >
            {t("auth.login.welcome")}
          </Text>

          <Text
            style={[
              tw`font-display text-[38px] leading-[45px] text-[#174C3C]`,
              textDirection,
            ]}
          >
            {t("auth.login.titleLine1")}
          </Text>

          <Text
            style={[
              tw`font-display text-[38px] leading-[45px] italic text-[#174C3C]`,
              textDirection,
            ]}
          >
            {t("auth.login.titleLine2")}
          </Text>

          <Text
            style={[
              tw`text-sm leading-6 text-[#777D72] mt-4`,
              textDirection,
            ]}
          >
            {t("auth.login.subtitle")}
          </Text>
        </View>

        <View>
          <Text
            style={[
              tw`text-xs font-bold text-[#24382D] mb-2`,
              textDirection,
            ]}
          >
            {t("auth.login.email")}
          </Text>

          <View
            style={tw.style(
              "flex-row items-center bg-white border border-[#E7E5DB] rounded-2xl px-4 mb-5",
              rowStyle,
            )}
          >
            <Text
              style={[
                tw`text-[#9A7B45] text-base`,
                isArabic ? { marginLeft: 12 } : { marginRight: 12 },
              ]}
            >
              @
            </Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder={t("auth.login.emailPlaceholder")}
              placeholderTextColor="#A0A196"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textAlign="left"
              style={tw`flex-1 py-4 text-sm text-[#24382D]`}
            />
          </View>

          <Text
            style={[
              tw`text-xs font-bold text-[#24382D] mb-2`,
              textDirection,
            ]}
          >
            {t("auth.login.password")}
          </Text>

          <View
            style={tw.style(
              "flex-row items-center bg-white border border-[#E7E5DB] rounded-2xl px-4",
              rowStyle,
            )}
          >
            <Text
              style={[
                tw`text-[#9A7B45] text-base`,
                isArabic ? { marginLeft: 12 } : { marginRight: 12 },
              ]}
            >
              ⌑
            </Text>

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder={t("auth.login.passwordPlaceholder")}
              placeholderTextColor="#A0A196"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="current-password"
              textAlign={isArabic ? "right" : "left"}
              style={tw`flex-1 py-4 text-sm text-[#24382D]`}
            />

            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={
                showPassword
                  ? t("auth.login.hidePassword")
                  : t("auth.login.showPassword")
              }
            >
              <Text
                style={[
                  tw`text-[10px] font-bold text-[#648064]`,
                  isArabic ? {} : tw`tracking-wider`,
                ]}
              >
                {showPassword
                  ? t("auth.login.hidePassword")
                  : t("auth.login.showPassword")}
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={handleLogin}
            accessibilityRole="button"
            style={({ pressed }) => [
              tw.style(
                "flex-row items-center justify-center bg-[#174C3C] rounded-2xl py-[17px] px-5 my-2",
                rowStyle,
              ),
              pressed && {
                opacity: 0.85,
                transform: [{ scale: 0.985 }],
              },
            ]}
          >
            <Text
              style={[
                tw`text-sm font-bold text-white`,
                isArabic ? {} : tw`tracking-wide`,
              ]}
            >
              {t("auth.login.submit")}
            </Text>

            <Text
              style={[
                tw`text-lg text-[#E4D0A5]`,
                isArabic ? { marginRight: 12 } : { marginLeft: 12 },
              ]}
            >
              {isArabic ? "←" : "→"}
            </Text>
          </Pressable>

          <View
            style={tw.style(
              "flex-row justify-center flex-wrap mt-7",
              rowStyle,
            )}
          >
            <Text
              style={[
                tw`text-sm text-[#777D72]`,
                textDirection,
              ]}
            >
              {t("auth.login.noAccount")}{" "}
            </Text>

            <Link
              href="/(auth)/register"
              style={[
                tw`text-sm font-bold text-[#174C3C]`,
                textDirection,
              ]}
            >
              {t("auth.login.register")}
            </Link>
          </View>
        </View>

        <View
          style={tw.style(
            "flex-row items-center mt-10 mb-2",
            rowStyle,
          )}
        >
          <View style={tw`h-px flex-1 bg-[#E7E4D9]`} />

          <Text
            style={[
              tw`text-[9px] text-[#999B90] mx-3`,
              isArabic ? {} : tw`tracking-[1.5px] uppercase`,
            ]}
          >
            {t("auth.login.footer")}
          </Text>

          <View style={tw`h-px flex-1 bg-[#E7E4D9]`} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
