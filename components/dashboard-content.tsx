"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  XCircle,
  User,
  CreditCard,
  Settings,
  Bell,
} from "lucide-react";
import Link from "next/link";

export default function DashboardContent() {
  const [activeTab, setActiveTab] = useState("bookings");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock user data
  const user = {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+44 7123 456789",
    address: "123 High Street, London, SW1A 1AA",
    memberSince: "January 2024",
    totalBookings: 12,
    totalSpent: 1248,
  };

  // Mock bookings data
  const bookings = [
    {
      id: "BK001",
      service: "Deep Cleaning",
      date: "2024-01-15",
      time: "10:00 AM",
      duration: "3 hours",
      cleaner: "Emma Thompson",
      cleanerRating: 4.9,
      status: "completed",
      price: 149,
      address: "123 High Street, London",
      addOns: ["Inside Oven", "Interior Windows"],
      notes: "Please focus on the kitchen and bathrooms",
      rating: 5,
      review: "Excellent service! Emma was thorough and professional.",
    },
    {
      id: "BK002",
      service: "Standard Cleaning",
      date: "2024-01-22",
      time: "2:00 PM",
      duration: "2 hours",
      cleaner: "James Wilson",
      cleanerRating: 4.8,
      status: "upcoming",
      price: 89,
      address: "123 High Street, London",
      addOns: ["Inside Fridge"],
      notes: "Keys under the mat",
    },
    {
      id: "BK003",
      service: "Move-In Cleaning",
      date: "2024-01-08",
      time: "9:00 AM",
      duration: "4 hours",
      cleaner: "Lisa Chen",
      cleanerRating: 4.9,
      status: "cancelled",
      price: 199,
      address: "456 Oak Avenue, London",
      addOns: ["Garage Cleaning"],
      notes: "New apartment, needs thorough cleaning",
    },
    {
      id: "BK004",
      service: "Standard Cleaning",
      date: "2024-01-29",
      time: "11:00 AM",
      duration: "2 hours",
      cleaner: "To be assigned",
      cleanerRating: null,
      status: "pending",
      price: 89,
      address: "123 High Street, London",
      addOns: [],
      notes: "",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "upcoming":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "pending":
        return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "cancelled":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "upcoming":
        return <Clock className="w-4 h-4" />;
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.cleaner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || booking.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const tabs = [
    { id: "bookings", label: "My Bookings", icon: Calendar },
    { id: "profile", label: "Profile", icon: User },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user.name}!
        </h1>
        <p className="text-slate-300">
          Manage your bookings and account settings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass p-6 rounded-2xl border border-slate-600/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Bookings</p>
              <p className="text-2xl font-bold text-white">
                {user.totalBookings}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-violet-400" />
          </div>
        </div>
        <div className="glass p-6 rounded-2xl border border-slate-600/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Spent</p>
              <p className="text-2xl font-bold text-white">
                £{user.totalSpent}
              </p>
            </div>
            <CreditCard className="w-8 h-8 text-violet-400" />
          </div>
        </div>
        <div className="glass p-6 rounded-2xl border border-slate-600/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Member Since</p>
              <p className="text-2xl font-bold text-white">
                {user.memberSince}
              </p>
            </div>
            <Star className="w-8 h-8 text-violet-400" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="glass rounded-2xl border border-slate-600/30 mb-8">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-violet-400 border-b-2 border-violet-400 bg-violet-400/5"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/30"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "bookings" && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="glass p-6 rounded-2xl border border-slate-600/30">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-violet-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-700/50 border border-slate-600 text-white rounded-lg px-4 py-2 focus:border-violet-500 focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Link href="/booking">
                  <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    New Booking
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="glass p-6 rounded-2xl border border-slate-600/30 hover:border-violet-500/30 transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            {booking.service}
                          </h3>
                          <span
                            className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {getStatusIcon(booking.status)}
                            <span className="capitalize">{booking.status}</span>
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm">
                          Booking ID: {booking.id}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-violet-400">
                          £{booking.price}
                        </p>
                        <p className="text-slate-400 text-sm">
                          {booking.duration}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-slate-300">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>
                          {new Date(booking.date).toLocaleDateString("en-GB", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-300">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-300">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{booking.address}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-300">
                        <User className="w-4 h-4 text-slate-400" />
                        <span>{booking.cleaner}</span>
                        {booking.cleanerRating && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-amber-400 fill-current" />
                            <span className="text-amber-400">
                              {booking.cleanerRating}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {booking.addOns.length > 0 && (
                      <div className="mb-4">
                        <p className="text-slate-400 text-sm mb-2">Add-ons:</p>
                        <div className="flex flex-wrap gap-2">
                          {booking.addOns.map((addOn) => (
                            <span
                              key={addOn}
                              className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-sm border border-slate-600"
                            >
                              {addOn}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {booking.rating && (
                      <div className="mb-4 p-4 bg-slate-800/50 rounded-lg border border-slate-600/30">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-slate-300 text-sm">
                            Your Rating:
                          </span>
                          <div className="flex">
                            {[...Array(booking.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-4 h-4 text-amber-400 fill-current"
                              />
                            ))}
                          </div>
                        </div>
                        {booking.review && (
                          <p className="text-slate-300 text-sm italic">
                            "{booking.review}"
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-row lg:flex-col gap-2">
                    <Link
                      href={`/booking/${booking.id}`}
                      className="flex-1 lg:flex-none"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-slate-600 text-slate-300 hover:border-violet-500 hover:text-violet-400 hover:bg-violet-500/10"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                    {booking.status === "upcoming" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 lg:flex-none border-slate-600 text-slate-300 hover:border-blue-500 hover:text-blue-400 hover:bg-blue-500/10"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Reschedule
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 lg:flex-none border-slate-600 text-slate-300 hover:border-red-500 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBookings.length === 0 && (
            <div className="glass p-12 rounded-2xl border border-slate-600/30 text-center">
              <Calendar className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No bookings found
              </h3>
              <p className="text-slate-400 mb-6">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "You haven't made any bookings yet"}
              </p>
              <Link href="/booking">
                <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Book Your First Cleaning
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="glass p-8 rounded-2xl border border-slate-600/30">
          <h2 className="text-2xl font-bold text-white mb-6">
            Profile Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              <Input
                value={user.name}
                className="bg-slate-700/50 border-slate-600 text-white focus:border-violet-500"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <Input
                value={user.email}
                className="bg-slate-700/50 border-slate-600 text-white focus:border-violet-500"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Phone
              </label>
              <Input
                value={user.phone}
                className="bg-slate-700/50 border-slate-600 text-white focus:border-violet-500"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Address
              </label>
              <Input
                value={user.address}
                className="bg-slate-700/50 border-slate-600 text-white focus:border-violet-500"
                readOnly
              />
            </div>
          </div>
          <div className="mt-6">
            <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      )}

      {/* Payment Tab */}
      {activeTab === "payment" && (
        <div className="glass p-8 rounded-2xl border border-slate-600/30">
          <h2 className="text-2xl font-bold text-white mb-6">
            Payment Methods
          </h2>
          <div className="space-y-4">
            <div className="p-4 border border-slate-600 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-6 h-6 text-violet-400" />
                  <div>
                    <p className="text-white font-medium">
                      •••• •••• •••• 4242
                    </p>
                    <p className="text-slate-400 text-sm">Expires 12/26</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-400/10 text-emerald-400 rounded-full text-sm border border-emerald-400/20">
                  Default
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="glass p-8 rounded-2xl border border-slate-600/30">
          <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 border border-slate-600 rounded-lg">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-violet-400" />
                <div>
                  <p className="text-white font-medium">Email Notifications</p>
                  <p className="text-slate-400 text-sm">
                    Receive booking confirmations and reminders
                  </p>
                </div>
              </div>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 border border-slate-600 rounded-lg">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-violet-400" />
                <div>
                  <p className="text-white font-medium">SMS Notifications</p>
                  <p className="text-slate-400 text-sm">
                    Get text updates about your bookings
                  </p>
                </div>
              </div>
              <input type="checkbox" className="toggle" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
