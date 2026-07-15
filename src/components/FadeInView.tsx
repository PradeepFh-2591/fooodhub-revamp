import { ReactNode, useEffect, useRef } from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";

type FadeInViewProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

// A small, understated entrance for page content — fades in and settles up
// a few pixels, rather than a full transition system. Plays once per mount.
export default function FadeInView({ children, style }: FadeInViewProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 350, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY]);

  // width: "100%" + alignItems: "center" matches this app's centering
  // convention (an "items-center" parent wrapping a "w-full max-w-content"
  // child) — without it, a wrapped child's percentage width has no definite
  // parent size to resolve against and collapses/left-aligns instead.
  return (
    <Animated.View style={[{ width: "100%", alignItems: "center", opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}
