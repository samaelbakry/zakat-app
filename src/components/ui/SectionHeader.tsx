import { View, Text } from 'react-native'
import tw from "twrnc";

type SectionHeaderProps = {
  number: string;
  label: string;
  isArabic: boolean;
  color: string;
};

export default function SectionHeader({ number, label, isArabic, color }: SectionHeaderProps) {
  return (
    <View style={tw.style("flex-row items-center mb-4", isArabic && "flex-row-reverse")}>
      <Text style={[tw`text-xs font-bold text-[#C59A55]`, isArabic ? tw`ml-3` : tw`mr-3`]}>
        {number}
      </Text>
      <Text
        style={[
          tw`text-base font-bold`,
          { color },
          { textAlign: isArabic ? "right" : "left" },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}