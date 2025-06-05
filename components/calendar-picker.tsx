"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarPickerProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export default function CalendarPicker({
  selectedDate,
  onDateSelect,
}: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  const selected = selectedDate ? new Date(selectedDate) : null;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateSelected = (date: Date) => {
    if (!selected) return false;
    return date.toDateString() === selected.toDateString();
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;
    onDateSelect(date.toISOString().split("T")[0]);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="glass p-6 rounded-2xl border border-slate-600/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <CalendarIcon className="w-5 h-5 text-violet-400" />
          <span>Select Date</span>
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth("prev")}
            className="text-slate-300 hover:text-white hover:bg-slate-700/50 p-2"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-white font-medium min-w-[140px] text-center">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth("next")}
            className="text-slate-300 hover:text-white hover:bg-slate-700/50 p-2"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-slate-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          if (!date) {
            return <div key={index} className="h-10" />;
          }

          const disabled = isDateDisabled(date);
          const selected = isDateSelected(date);
          const todayDate = isToday(date);

          return (
            <button
              key={date.toISOString()}
              onClick={() => handleDateClick(date)}
              disabled={disabled}
              className={`
                h-10 w-10 rounded-lg text-sm font-medium transition-all duration-200 relative
                ${
                  disabled
                    ? "text-slate-600 cursor-not-allowed"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50 cursor-pointer"
                }
                ${
                  selected
                    ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg"
                    : ""
                }
                ${
                  todayDate && !selected
                    ? "bg-slate-700/50 text-violet-400 font-semibold"
                    : ""
                }
              `}
            >
              {date.getDate()}
              {todayDate && !selected && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-violet-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Quick select buttons */}
      <div className="mt-6 pt-4 border-t border-slate-600/30">
        <p className="text-sm text-slate-400 mb-3">Quick select:</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Today", days: 0 },
            { label: "Tomorrow", days: 1 },
            { label: "This Weekend", days: 6 - today.getDay() },
            { label: "Next Week", days: 7 },
          ].map(({ label, days }) => {
            const quickDate = new Date(today);
            quickDate.setDate(today.getDate() + days);

            return (
              <Button
                key={label}
                variant="outline"
                size="sm"
                onClick={() => handleDateClick(quickDate)}
                className="text-slate-300 border-slate-600 hover:border-violet-500 hover:text-violet-400 hover:bg-violet-500/10"
              >
                {label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
