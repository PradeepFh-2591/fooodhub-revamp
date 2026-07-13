import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { ChangeEvent, useMemo, useRef, useState } from "react";
import { Modal, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { COLORS, RADIUS } from "../constants/theme";
import { getTimeSlotsForDate, isSameDay, parseTimeToMinutes } from "../lib/restaurantHours";

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

const pad = (n: number) => String(n).padStart(2, "0");
const toDateInputValue = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export default function ScheduleModal({ visible, initialDate, initialSlot, onClose, onConfirm }: ScheduleModalProps) {
  const [date, setDate] = useState(initialDate);
  const [slot, setSlot] = useState<string | null>(initialSlot);
  const [wasVisible, setWasVisible] = useState(visible);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

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
  };

  const handleWebDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const [year, month, day] = e.target.value.split("-").map(Number);
    if (!year || !month || !day) return;
    const next = new Date(date);
    next.setFullYear(year, month - 1, day);
    changeDate(next);
  };

  const openDatePicker = () => {
    if (Platform.OS === "web") {
      dateInputRef.current?.showPicker?.();
    } else {
      setShowDatePicker(true);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/55 px-lg">
        <View
          className="w-full max-w-[480px]"
          style={{ maxHeight: "85%", overflow: "hidden", borderRadius: RADIUS.lg, backgroundColor: COLORS.white }}
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
              onPress={openDatePicker}
              className="relative mt-lg flex-row items-center justify-between rounded-md border border-primary bg-primary/5 px-md py-sm"
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
              <Ionicons name="chevron-down" size={18} color={COLORS.primary} />

              {Platform.OS === "web" && (
                <input
                  ref={dateInputRef}
                  type="date"
                  value={toDateInputValue(date)}
                  min={toDateInputValue(startOfToday())}
                  onChange={handleWebDateChange}
                  style={{ position: "absolute", width: 0, height: 0, opacity: 0, border: "none", pointerEvents: "none" }}
                />
              )}
            </TouchableOpacity>
            {Platform.OS !== "web" && showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                minimumDate={startOfToday()}
                onChange={(_event: DateTimePickerEvent, picked?: Date) => {
                  setShowDatePicker(false);
                  if (picked) changeDate(picked);
                }}
              />
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
        </View>
      </View>
    </Modal>
  );
}
