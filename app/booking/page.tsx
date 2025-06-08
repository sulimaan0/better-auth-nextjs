"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  ArrowRight,
  Home,
  MapPin,
  Clock,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader2,
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
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const router = useRouter();

  const [formData, setFormData] = useState({
    serviceType: "",
    frequency: "",
    bedrooms: "",
    bathrooms: "",
    extras: [] as string[],
    date: null as Date | null,
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

  const validateStep = (
    step: number
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    switch (step) {
      case 1:
        if (!formData.serviceType) errors.push("Please select a service type");
        if (!formData.frequency) errors.push("Please select a frequency");
        break;
      case 2:
        if (!formData.bedrooms) errors.push("Please select number of bedrooms");
        if (!formData.bathrooms)
          errors.push("Please select number of bathrooms");
        if (!formData.address.trim()) errors.push("Please enter your address");
        break;
      case 3:
        if (!formData.date) errors.push("Please select a date");
        if (!formData.time) errors.push("Please select a time");
        // Check if date is in the future
        if (formData.date && formData.date <= new Date()) {
          errors.push("Please select a future date");
        }
        break;
      case 4:
        if (!formData.contactInfo.name.trim())
          errors.push("Please enter your name");
        if (!formData.contactInfo.email.trim())
          errors.push("Please enter your email");
        if (!formData.contactInfo.phone.trim())
          errors.push("Please enter your phone number");

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (
          formData.contactInfo.email &&
          !emailRegex.test(formData.contactInfo.email)
        ) {
          errors.push("Please enter a valid email address");
        }

        // Basic phone validation (UK format)
        const phoneRegex = /^(\+44|0)[1-9]\d{8,10}$/;
        if (
          formData.contactInfo.phone &&
          !phoneRegex.test(formData.contactInfo.phone.replace(/\s/g, ""))
        ) {
          errors.push("Please enter a valid UK phone number");
        }
        break;
      default:
        break;
    }

    return { isValid: errors.length === 0, errors };
  };

  const handleNext = () => {
    const validation = validateStep(currentStep);
    setValidationErrors(validation.errors);

    if (validation.isValid) {
      if (currentStep === steps.length) {
        handleSubmit();
      } else {
        nextStep();
      }
    } else {
      // Show validation errors
      toast({
        title: "Please fix the following errors:",
        description: validation.errors.join(", "),
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError("");
    setValidationErrors([]);

    // Final validation
    const validation = validateStep(currentStep);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Submitting booking with data:", formData);

      // Prepare data for API
      const submissionData = {
        ...formData,
        date: formData.date?.toISOString(), // Convert Date to string
        extras: formData.extras || [],
      };

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      console.log("API Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API Response:", result);

      if (result.success) {
        setSubmitSuccess(true);
        setBookingId(result.booking.bookingId);

        toast({
          title: "Booking Confirmed!",
          description: `Your booking ID is ${result.booking.bookingId}`,
        });

        // Redirect to success page after a short delay
        setTimeout(() => {
          router.push(`/booking/success?id=${result.booking.bookingId}`);
        }, 2000);
      } else {
        console.error("Booking failed:", result.error);
        setSubmitError(result.error || "Failed to create booking");

        toast({
          title: "Booking Failed",
          description: result.error || "Failed to create booking",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Booking submission error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Network error. Please check your connection and try again.";

      setSubmitError(errorMessage);

      toast({
        title: "Booking Failed",
        description: errorMessage,
        variant: "destructive",
      });
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

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                {validationErrors.map((error, index) => (
                  <p key={index}>• {error}</p>
                ))}
              </div>
            </AlertDescription>
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
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating Booking...
              </>
            ) : currentStep === steps.length ? (
              "Complete Booking"
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
