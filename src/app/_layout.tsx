import { Stack } from "expo-router";
import "../../global.css";
import "../styles/custom.css";
import "../lib/nativewindInterop";
import { CartProvider } from "../context/CartContext";

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="checkout" options={{ headerShown: false }} />
        <Stack.Screen name="info" options={{ headerShown: false }} />
      </Stack>
    </CartProvider>
  );
}
