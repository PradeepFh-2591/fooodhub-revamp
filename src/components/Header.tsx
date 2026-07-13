import { Ionicons } from "@expo/vector-icons";
import { ImageBackground } from "expo-image";
import { TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/theme";
import { HERO_IMAGE } from "../data/menuData";

type HeaderProps = {
  onSearchPress: () => void;
};

export default function Header({ onSearchPress }: HeaderProps) {
  return (
    <ImageBackground source={{ uri: HERO_IMAGE }} className="h-[320px] w-full justify-end" draggable={false}>
      <View className="absolute inset-0 bg-black/15" />

      <View className="absolute left-lg top-xl">
        <TouchableOpacity
          className="h-10 w-10 items-center justify-center rounded-sm bg-white"
          onPress={onSearchPress}
        >
          <Ionicons name="search" size={20} color={COLORS.black} />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
