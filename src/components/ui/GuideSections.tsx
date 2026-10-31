
import { View, Text } from "react-native";
import tw from "twrnc";

export default function GuideSection({
  title,
  items,
  description,
  isArabic = false,
}: {
  title: string;
  items?: string[];
  description?: string;
  isArabic?: boolean;
}) {
  const textDirection = {
    writingDirection: isArabic ? "rtl" as const : "ltr" as const,
    textAlign: isArabic ? "right" as const : "left" as const,
    letterSpacing: isArabic ? 0 : undefined,
  };

  return (
    <View style={tw`mb-7`}>
      <Text
        style={[
          tw`font-display text-xl text-[#174C3C] mb-3`,
          {
            textAlign: "right",
            writingDirection: isArabic ? "rtl" : "ltr",
          },
        ]}
      >
        {title}
      </Text>

      {description && (
        <Text
          style={[
            tw`text-sm leading-6 text-[#777D72] mb-3`,
            textDirection,
          ]}
        >
          {description}
        </Text>
      )}

      {items?.map((item, index) => (
        <View
          key={`${title}-${index}`}
          style={[
            tw`flex-row mb-3`,
            isArabic ? tw`flex-row-reverse` : tw`flex-row`,
          ]}
        >
          <Text
            style={[
              tw`text-[#A77A35]`,
              isArabic
                ? { marginLeft: 12 }
                : { marginRight: 12 },
            ]}
          >
            •
          </Text>

          <Text
            style={[
              tw`flex-1 text-sm leading-6 text-[#5F6B60]`,
              textDirection,
            ]}
          >
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}
