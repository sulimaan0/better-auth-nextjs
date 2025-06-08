"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarIcon, Check } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateTimeStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function DateTimeStep({ formData, setFormData }: DateTimeStepProps) {
  const timeSlots = [
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Select Date & Time
        </h2>
        <p className="text-gray-600">
          Choose when you'd like your cleaning service
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Label className="text-base font-medium">Select Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-12 transition-all duration-200",
                  !formData.date && "text-muted-foreground",
                  formData.date &&
                    "shadow-lg border-green-500 bg-green-50 ring-2 ring-green-200"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                {formData.date && (
                  <Check className="ml-auto h-4 w-4 text-green-600" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={(date) => setFormData({ ...formData, date })}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium">Select Time</Label>
          <RadioGroup
            value={formData.time}
            onValueChange={(value) => setFormData({ ...formData, time: value })}
            className="grid grid-cols-2 gap-2"
          >
            {timeSlots.map((time) => {
              const isSelected = formData.time === time;

              return (
                <div key={time}>
                  <RadioGroupItem
                    value={time}
                    id={time}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={time}
                    className={cn(
                      "flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 text-sm relative",
                      isSelected
                        ? "border-green-500 bg-green-50 shadow-lg scale-105 ring-2 ring-green-200"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-md",
                      "active:scale-95"
                    )}
                  >
                    {time}
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-green-600 rounded-full">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>
      </div>

      {/* Debug info - remove in production */}
      <div className="mt-4 p-3 bg-gray-100 rounded-lg text-sm text-gray-600">
        <strong>Debug:</strong> Date:{" "}
        {formData.date ? format(formData.date, "PPP") : "None"}, Time:{" "}
        {formData.time || "None"}
      </div>
    </div>
  );
}
