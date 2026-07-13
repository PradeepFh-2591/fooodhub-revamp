import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Linking, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { RESTAURANT } from "../constants/restaurant";
import { COLORS } from "../constants/theme";
import { isRestaurantOpenAt } from "../lib/restaurantHours";
import ScheduleModal from "./ScheduleModal";
import SignInModal from "./SignInModal";

type Fulfillment = "delivery" | "pickup";
type When = "asap" | "schedule" | "group";

// Delivery/pickup is its own toggle — exactly one is always active. Schedule
// and group order are a separate, independent modifier on top of whichever
// fulfillment method is selected (e.g. a scheduled pickup or a group delivery).
const FULFILLMENT_OPTIONS: {
  key: Fulfillment;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
}[] = [
  { key: "delivery", icon: "bicycle-outline", title: "Delivery" },
  { key: "pickup", icon: "bag-outline", title: "Pickup" },
];

// Each option keeps its own accent color (not tied to the primary brand
// color) so they read as distinct shortcuts rather than a single toggle group.
const WHEN_OPTIONS: {
  key: When;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  compactTitle: string;
  subtitle: string;
  border: string;
  iconBg: string;
  iconColor: string;
}[] = [
  {
    key: "asap",
    icon: "flash-outline",
    title: "ASAP",
    compactTitle: "ASAP",
    subtitle: "Right away",
    border: "border-success",
    iconBg: "bg-success/15",
    iconColor: COLORS.success,
  },
  {
    key: "schedule",
    icon: "time-outline",
    title: "Schedule",
    compactTitle: "Schedule",
    subtitle: "Pick a time",
    border: "border-primary",
    iconBg: "bg-primary/15",
    iconColor: COLORS.primary,
  },
  {
    key: "group",
    icon: "people-outline",
    title: "Group Order",
    compactTitle: "Group",
    subtitle: "Order together",
    border: "border-warning",
    iconBg: "bg-warning/15",
    iconColor: COLORS.warning,
  },
];

const SOCIAL_LINKS: { key: string; icon: keyof typeof Ionicons.glyphMap; url: string; color: string }[] = [
  { key: "facebook", icon: "logo-facebook", url: "https://www.facebook.com/Foodhub.co.uk", color: "#1877F2" },
  { key: "instagram", icon: "logo-instagram", url: "https://www.instagram.com/foodhub.co.uk", color: "#E1306C" },
  {
    key: "youtube",
    icon: "logo-youtube",
    url: "https://www.youtube.com/channel/UC12E2pidPaspN8tWTvaRs-A",
    color: "#FF0000",
  },
  { key: "tiktok", icon: "logo-tiktok", url: "https://www.tiktok.com/@foodhubuk", color: COLORS.textDark },
];

export default function LocationBar() {
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  // Below Tailwind's `md` breakpoint there isn't room for icon+title+subtitle+
  // chevron on every control, so this collapses each one to a small icon-over-
  // label chip so delivery/pickup and all the "when" options still fit in one row.
  const isCompact = windowWidth < 768;
  const [fulfillment, setFulfillment] = useState<Fulfillment>("delivery");
  const isOpen = isRestaurantOpenAt();

  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(() => new Date());
  const [scheduledSlot, setScheduledSlot] = useState<string | null>(null);
  const [signInModalVisible, setSignInModalVisible] = useState(false);

  const handleSelectWhen = (key: When) => {
    if (key === "schedule") setScheduleModalVisible(true);
    if (key === "group") setSignInModalVisible(true);
  };

  // ASAP pickup is instant, so it's only offered when pickup is active —
  // delivery always goes through Schedule or Group Order.
  const whenOptions = fulfillment === "pickup" ? WHEN_OPTIONS : WHEN_OPTIONS.filter((o) => o.key !== "asap");

  return (
    <View className="items-center bg-white takeaway-details">
      <View className="w-full max-w-content px-lg py-lg">
        <View className="flex-row items-center justify-between">
          <View
            className={`flex-row items-center gap-1.5 self-start rounded-pill border border-chip-border bg-white px-sm ${
              isCompact ? "h-8" : "py-1"
            }`}
          >
            <View className={`h-1.5 w-1.5 rounded-full ${isOpen ? "bg-success" : "bg-text-light-gray"}`} />
            <Text
              className={`text-tiny md:text-tiny-lg font-bold uppercase tracking-wide ${
                isOpen ? "text-success" : "text-text-gray"
              }`}
            >
              {isOpen ? "Open Now" : "Closed"}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/info")}
            className={`items-center justify-center rounded-pill border border-chip-border bg-white ${
              isCompact ? "h-8 w-8" : "flex-row gap-1.5 px-md py-1.5"
            }`}
          >
            <Ionicons
              name="information-circle-outline"
              className={isCompact ? "" : "mt-1"}
              size={isCompact ? 18 : 15}
              color={COLORS.primary}
            />
            {!isCompact && (
              <>
                <Text className="text-small md:text-small-lg font-semibold text-primary">More Info</Text>
                <Ionicons name="chevron-forward" className="mt-1" size={14} color={COLORS.primary} />
              </>
            )}
          </TouchableOpacity>
        </View>

        <View className={isCompact ? "mt-1 items-center" : "mt-1 flex-row items-center gap-sm"}>
          <Text
            className={`text-h1 md:text-h1-lg font-extrabold text-text-dark ta-name ${isCompact ? "text-center" : ""}`}
          >
            {RESTAURANT.name}
          </Text>
          {!isCompact && (
            <View className="flex-row items-center gap-1">
              <Ionicons name="star" size={14} color="#F5A623" />
              <Text className="text-small md:text-small-lg font-bold text-text-dark">3.5</Text>
              <Text className="text-tiny md:text-tiny-lg text-text-gray">(100+)</Text>
            </View>
          )}
        </View>
        <View className={`mt-xs flex-row items-center gap-xs ${isCompact ? "justify-center" : ""}`}>
          <Ionicons name="location-outline" size={14} color={COLORS.textGray} />
          <Text className="text-small md:text-small-lg leading-4 text-text-gray">{RESTAURANT.address}</Text>
        </View>
        {isCompact && (
          <View className="mt-xs flex-row items-center justify-center gap-1">
            <Ionicons name="star" size={14} color="#F5A623" />
            <Text className="text-small md:text-small-lg font-bold text-text-dark">3.5</Text>
            <Text className="text-tiny md:text-tiny-lg text-text-gray">(100+)</Text>
          </View>
        )}

        {/* Below `md`, the toggle takes the full row (its own line) and the three "when"
            options share the next line as small icon+label chips. At `md` and up all four
            join a single row, same as the desktop layout always looked. */}
        <View className="mt-md flex-row flex-wrap gap-sm">
          <View className="w-full flex-row overflow-hidden rounded-md border border-chip-border md:w-[320px]">
            {FULFILLMENT_OPTIONS.map((option) => {
              const isActive = fulfillment === option.key;
              return (
                <TouchableOpacity
                  key={option.key}
                  onPress={() => setFulfillment(option.key)}
                  className={`flex-1 flex-row items-center justify-center gap-1 px-sm py-sm md:gap-sm md:px-lg md:py-md ${
                    isActive ? "bg-primary" : "bg-white"
                  }`}
                >
                  <View
                    className={`h-7 w-7 items-center justify-center rounded-full md:h-10 md:w-10 ${
                      isActive ? "bg-white/25" : "bg-primary/15"
                    }`}
                  >
                    <Ionicons name={option.icon} size={isCompact ? 14 : 18} color={isActive ? COLORS.white : COLORS.primary} />
                  </View>
                  <Text
                    numberOfLines={1}
                    className={`text-small font-extrabold md:text-body md:text-body-lg ${isActive ? "text-white" : "text-text-dark"}`}
                  >
                    {option.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {whenOptions.map((option) => {
            const subtitle =
              option.key === "schedule" && scheduledSlot
                ? `${scheduleDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}, ${scheduledSlot}`
                : option.subtitle;
            return (
              <TouchableOpacity
                key={option.key}
                onPress={() => handleSelectWhen(option.key)}
                className={`flex-1 items-center justify-center gap-1 rounded-md border bg-white px-1 py-1.5 md:w-[220px] md:flex-none md:flex-row md:justify-start md:gap-sm md:px-md md:py-md ${option.border}`}
              >
                <View className={`h-7 w-7 items-center justify-center rounded-full md:h-10 md:w-10 ${option.iconBg}`}>
                  <Ionicons name={option.icon} size={isCompact ? 14 : 18} color={option.iconColor} />
                </View>
                {isCompact ? (
                  <Text numberOfLines={1} className="text-tiny font-bold text-text-dark">
                    {option.compactTitle}
                  </Text>
                ) : (
                  <>
                    <View className="flex-1">
                      <Text className="text-small md:text-small-lg font-bold text-text-dark">{option.title}</Text>
                      <Text className="text-tiny md:text-tiny-lg text-text-gray" numberOfLines={1}>
                        {subtitle}
                      </Text>
                    </View>
                    <View className="h-9 w-9 items-center justify-center rounded-full bg-border-light">
                      <Ionicons name="chevron-forward" size={16} color={COLORS.textDark} />
                    </View>
                  </>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View
          className={`mt-sm overflow-hidden rounded-lg border px-lg py-lg ${
            isOpen ? "border-success bg-success/5" : "border-danger bg-danger/5"
          } ${isCompact ? "items-center gap-sm" : "flex-row items-center gap-md"}`}
        >
          <View
            className={`h-8 w-8 items-center justify-center rounded-full md:h-12 md:w-12 ${
              isOpen ? "bg-success" : "bg-danger"
            }`}
          >
            <Ionicons name="time" size={isCompact ? 16 : 22} color={COLORS.white} />
          </View>
          <View className={isCompact ? "items-center" : "flex-1"}>
            <Text
              className={`text-body md:text-body-lg font-extrabold text-text-dark ${isCompact ? "text-center" : ""}`}
            >
              {isOpen ? "We're taking orders now!" : "We're currently closed"}
            </Text>
            <Text className={`text-small md:text-small-lg text-text-gray ${isCompact ? "text-center" : ""}`}>
              {isOpen ? "Place your order and enjoy your favourites." : "Check back during our opening hours."}
            </Text>
          </View>
          {!isCompact && (
            <Ionicons
              name="restaurant-outline"
              size={40}
              color={`${isOpen ? COLORS.success : COLORS.danger}55`}
            />
          )}
        </View>

        <View className="mt-sm flex-row items-center justify-center gap-md">
          {SOCIAL_LINKS.map((social) => (
            <TouchableOpacity
              key={social.key}
              onPress={() => Linking.openURL(social.url)}
              className="h-10 w-10 items-center justify-center rounded-full border border-chip-border bg-white"
            >
              <Ionicons name={social.icon} size={18} color={social.color} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

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

      <SignInModal visible={signInModalVisible} onClose={() => setSignInModalVisible(false)} />
    </View>
  );
}
