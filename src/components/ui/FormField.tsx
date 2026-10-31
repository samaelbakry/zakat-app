import { Text, TextInput, View } from "react-native";
import tw from "twrnc";

export default function FormField({
  label,
  hint,
  placeholder,
  unit,
  value,
  onChangeText,
  currency,
  
}: {
  label: string;
  hint: string;
  placeholder: string;
  unit: string;
  value: string;
  onChangeText: (value: string) => void;
  currency: string;
}) {
  const displayedUnit = unit === "EGP" ? currency : unit;

  return (
    <View style={tw`mb-5`}>
      <Text style={tw`text-sm font-bold text-[#174C3C]`}>{label}</Text>

      <Text style={tw`text-xs text-[#85897F] mt-1 mb-3`}>{hint}</Text>

      <View
        style={tw`flex-row items-center bg-white border border-[#E9E6DC] rounded-xl px-4`}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A5A69D"
          keyboardType="decimal-pad"
          style={tw`flex-1 py-4 text-sm text-[#24382D]`}
        />

        <Text style={tw`text-xs font-bold text-[#A77A35] ml-2`}>
          {displayedUnit}
        </Text>
      </View>
    </View>
  );
}
