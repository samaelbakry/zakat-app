import { useTheme } from "@/context/ThemeContext";
import { View, Text } from "react-native";
import tw from "twrnc";

type GuideSectionProps = {
  title: string;
  items?: string[];
  description?: string;
  isArabic?: boolean;
};

export default function GuideSection({
  title,
  items,
  description,
  isArabic = false,
}: GuideSectionProps) {
  const { colors, isDarkMode } = useTheme();

  const textDirection = {
    writingDirection: isArabic ? ("rtl" as const) : ("ltr" as const),
    textAlign: isArabic ? ("right" as const) : ("left" as const),
    letterSpacing: isArabic ? 0 : undefined,
  };

  const rowDirection = isArabic ? "flex-row-reverse" : "flex-row";

  return (
    <View style={tw`mb-7`}>
      <Text
        style={[
          tw`font-display text-xl mb-3`,
          textDirection,
          { color: colors.primary },
        ]}
      >
        {title}
      </Text>

      {description && (
        <Text
          style={[
            tw`text-sm leading-6 mb-3`,
            textDirection,
            { color: colors.secondaryText },
          ]}
        >
          {description}
        </Text>
      )}

      {items?.map((item, index) => (
        <View
          key={`${title}-${index}`}
          style={tw.style("mb-3", rowDirection)}
        >
          <Text
            style={[
              { color: isDarkMode ? "#D9BD83" : "#A77A35" },
              isArabic ? { marginLeft: 12 } : { marginRight: 12 },
            ]}
          >
            •
          </Text>

          <Text
            style={[
              tw`flex-1 text-sm leading-6`,
              textDirection,
              { color: colors.text },
            ]}
          >
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}