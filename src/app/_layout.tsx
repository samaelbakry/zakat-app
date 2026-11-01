
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Stack } from "expo-router";
import { View } from "react-native";
import tw from "twrnc";
import "../localization/i18n";
import LanguageSwitcher from "@/components/home/LanguageSwitcher";
import SplashScreen from "@/components/ui/SplashScreen";

function RootNavigator() {
  const { session, loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  const isAuthenticated = session !== null;

  return (
    <View style={tw`flex-1`}>
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

      <LanguageSwitcher />
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
