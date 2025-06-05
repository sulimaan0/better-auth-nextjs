"use client";

import { useState } from "react";
import { Clock, Sun, Sunset } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimePickerProps {
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  selectedDate?: string;
}

export default function TimePicker({
  selectedTime,
  onTimeSelect,
  selectedDate,
}: TimePickerProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<
    "morning" | "afternoon" | "evening" | "all"
  >("all");

  const timeSlots = [
    { time: "8:00 AM", period: "morning", available: true },
    { time: "9:00 AM", period: "morning", available: true },
    { time: "10:00 AM", period: "morning", available: true },
    { time: "11:00 AM", period: "morning", available: false },
    { time: "12:00 PM", period: "afternoon", available: true },
    { time: "1:00 PM", period: "afternoon", available: true },
    { time: "2:00 PM", period: "afternoon", available: true },
    { time: "3:00 PM", period: "afternoon", available: true },
    { time: "4:00 PM", period: "afternoon", available: false },
    { time: "5:00 PM", period: "evening", available: true },
    { time: "6:00 PM", period: "evening", available: true },
    { time: "7:00 PM", period: "evening", available: true },
  ];

  const periods = [
    { id: "all", label: "All Day", icon: Clock, color: "text-slate-400" },
    { id: "morning", label: "Morning", icon: Sun, color: "text-amber-400" },
    {
      id: "afternoon",
      label: "Afternoon",
      icon: Sun,
      color: "text-orange-400",
    },
    { id: "evening", label: "Evening", icon: Sunset, color: "text-purple-400" },
  ];

  const filteredTimeSlots =
    selectedPeriod === "all"
      ? timeSlots
      : timeSlots.filter((slot) => slot.period === selectedPeriod);

  const getDateLabel = () => {
    if (!selectedDate) return "Select a time";
    const date = new Date(selectedDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-GB", {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className="glass p-6 rounded-2xl border border-slate-600/30">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2 mb-2">
          <Clock className="w-5 h-5 text-violet-400" />
          <span>Choose Time</span>
        </h3>
        {selectedDate && (
          <p className="text-slate-300 text-sm">
            Available times for{" "}
            <span className="font-medium text-violet-400">
              {getDateLabel()}
            </span>
          </p>
        )}
      </div>

      {/* Period filters */}
      <div className="mb-6">
        <p className="text-sm text-slate-400 mb-3">Filter by time of day:</p>
        <div className="flex flex-wrap gap-2">
          {periods.map((period) => {
            const Icon = period.icon;
            return (
              <Button
                key={period.id}
                variant={selectedPeriod === period.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period.id as any)}
                className={`
                  flex items-center space-x-2 transition-all duration-200
                  ${
                    selectedPeriod === period.id
                      ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white border-transparent"
                      : "text-slate-300 border-slate-600 hover:border-violet-500 hover:text-violet-400 hover:bg-violet-500/10"
                  }
                `}
              >
                <Icon
                  className={`w-4 h-4 ${
                    selectedPeriod === period.id ? "text-white" : period.color
                  }`}
                />
                <span>{period.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Time slots grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {filteredTimeSlots.map((slot) => (
          <button
            key={slot.time}
            onClick={() => slot.available && onTimeSelect(slot.time)}
            disabled={!slot.available}
            className={`
              p-4 rounded-xl transition-all duration-200 text-center relative
              ${
                !slot.available
                  ? "bg-slate-800/50 text-slate-600 cursor-not-allowed border border-slate-700"
                  : selectedTime === slot.time
                  ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg border border-violet-500"
                  : "bg-slate-700/30 text-slate-300 hover:text-white hover:bg-slate-700/50 border border-slate-600 hover:border-violet-500"
              }
            `}
          >
            <div className="font-medium text-lg">{slot.time}</div>
            {!slot.available && (
              <div className="text-xs text-slate-500 mt-1">Unavailable</div>
            )}
            {slot.available && selectedTime !== slot.time && (
              <div className="text-xs text-slate-400 mt-1">Available</div>
            )}
            {selectedTime === slot.time && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
            )}
          </button>
        ))}
      </div>

      {/* Popular times */}
      <div className="mt-6 pt-4 border-t border-slate-600/30">
        <p className="text-sm text-slate-400 mb-3">
          <span className="inline-flex items-center space-x-1">
            <span>🔥</span>
            <span>Popular times:</span>
          </span>
        </p>
        <div className="flex flex-wrap gap-2">
          {["10:00 AM", "2:00 PM", "6:00 PM"].map((time) => {
            const slot = timeSlots.find((s) => s.time === time);
            return (
              <Button
                key={time}
                variant="outline"
                size="sm"
                onClick={() => slot?.available && onTimeSelect(time)}
                disabled={!slot?.available}
                className="text-slate-300 border-slate-600 hover:border-violet-500 hover:text-violet-400 hover:bg-violet-500/10 disabled:opacity-50"
              >
                {time}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Time zone info */}
      <div className="mt-4 text-xs text-slate-500 text-center">
        All times shown in GMT (London time)
      </div>
    </div>
  );
}
