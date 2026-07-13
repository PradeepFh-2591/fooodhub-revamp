import { Image } from "expo-image";
import { TouchableOpacity, View } from "react-native";

// Swap these image links to change the posters shown in the sidebar.
const POSTER_IMAGES: string[] = [
  "https://assets.touch2success.com/static/939b4db168ac9f5fd4550c82454b9762/img/1781871931phpVglkP6.jpg",
  // "https://public.touch2success.com/static/fcf27fef715c4905574c0fc9a62d0edd/img/1757952370phpif6NsU.jpg",
];

export default function OfferBanner() {
  return (
    <View className="w-full gap-sm">
      {POSTER_IMAGES.map((uri, index) => (
        <TouchableOpacity key={`${index}-${uri}`} activeOpacity={0.9}>
          <Image source={{ uri }} className="w-full aspect-[16/9] max-h-[200px]" contentFit="contain" draggable={false} />
        </TouchableOpacity>
      ))}
    </View>
  );
}
