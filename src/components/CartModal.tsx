import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Animated, Modal, Pressable, ScrollView, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { COLORS, MAX_CONTENT_WIDTH, RADIUS, SPACING } from "../constants/theme";
import { CartItem } from "../data/cart";

type CartModalProps = {
  visible: boolean;
  items: CartItem[];
  onClose: () => void;
  onRemove: (index: number) => void;
  onCheckout: () => void;
};

export default function CartModal({ visible, items, onClose, onRemove, onCheckout }: CartModalProps) {
  const totalPrice = items.reduce((sum, i) => sum + i.total, 0);

  const { height: windowHeight } = useWindowDimensions();
  const [translateY] = useState(() => new Animated.Value(windowHeight));

  useEffect(() => {
    if (visible) {
      translateY.setValue(windowHeight);
      Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }).start();
    }
  }, [visible, windowHeight, translateY]);

  return (
    <Modal visible={visible} animationType="none" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/55" onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
        <Animated.View
          style={{
            transform: [{ translateY }],
            width: "92%",
            maxWidth: Math.min(600, MAX_CONTENT_WIDTH),
            maxHeight: windowHeight * 0.8,
            alignSelf: "center",
            overflow: "hidden",
            borderRadius: RADIUS.lg,
            backgroundColor: COLORS.white,
            paddingBottom: SPACING.lg,
          }}
        >
          <View className="flex-row items-center justify-between border-b border-border-light px-lg py-lg">
            <Text className="text-h2 md:text-h2-lg font-extrabold text-text-dark">Your Cart</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={22} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>

          {items.length === 0 ? (
            <View className="items-center gap-sm py-14">
              <Ionicons name="cart-outline" size={40} color={COLORS.textLightGray} />
              <Text className="text-body md:text-body-lg text-text-gray">Your cart is empty</Text>
            </View>
          ) : (
            <>
              <ScrollView className="px-lg" showsVerticalScrollIndicator={false}>
                {items.map((item, idx) => (
                  <View
                    key={idx}
                    className="flex-row items-center gap-md border-b border-border-light py-md"
                  >
                    <Image
                      source={{ uri: item.product.image }}
                      className="h-14 w-14 rounded-sm"
                      contentFit="cover"
                      draggable={false}
                    />
                    <View className="flex-1">
                      <Text className="text-body md:text-body-lg font-bold text-text-dark" numberOfLines={1}>
                        {item.product.name}
                      </Text>
                      <Text className="mt-0.5 text-small md:text-small-lg text-text-gray" numberOfLines={1}>
                        {item.sizeId === "large" ? "Large" : "Regular"}
                        {item.toppingIds.length > 0
                          ? ", " + item.toppingIds.length + " extras"
                          : ""}
                        {" · Qty " + item.quantity}
                      </Text>
                      <Text className="mt-0.5 text-body md:text-body-lg font-bold text-text-dark">
                        £{item.total.toFixed(2)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      className="h-8 w-8 items-center justify-center rounded-pill"
                      onPress={() => onRemove(idx)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons name="trash-outline" size={18} color={COLORS.primary} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>

              <TouchableOpacity
                className="mx-lg mt-lg flex-row items-center justify-between rounded-pill bg-primary py-3.5 pl-xl pr-lg"
                onPress={onCheckout}
              >
                <View className="flex-row items-center gap-sm">
                  <Ionicons name="cart-outline" size={18} color={COLORS.white} />
                  <Text className="text-body md:text-body-lg font-extrabold tracking-wide text-white">CHECKOUT</Text>
                </View>
                <View className="flex-row items-center gap-md">
                  <View className="h-5 w-px bg-white/40" />
                  <Text className="text-body md:text-body-lg font-extrabold text-white">£{totalPrice.toFixed(2)}</Text>
                </View>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
