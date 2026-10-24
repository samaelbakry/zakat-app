import { signOut } from "@/services/auth";
import { ActivityIndicator, Alert, Pressable, Text } from "react-native";

import { useState } from "react";
import tw from "twrnc";

export default function LogoutButton() {
  const [signingOut, setSigningOut] = useState(false);
  async function handleSignOut() {
    if (signingOut) return;

    setSigningOut(true);

    try {
      await signOut();
    } catch (error) {
      Alert.alert(
        "Sign out failed",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <Pressable
      onPress={handleSignOut}
      disabled={signingOut}
      style={({ pressed }) => [
        tw`mt-7 py-4 items-center flex-row justify-center`,
        pressed && { opacity: 0.7 },
        signingOut && { opacity: 0.6 },
      ]}
    >
      {signingOut ? (
        <ActivityIndicator color="#648064" />
      ) : (
        <Text style={tw`text-[#777D72] font-semibold`}>Sign out</Text>
      )}
    </Pressable>
  );
}
