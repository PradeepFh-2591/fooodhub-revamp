import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/theme";

type SignInModalProps = {
  visible: boolean;
  onClose: () => void;
};

const PROVIDERS: {
  key: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  iconColor: string;
  dark?: boolean;
}[] = [
  { key: "apple", icon: "logo-apple", label: "Sign in with Apple", iconColor: COLORS.white, dark: true },
  { key: "google", icon: "logo-google", label: "Sign in with Google", iconColor: "#EA4335" },
  { key: "facebook", icon: "logo-facebook", label: "Sign in with Facebook", iconColor: "#1877F2" },
  { key: "microsoft", icon: "logo-microsoft", label: "Sign in with Microsoft", iconColor: "#00A4EF" },
];

export default function SignInModal({ visible, onClose }: SignInModalProps) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 items-center justify-center bg-black/55 px-lg" onPress={onClose}>
        <Pressable className="w-full max-w-[420px] gap-lg rounded-lg bg-white p-lg" onPress={(e) => e.stopPropagation()}>
          <View className="flex-row items-center justify-between">
            <Text className="text-h3 md:text-h3-lg font-extrabold text-text-dark">Sign in to continue</Text>
            <TouchableOpacity
              onPress={onClose}
              className="h-9 w-9 items-center justify-center rounded-full bg-border-light"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={18} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>

          <View className="gap-sm">
            {PROVIDERS.map((provider) => (
              <TouchableOpacity
                key={provider.key}
                onPress={onClose}
                className={`flex-row items-center gap-sm rounded-sm border px-md py-sm ${
                  provider.dark ? "border-brand-black bg-brand-black" : "border-chip-border bg-white"
                }`}
              >
                <Ionicons name={provider.icon} size={20} color={provider.iconColor} />
                <Text
                  className={`text-body md:text-body-lg font-semibold ${
                    provider.dark ? "text-white" : "text-text-dark"
                  }`}
                >
                  {provider.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="rounded-sm bg-primary/5 p-md">
            <Text className="text-tiny md:text-tiny-lg leading-4 text-text-gray">
              Sign in to track orders, store payment info, customize delivery, access promotions, and receive
              updates. Your info stays secure with Google/Facebook/Apple/Microsoft login.
            </Text>
          </View>

          <View className="flex-row items-center justify-center gap-1">
            <Text className="text-small md:text-small-lg text-text-gray">Have an account?</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-small md:text-small-lg font-bold text-primary">Sign in</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
