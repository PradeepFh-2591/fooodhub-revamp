import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { COLORS } from "../constants/theme";

type ScrollToTopButtonProps = {
  visible: boolean;
  onPress: () => void;
  // Sits above the cart bar instead of beside it, so the two never crowd
  // each other on narrow screens.
  raised?: boolean;
};

export default function ScrollToTopButton({ visible, onPress, raised = false }: ScrollToTopButtonProps) {
  if (!visible) return null;

  return (
    <TouchableOpacity
      className={`absolute right-6 h-11 w-11 items-center justify-center rounded-full bg-primary ${
        raised ? "bottom-24" : "bottom-6"
      }`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 8,
      }}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Ionicons name="arrow-up" size={22} color={COLORS.white} />
    </TouchableOpacity>
  );
}
