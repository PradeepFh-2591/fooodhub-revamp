import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/theme";
import { Product } from "../data/menuData";

type ProductCardProps = {
  product: Product;
  cardWidth?: number;
  onPress: () => void;
  onQuickAdd: () => void;
};

// Web sizes itself with real CSS breakpoints (see `cols3`/`cols4` in
// tailwind.config.js) so the column count is correct at first paint —
// no JS width measurement, so no static-export/hydration timing race.
const WEB_CARD_WIDTH_CLASSES =
  "w-[calc(50%-8px)] cols3:w-[calc(33.3333%-10.6667px)] cols4:w-[calc(25%-12px)]";

// Badge color per tag — add a case here for any new tag string introduced
// in menuData.ts; anything unrecognized falls back to the brand color.
function getTagClassName(tag: string) {
  switch (tag) {
    case "BEST SELLER":
    case "SPICY":
      return "bg-primary";
    case "POPULAR":
      return "bg-warning";
    case "CHEF'S PICK":
      return "bg-success";
    default:
      return "bg-primary";
  }
}

export default function ProductCard({ product, cardWidth, onPress, onQuickAdd }: ProductCardProps) {
  return (
    <TouchableOpacity
      className={`overflow-hidden rounded-md border border-border-light bg-white ${
        Platform.OS === "web" ? WEB_CARD_WIDTH_CLASSES : ""
      }`}
      style={Platform.OS === "web" ? undefined : { width: cardWidth }}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View className="aspect-square w-full overflow-hidden bg-[#eee]">
        <Image
          source={{ uri: product.image }}
          className="h-full w-full transition-transform duration-300 hover:scale-110"
          contentFit="cover"
          draggable={false}
        />
        {product.tag && (
          <View className={`absolute left-sm top-sm rounded-pill px-sm py-1 ${getTagClassName(product.tag)}`}>
            <Text className="text-[9px] font-bold tracking-wide text-white">{product.tag}</Text>
          </View>
        )}
      </View>

      <View className="p-sm">
        <Text className="mb-0.5 text-body md:text-body-lg font-bold text-text-dark prod-name" numberOfLines={1}>
          {product.name}
        </Text>
        <Text className="mb-sm min-h-[30px] text-tiny md:text-tiny-lg leading-[15px] text-text-gray" numberOfLines={2}>
          {product.description}
        </Text>

        <View className="flex-row items-center justify-between">
          <Text className="text-h3 md:text-h3-lg font-extrabold text-text-dark prod-price">
            £{product.price.toFixed(2)}
          </Text>
          <TouchableOpacity
            className="h-[30px] w-[30px] items-center justify-center rounded-pill border border-primary bg-white"
            onPress={onQuickAdd}
          >
            <Ionicons name="add" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
