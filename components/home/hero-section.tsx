import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Users, Sparkles, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative py-20 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                ✨ Professional Cleaning Services
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Sparkling Clean Homes,
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                  {" "}
                  Delivered
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-lg">
                Book trusted, vetted cleaners in minutes. Flexible scheduling,
                transparent pricing, and satisfaction guaranteed.
              </p>
            </div>

            {/* Postcode Entry Form - Redesigned */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
              <form className="space-y-3">
                <div className="flex flex-col space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Find cleaners in your area
                  </h3>
                  <p className="text-sm text-gray-500">
                    Enter your postcode to get started
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      placeholder="Enter your postcode"
                      className="h-12 pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 focus:scale-[1.02]"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <MapPin className="h-5 w-5" />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="h-12 px-6 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-200 hover:scale-105 active:scale-95"
                    asChild
                  >
                    <Link href="/booking">Book Now</Link>
                  </Button>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Available in 50+ cities across the UK</span>
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-600"
                  >
                    Instant Booking
                  </Badge>
                </div>
              </form>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Insured & Bonded</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>10,000+ Happy Customers</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <Image
              src="/woman.ivif"
              alt="Professional cleaner at work"
              width={500}
              height={600}
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Sarah M.</p>
                  <p className="text-sm text-gray-600">Professional Cleaner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
