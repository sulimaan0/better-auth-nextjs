"use client";

import { useState, useEffect } from "react";
import { Menu, X, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AuthButtons from "@/components/auth-buttons";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Mock login state

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">Scrubly</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-slate-300 hover:text-violet-400 transition-colors font-medium"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("reviews")}
              className="text-slate-300 hover:text-violet-400 transition-colors font-medium"
            >
              Reviews
            </button>
            <a
              href="#"
              className="text-slate-300 hover:text-violet-400 transition-colors font-medium"
            >
              Pricing
            </a>
            <a
              href="#"
              className="text-slate-300 hover:text-violet-400 transition-colors font-medium"
            >
              FAQs
            </a>

            <AuthButtons />
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-700/50 transition-colors text-white"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden glass border-t border-slate-600/30 py-4">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-left text-slate-300 hover:text-violet-400 transition-colors font-medium px-4 py-2"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("reviews")}
                className="text-left text-slate-300 hover:text-violet-400 transition-colors font-medium px-4 py-2"
              >
                Reviews
              </button>
              <a
                href="#"
                className="text-slate-300 hover:text-violet-400 transition-colors font-medium px-4 py-2"
              >
                Pricing
              </a>
              <a
                href="#"
                className="text-slate-300 hover:text-violet-400 transition-colors font-medium px-4 py-2"
              >
                FAQs
              </a>
              <div className="px-4 space-y-2">
                {isLoggedIn && (
                  <Link href="/dashboard">
                    <Button
                      variant="outline"
                      className="w-full border-slate-600 text-slate-300 hover:border-violet-500 hover:text-violet-400 hover:bg-violet-500/10"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                )}
                <Link href="/booking">
                  <Button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-lg">
                    Book Now
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
