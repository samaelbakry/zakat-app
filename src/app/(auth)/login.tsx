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
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      Alert.alert("Sign in failed", message);
    }
  }

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
          accessibilityRole="button"
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
            Welcome back
          </Text>

          <Text
            style={tw`font-display text-[38px] leading-[45px] text-[#174C3C]`}
          >
            Good to see
          </Text>

          <Text
            style={tw`font-display text-[38px] leading-[45px] italic text-[#174C3C]`}
          >
            you again.
          </Text>

          <Text style={tw`text-sm leading-6 text-[#777D72] mt-4`}>
            Sign in to manage your assets and continue your zakat journey.
          </Text>
        </View>

        <View>
          <Text style={tw`text-xs font-bold text-[#24382D] mb-2`}>
            Email address
          </Text>

          <View
            style={tw`flex-row items-center bg-white border border-[#E7E5DB] rounded-2xl px-4 mb-5`}
          >
            <Text style={tw`text-[#9A7B45] text-base mr-3`}>@</Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#A0A196"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              style={tw`flex-1 py-4 text-sm text-[#24382D]`}
            />
          </View>

          <View style={tw`flex-row items-center justify-between mb-2`}>
            <Text style={tw`text-xs font-bold text-[#24382D]`}>Password</Text>
          </View>

          <View
            style={tw`flex-row items-center bg-white border border-[#E7E5DB] rounded-2xl px-4`}
          >
            <Text style={tw`text-[#9A7B45] text-base mr-3`}>⌑</Text>

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#A0A196"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="current-password"
              style={tw`flex-1 py-4 text-sm text-[#24382D]`}
            />

            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={
                showPassword ? "Hide password" : "Show password"
              }
            >
              <Text
                style={tw`text-[10px] font-bold tracking-wider text-[#648064]`}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={handleLogin}
            accessibilityRole="button"
            style={({ pressed }) => [
              tw`flex-row items-center justify-center bg-[#174C3C] rounded-2xl py-[17px] px-5 my-2`,
              pressed && { opacity: 0.85, transform: [{ scale: 0.985 }] },
            ]}
          >
            <Text style={tw`text-sm font-bold text-white tracking-wide`}>
              Sign in
            </Text>
            <Text style={tw`text-lg text-[#E4D0A5] ml-3`}>→</Text>
          </Pressable>

          <View style={tw`flex-row justify-center flex-wrap mt-7`}>
            <Text style={tw`text-sm text-[#777D72]`}>New to Zakat? </Text>

            <Link
              href="/(auth)/register"
              style={tw`text-sm font-bold text-[#174C3C]`}
            >
              Create an account
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
