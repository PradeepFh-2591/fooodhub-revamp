import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/theme";

type DatePickerProps = {
  value: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
};

const WEEKDAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function startOfDay(d: Date) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

// Monday-first grid for the given month, padded with blanks so every row has
// exactly 7 cells (leading blanks before day 1, trailing blanks after the
// last day).
function getMonthGrid(year: number, month: number) {
  const firstOfMonth = new Date(year, month, 1);
  const leadingBlanks = (firstOfMonth.getDay() + 6) % 7; // getDay(): 0=Sun..6=Sat -> Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < leadingBlanks; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(new Date(year, month, day));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

// A fully custom calendar grid — no native/browser date picker involved, so
// selected/today states are styled with the app's own theme classes
// (bg-primary, text-primary, etc.) and re-theme automatically with the rest
// of the app when the brand color changes in constants/colors.js.
export default function DatePicker({ value, onChange, minDate }: DatePickerProps) {
  const [viewYear, setViewYear] = useState(value.getFullYear());
  const [viewMonth, setViewMonth] = useState(value.getMonth());

  const today = startOfDay(new Date());
  const min = minDate ? startOfDay(minDate) : null;
  const cells = getMonthGrid(viewYear, viewMonth);
  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const prevMonthLastDay = new Date(viewYear, viewMonth, 0);
  const canGoPrev = !min || prevMonthLastDay >= min;

  const goToPrevMonth = () => {
    if (!canGoPrev) return;
    const next = new Date(viewYear, viewMonth - 1, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };
  const goToNextMonth = () => {
    const next = new Date(viewYear, viewMonth + 1, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  return (
    <View className="rounded-md border border-chip-border bg-white p-md">
      <View className="flex-row items-center justify-between pb-sm">
        <TouchableOpacity
          onPress={goToPrevMonth}
          disabled={!canGoPrev}
          className="h-8 w-8 items-center justify-center rounded-full"
          style={!canGoPrev ? { opacity: 0.3 } : undefined}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={18} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text className="text-body md:text-body-lg font-extrabold text-text-dark">{monthLabel}</Text>
        <TouchableOpacity
          onPress={goToNextMonth}
          className="h-8 w-8 items-center justify-center rounded-full"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-forward" size={18} color={COLORS.textDark} />
        </TouchableOpacity>
      </View>

      <View className="flex-row">
        {WEEKDAY_LABELS.map((label) => (
          <View key={label} className="w-[14.28%] items-center py-xs">
            <Text className="text-tiny font-bold text-text-gray">{label}</Text>
          </View>
        ))}
      </View>

      <View className="flex-row flex-wrap">
        {cells.map((cell, index) => {
          if (!cell) return <View key={index} className="h-9 w-[14.28%]" />;
          const isSelected = isSameDay(cell, value);
          const isToday = isSameDay(cell, today);
          const isDisabled = min !== null && cell < min;
          return (
            <View key={index} className="w-[14.28%] items-center py-[2px]">
              <TouchableOpacity
                onPress={() => !isDisabled && onChange(cell as Date)}
                disabled={isDisabled}
                className={`h-9 w-9 items-center justify-center rounded-full ${
                  isSelected ? "bg-primary" : isToday ? "border border-primary" : ""
                }`}
              >
                <Text
                  className={`text-small font-semibold ${
                    isSelected
                      ? "text-white"
                      : isDisabled
                        ? "text-text-light-gray"
                        : isToday
                          ? "text-primary"
                          : "text-text-dark"
                  }`}
                >
                  {cell.getDate()}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
}
