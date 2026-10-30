import { View, Text } from "react-native";
import tw from "twrnc";
export default function GuideSection({
  title,
  items,
  description,
}: {
  title: string;
  items?: string[];
  description?: string;
}) {
  return (
    <View style={tw`mb-7`}>
      <Text style={tw`font-display text-xl text-[#174C3C] mb-3`}>{title}</Text>

      {description && (
        <Text style={tw`text-sm leading-6 text-[#777D72] mb-2`}>
          {description}
        </Text>
      )}

      {items?.map((item, index) => (
        <View key={`${title}-${index}`} style={tw`flex-row mb-3`}>
          <Text style={tw`text-[#A77A35] mr-3`}>•</Text>
          <Text style={tw`flex-1 text-sm leading-6 text-[#5F6B60]`}>
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}
