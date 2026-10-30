import { formatCurrency } from '@/lib/helpers';
import { Text, View } from 'react-native';
import tw from "twrnc";

export default function PriceCard({title,price,currency,
}: {
  title: string;
  price: number;
  currency: string;
}) {
  return (
    <View style={tw`flex-1 bg-white rounded-2xl p-4 border border-[#E9E6DC]`}>
      <Text style={tw`text-xs text-[#85897F] mb-2`}>{title}</Text>
      <Text style={tw`text-lg font-bold text-[#174C3C]`}>
        {formatCurrency(price, currency)}
      </Text>
      <Text style={tw`text-[10px] text-[#85897F] mt-1`}>
        Per gram
      </Text>
    </View>
  );
}