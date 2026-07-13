import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/theme";

type PromptModalProps = {
  visible: boolean;
  title: string;
  placeholder?: string;
  initialValue?: string;
  confirmLabel?: string;
  multiline?: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (value: string) => void;
};

export default function PromptModal({
  visible,
  title,
  placeholder,
  initialValue = "",
  confirmLabel = "Save",
  multiline = false,
  error,
  onClose,
  onSubmit,
}: PromptModalProps) {
  const [value, setValue] = useState(initialValue);
  const [wasVisible, setWasVisible] = useState(visible);

  // Reset the field to the latest initialValue each time the modal opens —
  // adjusted during render (React's recommended alternative to an effect)
  // since this component stays mounted while the Modal's own `visible` toggles.
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) setValue(initialValue);
  }

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/55 px-lg">
        <View className="w-full max-w-[420px] gap-md rounded-lg bg-white p-lg">
          <View className="flex-row items-center justify-between">
            <Text className="text-h3 md:text-h3-lg font-extrabold text-text-dark">{title}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={20} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>

          <TextInput
            autoFocus
            value={value}
            onChangeText={setValue}
            placeholder={placeholder}
            placeholderTextColor={COLORS.textGray}
            multiline={multiline}
            className={`rounded-sm border border-chip-border px-md py-sm text-body md:text-body-lg text-text-dark outline-none ${
              multiline ? "h-24" : ""
            }`}
          />
          {!!error && <Text className="text-small md:text-small-lg text-primary">{error}</Text>}

          <TouchableOpacity
            className="items-center rounded-pill bg-primary py-sm"
            onPress={() => onSubmit(value.trim())}
          >
            <Text className="text-body md:text-body-lg font-extrabold text-white">{confirmLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
