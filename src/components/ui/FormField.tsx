import { Text, TextInput, View } from "react-native";
import tw from "twrnc";
import { useTheme } from "@/context/ThemeContext";

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
  const { colors, isDarkMode } = useTheme();

  const displayedUnit = unit === "EGP" ? currency : unit;

  const textDirection = {
    textAlign: isArabic ? ("right" as const) : ("left" as const),
    writingDirection: isArabic ? ("rtl" as const) : ("ltr" as const),
  };

  return (
    <View style={tw`mb-5`}>
      <Text
        style={[
          tw`text-sm font-bold`,
          textDirection,
          { color: colors.primary },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          tw`text-xs mt-1 mb-3`,
          textDirection,
          { color: colors.secondaryText },
        ]}
      >
        {hint}
      </Text>

      <View
        style={[
          tw`flex-row items-center rounded-xl px-4 border`,
          isArabic && tw`flex-row-reverse`,
          {
            backgroundColor: colors.input,
            borderColor: colors.border,
          },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          keyboardType="decimal-pad"
          style={[
            tw`flex-1 py-4 text-sm`,
            {
              color: colors.text,
              textAlign: isArabic ? "right" : "left",
              writingDirection: "ltr",
            },
          ]}
        />

        <Text
          style={[
            tw`text-xs font-bold mx-2`,
            { color: isDarkMode ? "#D9BD83" : colors.accent },
          ]}
        >
          {displayedUnit}
        </Text>
      </View>
    </View>
  );
}