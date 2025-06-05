"use client";

import type React from "react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Star,
  Shield,
  Clock,
  MapPin,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const { session } = useAuth();
  let userName = session?.user?.name || "Guest";
  const [postcode, setPostcode] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (postcode.trim()) {
      sessionStorage.setItem("postcode", postcode);
      router.push("/booking");
    }
  };
  if (!session) {
    userName = "Guest";
  }
  return (
    <section className="pt-20 pb-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Professional{" "}
                <span className="gradient-text">Home Cleaning</span> Made Simple
              </h1>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Welcome, {userName}!
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed max-w-xl">
                Trusted, vetted cleaners ready to make your home spotless. Book
                in minutes, relax for hours.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-violet-400" />
                <span className="text-sm font-medium text-slate-300">
                  Insured & Bonded
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-medium text-slate-300">
                  4.9/5 Rating
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium text-slate-300">
                  Same Day Available
                </span>
              </div>
            </div>

            {/* Postcode Input Form */}
            <div className="glass p-6 rounded-2xl shadow-2xl border border-slate-600/30 max-w-md mx-auto lg:mx-0">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="postcode"
                    className="block text-sm font-medium text-slate-200 mb-2"
                  >
                    Enter your postcode to get started
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="postcode"
                      type="text"
                      placeholder="e.g. SW1A 1AA"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      className="pl-10 h-12 text-lg bg-slate-700/50 border-slate-600 focus:border-violet-500 focus:ring-violet-500 text-white placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white h-12 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </form>
              <p className="text-xs text-slate-400 mt-3 text-center">
                Check availability in your area • No commitment required
              </p>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative z-10 glass p-8 rounded-3xl shadow-2xl border border-slate-600/30 transform hover:scale-105 transition-transform duration-300">
              <img
                src="/placeholder.svg?height=400&width=500"
                alt="Professional cleaner in a modern, spotless home"
                className="w-full h-80 object-cover rounded-2xl"
              />
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white p-3 rounded-full shadow-lg">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>

            {/* Floating testimonial card */}
            <div className="absolute -bottom-6 -left-6 glass p-6 rounded-2xl shadow-2xl max-w-xs z-20 border border-slate-600/30">
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src="/placeholder.svg?height=40&width=40"
                  alt="Happy customer"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-white text-sm">Sarah M.</p>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                "Absolutely fantastic service! My house has never been cleaner."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
