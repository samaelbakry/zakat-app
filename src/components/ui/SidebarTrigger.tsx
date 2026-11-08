import { Pressable } from "react-native";
import { Menu } from "lucide-react-native";
import tw from "twrnc";

import { useTheme } from "@/context/ThemeContext";
import i18n from "@/localization/i18n";

type SidebarTriggerProps = {
  onPress: () => void;
};

export default function SidebarTrigger({
  onPress,
}: SidebarTriggerProps) {
  const { colors } = useTheme();
  const isArabic = i18n.language.startsWith("ar")

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Open menu"
      style={[
        tw`absolute ${ isArabic ? "left-5 top-20" : "right-4 top-14 "} z-40 w-12 h-12 rounded-2xl items-center justify-center`,
        {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          elevation: 4,
        },
      ]}
    >
      <Menu size={24} color={colors.primary} />
    </Pressable>
  );
}