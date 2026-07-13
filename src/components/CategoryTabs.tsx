import { useEffect, useRef } from "react";
import { LayoutChangeEvent, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useHorizontalWheelScroll } from "../lib/useHorizontalWheelScroll";

type CategoryTabsProps = {
  categories: string[];
  active: string;
  onSelect: (category: string) => void;
};

export default function CategoryTabs({ categories, active, onSelect }: CategoryTabsProps) {
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
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="items-center gap-[20px] px-lg"
        className="w-full max-w-content"
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
    </View>
  );
}
