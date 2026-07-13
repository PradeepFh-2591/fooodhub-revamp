import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/theme";
import { Product } from "../data/menuData";

type ProductCardProps = {
  product: Product;
  cardWidth: number;
  onPress: () => void;
  onQuickAdd: () => void;
};

export default function ProductCard({ product, cardWidth, onPress, onQuickAdd }: ProductCardProps) {
  return (
    <TouchableOpacity style={{ width: cardWidth }} activeOpacity={0.85} onPress={onPress}>
      <View className="mb-sm aspect-square w-full overflow-hidden rounded-md bg-[#eee]">
        <Image source={{ uri: product.image }} className="h-full w-full" contentFit="cover" draggable={false} />
        {product.tag && (
          <View
            className={`absolute left-sm top-sm rounded px-sm py-1 ${
              product.tag === "BEST SELLER" ? "bg-black/85" : "bg-[#E07A2C]"
            }`}
          >
            <Text className="text-[9px] font-bold tracking-wide text-white">{product.tag}</Text>
          </View>
        )}
      </View>

      <Text className="mb-0.5 text-body md:text-body-lg font-bold text-text-dark prod-name" numberOfLines={1}>
        {product.name}
      </Text>
      <Text className="mb-sm min-h-[30px] text-tiny md:text-tiny-lg leading-[15px] text-text-gray" numberOfLines={2}>
        {product.description}
      </Text>

      <View className="flex-row items-center justify-between">
        <Text className="text-h3 md:text-h3-lg font-extrabold text-text-dark prod-price" >£{product.price.toFixed(2)}</Text>
        <TouchableOpacity
          className="h-[30px] w-[30px] items-center justify-center rounded-pill bg-primary"
          onPress={onQuickAdd}
        >
          <Ionicons name="add" size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
