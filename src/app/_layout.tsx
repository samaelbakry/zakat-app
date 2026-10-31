import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import tw from "twrnc";
import "../localization/i18n";


function RootNavigator() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={tw`flex-1 items-center justify-center bg-[#F8FAFC]`}
      >
        <ActivityIndicator size="large" color="#065F46" />
      </View>
    );
  }

  const isAuthenticated = session !== null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(auth)/register" />
      </Stack.Protected>

      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="home" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
