import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/theme";
import { OFFERS } from "../data/offers";

type OffersModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function OffersModal({ visible, onClose }: OffersModalProps) {
  const [expandedId, setExpandedId] = useState<string | null>(OFFERS[0]?.id ?? null);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 items-center justify-center bg-black/55 px-lg" onPress={onClose}>
        <Pressable
          className="max-h-[80%] w-full max-w-[420px] overflow-hidden rounded-lg bg-white"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="flex-row items-center justify-between border-b border-border-light px-lg py-lg">
            <Text className="text-h2 md:text-h2-lg font-extrabold text-text-dark">Offers</Text>
            <TouchableOpacity
              onPress={onClose}
              className="h-9 w-9 items-center justify-center rounded-full bg-border-light"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={18} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerClassName="px-lg py-sm" showsVerticalScrollIndicator={false}>
            {OFFERS.map((offer, index) => {
              const isExpanded = expandedId === offer.id;
              return (
                <View key={offer.id} className={`py-md ${index > 0 ? "border-t border-border-light" : ""}`}>
                  <TouchableOpacity
                    onPress={() => setExpandedId(isExpanded ? null : offer.id)}
                    className="flex-row items-center gap-sm"
                  >
                    <View className="h-9 w-9 items-center justify-center rounded-full bg-brand-black">
                      <MaterialCommunityIcons name="sale" size={16} color={COLORS.white} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-body md:text-body-lg font-extrabold text-text-dark">{offer.title}</Text>
                      <Text className="text-small md:text-small-lg text-text-gray">{offer.subtitle}</Text>
                    </View>
                    <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={18} color={COLORS.textGray} />
                  </TouchableOpacity>

                  {isExpanded && (
                    <View className="mt-sm gap-1.5 pl-11">
                      {offer.details.map((detail) => (
                        <View key={detail} className="flex-row items-center gap-sm">
                          <Ionicons name="checkmark-circle-outline" size={16} color={COLORS.textDark} />
                          <Text className="text-small md:text-small-lg text-text-dark">{detail}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
