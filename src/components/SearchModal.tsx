import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useMemo, useState } from "react";
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/theme";
import { MENU_ITEMS, Product } from "../data/menuData";

type SearchModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
};

export default function SearchModal({ visible, onClose, onSelectProduct }: SearchModalProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return MENU_ITEMS.filter((product) => product.name.toLowerCase().includes(q));
  }, [query]);

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={handleClose}>
      <View className="flex-1 bg-black/55 px-lg pt-[60px]">
        <View className="max-h-[80%] w-full max-w-[480px] self-center overflow-hidden rounded-lg bg-white">
          <View className="h-[52px] flex-row items-center gap-sm border-b border-border-light px-lg">
            <Ionicons name="search" size={18} color={COLORS.textGray} />
            <TextInput
              autoFocus
              placeholder="Search menu..."
              placeholderTextColor={COLORS.textGray}
              className="flex-1 text-body md:text-body-lg text-text-dark outline-none"
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
            />
            <TouchableOpacity onPress={handleClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={20} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>

          <ScrollView className="px-lg" keyboardShouldPersistTaps="handled">
            {query.trim().length === 0 && (
              <Text className="py-xl text-center text-small md:text-small-lg text-text-gray">
                Start typing to search the menu
              </Text>
            )}
            {query.trim().length > 0 && results.length === 0 && (
              <Text className="py-xl text-center text-small md:text-small-lg text-text-gray">{`No items match "${query.trim()}"`}</Text>
            )}
            {results.map((product) => (
              <TouchableOpacity
                key={product.id}
                className="flex-row items-center gap-md border-b border-border-light py-md"
                onPress={() => {
                  onSelectProduct(product);
                  handleClose();
                }}
              >
                <Image
                  source={{ uri: product.image }}
                  className="h-11 w-11 rounded-sm"
                  contentFit="cover"
                  draggable={false}
                />
                <View className="flex-1">
                  <Text className="text-body md:text-body-lg font-bold text-text-dark" numberOfLines={1}>
                    {product.name}
                  </Text>
                  <Text className="mt-0.5 text-tiny md:text-tiny-lg text-text-gray" numberOfLines={1}>
                    {product.category}
                  </Text>
                </View>
                <Text className="text-body md:text-body-lg font-bold text-text-dark">£{product.price.toFixed(2)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
