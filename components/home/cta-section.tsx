import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-blue-600">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready for a Spotless Home?
        </h2>
        <p className="text-xl text-green-100 mb-8">
          Join thousands of satisfied customers who trust CleanPro for their
          cleaning needs
        </p>
        <Button
          size="lg"
          className="h-14 px-8 text-lg bg-white text-green-600 hover:bg-gray-100"
          asChild
        >
          <Link href="/booking">Book Your Cleaning Today</Link>
        </Button>
      </div>
    </section>
  );
}
