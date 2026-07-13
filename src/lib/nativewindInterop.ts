import { Image, ImageBackground } from "expo-image";
import { cssInterop } from "nativewind";

// expo-image's components aren't core react-native primitives, so NativeWind
// doesn't intercept them automatically — opt them in so `className` works.
cssInterop(Image, {
  className: { target: "style" },
});

cssInterop(ImageBackground, {
  className: { target: "style" },
  imageClassName: { target: "imageStyle" },
});
