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
import { signIn } from "@/services/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert("Missing information", "Enter your email and password.");
      return;
    }
    try {
      await signIn(email, password);
    } catch (error) {
      const message =  error instanceof Error ? error.message : "Something went wrong. Please try again.";
      Alert.alert("Sign in failed", message);
    }

  }

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
        <Pressable onPress={() => router.back()} style={tw`self-start mb-9`}>
          <Text style={tw`text-[#174C3C] font-semibold text-base`}>← Back</Text>
        </Pressable>

        <View style={tw`mb-8`}>
          <View
            style={tw`w-14 h-14 rounded-2xl bg-[#DCE8D8] items-center justify-center mb-6`}
          >
            <Text style={tw`text-[#174C3C] text-2xl font-bold`}>ز</Text>
          </View>

          <Text style={tw`text-3xl font-bold text-[#174C3C]`}>
            Welcome back
          </Text>

          <View style={tw`w-12 h-1 rounded-full bg-[#C59A55] mt-4 mb-4`} />

          <Text style={tw`text-sm text-[#777D72] leading-6`}>
            Sign in to manage your assets and continue your zakat journey.
          </Text>
        </View>

        <View style={tw`bg-white rounded-[28px] p-5 border border-[#EAE8DF]`}>
          <Text style={tw`text-sm font-semibold text-[#24382D] mb-2`}>
            Email address
          </Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#9A9D93"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            style={tw`bg-[#F8F8F3] border border-[#E8E9DF] rounded-2xl px-4 py-4 mb-5 text-[#24382D]`}
          />

          <Text style={tw`text-sm font-semibold text-[#24382D] mb-2`}>
            Password
          </Text>

          <View
            style={tw`flex-row items-center bg-[#F8F8F3] border border-[#E8E9DF] rounded-2xl px-4`}
          >
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#9A9D93"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="current-password"
              style={tw`flex-1 py-4 text-[#24382D]`}
            />

            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={10}
            >
              <Text style={tw`text-[#174C3C] text-xs font-bold`}>
                {showPassword ? "HIDE" : "SHOW"}
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() =>
              Alert.alert(
                "Coming soon",
                "Password recovery will be added with authentication.",
              )
            }
            style={tw`self-end mt-4 mb-7`}
          >
            <Text style={tw`text-[#174C3C] font-semibold text-sm`}>
              Forgot password?
            </Text>
          </Pressable>

          <Pressable
            onPress={handleLogin}
            style={({ pressed }) => [
              tw`bg-[#174C3C] rounded-2xl py-4 items-center`,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={tw`text-white font-bold text-base`}>Sign in →</Text>
          </Pressable>

          <View style={tw`flex-row justify-center flex-wrap mt-6`}>
            <Text style={tw`text-[#777D72] text-sm`}>New to ZakatApp? </Text>

            <Link
              href="/(auth)/register"
              style={tw`text-[#174C3C] font-bold text-sm`}
            >
              Create an account
            </Link>
          </View>
        </View>

        <Text style={tw`text-center text-xs text-[#92968C] mt-7`}>
          Your journey to mindful giving starts here.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
