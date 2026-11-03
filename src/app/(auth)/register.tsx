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
  type TextStyle,
  type ViewStyle,
} from "react-native";
import tw from "twrnc";
import { useTranslation } from "react-i18next";
import { signUp } from "@/services/auth";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { t, i18n } = useTranslation();

  const isArabic = i18n.language.startsWith("ar");

  const rowStyle: ViewStyle = {
    flexDirection: isArabic ? "row-reverse" : "row",
  };

  const textDirection: TextStyle = {
    writingDirection: isArabic ? "rtl" : "ltr",
    textAlign: isArabic ? "right" : "left",
  };

  const titleStyle: TextStyle = {
    ...textDirection,
    letterSpacing: isArabic ? 0 : undefined,
  };

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert(
        t("auth.register.errors.missingTitle"),
        t("auth.register.errors.missingDescription"),
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert(
        t("auth.register.errors.invalidEmailTitle"),
        t("auth.register.errors.invalidEmailDescription"),
      );
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        t("auth.register.errors.weakPasswordTitle"),
        t("auth.register.errors.weakPasswordDescription"),
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        t("auth.register.errors.passwordMismatchTitle"),
        t("auth.register.errors.passwordMismatchDescription"),
      );
      return;
    }

    try {
      setLoading(true);

      const result = await signUp({
        fullName: name.trim(),
        email: email.trim(),
        password,
      });

      if (!result.session) {
        Alert.alert(
          t("auth.register.errors.checkEmailTitle"),
          t("auth.register.errors.checkEmailDescription"),
        );
        return;
      }

      router.replace("/home");
    } catch (error) {
      console.error("Registration error:", error);

      const message = error instanceof Error ? error.message : "";

      if (message.toLowerCase().includes("rate limit")) {
        Alert.alert(
          t("auth.register.errors.rateLimitTitle"),
          t("auth.register.errors.rateLimitDescription"),
        );
        return;
      }

      Alert.alert(
        t("auth.register.errors.failedTitle"),
        message || t("auth.register.errors.generic"),
      );
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    {
      label: t("auth.register.fullName"),
      value: name,
      change: setName,
      placeholder: t("auth.register.fullNamePlaceholder"),
      type: "name",
    },
    {
      label: t("auth.register.email"),
      value: email,
      change: setEmail,
      placeholder: t("auth.register.emailPlaceholder"),
      type: "email",
    },
    {
      label: t("auth.register.password"),
      value: password,
      change: setPassword,
      placeholder: t("auth.register.passwordPlaceholder"),
      type: "password",
    },
    {
      label: t("auth.register.confirmPassword"),
      value: confirmPassword,
      change: setConfirmPassword,
      placeholder: t("auth.register.confirmPasswordPlaceholder"),
      type: "confirm",
    },
  ] as const;

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
              isArabic ? { marginLeft: 8 } : { marginRight: 8 },
            ]}
          >
            {isArabic ? "→" : "←"}
          </Text>

          <Text
            style={[tw`text-sm font-semibold text-[#174C3C]`, textDirection]}
          >
            {t("auth.register.back")}
          </Text>
        </Pressable>

        <View style={tw`mb-9`}>
          <Text
            style={[
              tw`text-[10px] font-bold uppercase text-[#9A7B45] mb-3`,
              titleStyle,
              !isArabic && { letterSpacing: 2 },
            ]}
          >
            {t("auth.register.eyebrow")}
          </Text>

          <Text
            style={[
              tw`font-display text-[37px] leading-[44px] text-[#174C3C]`,
              titleStyle,
            ]}
          >
            {t("auth.register.titleLine1")}
          </Text>

          <Text
            style={[
              tw`font-display text-[37px] leading-[44px] italic text-[#174C3C]`,
              titleStyle,
            ]}
          >
            {t("auth.register.titleLine2")}
          </Text>

          <Text
            style={[tw`text-sm leading-6 text-[#777D72] mt-4`, textDirection]}
          >
            {t("auth.register.subtitle")}
          </Text>
        </View>

        <View>
          {fields.map((field) => {
            const isEmail = field.type === "email";
            const isName = field.type === "name";
            const isPassword = field.type === "password";
            const isConfirm = field.type === "confirm";

            const secure =
              (isPassword && !showPassword) ||
              (isConfirm && !showConfirmPassword);

            const inputIsRTL = isArabic && isName;

            const inputDirection: TextStyle = {
              writingDirection: inputIsRTL ? "rtl" : "ltr",
              textAlign: inputIsRTL ? "right" : "left",
            };

            return (
              <View key={field.type} style={tw`mb-5`}>
                <Text
                  style={[
                    tw`text-xs font-bold text-[#24382D] mb-2`,
                    textDirection,
                  ]}
                >
                  {field.label}
                </Text>

                <View
                  style={[
                    tw`items-center bg-white border border-[#E7E5DB] rounded-2xl px-4`,
                    rowStyle,
                  ]}
                >
                  <TextInput
                    value={field.value}
                    onChangeText={field.change}
                    placeholder={field.placeholder}
                    placeholderTextColor="#A0A196"
                    secureTextEntry={secure}
                    keyboardType={isEmail ? "email-address" : "default"}
                    autoCapitalize={isEmail || !isName ? "none" : "words"}
                    autoCorrect={false}
                    autoComplete={
                      isName
                        ? "name"
                        : isEmail
                          ? "email"
                          : isPassword
                            ? "new-password"
                            : "password"
                    }
                    style={[
                      tw`flex-1 py-4 text-sm text-[#24382D]`,
                      inputDirection,
                    ]}
                  />

                  {(isPassword || isConfirm) && (
                    <Pressable
                      onPress={() =>
                        isPassword
                          ? setShowPassword(!showPassword)
                          : setShowConfirmPassword(!showConfirmPassword)
                      }
                      hitSlop={10}
                      accessibilityRole="button"
                      accessibilityLabel={
                        secure
                          ? t("auth.register.showPassword")
                          : t("auth.register.hidePassword")
                      }
                    >
                      <Text
                        style={[
                          tw`text-[10px] font-bold text-[#648064]`,
                          !isArabic && { letterSpacing: 1 },
                        ]}
                      >
                        {secure
                          ? t("auth.register.showPassword")
                          : t("auth.register.hidePassword")}
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })}

          <View style={[tw`items-start mb-7 px-1`, rowStyle]}>
            <View
              style={[
                tw`w-1 h-4 rounded-full bg-[#C59A55] mt-0.5`,
                isArabic ? { marginLeft: 12 } : { marginRight: 12 },
              ]}
            />

            <Text
              style={[
                tw`flex-1 text-xs leading-5 text-[#777D72]`,
                textDirection,
              ]}
            >
              {t("auth.register.passwordHint")}
            </Text>
          </View>

          <Pressable
            onPress={handleRegister}
            disabled={loading}
            style={({ pressed }) => [
              tw`items-center justify-center bg-[#174C3C] rounded-2xl py-[17px] px-5`,
              rowStyle,
              pressed && {
                opacity: 0.85,
                transform: [{ scale: 0.985 }],
              },
              loading && { opacity: 0.7 },
            ]}
          >
            <Text style={tw`text-sm font-bold text-white`}>
              {loading ? t("auth.register.loading") : t("auth.register.submit")}
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

          <View style={[tw`justify-center flex-wrap mt-7`, rowStyle]}>
            <Text style={[tw`text-sm text-[#777D72]`, textDirection]}>
              {t("auth.register.haveAccount")}{" "}
            </Text>

            <Link
              href="/(auth)/login"
              style={tw`text-sm font-bold text-[#174C3C]`}
            >
              {t("auth.register.signIn")}
            </Link>
          </View>
        </View>

        <View style={[tw`items-center mt-10 mb-2`, rowStyle]}>
          <View style={tw`h-px flex-1 bg-[#E7E4D9]`} />

          <Text
            style={[
              tw`text-[9px] text-[#999B90] mx-3`,
              !isArabic && { letterSpacing: 1.5 },
            ]}
          >
            {t("auth.register.footer")}
          </Text>

          <View style={tw`h-px flex-1 bg-[#E7E4D9]`} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
