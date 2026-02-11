import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCalendarAvailability } from "@/utils/api";

interface CalendarProps {
  selectedDate: string | null;
  onDateChange: (date: string | null) => void;
}

export default function Calendar({ selectedDate, onDateChange }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Fetch calendar availability
  const { data: calendarData } = useQuery({
    queryKey: ['calendar-availability', currentMonth.getFullYear(), currentMonth.getMonth() + 1],
    queryFn: () => fetchCalendarAvailability(
      currentMonth.getMonth() + 1,
      currentMonth.getFullYear()
    ),
    staleTime: 5 * 60 * 1000,
  });

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get calendar days for current month
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);

  // Create calendar grid with empty cells for days before month starts
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const calendarDay = calendarData?.days?.find(d => d.day === day);
    calendarDays.push({
      day,
      available: calendarDay?.available ?? false,
      boatsCount: calendarDay?.boatsCount ?? 0,
    });
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateSelect = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateString = selected.toISOString().split('T')[0];
    onDateChange(selectedDate === dateString ? null : dateString);
  };

  const getSelectedDayOfMonth = () => {
    if (!selectedDate) return null;
    const date = new Date(selectedDate);
    return date.getDate();
  };

  const selectedDayOfMonth = getSelectedDayOfMonth();

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

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
            <span className="text-gray-500 text-xs font-semibold font-inter">
              {day}
            </span>
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
                disabled={!dayData.available}
                className={`
                  w-8 h-8 rounded-md flex items-center justify-center text-sm
                  ${
                    selectedDayOfMonth === dayData.day && selectedDate
                      ? "bg-blue-primary text-white font-semibold"
                      : dayData.available
                        ? "bg-green-badge text-white font-normal hover:opacity-80"
                        : "text-gray-400 cursor-not-allowed"
                  }
                  transition-colors
                `}
                title={dayData.available ? `${dayData.boatsCount} boat(s) available` : 'Not available'}
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
          <span className="text-xs text-gray-900">Unavailable</span>
        </div>
      </div>
    </div>
  );
}
