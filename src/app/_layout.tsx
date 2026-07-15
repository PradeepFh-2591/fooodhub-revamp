import { Stack, usePathname } from "expo-router";
import { useEffect, useRef, useState } from "react";
import "../../global.css";
import "../styles/custom.css";
import "../lib/nativewindInterop";
import PageLoader from "../components/PageLoader";
import { CartProvider } from "../context/CartContext";

// Brief flash of a spinner on route change — this app's routes are fully
// bundled client-side (no data fetching), so there's nothing to actually
// wait on; this is just visual feedback that the tap registered.
const PAGE_TRANSITION_MS = 350;

export default function RootLayout() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), PAGE_TRANSITION_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <CartProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="checkout" options={{ headerShown: false }} />
        <Stack.Screen name="info" options={{ headerShown: false }} />
      </Stack>
      <PageLoader visible={isNavigating} />
    </CartProvider>
  );
}
