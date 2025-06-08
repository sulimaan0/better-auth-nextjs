import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface BookingProgressProps {
  currentStep: number;
  steps: {
    id: number;
    title: string;
    icon: React.ElementType;
  }[];
}

export function BookingProgress({ currentStep, steps }: BookingProgressProps) {
  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Book Your Cleaning</h1>
        <Badge variant="outline" className="text-green-600 border-green-600">
          Step {currentStep} of {steps.length}
        </Badge>
      </div>
      <Progress value={progress} className="h-2 mb-6" />

      {/* Step Indicators */}
      <div className="flex justify-between">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className={cn(
                "flex flex-col items-center space-y-2",
                step.id <= currentStep ? "text-green-600" : "text-gray-400"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2",
                  step.id <= currentStep
                    ? "bg-green-600 border-green-600 text-white"
                    : "border-gray-300"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">{step.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
