import { ActivityIndicator, View } from "react-native";
import { COLORS } from "../constants/theme";

type PageLoaderProps = {
  visible: boolean;
};

export default function PageLoader({ visible }: PageLoaderProps) {
  if (!visible) return null;

  return (
    <View className="absolute inset-0 z-50 items-center justify-center bg-white/70">
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}
