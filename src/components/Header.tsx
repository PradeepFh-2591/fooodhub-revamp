import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Linking, Modal, Pressable, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { COLORS } from "../constants/theme";

type NavItem = {
  key: string;
  // Also used as the item's className (e.g. "ordernow") — a stable hook for
  // hiding/restyling individual nav items from custom.css without touching
  // this component.
  className: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  uppercase?: boolean;
};

export default function Header() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isCompact = width < 768;
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { key: "order-now", className: "ordernow", label: "Order Now", icon: "bag-outline", onPress: () => router.push("/") },
    {
      key: "about",
      className: "about",
      label: "About",
      icon: "information-circle",
      onPress: () => router.push("/info"),
      uppercase: true,
    },
    { key: "orders", className: "orders", label: "Orders", icon: "receipt-outline", onPress: () => Linking.openURL("#") },
    { key: "reviews", className: "reviews", label: "Reviews", icon: "star-outline", onPress: () => Linking.openURL("#") },
    { key: "more", className: "more", label: "More", icon: "grid-outline", onPress: () => Linking.openURL("#") },
  ];

  return (
    <View className="w-full items-center bg-header-bg">
      <View className="w-full max-w-content flex-row items-center justify-between px-lg py-md">
        <Image
          source={require("../../assets/images/foodhub_new.png")}
          style={{ height: isCompact ? 32 : 44, width: isCompact ? 104 : 142 }}
          contentFit="contain"
        />

        {isCompact ? (
          <TouchableOpacity onPress={() => setMenuOpen(true)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="menu" size={26} color={COLORS.headerIcon} />
          </TouchableOpacity>
        ) : (
          <View className="flex-row items-center gap-xl">
            {navItems.map((item) => (
              <TouchableOpacity
                key={item.key}
                onPress={item.onPress}
                className={`flex-row items-center gap-1.5 ${item.className}`}
              >
                <Ionicons name={item.icon} size={16} color={COLORS.headerIcon} />
                <Text
                  className={`text-small font-semibold text-header-icon ${item.uppercase ? "uppercase tracking-wide" : ""}`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Pressable className="flex-1 bg-black/40" onPress={() => setMenuOpen(false)}>
          <Pressable
            className="absolute right-lg top-16 gap-1 rounded-md bg-white p-sm"
            style={{ minWidth: 200 }}
            onPress={(e) => e.stopPropagation()}
          >
            {navItems.map((item) => (
              <TouchableOpacity
                key={item.key}
                onPress={() => {
                  setMenuOpen(false);
                  item.onPress();
                }}
                className={`flex-row items-center gap-sm rounded-sm px-md py-sm ${item.className}`}
              >
                <Ionicons name={item.icon} size={18} color={COLORS.textDark} />
                <Text className={`text-body font-semibold text-text-dark ${item.uppercase ? "uppercase tracking-wide" : ""}`}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
