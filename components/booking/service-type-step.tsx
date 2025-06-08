"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ServiceTypeStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function ServiceTypeStep({
  formData,
  setFormData,
}: ServiceTypeStepProps) {
  const services = [
    {
      id: "regular",
      name: "Regular Cleaning",
      description: "Weekly, bi-weekly, or monthly cleaning",
      price: "From £15/hour",
      popular: false,
    },
    {
      id: "deep",
      name: "Deep Cleaning",
      description: "Comprehensive one-time deep clean",
      price: "From £25/hour",
      popular: true,
    },
    {
      id: "tenancy",
      name: "End of Tenancy",
      description: "Move-in/move-out cleaning",
      price: "From £200",
      popular: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Choose Your Service
        </h2>
        <p className="text-gray-600">
          Select the type of cleaning service you need
        </p>
      </div>

      <RadioGroup
        value={formData.serviceType}
        onValueChange={(value) =>
          setFormData({ ...formData, serviceType: value })
        }
        className="space-y-4"
      >
        {services.map((service) => {
          const isSelected = formData.serviceType === service.id;

          return (
            <div key={service.id} className="relative">
              <RadioGroupItem
                value={service.id}
                id={service.id}
                className="peer sr-only"
              />
              <Label
                htmlFor={service.id}
                className={cn(
                  "flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 relative",
                  isSelected
                    ? "border-green-500 bg-green-50 shadow-lg scale-[1.02] ring-2 ring-green-200"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-md",
                  "active:scale-[0.98] active:bg-gray-50"
                )}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className={cn(
                        "font-medium",
                        isSelected ? "text-green-900" : "text-gray-900"
                      )}
                    >
                      {service.name}
                    </h3>
                    {service.popular && (
                      <Badge className="bg-green-600 hover:bg-green-700">
                        Popular
                      </Badge>
                    )}
                    {isSelected && (
                      <div className="ml-auto flex items-center justify-center w-6 h-6 bg-green-600 rounded-full">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-sm",
                      isSelected ? "text-green-700" : "text-gray-600"
                    )}
                  >
                    {service.description}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p
                    className={cn(
                      "font-semibold",
                      isSelected ? "text-green-700" : "text-green-600"
                    )}
                  >
                    {service.price}
                  </p>
                </div>
              </Label>
            </div>
          );
        })}
      </RadioGroup>

      {formData.serviceType && (
        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
          <Label className="text-base font-medium">
            How often would you like cleaning?
          </Label>
          <RadioGroup
            value={formData.frequency}
            onValueChange={(value) =>
              setFormData({ ...formData, frequency: value })
            }
            className="grid grid-cols-2 gap-4"
          >
            {["One-time", "Weekly", "Bi-weekly", "Monthly"].map((freq) => {
              const isFreqSelected = formData.frequency === freq.toLowerCase();

              return (
                <div key={freq}>
                  <RadioGroupItem
                    value={freq.toLowerCase()}
                    id={freq}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={freq}
                    className={cn(
                      "flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 relative",
                      isFreqSelected
                        ? "border-green-500 bg-green-50 shadow-lg scale-[1.05] ring-2 ring-green-200"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-md",
                      "active:scale-[0.95]"
                    )}
                  >
                    {freq}
                    {isFreqSelected && (
                      <div className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-green-600 rounded-full">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>
      )}

      {/* Debug info - remove in production */}
      <div className="mt-4 p-3 bg-gray-100 rounded-lg text-sm text-gray-600">
        <strong>Debug:</strong> Selected service:{" "}
        {formData.serviceType || "None"}, Frequency:{" "}
        {formData.frequency || "None"}
      </div>
    </div>
  );
}
