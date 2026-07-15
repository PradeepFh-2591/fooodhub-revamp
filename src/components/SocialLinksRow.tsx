import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Linking, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { SOCIAL_LINKS } from "../data/socialLinks";

export default function SocialLinksRow() {
  const { width: windowWidth } = useWindowDimensions();
  const isCompact = windowWidth < 768;

  return (
    <View className="flex-row items-center justify-center gap-md">
      {SOCIAL_LINKS.map((social) => (
        <TouchableOpacity
          key={social.key}
          onPress={() => Linking.openURL(social.url)}
          className={`items-center justify-center rounded-full border border-chip-border bg-white ${
            isCompact ? "h-8 w-8" : "h-10 w-10"
          }`}
        >
          {social.iconSet === "fontawesome" ? (
            <FontAwesome
              name={social.icon as keyof typeof FontAwesome.glyphMap}
              size={isCompact ? 13 : 16}
              color={social.color}
            />
          ) : (
            <Ionicons
              name={social.icon as keyof typeof Ionicons.glyphMap}
              size={isCompact ? 15 : 18}
              color={social.color}
            />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}
