import { Ionicons } from "@expo/vector-icons";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/theme";

type OrderPlacedModalProps = {
  visible: boolean;
  restaurantName: string;
  onClose: () => void;
};

export default function OrderPlacedModal({ visible, restaurantName, onClose }: OrderPlacedModalProps) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/55 px-lg">
        <View className="w-full max-w-[380px] items-center gap-md rounded-lg bg-white p-lg">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-success/15">
            <Ionicons name="checkmark-circle" size={32} color={COLORS.success} />
          </View>
          <Text className="text-h3 md:text-h3-lg font-extrabold text-text-dark">Your order has been placed!</Text>
          <Text className="text-center text-body md:text-body-lg text-text-gray">
            Thank you for ordering from {restaurantName}.
          </Text>
          <TouchableOpacity className="w-full items-center rounded-pill bg-primary py-sm" onPress={onClose}>
            <Text className="text-body md:text-body-lg font-extrabold text-white">Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
