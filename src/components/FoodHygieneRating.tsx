import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { RESTAURANT } from "../constants/restaurant";
import { COLORS } from "../constants/theme";
import { FOOD_HYGIENE_RATING_LABELS } from "../data/foodHygiene";

const SCORES = [0, 1, 2, 3, 4, 5] as const;

export default function FoodHygieneRating() {
  const rating = RESTAURANT.foodHygieneRating;
  const label = FOOD_HYGIENE_RATING_LABELS[rating] ?? "";

  return (
    <View className="gap-md rounded-md p-lg" style={{ backgroundColor: "#DCE07E" }}>
      <View className="flex-row flex-wrap items-start justify-between gap-sm">
        <Text className="text-small md:text-small-lg font-extrabold text-text-dark">Food Hygiene Rating</Text>
        <View className="items-end">
          <Text className="text-tiny md:text-tiny-lg text-text-dark">Last Inspection:</Text>
          <Text className="text-small md:text-small-lg font-bold text-text-dark">
            {RESTAURANT.foodHygieneInspectionDate}
          </Text>
        </View>
      </View>

      <View className="flex-row items-start justify-center">
        {SCORES.map((score) => {
          const isActive = score === rating;
          return (
            <View key={score} className="flex-1 items-center">
              <Ionicons name="caret-down" size={14} color={COLORS.textDark} style={{ opacity: isActive ? 1 : 0 }} />
              <View
                className={`mt-1 h-10 w-10 items-center justify-center rounded-full border-2 md:h-12 md:w-12 ${
                  isActive ? "border-transparent bg-brand-black" : "border-text-dark/30 bg-white"
                }`}
              >
                <Text
                  className={`text-body md:text-h3-lg font-extrabold ${isActive ? "text-white" : "text-text-dark"}`}
                >
                  {score}
                </Text>
              </View>
              <View className="mt-1.5 h-6 items-center justify-center">
                {isActive && (
                  <View className="rounded-pill bg-brand-black px-2 py-0.5">
                    <Text numberOfLines={1} className="text-[9px] font-bold uppercase tracking-wide text-white">
                      {label}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
