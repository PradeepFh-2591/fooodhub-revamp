import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import { RESTAURANT } from "../constants/restaurant";

const COLORS = {
  bg: "#eee",
  black: "#111111",
  bodyText: "#555555",
  mutedText: "#777777",
  red: "#c0392b",
  divider: "rgba(0,0,0,0.12)",
};

const LANGUAGES = [
  { code: "EN-GB", label: "English (United Kingdom)", subtitle: "United Kingdom (Default)" },
  { code: "ZH-CN", label: "Chinese (Simplified)", subtitle: "Simplified" },
  { code: "ZH-HK", label: "香港", subtitle: "香港" },
  { code: "EN-US", label: "English (United States)", subtitle: "United States" },
  { code: "ES", label: "Espanol (Spanish)", subtitle: "Spanish" },
];

function HygieneBadge({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="link"
      accessibilityLabel="View our Food Hygiene Rating"
      style={styles.hygieneBadge}
    >
      <Image
        source={require("../../assets/images/food-hygiene-rating-scheme.png")}
        style={{ width: 140, height: 90 }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

function ColHeading({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.colHeadingWrap}>
      <Text style={styles.colHeading}>{children}</Text>
      <View style={styles.colHeadingUnderline} />
    </View>
  );
}

function FooterLink({ label, onPress }: { label: string; onPress: () => void }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      onPressIn={() => setHovered(true)}
      onPressOut={() => setHovered(false)}
      style={[styles.linkRow, hovered && styles.linkRowHovered]}
      accessibilityRole="link"
    >
      <Text style={[styles.linkText, hovered && styles.linkTextHovered]}>{label}</Text>
    </TouchableOpacity>
  );
}

function ContactItem({
  icon,
  children,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.contactItem}>
      <Ionicons name={icon} size={16} color={COLORS.bodyText} style={styles.contactIcon} />
      <Text style={styles.contactText}>{children as string}</Text>
    </View>
  );
}

export default function Footer() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isTablet = width >= 601;
  const isDesktop = width >= 1024;
  const [languageIndex, setLanguageIndex] = React.useState(0);
  const [languageMenuOpen, setLanguageMenuOpen] = React.useState(false);

  const open = (url: string) => Linking.openURL(url);

  const columns = [
    {
      heading: "Customer Services",
      links: [
        { label: "Order Now", onPress: () => router.push("/") },
        { label: "Review", onPress: () => open("#") },
        { label: "Allergy Info", onPress: () => open("#") },
        { label: "Unsubscribe", onPress: () => open("#") },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Terms & Conditions", onPress: () => open("#") },
        { label: "Terms of Use", onPress: () => open("#") },
        { label: "Privacy Policy", onPress: () => open("#") },
      ],
    },
  ];

  const colStyle = isDesktop ? ({ width: "25%" } as const) : isTablet ? ({ width: "45%" } as const) : ({ width: "100%" } as const);

  return (
    <View style={styles.footer}>
      <View style={styles.inner}>
        {/* Top row: logo + language selector */}
        <View style={styles.topRow}>
          <View style={{ flex: 1, alignItems: "flex-start" }}>
            <Image
              source={require("../../assets/images/foodhub_new.png")}
              style={{ height: 40, width: 150 } as any}
              resizeMode="contain"
            />
          </View>
          <TouchableOpacity
            style={styles.languageSelector}
            accessibilityRole="button"
            onPress={() => setLanguageMenuOpen(true)}
          >
            <Ionicons name="globe-outline" size={20} color={COLORS.black} />
            <Text style={styles.languageText}>{LANGUAGES[languageIndex].code}</Text>
            <Ionicons name="chevron-down" size={16} color={COLORS.black} />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Columns */}
        <View style={[styles.columns, !isDesktop && styles.columnsWrap]}>
          {columns.map((col) => (
            <View key={col.heading} style={[styles.col, colStyle]}>
              <ColHeading>{col.heading}</ColHeading>
              {col.links.map((link) => (
                <FooterLink key={link.label} label={link.label} onPress={link.onPress} />
              ))}
            </View>
          ))}

          <View style={[styles.col, colStyle]}>
            <ColHeading>Contact Us</ColHeading>
            <ContactItem icon="location-outline">{RESTAURANT.address}</ContactItem>
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${RESTAURANT.phone}`)}>
              <ContactItem icon="call-outline">{RESTAURANT.phone}</ContactItem>
            </TouchableOpacity>
          </View>

          <View style={[styles.col, colStyle]}>
            <ColHeading>Food Hygiene Rating</ColHeading>
            <View style={styles.badgeWrap}>
              <HygieneBadge onPress={() => open("https://ratings.food.gov.uk")} />
              <TouchableOpacity onPress={() => open("https://ratings.food.gov.uk")} accessibilityRole="link">
                <Text style={styles.badgeCaption}>View our Food Hygiene Rating</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom bar: copyright | app download | cards */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomInner}>
          <View style={styles.appDownload}>
            <Text style={styles.appSubtitle}>Download our App</Text>
            <View style={styles.appBadges}>
              <TouchableOpacity onPress={() => open("https://apps.apple.com")} accessibilityRole="link">
                <Image source={require("../../assets/images/appstore.png")} style={{ width: 135, height: 40 }} resizeMode="contain" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => open("https://play.google.com")} accessibilityRole="link">
                <Image source={require("../../assets/images/playstore.png")} style={{ width: 135, height: 40 }} resizeMode="contain" />
              </TouchableOpacity>
            </View>
          </View>
          
          <Image source={require("../../assets/images/cards.svg")} style={{ width: 183, height: 25 }} resizeMode="contain" />

          <Text style={styles.bottomText}>{`© 2026 ${RESTAURANT.name}. All Rights Reserved.`}</Text>

        </View>
      </View>

      <Modal
        visible={languageMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setLanguageMenuOpen(false)}
      >
        <Pressable style={styles.languageMenuBackdrop} onPress={() => setLanguageMenuOpen(false)}>
          <Pressable style={styles.languageMenu} onPress={(e) => e.stopPropagation()}>
            {LANGUAGES.map((language, index) => {
              const isSelected = index === languageIndex;
              return (
                <TouchableOpacity
                  key={language.code}
                  style={[styles.languageRow, isSelected && styles.languageRowSelected]}
                  onPress={() => {
                    setLanguageIndex(index);
                    setLanguageMenuOpen(false);
                  }}
                >
                  <Text style={styles.languageRowLabel}>{language.label}</Text>
                  <Text style={styles.languageRowSubtitle}>{language.subtitle}</Text>
                </TouchableOpacity>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles: {
  footer: ViewStyle;
  inner: ViewStyle;
  topRow: ViewStyle;
  languageSelector: ViewStyle;
  languageText: TextStyle;
  languageMenuBackdrop: ViewStyle;
  languageMenu: ViewStyle;
  languageRow: ViewStyle;
  languageRowSelected: ViewStyle;
  languageRowLabel: TextStyle;
  languageRowSubtitle: TextStyle;
  divider: ViewStyle;
  columns: ViewStyle;
  columnsWrap: ViewStyle;
  col: ViewStyle;
  colHeadingWrap: ViewStyle;
  colHeading: TextStyle;
  colHeadingUnderline: ViewStyle;
  linkRow: ViewStyle;
  linkRowHovered: ViewStyle;
  linkText: TextStyle;
  linkTextHovered: TextStyle;
  contactItem: ViewStyle;
  contactIcon: TextStyle;
  contactText: TextStyle;
  badgeWrap: ViewStyle;
  hygieneBadge: ViewStyle;
  badgeCaption: TextStyle;
  bottomBar: ViewStyle;
  bottomInner: ViewStyle;
  bottomText: TextStyle;
  appDownload: ViewStyle;
  appSubtitle: TextStyle;
  appBadges: ViewStyle;
} = StyleSheet.create({
  footer: {
    backgroundColor: COLORS.bg,
  },
  inner: {
    maxWidth: 1320,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 0,
  },
  topRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
    gap: 24,
  },
  languageSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  languageText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.black,
  },
  languageMenuBackdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 24,
  },
  languageMenu: {
    width: "100%",
    maxWidth: 420,
    maxHeight: "80%",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  languageRow: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    gap: 2,
  },
  languageRowSelected: {
    backgroundColor: "rgba(0,0,0,0.04)",
  },
  languageRowLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
  },
  languageRowSubtitle: {
    fontSize: 13,
    color: COLORS.mutedText,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginBottom: 40,
  },
  columns: {
    flexDirection: "row",
    gap: 24,
    paddingBottom: 16,
  },
  columnsWrap: {
    flexWrap: "wrap",
  },
  col: {
    marginBottom: 16,
  },
  colHeadingWrap: {
    marginBottom: 18,
  },
  colHeading: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: COLORS.black,
    marginBottom: 8,
  },
  colHeadingUnderline: {
    width: 32,
    height: 2,
    backgroundColor: COLORS.red,
  },
  linkRow: {
    marginBottom: 10,
  },
  linkRowHovered: {
    paddingLeft: 6,
  },
  linkText: {
    fontSize: 14,
    color: COLORS.bodyText,
  },
  linkTextHovered: {
    color: COLORS.red,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
    gap: 10,
  },
  contactIcon: {
    // Centers the 16px icon against the first line of contactText (14px
    // font, 22px line-height): (22 - 16) / 2 = 3.
    marginTop: 3,
  },
  contactText: {
    fontSize: 14,
    color: COLORS.bodyText,
    lineHeight: 22,
    flexShrink: 1,
  },
  badgeWrap: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 8,
  },
  hygieneBadge: {
    alignSelf: "flex-start",
  },
  badgeCaption: {
    fontSize: 11,
    color: COLORS.red,
    marginTop: 4,
    letterSpacing: 0.2,
  },
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  bottomInner: {
    maxWidth: 1320,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 32,
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 24,
  },
  bottomText: {
    fontSize: 13,
    color: COLORS.mutedText,
  },
  appDownload: {
    alignItems: "flex-start",
    gap: 6,
  },
  appSubtitle: {
    fontSize: 13,
    color: COLORS.bodyText,
  },
  appBadges: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "center",
  },
});
