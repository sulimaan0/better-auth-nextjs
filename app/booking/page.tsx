"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  ArrowRight,
  Home,
  MapPin,
  Clock,
  CreditCard,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { BookingProgress } from "@/components/booking/booking-progress";
import { ServiceTypeStep } from "@/components/booking/service-type-step";
import { PropertyDetailsStep } from "@/components/booking/property-details-step";
import { DateTimeStep } from "@/components/booking/date-time-step";
import { PaymentStep } from "@/components/booking/payment-step";
import { Footer } from "@/components/layout/footer";

const steps = [
  { id: 1, title: "Service Type", icon: Home },
  { id: 2, title: "Property Details", icon: MapPin },
  { id: 3, title: "Date & Time", icon: Clock },
  { id: 4, title: "Payment", icon: CreditCard },
];

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    serviceType: "",
    frequency: "",
    bedrooms: "",
    bathrooms: "",
    extras: [],
    date: undefined,
    time: "",
    address: "",
    instructions: "",
    contactInfo: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.serviceType && formData.frequency);
      case 2:
        return !!(formData.bedrooms && formData.bathrooms && formData.address);
      case 3:
        return !!(formData.date && formData.time);
      case 4:
        return !!(
          formData.contactInfo.name &&
          formData.contactInfo.email &&
          formData.contactInfo.phone
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === steps.length) {
        handleSubmit();
      } else {
        nextStep();
      }
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitSuccess(true);
        setBookingId(result.booking.bookingId);

        // Redirect to success page after a short delay
        setTimeout(() => {
          router.push(`/booking/success?id=${result.booking.bookingId}`);
        }, 2000);
      } else {
        setSubmitError(result.error || "Failed to create booking");
      }
    } catch (error) {
      console.error("Booking submission error:", error);
      setSubmitError(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ServiceTypeStep formData={formData} setFormData={setFormData} />
        );
      case 2:
        return (
          <PropertyDetailsStep formData={formData} setFormData={setFormData} />
        );
      case 3:
        return <DateTimeStep formData={formData} setFormData={setFormData} />;
      case 4:
        return <PaymentStep formData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="text-center p-8">
            <CardContent className="space-y-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Booking Confirmed!
                </h1>
                <p className="text-gray-600">
                  Your booking has been successfully created. Your booking ID is{" "}
                  <strong>{bookingId}</strong>
                </p>
              </div>
              <div className="space-y-2">
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="w-full"
                >
                  View My Bookings
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="w-full"
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Header */}
        <BookingProgress currentStep={currentStep} steps={steps} />

        {/* Error Alert */}
        {submitError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-8">{renderStep()}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1 || isSubmitting}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!validateStep(currentStep) || isSubmitting}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            {isSubmitting
              ? "Creating Booking..."
              : currentStep === steps.length
              ? "Complete Booking"
              : "Next"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
