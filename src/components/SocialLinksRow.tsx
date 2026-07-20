import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Linking, TouchableOpacity, View } from "react-native";
import { SOCIAL_LINKS } from "../data/socialLinks";

// Icon size stays fixed across breakpoints — only spacing/placement changes
// on smaller screens, never the icon size itself.
export default function SocialLinksRow() {
  return (
    <View className="flex-row items-center justify-center gap-sm">
      {SOCIAL_LINKS.map((social) => (
        <TouchableOpacity
          key={social.key}
          onPress={() => Linking.openURL(social.url)}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          className="items-center justify-center"
        >
          {social.iconSet === "fontawesome" ? (
            <FontAwesome name={social.icon as keyof typeof FontAwesome.glyphMap} size={16} color={social.color} />
          ) : (
            <Ionicons name={social.icon as keyof typeof Ionicons.glyphMap} size={18} color={social.color} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}
