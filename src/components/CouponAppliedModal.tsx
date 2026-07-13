import { Ionicons } from "@expo/vector-icons";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/theme";

type CouponAppliedModalProps = {
  visible: boolean;
  code: string;
  discount: number;
  onClose: () => void;
};

export default function CouponAppliedModal({ visible, code, discount, onClose }: CouponAppliedModalProps) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/55 px-lg">
        <View className="w-full max-w-[380px] items-center gap-md rounded-lg bg-white p-lg">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-success/15">
            <Ionicons name="checkmark-circle" size={32} color={COLORS.success} />
          </View>
          <Text className="text-h3 md:text-h3-lg font-extrabold text-text-dark">Coupon Activated!</Text>
          <Text className="text-center text-body md:text-body-lg text-text-gray">
            &ldquo;{code}&rdquo; has been applied &mdash; you&apos;re saving £{discount.toFixed(2)} on this order.
          </Text>
          <TouchableOpacity className="w-full items-center rounded-pill bg-primary py-sm" onPress={onClose}>
            <Text className="text-body md:text-body-lg font-extrabold text-white">Great!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
