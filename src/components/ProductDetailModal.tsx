import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useEffect, useMemo, useState } from "react";
import { Animated, Modal, Pressable, ScrollView, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { COLORS, MAX_CONTENT_WIDTH, RADIUS } from "../constants/theme";
import { CartItem } from "../data/cart";
import { DRINK_OPTIONS, Product, SIZES, TOPPINGS } from "../data/menuData";

type ProductDetailModalProps = {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
};

// These categories are single, ready-to-eat/drink items — size, burger
// toppings, and an "add a drink" upsell don't make sense on top of them.
const CATEGORIES_WITHOUT_OPTIONS = ["Sides", "Drinks", "Desserts"];

export default function ProductDetailModal({ visible, product, onClose, onAddToCart }: ProductDetailModalProps) {
  const [sizeId, setSizeId] = useState("regular");
  const [toppingIds, setToppingIds] = useState<string[]>([]);
  const [drinkId, setDrinkId] = useState("coke");
  const [quantity, setQuantity] = useState(1);

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  // Below this there isn't room for the quantity stepper, "ADD TO CART", and
  // the price all in one row without the label getting clipped/ellipsized.
  const isNarrow = windowWidth < 400;
  const [translateY] = useState(() => new Animated.Value(windowHeight));

  useEffect(() => {
    if (visible) {
      translateY.setValue(windowHeight);
      Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }).start();
    }
  }, [visible, windowHeight, translateY]);

  const total = useMemo(() => {
    if (!product) return 0;
    if (CATEGORIES_WITHOUT_OPTIONS.includes(product.category)) return product.price * quantity;
    const sizeExtra = SIZES.find((s) => s.id === sizeId)?.price ?? 0;
    const toppingsExtra = toppingIds.reduce((sum, id) => {
      const t = TOPPINGS.find((x) => x.id === id);
      return sum + (t ? t.price : 0);
    }, 0);
    const drinkExtra = DRINK_OPTIONS.find((d) => d.id === drinkId)?.price ?? 0;
    return (product.price + sizeExtra + toppingsExtra + drinkExtra) * quantity;
  }, [sizeId, toppingIds, drinkId, quantity, product]);

  if (!product) return null;

  const hasOptions = !CATEGORIES_WITHOUT_OPTIONS.includes(product.category);

  const toggleTopping = (id: string) => {
    setToppingIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  return (
    <Modal visible={visible} animationType="none" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/55" onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
        <Animated.View
          style={{
            transform: [{ translateY }],
            width: "92%",
            maxWidth: Math.min(700, MAX_CONTENT_WIDTH),
            maxHeight: windowHeight * 0.88,
            alignSelf: "center",
            overflow: "hidden",
            borderRadius: RADIUS.lg,
            backgroundColor: COLORS.white,
          }}
        >
          <View className="h-[200px] w-full">
            <Image source={{ uri: product.image }} className="h-full w-full" contentFit="cover" draggable={false} />
            <TouchableOpacity
              className="absolute left-md top-md h-8 w-8 items-center justify-center rounded-pill bg-black/55"
              onPress={onClose}
            >
              <Ionicons name="close" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <View className="px-lg pt-lg">
            <View className="mb-xs flex-row items-start justify-between">
              <Text className="flex-shrink pr-sm text-h2 md:text-h2-lg font-extrabold text-text-dark pop-prod-name">
                {product.name}
              </Text>
              <Text className="text-h2 md:text-h2-lg font-extrabold text-primary pop-prod-price">£{product.price.toFixed(2)}</Text>
            </View>
            <Text className="text-small md:text-small-lg leading-[18px] text-text-gray pb-3">{product.description}</Text>
          </View>

          {hasOptions && (
            <ScrollView
              className="px-lg"
              contentContainerClassName="pb-xl"
              showsVerticalScrollIndicator={false}
            >
              <Text className="mb-sm mt-lg text-tiny md:text-tiny-lg font-bold tracking-wide text-text-gray">
                CHOOSE SIZE
              </Text>
              {SIZES.map((size) => (
                <OptionRow
                  key={size.id}
                  label={size.label}
                  priceLabel={
                    size.price > 0
                      ? `+£${size.price.toFixed(2)}`
                      : `£${product.price.toFixed(2)}`
                  }
                  selected={sizeId === size.id}
                  onPress={() => setSizeId(size.id)}
                  type="radio"
                />
              ))}

              <Text className="mb-sm mt-lg text-tiny md:text-tiny-lg font-bold tracking-wide text-text-gray">
                ADD TOPPINGS
              </Text>
              {TOPPINGS.map((t) => (
                <OptionRow
                  key={t.id}
                  label={t.label}
                  priceLabel={`£${t.price.toFixed(2)}`}
                  selected={toppingIds.includes(t.id)}
                  onPress={() => toggleTopping(t.id)}
                  type="checkbox"
                />
              ))}

              <Text className="mb-sm mt-lg text-tiny md:text-tiny-lg font-bold tracking-wide text-text-gray">
                ADD A DRINK
              </Text>
              {DRINK_OPTIONS.map((d) => (
                <OptionRow
                  key={d.id}
                  label={d.label}
                  priceLabel={d.price > 0 ? `£${d.price.toFixed(2)}` : ""}
                  selected={drinkId === d.id}
                  onPress={() => setDrinkId(d.id)}
                  type="radio"
                />
              ))}
            </ScrollView>
          )}

          <View className="flex-row items-center gap-md border-t border-border-light px-lg py-md">
            <View className="flex-row items-center gap-sm">
              <TouchableOpacity
                className="h-8 w-8 items-center justify-center rounded-sm border border-chip-border"
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Ionicons name="remove" size={16} color={COLORS.textDark} />
              </TouchableOpacity>
              <Text className="w-6 text-center text-h3 md:text-h3-lg font-bold text-text-dark">{quantity}</Text>
              <TouchableOpacity
                className="h-8 w-8 items-center justify-center rounded-sm border border-chip-border"
                onPress={() => setQuantity((q) => q + 1)}
              >
                <Ionicons name="add" size={16} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="flex-1 flex-row items-center justify-between rounded-pill bg-primary py-3.5 pl-lg pr-md"
              onPress={() => {
                onAddToCart({
                  product,
                  sizeId: hasOptions ? sizeId : "regular",
                  toppingIds: hasOptions ? toppingIds : [],
                  drinkId: hasOptions ? drinkId : "none",
                  quantity,
                  total,
                });
                onClose();
              }}
            >
              <View className="min-w-0 flex-1 flex-row items-center gap-sm">
                <Ionicons name="cart-outline" size={18} color={COLORS.white} />
                <Text
                  numberOfLines={1}
                  className="flex-shrink text-body md:text-body-lg font-extrabold text-white"
                >
                  {isNarrow ? "ADD" : "ADD TO CART"}
                </Text>
              </View>
              <View className="flex-row items-center gap-sm">
                <View className="h-5 w-px bg-white/40" />
                <Text className="text-body md:text-body-lg font-extrabold text-white">£{total.toFixed(2)}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

type OptionRowProps = {
  label: string;
  priceLabel: string;
  selected: boolean;
  onPress: () => void;
  type: "radio" | "checkbox";
};

function OptionRow({ label, priceLabel, selected, onPress, type }: OptionRowProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center justify-between border-b border-border-light py-sm"
      onPress={onPress}
    >
      <View className="flex-row items-center gap-sm">
        <View
          className={`items-center justify-center border-[1.5px] ${
            type === "radio" ? "h-[18px] w-[18px] rounded-full" : "h-[18px] w-[18px] rounded"
          } ${selected ? "border-primary bg-primary" : "border-chip-border"}`}
        >
          {selected && type === "radio" && <View className="h-2 w-2 rounded-full bg-white" />}
          {selected && type === "checkbox" && (
            <Ionicons name="checkmark" size={12} color={COLORS.white} />
          )}
        </View>
        <Text className="text-body md:text-body-lg text-text-dark">{label}</Text>
      </View>
      {!!priceLabel && <Text className="text-body md:text-body-lg text-text-gray">{priceLabel}</Text>}
    </TouchableOpacity>
  );
}
