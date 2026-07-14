import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CartBar from "../components/CartBar";
import CartModal from "../components/CartModal";
import CategoryTabs from "../components/CategoryTabs";
import Header from "../components/Header";
import LocationBar from "../components/LocationBar";
import ProductCard from "../components/ProductCard";
import ProductDetailModal from "../components/ProductDetailModal";
import SearchModal from "../components/SearchModal";
import SubFilterChips from "../components/SubFilterChips";
import { MAX_CONTENT_WIDTH } from "../constants/theme";
import { useCart } from "../context/CartContext";
import { CATEGORIES, MENU_ITEMS, Product, SUB_FILTERS_BY_CATEGORY } from "../data/menuData";

const GRID_GAP = 16;
const CONTENT_PADDING = 16;
// Approx height of the sticky category-tab bar, so scroll-to-section and the
// scroll-spy threshold both account for it instead of landing behind it.
const STICKY_HEADER_HEIGHT = 54;

function firstSubFilterLabel(category: string) {
  return SUB_FILTERS_BY_CATEGORY[category]?.[0]?.label ?? "";
}

export default function HomeScreen() {
  const { width } = useWindowDimensions();

  // Web static export prerenders in Node (no real `window`), so the very
  // first measurement can be 0. Re-measure on mount and keep listening for
  // resize/orientation changes, instead of relying on a single post-mount
  // read, so the grid doesn't need a rotation to "unstick" it.
  const [effectiveWidth, setEffectiveWidth] = useState(width);
  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") return;
    const measure = () => {
      if (window.innerWidth > 0) setEffectiveWidth(window.innerWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, []);
  useEffect(() => {
    if (Platform.OS !== "web") setEffectiveWidth(width);
  }, [width]);

  const router = useRouter();
  const { cartItems, cartCount, addToCart, removeFromCart } = useCart();
  const scrollRef = useRef<ScrollView>(null);
  // Absolute (scroll-content-relative) Y where the sections container starts.
  const sectionsTopRef = useRef(0);
  // Each section's Y offset relative to the sections container.
  const sectionOffsetsRef = useRef<Record<string, number>>({});

  const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0]);
  const [subFilterByCategory, setSubFilterByCategory] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    CATEGORIES.forEach((category) => {
      initial[category] = firstSubFilterLabel(category);
    });
    return initial;
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  const productsByCategory = useMemo(() => {
    const map: Record<string, Product[]> = {};
    CATEGORIES.forEach((category) => {
      const subFilters = SUB_FILTERS_BY_CATEGORY[category] ?? [];
      const activeSub = subFilterByCategory[category] ?? "";
      map[category] = MENU_ITEMS.filter((product) => {
        if (product.category !== category) return false;
        if (subFilters.length > 0 && activeSub && !activeSub.startsWith("All") && product.subCategory !== activeSub) {
          return false;
        }
        return true;
      });
    });
    return map;
  }, [subFilterByCategory]);

  // Floor at a phone-sized width so a 0/unmeasured width (e.g. during static
  // prerendering, before a real `window` exists) never bakes a negative
  // cardWidth into the exported HTML.
  const contentWidth = Math.max(Math.min(effectiveWidth, MAX_CONTENT_WIDTH), 320);

  // Responsive column count: phones = 2, tablets/wide screens = 3-4
  const numColumns = contentWidth >= 900 ? 4 : contentWidth >= 600 ? 3 : 2;
  const cardWidth =
    (contentWidth - CONTENT_PADDING * 2 - GRID_GAP * (numColumns - 1)) / numColumns;

  const handleQuickAdd = (product: Product) => {
    setSelectedProduct(product);
  };

  const scrollToCategory = (category: string) => {
    setActiveCategory(category);
    const offset = sectionOffsetsRef.current[category];
    if (offset == null) return;
    scrollRef.current?.scrollTo({
      y: Math.max(0, sectionsTopRef.current + offset - STICKY_HEADER_HEIGHT),
      animated: true,
    });
  };

  const handleSelectFromSearch = (product: Product) => {
    scrollToCategory(product.category);
    setSelectedProduct(product);
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;

    // Near the bottom of the scroll, the last section may never have enough
    // room below it to cross the threshold below (the scroll simply can't go
    // further) — treat "reached the end" as unambiguously that last section.
    const reachedEnd = contentOffset.y + layoutMeasurement.height >= contentSize.height - 2;

    let current = CATEGORIES[CATEGORIES.length - 1];
    if (!reachedEnd) {
      // Generous activation margin: an animated scrollTo settles a few
      // pixels short of its exact target, so a tight threshold here would
      // otherwise flip back to the previous section.
      const relativeY = contentOffset.y - sectionsTopRef.current + STICKY_HEADER_HEIGHT + 32;
      current = CATEGORIES[0];
      for (const category of CATEGORIES) {
        const offset = sectionOffsetsRef.current[category];
        if (offset != null && offset <= relativeY) {
          current = category;
        }
      }
    }
    setActiveCategory((prev) => (prev === current ? prev : current));
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          stickyHeaderIndices={[2]}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <Header onSearchPress={() => setSearchModalVisible(true)} />
          <LocationBar />

          <View className="bg-white">
            <CategoryTabs categories={CATEGORIES} active={activeCategory} onSelect={scrollToCategory} />
          </View>

          <View
            className="items-center"
            onLayout={(e: LayoutChangeEvent) => {
              sectionsTopRef.current = e.nativeEvent.layout.y;
            }}
          >
            <View className="w-full max-w-content px-lg pb-10">
              {CATEGORIES.map((category, index) => {
                const subFilters = SUB_FILTERS_BY_CATEGORY[category] ?? [];
                const products = productsByCategory[category] ?? [];
                return (
                  <View
                    key={category}
                    className={
                      index === 0
                        ? "pt-lg"
                        : "mt-[40px] border-t border-border-light pt-[40px]"
                    }
                    onLayout={(e: LayoutChangeEvent) => {
                      sectionOffsetsRef.current[category] = e.nativeEvent.layout.y;
                    }}
                  >
                    <Text className="mb-md text-h1 md:text-h1-lg font-extrabold text-text-dark cat-name">
                      {category.toUpperCase()}
                    </Text>
                    <SubFilterChips
                      options={subFilters}
                      active={subFilterByCategory[category] ?? ""}
                      onSelect={(label) =>
                        setSubFilterByCategory((prev) => ({ ...prev, [category]: label }))
                      }
                    />

                    <View className="mt-md flex-row flex-wrap gap-lg">
                      {products.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          cardWidth={cardWidth}
                          onPress={() => setSelectedProduct(product)}
                          onQuickAdd={() => handleQuickAdd(product)}
                        />
                      ))}
                      {products.length === 0 && (
                        <Text className="py-xl text-body md:text-body-lg text-text-gray">
                          No items in this category yet.
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>

        <CartBar itemCount={cartCount} onViewCart={() => setCartModalVisible(true)} />
      </View>

      <ProductDetailModal
        key={selectedProduct?.id ?? "none"}
        visible={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
      />

      <CartModal
        visible={cartModalVisible}
        items={cartItems}
        onClose={() => setCartModalVisible(false)}
        onRemove={removeFromCart}
        onCheckout={() => {
          setCartModalVisible(false);
          router.push("/checkout");
        }}
      />

      <SearchModal
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSelectProduct={handleSelectFromSearch}
      />
    </SafeAreaView>
  );
}
