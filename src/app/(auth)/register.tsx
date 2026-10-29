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
} from "react-native";
import tw from "twrnc";
import { signUp } from "@/services/auth";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert("Missing information", "Please complete all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Weak password", "Use at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password mismatch", "Your passwords do not match.");
      return;
    }
    try {
      const result = await signUp({
        fullName: name,
        email,
        password,
      });

      if (!result.session) {
        Alert.alert(
          "Check your email",
          "If a confirmation email was sent, follow its instructions before signing in.",
        );
        return;
      }
    } catch (error) {
      console.error("Registration error:", error);

      const message = error instanceof Error ? error.message : "";

      if (message.toLowerCase().includes("rate limit")) {
        Alert.alert(
          "Too many attempts",
          "Email sending is temporarily limited. Please try again later.",
        );
        return;
      }

      Alert.alert(
        "Registration failed",
        message || "Something went wrong. Please try again.",
      );
    }
  }

  const fields = [
    {
      label: "Full name",
      value: name,
      change: setName,
      placeholder: "Enter your full name",
      type: "name",
    },
    {
      label: "Email address",
      value: email,
      change: setEmail,
      placeholder: "you@example.com",
      type: "email",
    },
    {
      label: "Password",
      value: password,
      change: setPassword,
      placeholder: "At least 8 characters",
      type: "password",
    },
    {
      label: "Confirm password",
      value: confirmPassword,
      change: setConfirmPassword,
      placeholder: "Re-enter your password",
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
          style={tw`self-start flex-row items-center my-7`}
          hitSlop={10}
        >
          <Text style={tw`text-lg text-[#174C3C] mr-2`}>←</Text>
          <Text style={tw`text-sm font-semibold text-[#174C3C]`}>Back</Text>
        </Pressable>

        <View style={tw`mb-9`}>
        
          <Text
            style={tw`text-[10px] font-bold uppercase tracking-[2px] text-[#9A7B45] mb-3`}
          >
            Begin your journey
          </Text>

          <Text
            style={tw`font-display text-[37px] leading-[44px] text-[#174C3C]`}
          >
            Create your
          </Text>

          <Text
            style={tw`font-display text-[37px] leading-[44px] italic text-[#174C3C]`}
          >
            account.
          </Text>

          <Text style={tw`text-sm leading-6 text-[#777D72] mt-4`}>
            A simpler way to calculate, organize, and manage your zakat.
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

            return (
              <View key={field.type} style={tw`mb-5`}>
                <Text style={tw`text-xs font-bold text-[#24382D] mb-2`}>
                  {field.label}
                </Text>

                <View
                  style={tw`flex-row items-center bg-white border border-[#E7E5DB] rounded-2xl px-4`}
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
                    style={tw`flex-1 py-4 text-sm text-[#24382D]`}
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
                        secure ? "Show password" : "Hide password"
                      }
                    >
                      <Text
                        style={tw`text-[10px] font-bold tracking-wider text-[#648064]`}
                      >
                        {secure ? "SHOW" : "HIDE"}
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })}

          <View style={tw`flex-row items-start mb-7 px-1`}>
            <View style={tw`w-1 h-4 rounded-full bg-[#C59A55] mr-3 mt-0.5`} />
            <Text style={tw`flex-1 text-xs leading-5 text-[#777D72]`}>
              Choose a password with at least 8 characters to help protect your
              account.
            </Text>
          </View>

          <Pressable
            onPress={handleRegister}
            style={({ pressed }) => [
              tw`flex-row items-center justify-center bg-[#174C3C] rounded-2xl py-[17px] px-5`,
              pressed && { opacity: 0.85, transform: [{ scale: 0.985 }] },
            ]}
          >
            <Text style={tw`text-sm font-bold text-white tracking-wide`}>
              Create account
            </Text>
            <Text style={tw`text-lg text-[#E4D0A5] ml-3`}>→</Text>
          </Pressable>

          <View style={tw`flex-row justify-center flex-wrap mt-7`}>
            <Text style={tw`text-sm text-[#777D72]`}>
              Already have an account?{" "}
            </Text>

            <Link
              href="/(auth)/login"
              style={tw`text-sm font-bold text-[#174C3C]`}
            >
              Sign in
            </Link>
          </View>
        </View>

        <View style={tw`flex-row items-center mt-10 mb-2`}>
          <View style={tw`h-px flex-1 bg-[#E7E4D9]`} />
          <Text
            style={tw`text-[9px] uppercase tracking-[1.5px] text-[#999B90] mx-3`}
          >
            Mindful giving starts here
          </Text>
          <View style={tw`h-px flex-1 bg-[#E7E4D9]`} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
