import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Linking, Platform, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FoodHygieneRating from "../components/FoodHygieneRating";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { RESTAURANT } from "../constants/restaurant";
import { COLORS } from "../constants/theme";
import { CUISINES } from "../data/restaurantInfo";
import { isRestaurantOpenAt, jsDayToRowIndex } from "../lib/restaurantHours";

const MAP_ZOOM = 15;
const MAP_EMBED_URL = `https://www.google.com/maps?q=${RESTAURANT.latitude},${RESTAURANT.longitude}&z=${MAP_ZOOM}&output=embed`;

// Converts lat/lon to slippy-map tile coordinates for the static fallback
// image used where an <iframe> isn't available (native iOS/Android).
function latLonToTile(lat: number, lon: number, zoom: number) {
  const latRad = (lat * Math.PI) / 180;
  const n = 2 ** zoom;
  const x = Math.floor(((lon + 180) / 360) * n);
  const y = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n);
  return { x, y };
}
const { x: MAP_TILE_X, y: MAP_TILE_Y } = latLonToTile(RESTAURANT.latitude, RESTAURANT.longitude, MAP_ZOOM);
const MAP_TILE_URL = `https://tile.openstreetmap.org/${MAP_ZOOM}/${MAP_TILE_X}/${MAP_TILE_Y}.png`;

export default function InfoScreen() {
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  // Below `md`, everything stacks in one column in a specific reading order
  // (About Us, Cuisines, Location, Opening Hours) instead of the two-column
  // split used at `md` and up.
  const isCompact = windowWidth < 768;
  const todayIndex = jsDayToRowIndex(new Date().getDay());
  const isOpen = isRestaurantOpenAt();

  const aboutUsCard = (
    <View className="gap-md rounded-md border border-chip-border bg-white p-lg">
      <View className="gap-1">
        <View className="flex-row items-center gap-sm">
          <Ionicons name="information-circle" size={18} color={COLORS.primary} />
          <Text className="text-small md:text-small-lg font-extrabold tracking-wide text-text-dark">ABOUT US</Text>
        </View>
        <View className="ml-6 h-[2px] w-10 bg-primary" />
      </View>
      <Text className="text-body md:text-body-lg leading-5 text-text-gray">{RESTAURANT.description}</Text>
    </View>
  );

  const cuisinesCard = (
    <View className="gap-md rounded-md border border-chip-border bg-white p-lg">
      <View className="gap-1">
        <Text className="text-small md:text-small-lg font-extrabold tracking-wide text-text-dark">CUISINES</Text>
        <View className="h-[2px] w-10 bg-primary" />
      </View>
      <View className="flex-row flex-wrap items-start justify-around gap-md">
        {CUISINES.map((cuisine) => (
          <View key={cuisine.label} className="items-center gap-xs">
            <View className="h-16 w-16 overflow-hidden rounded-full border-2 border-primary/20 bg-[#eee]">
              <Image source={{ uri: cuisine.image }} className="h-full w-full" contentFit="cover" draggable={false} />
            </View>
            <Text className="text-tiny md:text-tiny-lg font-bold tracking-wide text-text-dark">
              {cuisine.label.toUpperCase()}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const locationCard = (
    <View className="flex-row flex-wrap overflow-hidden rounded-md border border-chip-border">
      <View className="w-full gap-md bg-primary/5 p-lg md:min-w-[220px] md:flex-1">
        <View className="gap-1">
          <View className="flex-row items-center gap-sm">
            <Ionicons name="location" size={16} color={COLORS.primary} />
            <Text className="text-small md:text-small-lg font-extrabold tracking-wide text-primary">LOCATION</Text>
          </View>
          <Text className="text-body md:text-body-lg text-text-dark">{RESTAURANT.address}</Text>
        </View>
        <View className="h-px w-full bg-border-light" />
        <View className="gap-1">
          <View className="flex-row items-center gap-sm">
            <Ionicons name="call" size={16} color={COLORS.primary} />
            <Text className="text-small md:text-small-lg font-extrabold tracking-wide text-primary">PHONE</Text>
          </View>
          <TouchableOpacity onPress={() => Linking.openURL(`tel:${RESTAURANT.phone}`)}>
            <Text className="text-body md:text-body-lg font-semibold text-text-dark">{RESTAURANT.phone}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="w-full md:min-w-[260px] md:flex-[1.4]">
        <View className="h-[220px] w-full">
          {Platform.OS === "web" ? (
            <iframe src={MAP_EMBED_URL} loading="lazy" style={{ border: 0, width: "100%", height: "100%" }} />
          ) : (
            <View className="h-full w-full items-center justify-center">
              <Image
                source={{ uri: MAP_TILE_URL }}
                className="absolute h-full w-full"
                contentFit="cover"
                draggable={false}
              />
              <View className="items-center">
                <View className="rounded-pill bg-primary px-md py-1">
                  <Text className="text-tiny md:text-tiny-lg font-bold text-white">WE ARE HERE</Text>
                </View>
                <Ionicons name="location" size={30} color={COLORS.primary} />
              </View>
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(RESTAURANT.address)}`)
          }
          className="flex-row items-center justify-center gap-xs bg-primary py-md"
        >
          <Ionicons name="navigate-outline" size={16} color={COLORS.white} />
          <Text className="text-body md:text-body-lg font-extrabold tracking-wide text-white">GET DIRECTIONS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const foodHygieneCard = <FoodHygieneRating />;

  const openingHoursCard = (
    <View className="gap-md rounded-md border border-chip-border bg-white p-lg">
      <View className="gap-1">
        <View className="flex-row items-center gap-sm">
          <Ionicons name="time" size={18} color={COLORS.primary} />
          <Text className="text-small md:text-small-lg font-extrabold tracking-wide text-text-dark">
            OPENING HOURS
          </Text>
        </View>
        <View className="ml-6 h-[2px] w-10 bg-primary" />
      </View>

      {/* These 3 tabs are in the same Day/Delivery/Pickup order, and each is
          flex-1 to match the table's column widths below, so they stay aligned. */}
      <View className="flex-row gap-sm">
        <View className="flex-1 items-center gap-1 rounded-sm border border-border-light bg-white py-sm">
          <Ionicons name="calendar-outline" size={18} color={COLORS.textDark} />
          <Text className="text-tiny md:text-tiny-lg font-bold tracking-wide text-text-dark">DAY</Text>
        </View>
        <View className="flex-1 items-center gap-1 rounded-sm border border-border-light bg-white py-sm">
          <MaterialCommunityIcons name="truck-delivery-outline" size={18} color={COLORS.textDark} />
          <Text className="text-tiny md:text-tiny-lg font-bold tracking-wide text-text-dark">DELIVERY</Text>
        </View>
        <View className="flex-1 items-center gap-1 rounded-sm border border-border-light bg-white py-sm">
          <Ionicons name="bag-outline" size={18} color={COLORS.textDark} />
          <Text className="text-tiny md:text-tiny-lg font-bold tracking-wide text-text-dark">PICKUP</Text>
        </View>
      </View>

      <View className="overflow-hidden rounded-sm border border-border-light">
        {RESTAURANT.openingHours.map((row, index) => {
          const isToday = index === todayIndex;
          const isClosed = row.pickup.length === 0 && row.delivery.length === 0;
          return (
            <View
              key={row.day}
              className={`flex-row ${index > 0 ? "border-t border-border-light" : ""} ${
                isToday ? "bg-primary/5" : ""
              }`}
            >
              <Text
                className={`flex-1 px-sm py-sm text-tiny md:text-tiny-lg font-bold ${
                  isToday ? "text-primary" : "text-text-dark"
                }`}
              >
                {row.day.toUpperCase()}
              </Text>
              <View className="flex-1 px-sm py-sm">
                {isClosed ? (
                  <Text className="text-tiny md:text-tiny-lg font-bold text-primary">CLOSED</Text>
                ) : (
                  row.delivery.map((range) => (
                    <Text
                      key={range}
                      className={`text-tiny md:text-tiny-lg ${isToday ? "font-bold text-primary" : "text-text-dark"}`}
                    >
                      {range}
                    </Text>
                  ))
                )}
              </View>
              <View className="flex-1 px-sm py-sm">
                {isClosed ? (
                  <Text className="text-tiny md:text-tiny-lg font-bold text-primary">CLOSED</Text>
                ) : (
                  row.pickup.map((range) => (
                    <Text
                      key={range}
                      className={`text-tiny md:text-tiny-lg ${isToday ? "font-bold text-primary" : "text-text-dark"}`}
                    >
                      {range}
                    </Text>
                  ))
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="items-center border-b border-border-light">
          <View className="w-full max-w-content flex-row flex-wrap items-center justify-between gap-sm px-lg py-lg">
            <View>
              <Text className="text-h1 md:text-h1-lg font-extrabold text-text-dark">{RESTAURANT.name}</Text>
              <View className="mt-1 flex-row items-center gap-xs">
                <View className={`h-1.5 w-1.5 rounded-full ${isOpen ? "bg-success" : "bg-text-light-gray"}`} />
                <Text
                  className={`text-small md:text-small-lg font-semibold ${isOpen ? "text-success" : "text-text-gray"}`}
                >
                  {isOpen ? "Open Now" : "Closed"}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/")}
              className="flex-row items-center gap-sm rounded-pill bg-primary px-lg py-sm"
            >
              <Text className="text-body md:text-body-lg font-extrabold tracking-wide text-white">ORDER NOW</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="items-center px-lg py-lg">
          {isCompact ? (
            <View className="w-full max-w-content gap-lg">
              {aboutUsCard}
              {cuisinesCard}
              {locationCard}
              {foodHygieneCard}
              {openingHoursCard}
            </View>
          ) : (
            <View className="w-full max-w-content flex-row flex-wrap gap-xl">
              {/* Left column */}
              <View className="gap-lg md:min-w-[320px] md:flex-[4]">
                {aboutUsCard}
                {locationCard}
                {foodHygieneCard}
              </View>

              {/* Right column */}
              <View className="gap-lg md:min-w-[280px] md:flex-[2]">
                {openingHoursCard}
                {cuisinesCard}
              </View>
            </View>
          )}
        </View>

        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}
