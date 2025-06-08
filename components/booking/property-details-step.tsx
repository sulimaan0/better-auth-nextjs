"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface PropertyDetailsStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function PropertyDetailsStep({
  formData,
  setFormData,
}: PropertyDetailsStepProps) {
  const extras = [
    { id: "oven", label: "Oven Cleaning", price: "+£15" },
    { id: "fridge", label: "Fridge Cleaning", price: "+£10" },
    { id: "windows", label: "Window Cleaning", price: "+£20" },
    { id: "carpet", label: "Carpet Cleaning", price: "+£25" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Property Details
        </h2>
        <p className="text-gray-600">Tell us about your property</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="bedrooms">Number of Bedrooms</Label>
          <RadioGroup
            value={formData.bedrooms}
            onValueChange={(value) =>
              setFormData({ ...formData, bedrooms: value })
            }
            className="flex gap-2"
          >
            {["1", "2", "3", "4", "5+"].map((num) => {
              const isSelected = formData.bedrooms === num;

              return (
                <div key={num}>
                  <RadioGroupItem
                    value={num}
                    id={`bed-${num}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`bed-${num}`}
                    className={cn(
                      "flex items-center justify-center w-12 h-12 border-2 rounded-lg cursor-pointer transition-all duration-200 relative",
                      isSelected
                        ? "border-green-500 bg-green-50 shadow-lg scale-110 ring-2 ring-green-200"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-md",
                      "active:scale-95"
                    )}
                  >
                    {num}
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

        <div className="space-y-2">
          <Label htmlFor="bathrooms">Number of Bathrooms</Label>
          <RadioGroup
            value={formData.bathrooms}
            onValueChange={(value) =>
              setFormData({ ...formData, bathrooms: value })
            }
            className="flex gap-2"
          >
            {["1", "2", "3", "4+"].map((num) => {
              const isSelected = formData.bathrooms === num;

              return (
                <div key={num}>
                  <RadioGroupItem
                    value={num}
                    id={`bath-${num}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`bath-${num}`}
                    className={cn(
                      "flex items-center justify-center w-12 h-12 border-2 rounded-lg cursor-pointer transition-all duration-200 relative",
                      isSelected
                        ? "border-green-500 bg-green-50 shadow-lg scale-110 ring-2 ring-green-200"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-md",
                      "active:scale-95"
                    )}
                  >
                    {num}
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

      <div className="space-y-4">
        <Label className="text-base font-medium">Add Extra Services</Label>
        <div className="grid md:grid-cols-2 gap-4">
          {extras.map((extra) => {
            const isChecked = formData.extras.includes(extra.id);

            return (
              <div key={extra.id} className="flex items-center space-x-2">
                <Checkbox
                  id={extra.id}
                  checked={isChecked}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData({
                        ...formData,
                        extras: [...formData.extras, extra.id],
                      });
                    } else {
                      setFormData({
                        ...formData,
                        extras: formData.extras.filter((id) => id !== extra.id),
                      });
                    }
                  }}
                  className={cn(
                    "data-[state=checked]:shadow-md transition-all duration-200",
                    isChecked &&
                      "data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  )}
                />
                <Label
                  htmlFor={extra.id}
                  className={cn(
                    "flex-1 cursor-pointer transition-colors duration-200",
                    isChecked ? "text-green-700" : "hover:text-green-600"
                  )}
                >
                  <span className="font-medium">{extra.label}</span>
                  <span className="text-green-600 ml-2">{extra.price}</span>
                </Label>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Property Address</Label>
        <Input
          id="address"
          placeholder="Enter your full address"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          className={cn(
            "transition-all duration-200",
            formData.address && "border-green-500 bg-green-50"
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instructions">Special Instructions (Optional)</Label>
        <Textarea
          id="instructions"
          placeholder="Any specific requirements or access instructions..."
          value={formData.instructions}
          onChange={(e) =>
            setFormData({ ...formData, instructions: e.target.value })
          }
          className={cn(
            "transition-all duration-200",
            formData.instructions && "border-green-500 bg-green-50"
          )}
        />
      </div>

      {/* Debug info - remove in production */}
      <div className="mt-4 p-3 bg-gray-100 rounded-lg text-sm text-gray-600">
        <strong>Debug:</strong> Bedrooms: {formData.bedrooms || "None"},
        Bathrooms: {formData.bathrooms || "None"}, Extras:{" "}
        {formData.extras.length > 0 ? formData.extras.join(", ") : "None"}
      </div>
    </div>
  );
}
