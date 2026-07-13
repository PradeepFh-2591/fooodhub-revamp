import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SubCategoryFilter } from "../data/menuData";
import { useHorizontalWheelScroll } from "../lib/useHorizontalWheelScroll";

type SubFilterChipsProps = {
  options: SubCategoryFilter[];
  active: string;
  onSelect: (label: string) => void;
};

export default function SubFilterChips({ options, active, onSelect }: SubFilterChipsProps) {
  const { scrollRef, onScroll, onWheel, onMouseDown, onMouseMove, onMouseUp, onMouseLeave } =
    useHorizontalWheelScroll();

  if (options.length === 0) return null;

  const activeOption = options.find((opt) => opt.label === active);

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-sm pb-md flex-row"
        className="px-0"
        onScroll={onScroll}
        scrollEventThrottle={16}
        {...(onWheel ? { onWheel } : {})}
        {...(onMouseDown ? { onMouseDown, onMouseMove, onMouseUp, onMouseLeave } : {})}
      >
        {options.map((opt) => {
          const isActive = opt.label === active;
          return (
            <TouchableOpacity
              key={opt.label}
              onPress={() => onSelect(opt.label)}
              className={`rounded-pill border px-lg py-sm ${
                isActive ? "border-primary bg-primary" : "border-chip-border bg-white"
              }`}
            >
              <Text
                className={`text-small md:text-small-lg font-semibold ${
                  isActive ? "text-white" : "text-text-dark"
                }`}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {activeOption?.description && (
        <Text className="text-tiny md:text-tiny-lg text-text-gray pb-md sub-des pb-1">{activeOption.description}</Text>
      )}
    </View>
  );
}
