import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { LayoutChangeEvent, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/theme";
import { useHorizontalWheelScroll } from "../lib/useHorizontalWheelScroll";

type CategoryTabsProps = {
  categories: string[];
  active: string;
  onSelect: (category: string) => void;
  onSearchPress: () => void;
  // Only shown once this bar has scrolled up and pinned to the top of the
  // screen (see `stickyHeaderIndices` in HomeScreen) — hidden while it's
  // still in its normal, in-flow position.
  showSearchIcon: boolean;
};

export default function CategoryTabs({
  categories,
  active,
  onSelect,
  onSearchPress,
  showSearchIcon,
}: CategoryTabsProps) {
  const { scrollRef, onScroll, onWheel, onMouseDown, onMouseMove, onMouseUp, onMouseLeave } =
    useHorizontalWheelScroll();
  const tabOffsetsRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const x = tabOffsetsRef.current[active];
    if (x == null) return;
    scrollRef.current?.scrollTo({ x: Math.max(0, x - 24), animated: true });
  }, [active, scrollRef]);

  return (
    <View className="items-center border-b border-border-light bg-white">
      <View className="w-full max-w-content flex-row items-center">
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName={`items-center gap-[20px] pr-lg ${showSearchIcon ? "pl-[68px]" : "pl-lg"}`}
          className="z-[1] w-full"
          onScroll={onScroll}
          scrollEventThrottle={16}
          {...(onWheel ? { onWheel } : {})}
          {...(onMouseDown ? { onMouseDown, onMouseMove, onMouseUp, onMouseLeave } : {})}
        >
          {categories.map((cat) => {
            const isActive = cat === active;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => onSelect(cat)}
                className="items-center py-md"
                onLayout={(e: LayoutChangeEvent) => {
                  tabOffsetsRef.current[cat] = e.nativeEvent.layout.x;
                }}
              >
                <Text
                  className={`text-body md:text-body-lg font-semibold category-name ${
                    isActive ? "text-primary" : "text-text-gray"
                  }`}
                >
                  {cat}
                </Text>
                <View className={`mt-1.5 h-[3px] w-full rounded ${isActive ? "bg-primary" : "bg-transparent"}`} />
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Pinned above the scrolling tabs (higher z-index) with an opaque
            background, so tabs slide underneath and out of view behind it
            instead of overlapping it. Only shown once the bar itself is
            pinned to the top of the screen. */}
        {showSearchIcon && (
          <View className="absolute left-0 top-0 z-[2] h-full flex-row items-center bg-white pl-lg pr-sm">
            <TouchableOpacity
              className="h-10 w-10 items-center justify-center rounded-sm bg-white search-scroll"
              onPress={onSearchPress}
            >
              <Ionicons name="search" size={20} color={COLORS.black} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
