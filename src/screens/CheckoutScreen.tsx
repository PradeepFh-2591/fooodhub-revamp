import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CouponAppliedModal from "../components/CouponAppliedModal";
import OfferBanner from "../components/OfferBanner";
import OrderPlacedModal from "../components/OrderPlacedModal";
import ProductDetailModal from "../components/ProductDetailModal";
import PromptModal from "../components/PromptModal";
import ScheduleModal from "../components/ScheduleModal";
import { RESTAURANT } from "../constants/restaurant";
import { COLORS } from "../constants/theme";
import { useCart } from "../context/CartContext";
import { MENU_ITEMS, Product } from "../data/menuData";
import { useHorizontalWheelScroll } from "../lib/useHorizontalWheelScroll";

type Fulfillment = "delivery" | "pickup";
type Timing = "asap" | "schedule";
type PaymentMethod = "cash" | "card";

const DELIVERY_FEE = 2.99;
const VALID_COUPON = "WELCOME10";
const COUPON_DISCOUNT_RATE = 0.1;

export default function CheckoutScreen() {
  const router = useRouter();
  const { cartItems, cartTotal, addToCart, removeFromCart, clearCart } = useCart();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  // Below this the two columns stack instead of sitting side by side, so the
  // right column should just flow into the page's normal scroll instead of
  // being capped to its own independently-scrolling box.
  const isSideBySide = windowWidth >= 700;
  const {
    scrollRef: suggestionsScrollRef,
    onScroll: onSuggestionsScroll,
    onMouseDown: onSuggestionsMouseDown,
    onMouseMove: onSuggestionsMouseMove,
    onMouseUp: onSuggestionsMouseUp,
    onMouseLeave: onSuggestionsMouseLeave,
  } = useHorizontalWheelScroll();

  const [fulfillment, setFulfillment] = useState<Fulfillment>("delivery");
  const [timing, setTiming] = useState<Timing>("asap");
  const [payment, setPayment] = useState<PaymentMethod>("cash");
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState(false);
  const [orderPlacedVisible, setOrderPlacedVisible] = useState(false);

  const [scheduleDate, setScheduleDate] = useState(() => new Date());
  const [scheduledSlot, setScheduledSlot] = useState<string | null>(null);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponModalVisible, setCouponModalVisible] = useState(false);
  const [couponSuccessVisible, setCouponSuccessVisible] = useState(false);
  const [cookingInstructions, setCookingInstructions] = useState("");
  const [instructionsModalVisible, setInstructionsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const suggestions = useMemo(() => {
    const cartIds = new Set(cartItems.map((item) => item.product.id));
    return MENU_ITEMS.filter((product) => !cartIds.has(product.id)).slice(-8, -2);
  }, [cartItems]);

  const deliveryFee = fulfillment === "delivery" && cartItems.length > 0 ? DELIVERY_FEE : 0;
  const discount = couponCode ? cartTotal * COUPON_DISCOUNT_RATE : 0;
  const total = cartTotal - discount + deliveryFee;

  const handleApplyCoupon = (code: string) => {
    if (code.toUpperCase() === VALID_COUPON) {
      setCouponCode(code.toUpperCase());
      setCouponError(null);
      setCouponModalVisible(false);
      setCouponSuccessVisible(true);
    } else {
      setCouponError("Invalid code");
    }
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;
    if (fulfillment === "delivery" && address.trim().length === 0) {
      setAddressError(true);
      return;
    }
    setAddressError(false);
    clearCart();
    setOrderPlacedVisible(true);
  };

  const handleOrderPlacedClose = () => {
    setOrderPlacedVisible(false);
    router.replace("/");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="items-center">
          <View className="w-full max-w-content px-lg py-lg">
            <TouchableOpacity onPress={() => router.back()} className="mb-lg flex-row items-center gap-xs">
              <Ionicons name="arrow-back" size={20} color={COLORS.textDark} />
              <Text className="text-body md:text-body-lg font-bold text-text-dark">Back to Menu</Text>
            </TouchableOpacity>

            <View className="flex-row flex-wrap gap-xl">
              {/* Left column */}
              <View className={`w-full gap-lg ${isSideBySide ? "min-w-[340px] flex-[4]" : ""}`}>
                <View className="gap-sm rounded-md border border-chip-border bg-white px-lg py-md">
                  {fulfillment === "delivery" ? (
                    <>
                      <TouchableOpacity className="flex-row items-center gap-sm">
                        <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                          <Ionicons name="location-outline" size={18} color={COLORS.primary} />
                        </View>
                        <View className="flex-1">
                          <Text className="text-small md:text-small-lg font-extrabold text-primary">
                            ADD ADDRESS
                          </Text>
                          <Text className="text-tiny md:text-tiny-lg text-text-gray">
                            to help the driver locate you easily
                          </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={COLORS.primary} />
                      </TouchableOpacity>

                      <View
                        className={`flex-row items-center gap-sm rounded-sm border px-md py-sm ${
                          addressError ? "border-primary" : "border-chip-border"
                        }`}
                      >
                        <Ionicons
                          name="navigate-outline"
                          size={16}
                          color={addressError ? COLORS.primary : COLORS.textGray}
                        />
                        <TextInput
                          value={address}
                          onChangeText={(text) => {
                            setAddress(text);
                            if (addressError) setAddressError(false);
                          }}
                          placeholder="e.g. 123 High Street, London"
                          placeholderTextColor={COLORS.textGray}
                          className="flex-1 text-body md:text-body-lg text-text-dark outline-none"
                        />
                      </View>
                      {addressError && (
                        <Text className="text-small md:text-small-lg text-primary">
                          Please add a delivery address to place your order.
                        </Text>
                      )}
                    </>
                  ) : (
                    <View className="flex-row items-center gap-sm">
                      <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                        <Ionicons name="bag-outline" size={18} color={COLORS.primary} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-small md:text-small-lg font-extrabold text-primary">
                          PICKUP FROM
                        </Text>
                        <Text className="text-body md:text-body-lg font-bold text-text-dark">
                          {RESTAURANT.name}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>

                <View className="rounded-md border border-chip-border bg-white px-lg py-md">
                  <View className="mb-sm flex-row items-center gap-sm">
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                      <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
                    </View>
                    <Text className="text-body md:text-body-lg font-extrabold text-text-dark">Schedule Order</Text>
                  </View>
                  <View className="flex-row gap-sm">
                    <TouchableOpacity
                      onPress={() => setTiming("asap")}
                      className={`rounded-pill border px-md py-sm ${
                        timing === "asap" ? "border-primary bg-primary" : "border-chip-border bg-white"
                      }`}
                    >
                      <Text
                        className={`text-small md:text-small-lg font-semibold ${
                          timing === "asap" ? "text-white" : "text-text-dark"
                        }`}
                      >
                        ASAP
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setTiming("schedule");
                        setScheduleModalVisible(true);
                      }}
                      className={`rounded-pill border px-md py-sm ${
                        timing === "schedule" ? "border-primary bg-primary" : "border-chip-border bg-white"
                      }`}
                    >
                      <Text
                        className={`text-small md:text-small-lg font-semibold ${
                          timing === "schedule" ? "text-white" : "text-text-dark"
                        }`}
                      >
                        Schedule
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {timing === "schedule" && (
                    <TouchableOpacity
                      onPress={() => setScheduleModalVisible(true)}
                      className="mt-sm flex-row items-center justify-between rounded-sm border border-chip-border px-md py-sm"
                    >
                      <View className="flex-row items-center gap-sm">
                        <Ionicons name="calendar-outline" size={16} color={COLORS.textGray} />
                        <Text className="text-body md:text-body-lg text-text-dark" numberOfLines={1}>
                          {scheduledSlot
                            ? `${scheduleDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}, ${scheduledSlot}`
                            : "Select date & time"}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color={COLORS.textGray} />
                    </TouchableOpacity>
                  )}
                </View>

                <View className="rounded-md border border-chip-border bg-white px-lg py-md">
                  <View className="mb-sm flex-row items-center gap-sm">
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                      <Ionicons name="wallet-outline" size={18} color={COLORS.primary} />
                    </View>
                    <Text className="text-body md:text-body-lg font-extrabold text-text-dark">Payment Method</Text>
                  </View>
                  <View className="flex-row gap-sm">
                    <TouchableOpacity
                      onPress={() => setPayment("cash")}
                      className={`flex-row items-center gap-1.5 rounded-pill border px-md py-sm ${
                        payment === "cash" ? "border-primary bg-primary" : "border-chip-border bg-white"
                      }`}
                    >
                      <Ionicons
                        name="cash-outline"
                        size={16}
                        color={payment === "cash" ? COLORS.white : COLORS.textDark}
                      />
                      <Text
                        className={`text-small md:text-small-lg font-semibold ${
                          payment === "cash" ? "text-white" : "text-text-dark"
                        }`}
                      >
                        Cash
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setPayment("card")}
                      className={`flex-row items-center gap-1.5 rounded-pill border px-md py-sm ${
                        payment === "card" ? "border-primary bg-primary" : "border-chip-border bg-white"
                      }`}
                    >
                      <Ionicons
                        name="card-outline"
                        size={16}
                        color={payment === "card" ? COLORS.white : COLORS.textDark}
                      />
                      <Text
                        className={`text-small md:text-small-lg font-semibold ${
                          payment === "card" ? "text-white" : "text-text-dark"
                        }`}
                      >
                        Card
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="gap-md rounded-md border border-chip-border bg-white px-lg py-lg">
                  <View>
                    <Text className="text-tiny md:text-tiny-lg font-bold tracking-wide text-text-gray">
                      ORDER TOTAL
                    </Text>
                    <Text className="text-h1 md:text-h1-lg font-extrabold text-text-dark">£{total.toFixed(2)}</Text>
                  </View>

                  <TouchableOpacity
                    className="flex-row items-center justify-between rounded-pill bg-primary py-3.5 pl-xl pr-lg"
                    onPress={handlePlaceOrder}
                  >
                    <Text className="text-body md:text-body-lg font-extrabold tracking-wide text-white place-order">
                      PLACE ORDER
                    </Text>
                    <View className="flex-row items-center gap-md">
                      <View className="h-5 w-px bg-white/40" />
                      <Text className="text-body md:text-body-lg font-extrabold text-white">£{total.toFixed(2)}</Text>
                      <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
                    </View>
                  </TouchableOpacity>

                  <View className="flex-row items-center gap-xs">
                    <Ionicons name="shield-checkmark-outline" size={14} color={COLORS.success} />
                    <Text className="text-tiny md:text-tiny-lg text-text-gray">
                      Your payment details are safe and secure
                    </Text>
                  </View>
                </View>
              </View>

              {/* Right column */}
              <ScrollView
                className={`w-full ${isSideBySide ? "min-w-[260px] flex-[2]" : ""}`}
                contentContainerClassName="gap-lg"
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
                style={isSideBySide ? { maxHeight: windowHeight - 180 } : undefined}
              >
                

                <Text className="text-h2 md:text-h2-lg font-extrabold text-text-dark">Your Order</Text>
<OfferBanner />
                <View className="flex-row gap-sm">
                  <TouchableOpacity
                    onPress={() => setFulfillment("delivery")}
                    className="flex-1 flex-row items-center gap-sm rounded-md border px-md py-sm"
                    style={
                      fulfillment === "delivery"
                        ? { borderColor: COLORS.primary, borderWidth: 1.5, backgroundColor: `${COLORS.primary}0D` }
                        : { borderColor: COLORS.chipBorder }
                    }
                  >
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                      <Ionicons name="bicycle-outline" size={18} color={COLORS.primary} />
                    </View>
                    <View>
                      <Text
                        className={`text-small md:text-small-lg font-bold ${
                          fulfillment === "delivery" ? "text-primary" : "text-text-dark"
                        }`}
                      >
                        Delivery
                      </Text>
                      <Text className="text-tiny md:text-tiny-lg text-text-gray">Pre-order</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setFulfillment("pickup")}
                    className="flex-1 flex-row items-center gap-sm rounded-md border px-md py-sm"
                    style={
                      fulfillment === "pickup"
                        ? { borderColor: COLORS.primary, borderWidth: 1.5, backgroundColor: `${COLORS.primary}0D` }
                        : { borderColor: COLORS.chipBorder }
                    }
                  >
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                      <Ionicons name="bag-outline" size={18} color={COLORS.primary} />
                    </View>
                    <View>
                      <Text
                        className={`text-small md:text-small-lg font-bold ${
                          fulfillment === "pickup" ? "text-primary" : "text-text-dark"
                        }`}
                      >
                        Pickup
                      </Text>
                      <Text className="text-tiny md:text-tiny-lg text-text-gray">Pre-order</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => setCouponModalVisible(true)}
                  className="flex-row items-center gap-sm rounded-md border border-chip-border bg-white px-lg py-md"
                >
                  <Ionicons name={couponCode ? "pricetag" : "add-circle-outline"} size={20} color={COLORS.primary} />
                  <Text className="flex-1 text-body md:text-body-lg font-bold text-text-dark" numberOfLines={1}>
                    {couponCode ? `Coupon applied: ${couponCode} (−£${discount.toFixed(2)})` : "Add Coupon"}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
                </TouchableOpacity>

                {cartItems.length === 0 ? (
                  <View className="items-center gap-sm rounded-md border border-border-light py-14">
                    <Ionicons name="cart-outline" size={40} color={COLORS.textLightGray} />
                    <Text className="text-body md:text-body-lg text-text-gray">Your cart is empty</Text>
                  </View>
                ) : (
                  <View className="overflow-hidden rounded-md border border-border-light">
                    <ScrollView
                      className="max-h-[320px]"
                      contentContainerClassName="px-lg"
                      nestedScrollEnabled
                      showsVerticalScrollIndicator={false}
                    >
                      {cartItems.map((item, idx) => (
                        <View
                          key={idx}
                          className="flex-row items-center gap-md border-b border-border-light py-md last:border-b-0"
                        >
                          <Image
                            source={{ uri: item.product.image }}
                            className="h-14 w-14 rounded-sm"
                            contentFit="cover"
                            draggable={false}
                          />
                          <View className="flex-1">
                            <Text className="text-body md:text-body-lg font-bold text-text-dark" numberOfLines={1}>
                              {item.product.name}
                            </Text>
                            <Text className="mt-0.5 text-small md:text-small-lg text-text-gray" numberOfLines={1}>
                              {item.sizeId === "large" ? "Large" : "Regular"}
                              {item.toppingIds.length > 0 ? ", " + item.toppingIds.length + " extras" : ""}
                              {" · Qty " + item.quantity}
                            </Text>
                            <Text className="mt-0.5 text-body md:text-body-lg font-bold text-text-dark">
                              £{item.total.toFixed(2)}
                            </Text>
                          </View>
                          <TouchableOpacity
                            className="h-8 w-8 items-center justify-center rounded-pill"
                            onPress={() => removeFromCart(idx)}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          >
                            <Ionicons name="trash-outline" size={18} color={COLORS.primary} />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}

                <TouchableOpacity
                  onPress={() => setInstructionsModalVisible(true)}
                  className="flex-row items-center gap-sm rounded-md border border-chip-border bg-white px-lg py-md"
                >
                  <Ionicons
                    name={cookingInstructions ? "document-text" : "add-circle-outline"}
                    size={20}
                    color={COLORS.primary}
                  />
                  <Text className="flex-1 text-body md:text-body-lg font-bold text-text-dark" numberOfLines={1}>
                    {cookingInstructions || "Add Cooking Instructions"}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
                </TouchableOpacity>

                {suggestions.length > 0 && (
                  <View>
                    <Text className="mb-sm text-tiny md:text-tiny-lg font-bold tracking-wide text-text-gray">
                      YOU MAY ALSO LIKE
                    </Text>
                    <ScrollView
                      ref={suggestionsScrollRef}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerClassName="gap-md"
                      onScroll={onSuggestionsScroll}
                      scrollEventThrottle={16}
                      {...(onSuggestionsMouseDown
                        ? {
                            onMouseDown: onSuggestionsMouseDown,
                            onMouseMove: onSuggestionsMouseMove,
                            onMouseUp: onSuggestionsMouseUp,
                            onMouseLeave: onSuggestionsMouseLeave,
                          }
                        : {})}
                    >
                      {suggestions.map((product) => (
                        <TouchableOpacity
                          key={product.id}
                          className="w-[130px]"
                          activeOpacity={0.85}
                          onPress={() => setSelectedProduct(product)}
                        >
                          <View className="mb-sm aspect-square w-full overflow-hidden rounded-md bg-[#eee]">
                            <Image
                            source={{ uri: product.image }}
                            className="h-full w-full"
                            contentFit="cover"
                            draggable={false}
                          />
                          </View>
                          <Text className="text-small md:text-small-lg font-bold text-text-dark" numberOfLines={1}>
                            {product.name}
                          </Text>
                          <View className="mt-1 flex-row items-center justify-between">
                            <Text className="text-small md:text-small-lg font-bold text-text-dark">
                              £{product.price.toFixed(2)}
                            </Text>
                            <TouchableOpacity
                              className="h-6 w-6 items-center justify-center rounded-pill bg-primary"
                              onPress={() => setSelectedProduct(product)}
                            >
                              <Ionicons name="add" size={14} color={COLORS.white} />
                            </TouchableOpacity>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}

                <View className="rounded-md border border-chip-border bg-white px-lg py-md">
                  <Text className="mb-sm text-body md:text-body-lg font-extrabold tracking-wide text-text-dark">
                    BILL DETAILS
                  </Text>
                  <View className="flex-row items-center justify-between py-1">
                    <Text className="text-body md:text-body-lg text-text-gray">Sub Total</Text>
                    <Text className="text-body md:text-body-lg text-text-dark">£{cartTotal.toFixed(2)}</Text>
                  </View>
                  {!!couponCode && (
                    <View className="flex-row items-center justify-between py-1">
                      <Text className="text-body md:text-body-lg text-text-gray">Discount ({couponCode})</Text>
                      <Text className="text-body md:text-body-lg text-primary">−£{discount.toFixed(2)}</Text>
                    </View>
                  )}
                  <View className="flex-row items-center justify-between py-1">
                    <Text className="text-body md:text-body-lg text-text-gray">
                      {fulfillment === "delivery" ? "Delivery Fee" : "Pickup"}
                    </Text>
                    <Text className="text-body md:text-body-lg text-text-dark">
                      {deliveryFee > 0 ? `£${deliveryFee.toFixed(2)}` : "Free"}
                    </Text>
                  </View>
                  <View className="mt-sm flex-row items-center justify-between border-t border-border-light pt-sm">
                    <Text className="text-body md:text-body-lg font-extrabold text-text-dark">Total</Text>
                    <Text className="text-body md:text-body-lg font-extrabold text-text-dark">
                      £{total.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </ScrollView>

      <ScheduleModal
        visible={scheduleModalVisible}
        initialDate={scheduleDate}
        initialSlot={scheduledSlot}
        onClose={() => setScheduleModalVisible(false)}
        onConfirm={(date, slot) => {
          setScheduleDate(date);
          setScheduledSlot(slot);
          setScheduleModalVisible(false);
        }}
      />
      <PromptModal
        visible={couponModalVisible}
        title="Add Coupon"
        placeholder="Enter coupon code"
        initialValue={couponCode}
        error={couponError}
        onClose={() => {
          setCouponModalVisible(false);
          setCouponError(null);
        }}
        onSubmit={handleApplyCoupon}
      />
      <CouponAppliedModal
        visible={couponSuccessVisible}
        code={couponCode}
        discount={discount}
        onClose={() => setCouponSuccessVisible(false)}
      />
      <PromptModal
        visible={instructionsModalVisible}
        title="Cooking Instructions"
        placeholder="e.g. No onions, extra spicy..."
        initialValue={cookingInstructions}
        multiline
        onClose={() => setInstructionsModalVisible(false)}
        onSubmit={(text) => {
          setCookingInstructions(text);
          setInstructionsModalVisible(false);
        }}
      />
      <ProductDetailModal
        key={selectedProduct?.id ?? "none"}
        visible={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
      />
      <OrderPlacedModal
        visible={orderPlacedVisible}
        restaurantName={RESTAURANT.name}
        onClose={handleOrderPlacedClose}
      />
    </SafeAreaView>
  );
}
