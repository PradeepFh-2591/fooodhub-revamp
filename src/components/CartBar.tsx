import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/theme";

type CartBarProps = {
  itemCount: number;
  onViewCart: () => void;
};

export default function CartBar({ itemCount, onViewCart }: CartBarProps) {
  if (itemCount === 0) return null;

  return (
    <View pointerEvents="box-none" className="absolute inset-x-0 bottom-6 items-center">
      <TouchableOpacity
        className="flex-row items-center gap-xs rounded-pill bg-primary px-md py-2"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.5,
          shadowRadius: 8,
          elevation: 8,
        }}
        onPress={onViewCart}
        activeOpacity={0.85}
      >
        <Ionicons name="cart-outline" size={24} color={COLORS.white} />
        <Text className="text-tiny font-bold tracking-wide text-white">VIEW CART</Text>
        <View className="min-w-[16px] items-center rounded-pill bg-white px-1">
          <Text className="text-[10px] font-bold text-primary">{itemCount}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
