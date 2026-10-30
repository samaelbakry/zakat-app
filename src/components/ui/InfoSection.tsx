import { View, Text } from "react-native";
import tw from "twrnc";

export default function InfoSection({
  title,
  description,
  items,
}: {
  title: string;
  description?: string;
  items?: string[];
}) {
  return (
    <View style={tw`mb-6`}>
      <Text style={tw`font-display text-xl text-[#174C3C] mb-2`}>{title}</Text>

      {description && (
        <Text style={tw`text-sm leading-6 text-[#777D72]`}>{description}</Text>
      )}

      {items?.map((item, index) => (
        <View key={`${title}-${index}`} style={tw`flex-row mt-3`}>
          <Text style={tw`text-[#A77A35] mr-3`}>•</Text>
          <Text style={tw`flex-1 text-sm leading-6 text-[#4D5A50]`}>
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}
