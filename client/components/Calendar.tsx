import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCalendarAvailability } from "@/utils/api";

interface CalendarProps {
  selectedDate: string | null;
  onDateChange: (date: string | null) => void;
}

interface CalendarDay {
  day: number;
  available: boolean;
  boatsCount: number;
  isPast: boolean;
}

export default function Calendar({
  selectedDate,
  onDateChange,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: calendarData } = useQuery({
    queryKey: [
      "calendar-availability",
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
    ],
    queryFn: () =>
      fetchCalendarAvailability(
        currentMonth.getMonth() + 1,
        currentMonth.getFullYear()
      ),
    staleTime: 5 * 60 * 1000,
  });

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const formatLocalDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);

  const availabilityDays = calendarData?.data?.days || [];

  const calendarDays: (CalendarDay | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const calendarDay = availabilityDays.find((d: any) => d.day === day);

    const fullDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    fullDate.setHours(0, 0, 0, 0);

    const isPast = fullDate < today;

    calendarDays.push({
      day,
      available: calendarDay?.available ?? false,
      boatsCount: calendarDay?.boatsCount ?? 0,
      isPast,
    });
  }

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handleDateSelect = (day: number) => {
    const selected = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    const dateString = formatLocalDate(selected);

    onDateChange(selectedDate === dateString ? null : dateString);
  };

  const getSelectedDayOfMonth = () => {
    if (!selectedDate) return null;

    const [year, month, day] = selectedDate.split("-").map(Number);

    if (
      year === currentMonth.getFullYear() &&
      month === currentMonth.getMonth() + 1
    ) {
      return day;
    }

    return null;
  };

  const selectedDayOfMonth = getSelectedDayOfMonth();

  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-md p-5 border-b border-gray-500/25">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gray-900 font-semibold text-base">{monthName}</h3>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-3 h-3 text-gray-900" />
          </button>

          <button
            onClick={handleNextMonth}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-3 h-3 text-gray-900" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center pb-2">
            <span className="text-gray-500 text-xs font-semibold">{day}</span>
          </div>
        ))}

        {calendarDays.map((dayData, index) => (
          <div
            key={index}
            className="aspect-square flex items-center justify-center"
          >
            {dayData ? (
              <button
                onClick={() => handleDateSelect(dayData.day)}
                disabled={!dayData.available || dayData.isPast}
                className={`
                  w-8 h-8 rounded-md flex items-center justify-center text-sm
                  ${
                    selectedDayOfMonth === dayData.day && selectedDate
                      ? "bg-blue-primary text-white font-semibold"
                      : dayData.available && !dayData.isPast
                      ? "bg-green-badge text-white hover:opacity-80"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }
                  transition-colors
                `}
                title={
                  dayData.isPast
                    ? "Past date"
                    : dayData.available
                    ? `${dayData.boatsCount} boat(s) available`
                    : "Not available"
                }
              >
                {dayData.day}
              </button>
            ) : null}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-500/25">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-badge rounded-sm"></div>
          <span className="text-xs text-gray-900">Available</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-300 rounded-sm"></div>
          <span className="text-xs text-gray-900">Unavailable / Past</span>
        </div>
      </div>
    </div>
  );
}