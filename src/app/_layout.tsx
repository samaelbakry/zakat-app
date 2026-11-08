import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import Sidebar from "@/components/ui/Sidebar";
import SidebarTrigger from "@/components/ui/SidebarTrigger";
import SplashScreen from "@/components/ui/SplashScreen";

import { Stack } from "expo-router";
import { View } from "react-native";
import tw from "twrnc";

import "../localization/i18n";
import { useEffect, useState } from "react";

function RootNavigator() {
  const { session, loading } = useAuth();
  const [splash, setSplash] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      setSplash(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [loading]);

  if (loading || splash) {
    return <SplashScreen />;
  }

  const isAuthenticated = session !== null;

  return (
    <View style={tw`flex-1 background-${colors.background}`}>
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

      {isAuthenticated && (
        <>
          <SidebarTrigger onPress={() => setSidebarVisible((prev) => !prev)} />

          <Sidebar
            visible={sidebarVisible}
            onClose={() => setSidebarVisible(false)}
          />
        </>
      )}
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}
