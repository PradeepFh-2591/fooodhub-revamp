import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { RESTAURANT, RESTAURANT_SHORT_ADDRESS } from "../constants/restaurant";
import { COLORS } from "../constants/theme";
import { isRestaurantOpenAt } from "../lib/restaurantHours";
import ScheduleModal from "./ScheduleModal";
import SignInModal from "./SignInModal";
import SocialLinksRow from "./SocialLinksRow";

const HALAL_LOGO_URL = "https://public.touch2success.com/static/e286bf1fb611e6a4ff953f5ad6d78965/img/1783533043phpQTXTdH.png";

type Fulfillment = "delivery" | "pickup";
type When = "asap" | "schedule" | "group";

// Delivery/pickup is its own toggle — exactly one is always active. Schedule
// and group order are a separate, independent modifier on top of whichever
// fulfillment method is selected (e.g. a scheduled pickup or a group delivery).
const FULFILLMENT_OPTIONS: {
  key: Fulfillment;
  // "material" is used for delivery's van icon — Ionicons has no van glyph.
  iconSet: "ionicons" | "material";
  icon: string;
  title: string;
}[] = [
  { key: "delivery", iconSet: "material", icon: "truck-delivery-outline", title: "Delivery" },
  { key: "pickup", iconSet: "ionicons", icon: "bag-outline", title: "Pickup" },
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

  // ASAP is hidden — Schedule and Group Order are the only "when" options shown.
  const whenOptions = WHEN_OPTIONS.filter((o) => o.key !== "asap");

  return (
    <View className="items-center bg-white takeaway-details">
      <View className="w-full max-w-content px-lg py-lg">
        <View className={isCompact ? "items-center gap-sm" : "flex-row items-center justify-between gap-lg"}>
          {/* Left: status/more-info, name/halal, address — stacked */}
          <View className={isCompact ? "items-center gap-sm" : "gap-1"}>
            <View className={`flex-row items-center gap-sm ${isCompact ? "justify-center" : ""}`}>
              <View className="flex-row items-center gap-1">
                <View className={`h-1.5 w-1.5 rounded-full ${isOpen ? "bg-success" : "bg-text-light-gray"}`} />
                <Text
                  className={`text-tiny md:text-tiny-lg font-bold uppercase tracking-wide ${
                    isOpen ? "text-success" : "text-text-gray"
                  }`}
                >
                  {isOpen ? "Open Now" : "Closed"}
                </Text>
              </View>
              <View className="h-3 w-px bg-chip-border" />
              <TouchableOpacity onPress={() => router.push("/info")} className="flex-row items-center gap-1">
                <Text className="text-small md:text-small-lg font-semibold text-text-dark">More Info</Text>
                <Ionicons name="information-circle-outline" size={15} color={COLORS.textGray} style={{ marginTop: 2 }} />
              </TouchableOpacity>
            </View>

            <View className={`flex-row items-center gap-sm ${isCompact ? "justify-center" : ""}`}>
              <Text className="text-h1 md:text-h1-lg font-extrabold text-text-dark ta-name">{RESTAURANT.name}</Text>
              <Image
                source={{ uri: HALAL_LOGO_URL }}
                className={isCompact ? "h-7 w-7" : "h-9 w-9"}
                contentFit="contain"
              />
            </View>

            <View className={`flex-row items-center gap-xs ${isCompact ? "justify-center" : ""}`}>
              <Ionicons name="location-outline" size={14} color={COLORS.textGray} />
              <Text className="text-small md:text-small-lg leading-4 text-text-gray">{RESTAURANT_SHORT_ADDRESS}</Text>
            </View>
          </View>

          {/* Right: social icons + rating badge, grouped together with a
              single divider between the two — not a border on each piece.
              On compact screens the rating comes first and the social row
              sits directly below it, all sharing the same even gap-sm rhythm. */}
          {!isCompact && (
            <View className="flex-row items-center gap-md">
              <SocialLinksRow />
              <View className="h-6 w-px bg-chip-border" />
              <View className="flex-row items-center gap-1">
                <Ionicons name="star" size={16} color="#F5A623" />
                <Text className="text-small md:text-small-lg font-bold text-text-dark">3.5</Text>
                <Text className="text-tiny md:text-tiny-lg text-text-gray">(100+)</Text>
              </View>
            </View>
          )}

          {isCompact && (
            <View className="flex-row items-center justify-center gap-1">
              <Ionicons name="star" size={14} color="#F5A623" />
              <Text className="text-small md:text-small-lg font-bold text-text-dark">3.5</Text>
              <Text className="text-tiny md:text-tiny-lg text-text-gray">(100+)</Text>
            </View>
          )}

          {isCompact && <SocialLinksRow />}
        </View>

        {/* Below `md`, the toggle takes the full row (its own line) and the three "when"
            options share the next line as small icon+label chips. At `md` and up all four
            join a single row, same as the desktop layout always looked. */}
        <View className="mt-sm flex-row flex-wrap justify-between gap-sm">
          <View className="relative w-full flex-row overflow-hidden rounded-md border border-chip-border md:w-[260px]">
            <View
              className={`absolute top-0 h-full w-1/2 rounded-md bg-primary transition-all duration-200 ease-in-out ${
                fulfillment === "pickup" ? "left-1/2" : "left-0"
              }`}
            />
            {FULFILLMENT_OPTIONS.map((option) => {
              const isActive = fulfillment === option.key;
              return (
                <TouchableOpacity
                  key={option.key}
                  onPress={() => setFulfillment(option.key)}
                  className="flex-1 flex-row items-center justify-center gap-1 px-sm py-sm md:gap-1.5 md:px-md md:py-sm"
                >
                  <View
                    className={`h-7 w-7 items-center justify-center rounded-full md:h-8 md:w-8 ${
                      isActive ? "bg-white/25" : "bg-primary/15"
                    }`}
                  >
                    {option.iconSet === "material" ? (
                      <MaterialCommunityIcons
                        name={option.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                        size={isCompact ? 14 : 16}
                        color={isActive ? COLORS.white : COLORS.primary}
                      />
                    ) : (
                      <Ionicons
                        name={option.icon as keyof typeof Ionicons.glyphMap}
                        size={isCompact ? 14 : 16}
                        color={isActive ? COLORS.white : COLORS.primary}
                      />
                    )}
                  </View>
                  <Text
                    numberOfLines={1}
                    className={`text-small font-extrabold md:text-body ${isActive ? "text-white" : "text-text-dark"}`}
                  >
                    {option.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View className="w-full flex-row flex-wrap gap-sm md:w-auto">
            {whenOptions.map((option) => {
              const subtitle =
                option.key === "schedule" && scheduledSlot
                  ? `${scheduleDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}, ${scheduledSlot}`
                  : option.subtitle;
              return (
                <TouchableOpacity
                  key={option.key}
                  onPress={() => handleSelectWhen(option.key)}
                  className={`flex-1 items-center justify-center gap-1 rounded-md border bg-white px-1 py-1.5 md:w-[180px] md:flex-none md:flex-row md:justify-start md:gap-sm md:px-sm md:py-sm ${option.border}`}
                >
                  <View className={`h-7 w-7 items-center justify-center rounded-full md:h-8 md:w-8 ${option.iconBg}`}>
                    <Ionicons name={option.icon} size={isCompact ? 14 : 16} color={option.iconColor} />
                  </View>
                  {isCompact ? (
                    <Text numberOfLines={1} className="text-tiny font-bold text-text-dark">
                      {option.compactTitle}
                    </Text>
                  ) : (
                    <>
                      <View className="flex-1">
                        <Text className="text-small font-bold text-text-dark">{option.title}</Text>
                        <Text className="text-tiny text-text-gray" numberOfLines={1}>
                          {subtitle}
                        </Text>
                      </View>
                      <View className="h-7 w-7 items-center justify-center rounded-full bg-border-light">
                        <Ionicons name="chevron-forward" size={14} color={COLORS.textDark} />
                      </View>
                    </>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View
          className={`mt-sm overflow-hidden rounded-md border px-md py-sm ${
            isOpen ? "border-success bg-success/5" : "border-danger bg-danger/5"
          } ${isCompact ? "items-center gap-sm" : "flex-row items-center gap-sm"}`}
        >
          <View
            className={`h-7 w-7 items-center justify-center rounded-full md:h-9 md:w-9 ${
              isOpen ? "bg-success" : "bg-danger"
            }`}
          >
            <Ionicons name="time" size={isCompact ? 14 : 18} color={COLORS.white} />
          </View>
          <View className={isCompact ? "items-center" : "flex-1"}>
            <Text className={`text-body font-extrabold text-text-dark ${isCompact ? "text-center" : ""}`}>
              {isOpen ? "We're taking orders now!" : "We're currently closed"}
            </Text>
            <Text className={`text-small text-text-gray ${isCompact ? "text-center" : ""}`}>
              {isOpen ? "Place your order and enjoy your favourites." : "Check back during our opening hours."}
            </Text>
          </View>
          {!isCompact && (
            <Ionicons
              name="restaurant-outline"
              size={28}
              color={`${isOpen ? COLORS.success : COLORS.danger}55`}
            />
          )}
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
