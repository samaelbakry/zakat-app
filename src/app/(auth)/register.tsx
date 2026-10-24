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
      style={tw`flex-1 bg-[#F7F5EF]`}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`flex-grow justify-center px-6 py-8`}
      >
        <Pressable onPress={() => router.back()} style={tw`self-start mb-7`}>
          <Text style={tw`text-[#174C3C] font-semibold text-base`}>← Back</Text>
        </Pressable>

        <View style={tw`mb-7`}>
          <View
            style={tw`w-14 h-14 rounded-2xl bg-[#DCE8D8] items-center justify-center mb-5`}
          >
            <Text style={tw`text-[#174C3C] text-2xl font-bold`}>ز</Text>
          </View>

          <Text style={tw`text-3xl font-bold text-[#174C3C]`}>
            Create your account
          </Text>

          <View style={tw`w-12 h-1 rounded-full bg-[#C59A55] mt-4 mb-4`} />

          <Text style={tw`text-sm text-[#777D72] leading-6`}>
            A simpler way to calculate, organize, and manage your zakat.
          </Text>
        </View>

        <View style={tw`bg-white rounded-[28px] p-5 border border-[#EAE8DF]`}>
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
                <Text style={tw`text-sm font-semibold text-[#24382D] mb-2`}>
                  {field.label}
                </Text>

                <View
                  style={tw`flex-row items-center bg-[#F8F8F3] border border-[#E8E9DF] rounded-2xl px-4`}
                >
                  <TextInput
                    value={field.value}
                    onChangeText={field.change}
                    placeholder={field.placeholder}
                    placeholderTextColor="#9A9D93"
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
                    style={tw`flex-1 py-4 text-[#24382D]`}
                  />

                  {(isPassword || isConfirm) && (
                    <Pressable
                      onPress={() =>
                        isPassword
                          ? setShowPassword(!showPassword)
                          : setShowConfirmPassword(!showConfirmPassword)
                      }
                      hitSlop={10}
                    >
                      <Text style={tw`text-[#174C3C] text-xs font-bold`}>
                        {secure ? "SHOW" : "HIDE"}
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })}

          <View style={tw`bg-[#F1F4EC] rounded-xl px-4 py-3 mb-5`}>
            <Text style={tw`text-xs text-[#536B54] leading-5`}>
              Password must contain at least 8 characters.
            </Text>
          </View>

          <Pressable
            onPress={handleRegister}
            style={({ pressed }) => [
              tw`bg-[#174C3C] rounded-2xl py-4 items-center`,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={tw`text-white font-bold text-base`}>
              Create account →
            </Text>
          </Pressable>

          <View style={tw`flex-row justify-center flex-wrap mt-6`}>
            <Text style={tw`text-[#777D72] text-sm`}>
              Already have an account?{" "}
            </Text>

            <Link href="/login" style={tw`text-[#174C3C] font-bold text-sm`}>
              Sign in
            </Link>
          </View>
        </View>

        <Text style={tw`text-center text-xs text-[#92968C] mt-6 leading-5`}>
          Start your journey to mindful giving.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
