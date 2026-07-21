import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/theme";
import { OFFERS } from "../data/offers";
import OffersModal from "./OffersModal";

export default function OffersBanner() {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const directionRef = useRef(1);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    slideAnim.setValue(directionRef.current * 24);
    fadeAnim.setValue(0);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeIndex, slideAnim, fadeAnim]);

  const activeOffer = OFFERS[activeIndex];
  if (!activeOffer) return null;

  const isFirst = activeIndex === 0;
  const isLast = activeIndex === OFFERS.length - 1;

  const goPrev = () => {
    if (isFirst) return;
    directionRef.current = -1;
    setActiveIndex((i) => i - 1);
  };

  const goNext = () => {
    if (isLast) return;
    directionRef.current = 1;
    setActiveIndex((i) => i + 1);
  };

  return (
    <>
      <View className="w-full flex-row items-center gap-sm rounded-md border border-chip-border bg-white px-sm py-md">
        {!isFirst ? (
          <TouchableOpacity
            onPress={goPrev}
            className="h-8 w-8 items-center justify-center rounded-full bg-border-light"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Previous offer"
          >
            <Ionicons name="chevron-back" size={16} color={COLORS.textDark} />
          </TouchableOpacity>
        ) : (
          <View className="h-8 w-8" />
        )}

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          activeOpacity={0.85}
          className="flex-1 flex-row items-center justify-between gap-sm overflow-hidden"
        >
          <Animated.View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            }}
          >
            <View className="h-10 w-10 items-center justify-center rounded-full bg-brand-black">
              <MaterialCommunityIcons name="sale" size={20} color={COLORS.white} />
            </View>
            <View className="flex-1">
              <Text numberOfLines={1} className="text-body md:text-body-lg font-extrabold text-text-dark">
                {activeOffer.title}
              </Text>
              <View className="flex-row items-center gap-0.5">
                <Text className="text-small md:text-small-lg font-semibold text-primary">Click here</Text>
                <Ionicons name="chevron-forward" size={13} color={COLORS.primary} />
              </View>
            </View>
          </Animated.View>

          {OFFERS.length > 1 && (
            <Text className="text-small md:text-small-lg text-text-gray" numberOfLines={1}>
              {activeIndex + 1}/{OFFERS.length}
            </Text>
          )}
        </TouchableOpacity>

        {!isLast ? (
          <TouchableOpacity
            onPress={goNext}
            className="h-8 w-8 items-center justify-center rounded-full bg-border-light"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Next offer"
          >
            <Ionicons name="chevron-forward" size={16} color={COLORS.textDark} />
          </TouchableOpacity>
        ) : (
          <View className="h-8 w-8" />
        )}
      </View>

      <OffersModal visible={modalVisible} offer={activeOffer} onClose={() => setModalVisible(false)} />
    </>
  );
}
