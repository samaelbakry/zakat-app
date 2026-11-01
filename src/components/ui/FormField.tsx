import { Text, TextInput, View } from "react-native";
import tw from "twrnc";

type FormFieldProps = {
  label: string;
  hint: string;
  placeholder: string;
  unit: string;
  value: string;
  onChangeText: (value: string) => void;
  currency: string;
  isArabic?: boolean;
};

export default function FormField({
  label,
  hint,
  placeholder,
  unit,
  value,
  onChangeText,
  currency,
  isArabic = false,
}: FormFieldProps) {
  const displayedUnit = unit === "EGP" ? currency : unit;

  return (
    <View style={tw`mb-5`}>
      <Text
        style={[
          tw`text-sm font-bold text-[#174C3C]`,
          {
            textAlign: isArabic ? "right" : "left",
            writingDirection: isArabic ? "rtl" : "ltr",
          },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          tw`text-xs text-[#85897F] mt-1 mb-3`,
          {
            textAlign: isArabic ? "right" : "left",
            writingDirection: isArabic ? "rtl" : "ltr",
          },
        ]}
      >
        {hint}
      </Text>

      <View
        style={[
          tw`flex-row items-center bg-white border border-[#E9E6DC] rounded-xl px-4`,
          isArabic && tw`flex-row-reverse`,
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A5A69D"
          keyboardType="decimal-pad"
          style={[
            tw`flex-1 py-4 text-sm text-[#24382D]`,
            {
              textAlign: isArabic ? "right" : "left",
              writingDirection: "ltr",
            },
          ]}
        />

        <Text style={tw`text-xs font-bold text-[#A77A35] mx-2`}>
          {displayedUnit}
        </Text>
      </View>
    </View>
  );
}