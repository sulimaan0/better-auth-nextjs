"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Calendar,
  Clock,
  CreditCard,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Breadcrumb from "./breadcrumb";
import CalendarPicker from "./calendar-picker";
import TimePicker from "./time-picker";

export default function BookingForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [postcode, setPostcode] = useState("");
  const [formData, setFormData] = useState({
    serviceType: "",
    addOns: [] as string[],
    date: "",
    time: "",
    recurring: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    paymentMethod: "",
    promoCode: "",
  });

  useEffect(() => {
    const savedPostcode = sessionStorage.getItem("postcode");
    if (savedPostcode) {
      setPostcode(savedPostcode);
      setFormData((prev) => ({ ...prev, zipCode: savedPostcode }));
    }
  }, []);

  const steps = [
    {
      number: 1,
      title: "Service Details",
      icon: Calendar,
      completed: currentStep > 1,
    },
    {
      number: 2,
      title: "Date & Time",
      icon: Clock,
      completed: currentStep > 2,
    },
    {
      number: 3,
      title: "Contact & Payment",
      icon: CreditCard,
      completed: false,
    },
  ];

  const serviceTypes = [
    {
      value: "standard",
      label: "Standard Cleaning",
      price: 89,
      description: "Regular maintenance cleaning for your home",
    },
    {
      value: "deep",
      label: "Deep Cleaning",
      price: 149,
      description: "Thorough, detailed cleaning of every corner",
    },
    {
      value: "move-in",
      label: "Move-In/Out",
      price: 199,
      description: "Complete cleaning for moving in or out",
    },
  ];

  const addOnOptions = [
    { value: "fridge", label: "Inside Fridge", price: 25 },
    { value: "oven", label: "Inside Oven", price: 25 },
    { value: "laundry", label: "Laundry Service", price: 30 },
    { value: "windows", label: "Interior Windows", price: 35 },
    { value: "garage", label: "Garage Cleaning", price: 40 },
  ];

  const handleAddOnChange = (addOn: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({ ...prev, addOns: [...prev.addOns, addOn] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        addOns: prev.addOns.filter((item) => item !== addOn),
      }));
    }
  };

  const calculateTotal = () => {
    const baseService = serviceTypes.find(
      (s) => s.value === formData.serviceType
    );
    const basePrice = baseService?.price || 0;
    const addOnPrice = formData.addOns.reduce((total, addOn) => {
      const addOnItem = addOnOptions.find((a) => a.value === addOn);
      return total + (addOnItem?.price || 0);
    }, 0);
    return basePrice + addOnPrice;
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumb currentStep={currentStep} steps={steps} />

      <div className="glass rounded-3xl shadow-2xl overflow-hidden border border-slate-600/30">
        {/* Progress Bar */}
        <div className="bg-slate-800/50 p-8 border-b border-slate-600/30">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentStep >= step.number
                      ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg"
                      : "bg-slate-700 text-slate-400"
                  }`}
                >
                  {step.completed ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-6 h-6" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-20 h-1 mx-3 rounded transition-all duration-300 ${
                      currentStep > step.number
                        ? "bg-gradient-to-r from-violet-600 to-purple-600"
                        : "bg-slate-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <h3 className="text-xl font-semibold text-white">
              {steps[currentStep - 1].title}
            </h3>
            <p className="text-slate-300 mt-1">Step {currentStep} of 3</p>
          </div>
        </div>

        <div className="p-8 lg:p-12">
          {/* Step 1: Service Details */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div>
                <h4 className="text-lg font-semibold text-white mb-6">
                  Choose Your Service
                </h4>
                <div className="grid gap-4">
                  {serviceTypes.map((service) => (
                    <div
                      key={service.value}
                      className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        formData.serviceType === service.value
                          ? "border-violet-500 bg-violet-500/10"
                          : "border-slate-600 hover:border-violet-400 hover:bg-slate-700/30"
                      }`}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          serviceType: service.value,
                        }))
                      }
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="font-semibold text-white text-lg">
                            {service.label}
                          </h5>
                          <p className="text-slate-300 mt-1">
                            {service.description}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-2xl font-bold text-violet-400">
                            £{service.price}
                          </p>
                          <p className="text-sm text-slate-400">per session</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-6">
                  Add-Ons (Optional)
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  {addOnOptions.map((addOn) => (
                    <div
                      key={addOn.value}
                      className="flex items-center space-x-4 p-4 border border-slate-600 rounded-xl hover:bg-slate-700/30 transition-colors"
                    >
                      <Checkbox
                        id={addOn.value}
                        checked={formData.addOns.includes(addOn.value)}
                        onCheckedChange={(checked) =>
                          handleAddOnChange(addOn.value, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={addOn.value}
                        className="flex-1 cursor-pointer"
                      >
                        <span className="font-medium text-white">
                          {addOn.label}
                        </span>
                        <span className="text-violet-400 font-semibold ml-2">
                          +£{addOn.price}
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <CalendarPicker
                selectedDate={formData.date}
                onDateSelect={(date) =>
                  setFormData((prev) => ({ ...prev, date }))
                }
              />

              <TimePicker
                selectedTime={formData.time}
                onTimeSelect={(time) =>
                  setFormData((prev) => ({ ...prev, time }))
                }
                selectedDate={formData.date}
              />

              <div>
                <Label className="text-lg font-semibold text-white mb-4 block">
                  Recurring Service (Optional)
                </Label>
                <Select
                  value={formData.recurring}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, recurring: value }))
                  }
                >
                  <SelectTrigger className="w-full p-4 border-2 border-slate-600 rounded-xl text-lg bg-slate-700/50 text-white">
                    <SelectValue placeholder="One-time service" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem
                      value="weekly"
                      className="text-white hover:bg-slate-600"
                    >
                      Weekly (10% discount)
                    </SelectItem>
                    <SelectItem
                      value="bi-weekly"
                      className="text-white hover:bg-slate-600"
                    >
                      Bi-weekly (5% discount)
                    </SelectItem>
                    <SelectItem
                      value="monthly"
                      className="text-white hover:bg-slate-600"
                    >
                      Monthly
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 3: Contact & Payment */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="name"
                    className="font-semibold text-white text-sm"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="mt-2 p-4 border-2 border-slate-600 rounded-xl focus:border-violet-500 bg-slate-700/50 text-white"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="phone"
                    className="font-semibold text-white text-sm"
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="mt-2 p-4 border-2 border-slate-600 rounded-xl focus:border-violet-500 bg-slate-700/50 text-white"
                    placeholder="07123 456789"
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="email"
                  className="font-semibold text-white text-sm"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="mt-2 p-4 border-2 border-slate-600 rounded-xl focus:border-violet-500 bg-slate-700/50 text-white"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <Label
                  htmlFor="address"
                  className="font-semibold text-white text-sm"
                >
                  Street Address
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  className="mt-2 p-4 border-2 border-slate-600 rounded-xl focus:border-violet-500 bg-slate-700/50 text-white"
                  placeholder="123 High Street"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="city"
                    className="font-semibold text-white text-sm"
                  >
                    City
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, city: e.target.value }))
                    }
                    className="mt-2 p-4 border-2 border-slate-600 rounded-xl focus:border-violet-500 bg-slate-700/50 text-white"
                    placeholder="London"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="zipCode"
                    className="font-semibold text-white text-sm"
                  >
                    Postcode
                  </Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode || postcode}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        zipCode: e.target.value,
                      }))
                    }
                    className="mt-2 p-4 border-2 border-slate-600 rounded-xl focus:border-violet-500 bg-slate-700/50 text-white"
                    placeholder="SW1A 1AA"
                  />
                </div>
              </div>

              <div>
                <Label className="font-semibold text-white text-sm mb-4 block">
                  Payment Method
                </Label>
                <div className="space-y-3">
                  {["Credit Card", "PayPal", "Apple Pay"].map((method) => (
                    <div
                      key={method}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        formData.paymentMethod === method
                          ? "border-violet-500 bg-violet-500/10"
                          : "border-slate-600 hover:border-violet-400 hover:bg-slate-700/30"
                      }`}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          paymentMethod: method,
                        }))
                      }
                    >
                      <span className="font-medium text-white">{method}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label
                  htmlFor="promoCode"
                  className="font-semibold text-white text-sm"
                >
                  Promo Code (Optional)
                </Label>
                <Input
                  id="promoCode"
                  value={formData.promoCode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      promoCode: e.target.value,
                    }))
                  }
                  className="mt-2 p-4 border-2 border-slate-600 rounded-xl focus:border-violet-500 bg-slate-700/50 text-white"
                  placeholder="Enter promo code"
                />
              </div>

              {/* Booking Summary */}
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-600/30">
                <h4 className="font-semibold text-white mb-4 text-lg">
                  Booking Summary
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Service:</span>
                    <span className="font-medium text-white">
                      {
                        serviceTypes.find(
                          (s) => s.value === formData.serviceType
                        )?.label
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Date & Time:</span>
                    <span className="font-medium text-white">
                      {formData.date} at {formData.time}
                    </span>
                  </div>
                  {formData.addOns.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-300">Add-ons:</span>
                      <span className="font-medium text-white">
                        {formData.addOns.length} selected
                      </span>
                    </div>
                  )}
                  <div className="border-t border-slate-600 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-white">
                        Total:
                      </span>
                      <span className="text-2xl font-bold text-violet-400">
                        £{calculateTotal()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12 pt-8 border-t border-slate-600/30">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-8 py-3 rounded-xl border-2 border-slate-600 text-white hover:bg-slate-700/50 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>

            {currentStep < 3 ? (
              <Button
                onClick={nextStep}
                className="flex items-center space-x-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                Complete Booking
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
