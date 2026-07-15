import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/theme";
import { OFFERS } from "../data/offers";
import OffersModal from "./OffersModal";

export default function OffersBanner() {
  const [modalVisible, setModalVisible] = useState(false);
  const featuredOffer = OFFERS[0];

  if (!featuredOffer) return null;

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
        className="w-full flex-row items-center justify-between gap-sm rounded-md border border-chip-border bg-white px-lg py-md"
      >
        <View className="flex-1 flex-row items-center gap-sm">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-brand-black">
            <MaterialCommunityIcons name="sale" size={20} color={COLORS.white} />
          </View>
          <View className="flex-1">
            <Text numberOfLines={1} className="text-body md:text-body-lg font-extrabold text-text-dark">
              {featuredOffer.title}
            </Text>
            <View className="flex-row items-center gap-0.5">
              <Text className="text-small md:text-small-lg font-semibold text-primary">Click here</Text>
              <Ionicons name="chevron-forward" size={13} color={COLORS.primary} />
            </View>
          </View>
        </View>
        <View className="flex-row items-center gap-1">
          <Text className="text-small md:text-small-lg text-text-gray" numberOfLines={1}>
            {OFFERS.length} {OFFERS.length === 1 ? "Offer" : "Offers"}
          </Text>
          <Ionicons name="chevron-down" size={16} color={COLORS.textGray} />
        </View>
      </TouchableOpacity>

      <OffersModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </>
  );
}
