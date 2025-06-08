// components/Navigation.tsx
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { authClient } from "@/auth-client";
import {
  Menu,
  Home,
  Calendar,
  User,
  Phone,
  Star,
  Shield,
  Sparkles,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Book Cleaning", href: "/booking", icon: Calendar },
  { name: "My Dashboard", href: "/dashboard", icon: User },
  { name: "Services", href: "/services", icon: Sparkles },
  { name: "Reviews", href: "/reviews", icon: Star },
  { name: "Contact", href: "/contact", icon: Phone },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
    setMobileMenuOpen(false);

    window.location.reload();
  };

  if (isPending) return <Skeleton className="h-[20px] w-full rounded-full" />;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Scrubly
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-8 mr-10">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 text-sm font-semibold leading-6 text-gray-900 hover:text-green-600"
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA / User Menu */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-4">
          {session ? (
            <div className="flex gap-4">
              <DropdownMenu className="flex justify-center gap-10">
                <DropdownMenuTrigger
                  className="text-xl flex items-center gap-2 hover:text-gray-600
                  "
                >
                  {session.user?.name}
                  <ChevronDown className=" flex-row h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuItem>Subscription</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className=" flex gap-4">
              <Link href="/sign-in">
                <Button className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-2 rounded-lg">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="outline" className="px-6 py-2 rounded-lg">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open main menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80">
              <div className="flex items-center justify-between mb-8">
                <Link href="/" className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    Scrubly
                  </span>
                </Link>
              </div>

              {/* User info in mobile */}
              {session && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg mb-6">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={session.user?.image || "/placeholder.svg"}
                      alt={session.user?.name}
                    />
                    <AvatarFallback>
                      {session.user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">
                      {session.user?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {session.user?.email}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 text-base font-semibold text-gray-900 hover:bg-green-50 hover:text-green-600 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}

                {/* User menu items in mobile */}
                {session && (
                  <div className="border-t pt-4 mt-4 space-y-4">
                    <Button
                      variant="outline"
                      className="w-full flex items-center gap-2 justify-start"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                )}

                {/* Auth buttons for mobile when not logged in */}
                {!session && (
                  <div className="border-t pt-4 mt-4 space-y-4">
                    <Link
                      href="/sign-in"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white">
                        Sign In
                      </Button>
                    </Link>
                    <Link
                      href="sign-up"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button variant="outline" className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
