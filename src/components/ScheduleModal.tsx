import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { COLORS, RADIUS } from "../constants/theme";
import { getTimeSlotsForDate, isSameDay, parseTimeToMinutes } from "../lib/restaurantHours";
import DatePicker from "./DatePicker";

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

type ScheduleModalProps = {
  visible: boolean;
  initialDate: Date;
  initialSlot: string | null;
  onClose: () => void;
  onConfirm: (date: Date, slot: string) => void;
};

function formatShortDate(date: Date) {
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

export default function ScheduleModal({ visible, initialDate, initialSlot, onClose, onConfirm }: ScheduleModalProps) {
  const [date, setDate] = useState(initialDate);
  const [slot, setSlot] = useState<string | null>(initialSlot);
  const [wasVisible, setWasVisible] = useState(visible);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Reset the draft selection to the latest confirmed values each time the
  // modal opens — adjusted during render since this component stays mounted
  // while the Modal's own `visible` toggles.
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) {
      setDate(initialDate);
      setSlot(initialSlot);
    }
  }

  const timeSlots = useMemo(() => getTimeSlotsForDate(date), [date]);

  const now = new Date();
  const isToday = isSameDay(date, now);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const changeDate = (next: Date) => {
    if (next < startOfToday()) return;
    setDate(next);
    setSlot(null); // the previous slot may not exist in the new day's hours
    setShowDatePicker(false);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 items-center justify-center bg-black/55 px-lg" onPress={onClose}>
        <Pressable
          className="w-full max-w-[480px]"
          style={{ maxHeight: "85%", overflow: "hidden", borderRadius: RADIUS.lg, backgroundColor: COLORS.white }}
          onPress={(e) => e.stopPropagation()}
        >
          <View className="flex-row items-center justify-between border-b border-border-light px-lg py-lg">
            <Text className="flex-1 pr-md text-h3 md:text-h3-lg font-extrabold text-text-dark">
              When would you like to have your order?
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="h-9 w-9 items-center justify-center rounded-full border border-primary/30"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerClassName="px-lg pb-lg" showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              onPress={() => setShowDatePicker((prev) => !prev)}
              className="mt-lg flex-row items-center justify-between rounded-md border border-primary bg-primary/5 px-md py-sm"
            >
              <View className="flex-row items-center gap-sm">
                <View className="h-9 w-9 items-center justify-center rounded-full bg-primary/15">
                  <Ionicons name="calendar" size={16} color={COLORS.primary} />
                </View>
                <View>
                  <Text className="text-tiny md:text-tiny-lg text-text-dark">Choose From</Text>
                  <Text className="text-h3 md:text-h3-lg font-extrabold text-primary">{formatShortDate(date)}</Text>
                </View>
              </View>
              <Ionicons name={showDatePicker ? "chevron-up" : "chevron-down"} size={18} color={COLORS.primary} />
            </TouchableOpacity>
            {showDatePicker && (
              <View className="mt-sm">
                <DatePicker value={date} onChange={changeDate} minDate={startOfToday()} />
              </View>
            )}

            <View className="mt-lg flex-row items-center gap-sm">
              <View className="h-px flex-1 bg-border-light" />
              <Text className="text-tiny md:text-tiny-lg font-bold tracking-wide text-primary">
                SELECT A TIME SLOT
              </Text>
              <View className="h-px flex-1 bg-border-light" />
            </View>

            {timeSlots.length === 0 ? (
              <View className="mt-md items-center gap-xs rounded-md border border-border-light py-lg">
                <Ionicons name="close-circle-outline" size={22} color={COLORS.textGray} />
                <Text className="text-small md:text-small-lg text-text-gray">Closed on this day</Text>
              </View>
            ) : (
            <View className="mt-md flex-row flex-wrap gap-sm">
              {timeSlots.map((option) => {
                const isSelected = option === slot;
                const isPast = isToday && parseTimeToMinutes(option) < nowMinutes;
                return (
                  <TouchableOpacity
                    key={option}
                    onPress={() => setSlot(option)}
                    disabled={isPast}
                    className="min-w-[47%] flex-1 flex-row items-center gap-sm rounded-md border px-md py-sm"
                    style={[
                      isSelected
                        ? { borderColor: COLORS.primary, backgroundColor: `${COLORS.primary}0D` }
                        : { borderColor: COLORS.chipBorder },
                      isPast && { opacity: 0.4 },
                    ]}
                  >
                    <View
                      className="h-[18px] w-[18px] items-center justify-center rounded-full border-[1.5px]"
                      style={{ borderColor: isSelected ? COLORS.primary : COLORS.chipBorder }}
                    >
                      {isSelected && <View className="h-2 w-2 rounded-full bg-primary" />}
                    </View>
                    <Text
                      className={`text-body md:text-body-lg font-semibold ${
                        isSelected ? "text-primary" : isPast ? "text-text-gray" : "text-text-dark"
                      }`}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            )}

            <View className="mt-lg flex-row items-center gap-md rounded-md bg-primary/5 p-md">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                <Ionicons name="time-outline" size={20} color={COLORS.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-body md:text-body-lg font-extrabold text-text-dark">We&apos;ll do our best!</Text>
                <Text className="text-small md:text-small-lg text-text-gray">
                  Your order will be ready as close as possible to the selected time.
                </Text>
              </View>
            </View>
          </ScrollView>

          <View className="border-t border-border-light px-lg py-lg">
            <TouchableOpacity
              onPress={() => slot && onConfirm(date, slot)}
              disabled={!slot}
              className="flex-row items-center justify-center gap-sm rounded-pill bg-primary py-3.5"
              style={!slot ? { opacity: 0.5 } : undefined}
            >
              <Text className="text-body md:text-body-lg font-extrabold tracking-wide text-white">CONFIRM TIME</Text>
              <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
